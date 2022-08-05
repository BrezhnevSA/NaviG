import React, { Component, forwardRef } from 'react';
import { connect }          from "react-redux";
import { 
    Row,
    Col, 
    Button, 
    Container,
    Input
}                           from 'reactstrap';
import DatePicker, { registerLocale } from "react-datepicker";
import ReactTooltip         from 'react-tooltip';
import en from "date-fns/locale/en-GB";
import ru from "date-fns/locale/ru";
import de from "date-fns/locale/de";
import { Link }             from 'react-router-dom';
import queryString          from 'query-string';
import ToggleButton         from 'react-toggle-button';
import { addDays }          from 'date-fns';
import { Accordion  }       from "react-bootstrap";
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import moment               from 'moment';

import { searchBookings }     from '../../../../../actions/SearchActions';
import { searchEmployees }    from '../../../../../actions/SearchActions';
import { searchEmployeeById } from '../../../../../actions/SearchActions';
import Loading                from '../../../Loading/LoadingComponent';

import './SearchBookingsComponent.css';

import LocalizedStrings from 'react-localization';
import AsyncSearcher from '../../../../Elements/AsyncSearcher';

import * as rbac from '../../../../../rbac/rbac';
import * as rights from '../../../../../constants/Rights';
import * as appSettings from '../../../../../constants/AppSettings'

registerLocale("en", en);
registerLocale("de", de);
registerLocale("ru", ru);

let strings = new LocalizedStrings({
    en:{
        searchingBookings:   "BOOK NOW",
        search:              "Search",
        noresults:           "No results",
        from:                "from",
        to:                  "to",
        havebookingsametime: "You already have a booking",
        havebookingsametim:  "which overlaps with the selected date range",
        placeholder_name:    "Employee surname and name", 
        employeeinsystem:    "Employee in application",
        yes:                 'Yes',
        no:                  'No',
        searchprocess:       'Search in progress',
        ds_table_not_ready:  'DS table not ready',
        date_start:          'Date Start',
        date_end:            'Date End',
        office:              'Business Center',
        building:            'Building',
        rquired_field:       '* Required field',
        noplacesavailable:   'No seats available',
        uncorrectdates:      'Invalid booking dates',
        bookinginyouoffice:  'You cannot book a place in the building where there is a permanent seat'
    },
    ru: {
        searchingBookings:   "ЗАБРОНИРОВАТЬ",
        search:              "Найти",
        noresults:           "Нет результатов",
        from:                "с",
        to:                  "по",
        havebookingsametime: "У вас уже имеется бронирование",
        havebookingsametim:  ", которое пересекается с выбранным диапазоном дат",
        placeholder_name:    "Фамилия и имя сотрудника", 
        employeeinsystem:    "Сотрудник в системе",
        yes:                 'Да',
        no:                  'Нет',
        searchprocess:       'Идет поиск',
        ds_table_not_ready:  'DS место не готово',
        date_start:          'Дата Начала',
        date_end:            'Дата Окончания',
        office:              'Бизнес Центр',
        building:            'Корпус',
        rquired_field:       '* Обязательное поле',
        noplacesavailable:   'Нет доступных мест',
        uncorrectdates:      'Некорректные даты бронирования',
        bookinginyouoffice:  'Бронировать место в корпусе, в котором имеется постоянное место, нельзя'
    },
    de: {
        searchingBookings:   "BUCHEN SIE JETZT",
        search:              "Finden",
        noresults:           "Keine Ergebnisse",
        from:                "von",
        to:                  "zu",
        havebookingsametime: "Sie haben bereits eine Buchung",
        havebookingsametim:  "die sich mit dem ausgewählten Datumsbereich überschneidet",
        placeholder_name:    "Nachname und Name des Mitarbeiters", 
        employeeinsystem:    "Mitarbeiter in der Bewerbung",
        yes:                 'Ja',
        no:                  'Nein',
        searchprocess:       'Suche ist im Gange',
        ds_table_not_ready:  'DS-Tisch nicht fertig',
        date_start:          'Startdatum',
        date_end:            'Enddatum',
        office:              'Business Center',
        building:            'Gebäude',
        rquired_field:       '* Pflichtfeld',
        noplacesavailable:   'Keine Plätze verfügbar',
        uncorrectdates:      'Ungültige Buchungsdaten',
        bookinginyouoffice:  'Sie können keinen Platz im Gebäude buchen, an dem es einen festen Sitz gibt'
    }
});

class SearchBookings extends Component {

    constructor(props) {
        super(props)

        this.state = {
            dateStart:      '',
            dateEnd:        '',
            firstLoad:      true,
            clearResults:   false,
            searchEmployee: false,         
            selected:       [],
            switchChecked:  true,
            employeeName:   "",
            building_id:    null,
            office_id:      null,
            errorDateEnd:   false,
            errorDateStart: false,
            active_cities:  [],
            active_offices: [],
            active_buildings: [],
            active_floors:  []
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.onDateStartChange        = this.onDateStartChange.bind(this);
        this.onDateEndChange          = this.onDateEndChange.bind(this);
        this.search                   = this.search.bind(this);
        this.searchEmployees_         = this.searchEmployees_.bind(this);
        this.handleSelection          = this.handleSelection.bind(this);
        this.handleOfficeChange       = this.handleOfficeChange.bind(this);
        this.handleBuildingChange     = this.handleBuildingChange.bind(this);
    }

    componentDidMount() {
        const parsed_params = queryString.parse(this.props.location.search);
        if (parsed_params.employee && (parsed_params.switchState === 'true')) {
            this.props.searchEmployeeById(parsed_params.employee);
            this.setState({ searchEmployee: true })
        }
    }

    componentWillReceiveProps(nextProps) {
        const { 
            firstLoad,
            switchChecked,
            employeeName,
            selected,
            searchEmployee,
            active_cities,
            active_buildings,
            active_floors,
            active_offices
        }                   = this.state;
        const { search, cities }    = nextProps;
        const parsed_params = queryString.parse(nextProps.location.search);
        const book_from     = parsed_params.book_from;
        const book_to       = parsed_params.book_to;
        const building_id   = parsed_params.building_id;
        const office_id     = parsed_params.office_id;
        const switchState   = parsed_params.switchState === 'true' ? parsed_params.switchState : null;
        
        const employee      = switchChecked
            ? selected.length > 0
                ? selected[0].id
                : parsed_params.employee 
                    ? parsed_params.employee 
                    : null
            : employeeName.length > 0
                ? employeeName
                : parsed_params.employee 
                    ? parsed_params.employee 
                    : null;
        if (firstLoad && parsed_params.book_from && parsed_params.book_to) {
            nextProps.searchBookings(book_from, book_to, employee, switchState, office_id, building_id);
            this.setState({ 
                firstLoad: false,
                dateStart: new Date(book_from),
                dateEnd:   new Date(book_to),
                building_id: building_id,
                office_id: office_id
            })
            if (!searchEmployee && !switchState) {
                this.setState({ 
                    employeeName:   employee,
                    switchChecked:  false,
                })
            }
        }

        if (firstLoad && parsed_params.key === 'SEARCH' && !parsed_params.book_from && !parsed_params.book_to && !searchEmployee) {
            this.setState({
                dateStart:      '',
                dateEnd:        '',
                firstLoad:      false,
                clearResults:   true,
                searchEmployee: false,         
                selected:       [],
                switchChecked:  true,
                employeeName:   "",
                building_id:    building_id,
                office_id:      office_id
            })
        }

        if (searchEmployee && search.employeeById) {
            this.setState({ 
                selected:       [search.employeeById],
                switchChecked:  true,
                searchEmployee: false
            })
        }

        if (nextProps.cities && nextProps.cities.length > 0 && active_cities.length === 0) {
            this.setState({ active_cities: nextProps.cities.map(e => { return { id: e.id, value: true } }) })
        }

        if (nextProps.offices && nextProps.offices.length > 0 && active_offices.length === 0) {
            this.setState({ active_offices: nextProps.offices.map(e => { return { id: e.id, value: true } }) })
        }

        if (nextProps.buildings && nextProps.buildings.length > 0 && active_buildings.length === 0) {
            this.setState({ active_buildings: nextProps.buildings.map(e => { return { id: e.id, value: true } }) })
        }

        if (nextProps.floors && nextProps.floors.length > 0 && active_floors.length === 0) {
            this.setState({ active_floors: nextProps.floors.map(e => { return { id: e.id, value: true } }) })
        }

        // if (!cleared && need_clearing) {
        //     this.setState({
        //         dateStart:      null,
        //         dateEnd:        null,
        //         firstLoad:      true,
        //         clearResults:   false,
        //         searchEmployee: false,         
        //         selected:       [],
        //         switchChecked:  true,
        //         employeeName:   "",
        //         cleared:        true
        //     });
        //     this.props.history.push('/bookings?key=SEARCH');
        // }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    onDateStartChange(dateStart) {
        let { dateEnd } = this.state;
        if (dateStart && dateEnd && dateStart.getTime() > dateEnd.getTime()) {
            dateEnd   = dateStart;
        }
        this.setState({ 
            dateEnd:      dateEnd,
            dateStart:    dateStart,
            clearResults: true 
        });
    }

    onDateEndChange(dateEnd) {
        let { dateStart } = this.state;
        if (dateStart && dateEnd && dateStart.getTime() > dateEnd.getTime()) {
            dateStart = dateEnd;
        }
        this.setState({ 
            dateEnd:   dateEnd,
            dateStart: dateStart,
            clearResults: true 
        });
    }

    _convertDateToBdString(date) {
        let bd_string = null;
        if (date !== null) {
            let localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
            bd_string = localISOTime.slice(0,10);
        }
        return bd_string;
    }

    search() {
        const { dateStart, dateEnd, selected, employeeName, switchChecked, office_id , building_id } = this.state;
        if (!dateEnd) {
            this.setState({ errorDateEnd: true });
        }
        if (!dateStart) {
            this.setState({ errorDateStart: true });
        } 
        if (!!dateStart && !!dateEnd) {
            const dateStartConverted = this._convertDateToBdString(dateStart);
            const dateEndConverted   = this._convertDateToBdString(dateEnd);

            this.props.searchBookings(
                dateStartConverted, 
                dateEndConverted,
                switchChecked
                    ? selected.length > 0
                        ? selected[0].id
                        : null
                    : employeeName.length > 0
                        ? employeeName
                        : null,
                switchChecked, 
                office_id, 
                building_id
            );
            this.setState({ clearResults: false });
            this.props.history.push('/bookings?key=SEARCH')
        }
    }

    handleSelection(item) {
        this.setState({
            selected: item
        });
    }

    searchEmployees_(query, page){
        this.props.searchEmployees(query, page);
    }

    handleOfficeChange(e) {
        this.setState({ office_id: e.target.value })
    }

    handleBuildingChange(e) {
        this.setState({ building_id: e.target.value })
    }


    render() {
        let current_user = JSON.parse(localStorage.getItem('current_user'));

        const { 
            dateStart, 
            dateEnd, 
            clearResults,
            switchChecked,
            employeeName,
            selected,
            office_id,
            building_id,
            errorDateEnd,
            errorDateStart,
            active_cities,
            active_buildings,
            active_floors,
            active_offices
        }                   = this.state;
        const { 
            search,
            offices,
            buildings,
            user 
        }                   = this.props;
        const parsed_params = queryString.parse(this.props.location.search);
        const need_clearing = parsed_params.clear === 'true';
        const employee      = switchChecked
            ? selected.length > 0
                ? selected[0].id
                : parsed_params.employee 
                    ? parsed_params.employee 
                    : current_user['id']
            : employeeName.length > 0
                ? employeeName
                : parsed_params.employee 
                    ? parsed_params.employee 
                    : current_user['id'];
        let user_rights = [];

        if (user && user.loggingIn && user.user.rights) {
            user_rights = user.user.rights;
        }

        if (offices && offices.length > 0 && buildings && buildings.length > 0) {
            const ExampleCustomInputStart = forwardRef(
                ({ value, onClick }, ref) => (
                    <div>
                        <button className={`custom-input-datepicker-l ${!!value ? "black_text" : ""} ${errorDateStart && !dateStart ? "invalid_date" : " "}`} onClick={onClick} ref={ref}>
                            {!!value ? value : strings.date_start}
                        </button>
                        <label className={`${errorDateStart && !dateStart ? "required_field" : "required_field_hidden"}`}>{strings.rquired_field}</label>
                    </div>
                ),
            );
            
            const ExampleCustomInputEnd = forwardRef(
                ({ value, onClick }, ref) => (
                    <div>
                        <button className={`custom-input-datepicker-l ${!!value ? "black_text" : ""} ${errorDateEnd && !dateEnd ? "invalid_date" : " "}`} onClick={onClick} ref={ref}>
                            {!!value ? value : strings.date_end}
                        </button>
                        <label className={`${errorDateEnd && !dateEnd ? "required_field" : "required_field_hidden"}`}>{strings.rquired_field}</label>
                    </div>
                ),
            );
            let CustomToggleCity = null;
            let CustomToggleOffice = null;
            let CustomToggleBuilding = null;
            let CustomToggleFloor = null;
            if (search && search.bookings && search.bookings.items.length > 0 && !search.bookings.isFetching && !clearResults && !need_clearing){
            CustomToggleCity = ({ children, eventKey }) => {
                const decoratedOnClick = useAccordionToggle(eventKey, () =>
                    this.setState({ active_cities: active_cities.map(e => { if (e.id === children.id) { e.value = !e.value; } return e; }) })
                );            
                return (
                    <div onClick={decoratedOnClick}>                    
                        <span
                            type="button"
                            className="text-left city-name"
                        >
                            {children.name}
                        </span>
                        <img 
                            src="/img/pics/vector_up.svg" 
                            className={`vector_accordion ${active_cities.find(e => e.id === children.id).value ? "rotate_vector" : " " }`}
                        ></img>
                    </div>
                );
            }
            CustomToggleOffice = ({ children, eventKey }) => {
                const decoratedOnClick = useAccordionToggle(eventKey, () =>
                    this.setState({ active_offices: active_offices.map(e => { if (e.id === children.id) { e.value = !e.value; } return e; }) })
                );            
                return (
                    <div onClick={decoratedOnClick}>                    
                        <span
                            type="button"
                            className="text-left office-name"
                        >
                            {children.name}
                        </span>
                        <img 
                            src="/img/pics/vector_up.svg" 
                            className={`vector_accordion ${active_offices.find(e => e.id === children.id).value ? "rotate_vector" : " " }`}
                        ></img>
                    </div>
                );
            }
            CustomToggleBuilding = ({ children, eventKey }) => {
                const decoratedOnClick = useAccordionToggle(eventKey, () =>
                    this.setState({ active_buildings: active_buildings.map(e => { if (e.id === children.id) { e.value = !e.value; } return e; }) })
                );            
                return (
                    <div onClick={decoratedOnClick}>                    
                        <span
                            type="button"
                            className="text-left building-name"
                        >
                            {children.name}
                        </span>
                        <img 
                            src="/img/pics/vector_up.svg" 
                            className={`vector_accordion ${active_buildings.find(e => e.id === children.id).value ? "rotate_vector" : " " }`}
                        ></img>
                    </div>
                );
            }
            CustomToggleFloor= ({ children, eventKey }) => {
                const decoratedOnClick = useAccordionToggle(eventKey, () =>
                    this.setState({ active_floors: active_floors.map(e => { if (e.id === children.id) { e.value = !e.value; } return e; }) })
                );            
                return (
                    <div onClick={decoratedOnClick}>                    
                        <span
                            type="button"
                            className="text-left floor-name"
                        >
                            {children.name}
                        </span>
                        <img 
                            src="/img/pics/vector_up.svg" 
                            className={`vector_accordion ${active_floors.find(e => e.id === children.id).value ? "rotate_vector" : " " }`}
                        ></img>
                    </div>
                );
            }
        }

        return (
            <>                
                <div className="container-fluid overflow-auto with-actions search_bookings">
                    {/* <div className="container page-title-wrapper" >
                        <h1 id="page-title">
                        { strings.searchingBookings }</h1>
                    </div> */}
                    <div className="container neomorph-card mt-2 search_bookings">
                    <h1 id="page-title-bookings">{ strings.searchingBookings }</h1>
                        <div className="row neomorph-card-inside" >
                            <Container className="container_search_bookings search_bookings">
                                <Row>
                                    <div className="first_datepicker">
                                        <DatePicker
                                            dateFormat="dd.MM.yyyy"
                                            selected={dateStart}
                                            onChange={date => this.onDateStartChange(date)}
                                            selectsStart
                                            startDate={dateStart}
                                            endDate={dateEnd}
                                            minDate={new Date()}
                                            maxDate={user_rights && rbac.isSatisfied([rights.BOOK_WITN_NO_DATE_LIMITS], user_rights) 
                                                ? null
                                                : addDays(new Date(), appSettings.MAX_AVAILABLE_DAYS_TO_BOOK + 1)
                                            }
                                            locale={localStorage.getItem('lang') === 'RU'
                                                ? 'ru'
                                                : localStorage.getItem('lang') === 'US'
                                                    ? 'en'
                                                    : localStorage.getItem('lang') === 'DE'
                                                        ? 'de'
                                                        : 'ru'
                                            }
                                            customInput={<ExampleCustomInputStart/>}
                                            placeholder="Please select a date"
                                        />
                                    </div>
                                    <DatePicker
                                        dateFormat="dd.MM.yyyy"
                                        selected={dateEnd}
                                        onChange={date => this.onDateEndChange(date)}
                                        selectsEnd
                                        startDate={dateStart}
                                        endDate={dateEnd}
                                        minDate={new Date()}
                                        maxDate={user_rights && rbac.isSatisfied([rights.BOOK_WITN_NO_DATE_LIMITS], user_rights) 
                                            ? null
                                            : addDays(new Date(), appSettings.MAX_AVAILABLE_DAYS_TO_BOOK + 1)
                                        }
                                        locale={localStorage.getItem('lang') === 'RU'
                                            ? 'ru'
                                            : localStorage.getItem('lang') === 'US'
                                                ? 'en'
                                                : localStorage.getItem('lang') === 'DE'
                                                    ? 'de'
                                                    : 'ru'
                                        }
                                        customInput={<ExampleCustomInputEnd/>}
                                        placeholderText={strings.date_end}
                                    />
                                    {rbac.isSatisfied([rights.BOOK_FOR_OTHERS], user_rights) ? 
                                        switchChecked ? (
                                                <div id="search-employee-booking">
                                                    <AsyncSearcher
                                                        objects={this.props.search.employees}
                                                        searchObjects={this.searchEmployees_}
                                                        handleSelection={this.handleSelection}
                                                        selected={this.state.selected}
                                                        optionsRender={option => (
                                                            <div key={option.id}>
                                                                <span>{option.name} {option.surname} ({option.login})</span>
                                                            </div>
                                                        )}
                                                        labelKey={option => `${option.name} ${option.surname} (${option.login})`}
                                                        textTranslation={{
                                                            searching:        strings.searchprocess,
                                                            noresults:        strings.noresults,
                                                            placeholder_name: strings.placeholder_name
                                                        }}
                                                        size='lg'
                                                    /> 
                                                </div>
                                            ) : (
                                                <div className="div-input-not-in-app">
                                                    <input type="text"
                                                        name="employeename"
                                                        id="employeename"
                                                        value={employeeName}
                                                        className={`input-employee-not-in-app ${!!employeeName ? "black_text" : ""}`}
                                                        placeholder={strings.placeholder_name}
                                                        onChange={(e) => { this.setState({ employeeName: e.target.value })}} />
                                                </div>
                                        )
                                    : <></> }
                                    {rbac.isSatisfied([rights.BOOK_FOR_OTHERS], user_rights) ? 
                                        <div className="switch-row" onClick={() => { this.setState({ switchChecked: !this.state.switchChecked }); }}>
                                            <img 
                                                style={{ marginTop: '5px' }}
                                                src={`img/pics/checkbox_${switchChecked}.svg`}
                                            ></img>
                                            <label className="label-switch" >
                                                <span className="element-switch">{strings.employeeinsystem}</span>                                            
                                            </label> 
                                        </div>
                                        : <></>
                                    }
                                    {/* <div className="switch-row">
                                        <ToggleButton
                                            className="element-switch"
                                            inactiveLabel={<div>{strings.no}</div>}
                                            activeLabel={<div>{strings.yes}</div>}
                                            thumbStyle={{display:'inline-block'}}
                                            colors={{
                                                activeThumb: {
                                                    base: 'rgb(251, 0, 107)',
                                                },
                                                inactiveThumb: {
                                                    base: 'rgb(251, 0, 107)',
                                                },
                                                active: {
                                                    base: 'rgb(207,221,245)',
                                                    hover: 'rgb(177, 191, 215)',
                                                },
                                                inactive: {
                                                    base: 'rgb(171, 182, 201)',
                                                    hover: 'rgb(157, 173, 201)',
                                                }
                                            }}
                                            value={switchChecked}
                                            onToggle={(value) => { this.setState({ switchChecked: !value }) }} 
                                        />
                                    </div> */}
                                    <div className="select-row">
                                        <Input
                                            type="select"
                                            name="office_id"
                                            id="office_id"
                                            className={`select_element ${!!office_id ? "black_text" : ""}`}
                                            value={office_id}
                                            onChange={this.handleOfficeChange}
                                        >
                                            <option value="" key="none">{strings.office}</option>
                                            {offices.map(function(data, index) {
                                                return <option key={index + 1} value={data.id}>{ data.name }</option>
                                            })}
                                        </Input>
                                    </div>
                                    <div className="select-row">
                                        <Input
                                            type="select"
                                            name="building_id"
                                            id="building_id"
                                            className={`select_element ${!!building_id ? "black_text" : ""} select_bd`}
                                            value={building_id}
                                            onChange={this.handleBuildingChange}
                                        >
                                            <option value="" key="none">{strings.building}</option>
                                            {!!!office_id 
                                                ? buildings.map(function(data, index) {
                                                    return <option key={index + 1} value={data.id}>{ data.name }</option>
                                                })
                                                : buildings.filter(e => e.office_id === parseInt(office_id)).map(function(data, index) {
                                                    return <option key={index + 1} value={data.id}>{ data.name }</option>
                                                })
                                            }
                                        </Input>
                                    </div>
                                    <button 
                                        className="button-magenta search-button-booking" 
                                        // disabled={!dateStart || !dateEnd}
                                        onClick={() => { this.search() }}
                                    >
                                    {strings.search}
                                    </button>
                                </Row> 
                                {search && search.bookings && search.bookings.items.length > 0 && 
                                 !search.bookings.isFetching && !clearResults && !need_clearing && 
                                 active_buildings.length > 0 && active_cities.length > 0 &&
                                 active_floors.length > 0 && active_offices.length > 0 
                                    ? ( 
                                        search.bookings.items.map(city => (
                                            <Row>
                                                <Accordion defaultActiveKey={city.id}>
                                                    <CustomToggleCity  eventKey={city.id} >
                                                        {city}
                                                    </CustomToggleCity>                                                    
                                                    <Accordion.Collapse eventKey={city.id} className="tab_content text-left">
                                                    <Accordion>
                                                        {city.offices.map(office => {
                                                            return (
                                                                <Row>
                                                                    <Accordion defaultActiveKey={office.id}>
                                                                        <CustomToggleOffice  eventKey={office.id} >
                                                                            {office}
                                                                        </CustomToggleOffice>                                                    
                                                                        <Accordion.Collapse eventKey={office.id} className="tab_content text-left">
                                                                        <Accordion>
                                                                            {office.buildings.map(building => {
                                                                                return ( 
                                                                                    <Row>
                                                                                        <Accordion defaultActiveKey={building.id}>
                                                                                            <CustomToggleBuilding  eventKey={building.id} >
                                                                                                {building}
                                                                                            </CustomToggleBuilding>                                                    
                                                                                            <Accordion.Collapse eventKey={building.id} className="tab_content text-left">
                                                                                                <Accordion>                                                             
                                                                                                    {building.floors.map(floor =>  {
                                                                                                        return ( 
                                                                                                            <Row>
                                                                                                                <Accordion defaultActiveKey={floor.id}>
                                                                                                                    <CustomToggleFloor  eventKey={floor.id} >
                                                                                                                        {floor}
                                                                                                                    </CustomToggleFloor>                                                    
                                                                                                                    <Accordion.Collapse eventKey={floor.id} className="tab_content text-left">
                                                                                                                        <Accordion>   
                                                                                                                            {floor.places.map(place => 
                                                                                                                                <Row key={`${place.name}`}>
                                                                                                                                    {place.ready ?
                                                                                                                                        <Link 
                                                                                                                                            to={`/floors/${floor.id}?object_id=${place.id}&book_from=${place.book_from}&book_to=${place.book_to}&employee=${employee}&switchState=${switchChecked}&building_id=${building_id}&office_id=${office_id}`} 
                                                                                                                                            key={`${building.name}_${floor.name}_${place.name}`} 
                                                                                                                                            className="place-name black_link"
                                                                                                                                        >
                                                                                                                                            <img src="/img/pics/dot.svg" style={{marginRight: "5px"}}></img>{place.name} 
                                                                                                                                        </Link>
                                                                                                                                        : <>
                                                                                                                                            <span                                                                                      
                                                                                                                                                data-tip 
                                                                                                                                                data-for={`${building.name}_${floor.name}_${place.name}`} 
                                                                                                                                                className="place-name"
                                                                                                                                            >
                                                                                                                                                <img src="/img/pics/dot.svg" style={{marginRight: "5px"}}></img>{place.name} 
                                                                                                                                            </span>
                                                                                                                                            <ReactTooltip id={`${building.name}_${floor.name}_${place.name}`}>  
                                                                                                                                                <span>{strings.ds_table_not_ready}</span>
                                                                                                                                            </ReactTooltip>
                                                                                                                                        </>
                                                                                                                                    }
                                                                                                                                </Row>
                                                                                                                            )}
                                                                                                                        </Accordion>
                                                                                                                    </Accordion.Collapse>
                                                                                                                </Accordion>
                                                                                                            </Row>
                                                                                                        )
                                                                                                    })}
                                                                                                </Accordion>
                                                                                            </Accordion.Collapse>
                                                                                        </Accordion>
                                                                                    </Row>
                                                                                )
                                                                            })}
                                                                        </Accordion>
                                                                    </Accordion.Collapse>
                                                                </Accordion>
                                                            </Row>
                                                        )})}
                                                    </Accordion>
                                                    </Accordion.Collapse>
                                                </Accordion>
                                            </Row>
                                        ))
                                      ) 
                                    :   search && search.bookings && search.bookings.isFetching
                                            ? (<Loading></Loading>)
                                            : search && search.bookings && search.bookings.status == 550 && !clearResults && !search.bookings.isFetching
                                                ? (<>{strings.noplacesavailable}</>)
                                                : search && search.bookings && search.bookings.status == 552 && !clearResults && !search.bookings.isFetching 
                                                    ? (<>{strings.havebookingsametime} {moment(search.bookings.book_from).format('DD.MM.yyyy')}-{moment(search.bookings.book_to).format('DD.MM.yyyy')}{strings.havebookingsametim}</>)
                                                    : search && search.bookings && search.bookings.status == 553 && !clearResults && !search.bookings.isFetching
                                                        ? (<>{strings.uncorrectdates}</>)
                                                        : search && search.bookings &&  search.bookings.items.length === 0 && !search.bookings.isFetching && !clearResults
                                                            ? (<>{strings.noresults}</>)
                                                            : search && search.bookings && !search.bookings.isFetching && user.user.data.office_id == office_id && !clearResults
                                                                ? (<>{strings.bookinginyouoffice}</>)
                                                                : (<></>)
                                }
                                <Row>
                                    <div style={{marginTop: '150px'}}></div>
                                </Row>
                            </Container>
                        </div>
                    </div>
                </div>
            </>
        );
        } else {
            return (<Loading/>)
        }
    }
}

const mapStateToProps = state => {
    return {
        user:      state.user,
        search:    state.search,
        // bookings:  state.bookings,
        offices:   state.offices,
        buildings: state.buildings,
        cities:    state.cities,
        floors:    state.floors
    };
};

function mapDispatchToProps(dispatch) {
    return {
        searchBookings:     (book_from, book_to, employee, switchState, office_id, building_id) => dispatch(searchBookings(book_from, book_to, employee, switchState, office_id, building_id)),
        searchEmployees:    (query, page) => dispatch(searchEmployees(query, page)),
        searchEmployeeById: (id) => dispatch(searchEmployeeById(id)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(SearchBookings);