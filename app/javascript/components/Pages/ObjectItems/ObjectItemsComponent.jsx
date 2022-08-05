import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios'; 
import * as config from '../../../config/config';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, Comparator } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Tabs, Tab } from 'react-bootstrap';
import { Button, Label } from 'reactstrap';

import { getObjectItems, updateObjectItem, removeObjectItem } from '../../../actions/ObjectItemsActions';
import { getObjectTypes } from '../../../actions/ObjectTypesActions';

import Loading from '../Loading/LoadingComponent';

import LocalizedStrings from 'react-localization';

import * as rtc from '../../../constants/RemoteTableColumns';
import * as app_settings from '../../../constants/AppSettings';

import './ObjectItems.css';
import { headerStyles, sortCaretStyle } from '../../../constants/Styles';
import ModalWindow from '../ModalWindow/ModalWindowComponent';
import ObjectItemsFilterSidebar from './ObjectItemsFilterSidebar';

let strings = new LocalizedStrings({
    en:{
        objectitems:"Object Items",
        edit:"Edit",
        add:"Add",
        objectitemname:"Object Item Name",
        floorname:"Floor",
        locationname: "Location",
        buildingname:"Building",
        type:"Type",
        action:"Action",
        showing:"Showing",
        to:"to",
        of:"of",
        results:"Results",
        active: "Active",
        inactive: "Inactive",
        all: "All",
        filter: "Filter",
        building_name: 'Building',
        noresults: "No results",
        reset_filter: "Reset",
        inventory_numer: "Inventory number",
        officename: "Office",
        repairing: "Repairing",
        working: "Works",
        object_state: "State",
        delete: "Delete",
        header: "Delete meta type with name",
        description: "The object will be deleted permanently.",
        yes: "Yes",
        no: "No",
        technique: "Technique",
        service: "Service",
        download: "Download"
    },
    ru: {
        objectitems:"Объекты",
        edit:"Редактировать",
        add:"Добавить",
        objectitemname:"Название Объекта",
        floorname:"Этаж",
        locationname: "Помещение",
        buildingname:"Корпус",
        type:"Тип",
        action:"Действие",
        showing:"Отображено",
        to:"по",
        of:"из",
        results:"всего",
        active: "Активно",
        inactive: "Неактивно",
        all: "Все",
        filter: "Фильтровать",
        building_name: 'Корпус',
        noresults: "Нет результатов",
        reset_filter: "Сбросить",
        inventory_numer: "Инв. №",
        officename: "Бизнес-центр",
        repairing: "В ремонте",
        working: "Работает",
        object_state: "Состояние",
        delete: "Удалить",
        header: "Удалить мета тип с названием",
        description: "Объект будет удален навсегда.",
        yes: "Да",
        no: "Нет",
        technique: "Техника",
        service: "Служебное",
        download: "Скачать"
    },
    de: {
        objectitems:"Objektgegenstände",
        edit:"Bearbeiten",
        add:"Hinzufügen",
        objectitemname:"Objekt Elementname",
        floorname:"Etage Name",
        locationname: "Ortsname",
        buildingname:"Gebäudename",
        type:"Typ",
        action:"Aktion",
        showing:"Zeigen",
        to:"zu",
        of:"von",
        results:"Ergebnisse",
        active: "Aktiv",
        inactive: "Inaktiv",
        all: "Alles",
        filter: "Filter",
        building_name: 'Gebäude',
        noresults: "Keine Ergebnisse",
        reset_filter: "Zurücksetzen",
        inventory_numer: "Inventory number",
        officename: "Office",
        repairing: "Reparieren",
        working: "Funktioniert",
        object_state: "Zustand",
        delete: "Löschen",
        header: "Meta type mit Namen löschen",
        description: "Das Objekt wird dauerhaft gelöscht.",
        yes: "Ja",
        no: "Nein",
        technique: "Technisch",
        service: "Dienst",
        download: "Herunterladen"
    }
});

class ObjectItems extends Component {

    constructor(props) {
        super(props)

        this.state = {
            object_items: this.props.object_items.items ? this.props.object_items.items : this.props.object_items,
            key:          -1,
            page:         1,
            data:         this.props.object_items.items ? this.props.object_items.items.slice(0, 10) : this.props.object_items.slice(0, 10),
            totalSize:    this.props.object_items.items ? this.props.object_items.items.length : this.props.object_items.length,
            sizePerPage:  10,
            tabs:         [],
            sortField:    '',
            sortOrder:    '',
            filtersVal:   [],
            columns:      [],
            afterFilter:  false,
            firstLoad:    false,
            oi_for_deleting: null,
            triggerModal: false,
            filter_sidebar_show: false,
            checkbox_offices: [],
            checkbox_buildings: [],
            checkbox_floors: [],
            status_: [ {header: 'status_fix', value: true}, {header: 'status_work', value: true}]
        }
        
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.closeSidebar            = this.closeSidebar.bind(this);
        this.openSidebar             = this.openSidebar.bind(this);
        this.filterRenderer_         = this.filterRenderer_.bind(this);
        this.handleTabChange         = this.handleTabChange.bind(this);
        this.handleTableChange       = this.handleTableChange.bind(this);
        this.filterObjectItems       = this.filterObjectItems.bind(this);
        this.createIfNotExists       = this.createIfNotExists.bind(this);
    }

    componentDidMount() {
        const parsed_params = queryString.parse(this.props.location.search);
        if (!!this.props.object_items && parsed_params.filters !== 'true')  {
            this.props.getObjectItems(1, 10, -1, null, null, null, []);
            localStorage.setItem("objectItemsFilters", JSON.stringify({
                page: 1,
                sizePerPage: 10,
                key: -1,
                sortField: null,
                sortOrder: null,
                sortField_m: null,
                filtersVal: []
            }));
        } else {
            const objectItemsFilters = JSON.parse(localStorage.getItem("objectItemsFilters"));
            let filtersVal = objectItemsFilters.filtersVal.filter(e => e.value);
            this.props.getObjectItems(
                objectItemsFilters.page, 
                objectItemsFilters.sizePerPage, 
                parseInt(objectItemsFilters.key), 
                objectItemsFilters.sortField, 
                objectItemsFilters.sortOrder, 
                objectItemsFilters.sortField_m,
                filtersVal
            );

            this.setState({
                page: objectItemsFilters.page, 
                sizePerPage: objectItemsFilters.sizePerPage, 
                key: parseInt(objectItemsFilters.key), 
                sortField: objectItemsFilters.sortField, 
                sortOrder: objectItemsFilters.sortOrder,
                filtersVal: filtersVal,
                afterFilter: true,
                firstLoad: true,
                triggerModal: false
            })
        }
        this.props.getObjectTypes();
    }

    componentDidUpdate(prevProps) {
        const { object_items, object_types } = this.props;
        const { page, sizePerPage, tabs, filtersVal, afterFilter, firstLoad } = this.state;
        let filtersVal_ = filtersVal;
        if (object_items !== prevProps.object_items && object_items.items) {  
            this.setState({
                object_items: object_items.items,
                data:         object_items.items.slice(page - 1, sizePerPage),
                totalSize:    object_items.items.count,
                triggerModal: false
            });
        }
        if (tabs.length === 0 && object_types && object_types.length > 0) {
            let tabs = [{name: "All", id: -1}];
            object_types.filter(f => f.active).map(el => { 
                tabs.push({name: el.name, id: el.id}); 
            })
            this.setState({
                tabs: tabs,
                triggerModal: false
            });
        }
        if (object_items !== prevProps.object_items && !object_items.isFetching && !object_types.isFetching || prevProps.lang !== this.props.lang) {
            let columns_ = [{
                id:    -1,
                items: [
                    {
                        dataField: rtc.NAME_FIELD,
                        text: strings.objectitemname,
                        filter: textFilter(),
                        filterRenderer: (onFilter, column) => { return <></>; },
                        sort: true,
                        filter_external: false,
                        sortCaret: sortCaretStyle,
                        headerStyle: headerStyles
                    }, {
                        dataField: rtc.ITEM_SUBTYPE_FIELD,
                        text: strings.type,
                        filter: textFilter(),
                        filterRenderer: (onFilter, column) => { return <></>; },
                        sort: true,
                        filter_external: false,
                        sortCaret: sortCaretStyle,
                        headerStyle: headerStyles,
                        formatter: (cell, row, rowIndex, extraData) => {                          
                            return <>{cell.length > 13 ? cell.substring(0, 13) + '...' : cell}</>;
                        },
                    }, {
                        dataField: `${app_settings.DESKNUM_ID}-ObjectItem`,
                        text: strings.inventory_numer,
                        filter: textFilter(),
                        filterRenderer: (onFilter, column) => { return <></>; },
                        // sort: true,
                        filter_external: true,
                        // sortCaret: sortCaretStyle,
                        headerStyle: headerStyles,
                        formatter: (cell, row, rowIndex, extraData) => {
                            const inv_num = row.meta_info && row.meta_info.length > 0 
                                ? row.meta_info.find(mi => mi.metafieldid == app_settings.DESKNUM_ID)
                                : '';                            
                            return <>{inv_num !== undefined && !!inv_num.metavalue ? inv_num.metavalue : '-'}</>;
                        },
                    }, {
                        dataField: rtc.OFFICE_NAME_FIELD,
                        text: strings.officename,
                        filter: textFilter(),
                        filterRenderer: (onFilter, column) => { return <></>; },
                        sort: true,
                        filter_external: false,
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
                        filter_external: false,
                        sortCaret: sortCaretStyle,
                        headerStyle: headerStyles,
                        formatter: (cell, row, rowIndex, extraData) => {                          
                            return <>{cell.length > 13 ? cell.substring(0, 13) + '...' : cell}</>;
                        },
                    }, {
                        dataField: rtc.LOCATION_NAME_FIELD,
                        text: strings.locationname,
                        filter: textFilter(),
                        filterRenderer: (onFilter, column) => { return <></>; },
                        sort: true,
                        filter_external: false,
                        sortCaret: sortCaretStyle,
                        headerStyle: headerStyles
                    }, {
                        dataField: `${app_settings.OBJECT_STATE_ID}-ObjectItem`,
                        text: strings.object_state,
                        filter: textFilter(),
                        filterRenderer: (onFilter, column) => { return <></>; },
                        // sort: true,
                        filter_external: false,
                        // sortCaret: sortCaretStyle,
                        headerStyle: headerStyles,
                        formatter: (cell, row, rowIndex, extraData) => {
                            const obj_state = row.meta_info && row.meta_info.length > 0 
                                ? row.meta_info.find(mi => mi.metafieldid == app_settings.OBJECT_STATE_ID)
                                : '';                           
                            return <>{obj_state == undefined || obj_state.metavalue == 'off' || !!!obj_state.metavalue
                                        ? strings.working
                                        : strings.repairing}
                                   </>;
                        },
                    }, {
                        dataField: 'id',
                        text: strings.action,
                        sortCaret: sortCaretStyle,
                        headerStyle: headerStyles,
                        formatter: (cell, row, rowIndex, extraData) => {
                            return <>
                                        <Link to={`/objects/${cell}`} className="edit_object_item_btn" >
                                            <img 
                                                src="/img/pics/edit_button.svg"
                                                style={{ display: 'block' }}
                                                onClick={() => {
                                                    localStorage.setItem('objectItemsFilters', JSON.stringify({
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
                                        </Link>
                                        <img 
                                            className="delete_object_item_btn" 
                                            src="/img/pics/delete_button.svg"
                                            style={{ display: 'block' }}
                                            onClick={() => { this.setState({ oi_for_deleting: row, triggerModal: true }) }}
                                        ></img>
                                    </>;
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
            filtersVal_ = this.createIfNotExists(filtersVal_, rtc.NAME_FIELD, strings.objectitemname, -1)
            filtersVal_ = this.createIfNotExists(filtersVal_, rtc.ITEM_SUBTYPE_FIELD, strings.type, -1)
            filtersVal_ = this.createIfNotExists(filtersVal_, rtc.FLOOR_NAME_FIELD, strings.floorname, -1)
            filtersVal_ = this.createIfNotExists(filtersVal_, rtc.BUILDING_NAME_FIELD, strings.buildingname, -1)
            filtersVal_ = this.createIfNotExists(filtersVal_, `${app_settings.DESKNUM_ID}-ObjectItem`, strings.inventory_numer, -1)
            if (object_types && !object_types.isFetching && object_items && !object_items.isFetching) {
                object_types.filter(f => f.active).map(el => { 
                    let meta_columns_found = false;
                    columns_.push({
                        id: el.id,
                        items: [
                            {
                                dataField: rtc.NAME_FIELD,
                                text: strings.objectitemname,
                                filter: textFilter(),
                                filterRenderer: (onFilter, column) => { return <></>; },
                                sort: true,
                                filter_external: false,
                                sortCaret: sortCaretStyle,
                                headerStyle: headerStyles
                            }, {
                                dataField: rtc.ITEM_SUBTYPE_FIELD,
                                text: strings.type,
                                filter: textFilter(),
                                filterRenderer: (onFilter, column) => { return <></>; },
                                sort: true,
                                filter_external: false,
                                sortCaret: sortCaretStyle,
                                headerStyle: headerStyles,
                                formatter: (cell, row, rowIndex, extraData) => {                          
                                    return <>{cell.length > 13 ? cell.substring(0, 13) + '...' : cell}</>;
                                },
                            }, {
                                dataField: `${app_settings.DESKNUM_ID}-ObjectItem`,
                                text: strings.inventory_numer,
                                filter: textFilter(),
                                filterRenderer: (onFilter, column) => { return <></>; },
                                sort: true,
                                filter_external: true,
                                sortCaret: sortCaretStyle,
                                headerStyle: headerStyles,
                                formatter: (cell, row, rowIndex, extraData) => {
                                    const inv_num = row.meta_info && row.meta_info.length > 0 
                                        ? row.meta_info.find(mi => mi.metafieldid == app_settings.DESKNUM_ID)
                                        : '';                            
                                    return <>{inv_num !== undefined && !!inv_num.metavalue ? inv_num.metavalue : '-'}</>;
                                },
                            }, {
                                dataField: rtc.OFFICE_NAME_FIELD,
                                text: strings.officename,
                                filter: textFilter(),
                                filterRenderer: (onFilter, column) => { return <></>; },
                                sort: true,
                                filter_external: false,
                                sortCaret: sortCaretStyle,
                                headerStyle: headerStyles
                            }, {
                                dataField: rtc.BUILDING_NAME_FIELD,
                                text: strings.building_name,
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
                                filter_external: false,
                                sortCaret: sortCaretStyle,
                                headerStyle: headerStyles,
                                formatter: (cell, row, rowIndex, extraData) => {                          
                                    return <>{cell.length > 13 ? cell.substring(0, 13) + '...' : cell}</>;
                                },
                            }, {
                                dataField: `${app_settings.OBJECT_STATE_ID}`,
                                text: strings.object_state,
                                filter: textFilter(),
                                filterRenderer: (onFilter, column) => { return <></>; },
                                sort: true,
                                filter_external: false,
                                sortCaret: sortCaretStyle,
                                headerStyle: headerStyles,
                                formatter: (cell, row, rowIndex, extraData) => {
                                    const obj_state = row.meta_info && row.meta_info.length > 0 
                                        ? row.meta_info.find(mi => mi.metafieldid == app_settings.OBJECT_STATE_ID)
                                        : '';                            
                                    return <>{obj_state == undefined || obj_state.metavalue == 'off' || !!!obj_state.metavalue
                                                ? strings.working
                                                : strings.repairing}
                                           </>;
                                },
                            }
                        ]
                    })
                    filtersVal_ = this.createIfNotExists(filtersVal_, rtc.NAME_FIELD, strings.objectitemname, el.id)
                    filtersVal_ = this.createIfNotExists(filtersVal_, rtc.ITEM_SUBTYPE_FIELD, strings.type, el.id)
                    filtersVal_ = this.createIfNotExists(filtersVal_, rtc.FLOOR_NAME_FIELD, strings.floorname, el.id)
                    filtersVal_ = this.createIfNotExists(filtersVal_, rtc.BUILDING_NAME_FIELD, strings.buildingname, el.id)
                    filtersVal_ = this.createIfNotExists(filtersVal_, `${app_settings.DESKNUM_ID}-ObjectItem`, strings.objectitemname, el.id)

                    columns_ = columns_.map((column) => {
                        if ( column && el && column.id === el.id && object_items && object_items.items) {
                            object_items.items.map((object) => {      
                                if (object.meta_info && object.meta_info.length > 0 && !meta_columns_found) {
                                    meta_columns_found = true;
                                    object.meta_info.map((l, index) => {
                                        if (l.show_in_management) {
                                            filtersVal_.push({ field: `${l.metafieldid}-${l.entitytype}`, value: null, tabId: el.id, preview: l.metaname });
                                            column.items.push({
                                                dataField: `${l.metafieldid}-${l.entitytype}`,
                                                text:      l.metaname,
                                                filter:    textFilter(),
                                                sortCaret: sortCaretStyle,
                                                headerStyle: headerStyles,
                                                filterRenderer: (onFilter, column) => { return <></>; },
                                                sort:      true,
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
                                        // } else if (parseInt(l.metafieldid) == parseInt(app_settings.OBJECT_STATE_ID)) {
                                        //     console.log("l.metafieldid == app_settings.OBJECT_STATE_ID")
                                        //     column.items = column.items.map(ci => {
                                        //         let item_ci = ci;
                                        //         if (ci.dataField == l.metafieldid) {
                                        //             item_ci.dataField = `${l.metafieldid}-${l.entitytype}`;
                                        //         }
                                        //         return item_ci;
                                        //     })
                                        // } else if (l.metafieldid == app_settings.DESKNUM_ID) {
                                        //     column.items = column.items.map(ci => {
                                        //         let item_ci = ci;
                                        //         if (ci.dataField == l.metafieldid) {
                                        //             item_ci.dataField = `${l.metafieldid}-${l.entitytype}`;
                                        //         }
                                        //         return item_ci;
                                        //     })
                                        }
                                    })
                                }
                            })
                            return column;
                        } else {
                            return column;
                        }
                    })
                    columns_ = columns_.map((column) => {
                        if ( column.id === el.id ) {
                            column.items.push({
                                dataField: 'id',
                                text: strings.action,
                                sortCaret: sortCaretStyle,
                                headerStyle: headerStyles,
                                formatter: (cell, row, rowIndex, extraData) => {                                    
                                    return  <>
                                                <Link to={`/objects/${cell}`} className="edit_object_item_btn" >
                                                    <img 
                                                        src="/img/pics/edit_button.svg"
                                                        style={{ display: 'block' }}
                                                        onClick={() => {
                                                            localStorage.setItem('objectItemsFilters', JSON.stringify({
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
                                                </Link>
                                                <img 
                                                    className="delete_object_item_btn" 
                                                    src="/img/pics/delete_button.svg"
                                                    style={{ display: 'block' }}
                                                    onClick={() => { this.setState({ oi_for_deleting: row, triggerModal: true }) }}
                                                ></img>
                                            </>;
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
                columns: columns_,
                filtersVal: afterFilter
                    ? firstLoad
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
                firstLoad: false,
                triggerModal: false
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
                        id={`text-filter-column-${column}-${tabId}-${Math.random()}`}
                        defaultValue={fv ? fv.value : ""}
                        meta={true}
                        placeholder={fv ? fv.preview : ""}
                    />
                </Label>
    }

    createIfNotExists(filtersVal, field, preview, tabId) {
        if (filtersVal.find(f => f.tabId == tabId && f.field == field) == undefined) {
            filtersVal.push({ field: field, value: null, tabId: tabId, preview: preview });
        }
        return filtersVal;
    }

    notify = () => {
        toast.success("Changes Saved!", {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    handleTabChange(key) {
        this.props.getObjectItems(1, 10, key);
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
            this.props.getObjectItems(
                page, 
                sizePerPage, 
                this.state.key, 
                sortField, 
                sortOrder, 
                sortField ? sortField.split('-').length > 0 : false,
                filtersActive);
            let result = this.props.object_items.items;
            this.setState({
                page: page,
                data: result.slice(currentIndex, currentIndex + sizePerPage),
                totalSize: this.props.object_items.count,
                sizePerPage,
                afterFilter: true
            });
        } else if (type === 'sort' && (sortField !== this.state.sortField || sortOrder !== this.state.sortOrder) && 
                !this.props.object_items.isFetching) {
            this.props.getObjectItems(
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
            this.props.getObjectItems(
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
        if(!this.props.object_items.isFetching){
          return "No expenses found";
        }else{
          return(
            <>loading</>
          );
        }
      }

    resetFilters() {
        const { page, sizePerPage, key, filtersVal } = this.state;
        this.props.getObjectItems(page, sizePerPage, key);
        localStorage.setItem("objectItemsFilters", JSON.stringify({
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

    filterObjectItems(filters, checkbox_offices, checkbox_buildings, checkbox_floors, key_, status_) {
        const { sizePerPage, sortField, sortOrder } = this.state;
        filters = filters.filter(e => e.tabId == key_);
        this.props.getObjectItems(
            1, 
            sizePerPage, 
            key_,
            sortField,
            sortOrder,
            sortField ? sortField.split('-').length > 0 : false,
            filters
        );
        this.setState({
            page: 1,
            filtersVal: filters,
            checkbox_offices: checkbox_offices,
            checkbox_buildings: checkbox_buildings,
            checkbox_floors: checkbox_floors,
            key: key_,
            status_: status_
        })
    }

    render() {
        const { 
            key, 
            sizePerPage, 
            page, 
            tabs, 
            sortField, 
            sortOrder, 
            columns, 
            oi_for_deleting, 
            triggerModal, 
            filter_sidebar_show,
            filtersVal,
        } = this.state;
        const { object_types, object_items } = this.props;

        if (object_types && !object_types.isFetching && object_items && !object_items.isFetching && columns.length > 0) {

            const customTotal = (from, to, size) => (
                <span className="react-bootstrap-table-pagination-total">
                  { strings.showing } { strings.from } { from } { strings.to } { to } { strings.of } { size } { strings.results }
                </span>
            );
            const RemoteAll = ({ data, page, sizePerPage, onTableChange, totalSize, columns }) => (
                <div className="default-table-style-container table_custom table_custom_with_tabs" >
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
                            <div class="page-key"><p id="page-title">{ strings.objectitems}</p></div>
                        </div>
                        <div className="container neomorph-card mt-2">
                            {tab !== undefined ?                            
                                <RemoteAll
                                    data={ object_items.items ? object_items.items : [] }
                                    page={ page }
                                    sizePerPage={ sizePerPage }
                                    totalSize={ object_items.count }
                                    onTableChange={ this.handleTableChange }
                                    columns={ columns.find(el => el.id === tab.id) !== undefined 
                                        ? columns.find(el => el.id === tab.id).items 
                                        : columns[0].items
                                    }
                                />
                                : <></>}
                        </div>
                        <br />
                        <br />
                    </div>
                    <ModalWindow 
                        modalIsOpen={triggerModal}
                        header={
                            <div className="modal-header-1">
                                <div className="close-modal" >
                                    <img className="close-link" src="/img/pics/cross_black.svg" onClick={() => this.setState({ triggerModal: false})}></img>
                                </div>
                                <h2>{strings.header} {oi_for_deleting && oi_for_deleting.name.length > 20 ? `${oi_for_deleting.name.substring(0, 19)}...` : oi_for_deleting ? oi_for_deleting.name : '' }?</h2>
                            </div>
                        }
                        body={
                            <div className="modal-body-1">
                                <p>{strings.description}</p>
                                <div className="modal-buttons">
                                    <Button 
                                        className="button-magenta button_usual btn_small"
                                        onClick={() => { this.props.removeObjectItem(oi_for_deleting.id); this.setState({ triggerModal: false})}}
                                    >{strings.yes}</Button>
                                    <Button 
                                        className="button_usual button_decline btn_small btn_right"
                                        onClick={() => { this.setState({ triggerModal: false})}}
                                    >{strings.no}</Button>
                                </div>
                            </div>
                        }
                    />
                    <ObjectItemsFilterSidebar 
                        {...this.props} 
                        lang={this.props.lang} 
                        filter_sidebar_show={filter_sidebar_show} 
                        filterObjectItems={this.filterObjectItems}
                        closeSidebar={this.closeSidebar} 
                        checkbox_offices={this.state.checkbox_offices}
                        checkbox_buildings={this.state.checkbox_buildings}
                        checkbox_floors={this.state.checkbox_floors}
                        tabs={this.state.tabs}
                        key_={key}
                        status_={this.state.status_}
                        filtersVal={this.state.filtersVal}
                        columns={this.state.columns}
                    />                     
                    <div className="open_filter_employees_sidebar_button2">
                        <button 
                            className="button-magenta button-simple" 
                            onClick={() => { this.openSidebar(); }}
                        >{strings.filter}</button>
                        <button 
                            className="button-magenta button-simple"
                            onClick={() => { 
                                return axios.get(
                                    `${config.baseUrl}/object_items?page=0&per_page=0&type_id=${key ? key : ''}&sort_field=${sortField ? sortField : ''}&sort_order=${sortOrder ? sortOrder : ''}&meta_sort=${sortField ? sortField.split('-').length > 0 : false ? sortField ? sortField.split('-').length > 0 : false : ''}&filters=${JSON.stringify(filtersVal.filter(e => e.tabId == key) ? filtersVal.filter(e => e.tabId == key) : [])}&as_file=true`,
                                    { headers: { Authorization: localStorage.getItem('auth_token') }, responseType: 'blob' },)                               
                                    .then(response => {
                                        if (!window.navigator.msSaveOrOpenBlob) {
                                            // BLOB NAVIGATOR
                                            const url = window.URL.createObjectURL(new Blob([response.data]));
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.setAttribute('download', `object_items.xls`);
                                            document.body.appendChild(link);
                                            link.click();
                                        } else {
                                            // BLOB FOR EXPLORER 11
                                            const url = window.navigator.msSaveOrOpenBlob(new Blob([response.data]), `object_items.xls`);
                                        }
                                    }).catch(error => { throw(error); });
                            }}
                        >{strings.download}</button>
                    </div> 
                </>
            );
        } else if (object_items.isFetching || object_types.isFetching) { 
            return(<Loading/>);
        } else { return(
            <>
                <ObjectItemsFilterSidebar 
                    {...this.props} 
                    lang={this.props.lang} 
                    filter_sidebar_show={filter_sidebar_show} 
                    filterObjectItems={this.filterObjectItems}
                    closeSidebar={this.closeSidebar} 
                    checkbox_offices={this.state.checkbox_offices}
                    checkbox_buildings={this.state.checkbox_buildings}
                    checkbox_floors={this.state.checkbox_floors}
                    tabs={this.state.tabs}
                    key_={key}
                    status_={this.state.status_}
                    filtersVal={this.state.filtersVal}
                    columns={this.state.columns}
                /> 
                <div className="open_filter_employees_sidebar_button2">
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
        object_items: state.object_items,
        object_types: state.object_types
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getObjectItems: (page, ppp, type_id, sortField, sortOrder, meta_sort, filters) => dispatch(getObjectItems(page, ppp, type_id, sortField, sortOrder, meta_sort, filters)),
        updateObjectItem: object_item => dispatch(updateObjectItem(object_item)),
        getObjectTypes: () => dispatch(getObjectTypes()),
        removeObjectItem: (id) => dispatch(removeObjectItem(id))
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(ObjectItems);