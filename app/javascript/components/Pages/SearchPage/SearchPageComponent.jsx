import React, { Component } from 'react';
import { connect } from "react-redux";
import { toast } from 'react-toastify';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import LocalizedStrings from 'react-localization';
import * as settings from '../../../constants/AppSettings';
import BootstrapTable from 'react-bootstrap-table-next';
import { searchStats, searchDetailsResults } from '../../../actions/SearchActions';
import { Link }             from 'react-router-dom';
import paginationFactory    from 'react-bootstrap-table2-paginator';
import { headerStyles, sortCaretStyle } from '../../../constants/Styles';

let strings = new LocalizedStrings({
    en:{
        emp_count_label: "Employees",
        loc_count_label: "Locations",
        obj_count_label: "Objects",
        dsk_count_label: "Desks",
        prj_count_label: "Projects",
        cst_count_label: "Costcenters",
        name: "Name",
        showing: "Showing",
        from: "from",
        to: "to",
        of: "of",
        results: "Results",
        all: "All",
        no_results: "No results"
    },
    ru: {
        emp_count_label: "Сотрудники",
        loc_count_label: "Помещения",
        obj_count_label: "Объекты",
        dsk_count_label: "Столы",
        prj_count_label: "Проекты",
        cst_count_label: "МВЗ",
        name: "Имя/Название",
        showing: "Отображено",
        from: "с",
        to: "по",
        of: "из",
        results: "всего",
        all: "Все",
        no_results: "Ничего не найдено"
    },
    de: {
        emp_count_label: "Angestellte",
        loc_count_label: "Standorte",
        obj_count_label: "Objekte",
        dsk_count_label: "Desks",
        prj_count_label: "Projekte",
        cst_count_label: "Costcenters",
        name: "Name",
        showing: "Zeigen",
        from: "von",
        to: "zu",
        of: "von",
        results: "Ergebnisse",
        all: "Alles",
        no_results: "Keine Ergebnisse"
    }
});

class SearchPage extends Component {

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        let searchQuery = '';
        const parsed_params = queryString.parse(this.props.location.search);
        if (!!parsed_params['q']) {
            searchQuery = decodeURI(parsed_params['q']);
        }
        
        this.state = {
            searchQuery: searchQuery,
            emp_count: 0,
            loc_count: 0,
            obj_count: 0,
            dsk_count: 0,
            prj_count: 0,
            cst_count: 0,
            target: settings.DEFAULT_SEARCH_TARGET,
            results: []
        }

    }

    componentDidMount() {
        
        this.props.searchStats(this.state.searchQuery);
        this.props.searchDetailsResults(this.state.target, this.state.searchQuery);
    }

    componentDidUpdate(prevProps) {
        
        if (this.props.search !== prevProps.search) {
            
            if (!!this.props.search.stats && (
                (this.state.emp_count != this.props.search.stats.emp_count) ||
                (this.state.loc_count != this.props.search.stats.loc_count) ||
                (this.state.obj_count != this.props.search.stats.obj_count) ||
                (this.state.dsk_count != this.props.search.stats.dsk_count) ||
                (this.state.prj_count != this.props.search.stats.prj_count) ||
                (this.state.cst_count != this.props.search.stats.cst_count)
            )) {
                this.setState({
                    emp_count: this.props.search.stats.emp_count,
                    loc_count: this.props.search.stats.loc_count,
                    obj_count: this.props.search.stats.obj_count,
                    dsk_count: this.props.search.stats.dsk_count,
                    prj_count: this.props.search.stats.prj_count,
                    cst_count: this.props.search.stats.cst_count
                }, () => {
                    if (this.state.emp_count == 0) {
                        if (this.state.loc_count != 0) {
                            this.changeSearchTarget('locations');
                        }
                        else if (this.state.obj_count != 0) {
                            this.changeSearchTarget('objects');
                        }
                        else if (this.state.dsk_count != 0) {
                            this.changeSearchTarget('desks');
                        }
                        else if (this.state.prj_count != 0) {
                            this.changeSearchTarget('projects');
                        }
                        else if (this.state.cst_count != 0) {
                            this.changeSearchTarget('costcenters');
                        }
                    }
                    else {
                        this.changeSearchTarget('employees');
                    }
                });

            }
            if (this.props.search.details_results !== prevProps.search.details_results) {
                this.setState({
                    results: this.props.search.details_results,
                });
            }
        }

        let searchQuery = '';
        const parsed_params = queryString.parse(this.props.location.search);
        if (!!parsed_params['q']) {
            searchQuery = decodeURI(parsed_params['q']);
        }

        if (searchQuery != this.state.searchQuery) {
            this.setState({
                searchQuery: searchQuery,
            }, () => {
                this.props.searchStats(this.state.searchQuery);
                this.props.searchDetailsResults(this.state.target, this.state.searchQuery);
            });
        }
        
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    langChange = (countryCode) => {
        this.props.langChange(countryCode);
    };

    changeSearchTarget(target) {

        this.setState({
            target: target,
        }, () => {
            this.props.searchDetailsResults(this.state.target, this.state.searchQuery);
        });
    }

    render() {

        const columns = [
            {
                dataField: 'name',
                text:      strings.name,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex) => {

                    if (this.state.target == 'employees') {
                        return <Link to={`/profile/${row.id}`}>{ cell }</Link>
                    }
                    if (this.state.target == 'locations') {
                        return <Link to={`/floors/${row.floor_id}?location_id=${row.id}&search=true`}>{ cell }</Link>
                    }
                    if (this.state.target == 'objects') {
                        return <Link to={`/floors/${row.floor_id}?object_id=${row.id}&search=true`}>{ cell }</Link>
                    }
                    if (this.state.target == 'desks') {
                        return <Link to={`/floors/${row.floor_id}?object_id=${row.id}&search=true`}>{ cell }</Link>
                    }
                    if (this.state.target == 'projects') {
                        return <Link to={`/employees_in/${row.id}?page_type=projects`}>{ cell }</Link>
                    }
                    if (this.state.target == 'costcenters') {
                        return <Link to={`/employees_in/${row.id}?page_type=costcenters`}>{ cell }</Link>
                    }
                    
                }
            }, {
                dataField: 'id',
                text:      'ID',
                hidden:     true
            },
        ];

        const customTotal = (from, to, size) => (
            <span className="react-bootstrap-table-pagination-total">
              { strings.showing } { strings.from } { from } { strings.to } { to } { strings.of } { size } { strings.results }
            </span>
        );

        const options = {
            showTotal:               true,
            paginationTotalRenderer: customTotal,
            withFirstAndLast:        true,
            sizePerPageList:         [{
                text: '10', value: 10
            }, {
                text: '15', value: 15
            }, {
                text: '30', value: 30
            }, {
                text: strings.all, value: this.props.search.details_results ? this.props.search.details_results.length : 0
            }]
        };

        const defaultSorted = [{
            dataField: 'name',
            order:     'asc'
        }];

        return (
            <>
                <div className="container-fluid overflow-auto with-actions">
                    <div className="container page-title-wrapper" >
                        <h1 id="page-title">{ strings.searchresults }</h1>
                    </div>
                    <div className="container neomorph-card results-page ">
                        <div className="row neomorph-card-inside container search-results-page" >
                            
                            <div className="search-sidebar col-md-2">
                                <div className={`search-stat-line ${this.state.target == 'employees' ? "active" : "inactive"}`}
                                    onClick={() => { this.changeSearchTarget('employees'); }} >
                                    <span className="stat-name">
                                        { strings.emp_count_label }
                                    </span>
                                    <span className="stat-count">
                                        { this.state.emp_count }
                                    </span>
                                </div>

                                <div className={`search-stat-line ${this.state.target == 'locations' ? "active" : "inactive"}`}
                                    onClick={() => { this.changeSearchTarget('locations'); }} >
                                    <span className="stat-name">
                                        { strings.loc_count_label }
                                    </span>
                                    <span className="stat-count">
                                        { this.state.loc_count }
                                    </span>
                                </div>

                                <div className={`search-stat-line ${this.state.target == 'objects' ? "active" : "inactive"}`}
                                    onClick={() => { this.changeSearchTarget('objects'); }} >
                                    <span className="stat-name">
                                        { strings.obj_count_label }
                                    </span>
                                    <span className="stat-count">
                                        { this.state.obj_count }
                                    </span>
                                </div>

                                <div className={`search-stat-line ${this.state.target == 'desks' ? "active" : "inactive"}`}
                                    onClick={() => { this.changeSearchTarget('desks'); }} >
                                    <span className="stat-name">
                                        { strings.dsk_count_label }
                                    </span>
                                    <span className="stat-count">
                                        { this.state.dsk_count }
                                    </span>
                                </div>

                                <div className={`search-stat-line ${this.state.target == 'projects' ? "active" : "inactive"}`}
                                    onClick={() => { this.changeSearchTarget('projects'); }} >
                                    <span className="stat-name">
                                        { strings.prj_count_label }
                                    </span>
                                    <span className="stat-count">
                                        { this.state.prj_count }
                                    </span>
                                </div>

                                <div className={`search-stat-line ${this.state.target == 'costcenters' ? "active" : "inactive"}`}
                                    onClick={() => { this.changeSearchTarget('costcenters'); }} >
                                    <span className="stat-name">
                                        { strings.cst_count_label }
                                    </span>
                                    <span className="stat-count">
                                        { this.state.cst_count }
                                    </span>
                                </div>
                            </div>
                            <div className="search-results col-md-10">
                                { this.props.search.details_results && this.props.search.details_results.length > 0 ?
                                    <div className="default-table-style-container table_custom">
                                        <BootstrapTable
                                            keyField='id'
                                            data={ this.props.search.details_results  }
                                            columns={ columns }
                                            pagination={ paginationFactory(options) }
                                            defaultSorted={ defaultSorted } 
                                            rowStyle={ (row, rowIndex) => {
                                                return { backgroundColor: rowIndex % 2 == 0 ? "#ededed" : "white" };
                                            } }
                                        />
                                    </div>    
                                :
                                <>
                                <div className="no-results">
                                    { strings.no_results }
                                </div>
                                </> }
                            </div>
                            
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    
    return {
        search: state.search,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        searchStats: query => dispatch(searchStats(query)),
        searchDetailsResults: (target, query) => dispatch(searchDetailsResults(target, query)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(SearchPage);