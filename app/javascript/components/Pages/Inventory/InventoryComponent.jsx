import React, { Component } from 'react';
import { toast }            from 'react-toastify';
import { connect }          from "react-redux";
import { Button }           from 'reactstrap';
import { Link }             from 'react-router-dom';
import queryString          from 'query-string';
import BootstrapTable       from 'react-bootstrap-table-next';
import * as config          from '../../../config/config';
import axios                from 'axios'; 
import filterFactory, { 
       dateFilter,
       textFilter
}                           from 'react-bootstrap-table2-filter';
import paginationFactory    from 'react-bootstrap-table2-paginator';
import moment               from 'moment';
import { 
    getInventory
}                           from '../../../actions/SearchActions';

import LocalizedStrings from 'react-localization';

import Loading from '../Loading/LoadingComponent';
import InventoryFilterSidebar from './InventoryFilterSidebar';
import * as app from '../../../constants/AppSettings';
import * as app_settings from '../../../constants/AppSettings';
import * as oi_type from '../../../constants/ObjectItemsStatus';
import './InventoryComponent.css';

import { sortCaretStyle, headerStyles } from '../../../constants/Styles';

let strings = new LocalizedStrings({
    en:{
        inventory:      "Inventory",
        noemployees:    "No data",
        name:           "Place name",
        action:         "Action",
        showing:        "Showing",
        from:           "from",
        to:             "to",
        of:             "of",
        results:        "Results",
        changessaved:   "Changes Saved!",
        all:            "All",
        noresults:      "No results",
        actions:        "Actions",
        city_name:      "City",
        floorname:      "Floor",
        locationname:   "Location",
        buildingname:   "Building",
        status:         "Status",
        filter:         "Filter",
        desknum:        "Inv. № desk",
        tumbnum:        "Inv. № stand",
        docstation:     "Inv. № Dokstation",
        monitor1:       "Inv. № Monitor1",
        monitor2:       "Inv. № Monitor2",
        not_safe:       "Unsafe place",
        to_warehouse:   "Transferred to warehouse",
        to_employee:    "Transferred to Employee",
        to_junk:        "Junk",
        locationname:   "Location",
        download:       "Download"
    },
    ru: {
        inventory:      "Инвентаризация",
        noemployees:    "Данные отсутствуют",
        name:           "Место",
        action:         "Действие",
        showing:        "Отображено", 
        from:           "с",
        to:             "по",
        of:             "из",
        results:        "всего",
        changessaved:   "Изменения сохранены!",
        all:            "Все",
        noresults:      "Нет результатов",
        actions:        "Действия",
        city_name:      "Город",
        floorname:      "Этаж",
        locationname:   "Помещение",
        buildingname:   "Корпус",
        status:         "Статус",
        filter:         "Фильтр",
        desknum:        "Инв. № стола",
        tumbnum:        "Инв. № тумбы",
        docstation:     "Инв. № Докстанции",
        monitor1:       "Инв. № Монитор1",
        monitor2:       "Инв. № Монитор2",
        not_safe:       "Небезопасное место",
        to_warehouse:   "Передано на склад",
        to_employee:    "Передано сотруднику",
        to_junk:        "В утиль",
        locationname:   "Помещение",
        download:       "Скачать"
    },
    de: {
        inventory:      "Inventar",
        noemployees:    "Keine Daten verfügbar",
        name:           "Ortsname",
        action:         "Aktion",
        showing:        "Zeigen",    
        from:           "von",
        to:             "zu",
        of:             "von",
        results:        "Ergebnisse",
        changessaved:   "Änderungen gespeichert!",
        all:            "Alles",
        noresults:      "Keine Ergebnisse",
        actions:        "Aktionen",
        city_name:      "Stadt",
        floorname:      "Etage Name",
        locationname:   "Ortsname",
        buildingname:   "Gebäudename",
        status:         "Status",
        filter:         "Filter",
        desknum:        "Inv. № tisch",
        tumbnum:        "Inv. № stand",
        docstation:     "Inv. № Dockingstationen",
        monitor1:       "Inv. № Monitor1",
        monitor2:       "Inv. № Monitor2",
        not_safe:       "Unsicherer Ort",
        to_warehouse:   "Übertragen ins Lager",
        to_employee:    "auf Mitarbeiter übertragen",
        to_junk:        "Müll",
        locationname:   "Ortsname",
        download:       "Download"
    }
});

class Inventory extends Component {

    constructor(props) {
        super(props)

        this.state = {
            page:         1,
            sizePerPage:  10,
            sortField:    '',
            sortOrder:    '',
            filtersVal:   [{ field: "object_type_id", value: app_settings.TECHNIQUE_TYPES}],
            columns:      [],
            afterFilter:  false,
            firstLoad:    false,
            data:         this.props.search.inventory ? this.props.search.inventory.items : [],
            totalSize:    this.props.search.inventory ? this.props.search.inventory.count : 0,
            filter_sidebar_show: false,
            checkbox_offices: [],
            checkbox_buildings: [],
            checkbox_floors: [],
            desk_status: []
        }

        this.handleTableChange = this.handleTableChange.bind(this);
        this.closeSidebar = this.closeSidebar.bind(this);
        this.openSidebar = this.openSidebar.bind(this);
        this.filterInventory = this.filterInventory.bind(this);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {
        const parsed_params = queryString.parse(this.props.location.search);
        const objectItemsFilters = JSON.parse(localStorage.getItem("inventoryFilters"));
        if (!!this.props.search.inventory && (parsed_params.filters !== 'true' || parsed_params.filters == undefined) || !!!objectItemsFilters)  {
            this.props.getInventory(1, 10, [], "")
            localStorage.setItem("inventoryFilters", JSON.stringify({
                page: 1,
                sizePerPage: 10,
                key: -1,
                sortField: null,
                sortOrder: null,
                filtersVal: [],
                sortField_m: null,
            }));
        } else {
            setTimeout(() => { 
                this.props.getInventory(
                    objectItemsFilters.page, 
                    objectItemsFilters.sizePerPage, 
                    objectItemsFilters.filtersVal.filter(e => e.value),
                    { field: objectItemsFilters.sortField, order: objectItemsFilters.sortOrder },
                    objectItemsFilters.sortField_m
                ); 
            }, 2000);
            this.setState({
                page: objectItemsFilters.page, 
                sizePerPage: objectItemsFilters.sizePerPage, 
                sortField: objectItemsFilters.sortField, 
                sortOrder: objectItemsFilters.sortOrder,
                filtersVal: objectItemsFilters.filtersVal,
                sortField_m: objectItemsFilters.sortField_m,
                afterFilter: true,
                firstLoad: true
            })
        }
    }

    componentDidUpdate(prevProps) {
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    notify = () => {
        toast.success(strings.chagessaved, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    resetFilters() {
        const { page, sizePerPage, filtersVal } = this.state;
        this.props.getInventory(page, sizePerPage, [], "");
        localStorage.setItem("inventoryFilters", JSON.stringify({
            page: page,
            sizePerPage: sizePerPage,
            sortField: null,
            sortOrder: null,
            sortField_m: null,
            filtersVal: filtersVal.map(e => { e.value = ""; return e; })
        }));
        this.setState({ afterFilter: true });
    }

    handleTableChange = (type, { page, sizePerPage, filters, sortField, sortOrder, cellEdit }) => {
        const filtersActive = this.state.filtersVal.filter(e => e.value)
        const currentIndex = (page - 1) * sizePerPage;
        if (type === 'pagination') {
            this.props.getInventory(
                page, 
                sizePerPage, 
                filtersActive,
                { field: sortField, order: sortOrder },
                sortField ? sortField.split('-').length > 0 : false, 
            );
            let result = this.props.search.inventory.items;
            this.setState({
                page: page,
                data: result.slice(currentIndex, currentIndex + sizePerPage),
                totalSize: this.props.search.inventory.count,
                sizePerPage,
                afterFilter: true
            });
        } else if (type === 'sort' && (sortField !== this.state.sortField || sortOrder !== this.state.sortOrder) && 
                !this.props.search.inventoryFetching) {
            // this.props.getObjectItems(
            //     page, 
            //     sizePerPage, 
            //     this.state.key, 
            //     sortField, 
            //     sortOrder, 
            //     sortField ? sortField.split('-').length > 0 : false,
            //     filtersActive);
            this.props.getInventory(
                page, 
                sizePerPage, 
                filtersActive,
                { field: sortField, order: sortOrder },
                sortField ? sortField.split('-').length > 0 : false, 
            );
            this.setState({
                sortField: sortField,
                sortOrder: sortOrder,
                afterFilter: true
            });
        } else if (type === 'filter') {
            this.props.getInventory(
                page, 
                sizePerPage, 
                Object.entries(filters).map(el => { return { field: el[0], value: el[1].filterVal }; }),
                { field: sortField, order: sortOrder },
                sortField ? sortField.split('-').length > 0 : false, 
            );
            this.setState({
                filters: filters
            })
        }     
    }

    _setTableOption(){ 
        if(!this.props.search.inventoryFetching){
          return "No expenses found";
        }else{
          return(
            <>loading</>
          );
        }
    }

    closeSidebar() { this.setState({ filter_sidebar_show: false }); }

    openSidebar() { this.setState({ filter_sidebar_show: true }); }

    filterInventory(filters, checkbox_offices, checkbox_buildings, checkbox_floors, desk_status) {
        this.props.getInventory(
            this.state.page, 
            this.state.sizePerPage, 
            filters,
            { field: this.state.sortField, order: this.state.sortOrder },
            this.state.sortField_m
        );
        this.setState({
            filtersVal: filters,
            checkbox_offices: checkbox_offices,
            checkbox_buildings: checkbox_buildings,
            checkbox_floors: checkbox_floors,
            desk_status: desk_status
        })
    }

    render() {
        const { sizePerPage, page, sortField, sortOrder, filter_sidebar_show, firstLoad, filtersVal } = this.state;
        const { user, search } = this.props;
        const today = moment();
        const filtered_inventory = search.inventory ? search.inventory.items : [];
        const notactive_options = [ 
            { id: 0, name: strings.not_safe }, 
            { id: 1, name: strings.to_warehouse },
            { id: 2, name: strings.to_employee },
            { id: 3, name: strings.to_junk }
        ];
        const columns = [
            {
                dataField: 'city_name',
                text:      strings.city_name,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    return <span>{!!cell ? cell : "-" }</span>;
                }  
            }, {
                dataField: 'building_name',
                text:      strings.buildingname,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    return <span>{!!cell ? cell : "-" }</span>;
                }  
            }, {
                dataField: 'floor_name',
                text:      strings.floorname,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    return <span>{!!cell ? cell : "-" }</span>;
                }  
            }, {
                dataField: 'location_name',
                text:      strings.locationname,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    return <span>{!!cell ? cell : "-" }</span>;
                }  
            }, {
                dataField: 'name',
                text:      strings.name,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    return <a className="place_link" href={`/floors/${row.floor_id}?object_id=${row.id}&search=true`}>{cell}</a>;
                }  
            }, {
                dataField: 'status',
                text:      strings.status,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    const na_status = cell == oi_type.NOT_ACTIVE 
                        ? row.meta_info.find(mi => mi.metafieldid == app_settings.NOTACTIVE_DESK_ID).metavalue
                        : null;
                    const s_status = cell == oi_type.SHARING 
                    ? row.meta_info.find(mi => mi.metafieldid == app_settings.DS_READY_ID)
                    : null;
                    return <span>{ !!cell 
                                ? na_status 
                                    ? `${cell} \n${notactive_options.find(no => no.id == parseInt(na_status)).name}` 
                                    : s_status && s_status.metavalue == 'on'
                                        ? `${cell} \n${s_status.metaname}`
                                        : cell 
                                : "-" 
                           }</span>;
                }  
            }, {
                dataField: `${app_settings.DESKNUM_ID}-${app_settings.ENTITY_TYPE}`,
                text:      strings.desknum,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    if (row.meta_info && row.meta_info.length > 0) {
                        let desknum_id = row.meta_info.find(mi => mi.metafieldid == app_settings.DESKNUM_ID)
                        return !!desknum_id ? desknum_id.metavalue !== null ? desknum_id.metavalue : '-' : '-';
                    } else {
                        return '-';
                    }
                },
            }, {
                dataField: `${app_settings.TYMBNUM_ID}-${app_settings.ENTITY_TYPE}`,
                text:      strings.tumbnum,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    if (row.meta_info && row.meta_info.length > 0) {
                        let tymbnum_id = row.meta_info.find(mi => mi.metafieldid == app_settings.TYMBNUM_ID)
                        return !!tymbnum_id ? tymbnum_id.metavalue !== null ? tymbnum_id.metavalue : '-' : '-';
                    } else {
                        return '-';
                    }
                },
            }, {
                dataField: `${app_settings.DOCSTATION_ID}-${app_settings.ENTITY_TYPE}`,
                text:      strings.docstation,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    if (row.meta_info && row.meta_info.length > 0) {
                        let docstation_id = row.meta_info.find(mi => mi.metafieldid == app_settings.DOCSTATION_ID)
                        return !!docstation_id ? docstation_id.metavalue !== null ? docstation_id.metavalue : '-' : '-';
                    } else {
                        return '-';
                    }
                },
            }, {
                dataField: `${app_settings.MONITOR1_ID}-${app_settings.ENTITY_TYPE}`,
                text:      strings.monitor1,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    if (row.meta_info && row.meta_info.length > 0) {
                        let monitor1_id = row.meta_info.find(mi => mi.metafieldid == app_settings.MONITOR1_ID)
                        return !!monitor1_id ? monitor1_id.metavalue !== null ? monitor1_id.metavalue : '-' : '-';
                    } else {
                        return '-';
                    }
                },
            }, {
                dataField: `${app_settings.MONITOR2_ID}-${app_settings.ENTITY_TYPE}`,
                text:      strings.monitor2,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    if (row.meta_info && row.meta_info.length > 0) {
                        let monitor2_id = row.meta_info.find(mi => mi.metafieldid == app_settings.MONITOR2_ID)
                        return !!monitor2_id ? monitor2_id.metavalue !== null ? monitor2_id.metavalue : '-' : '-';
                    } else {
                        return "-";
                    }
                },
            }, {
                dataField: 'id',
                text: strings.action,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {                                    
                    return  <Link 
                                to={`/inventory/${cell}`}
                                color="primary"
                                onClick={() => {
                                    localStorage.setItem('inventoryFilters', JSON.stringify({
                                        page: extraData.page,
                                        sizePerPage: extraData.sizePerPage,
                                        sortField: extraData.sortField,
                                        sortOrder: extraData.sortOrder,
                                        sortField_m: extraData.sortField_m,
                                        filtersVal: extraData.filtersVal
                                    }))
                                }}
                            >
                                <img src="/img/pics/edit_icon.svg"></img>
                            </Link>;
                },
                formatExtraData: {
                    page: this.state.page, 
                    sizePerPage: this.state.sizePerPage, 
                    sortField: this.state.sortField, 
                    sortOrder: this.state.sortOrder, 
                    sortField_m: this.state.sortField ? this.state.sortField.split('-').length > 0 : false,
                    filtersVal: this.state.filtersVal
                }
            }
        ];

        if (!search.inventoryFetching && filtered_inventory && filtered_inventory.length > 0 && user && user.loggingIn) {
            const customTotal = (from, to, size) => (
                <span className="react-bootstrap-table-pagination-total">
                  { strings.showing } { strings.from } { from } { strings.to } { to } { strings.of } { size } { strings.results }
                </span>
            );
              
            const RemoteAll = ({ data, page, sizePerPage, onTableChange, totalSize, columns }) => (
                <div className="default-table-style-container table_custom table_custom_with_tabs" >
                    <BootstrapTable
                        remote
                        keyField='id'
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
            
            return (
                <>
                    <div className="container-fluid  overflow-auto with-actions">
                        <div className="container page-title-wrapper" >
                            <h1 id="page-title">{ strings.inventory }</h1>
                        </div>
                        <div className="open_filter_employees_sidebar_button2">
                            <button 
                                className="button-magenta button-simple" 
                                onClick={() => { this.openSidebar(); }}
                            >{strings.filter}</button>
                            <button 
                                className="button-magenta button-simple"
                                onClick={() => { 
                                    return axios.post(
                                        `${config.baseUrl}/search/inventory_all`,
                                        {
                                          page: 0,
                                          per_page: 0,
                                          filters: filtersVal,
                                          sorting: { field: this.state.sortField, order: this.state.sortOrder },
                                          meta_sort: sortField ? sortField.split('-').length > 0 : false,
                                          as_file: true
                                        }, { headers: { Authorization: localStorage.getItem('auth_token') }, responseType: 'blob' },)                                     
                                        .then(response => {
                                            if (!window.navigator.msSaveOrOpenBlob) {
                                                // BLOB NAVIGATOR
                                                const url = window.URL.createObjectURL(new Blob([response.data]));
                                                const link = document.createElement('a');
                                                link.href = url;
                                                link.setAttribute('download', `inventory.xls`);
                                                document.body.appendChild(link);
                                                link.click();
                                            } else {
                                                // BLOB FOR EXPLORER 11
                                                const url = window.navigator.msSaveOrOpenBlob(new Blob([response.data]), `inventory.xls`);
                                            }
                                        }).catch(error => { throw(error); });
                                }}
                            >{strings.download}</button>
                        </div>  
                        <div className="container neomorph-card mt-2">
                            <RemoteAll
                                data={ filtered_inventory }
                                page={ page }
                                sizePerPage={ sizePerPage }
                                totalSize={ search.inventory ? search.inventory.count : 0 }
                                onTableChange={ this.handleTableChange }
                                columns={columns}
                            /> 
                        </div>                    
                    </div>                  
                    <InventoryFilterSidebar 
                        {...this.props} 
                        lang={this.props.lang} 
                        filter_sidebar_show={filter_sidebar_show} 
                        filterInventory={this.filterInventory}
                        closeSidebar={this.closeSidebar} 
                        checkbox_offices={this.state.checkbox_offices}
                        checkbox_buildings={this.state.checkbox_buildings}
                        checkbox_floors={this.state.checkbox_floors}
                        desk_status={this.state.desk_status}
                    />   
                </>
            );
        } else if (search.inventoryFetching){
            return(
                <div className="container-fluid  overflow-auto with-actions">
                    <div className="container page-title-wrapper" >
                        <Loading/>
                    </div>
                </div>
            );
        } else {
            return(
                <div className="container-fluid  overflow-auto with-actions">
                    <div className="container page-title-wrapper" >{strings.noemployees}
                    </div>
                    <InventoryFilterSidebar 
                        {...this.props} 
                        lang={this.props.lang} 
                        filter_sidebar_show={filter_sidebar_show} 
                        filterInventory={this.filterInventory}
                        closeSidebar={this.closeSidebar} 
                        checkbox_offices={this.state.checkbox_offices}
                        checkbox_buildings={this.state.checkbox_buildings}
                        checkbox_floors={this.state.checkbox_floors}
                        desk_status={this.state.desk_status}
                    />  
                    <div className="open_filter_employees_sidebar_button2">
                        <button 
                            className="button-magenta button-simple" 
                            onClick={() => { this.openSidebar(); }}
                        >{strings.filter}</button>
                    </div> 
                </div>
            );
        }
    }
}

const mapStateToProps = state => {
    return {
        search: state.search,
        user:   state.user,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getInventory: ( page, ppp, filters, sorting, meta_sort) => dispatch(getInventory(page, ppp, filters, sorting, meta_sort)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Inventory);