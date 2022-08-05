import React, { Component } from 'react';
import { connect }          from "react-redux";

import { Link }             from 'react-router-dom';

import ReactTooltip         from 'react-tooltip';

import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Row, Col } from 'reactstrap';

import queryString          from 'query-string';
import { toast }            from 'react-toastify';
import moment               from 'moment';

import { 
    selectNewElement, 
    setCostcentersToShow, 
    setProjectsToShow, 
    setProjectsBacklight, 
    setCostcentersBacklight, 
    setShowLocationNames,
    setShowDsLight,
    costcetnersBacklightChanged, 
    projectsBacklightChanged,
    getFloorDetails,
    setShowObjects,
    setShowDeskType,
    setSidebarMarkUpState,
    setShowObjectsNames 
}                                    from '../../../../actions/FloorActions';
import { getProfile, updateProfile } from '../../../../actions/ProfileActions';
import { addBooking }                from '../../../../actions/BookingsActions';

import SidebarObjectForm from './SidebarObjectFormComponent';

import * as rbac     from '../../../../rbac/rbac';
import * as rights   from '../../../../constants/Rights';
import * as statuses from '../../../../constants/ObjectItemsStatus';
import * as appSettings from '../../../../constants/AppSettings';

import './InfoSidebarComponent.css';

import LocalizedStrings from 'react-localization';
import AttributesView   from '../../../Elements/Attributes/AttributesView';
import AttributesForm   from '../../../Elements/Attributes/AttributesForm';
import ImageProvider    from '../../../Elements/ImageProvider/ImageProvider';
import Loading          from '../../Loading/LoadingComponent';

let strings = new LocalizedStrings({
    en:{
        comment:"Comment",
        uploadImage: "Choose image",
        save: "Save",
        costcenters: "Costcenters",        
        costcenters: "Costcenter: ",
        projects: "Projects",
        projects_: "Projects:",
        project: "Project: ",
        backlight: "Markup",
        select_all: "Select All",
        floor: "Floor",
        confirmbooking: "Confirm booking",
        yes: "Yes",
        no: "No",
        copy: "Copy to clipboard",
        user_avatar: "Employee photo",
        desk: "Desk: ",
        show_location_names: "Show room names",
        show_ds_light: "Places available for me to book",
        show_object_items: "Show all object items",
        show_object_names: "Show object names",
        locations: "Locations",
        all: "All: ",
        desks: "Desks",
        d_sharing: "Sharing: ",
        d_employee: "Employee: ",
        d_guest: "Guest: ",
        d_reserved: "Reserved: ",
        header: "Period",   
        desk_name: "Desk name",
        copied: "copied to clipboard",
        copied2: "copied to clipboard",
        employee_mail: "Employee email",
        no_work_type:      "Not selected",
        hybrid:            "Hybrid",
        flex:              "Flex",    
        dekret:            "Decree",
        flex_desc:         "You work mainly from the office, you have a fixed workplace, and you can <br />periodically work from home in agreement with the manager. You decide how<br /> to distribute equipment (hardware) between the office and home.",
        hybrid_desc:       "You work mainly from home. For office work, you can book a shared desk in<br /> the area of ​​your project. With the support of the company, you transport<br /> equipment and all personal belongings from the office home. You do not <br />waste time on the road, but if you need to meet with colleagues <br />personally - meeting rooms and a shared desk at your service.",
        no_work_type_desc: "Work type not selected.", 
        dekret_desc:       "Decree",
        worktype:          "Work type",
        reserve:           "Reserve",
        status:            "Desk status",        
        place: "Place: ",
        free: " free",
        not_free: " booked",
        attached: " attached to"
    },
    ru: {
        comment:"Комментарий",
        uploadImage: "Выбрать фото",
        save: "Сохранить",
        costcenters: "МВЗ",
        costcenter: "МВЗ: ",
        projects: "Проекты",
        projects_: "Проекты: ",
        project: "Проект: ",
        backlight: "Разметка",
        select_all: "Выбрать Всё",
        floor: "Этаж",
        confirmbooking: "Подтверждаете бронирование",
        yes: "Да",
        no: "Нет",
        copy: "Скопировать в буфер обмена",
        user_avatar: "Фотография сотрудника",
        desk: "Стол: ",
        show_location_names: "Показать названия помещений",
        show_ds_light: "Места, доступные мне для бронирования",
        show_object_items: "Показать все объекты",
        show_object_names: "Показать названия объектов",
        locations: "Помещения",
        all: "Все: ",
        desks: "Столы",
        d_sharing: "Sharing: ",
        d_employee: "Сотрудник: ",
        d_guest: "Гостевые: ",
        d_reserved: "Резерв: ",
        header:"Бронирование стола ",
        desk_name: "Название стола",
        copied: "скопировано в буфер обмена",
        copied2: "скопировано в буфер обмена",
        employee_mail: "Почта сотрудника",
        no_work_type:      "Не выбран",
        hybrid:            "Hybrid",
        flex:              "Flex",      
        dekret:            "Декрет",      
        flex_desc:         "Вы работаете преимущественно из офиса, за вами закреплено рабочее место, <br />при этом вы можете периодически работать из дома по согласованию с <br />руководителем. Как распределить оборудование («железо») между офисом и <br />домом вы решаете сами.",
        hybrid_desc:       "Вы трудитесь преимущественно из дома. Для работы в офисе вы можете <br />забронировать shared desk в зоне вашего проекта. Оборудование и все личные <br />вещи из офиса вы при поддержке компании перевозите домой. Вы не тратите <br />время на дорогу, а если вам нужно встретиться с коллегами лично – <br />переговорные комнаты и shared desk к вашим услугам.",
        no_work_type_desc: "Тип работы не выбран.",
        dekret_desc:       "Декрет",
        worktype:          "Формат работы",
        reserve:           "Резерв",
        status:            "Статус стола",        
        place: "Место: ",
        free: " свободно",
        not_free: " забронировано",
        attached: " закреплено за"
    },
    de: {
        comment:"Kommentar",
        uploadImage: "Foto auswählen",
        save: "Speichern",
        costcenters: "Kostenstellen",
        costcenters_: "Kostenstellen: ",
        costcenter: "Kostenstelle: ",
        projects: "Projekte",
        project: "Projekt: ",
        backlight: "Markup",
        select_all: "Alles auswählen",
        floor: "Fußboden",
        confirmbooking: "Buchung bestätigen",
        yes: "Ja",
        no: "Nein",
        copy: "In die Zwischenablage kopieren",
        user_avatar: "Mitarbeiterfoto",
        desk: "Schreibtisch: ",
        show_location_names: "Raumnamen anzeigen",
        show_ds_light: "Verfügbare Plätze, die ich buchen kann",
        show_object_items: "Alle Objekte anzeigen",
        show_object_names: "Objektnamen anzeigen",
        locations: "Zimmer",
        all: "Alles: ",
        desks: "Tische",
        d_sharing: "Sharing: ",
        d_employee: "Employee: ",
        d_guest: "Gast: ",
        d_reserved: "Reserviert: ",
        header:"Zeitraum",
        desk_name: "Schreibtischname",
        copied: "in Zwischenablage kopiert",
        copied2: "in die Zwischenablage kopiert",
        employee_mail: "Mitarbeiter-E-Mail",
        no_work_type:      "Nicht ausgewählt",
        hybrid:            "Hybrid",
        flex:              "Flex",       
        dekret:            "Dekret",
        flex_desc:         "Sie arbeiten hauptsächlich vom Büro aus, haben einen festen Arbeitsplatz <br />und können in Absprache mit dem Manager regelmäßig von zu Hause aus <br />arbeiten. Sie entscheiden, wie Geräte (Hardware) zwischen Büro und Zuhause<br /> verteilt werden sollen.",
        hybrid_desc:       "Sie arbeiten hauptsächlich von zu Hause aus. Für Büroarbeiten können Sie <br />einen gemeinsamen Schreibtisch im Bereich Ihres Projekts buchen. Mit <br />Unterstützung des Unternehmens transportieren Sie Geräte und alle <br />persönlichen Gegenstände vom Büro zu Hause aus. Sie tun dies nicht <br />Verschwenden Sie Zeit auf der Straße, aber wenn Sie sich persönlich mit <br />Kollegen treffen müssen - Besprechungsräume und ein gemeinsamer <br />Schreibtisch zu Ihren Diensten.",
        no_work_type_desc: "Auftragstyp nicht ausgewählt.", 
        dekret_desc:       "Dekret",
        worktype:          "Arbeitsformat",
        reserve:           "Reserve",
        status:            "Tabellenstatus",        
        place: "Platz: ",
        free: " frei",
        not_free: " gebucht",
        attached: " angehängt an"
    }
});

class InfoSidebar extends Component {

    notify = (text) => {
        toast.success(text, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        this.state= {
            profileReceived: false,
            activeTab: 'costcenters',
            hovered: false,
            attributes_oi: [],
            employee_parking_profile: false
        }

        this.save = this.save.bind(this);
        this.handleCostcenterShowChange = this.handleCostcenterShowChange.bind(this);
        this.handleProjectShowChange = this.handleProjectShowChange.bind(this);
        this.saveAttributes = this.saveAttributes.bind(this);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        let type_name           = '';
        let owner               = null;
        let { floor }           = this.props;
        let { profileReceived, employee_parking_profile } = this.state;
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
        if (!!floor.selected_item) {
            if (floor.selected_type === 'object') {
                const key = this.props.object_types.findIndex(o => o.id == floor.selected_subtype);
                if (this.props.object_types.length > 0) {
                    type_name = this.props.object_types[key]['name'];
                    owner = null;
                }
                if (floor.selected_item['employee_id'] && floor.selected_item['object_type_id'] === 1
                    && !profileReceived) {
                    this.setState({ profileReceived: true, employee_parking_profile: false });
                    this.props.getProfile(floor.selected_item['employee_id']);
                    owner = floor.selected_item['employee_id'];
                }
                if (!!nextProps.floor.attributes && (!employee_parking_profile || floor.selected_item.id !== nextProps.floor.selected_item.id)) {
                    let attributes_oi = nextProps.floor.attributes.filter(a => a.metable_id == nextProps.floor.selected_item.id && a.metable_type == 'ObjectItem');
                    const p = attributes_oi.find(a => a.meta_field_id == appSettings.PARKING_PLACE_ID && a.value == 'on');
                    const parking = p !== undefined;
                    const e = attributes_oi.find(a => a.meta_field_id == appSettings.EMPLOYEE_SD_ID && !!a.value);
                    const employee = e !== undefined;
                    if (parking && employee && !isNaN(parseInt(e.value))) { this.props.getProfile(parseInt(e.value)); }
                    this.setState({ 
                        attributes_oi: attributes_oi,
                        employee_parking_profile: employee
                    })                    
                }
            }
        }
    }

    onMouseEnter = e => {
        this.setState({ hovered: true });
    };

    onMouseLeave = e => {
        this.setState({ hovered: false });
    };

    toggle = (tab, selected_all) => {
        const { floor } = this.props;
        if (this.state.activeTab !== tab) {
            this.setState({ activeTab: tab }, () => {
                if (tab === 'projects') {
                    this.props.setProjectsBacklight(true);
                    this.props.setCostcentersBacklight(false);
                    this.props.setShowDeskType({
                        tab_active: false,
                        sharing: floor.show_desk_type.sharing,
                        employee: floor.show_desk_type.employee,
                        reserved: floor.show_desk_type.reserved,
                        guest: floor.show_desk_type.guest
                    }) 
                } else if (tab === 'costcenters') {
                    this.props.setCostcentersBacklight(true);
                    this.props.setProjectsBacklight(false);
                    this.props.setShowDeskType({
                        tab_active: false,
                        sharing: floor.show_desk_type.sharing,
                        employee: floor.show_desk_type.employee,
                        reserved: floor.show_desk_type.reserved,
                        guest: floor.show_desk_type.guest
                    }) 
                } else if (tab === 'floor') {
                    this.props.setCostcentersBacklight(false);
                    this.props.setProjectsBacklight(false);
                    this.props.setShowDeskType({
                        tab_active: true,
                        sharing: floor.show_desk_type.sharing,
                        employee: floor.show_desk_type.employee,
                        reserved: floor.show_desk_type.reserved,
                        guest: floor.show_desk_type.guest
                    }) 
                }
            });
            
        }
    }

    handleProjectShowChange(id) {
        let deselected_all = 0;
        this.props.setProjectsToShow(this.props.floor.projects.map(e => {
            if (e.project_id === id) {
                e.show = !e.show;
            }
            if (!e.show) { deselected_all++; }
            return e;
        }));
        if (deselected_all === this.props.floor.projects.length) {
            this.props.setProjectsBacklight(false);
        } else {
            this.props.setProjectsBacklight(true);
        }
    }

    handleCostcenterShowChange(id) {
        let deselected_all = 0;
        const costcenter_num = this.props.floor.costcenters.filter(c => this.props.floor.object_items.find(oi => oi.costcenter_num === c.attributes.number) !== undefined);
        this.props.setCostcentersToShow(this.props.floor.costcenters.map(e => {
            if (e.id === id) {
                e.show = !e.show;
            }
            if (!e.show) { deselected_all++; }
            return e;
        }));

        if (deselected_all === costcenter_num) {
            this.props.setCostcentersBacklight(false);
        } else {
            this.props.setCostcentersBacklight(true);
        }
    }

    closeSidebarClick() {
        this.props.selectNewElement({data: { type: null, data: { id: -1 } }, employee_parking_profile: false });
        this.props.setSidebarMarkUpState(false);
    }

    save(data) {
        this.props.updateProfile(this.props.profile.item, data.image);
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text);
    }

    toggleHighlight() {
        const { floor } = this.props;
        if (this.state.activeTab == 'projects') {
            this.props.projectsBacklightChanged();
            this.props.setShowDeskType({
                tab_active: false,
                sharing: floor.show_desk_type.sharing,
                employee: floor.show_desk_type.employee,
                reserved: floor.show_desk_type.reserved,
                guest: floor.show_desk_type.guest
            }) 
        }
        else if (this.state.activeTab == 'costcenters') {
            this.props.costcetnersBacklightChanged();
            this.props.setShowDeskType({
                tab_active: false,
                sharing: floor.show_desk_type.sharing,
                employee: floor.show_desk_type.employee,
                reserved: floor.show_desk_type.reserved,
                guest: floor.show_desk_type.guest
            }) 
        } else if (this.state.activeTab == 'floor') {            
            this.props.setShowDeskType({
                tab_active: true,
                sharing: floor.show_desk_type.sharing,
                employee: floor.show_desk_type.employee,
                reserved: floor.show_desk_type.reserved,
                guest: floor.show_desk_type.guest
            }) 
        }
    }

    saveAttributes() {
        if (!!this.attributes) {
            this.attributes.saveAttributes();
        }
    }

    render() {
        let type_name           = '';
        let item_name           = '';
        let owner               = null;
        let costcenters         = [];
        let projects            = []
        let user_rights         = [];
        let { 
            floor, 
            profile, 
            user, 
            lang,
            location_types,
            object_types,
            bookings
        }                       = this.props;
        let { 
            attributes_oi,
            employee_parking_profile 
        }                       = this.state;
        const parsed_params     = queryString.parse(this.props.location.search);
        const object_id         = floor.selected_item ? floor.selected_item.id : null;
        const book_from         = parsed_params.book_from;
        const book_to           = parsed_params.book_to;
        const emp               = parsed_params.employee;
        const switchState       = parsed_params.switchState;
        const building_id_p     = parsed_params.building_id;
        const office_id_p       = parsed_params.office_id;
        let costcenters_number  = 0;
        let costcenters_num_s   = 0;
        let projects_num_s      = 0;
        let parking             = false;
        let employee_parking_id = null;
        let occupied_tomorrow   = false;
        let checked             = false;
        if (!!floor.selected_item) {
            if (floor.selected_type === 'object') {
                const key = object_types.findIndex(o => o.id == floor.selected_subtype);
                if (object_types.length > 0) {
                    type_name = object_types[key]['name'];
                    owner = null;
                }
                if (floor.selected_item['employee_id'] && floor.selected_item['object_type_id'] === 1
                    && profile.isFetching) {
                    owner = { isFetching: false,  item: floor.selected_item['employee_id'] };
                }
            }
            if (floor.selected_type === 'location') {
                const key = location_types.findIndex(o => o.id == floor.selected_subtype);
                if (location_types.length > 0) {
                    if (!!location_types[key]) {
                        type_name = location_types[key]['name'];
                    }
                    owner = null;
                }
            }

            item_name = floor.selected_item['name'];
        }

        if (profile && profile.item && !profile.isFetching && floor.selected_item && floor.selected_item['employee_id'] 
            && floor.selected_item['object_type_id'] === 1) {
            owner = profile;
        }
        
        costcenters = !!floor.costcenters ? floor.costcenters
            .filter(c => floor.object_items.find(oi => oi.costcenter_num == c.attributes.number || oi.employee_costcenter_num == c.attributes.number) !== undefined).map(c => {
                costcenters_number++;
                if (c.show) { costcenters_num_s++; }
                return c;
            })
            : floor.costcenters;

        if ((!!floor && floor['projects']) || floor.sidebar_markup_state) {
            projects = floor['projects'].map(e => { if(e.show) { projects_num_s++; }; return e;});            
        }

        if (user && user.user && user.user.rights) {
            user_rights = user.user.rights;
        }
        if (!!attributes_oi && attributes_oi.length > 0) {
            const employee_p = attributes_oi.find(a => a.meta_field_id == appSettings.EMPLOYEE_SD_ID && !!a.value);
            employee_parking_id = employee_p !== undefined  && !isNaN(parseInt(employee_p.value)) ? parseInt(employee_p.value) : null;
            let p = attributes_oi.find(a => a.meta_field_id == appSettings.PARKING_PLACE_ID && a.value == 'on');
            parking = p !== undefined;
            let f = floor.attributes ? floor.attributes.find(a => a.metable_type === 'ObjectItem' && a.meta_field_id === appSettings.DS_READY_ID && a.metable_id === floor.selected_item.id) : undefined;
            checked = f !== undefined ? f.value === 'on' : false;   
            const tomorrow_ = moment().add(1, 'd');
            occupied_tomorrow = bookings.items && (
                bookings.items.find(b => b.object_item.id == floor.selected_item.id && 
                    Math.ceil(moment(b.book_from).diff(tomorrow_, 'days', true) <= 0) && 
                    Math.ceil(moment(b.book_to).diff(tomorrow_, 'days', true)) >= 0
                ) !== undefined 
            );  
        }
        return (
            
            <div id="InfoSidebar"
                className={(floor.selected_type === 'object')
                    || (floor.selected_type === 'location') || (floor.sidebar_markup_state) ? "" : "d-none"}>
                
                    <div id="closeSidebar" onClick={() => this.closeSidebarClick()}>
                        <img id="close_icon" src="/img/pics/close_sidebar.svg"></img>
                    </div>  
                {!!floor.selected_item && !floor.sidebar_markup_state ? 
                    <>
                        
                        { (floor.selected_item['object_type_id'] === 1 && (floor.selected_item['status'] === "SHARING" || floor.selected_item['status'] === "RESERVED" || floor.selected_item['status'] === "NOT_ACTIVE")) || 
                          floor.selected_item['object_type_id'] !== 1 ?
                            <div className="selected-name inline-element"  >
                                <div className="inline-element one_space_right">{parking ? strings.place : type_name + ': '}</div>
                                <div className={`inline-element ${!parking ? 'copy_to_clipboard_element' : ''}`} 
                                     onClick={() => {
                                        if (!parking) { 
                                            this.copyToClipboard(item_name); 
                                            this.notify(`${strings.desk_name} ${item_name} ${strings.copied}`);
                                        }
                                     }
                                }>
                                    { !!item_name ? item_name : ''}
                                    { !parking 
                                        ? <img className="inline-element copy_to_clipboard" src="/img/pics/copy_to_clipboard.svg"></img> 
                                        : employee_parking_profile  
                                            ? <span>{strings.attached}</span>
                                            : occupied_tomorrow
                                                ? <span>{strings.not_free}</span>
                                                : <span>{strings.free}</span>
                                    }
                                </div>                                
                            </div>
                            : <></>
                        }
                        {/* sidebar form  */}
                        { (floor.selected_type === 'location') ?
                            <div>
                                <AttributesView
                                    langChange={this.langChange}
                                    lang={this.props.lang}
                                    type="Location"
                                    maintype="location"
                                    id={ floor.selected_item.id  }
                                />
                            </div>
                        : <></> }
                        { (floor.selected_type === 'object') ?
                            rbac.isSatisfied([rights.VIEW_OBJECT_ITEMS], user_rights) &&
                            rbac.isSatisfied([rights.VIEW_OBJECT_ITEM], user_rights) &&
                            rbac.isSatisfied([rights.UPDATE_OBJECT_ITEM], user_rights) &&
                            rbac.isSatisfied([rights.VIEW_INVENTORY], user_rights) &&                            
                            floor.inventory_mode ?
                             <>
                                <AttributesForm
                                    langChange={this.langChange}
                                    lang={this.props.lang}
                                    type="ObjectItem"
                                    maintype="object"
                                    id={floor.selected_item.id}
                                    onRef={ref => (this.attributes = ref)}
                                    inventorySidebar={true}
                                    parking={parking}
                                    no_title={true}
                                />
                            </> : <>
                                <AttributesView
                                    langChange={this.langChange}
                                    lang={this.props.lang}
                                    type="ObjectItem"
                                    maintype="object"
                                    id={floor.selected_item.id }
                                    parking={parking}
                                    no_title={true}
                                    employee_parking_id={employee_parking_id}
                                />
                            </>
                        : <></> }
                        { floor.selected_item.status === 'RESERVED' && !parking
                            ? <div style={{marginTop: '40px'}}>
                                <div className="other-row">
                                    <div className="element-label">{strings.status}:</div> <div className="element-after"><span>{strings.reserve}</span></div>
                                </div>
                                <div className="other-row">
                                    <div className="element-label">{strings.costcenter}</div> <div className="element-after"><Link className="black_link" to={`/employees_in/${floor.selected_item.costcenter_num}?page_type=costcenters`} >{floor.costcenters.find(c => c.attributes.number == floor.selected_item.costcenter_num).attributes.name}</Link></div>
                                </div>
                              </div>  
                            : <></>
                        }
                        { floor.selected_item.status === 'SHARING' && parseInt(parsed_params.object_id) === object_id &&
                          parsed_params.book_from && parsed_params.book_to && user && user.user && user.user.data && !parking ?
                            <div style={{textAlign: 'center'}}>
                                <p className="title_desk_type">{strings.header}</p>
                                <span className="confrim-booking-text">{strings.confirmbooking}?</span>
                                <div className="button-group-booking">
                                    <Button className="button-magenta booking-button button_usual btn_small" style={{float: 'left'}}>
                                        <Link 
                                            className="booking_link_text" 
                                            to={`/bookings?key=${switchState.toString().toLowerCase() === 'false'  || switchState.toString().toLowerCase() === 'true' && parseInt(emp) !== user.user.data.id ? 'ALL' : 'MY_BOOKINGS'}`} 
                                            onClick={() => { 
                                                localStorage.setItem('show_add_booking_info', `${floor.selected_item.name}_${moment(book_from).format('DD.MM.YYYY')}_${moment(book_to).format('DD.MM.YYYY')}`);
                                                this.props.addBooking(book_from, book_to, emp, switchState, floor.selected_item);
                                            }}
                                        >
                                            {strings.yes}
                                        </Link>
                                    </Button>
                                    <Button className="booking-button button_decline btn_small" style={{marginLeft: '30px'}}>
                                        <Link 
                                            className="booking_link_text" 
                                            to={`/bookings?key=SEARCH&book_from=${book_from}&book_to=${book_to}&object_id=${parsed_params.object_id}&employee=${emp}&switchState=${switchState}&building_id=${building_id_p}&office_id=${office_id_p}`} 
                                        >
                                            {strings.no}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                          : <></>
                        }

                        { !!owner && owner.item !== null && !owner.isFetching && owner.item.id !== -1 && !profile.isFetching && floor.selected_item['employee_id'] && floor.selected_item['object_type_id'] === 1 && !parking ?
                            <>
                                {/* { !!user.user.data ?  */}
                                <div className="image-row">
                                    <ImageProvider
                                        id={null}
                                        updatePicture={this.save}
                                        img_url={owner.item.img_url}
                                        lang={lang}
                                        have_rights={
                                            rbac.isSatisfied([rights.UPDATE_OBJECT_ITEM], user_rights) || 
                                            user && user.user && user.user.data && user.user.data.id === owner.item.id
                                        }
                                    />
                                {/* : <></> } */}
                                </div>

                                <div className="name-row" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                                    <div className="modal-link">
                                        <a href={`webexteams://im?email=${owner.item.email}`}><img src="/img/pics/webex.svg" className="webex"/></a>                                        
                                        <Link className={`profile-link ${this.state.hovered ? 'hovered_link' : ''}`} to={`/profile/${owner.item.id}`}>{owner.item.name}</Link>
                                    </div>
                                </div>
                                <div className="surname-row" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                                    <div className="modal-link">
                                        <a onClick={() => { this.copyToClipboard(owner.item.email);  this.notify(`${strings.employee_mail} ${owner.item.email} ${strings.copied2}`); }} >
                                            <img className="mail_icon" src="/img/pics/mail_icon.svg"/>
                                        </a>
                                        <Link className={`profile-link ${this.state.hovered ? 'hovered_link' : ''}`} to={`/profile/${owner.item.id}`}>{owner.item.surname}</Link>
                                    </div>
                                </div>
                                <div className="project-row">                                    
                                    <div className="element-label one_space_right">{`${owner.item.projects.length > 1 ? strings.projects_ : strings.project} `}</div> 
                                    {owner.item.projects.length > 0 
                                        ? owner.item.projects.map((e, index) => 
                                            <div className={`element-after${index > 0 ? '-2' : ''}`}>
                                                <Link className="black_link" to={`/employees_in/${e.id}?page_type=projects`} >{e.name}</Link>
                                            </div>
                                          )
                                    : <>-</>}
                                </div>                                
                                
                                <div className="other-row">
                                    <div className="element-label">{strings.costcenter}</div> <div className="element-after"><Link className="black_link" to={`/employees_in/${owner.item.costcenter_num}?page_type=costcenters`} >{owner.item.costcenter_name}</Link></div>
                                </div>

                                <div className="other-row">
                                    <div className="element-label one_space_right">{strings.worktype}:</div> 
                                    <div className="element-after">
                                    { owner.item && owner.item.work_type == "F"
                                        ? <span 
                                            className="leader-info-row" 
                                            data-tip={strings.flex_desc} 
                                            data-for="work_type_flex"
                                            data-effect="solid"
                                        >
                                            {strings.flex}
                                        </span>
                                        : owner.item && owner.item.work_type == "H"
                                            ? <span 
                                                className="leader-info-row" 
                                                data-tip={strings.hybrid_desc}
                                                data-for="work_type_hybrid"
                                                data-effect="solid"
                                            >
                                                {strings.hybrid}
                                            </span>
                                            : owner.item && owner.item.status == "MATERNITY"
                                                ? <span 
                                                    className="leader-info-row" 
                                                    data-tip 
                                                    data-for="work_type_dekret"
                                                    data-effect="solid"
                                                >
                                                    {strings.dekret}
                                                </span>
                                                : <span 
                                                    className="leader-info-row" 
                                                    data-tip 
                                                    data-for="work_type_no_work_type"
                                                    data-effect="solid"
                                                >
                                                    {strings.no_work_type}
                                                </span>
                                    }
                                    <ReactTooltip id="work_type_flex" multiline={true}></ReactTooltip>
                                    <ReactTooltip id="work_type_hybrid" multiline={true}></ReactTooltip>
                                    <ReactTooltip id="work_type_no_work_type">{strings.no_work_type_desc}</ReactTooltip>
                                    <ReactTooltip id="work_type_dekret">{strings.dekret_type_desc}</ReactTooltip>
                                    </div>
                                </div>

                                <div className="other-row last-row" onClick={() => {this.copyToClipboard(item_name);  this.notify(`${strings.desk_name} ${item_name} ${strings.copied}`); }}>
                                    <div className="element-label one_space_right">{strings.desk}</div>
                                    <div className="element-after copy_to_clipboard_element">
                                        { !!item_name ? ' ' + item_name : ' '}
                                        <img src="/img/pics/copy_to_clipboard.svg" style={{transform: 'scale(0.7)', marginBottom: '3px'}} aria-hidden="true"></img>
                                    </div>
                                </div>
                            </>
                        : ((!!owner && owner.isFetching) || profile.isFetching) && floor.selected_item['employee_id'] && floor.selected_item['object_type_id'] === 1 ?
                                <Loading></Loading>
                            :
                                <></>
                        }

                        { (floor.selected_type === 'object') ?
                            <>
                                <SidebarObjectForm 
                                    {...this.props} 
                                    employee_parking_id={employee_parking_id} 
                                    checked={checked} 
                                    parking={parking} 
                                    lang={this.props.lang} 
                                    saveAttributes={this.saveAttributes} 
                                />
                            </>
                        : <></> }                        

                    </>
                : null }
                
                {floor.sidebar_markup_state && !parking ? 
                    <>
                        <div className="selected-name">
                            {strings.backlight}
                        </div>
                        <div className="placesColoring">
                            <div className="show_ds_light">
                                <img 
                                    src={`/img/pics/checkbox_${floor.show_ds_light}.svg`} 
                                    onClick={() => { this.props.setShowDsLight(!floor.show_ds_light);}}
                                ></img>
                                <div className="sb_sub_element" style={{marginLeft: "10px", fontWeight: "600"}}>{strings.show_ds_light}</div>
                            </div>
                            <div className="show_loc_names">
                                <img 
                                    src={`/img/pics/checkbox_${floor.show_location_names}.svg`} 
                                    onClick={() => { this.props.setShowLocationNames(!floor.show_location_names);}}
                                ></img>
                                <div className="sb_sub_element" style={{marginLeft: "10px", fontWeight: "600"}}>{strings.show_location_names}</div>
                            </div>
                            <div className="show_objs">
                                <img 
                                    src={`/img/pics/checkbox_${floor.show_object_items}.svg`} 
                                    onClick={() => { this.props.setShowObjects(!floor.show_object_items);}}
                                ></img>
                                <div className="sb_sub_element" style={{marginLeft: "10px", fontWeight: "600"}}>{strings.show_object_items}</div>
                            </div>
                            <div className="show_obj_names">
                                <img 
                                    src={`/img/pics/checkbox_${floor.show_object_names}.svg`} 
                                    onClick={() => { this.props.setShowObjectsNames(!floor.show_object_names);}}
                                ></img>
                                <div className="sb_sub_element" style={{marginLeft: "10px", fontWeight: "600"}}>{strings.show_object_names}</div>
                            </div>
                            <Nav tabs>
                                <NavItem>
                                    <NavLink
                                        className={` ${this.state.activeTab === 'costcenters' ? 'active' : ''} tab_highlight `}
                                        onClick={() => { this.toggle('costcenters'); }}
                                    >
                                        { strings.costcenters }
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={` ${this.state.activeTab === 'projects' ? 'active' : ''} tab_highlight `}
                                        onClick={() => { this.toggle('projects'); }}
                                    >
                                        { strings.projects }
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={` ${this.state.activeTab === 'floor' ? 'active' : ''} tab_highlight `}
                                        onClick={() => { this.toggle('floor'); }}
                                    >
                                        { strings.floor }
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            
                        </div>
                        <div className="colors_tab">
                            <TabContent activeTab={this.state.activeTab}>
                                <TabPane tabId="costcenters">
                                    <Row>
                                        <Col sm="12">
                                        <div 
                                            className="sb_element"  
                                            onClick={() => { 
                                                this.props.setCostcentersBacklight(
                                                    costcenters_num_s === 0 && floor.costcenters_backlight 
                                                        ? true 
                                                        : costcenters_num_s > 0 && costcenters_num_s < costcenters_number && floor.costcenters_backlight
                                                            ? true
                                                            : !floor.costcenters_backlight
                                                ); 
                                                this.props.setCostcentersToShow(floor.costcenters.map(ac => {
                                                    ac.show = costcenters_num_s === 0 && floor.costcenters_backlight 
                                                        ? true 
                                                        : costcenters_num_s > 0 && costcenters_num_s < costcenters_number && floor.costcenters_backlight
                                                            ? true
                                                            : !floor.costcenters_backlight;
                                                    return ac;    
                                                }));
                                            }}
                                        >
                                            <img src={`/img/pics/checkbox_${costcenters_num_s === costcenters_number}.svg`}></img>
                                            <span className="log_types sb_sub_element select_all_element">                       
                                                { strings.select_all }
                                            </span>
                                        </div>
                                        { costcenters && costcenters.map( c => 
                                                <div className="sb_element" onClick={() => { this.handleCostcenterShowChange(c.id); }}>
                                                    <img src={`/img/pics/checkbox_${c.show}.svg`}></img>
                                                    <div 
                                                        className="rectangle sb_sub_element" 
                                                        style={{'background': `${c.color}`}}
                                                    ></div>
                                                    <span className="log_types sb_sub_element">                                                                
                                                        <Link to={`/employees_in/${c.attributes.number}?page_type=costcenters`}>
                                                            { c.attributes.name }
                                                        </Link>
                                                    </span>
                                                </div>
                                            )
                                        }
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tabId="projects">
                                    <Row>
                                        <Col sm="12">
                                        <div className="sb_element"  onClick={() => { 
                                            this.props.setProjectsBacklight(
                                                projects_num_s === 0 && floor.projects_backlight 
                                                    ? true 
                                                    : projects_num_s > 0 && projects_num_s < projects.length && floor.projects_backlight
                                                        ? true
                                                        : !floor.projects_backlight
                                            ); 
                                            this.props.setProjectsToShow(floor.projects.map(ac => {
                                                ac.show = projects_num_s === 0 && floor.projects_backlight 
                                                    ? true 
                                                    : projects_num_s > 0 && projects_num_s < projects.length && floor.projects_backlight
                                                        ? true
                                                        : !floor.projects_backlight
                                                return ac;    
                                            }));
                                        }}>
                                            <img src={`/img/pics/checkbox_${projects_num_s === projects.length}.svg`}></img>
                                            <span className="log_types sb_sub_element select_all_element">                       
                                                { strings.select_all }
                                            </span>
                                        </div>
                                        { projects && projects.map( p => 
                                                <div className="sb_element" onClick={() => { this.handleProjectShowChange(p.project_id); }}>
                                                    <img src={`/img/pics/checkbox_${p.show}.svg`}></img>
                                                    <div 
                                                        className="rectangle sb_sub_element" 
                                                        style={{'background': `${p.color}`}}
                                                    ></div>
                                                    <span className="log_types sb_sub_element">
                                                        <Link to={`/employees_in/${p.project_id}?page_type=projects`}>
                                                            { p.project_name }
                                                        </Link>
                                                    </span>
                                                </div>
                                            )
                                        }
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tabId="floor">
                                    <Row>
                                        <Col sm="12" className="sub_header_div">
                                            <div>
                                                {strings.locations}
                                            </div>
                                        </Col>
                                        <Col sm="12">
                                            <div className="sb_element">
                                                <div className="label_for_stats">{strings.all}</div>
                                                <div style={{marginLeft: "10px", fontSize: "16px", fontWeight: '100'}}>{floor.locations.length}</div>
                                            </div>
                                            {location_types.map(lt => {
                                                let number = 0;
                                                if (floor.locations.map(l => {
                                                    if (l.location_type_id === lt.id) { number++; }
                                                }))
                                                return number > 0
                                                    ? <div className="sb_element">
                                                        <div className="label_for_stats">{lt.name}: </div>
                                                        <div style={{marginLeft: "10px", fontSize: "16px", fontWeight: '100'}}>{number}</div>
                                                    </div>
                                                    : <></>                                                        
                                            })}  
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="12" className="sub_header_div">
                                            <div>
                                                {strings.desks}
                                            </div>
                                        </Col>
                                        <Col sm="12">                                                        
                                            <div 
                                                className="sb_element"  
                                                onClick={() => { 
                                                    this.props.setShowDeskType({
                                                        tab_active: floor.show_desk_type.tab_active,
                                                        sharing: !floor.show_desk_type.sharing,
                                                        employee: floor.show_desk_type.employee,
                                                        reserved: floor.show_desk_type.reserved,
                                                        guest: floor.show_desk_type.guest
                                                    }) 
                                                }}
                                            >
                                                <img src={`/img/pics/checkbox_${floor.show_desk_type.sharing}.svg`}></img>
                                                <span className="desk_type_select">                       
                                                    { strings.d_sharing }
                                                </span>
                                                <span style={{fontSize: "16px", fontWeight: '100'}}>{floor.object_items.filter(oi => oi.status === "SHARING").length}</span>
                                            </div>
                                            <div 
                                                className="sb_element"  
                                                onClick={() => { 
                                                    this.props.setShowDeskType({
                                                        tab_active: floor.show_desk_type.tab_active,
                                                        sharing: floor.show_desk_type.sharing,
                                                        employee: !floor.show_desk_type.employee,
                                                        reserved: floor.show_desk_type.reserved,
                                                        guest: floor.show_desk_type.guest
                                                    }) 
                                                }}
                                            >
                                                <img src={`/img/pics/checkbox_${floor.show_desk_type.employee}.svg`}></img>
                                                <span className="desk_type_select">                       
                                                    { strings.d_employee }
                                                </span>
                                                <span style={{fontSize: "16px", fontWeight: '100'}}>{floor.object_items.filter(oi => oi.status === "EMPLOYEE").length}</span>
                                            </div>
                                            <div 
                                                className="sb_element"  
                                                onClick={() => { 
                                                    this.props.setShowDeskType({
                                                        tab_active: floor.show_desk_type.tab_active,
                                                        sharing: floor.show_desk_type.sharing,
                                                        employee: floor.show_desk_type.employee,
                                                        reserved: !floor.show_desk_type.reserved,
                                                        guest: floor.show_desk_type.guest
                                                    }) 
                                                }}
                                            >
                                                <img src={`/img/pics/checkbox_${floor.show_desk_type.reserved}.svg`}></img>
                                                <span className="desk_type_select">                       
                                                    { strings.d_reserved }
                                                </span>
                                                <span style={{fontSize: "16px", fontWeight: '100'}}>{floor.object_items.filter(oi => oi.status === "RESERVED").length}</span>
                                            </div>
                                            <div 
                                                className="sb_element"  
                                                onClick={() => { 
                                                    this.props.setShowDeskType({
                                                        tab_active: floor.show_desk_type.tab_active,
                                                        sharing: floor.show_desk_type.sharing,
                                                        employee: floor.show_desk_type.employee,
                                                        reserved: floor.show_desk_type.reserved,
                                                        guest: !floor.show_desk_type.guest
                                                    }) 
                                                }}
                                            >
                                                <img src={`/img/pics/checkbox_${floor.show_desk_type.guest}.svg`}></img>
                                                <span className="desk_type_select">                       
                                                    { strings.d_guest }
                                                </span>
                                                <span style={{fontSize: "16px", fontWeight: '100'}}>{floor.object_items.filter(oi => oi.status === "GUEST").length}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                </TabPane>
                            </TabContent>
                        </div>
                    </>
                : <></> }
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        floor:          state.floor,
        object_types:   state.object_types,
        location_types: state.location_types,
        profile:        state.profile,
        user:           state.user,
        search:         state.search,
        bookings:       state.bookings
    };
};

function mapDispatchToProps(dispatch) {
    return {
        selectNewElement:            (object) => dispatch(selectNewElement(object)),
        getProfile:                  (id) => dispatch(getProfile(id)),
        updateProfile:               (profile, image) => dispatch(updateProfile(profile, image)),
        costcetnersBacklightChanged: () => dispatch(costcetnersBacklightChanged()),
        projectsBacklightChanged:    () => dispatch(projectsBacklightChanged()),
        getFloorDetails:             (id) => dispatch(getFloorDetails(id)),
        addBooking:                  (book_from, book_to, employee, switchState, object_item) => dispatch(addBooking(book_from, book_to, employee, switchState, object_item)),
        setCostcentersToShow:        (id) => dispatch(setCostcentersToShow(id)),
        setProjectsToShow:           (id) => dispatch(setProjectsToShow(id)),
        setCostcentersBacklight:     (val) => dispatch(setCostcentersBacklight(val)),
        setProjectsBacklight:        (val) => dispatch(setProjectsBacklight(val)),
        setShowLocationNames:        (val) => dispatch(setShowLocationNames(val)),
        setShowDsLight:              (val) => dispatch(setShowDsLight(val)),
        setShowObjectsNames:         (val) => dispatch(setShowObjectsNames(val)),
        setShowObjects:              (val) => dispatch(setShowObjects(val)),
        setShowDeskType:             (val) => dispatch(setShowDeskType(val)),
        setSidebarMarkUpState:       (val) => dispatch(setSidebarMarkUpState(val)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(InfoSidebar);