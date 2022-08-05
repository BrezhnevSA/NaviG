import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import queryString from 'query-string';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Tabs, Tab } from 'react-bootstrap';
import { Button, Label } from 'reactstrap';

import { getLocations, updateLocations } from '../../../actions/LocationsActions';
import { getLocationTypes } from '../../../actions/LocationTypesActions';

import Loading from '../Loading/LoadingComponent';

import LocalizedStrings from 'react-localization';

import * as rtc from '../../../constants/RemoteTableColumns';
import * as app_settings from '../../../constants/AppSettings';

import './LocationItems.css';
import { headerStyles, sortCaretStyle } from '../../../constants/Styles';

import LocationsItemsFilterSidebar from './LocationsItemsFilterSidebar';

let strings = new LocalizedStrings({
    en:{
        locations:"Locations",
        edit:"Edit",
        add:"Add",
        loationname:"Location Name",
        floorname:"Floor",
        type:"Type",
        action:"Actions",
        showing:"Showing",
        from: "from",
        to:"to",
        of:"of",
        results:"Results",
        active: "Active",
        inactive: "Inactive",
        all: "All",
        filter: "Filter",
        noresults: "No results",
        reset_filter: "Reset",
        city_name: "City",
        building_name: "Building",
        square: "Square",
        company: "Company",
        contract: "Contract"
    },
    ru: {
        locations:"Помещения",
        edit:"Редактировать",
        add:"Добавить",
        loationname:"Название Помещения",
        floorname:"Этаж",
        type:"Тип помещения",
        action:"Действия",
        showing:"Отображено",
        from: "с",
        to:"по",
        of:"из",
        results:"всего",
        active: "Активно",
        inactive: "Неактивно",
        all: "Все",
        filter: "Фильтровать",
        noresults: "Нет результатов",
        reset_filter: "Сбросить",
        city_name: "Город",
        building_name: "Корпус",
        square: "Площадь",
        company: "Компания",
        contract: "Контракт"
    },
    de: {
        locations:"Standorte",
        edit:"Bearbeiten",
        add:"Hinzufügen",
        loationname:"Objekttypname",
        floorname:"Etage",
        objecttypeicon:"Icon",
        type:"Typ",
        action:"Aktionen",
        showing:"Zeigen",
        from: "von",
        to:"zu",
        of:"von",
        results:"Ergebnisse",
        active: "Aktiv",
        inactive: "Inaktiv",
        all: "Alles",
        filter: "Filter",
        noresults: "Keine Ergebnisse",
        reset_filter: "Zurücksetzen",
        city_name: "Stadt",
        building_name: "Gebäude",
        square: "Fläche",
        company: "Unternehmen",
        contract: "Vertrag"
    }
});

class LocationItems extends Component {

    constructor(props) {
        super(props)

        this.state = {
            locations:   this.props.locations.items ? this.props.locations.items : this.props.locations,
            key:         -1,
            page:        1,
            data:        this.props.locations.items ? this.props.locations.items.slice(0, 10) : this.props.locations.slice(0, 10),
            totalSize:   this.props.locations.items ? this.props.locations.items.length : this.props.locations.length,
            sizePerPage: 10,
            tabs:        [],
            sortField:   '',
            sortOrder:   '',
            filtersVal:  [],
            columns:     [],
            afterFilter: false,
            firstload:   false,
            filter_sidebar_show: false,
            checkbox_offices: [],
            checkbox_buildings: [],
            contract_selected: null       
        }
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.closeSidebar            = this.closeSidebar.bind(this);
        this.openSidebar             = this.openSidebar.bind(this);
        this.filterRenderer_         = this.filterRenderer_.bind(this);
        this.handleTabChange         = this.handleTabChange.bind(this);
        this.handleTableChange       = this.handleTableChange.bind(this);
        this.filterLocationsItems    = this.filterLocationsItems.bind(this);
    }

    componentDidMount() {
        const parsed_params = queryString.parse(this.props.location.search);

        if (!!this.props.locations && parsed_params.filters !== 'true')  {
            this.props.getLocations(1, 10, -1);
            localStorage.setItem("locationsFilters", JSON.stringify({
                page: 1,
                sizePerPage: 10,
                key: -1,
                sortField: null,
                sortOrder: null,
                sortField_m: null,
                filtersVal: []
            }));
        } else {
            const locationsFilters = JSON.parse(localStorage.getItem("locationsFilters"));
            this.props.getLocations(
                locationsFilters.page, 
                locationsFilters.sizePerPage, 
                parseInt(locationsFilters.key), 
                locationsFilters.sortField, 
                locationsFilters.sortOrder, 
                locationsFilters.sortField_m,
                locationsFilters.filtersVal.filter(e => e.value)
            );
            this.setState({
                page: locationsFilters.page, 
                sizePerPage: locationsFilters.sizePerPage, 
                key: parseInt(locationsFilters.key), 
                sortField: locationsFilters.sortField, 
                sortOrder: locationsFilters.sortOrder,
                filtersVal: locationsFilters.filtersVal,
                afterFilter: true,
                firstload: true
            })
        }
        this.props.getLocationTypes();
    }

    componentDidUpdate(prevProps) {
        const { locations, location_types } = this.props;
        const { page, sizePerPage, tabs, filtersVal, afterFilter, firstload } = this.state;
        let filtersVal_ = [];
        if (locations !== prevProps.locations && locations.items) {            
            this.setState({
                locations: locations.items,
                data:      locations.items.slice(page - 1, sizePerPage),
                totalSize: locations.items.count,
            });
        }
        if (tabs.length === 0 && location_types && location_types.length > 0) {
            let tabs = [{name: "All", id: -1}];
            location_types.map(el => { 
                tabs.push({name: el.name, id: el.id}); 
            })
            this.setState({
                tabs: tabs
            });
        }
        if (locations !== prevProps.locations && !locations.isFetching && !location_types.isFetching || prevProps.lang !== this.props.lang) {
            let columns = [{
                id:    -1,
                items: [
                    {
                        dataField: rtc.NAME_FIELD,
                        text: strings.loationname,
                        filter: textFilter(),
                        filterRenderer: (onFilter, column) => { return <></>; },
                        sort: true,
                        filter_external: true,
                        sortCaret: sortCaretStyle,
                        headerStyle: headerStyles
                    }, {
                        dataField: rtc.ITEM_SUBTYPE_FIELD,
                        text: strings.type,
                        filter: textFilter(),
                        filterRenderer: (onFilter, column) => { return <></>; },
                        sort: true,
                        filter_external: true,
                        sortCaret: sortCaretStyle,
                        headerStyle: headerStyles
                    }, {
                        dataField: rtc.CITY_NAME_FIELD,
                        text: strings.city_name,
                        filter: textFilter(),
                        filterRenderer: (onFilter, column) => { return <></>; },
                        filter_external: false,
                        sort: true,
                        sortCaret: sortCaretStyle,
                        headerStyle: headerStyles
                    }, , {
                        dataField: rtc.BUILDING_NAME_FIELD,
                        text: strings.building_name,
                        filter: textFilter(),
                        filterRenderer: (onFilter, column) => { return <></>; },
                        filter_external: false,
                        sort: true,
                        sortCaret: sortCaretStyle,
                        headerStyle: headerStyles
                    }, {
                        dataField: rtc.FLOOR_NAME_FIELD,
                        text: strings.floorname,
                        filter: textFilter(),
                        filterRenderer: (onFilter, column) => { return <></>; },
                        sort: true,
                        filter_external: true,
                        sortCaret: sortCaretStyle,
                        headerStyle: headerStyles
                    }, {
                        dataField: Math.random(),
                        text: strings.square,
                        filter: textFilter(),
                        filterRenderer: (onFilter, column) => { return <></>; },
                        // sort: true,
                        filter_external: false,
                        // sortCaret: sortCaretStyle,
                        headerStyle: headerStyles,
                        formatter: (cell, row, rowIndex, extraData) => {
                            const loc_square = row.meta_info && row.meta_info.length > 0 
                                ? row.meta_info.find(mi => mi.metafieldid == app_settings.SQUARE_ID)
                                : '';                           
                            return <>{!!loc_square ? loc_square.metavalue : '-'}</>;
                        },
                    }, {
                        dataField: Math.random(),
                        text: strings.company,
                        filter: textFilter(),
                        filterRenderer: (onFilter, column) => { return <></>; },
                        // sort: true,
                        filter_external: false,
                        // sortCaret: sortCaretStyle,
                        headerStyle: headerStyles,
                        formatter: (cell, row, rowIndex, extraData) => {
                            const loc_company = row.meta_info && row.meta_info.length > 0 
                                ? row.meta_info.find(mi => mi.metafieldid == app_settings.COMPANY_ID)
                                : '';                           
                            return <>{!!loc_company ? loc_company.metavalue : '-'}</>;
                        },
                    }, {
                        dataField: Math.random(),
                        text: strings.contract,
                        filter: textFilter(),
                        filterRenderer: (onFilter, column) => { return <></>; },
                        // sort: true,
                        filter_external: false,
                        // sortCaret: sortCaretStyle,
                        headerStyle: headerStyles,
                        formatter: (cell, row, rowIndex, extraData) => {
                            const loc_contract = row.meta_info && row.meta_info.length > 0 
                                ? row.meta_info.find(mi => mi.metafieldid == app_settings.CONTRACT_ID)
                                : '';                           
                            return <>{!!loc_contract ? loc_contract.metavalue : '-'}</>;
                        },
                    }, {
                        dataField: 'id',
                        text: strings.action,
                        sortCaret: sortCaretStyle,
                        headerStyle: headerStyles,
                        formatter: (cell, row, rowIndex, extraData) => {
                            
                            return <Link to={"/locations/" + cell} className="edit_location_btn">
                                <img 
                                    src="/img/pics/edit_button.svg"
                                    style={{ display: 'block' }}
                                    onClick={() => {
                                        localStorage.setItem('locationsFilters', JSON.stringify({
                                            page: extraData.page,
                                            sizePerPage: extraData.sizePerPage,
                                            key: extraData.key,
                                            sortField: extraData.sortField,
                                            sortOrder: extraData.sortOrder,
                                            sortField_m: extraData.sortField_m,
                                            filtersVal: extraData.filtersVal
                                        }))
                                    }}
                                ></img>
                            </Link>;
                        },
                        formatExtraData: {
                            edit: strings.edit,
                            page: this.state.page, 
                            sizePerPage: this.state.sizePerPage, 
                            key: parseInt(this.state.key), 
                            sortField: this.state.sortField, 
                            sortOrder: this.state.sortOrder, 
                            sortField_m: this.state.sortField ? this.state.sortField.split('-').length > 0 : false,
                            filtersVal: this.state.filtersVal
                        }
                    }
                ]
            }];
            filtersVal_.push({ field: rtc.NAME_FIELD,         value: null, tabId: -1, preview: strings.loationname });
            filtersVal_.push({ field: rtc.ITEM_SUBTYPE_FIELD, value: null, tabId: -1, preview: strings.type });
            filtersVal_.push({ field: rtc.FLOOR_NAME_FIELD,   value: null, tabId: -1, preview: strings.floorname });
            filtersVal_.push({ field: rtc.BUILDING_NAME_FIELD, value: null, tabId: -1, preview: strings.buildingname });
            filtersVal_.push({ field: rtc.CITY_NAME_FIELD, value: null, tabId: -1, preview: strings.cityname });
            if (location_types && !location_types.isFetching && locations && !locations.isFetching) {
                location_types.map(el => { 
                    let meta_columns_found = false;
                    columns.push({
                        id: el.id,
                        items: [
                            {
                                dataField: rtc.NAME_FIELD,
                                text: strings.loationname,
                                filter: textFilter(),
                                filterRenderer: (onFilter, column) => { return <></>; },
                                sort: true,
                                filter_external: true,
                                sortCaret: sortCaretStyle,
                                headerStyle: headerStyles
                            }, {
                                dataField: rtc.ITEM_SUBTYPE_FIELD,
                                text: strings.type,
                                filter: textFilter(),
                                filterRenderer: (onFilter, column) => { return <></>; },
                                sort: true,
                                filter_external: true,
                                sortCaret: sortCaretStyle,
                                headerStyle: headerStyles
                            }, {
                                dataField: rtc.CITY_NAME_FIELD,
                                text: strings.city_name,
                                filter: textFilter(),
                                filterRenderer: (onFilter, column) => { return <></>; },
                                filter_external: false,
                                sort: true,
                                sortCaret: sortCaretStyle,
                                headerStyle: headerStyles
                            }, {
                                dataField: rtc.BUILDING_NAME_FIELD,
                                text: strings.building_name,
                                filter: textFilter(),
                                filterRenderer: (onFilter, column) => { return <></>; },
                                filter_external: false,
                                sort: true,
                                sortCaret: sortCaretStyle,
                                headerStyle: headerStyles
                            }, {
                                dataField: rtc.FLOOR_NAME_FIELD,
                                text: strings.floorname,
                                filter: textFilter(),
                                filterRenderer: (onFilter, column) => { return <></>; },
                                sort: true,
                                filter_external: true,
                                sortCaret: sortCaretStyle,
                                headerStyle: headerStyles                               
                            }, {
                                dataField: `${app_settings.SQUARE_ID}`,
                                text: strings.square,
                                filter: textFilter(),
                                filterRenderer: (onFilter, column) => { return <></>; },
                                sort: true,
                                filter_external: false,
                                sortCaret: sortCaretStyle,
                                headerStyle: headerStyles,
                                formatter: (cell, row, rowIndex, extraData) => {
                                    const loc_square = row.meta_info && row.meta_info.length > 0 
                                        ? row.meta_info.find(mi => mi.metafieldid == app_settings.SQUARE_ID)
                                        : '';                           
                                    return <>{!!loc_square ? loc_square.metavalue : '-'}</>;
                                },
                            }, {
                                dataField: `${app_settings.COMPANY_ID}`,
                                text: strings.company,
                                filter: textFilter(),
                                filterRenderer: (onFilter, column) => { return <></>; },
                                sort: true,
                                filter_external: false,
                                sortCaret: sortCaretStyle,
                                headerStyle: headerStyles,
                                formatter: (cell, row, rowIndex, extraData) => {
                                    const loc_company = row.meta_info && row.meta_info.length > 0 
                                        ? row.meta_info.find(mi => mi.metafieldid == app_settings.COMPANY_ID)
                                        : '';                           
                                    return <>{!!loc_company ? loc_company.metavalue : '-'}</>;
                                },
                            }, {
                                dataField: `${app_settings.CONTRACT_ID}`,
                                text: strings.contract,
                                filter: textFilter(),
                                filterRenderer: (onFilter, column) => { return <></>; },
                                sort: true,
                                filter_external: false,
                                sortCaret: sortCaretStyle,
                                headerStyle: headerStyles,
                                formatter: (cell, row, rowIndex, extraData) => {
                                    const loc_cotract = row.meta_info && row.meta_info.length > 0 
                                        ? row.meta_info.find(mi => mi.metafieldid == app_settings.CONTRACT_ID)
                                        : '';                           
                                    return <>{!!loc_cotract ? loc_cotract.metavalue : '-'}</>;
                                },
                            }
                        ]
                    })
                    filtersVal_.push({ field: rtc.NAME_FIELD,          value: null, tabId: el.id, preview: strings.loationname });
                    filtersVal_.push({ field: rtc.ITEM_SUBTYPE_FIELD,  value: null, tabId: el.id, preview: strings.type });
                    filtersVal_.push({ field: rtc.FLOOR_NAME_FIELD,    value: null, tabId: el.id, preview: strings.floorname });
                    filtersVal_.push({ field: rtc.BUILDING_NAME_FIELD, value: null, tabId: el.id, preview: strings.buildingname });
                    filtersVal_.push({ field: rtc.CITY_NAME_FIELD,     value: null, tabId: el.id, preview: strings.cityname });
                    columns = columns.map((column) => {
                        if ( column && el && column.id === el.id ) {
                            locations.items.map((location) => {      
                                if (location.meta_info && location.meta_info.length > 0 && !meta_columns_found) {
                                    meta_columns_found = true;
                                    location.meta_info.map((l, index) => {
                                        if (l.show_in_management) {
                                            filtersVal_.push({ field: `${l.metafieldid}-${l.entitytype}`, value: null, tabId: el.id, preview: l.metaname });
                                            column.items.push({
                                                dataField: `${l.metafieldid}-${l.entitytype}`,
                                                text:      l.metaname,
                                                filter:    textFilter(),
                                                filterRenderer: (onFilter, column) => { return <></>; },
                                                sort:      true,
                                                sortCaret: sortCaretStyle,
                                                headerStyle: headerStyles,
                                                formatter: (cell, row, rowIndex, extraData) => {
                                                    if (row.meta_info && row.meta_info.length > 0 && (row.meta_info.length - 1) >= extraData.index) {
                                                        return row.meta_info[extraData.index].metavalue;
                                                    } else {
                                                        return "-";
                                                    }
                                                },
                                                formatExtraData: {
                                                    index: index
                                                },
                                                filter_external: true
                                            });  
                                        }
                                    })
                                }
                            })
                            return column;
                        } else {
                            return column;
                        }
                    })
                    columns = columns.map((column) => {
                        if ( column.id === el.id ) {
                            column.items.push({
                                dataField: 'id',
                                text: strings.action,
                                sortCaret: sortCaretStyle,
                                headerStyle: headerStyles,
                                formatter: (cell, row, rowIndex, extraData) => {
                                    return  <Link to={`/locations/${cell}`}>
                                                <Button 
                                                    color="primary"
                                                    onClick={() => {
                                                        localStorage.setItem('locationsFilters', JSON.stringify({
                                                            page: extraData.page,
                                                            sizePerPage: extraData.sizePerPage,
                                                            key: extraData.key,
                                                            sortField: extraData.sortField,
                                                            sortOrder: extraData.sortOrder,
                                                            sortField_m: extraData.sortField_m,
                                                            filtersVal: extraData.filtersVal
                                                        }))
                                                    }}
                                                >
                                                    { extraData.edit }
                                                </Button>
                                            </Link>;
                                },
                                formatExtraData: {
                                    edit: strings.edit,
                                    page: this.state.page, 
                                    sizePerPage: this.state.sizePerPage, 
                                    key: parseInt(this.state.key), 
                                    sortField: this.state.sortField, 
                                    sortOrder: this.state.sortOrder, 
                                    sortField_m: this.state.sortField ? this.state.sortField.split('-').length > 0 : false,
                                    filtersVal: this.state.filtersVal
                                }
                            });
                            return column;
                        } else {
                            return column;
                        }
                    })
                });
            }
            this.setState({
                columns: columns,
                filtersVal: afterFilter
                    ? firstload
                        ? this.state.filtersVal
                        : filtersVal_.map(fv_ => {
                            let fv_old = filtersVal.find(fv => fv.field === fv_.field && fv.tabId === fv_.tabId);
                            if (fv_old !== undefined) {
                                fv_.value = fv_old.value;
                            }
                            return fv_;
                          })
                    : filtersVal_,
                afterFilter: false,
                firstload: false
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    closeSidebar() { this.setState({ filter_sidebar_show: false }); }

    openSidebar() { this.setState({ filter_sidebar_show: true }); }

    filterRenderer_(tabId, column) {
        const { filtersVal } = this.state;
        const fv = filtersVal.find(e => e.field === column && e.tabId === tabId);
        return  <Label
                    className='filter-label fl-lb'
                    for={`text-filter-column-${column}`}
                    onClick={(e) => { e.stopPropagation();e.nativeEvent.stopImmediatePropagation(); }}
                >
                    <input
                        name={`text-filter-column-${column}-${tabId}`}
                        ref={(ref) => { this[`ref_${column}_${tabId}`] = ref; }}
                        type="text"
                        className="filter text-filter form-control"
                        id={`text-filter-column-${column}-${tabId}`}
                        defaultValue={fv ? fv.value : ""}
                        meta={true}
                        placeholder={fv ? fv.preview : ""}
                    />
                </Label>
    }

    notify = () => {
        toast.success("Changes Saved!", {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    handleTabChange(key) {
        this.props.getLocations(1, 10, key);
        this.setState({
            key:         parseInt(key),
            page:        1,
            sizePerPage: 10,
            filtersVal:  this.state.filtersVal.map(e => { e.value = null; return e; })
        });
    }

    handleTableChange = (type, { page, sizePerPage, filters, sortField, sortOrder, cellEdit }) => {
        const filtersActive = this.state.filtersVal.filter(e => e.value)
        const currentIndex = (page - 1) * sizePerPage;
        if (type === 'pagination') {
            this.props.getLocations(
                page, 
                sizePerPage, 
                this.state.key, 
                sortField, 
                sortOrder, 
                sortField ? sortField.split('-').length > 0 : false,
                filtersActive);
            let result = this.props.locations.items;
            this.setState({
                page: page,
                data: result.slice(currentIndex, currentIndex + sizePerPage),
                totalSize: this.props.locations.count,
                sizePerPage,
                afterFilter: true
            });
        } else if (type === 'sort' && (sortField !== this.state.sortField || sortOrder !== this.state.sortOrder) && 
                !this.props.locations.isFetching) {
            this.props.getLocations(
                page, 
                sizePerPage, 
                this.state.key, 
                sortField, 
                sortOrder, 
                sortField ? sortField.split('-').length > 0 : false,
                filtersActive);
            this.setState({
                sortField: sortField,
                sortOrder: sortOrder,
                afterFilter: true
            });
        } else if (type === 'filter') {
            this.props.getLocations(
                page, 
                sizePerPage, 
                this.state.key, 
                sortField, 
                sortOrder, 
                sortField ? sortField.split('-').length > 0 : false,
                Object.entries(filters).map(el => { return { field: el[0], value: el[1].filterVal }; }));
            this.setState({
                filters: filters
            })
        }     
    }

    _setTableOption(){ 
        if(!this.props.locations.isFetching){
          return "No expenses found";
        }else{
          return(
            <>loading</>
          );
        }
    }

    resetFilters() {
        const { page, sizePerPage, key, filtersVal } = this.state;
        this.props.getLocations(page, sizePerPage, key);
        localStorage.setItem("locationsFilters", JSON.stringify({
            page: page,
            sizePerPage: sizePerPage,
            key: parseInt(key),
            sortField: null,
            sortOrder: null,
            sortField_m: null,
            filtersVal: filtersVal.map(e => { e.value = ""; return e; })
        }));
        this.setState({ afterFilter: true });
    }

    filterLocationsItems(filters, checkbox_offices, checkbox_buildings, key_, company_, contract_selected) {
        const { page, sizePerPage, sortField, sortOrder } = this.state;
        this.props.getLocations(
            page, 
            sizePerPage, 
            key_,
            sortField,
            sortOrder,
            sortField ? sortField.split('-').length > 0 : false,
            filters
        );
        this.setState({
            filtersVal: filters,
            checkbox_offices: checkbox_offices,
            checkbox_buildings: checkbox_buildings,
            key: key_,
            company_: company_,
            contract_selected: contract_selected
        })
    }

    render() {
        const { key, sizePerPage, page, tabs, sortField, sortOrder, columns, filter_sidebar_show } = this.state;
        const { location_types, locations } = this.props;
        
        if (location_types && !location_types.isFetching && locations && !locations.isFetching && columns.length > 0) {

            const customTotal = (from, to, size) => (
                <span className="react-bootstrap-table-pagination-total">
                  { strings.showing } { strings.from } { from } { strings.to } { to } { strings.of } { size } { strings.results }
                </span>
            );

            const RemoteAll = ({ data, page, sizePerPage, onTableChange, totalSize, columns }) => (
                <div className="default-table-style-container table_custom table_custom_with_tabs">
                    <BootstrapTable
                        remote
                        keyField={`table-${Math.random()}`}
                        data={ data }
                        columns={ columns }
                        filter={ filterFactory() }
                        rowStyle={ (row, rowIndex) => {
                            return { backgroundColor: rowIndex % 2 == 0 ? "#ededed" : "white" };
                        } }
                        pagination={ paginationFactory({ 
                            page, 
                            sizePerPage, 
                            totalSize,
                            noDataText: this._setTableOption(),
                            showTotal: true,
                            paginationTotalRenderer: customTotal,
                            withFirstAndLast: true,
                            sizePerPageList: [{
                                text: '10', value: 10
                            }, {
                                text: '15', value: 15
                            }, {
                                text: '30', value: 30
                            }, {
                                text: '50', value: 50
                            }] 
                        })}
                        onTableChange={ onTableChange }
                        sort={ { dataField: sortField, order: sortOrder }}
                        noDataIndication={ () => <>{strings.noresults}</> }
                    />
                </div>
            );
            
            let tab = tabs.find(t => t.id == key);

            return (
                <>
                    <div className="container-fluid  overflow-auto with-actions">
                        <div className="container page-title-wrapper" >
                            <div class="page-key"><p id="page-title">{ strings.locations}</p></div>                           
                        </div>
                        <div className="container neomorph-card mt-2">
                            { tab !== undefined ?             
                                // <Tab eventKey={tab.id} title={tab.name}>
                                //     <br></br>
                                //     { columns.find(c => c.id === tab.id) 
                                //         ? columns.find(c => c.id === tab.id).items.map(i => {
                                //             if (i.filter_external) {
                                //                 return this.filterRenderer_(tab.id, i.dataField);
                                //             } else {
                                //                 return null;
                                //             }
                                //             }).filter(o => o)
                                //         : <></>
                                //     }
                                //     <Button 
                                //         style={{marginLeft: '5px'}}
                                //         color="primary" 
                                //         onClick={(e) => { this.handleButtonFilterClick();}}
                                //     >
                                //         {strings.filter}
                                //     </Button>
                                //     <Button 
                                //         style={{marginLeft: '5px'}}
                                //         color="primary" 
                                //         onClick={(e) => { this.resetFilters();}}
                                //     >
                                //         {strings.reset_filter}
                                //     </Button>   
                                    <RemoteAll
                                        data={ locations.items ? locations.items : [] }
                                        page={ page }
                                        sizePerPage={ sizePerPage }
                                        totalSize={ locations.count }
                                        onTableChange={ this.handleTableChange }
                                        columns={ columns.find(el => el.id === tab.id) !== undefined 
                                            ? columns.find(el => el.id === tab.id).items 
                                            : columns[0].items
                                        }
                                    />
                                :   <></> }
                        </div>
                        <br />
                        <br />
                    </div>
                    <LocationsItemsFilterSidebar 
                        {...this.props} 
                        lang={this.props.lang} 
                        filter_sidebar_show={filter_sidebar_show} 
                        filterLocationsItems={this.filterLocationsItems}
                        closeSidebar={this.closeSidebar} 
                        checkbox_offices={this.state.checkbox_offices}
                        checkbox_buildings={this.state.checkbox_buildings}
                        tabs={this.state.tabs}
                        key_={key}
                        company_={this.state.company_}
                        filtersVal={this.state.filtersVal}
                        columns={this.state.columns}
                        contract_selected={this.state.contract_selected}
                    />                     
                    <div className="open_filter_employees_sidebar_button">
                            <button 
                                className="button-magenta button-simple" 
                                onClick={() => { this.openSidebar(); }}
                            >{strings.filter}</button>
                    </div> 
                </>
            );
        } else if (locations.isFetching || location_types.isFetching) { 
            return(<Loading/>);
        } else { return(
            <>
                <LocationsItemsFilterSidebar 
                    {...this.props} 
                    lang={this.props.lang} 
                    filter_sidebar_show={filter_sidebar_show} 
                    filterLocationsItems={this.filterLocationsItems}
                    closeSidebar={this.closeSidebar} 
                    checkbox_offices={this.state.checkbox_offices}
                    checkbox_buildings={this.state.checkbox_buildings}
                    tabs={this.state.tabs}
                    key_={key}
                    company_={this.state.company_}
                    filtersVal={this.state.filtersVal}
                    columns={this.state.columns}
                    contract_selected={this.state.contract_selected}
                /> 
                <div className="open_filter_employees_sidebar_button">
                    <button 
                        className="button-magenta button-simple" 
                        onClick={() => { this.openSidebar(); }}
                    >{strings.filter}</button>
                </div> 
            </>); 
        }
    }
}

const mapStateToProps = state => {
    return {
        locations:      state.locations,
        location_types: state.location_types
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getLocations: (page, ppp, type_id, sortField, sortOrder, meta_sort, filters) => dispatch(getLocations(page, ppp, type_id, sortField, sortOrder, meta_sort, filters)),
        updateLocations: location => dispatch(updateLocations(location)),
        getLocationTypes: () => dispatch(getLocationTypes())
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(LocationItems);