import React, { Component }                   from 'react';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { connect }                            from "react-redux";
import { Link }                               from 'react-router-dom';
import { toast }                              from 'react-toastify';
import { withRouter }                         from 'react-router-dom';

import { getCities }      from '../actions/CitiesActions';
import { getOffices }     from '../actions/OfficesActions';
import { getBuildings }   from '../actions/BuildingsActions';
import { getFloors }      from '../actions/FloorsActions';
import { getUserByToken } from '../actions/LoginActions';
import {
    setSelectedCity,
    setSelectedOffice,
    setSelectedBuilding,
    setSelectedFloor,
    getSelections
}                         from '../actions/SelectionsActions';

import * as rbac                from '../rbac/rbac';
import * as rights              from '../constants/Rights';
import * as rightsForComponents from '../constants/RightsForComponents';

import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en:{
        home:                    "Home",
        citiesmanagement:        "Cities Management",
        buildingsmanagement:     "Buildings Management",
        floorsmanagement:        "Floors Management",
        objectsmanagement:       "Objects Management",
        locationsmanagement:     "Locations Management",
        objecttypesmanagement:   "Object Types Management",
        locationtypesmanagement: "Location Types Management",
        activitylog:             "Activity Log",
        management:              "Management",
        accessmanagement:        "Access Management",
        rightsforpages:          "Access Management for pages",
        rightsforcomponents:     "Access rights for pages",
        employeesmanagement:     "Employees Management",
        bookings_selection:      "Bookings Managment",
        bookings:                "Bookings",
        bookings_search:         "Book Now",
        reports:                 "Reports",
        buildings:               "Buildings",
        locationselection:       "Location selection",
        cityselection:           "City Selection",
        floorselection:          "Floor Selection",
        buildingselection:       "Building Selection",
        officeselection:         "Office selection",
        desksharing:             "Desk Sharing",
        colleaguesbirthdays:     "Colleagues' birthdays",
        statistics:              "Statistics",
        floor:                   "Floor",
        reportsselection:        "Reports",
        relocation_reports:      "Moving report",
        meterage_report:         "Meterage report",
        c_pl_report:             "Costcenter places report",
        reservations_report:     "Reservations report",
        reservations_w_c_report: "Reservations with comments report",
        metamanagement:          "Meta management",
        fieldsmanagement:        "Fields management",
        mapsmanagement:          "Field Maps management",
        typesmanagement:         "Meta Types management",
        officesmanagement:       "Offices management",
        mybookings:              "My Bookings",
        history:                 "History",
        all:                     "All",
        sd_managers:             "SD Managers",
        sd_location_managment:   "SD location management",
        contractsmanagement:     "Contracts management",
        login_ok:                "You are successfully logged in",
        inventory:               "Inventory",
        parking_eliz:            "Parking Elizavetinsky",
        parking_ostrov:          "Parking Ostrov",
        parking_voron:           "Parking Voronezh",
        parking_selection:       "Parkings"
    },
    ru: {
        home:                    "Главная",
        citiesmanagement:        "Управление городами",
        buildingsmanagement:     "Управление корпусами",
        floorsmanagement:        "Управление этажами",
        objectsmanagement:       "Управление объектами",
        locationsmanagement:     "Управление помещениями",
        objecttypesmanagement:   "Управление типами объектов",
        locationtypesmanagement: "Управление типами помещений",
        activitylog:             "Лог активности",
        management:              "Управление",
        accessmanagement:        "Управление доступом",
        rightsforpages:          "Управление доступом к страницам",
        rightsforcomponents:     "Права доступа для страниц",
        employeesmanagement:     "Управление сотрудниками",
        bookings_selection:      "Бронирования",
        bookings:                "Бронирования",
        bookings_search:         "Забронировать",
        reports:                 "Отчеты",
        buildings:               "Корпус",
        locationselection:       "Выбор местоположения",
        cityselection:           "Выбор города",
        floorselection:          "Выбор этажа",
        buildingselection:       "Выбор корпуса",
        officeselection:         "Выбор офиса",
        desksharing:             "Desk Sharing",
        colleaguesbirthdays:     "Дни рождения коллег",
        statistics:              "Разная статистика",
        floor:                   "Этаж",
        reportsselection:        "Отчеты",
        relocation_reports:      "Отчет по переездам",
        meterage_report:         "Отчет по метражам",
        c_pl_report:             "Отчет по местам/костцентрам",
        reservations_w_c_report: "Отчет по резервам с комменатриями",
        reservations_report:     "Отчет по резервам",
        metamanagement:          "Meta поля",
        fieldsmanagement:        "Управление полями",
        mapsmanagement:          "Маппинг полей",
        typesmanagement:         "Управления типами полей",
        officesmanagement:       "Управление офисами",
        mybookings:              "Мои Бронирования",
        history:                 "История",
        all:                     "Все",
        sd_managers:             "SD Менеджеры",
        sd_location_managment:   "Управление SD помещениями",
        contractsmanagement:     "Управление контрактами",
        login_ok:                "Вы успешно авторизированы",
        inventory:               "Инвентаризация",
        parking_eliz:            "Парковка Елизаветинский",
        parking_ostrov:          "Парковка Остров",
        parking_voron:           "Парковка Воронеж",
        parking_selection:       "Парковки"
    },
    de: {
        home:                    "Home",
        citiesmanagement:        "Stadtmanagement",
        buildingsmanagement:     "Korpsmanagement",
        floorsmanagement:        "Bodenmanagement",
        objectsmanagement:       "Immobilienverwaltung",
        locationsmanagement:     "Standortverwaltung",
        objecttypesmanagement:   "Objekttypverwaltung",
        locationtypesmanagement: "Verwaltung von Standorttypen",
        activitylog:             "Aktivitätsprotokoll",
        management:              "Management",
        accessmanagement:        "Zugriffsverwaltung",        
        rightsforpages:          "Zugriffsverwaltung für Seiten",
        rightsforcomponents:     "Zugriffsrechte für Seiten",
        employeesmanagement:     "Mitarbeiterführung",
        bookings_selection:      "Buchungsverwaltung",
        bookings:                "Buchungen",
        bookings_search:         "Buchen Sie Jetzt",
        reports:                 "Berichte",
        buildings:               "Corps",
        locationselection:       "Standortauswahl",
        cityselection:           "Stadtauswahl",
        floorselection:          "Bodenauswahl",
        buildingselection:       "Gebäudeauswahl",
        officeselection:         "Büroauswahl",
        desksharing:             "Desk Sharing",
        colleaguesbirthdays:     "Geburtstage der kollegen",
        statistics:              "Statistik",
        floor:                   "Etage",
        reportsselection:        "Berichte",
        relocation_reports:      "Bericht verschieben",
        meterage_report:         "Meterage report",
        reservations_report:     "Reservations report",
        c_pl_report:             "Costcenter places report",
        reservations_w_c_report: "Reservations with comments report",
        metamanagement:          "Meta-Management",
        fieldsmanagement:        "Feldverwaltung",
        mapsmanagement:          "Feldkartenverwaltung",
        typesmanagement:         "Verwaltung von Metatypen",
        officesmanagement:       "Büromanagement",
        mybookings:              "Meine Buchungen",
        history:                 "Geschichte",
        all:                     "Alles",
        sd_managers:             "SD-Manager",
        sd_location_managment:   "SD-Standortverwaltung",
        contractsmanagement:     "Vertragsmanagement",
        login_ok:                "Sie sind erfolgreich angemeldet",
        inventory:               "Inventar",
        parking_eliz:            "Parkplatz Elizavetinsky",
        parking_ostrov:          "Parkplatz Ostrov",
        parking_voron:           "Parkplatz Voronezh",
        parking_selection:       "Parken"
    }
});


class Sidebar extends Component {

    constructor(props) {
        super(props);
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
        
        this.state = {
            selected: "cityselection"
        };

        this.handleCitySelection     = this.handleCitySelection.bind(this);
        this.handleOfficeSelection   = this.handleOfficeSelection.bind(this);
        this.handleBuildingSelection = this.handleBuildingSelection.bind(this);
        this.handleFloorSelection    = this.handleFloorSelection.bind(this);
        this.onToggleSidebar         = this.onToggleSidebar.bind(this);
    }

    componentDidMount() { }

    componentWillReceiveProps(nextProps) {
        const { selections, cities, user } = nextProps;
        if (this.props.user && this.props.user.isFetching && !user.isFetching && user &&
            user.user && user.user.rights && user.user.rights.length > 0) {
            this.props.getBuildings();
            this.props.getCities();
            this.props.getFloors();
            this.props.getOffices();
            this.props.getSelections();
        }

        if ((!selections.city || !selections.city.id) && !!user && user.loggingIn &&
             !!cities && !!cities.length > 0) {
            const city_founded = cities.find(e => e.id === user.user.data.city_id);
            if (city_founded == undefined) {
                this.props.setSelectedCity(cities[0]);
            } else {
                this.props.setSelectedCity(cities.find(e => e.id === user.user.data.city_id));
            }
        } else if ((!selections.city || !selections.city.id) && !user.loggingIn && !!cities && !!cities.length > 0) {
            this.props.setSelectedCity(cities[0]);
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
      
        if (localStorage.getItem('show_ok_info') && localStorage.getItem('show_ok_info').toLowerCase() == "true") {
            localStorage.setItem('show_ok_info', false);
            this.notify(strings.login_ok);
        }
    }

    notify = (msg) => {
        toast.success(msg, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    onSelect = (selected) => {
        this.setState({ selected: selected });
    };

    onToggleSidebar = () => {
        
        if (!this.props.expanded) {
            document.addEventListener("click", this.handleOutsideClick, false);
        } else {
            document.removeEventListener("click", this.handleOutsideClick, false);
        }
        this.props.onToggle();
    }
    
    handleOutsideClick = e => {
        if (!this.node.contains(e.target)) {
            if (this.props.expanded) {
                document.addEventListener("click", this.handleOutsideClick, false);
                this.props.onToggle();
            } else {
                document.removeEventListener("click", this.handleOutsideClick, false);
            }
        };
    };  

    handleCitySelection(id) {
        const { cities } = this.props;
        this.props.setSelectedCity(cities.find(e => e.id === id));
        this.props.setSelectedOffice('');
        this.props.setSelectedBuilding('');
        this.props.setSelectedFloor('');
    }

    handleOfficeSelection(id) {
        const { offices } = this.props;
        this.props.setSelectedOffice(offices.find(e => e.id === id));
        this.props.setSelectedBuilding('');
        this.props.setSelectedFloor('');
    }

    handleBuildingSelection(id) {
        const { buildings } = this.props;
        this.props.setSelectedBuilding(buildings.find(e => e.id === id));
        this.props.setSelectedFloor('');
    }

    handleFloorSelection(id) {
        const { floors } = this.props;
        this.props.setSelectedFloor(floors.find(e => e.id === id));
    }

    render() {
        const { user, cities, buildings, offices, floors, selections, expanded, onToggle } = this.props;
        let cities_filtered    = [];
        let buildings_filtered = [];
        let offices_filtered   = [];
        let floors_filtered    = [];
        let user_rights        = [];
        let selected_city      = { id: null };
        let selected_office    = { id: null };
        let selected_building  = { id: null };
        let selected_floor     = { id: null };
        let page_by_url = window.location.href.split('/')[3];

        if (user && user.loggingIn && user.user.rights) {
            user_rights = user.user.rights;
        }

        if (!!cities && !!buildings && !!offices && !!floors) {
            cities_filtered    = cities.filter(el => el.active === true).sort((a, b) => (a.ord > b.ord) ? 1 : -1);
            offices_filtered   = offices.filter(el => el.active === true).sort((a, b) => (a.ord > b.ord) ? 1 : -1);
            buildings_filtered = buildings.filter(el => el.active === true).sort((a, b) => (a.ord > b.ord) ? 1 : -1);
            floors_filtered    = floors.filter(el => el.active === true).sort((a, b) => (a.ord > b.ord) ? 1 : -1);
            
            selected_city      = selections.city;
            if ((selected_city === '' || !selected_city) && user && user.loggingIn) {
                selected_city = cities.find(el => el.id === user.user.data.city_id);
                localStorage.setItem('selected_city', JSON.stringify(selected_city));
            }
            offices_filtered   = selected_city === '' || !selected_city
                ? []
                : offices_filtered.filter(el => el.city_id === selected_city.id);
            selected_office    = selections.office;
            if (selected_office === '') {
                buildings_filtered = [];
                floors_filtered    = [];
            } else {
                selected_office = selections.office;
            }
            buildings_filtered = selected_office === '' || !selected_office || buildings_filtered.length === 0 
                ? []
                : buildings_filtered.filter(el => el.office_id === selected_office.id);
            selected_building  = selections.building
            if (selected_building === '') {
                floors_filtered    = [];
            } else {
                selected_building = selections.building;
            }
            floors_filtered    = selected_building === '' || !selected_building || floors_filtered.length === 0  
                ? []
                : floors_filtered.filter(el => el.building_id === selected_building.id);
            selected_floor        = selections.floor;

            localStorage.setItem('selected_city', JSON.stringify(selected_city ? selected_city : ""));
            localStorage.setItem('selected_office', JSON.stringify(selected_office ? selected_office : ""));
            localStorage.setItem('selected_building', JSON.stringify(selected_building ? selected_building : ""));
            localStorage.setItem('selected_floor', JSON.stringify(selected_floor ? selected_floor : ""));
        }
        return (
            <div ref={node => { this.node = node; }}>
                <SideNav 
                    id="mainSidebar" 
                    className={`${expanded ? 'untoggled' : 'toggled'} sidenav`} 
                    onSelect={this.onSelect} 
                    onToggle={this.onToggleSidebar}
                    expanded={expanded}
                >
                    <SideNav.Toggle className="sidenav-toggle" />
                    <SideNav.Nav defaultSelected="cityselection" className={`${expanded ? 'untoggled_menu' : 'toggled_menu'} `}>
                        { user_rights.length > 0 ? (
                            rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "CITIES_RIGHTS").rights, user_rights) ||
                                rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "OFFICES_RIGHTS").rights, user_rights) ||
                                rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "BULDINGS_RIGHTS").rights, user_rights) ||
                                rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "FLOORS_RIGHTS").rights, user_rights) ||
                                rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "LOCATIONS_RIGHTS").rights, user_rights) ||
                                rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "CONTRACTS_RIGHTS").rights, user_rights) ||
                                rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "OBJECT_ITEMS_RIGHTS").rights, user_rights) ||
                                rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "OBJECT_TYPES_RIGHTS").rights, user_rights) ||
                                rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "LOCATION_TYPES_RIGHTS").rights, user_rights) ||
                                rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "HEARTBEATS_RIGHTS").rights, user_rights) ||
                                rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "GROUPRIGHTS_RIGHTS").rights, user_rights) ||
                                rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "EMPLOYEES_PANEL_RIGHTS").rights, user_rights) ||
                                rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "INVENTORY_RIGHTS").rights, user_rights) ? (
                                <NavItem eventKey="accessmanagement">
                                    <NavIcon>
                                        <i className="fa fa-fw fa-cog" style={{ fontSize: '1.75em' }} />
                                    </NavIcon>
                                    <NavText>
                                        {strings.management}
                                    </NavText>
                                    { rbac.isSatisfied([rights.VIEW_CITIES], user_rights) ? (
                                        <NavItem eventKey="citiesmanagement">
                                            <NavText>
                                                <Link to="/cities" onClick={() => { this.props.getUserByToken(); }}>
                                                    {strings.citiesmanagement}
                                                </Link>
                                            </NavText>
                                        </NavItem>
                                    ) : (<></>)}
                                    { rbac.isSatisfied([rights.VIEW_OFFICES], user_rights) ? (
                                        <NavItem eventKey="officesmanagement">
                                            <NavText>
                                                <Link to="/offices" onClick={() => { this.props.getUserByToken(); }}>
                                                    {strings.officesmanagement}
                                                </Link>
                                            </NavText>
                                        </NavItem>
                                    ) : (<></>)}
                                    { rbac.isSatisfied([rights.VIEW_BUILDINGS], user_rights) ? (
                                        <NavItem eventKey="buildingsmanagement">
                                            <NavText>
                                                <Link to="/buildings" onClick={() => { this.props.getUserByToken(); }}>
                                                    {strings.buildingsmanagement}
                                                </Link>
                                            </NavText>
                                        </NavItem>
                                    ) : (<></>)}
                                    { rbac.isSatisfied([rights.VIEW_FLOORS], user_rights) ? (
                                        <NavItem eventKey="floorsmanagement">
                                            <NavText>
                                                <Link to="/floors" onClick={() => { this.props.getUserByToken(); }}>
                                                    {strings.floorsmanagement}
                                                </Link>
                                            </NavText>
                                        </NavItem>
                                    ) : (<></>)}
                                    { rbac.isSatisfied([rights.VIEW_LOCATIONS], user_rights) ? (
                                        <NavItem eventKey="locationsmanagement">
                                            <NavText>
                                                <Link to="/locations" onClick={() => { this.props.getUserByToken(); }}>
                                                    {strings.locationsmanagement}
                                                </Link>
                                            </NavText>
                                        </NavItem>
                                    ) : (<></>)}
                                    { rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "CONTRACTS_RIGHTS").rights, user_rights) ? (
                                        <NavItem eventKey="contractsmanagement">
                                            <NavText>
                                                <Link to="/contracts" onClick={() => { this.props.getUserByToken(); }}>
                                                    {strings.contractsmanagement}
                                                </Link>
                                            </NavText>
                                        </NavItem>
                                    ) : (<></>)}
                                    { rbac.isSatisfied([rights.VIEW_OBJECT_ITEMS], user_rights) ? (
                                        <NavItem eventKey="objectsmanagement">
                                            <NavText>
                                                <Link to="/objects" onClick={() => { this.props.getUserByToken(); }}>
                                                    {strings.objectsmanagement}
                                                </Link>
                                            </NavText>
                                        </NavItem>
                                    ) : (<></>)}
                                    { rbac.isSatisfied([rights.VIEW_OBJECT_TYPES], user_rights) ? (
                                        <NavItem eventKey="objecttypesmanagement">
                                            <NavText>
                                                <Link to="/objecttypes" onClick={() => { this.props.getUserByToken(); }}>
                                                    {strings.objecttypesmanagement}
                                                </Link>
                                            </NavText>
                                        </NavItem>
                                    ) : (<></>)}
                                    { rbac.isSatisfied([rights.VIEW_LOCATION_TYPES], user_rights) ? (
                                        <NavItem eventKey="locationtypesmanagement">
                                            <NavText>
                                                <Link to="/locationtypes" onClick={() => { this.props.getUserByToken(); }}>
                                                    {strings.locationtypesmanagement}
                                                </Link>
                                            </NavText>
                                        </NavItem>
                                    ) : (<></>)}
                                    { rbac.isSatisfied([rights.VIEW_HEARTBEATS], user_rights) ? (
                                        <NavItem eventKey="activitylog">
                                            <NavText>
                                                <Link to="/heartbeats" onClick={() => { this.props.getUserByToken(); }}>
                                                    {strings.activitylog}
                                                </Link>
                                            </NavText>
                                        </NavItem>
                                    ) : (<></>)}
                                    { rbac.isSatisfied([rights.VIEW_GROUPRIGHTS], user_rights) ? (
                                        <NavItem eventKey="grouprights">
                                            <NavText>
                                                <Link to="/grouprights" onClick={() => { this.props.getUserByToken(); }}>
                                                    {strings.accessmanagement}
                                                </Link>
                                            </NavText>
                                        </NavItem>
                                    ) : (<></>)}
                                    { rbac.isSatisfied([rights.VIEW_GROUPRIGHTS], user_rights) ? (
                                        <NavItem eventKey="rights_for_pages">
                                            <NavText>
                                                <Link to="/rights_for_pages" onClick={() => { this.props.getUserByToken(); }}>
                                                    {strings.rightsforpages}
                                                </Link>
                                            </NavText>
                                        </NavItem>
                                    ) : (<></>)}
                                    { rbac.isSatisfied([rights.VIEW_EMPLOYEES, rights.VIEW_EMPLOYEES_ADDS], user_rights) ? (
                                        <NavItem eventKey="employeesmanagement">
                                            <NavText>
                                                <Link to="/employees" onClick={() => { this.props.getUserByToken(); }}>
                                                    {strings.employeesmanagement}
                                                </Link>
                                            </NavText>
                                        </NavItem>
                                    ) : (<></>)}
                                    { rbac.isSatisfied([rights.VIEW_INVENTORY], user_rights) ? (
                                        <NavItem eventKey="inventory">
                                            <NavText>
                                                <Link to="/inventory" onClick={() => { this.props.getUserByToken(); }}>
                                                    {strings.inventory}
                                                </Link>
                                            </NavText>
                                        </NavItem>
                                    ) : (<></>)}
                                </NavItem>
                            ) : (<></>)
                        ) : (<></>) }
                        { user && user.loggingIn ? (
                            <NavItem eventKey="bookings">
                                <NavIcon>
                                    <i className="fa fa-clock-o fa-fw" style={{ fontSize: '1.75em' }}/>
                                </NavIcon>
                                <NavText>
                                    {strings.bookings_selection}
                                </NavText>
                                <NavItem eventKey="bookings_search">
                                    <NavText>
                                        <Link to="/bookings?key=SEARCH&clear=true" onClick={() => { this.props.getUserByToken(); }}>
                                            {strings.bookings_search}
                                        </Link>
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="bookings_listM">
                                    <NavText>
                                        <Link to="/bookings?key=MY_BOOKINGS" onClick={() => { this.props.getUserByToken(); }}>
                                            {strings.mybookings}
                                        </Link>
                                    </NavText>
                                </NavItem>
                                {rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "ALL_BOOKING_TAB_RIGHTS").rights, user.user.rights) ? (
                                    <NavItem eventKey="bookings_listA">
                                        <NavText>
                                            <Link to="/bookings?key=ALL" onClick={() => { this.props.getUserByToken(); }}>
                                                {strings.all}
                                            </Link>
                                        </NavText>
                                    </NavItem>
                                 ) : (<></>)
                                }
                                {rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "SDMANAGERS_COSTCENTERS_TAB_RIGHTS").rights, user.user.rights) ? (
                                    <NavItem eventKey="bookings_listM">
                                        <NavText>
                                            <Link to="/bookings?key=SD_MANAGERS" onClick={() => { this.props.getUserByToken(); }}>
                                                {strings.sd_managers}
                                            </Link>
                                        </NavText>
                                    </NavItem>
                                 ) : (<></>)
                                }
                                {rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "SD_LOCATIONS_MANAGMENT_TAB_RIGHTS").rights, user.user.rights) ? (
                                    <NavItem eventKey="bookings_listL">
                                        <NavText>
                                            <Link to="/bookings?key=SD_LOCATIONS_MANAGMENT" onClick={() => { this.props.getUserByToken(); }}>
                                                {strings.sd_location_managment}
                                            </Link>
                                        </NavText>
                                    </NavItem>
                                 ) : (<></>)
                                }
                            </NavItem>
                        ) : (<></>)}
                        { rbac.isSatisfied([rights.VIEW_REPORTS], user_rights) ? (
                            <NavItem eventKey="reports">
                                <NavIcon>
                                    <i className="fa fa-list-alt" style={{ fontSize: '1.75em' }}/>
                                </NavIcon>
                                <NavText>
                                    {strings.reportsselection}
                                </NavText>
                                <NavItem eventKey="relocation_reports">
                                    <NavText>
                                        <Link to="/relocation_reports" onClick={() => { this.props.getUserByToken(); }}>
                                            {strings.relocation_reports}
                                        </Link>
                                    </NavText>
                                </NavItem>
                                {cities_filtered.map(item => {
                                    return  <NavItem key={`${item.id}`} eventKey={`meterage_report_${item.id}`}>
                                                <NavText>
                                                    <Link to={`/meterage_report/${item.id}`} onClick={() => { this.props.getUserByToken(); }}>
                                                        {strings.meterage_report} ({item.name})
                                                    </Link>
                                                </NavText>
                                            </NavItem>
                                })}
                                <NavItem eventKey="c_pl_report">
                                    <NavText>
                                        <Link to="/costcenter_places_report" onClick={() => { this.props.getUserByToken(); }}>
                                            {strings.c_pl_report}
                                        </Link>
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="reservations_report">
                                    <NavText>
                                        <Link to="/reservations_report" onClick={() => { this.props.getUserByToken(); }}>
                                            {strings.reservations_report}
                                        </Link>
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="reservations_w_c_report">
                                    <NavText>
                                        <Link to="/reservations_with_comments_report" onClick={() => { this.props.getUserByToken(); }}>
                                            {strings.reservations_w_c_report}
                                        </Link>
                                    </NavText>
                                </NavItem>
                            </NavItem>
                        ) : (<></>)}
                        { rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "META_MAPS_RIGHTS").rights, user_rights) ||
                          rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "META_FIELDS_RIGHTS").rights, user_rights) ||
                          rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "META_TYPES_RIGHTS").rights, user_rights) ? (
                            <NavItem eventKey="metamanagement">
                                <NavIcon>
                                    <i className="fa fa-fw fa-cubes" style={{ fontSize: '1.75em' }} />
                                </NavIcon>
                                <NavText>
                                    {strings.metamanagement}
                                </NavText>
                                { rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "META_MAPS_RIGHTS").rights, user_rights) ? (
                                    <NavItem eventKey="mapsmanagement">
                                        <NavText>
                                            <Link to="/metamaps" onClick={() => { this.props.getUserByToken(); }}>
                                                {strings.mapsmanagement}
                                            </Link>
                                        </NavText>
                                    </NavItem>
                                ) : (<></>)}
                                { rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "META_FIELDS_RIGHTS").rights, user_rights) ? (
                                    <NavItem eventKey="fieldsmanagement">
                                        <NavText>
                                            <Link to="/metafields" onClick={() => { this.props.getUserByToken(); }}>
                                                {strings.fieldsmanagement}
                                            </Link>
                                        </NavText>
                                    </NavItem>
                                ) : (<></>)}
                                { rbac.isSatisfied(rightsForComponents.list.find(e => e.name === "META_TYPES_RIGHTS").rights, user_rights) ? (
                                    <NavItem eventKey="typesmanagement">
                                        <NavText>
                                            <Link to="/metatypes" onClick={() => { this.props.getUserByToken(); }}>
                                                {strings.typesmanagement}
                                            </Link>
                                        </NavText>
                                    </NavItem>
                                ) : (<></>)}
                            </NavItem>
                        ) : (<></>)}
                        { !!user && user.user && user.user.rights && user.user.rights.length > 0 ? (
                            <NavItem eventKey="cityselection">
                                <NavIcon>
                                    <Link to={`/`} onClick={() => { this.props.getUserByToken(); }}><img src="/img/pics/city.png" className="sidebar-icon" /></Link>
                                </NavIcon>
                                <NavText>
                                    <Link to={`/`} onClick={() => { this.props.getUserByToken(); }}>{strings.locationselection}</Link>
                                </NavText>
                            </NavItem>
                        ) : (<></>)}
                        { rbac.isSatisfied([rights.ADD_AVAILABLE_DATES_FOR_PARKING], user_rights) ? (
                            <NavItem eventKey="parking">
                                <NavIcon onClick={() => { this.props.history.push('/parking/'); }}>
                                    <img src="/img/pics/parking-car.svg"/>
                                </NavIcon>
                                <NavText>
                                    {strings.parking_selection}
                                </NavText>
                                <NavItem eventKey="parking_1">
                                    <NavText>
                                        <Link to="/floors/56" onClick={() => { this.props.getUserByToken(); }}>
                                            {strings.parking_eliz}
                                        </Link>
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="parking_2">
                                    <NavText>
                                        <Link to="/floors/57" onClick={() => { this.props.getUserByToken(); }}>
                                            {strings.parking_ostrov}
                                        </Link>
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="parking_3">
                                    <NavText>
                                        <Link to="/floors/55" onClick={() => { this.props.getUserByToken(); }}>
                                            {strings.parking_voron}
                                        </Link>
                                    </NavText>
                                </NavItem>
                            </NavItem>
                        ) : (<></>)}
                    </SideNav.Nav>
                    {/* { !!!page_by_url || page_by_url == 'edit' || page_by_url == 'floors' || page_by_url == 'cities'
                      || page_by_url == 'offices' || page_by_url == 'buildings' || page_by_url == 'floors'
                      || page_by_url == 'locations' || page_by_url == 'contracts' || page_by_url == 'objects'
                      || page_by_url == 'objecttypes' || page_by_url == 'locationtypes' || page_by_url == 'heartbeats'
                      || page_by_url == 'grouprights' || page_by_url == 'rights_for_pages' || page_by_url == 'employees'
                      || page_by_url == 'groups' || page_by_url == 'metamaps' || page_by_url == 'metafields'
                      || page_by_url == 'metatypes' || page_by_url == 'sdmanagers' || page_by_url == 'sdlocation_access'
                        ? <></>
                        : <div className={`${expanded ? '' : 'left_bottom_footer_part'}`}></div>
                    } */}
                </SideNav>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getFloors:           () => dispatch(getFloors()),
        getCities:           () => dispatch(getCities()),
        getOffices:          () => dispatch(getOffices()),
        getBuildings:        () => dispatch(getBuildings()),
        getUserByToken:      () => dispatch(getUserByToken()),
        setSelectedCity:     (city) => dispatch(setSelectedCity(city)),
        setSelectedOffice:   (office) => dispatch(setSelectedOffice(office)),
        setSelectedBuilding: (building) => dispatch(setSelectedBuilding(building)),
        setSelectedFloor:    (floor) => dispatch(setSelectedFloor(floor)),
        getSelections:      () => dispatch(getSelections()),
    };
}

const mapStateToProps = state => {
    return {
        cities:     state.cities,
        buildings:  state.buildings,
        offices:    state.offices,
        floors:     state.floors,
        user:       state.user,
        selections: state.selections
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Sidebar));