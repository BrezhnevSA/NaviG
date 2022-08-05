import React, { Component }            from 'react';
import { connect }                     from "react-redux";
import { Link }                        from 'react-router-dom';
import BootstrapTable                  from 'react-bootstrap-table-next';
import filterFactory, { textFilter }   from 'react-bootstrap-table2-filter';
import paginationFactory               from 'react-bootstrap-table2-paginator';
import ReactTooltip from 'react-tooltip';
import queryString                     from 'query-string';
import { 
    Row,
    Col, 
    Button, 
    Container,
    Input
}                                      from 'reactstrap';
import { Accordion  }                  from "react-bootstrap";
import { useAccordionToggle }          from 'react-bootstrap/AccordionToggle';
import { getProfile }                  from '../../../actions/ProfileActions';
import { 
    searchEmployeesInCostcenter,
    searchEmployeesInProject,
    downloadSearchEmployeesInProject,
    downloadSearchEmployeesInCostcenter
} from '../../../actions/SearchActions';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import LocalizedStrings from 'react-localization';
import { string } from 'prop-types';

import Loading from '../Loading/LoadingComponent';
import FilterWorkTypeSidebar from './FilterWorkTypeSidebar';
import "./EmployeesIn.css";

let strings = new LocalizedStrings({
    en:{
        costcenter_title:  "Employees in costcenter #",
        employee:          "Employee",
        leader:            "Leader",   
        showing:           "Showing",
        from:              "from",
        to:                "to",
        of:                "of",
        results:           "Results",
        active:            "Active",
        inactive:          "Inactive",
        all:               "All",
        yes:               "Yes",
        no:                "No",
        email:             "Email",
        login:             "Login",
        nothing_found:     "Nothing found",
        not_placed:        "Without place",
        emp_with_no_place: "Employees with office place",
        emp_with_place:    "Employees without office place",
        write_message:     "Write a message",
        project:           "Project",
        download_list:     "Download list",
        no_work_type:      "Not selected",
        hybrid:            "Hybrid",
        flex:              "Flex",    
        dekret:            "Decree",
        flex_desc:         "You work mainly from the office, you have a fixed workplace, and you can <br />periodically work from home in agreement with the manager. You decide how<br /> to distribute equipment (hardware) between the office and home.",
        hybrid_desc:       "You work mainly from home. For office work, you can book a shared desk in<br /> the area of ​​your project. With the support of the company, you transport<br /> equipment and all personal belongings from the office home. You do not <br />waste time on the road, but if you need to meet with colleagues <br />personally - meeting rooms and a shared desk at your service.",
        no_work_type_desc: "Work type not selected.", 
        dekret_desc:       "Decree",  
        filter:            "Filter",
        noemployees:       "No employees"
    },
    ru: {
        costcenter_title:  "Сотрудники в МВЗ №",
        employee:          "Сотрудник",  
        leader:            "Руководитель",     
        showing:           "Отображено",
        from:              "с",
        to:                "по",
        of:                "из",
        results:           "всего",
        active:            "Активно",
        inactive:          "Неактивно",
        all:               "Все",        
        yes:               "Да",
        no:                "Нет",
        email:             "Email",
        login:             "Логин",
        nothing_found:     "Ничего не найдено",
        not_placed:        "Без мест",
        emp_with_no_place: "Сотрудники с местом в офисе",
        emp_with_place:    "Сотрудники без места в офисе",
        write_message:     "Написать сообщение",
        project:           "Проект",
        download_list:     "Скачать список",
        no_work_type:      "Не выбран",
        hybrid:            "Hybrid",
        flex:              "Flex",      
        dekret:            "Декрет",      
        flex_desc:         "Вы работаете преимущественно из офиса, за вами закреплено рабочее место, <br />при этом вы можете периодически работать из дома по согласованию с <br />руководителем. Как распределить оборудование («железо») между офисом и <br />домом вы решаете сами.",
        hybrid_desc:       "Вы трудитесь преимущественно из дома. Для работы в офисе вы можете <br />забронировать shared desk в зоне вашего проекта. Оборудование и все личные <br />вещи из офиса вы при поддержке компании перевозите домой. Вы не тратите <br />время на дорогу, а если вам нужно встретиться с коллегами лично – <br />переговорные комнаты и shared desk к вашим услугам.",
        no_work_type_desc: "Тип работы не выбран.",
        dekret_desc:       "Декрет",
        filter:            "Фильтр", 
        noemployees:       "Нет сотрудников"
    },
    de: {
        costcenter_title:  "Mitarbeiter in der Kostenstelle #",
        employee:          "Mitarbeiter",
        leader:            "der Leiter",   
        showing:           "Zeigen",
        from:              "von",
        to:                "zu",
        of:                "von",
        results:           "Ergebnisse",
        active:            "Aktiv",
        inactive:          "Inaktiv",
        all:               "Alles",        
        yes:               "Ja",
        no:                "Nein",
        email:             "Email",
        login:             "Login",
        nothing_found:     "Nichts gefunden",
        not_placed:        "Ohne Platz",
        emp_with_no_place: "Mitarbeiter mit Büroplatz",
        emp_with_place:    "Mitarbeiter ohne Büroplatz",
        write_message:     "Eine Nachricht schreiben",
        project:           "Projekt",
        download_list:     "Liste herunterladen",
        no_work_type:      "Nicht ausgewählt",
        hybrid:            "Hybrid",
        flex:              "Flex",       
        dekret:            "Dekret",
        flex_desc:         "Sie arbeiten hauptsächlich vom Büro aus, haben einen festen Arbeitsplatz <br />und können in Absprache mit dem Manager regelmäßig von zu Hause aus <br />arbeiten. Sie entscheiden, wie Geräte (Hardware) zwischen Büro und Zuhause<br /> verteilt werden sollen.",
        hybrid_desc:       "Sie arbeiten hauptsächlich von zu Hause aus. Für Büroarbeiten können Sie <br />einen gemeinsamen Schreibtisch im Bereich Ihres Projekts buchen. Mit <br />Unterstützung des Unternehmens transportieren Sie Geräte und alle <br />persönlichen Gegenstände vom Büro zu Hause aus. Sie tun dies nicht <br />Verschwenden Sie Zeit auf der Straße, aber wenn Sie sich persönlich mit <br />Kollegen treffen müssen - Besprechungsräume und ein gemeinsamer <br />Schreibtisch zu Ihren Diensten.",
        no_work_type_desc: "Auftragstyp nicht ausgewählt.", 
        dekret_desc:       "Dekret",
        filter:            "Filter",
        noemployees:       "Keine Mitarbeiter"
    }
});

class EmployyeesIn extends Component {

    constructor(props) {
        super(props)

        this.state = {
            search_id: this.props.match.params.search_id,
            head_profile: false,
            active_cities:  [],
            active_offices: [],
            active_buildings: [],
            active_floors:  [],
            filter_sidebar_show: false,
            all_types: true,
            flex: true,
            hybrid: true,
            no_work_type: true,
            dekret: true,
        }
        
        this.closeSidebar = this.closeSidebar.bind(this);
        this.openSidebar = this.openSidebar.bind(this);
        this.filterEmployees = this.filterEmployees.bind(this);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase()); 
    }

    componentDidMount() {
        const parsed_params = queryString.parse(this.props.location.search);
        const page_type = parsed_params.page_type;
        if (page_type === 'costcenters') {
            this.props.searchEmployeesInCostcenter(this.props.match.params.search_id);
        } else if (page_type === 'projects') {
            this.props.searchEmployeesInProject(this.props.match.params.search_id);
        }
    }

    componentDidUpdate(prevProps) {
        const parsed_params = queryString.parse(this.props.location.search);
        const page_type = parsed_params.page_type;

        const parsed_params_old = queryString.parse(prevProps.location.search);
        const page_type_old = parsed_params_old.page_type;

        if(page_type_old !== page_type) {
            if (page_type === "costcenters") {
                this.props.searchEmployeesInCostcenter(this.props.match.params.search_id);
                this.setState({ search_id: this.props.match.params.search_id, head_profile: false, filter_sidebar_show: false, });
            } else if (page_type === "projects") {
                this.props.searchEmployeesInProject(this.props.match.params.search_id);
                // if prfoile for projects needed - do not forget to set head_profile false
                this.setState({ search_id: this.props.match.params.search_id, filter_sidebar_show: false,});
            }
        }

        if (page_type_old === page_type && page_type === "costcenters" && this.props.match.params.search_id !== prevProps.match.params.search_id) {
            this.setState({
                search_id: this.props.match.params.search_id,
                filter_sidebar_show: false,
                flex: true,
                hybrid: true,
                no_work_type: true,
                dekret: true,
            });
            this.props.searchEmployeesInCostcenter(this.props.match.params.search_id);
        }
        if (page_type_old === page_type && page_type === "costcenters" && !!this.props.search.employees_in_costcenter.items && !this.state.head_profile) {
            const head = this.props.search.employees_in_costcenter.items.head;
            this.props.getProfile(head['id']);
        }
        // if (!this.state.head_profile && !!this.props.search.employees_in_costcenter.items) {

        //     this.setState({
        //         head_profile: true
        //     });
        // }

        if (page_type_old === page_type && page_type === "costcenters" && !this.state.head_profile && !!this.props.search.employees_in_costcenter.items) {
            if (!!this.props.search.employees_in_costcenter.items['head']) {
                this.setState({
                    head_profile: true,
                    filter_sidebar_show: false,
                    flex: true,
                    hybrid: true,
                    no_work_type: true,
                    dekret: true,
                });
            }
        }   
        
        if (page_type_old === page_type && page_type === "projects" && this.props.match.params.search_id !== prevProps.match.params.search_id) {
            this.setState({
                project_id: this.props.match.params.search_id,
                filter_sidebar_show: false,
                flex: true,
                hybrid: true,
                no_work_type: true,
                dekret: true,
            });
            this.props.searchEmployeesInProject(this.props.match.params.search_id);
        }
        // if (page_type_old === page_type && page_type === "projects" && !!this.props.search.employees_in_project.items && !this.state.head_profile) {
        //     const head = this.props.search.employees_in_project.items.heads;
        //     if (!!this.props.profile.item && !!head[0] && (head[0]['id'] !== this.props.profile.item['id'])) {
        //         this.props.getProfile(head[0]['id']);
        //     }
        // }
        if (page_type_old === page_type && page_type === "projects" && !this.state.head_profile && !!this.props.search.employees_in_project.items) {
            if (!!this.props.search.employees_in_project.items['heads']) {
                if (this.props.search.employees_in_project.items['heads'].length > 0) {
                    this.setState({
                        head_profile: true,
                        filter_sidebar_show: false,
                        flex: true,
                        hybrid: true,
                        no_work_type: true,
                        dekret: true,
                    });
                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const { 
            active_cities,
            active_buildings,
            active_floors,
            active_offices 
        } = this.state;

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        if (nextProps.cities && nextProps.cities.length > 0 && active_cities.length === 0) {
            this.setState({ active_cities: nextProps.cities.map(e => { return { id: e.id, value: true } }) });
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
    }

    copyToClipboard(text) {
        // window.prompt(strings.copy, window.location.protocol + '//' + window.location.hostname + text)
        window.prompt(strings.copy, text)
    }

    closeSidebar() { this.setState({ filter_sidebar_show: false }); }

    openSidebar() { this.setState({ filter_sidebar_show: true }); }

    filterEmployees(flex, hybrid, no_work_type, dekret) {
        this.setState({
            flex: flex,
            hybrid: hybrid,
            no_work_type: no_work_type,
            dekret: dekret,
        })
    }

    render() {
        const { 
            search, 
            profile,
            offices,
            floors,
            buildings,
            cities  
        } = this.props;
        const { 
            search_id,
            active_cities,
            active_buildings,
            active_floors,
            active_offices,
            filter_sidebar_show,
            flex,
            hybrid,
            no_work_type,
            dekret,
        } = this.state;

        const parsed_params = queryString.parse(this.props.location.search);
        const page_type = parsed_params.page_type;

        if ((page_type === "costcenters" && !search.employees_in_costcenter.isFetching && !!search.employees_in_costcenter.items) ||
            (page_type === "projects" && !search.employees_in_project.isFetching && !!search.employees_in_project.items)) {

            const head = page_type === "costcenters" ? this.props.search.employees_in_costcenter.items.head : null;

            let employees = {};
            let output_cities = '';
            let output_no_cities = '';

            if (page_type === "costcenters" && !!this.props.search.employees_in_costcenter.items.employees) {
                this.props.search.employees_in_costcenter.items.employees.forEach((item, i) => {
                    if (!flex && item['work_type'] == 'F') { return; }
                    if (!hybrid && item['work_type'] == 'H') { return; }
                    if (!no_work_type && !item['work_type']) { return; }
                    if (!dekret && item['status'] == 'MATERNITY') { return; }
                    if (!!item['object_item_id']) {
                        if (!!!employees[item['city_id']]) employees[item['city_id']] = {};
                        if (!!!employees[item['city_id']][item['office_id']]) employees[item['city_id']][item['office_id']] = {};
                        if (!!!employees[item['city_id']][item['office_id']][item['building_id']]) employees[item['city_id']][item['office_id']][item['building_id']] = {};
                        if (!!!employees[item['city_id']][item['office_id']][item['building_id']][item['floor_id']]) employees[item['city_id']][item['office_id']][item['building_id']][item['floor_id']] = [];

                        employees[item['city_id']][item['office_id']][item['building_id']][item['floor_id']].push(item);
                    }
                    else {
                        if (!!!employees['other']) employees['other'] = [];

                        employees['other'].push(item);
                    }
                });
            }

            if (page_type === "projects" &&!!this.props.search.employees_in_project.items.employees) {
                this.props.search.employees_in_project.items.employees.forEach((item, i) => {
                    if (!!item['object_item_id']) {
                        if (!!!employees[item['city_id']]) employees[item['city_id']] = {};
                        if (!!!employees[item['city_id']][item['office_id']]) employees[item['city_id']][item['office_id']] = {};
                        if (!!!employees[item['city_id']][item['office_id']][item['building_id']]) employees[item['city_id']][item['office_id']][item['building_id']] = {};
                        if (!!!employees[item['city_id']][item['office_id']][item['building_id']][item['floor_id']]) employees[item['city_id']][item['office_id']][item['building_id']][item['floor_id']] = [];

                        employees[item['city_id']][item['office_id']][item['building_id']][item['floor_id']].push(item);
                    }
                    else {
                        if (!!!employees['other']) employees['other'] = [];
                        employees['other'].push(item);
                    }
                });
            }

            let CustomToggleCity = null;
            let CustomToggleOffice = null;
            let CustomToggleBuilding = null;
            let CustomToggleFloor = null;
            if (active_cities.length > 0 && active_offices.length > 0 && active_buildings.length > 0 && floors.length > 0) {
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
                                className="text-left employees-in-office-name"
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
                    <div className="open_filter_employees_sidebar_button">
                        <button 
                            className="button-magenta button-simple" 
                            onClick={() => { this.openSidebar(); }}
                            style={{display: `${filter_sidebar_show ? 'none' : ''}`}}
                        >{strings.filter}</button>                           
                    </div>  
                    <FilterWorkTypeSidebar
                        {...this.props} 
                        lang={this.props.lang} 
                        filter_sidebar_show={filter_sidebar_show} 
                        filterEmployees={this.filterEmployees}
                        closeSidebar={this.closeSidebar} 
                    />
                    <div className="employees-in-container-fluid constcenter-page ">
                        <div className="container page-title-wrapper employees_in" >
                            <div style={{display: "inline-block"}}>
                                    {page_type === "costcenters" 
                                        ? <h1 id="page-title title_for_employee_in" className="employees-in-page-title">{strings.costcenter_title} {head.costcenter_name} ({search_id})</h1>
                                        : <h1 id="page-title title_for_employee_in" className="employees-in-page-title">{strings.project} {search.employees_in_project['items']['name']}</h1>
                                    }
                            </div>
                            <div className="download_button_costcenters">
                                <button 
                                    className="button-magenta button_usual"
                                    style={{ marginTop: '24px' }}
                                    onClick={() => { 
                                        page_type === 'costcenters' 
                                            ? this.props.downloadSearchEmployeesInCostcenter(search_id, head.costcenter_name)
                                            : this.props.downloadSearchEmployeesInProject(search_id, search.employees_in_project['items']['name'])
                                }}>
                                    {strings.download_list}
                                </button> 
                            </div>
                        </div>    
                       
                        { page_type === "costcenters" && !!profile.item && this.state.head_profile ?
                            <div id="costcenter-leader-section" className="container">
                                <div className="costcenter-avatar col-md-4">
                                    <div id="avatar" className="text-left">
                                        <img
                                            className="img-profile-costcenters" 
                                            alt="User Avatar" 
                                            src={`${profile.item.img_url}?${Math.random().toString()}`} 
                                        />
                                    </div>
                                </div>
                                <div className="leader-info col-md-7">
                                    <div className="field-wrapper-header">
                                        <span>{ strings.leader }</span>                                           
                                    </div>
                                    <div className="costcenter_icon" className="field-wrapper">
                                        <img className="costcenter_icon" src="/img/pics/user.svg"></img>
                                        <Link className="leader-info-row" to={`/profile/${profile.item.id}`}>
                                            { profile.item.surname } { profile.item.name } { profile.item.patronymic }
                                        </Link>
                                    </div>
                                    <div className="field-wrapper">
                                        <img className="work_type_icon" src="/img/pics/work_type.svg"></img>
                                        { profile.item && profile.item.work_type == "F"
                                            ? <span 
                                                  className="leader-info-row" 
                                                  data-tip={strings.flex_desc}
                                                  data-for="work_type_flex"
                                                  data-effect="solid"
                                              >
                                                   {strings.flex}
                                              </span>
                                            : profile.item && profile.item.work_type == "H"
                                                ? <span 
                                                      className="leader-info-row" 
                                                      data-tip={strings.hybrid_desc} 
                                                      data-for="work_type_hybrid"
                                                      data-effect="solid"
                                                  >
                                                    {strings.hybrid}
                                                  </span>
                                                : profile.item && profile.item.status == "MATERNITY"
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

                                        <img className="sofa_icon" src="/img/pics/sofa.svg"></img>
                                        { profile.item && profile.item.object_item_id && profile.item.place
                                            ? <Link className="leader-info-row" to={`/floors/${profile.item.place['floor_id']}?object_id=${profile.item.object_item_id}&search=true`}>{profile.item.place.name}</Link>
                                            : <span>-</span>
                                        }
                                    </div>
                                    <div className="field-wrapper">
                                        <img className="costcenter_icon" src="/img/pics/mail_icon.svg"></img>
                                        <Link className="leader-info-row" onClick={() => this.copyToClipboard(profile.item.email)}>
                                            { profile.item.email }
                                        </Link>
                                    </div>
                                    <div className="field-wrapper">
                                        <img className="costcenter_icon" src="/img/pics/webex.svg"></img>
                                        <Link className="leader-info-row" to={`dtag.webex.com/meet/${profile.item.name}.${profile.item.surname}`}>
                                            {strings.write_message}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        : <></>}

                        <div className="container neomorph-card mt-2 costcenters">                                
                                {((page_type === "costcenters" && !!this.props.search.employees_in_costcenter.items.employees) ||
                                 (page_type === "projects" && !!this.props.search.employees_in_project.items.employees)) && 
                                 active_cities.length > 0 && active_offices.length > 0 && active_buildings.length > 0 && 
                                 active_floors.length > 0 ?
                                    <div>                                        
                                        <div className={`row neomorph-card-inside  col-md-12 ${page_type === "costcenters" ? "header-list" : "employees-in-header-list"}`}> 
                                            <div className="inline-element header-left">{strings.emp_with_no_place}</div>
                                            <div className="inline-element header-right">{strings.emp_with_place}</div>
                                        </div>
                                        <div className="row neomorph-card-inside  col-md-12" >   
                                        <div className="inline-element left-list" >   
                                                {Object.keys(employees).map((city) => {
                                                    const city_ = cities.find(c => c.id === parseInt(city));
                                                    if (city_ != undefined) {
                                                        return (
                                                        <Row>
                                                            <Accordion defaultActiveKey={city_.id}>
                                                                <CustomToggleCity  eventKey={city_.id} >
                                                                    {city_}
                                                                </CustomToggleCity>                                                    
                                                                <Accordion.Collapse eventKey={city_.id} className="tab_content text-left">
                                                                    <Accordion>
                                                                        {Object.keys(employees[city]).map((office) => {
                                                                            const office_ = offices.find(c => c.id === parseInt(office));
                                                                            return (
                                                                            <Row>
                                                                                <Accordion defaultActiveKey={office_.id}>
                                                                                    <CustomToggleOffice eventKey={office_.id} >
                                                                                        {office_}
                                                                                    </CustomToggleOffice>                                                    
                                                                                    <Accordion.Collapse eventKey={office_.id} className="tab_content text-left">
                                                                                        <Accordion>
                                                                                            {Object.keys(employees[city][office]).map((building) => {
                                                                                                const building_ = buildings.find(c => c.id === parseInt(building));
                                                                                                return (
                                                                                                <Row>
                                                                                                    <Accordion defaultActiveKey={building_.id}>
                                                                                                        <CustomToggleBuilding eventKey={building_.id} >
                                                                                                            {building_}
                                                                                                        </CustomToggleBuilding>                                                    
                                                                                                        <Accordion.Collapse eventKey={building_.id} className="tab_content text-left">
                                                                                                            <Accordion>
                                                                                                                {Object.keys(employees[city][office][building]).map((floor) => {
                                                                                                                    const floor_ = floors.find(c => c.id === parseInt(floor));
                                                                                                                    return (
                                                                                                                        <Row>
                                                                                                                            <Accordion defaultActiveKey={floor_.id}>
                                                                                                                                <CustomToggleFloor eventKey={floor_.id} >
                                                                                                                                    {floor_}
                                                                                                                                </CustomToggleFloor>                                                    
                                                                                                                                <Accordion.Collapse eventKey={floor_.id} className="tab_content text-left">
                                                                                                                                    <Accordion>
                                                                                                                                    {employees[city][office][building][floor].length > 0 
                                                                                                                                        ? employees[city][office][building][floor].map((employee) => {
                                                                                                                                                return <Link 
                                                                                                                                                            className="place-name black_link" 
                                                                                                                                                            style={{display: 'block'}} 
                                                                                                                                                            to={`/floors/${employee['floor_id']}?object_id=${employee['object_item_id']}`}
                                                                                                                                                            data-tip 
                                                                                                                                                            data-for={`${ employee.work_type == 'H' 
                                                                                                                                                                ? 'work_type_hybrid_icon' 
                                                                                                                                                                : employee.work_type == 'F' 
                                                                                                                                                                    ? 'work_type_flex_icon' 
                                                                                                                                                                    : 'work_type_no_work_type_icon'
                                                                                                                                                            }`}
                                                                                                                                                            data-effect="solid"
                                                                                                                                                        >
                                                                                                                                                        <img 
                                                                                                                                                            src={`/img/pics/${employee.work_type == 'H' ? 'hybrid' : employee.work_type == 'F' ? 'flex' : employee.status == 'MATERNITY' ? 'dekret' : 'noWorkType'}.svg`} 
                                                                                                                                                            style={{marginRight: "5px", marginTop: "-1px"}}
                                                                                                                                                        ></img>{employee['name']}
                                                                                                                                                    </Link>
                                                                                                                                            })
                                                                                                                                        : <div>{strings.noemployees}</div>
                                                                                                                                    }
                                                                                                                                </Accordion>
                                                                                                                            </Accordion.Collapse>
                                                                                                                        </Accordion>
                                                                                                                    </Row>)
                                                                                                                })}
                                                                                                            </Accordion>
                                                                                                        </Accordion.Collapse>
                                                                                                    </Accordion>
                                                                                                </Row>)
                                                                                            })}
                                                                                        </Accordion>
                                                                                    </Accordion.Collapse>
                                                                                </Accordion>
                                                                            </Row>)
                                                                        })}
                                                                    </Accordion>
                                                                </Accordion.Collapse>
                                                            </Accordion>
                                                        </Row>)
                                                    }
                                                })}
                                        </div>
                                        <ReactTooltip id="work_type_flex_icon">{strings.flex}</ReactTooltip>
                                        <ReactTooltip id="work_type_hybrid_icon">{strings.hybrid}</ReactTooltip>
                                        <ReactTooltip id="work_type_no_work_type_icon">{strings.no_work_type}</ReactTooltip>
                                        <div className="inline-element right-list">   
                                                {Object.keys(employees).map((city) => {
                                                    if (city === 'other') {
                                                        if (employees[city].length > 0) {
                                                            return employees[city].map((employee) => {
                                                                return <Link 
                                                                            className="black_link employees_with_no_place_list" 
                                                                            to={`/profile/${employee['id']}`}
                                                                            data-tip 
                                                                            data-for={`${ employee.work_type == 'H' 
                                                                                ? 'work_type_hybrid_icon' 
                                                                                : employee.work_type == 'F' 
                                                                                    ? 'work_type_flex_icon' 
                                                                                    : 'work_type_no_work_type_icon'
                                                                            }`}
                                                                            data-effect="solid"
                                                                    >
                                                                        <img 
                                                                            src={`/img/pics/${employee.work_type == 'H' ? 'hybrid' : employee.work_type == 'F' ? 'flex' : employee.status == 'MATERNITY' ? 'dekret' : 'noWorkType'}.svg`} 
                                                                            style={{marginRight: "5px", marginTop: "-1px"}}
                                                                        ></img>{employee['name']}
                                                                    </Link>
                                                                ;
                                                            });
                                                        } else {
                                                            return <div>{strings.noemployees}</div>;
                                                        }
                                                    }
                                                })}
                                        </div>
                                        </div>
                                        
                                    </div>

                                : <div className="nothing-found">{ strings.nothing_found }</div> }
                                
                            
                            <div className="row neomorph-card-inside  col-md-6" >

                            </div>
                        </div>
                    </div>
                </>
            );
        } else {
            return(<Loading/>);
        }
    }
}

const mapStateToProps = state => {
    return {
        search:    state.search,
        user:      state.user,
        profile:   state.profile,
        cities:    state.cities,
        offices:   state.offices,
        buildings: state.buildings,
        floors:    state.floors
    };
};

function mapDispatchToProps(dispatch) {
    return {
        searchEmployeesInCostcenter:         (costcenter_num) => dispatch(searchEmployeesInCostcenter(costcenter_num)),
        searchEmployeesInProject:            (project_id) => dispatch(searchEmployeesInProject(project_id)),
        getProfile:                          (id) => dispatch(getProfile(id)),
        downloadSearchEmployeesInProject:    (id, name) => dispatch(downloadSearchEmployeesInProject(id, name)),
        downloadSearchEmployeesInCostcenter: (id, name) => dispatch(downloadSearchEmployeesInCostcenter(id, name)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(EmployyeesIn);