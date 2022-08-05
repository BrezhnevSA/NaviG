import React, { Component } from 'react';
import { connect }          from "react-redux";
import {
    Form,
    FormGroup,
}                           from 'reactstrap';
import { AsyncTypeahead, Menu, MenuItem }   from 'react-bootstrap-typeahead';
import LocalizedStrings     from 'react-localization';
import { Link }             from 'react-router-dom';

import {
    searchEmployeesOnPlace,
    searchEmployeesWithNoPlace,
    searchRoomsAndLocations,
    searchObjectsAndDesks,
    searchCostcenters,
    searchProjects
}                           from '../../actions/SearchActions';
import { 
    selectNewElement,
    initFloorDetails 
}                           from '../../actions/FloorActions';
import { getFloors }        from '../../actions/FloorsActions';
import { Redirect } from 'react-router-dom';
import styled               from 'styled-components';

let strings = new LocalizedStrings({
    en:{
        search:         "Search",
        searching:      "Searching",
        noresults:      "No results found",
        dispaddresults: "Display additional results"
    },
    ru: {
        search:         "Поиск",
        searching:      "Идет поиск",
        noresults:      "Не найдено ни одного совпадения",
        dispaddresults: "Показать ещё результаты"
    },
    de: {
        search:         "Suche",
        searching:      "Suchen",
        noresults:      "Keine Ergebnisse gefunden",
        dispaddresults: "Zusätzliche Ergebnisse anzeigen"
    }
});

const PER_PAGE          = 20;
const STATUSES          = [ "REGULAR" ];
const LOCATION_TYPE_IDS = [ 0 ];
const OBJECT_TYPE_IDS   = [ 0 ]; 

const InputWrapper = styled.div`
    transition: all .15s;
    visibility: ${props => (props.expanded ? 'visible' : 'hidden')};
    padding-left: ${props => (props.expanded ? 'inherit' : 0)}px;
    padding-right: ${props => (props.expanded ? 'inherit' : 0)}px;
    width: ${props => (props.expanded ? 190 : 0)}px;
`;

const mapStateToProps = state => {
    return {
        floor:  state.floor,
        floors: state.floors,
        search: state.search
    };
};

function mapDispatchToProps(dispatch) {
    return {
        searchEmployeesOnPlace:     (query, page, statuses) => dispatch(searchEmployeesOnPlace(query, page, statuses)),
        searchEmployeesWithNoPlace: (query, page, statuses) => dispatch(searchEmployeesWithNoPlace(query, page, statuses)),
        searchRoomsAndLocations:    (query, page, location_type_ids) => dispatch(searchRoomsAndLocations(query, page, location_type_ids)),
        searchObjectsAndDesks:      (query, page, object_type_ids) => dispatch(searchObjectsAndDesks(query, page, object_type_ids)),
        selectNewElement:           (object) => dispatch(selectNewElement(object)),
        initFloorDetails:           () => dispatch(initFloorDetails()),
        getFloors:                  (id) => dispatch(getFloors()),
        searchCostcenters:          (query, page, with_text) => dispatch(searchCostcenters(query, page, with_text)),
        searchProjects:             (query, page) => dispatch(searchProjects(query, page))
    };
}

class Search extends Component {

    _cache = {};
    cachedQuery = { options: [], page: 1 };

    constructor(props) {
        super(props)

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
        
        this.state = {             
            isLoading: false,
            options: [],
            query: '',
            firstLoad: true,
            submit: false,
            // expanded: false
            expanded: true
        };

        this.updateSearch = this.updateSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onToggle     = this.onToggle.bind(this);

        this._typeahead = React.createRef();
    }

    componentDidMount() { }

    componentDidUpdate(prevProps) {
        let { search, user } = this.props;   
        
        if (prevProps.user && prevProps.user.isFetching && !user.isFetching && user &&
            user.user && user.user.rights && user.user.rights.length > 0) {
            this.props.getFloors();
        }   

        // different options sources for search autocomplete
        if (search.foundEmployeesOnPlace !== prevProps.search.foundEmployeesOnPlace
            || search.foundEmployeesWithNoPlace !== prevProps.search.foundEmployeesWithNoPlace
            || search.foundLocations !== prevProps.search.foundLocations
            || search.foundObjects !== prevProps.search.foundObjects
            || search.costcenters !== prevProps.search.costcenters
            || search.projects !== prevProps.search.projects) {
            let options = 
                search.foundEmployeesOnPlace && search.foundEmployeesOnPlace.length > 0
                    ? [ ...search.foundEmployeesOnPlace ]
                    : [];
            options = 
                search.projects && search.projects.length > 0
                    ? [ ...options, ...search.projects ]
                    : options;
            options = 
                search.costcenters && search.costcenters.length > 0
                    ? [ ...options, ...search.costcenters ]
                    : options;
            options = 
                search.foundEmployeesWithNoPlace && search.foundEmployeesWithNoPlace.length > 0
                    ? [ ...options, ...search.foundEmployeesWithNoPlace ]
                    : options;
            options = 
                search.foundLocations && search.foundLocations.length > 0
                    ? [ ...options, ...search.foundLocations ]
                    : options;
            options = 
                search.foundObjects && search.foundObjects.length > 0
                    ? [ ...options, ...search.foundObjects ]
                    : options;

            this.setState({
                isLoading: false,
                options:   options
            }, () => {
                this.updateSearch();
            });
        }

        // if (this.state.expanded) {
        //     setTimeout(() => this._typeahead.current.focus(), 500);            
        // }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    updateSearch() {
        let { search }  = this.props;
        const { query } = this.state;
        let options     = this.cachedQuery.options;

        options = search.foundEmployeesOnPlace
            ? options.concat(search.foundEmployeesOnPlace)
            : this.cachedQuery.options;
        options = search.foundEmployeesWithNoPlace
            ? options.concat(search.foundEmployeesWithNoPlace)
            : options;
        options = search.projects
            ? options.concat(search.projects)
            : options;
        options = search.costcenters
            ? options.concat(search.costcenters)
            : options;
        options = search.foundLocations
            ? options.concat(search.foundLocations)
            : options;
        options = search.foundObjects
            ? options.concat(search.foundObjects)
            : options;

        const page = this.cachedQuery.page;

        this.setState({
            isLoading: false,
            options: options,
        });
    }

    handleChange(e) {
        if (!!this._typeahead) {
            if (!!this._typeahead.current) {
                if (typeof this._typeahead.current.clear === 'function') {
                    this._typeahead.current.clear();
                }
                if (!!this._typeahead.current.state) {
                    this._typeahead.current.state.selected = [];
                }
                
            }
        }
    }

    _handleInputChange = query => {
        this.setState({ query });

        if (this.state.submit) {
            this.setState({
                submit: false
            });
        }
    };
    
    _handlePagination = (e, shownResults) => {
        const { query } = this.state;

        // Don't make another request if:
        // - the cached results exceed the shown results
        // - we've already fetched all possible results
        if (
            this.cachedQuery.options.length > shownResults ||
            this.cachedQuery.options.length === this.cachedQuery.total_count
        ) {
            return;
        }

        this.setState({ isLoading: true });

        const page = cachedQuery.page + 1;
        
        this.props.searchEmployeesOnPlace(query, page, STATUSES);
        this.props.searchCostcenters(query, page, true);
        this.props.searchProjects(query, page);
        this.props.searchEmployeesWithNoPlace(query, page, STATUSES);
        this.props.searchRoomsAndLocations(query, page, LOCATION_TYPE_IDS);
        this.props.searchObjectsAndDesks(query, page, OBJECT_TYPE_IDS);
    };
    
    _handleSearch = query => {
        this.setState({ isLoading: true });

        this.props.searchEmployeesOnPlace(query, 1, STATUSES);
        this.props.searchCostcenters(query, 1, true);
        this.props.searchProjects(query, 1);
        this.props.searchEmployeesWithNoPlace(query, 1, STATUSES);
        this.props.searchRoomsAndLocations(query, 1, LOCATION_TYPE_IDS);
        this.props.searchObjectsAndDesks(query, 1, OBJECT_TYPE_IDS);
    };

    keyDown = e => {
        if (e.key === "Enter") {
            this.setState({
                submit: true
            });
        }
    };

    onToggle() {
        this.setState(state => ({
            ...state,
            expanded: !state.expanded
        }));
    }
    
    render() {
        const { expanded } = this.state;
        return (
            <>
                { this.state.submit ? <Redirect to={`/search?q=${this.state.query}`} /> : <></> }

                <div id="searchFormArea">
                    <InputWrapper id="searchFormWrapper" expanded={expanded}>
                        <Form className="top-search-form">
                            <FormGroup>
                                <AsyncTypeahead
                                    {...this.state}
                                    onKeyDown={ this.keyDown }
                                    maxResults={ PER_PAGE - 1 }
                                    minLength={ 2 }
                                    labelKey="preview"
                                    id="searchGlobal"
                                    options={ this.state.options }
                                    placeholder={ strings.search }
                                    ref={ this._typeahead }
                                    onInputChange={ this._handleInputChange }
                                    onPaginate={ this._handlePagination }
                                    onSearch={ this._handleSearch }
                                    emptyLabel={ strings.noresults }
                                    promptText={ strings.searching }
                                    searchText={ strings.searching }
                                    paginationText={ strings.dispaddresults }
                                    onChange={(e) => this.handleChange(e)}
                                    renderMenu={(results, menuProps) => {
                                        let data_fetching = this.props.search.projectsFetching || this.props.search.costcentersFetching || 
                                            this.props.search.foundObjectsFetching || this.props.search.foundLocationsFetching ||
                                            this.props.search.foundEmployeesWithNoPlaceFethcing || this.props.search.foundEmployeesOnPlaceFetching;
                                        if (data_fetching === undefined) { data_fetching = true }
                                        return(
                                        <Menu {...menuProps}>
                                        { data_fetching || ( this.state.options.length > 0 && results.length === 0 )
                                        ? <MenuItem><span>{strings.searching}</span></MenuItem>
                                        : results.map((result, index) => (
                                            <MenuItem option={result} position={index}>
                                                <Link 
                                                    to={ result.search_id && result.search_id.split('_')[1] === "empNoPlace" 
                                                        ? `/profile/${result.id}`
                                                        : result.search_id && (result.search_id.split('_')[1] === "empOnPlace" || 
                                                        result.search_id.split('_')[1] === "empOnDSPlace" ||
                                                        result.search_id.split('_')[1] === "object")
                                                            ? result.object_item_boooking_id && result.floor_boooking_id
                                                                ? `/floors/${result.floor_boooking_id}?object_id=${result.object_item_boooking_id}&search=true`
                                                                : `/floors/${result.floor_id}?object_id=${result.object_item_id}&search=true`
                                                            : result.search_id && result.search_id.split('_')[1] === "location" 
                                                                ? `/floors/${result.floor_id}?location_id=${result.id}&search=true`
                                                                : result.search_id && result.search_id.split('_')[1] === "costcenter" 
                                                                    ? `/employees_in/${result.id}?page_type=costcenters`
                                                                    : result.search_id && result.search_id.split('_')[1] === "project" ? 
                                                                    `/employees_in/${result.id}?page_type=projects`
                                                                    : ''
                                                    } 
                                                    key={result.search_id}
                                                >
                                                    <span>{result.preview}</span> 
                                                </Link> 
                                            </MenuItem>
                                        ))}
                                        </Menu>
                                    )}}
                                    paginate
                                    useCache={false}
                                />
                            </FormGroup>
                        </Form>
                    </InputWrapper>
                    {/* <div id="searchToggleIcon">
                        <span /onClick={() => this.onToggle()} className="header-icon">
                            <svg width="16" height="20" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="6.4896" cy="6.3425" r="4.93952" stroke="#383838" strokeWidth="1.7"/>
                                <line x1="15.099" y1="16.154" x2="9.30953" y2="10.3645" stroke="#383838" strokeWidth="1.7"/>
                            </svg>
                        </span>
                    </div> */}
                </div>

                
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Search);