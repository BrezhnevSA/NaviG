import React, { Component } from 'react';
import { AsyncTypeahead }   from 'react-bootstrap-typeahead';

const PER_PAGE = 10;

class AsyncSearcher extends Component {
    _cache = {};
    cachedQuery = { options: [], page: 1 };

    constructor(props) {
        super(props)

        this.state = {        
            isLoading: false,
            options:   [],
            query:     '',
            selected:  this.props.selected
        }
        
        this.updateObjects      = this.updateObjects.bind(this);
        this._handleSelection   = this._handleSelection.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
        this._handlePagination  = this._handlePagination.bind(this);
        this._handleSearch      = this._handleSearch.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.objects !== prevProps.objects) {
            this.setState({
                isLoading: false,
                options:   this.props.objects
            }, () => {
                this.updateObjects();
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.selected.length !== nextProps.selected.length) {
            this.setState({
                selected: nextProps.selected
            })
        }
    }

    updateObjects() {
        const { query }    = this.state;
        const options      = this.cachedQuery.options.concat(this.props.objects);
        const page         = this.cachedQuery.page;
        this._cache[query] = { ...this.cachedQuery, options, page };
        this.setState({
            isLoading: false,
            options: options,
        });
    }

    _handleInputChange = query => {
        this.setState({ query });
    };
    
    _handlePagination = (e, shownResults) => {
        const { query }  = this.state;
        this.cachedQuery = this._cache[query];
        // Don't make another request if:
        // - the cached results exceed the shown results
        // - we've already fetched all possible results
        if (this.cachedQuery.options.length > shownResults ||
            this.cachedQuery.options.length === this.cachedQuery.total_count) {
          return;
        }
        this.setState({ isLoading: true });
        const page = this.cachedQuery.page + 1;
        this.props.searchObjects(query, page)
    };
    
    _handleSearch = query => {
        if (this._cache[query]) {
          this.setState({ options: this._cache[query].options });
          return;
        }
        this.setState({ isLoading: true });
        this.props.searchObjects(query, 1)
    };

    _handleSelection(item) {
        let { object_id } = this.props;
        this.setState({ selected: item });
        this.props.handleSelection(item, object_id);
    }

    render() {
        const { options } = this.state;
        let { selected }  = this.state;
        return (
            <AsyncTypeahead
                {...this.state}
                selected={selected}
                disabled={this.props.disabled}
                maxResults={!!this.props.per_page ? this.props.per_page : PER_PAGE - 1}
                minLength={this.props.minLength ? this.props.minLength : 2}
                labelKey={this.props.labelKey}
                id="fieldName"
                options={options}
                bsSize={this.props.size === 'sm' ? 'sm' : 'lg'}
                multiple={this.props.multiple ? this.props.multiple : false}
                placeholder={this.props.textTranslation.placeholder_name}
                emptyLabel={this.props.textTranslation.noresults}
                promptText={this.props.textTranslation.searching}
                searchText={this.props.textTranslation.searching}
                onInputChange={ this._handleInputChange }
                onPaginate={ this._handlePagination }
                onSearch={ this._handleSearch }
                onChange={(selected) => this._handleSelection(selected)}
                renderMenuItemChildren={this.props.optionsRender}
                renderToken={this.props.renderToken}
                useCache={false}
            /> 
        );
    }
}

export default AsyncSearcher;