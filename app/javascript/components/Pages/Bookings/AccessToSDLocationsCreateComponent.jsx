import React, { Component } from 'react';
import { connect }          from "react-redux";
import { 
    Col,
    Button, 
    Form,
    FormGroup, 
    Label, 
}                           from 'reactstrap';
import { Link }             from 'react-router-dom';
import { toast }            from 'react-toastify';
import { Redirect }         from 'react-router-dom';

import { 
    getLocationInfo,
    removeObjectFromLocation,
    addObjectToLocation,
    getLocationsInfo
}                         from '../../../actions/SDLocationsManagmentActions';
import { 
    searchCostcenters,
    searchEmployees,
    searchProjects,
}                         from '../../../actions/SearchActions';

import AsyncSearcher from '../../Elements/AsyncSearcher';
import Loading       from '../Loading/LoadingComponent';

import * as types from '../../../constants/ObjectLocationTypes';

import 'react-bootstrap-typeahead/css/Typeahead.css';

import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en:{
        addsdmanager:         "SD Locations access managment",
        employee:             "Employees",
        create:               "Create",
        order:                "Order",
        backtolist:           "Back to list",
        save:                 "Save",
        costcenters:          "Costcenters",
        searchingCostcenters: "Search costcenters",
        noresults:            "No results",
        placeholder_name:     "Type Costcenter",
        searchingEmployyes:   "Search employee",
        placeholder_name_e:   "Type Employee",
        placeholder_name_p:   "Type project name",
        changes_saved:        "Changes saved!",
        searchingProjects:    "Searching projects",
        projects:             "Projects"
    },
    ru: {
        addsdmanager:         "Доступ к SD помещению",
        employee:             "Сотрудники",
        create:               "Создать",
        order:                "Порядок",
        backtolist:           "Назад к списку",
        save:                 "Сохранить",
        costcenters:          "МВЗ",
        searchingCostcenters: "Поиск МВЗ",
        noresults:            "Нет результатов",
        placeholder_name:     "Введите МВЗ",
        searchingEmployyes:   "Поиск сотрудника",
        placeholder_name_e:   "Введите имя/фамилию",
        placeholder_name_p:   "Введите название проекта",
        changes_saved:        "Изменения сохранены!",
        searchingProjects:    "Поиск проектов",
        projects:             "Проекты"
    },
    de: {
        addsdmanager:         "Zugriff auf SD-Standorte",
        employee:             "Mitarbeiter",
        create:               "Erstellen",
        order:                "Bestellung",
        backtolist:           "Zurück zur Liste",
        save:                 "Speichern",
        costcenters:          "Costcenters",
        searchingCostcenters: "Suche nach Kostenstellen",
        noresults:            "Keine Ergebnisse",
        placeholder_name:     "Geben Sie Kostenstelle ein",
        searchingEmployyes:   "Mitarbeiter suchen",
        placeholder_name_e:   "Typ Mitarbeiter",
        placeholder_name_p:   "Projektname eingeben",
        changes_saved:        "Änderungen gespeichert!",
        searchingProjects:    "Projekte suchen",
        projects:             "Projekte"
    }
});

function mapDispatchToProps(dispatch) {
    return {
        searchCostcenters:        (query, page) => dispatch(searchCostcenters(query, page)),
        searchEmployees:          (query, page) => dispatch(searchEmployees(query, page)),
        searchProjects:           (query, page) => dispatch(searchProjects(query, page)),
        getLocationInfo:          (id) => dispatch(getLocationInfo(id)),
        getLocationsInfo:         () => dispatch(getLocationsInfo()),
        removeObjectFromLocation: (id, location_id, type) => dispatch(removeObjectFromLocation(id, location_id, type)),
        addObjectToLocation:      (object_id, location_id, type) => dispatch(addObjectToLocation(object_id, location_id, type)),
    };
}

const mapStateToProps = state => {
    return {
        groups:                 state.groups,
        search:                 state.search,
        sdmanagers_costcenters: state.sdmanagers_costcenters,
        sdLocationsManagment:   state.sdLocationsManagment
    };
};

class AccessToSDLocationsCreate extends Component {

    notify = () => {
        toast.success(strings.changes_saved, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.state = {
            selectedEmployees:   [],
            selectedCostcenters: [],
            selectedProjects:    [],
            location_id:         parseInt(this.props.match.params.id),
            firstLoad:           true,
            redirect:            false,
            firstLoad:           true
        }
        
        this.save                       = this.save.bind(this);
        this.searchCostcenters_         = this.searchCostcenters_.bind(this);
        this.addCostcenter              = this.addCostcenter.bind(this);
        this.searchEmployees_           = this.searchEmployees_.bind(this);
        this.searchProjects_            = this.searchProjects_.bind(this);
        this.handleSelectionEmployee    = this.handleSelectionEmployee.bind(this);
        this.handleSelectionCostcenters = this.handleSelectionCostcenters.bind(this);
        this.handleSelectionProjects    = this.handleSelectionProjects.bind(this);
    }

    componentDidMount() {
        this.props.getLocationInfo(parseInt(this.props.match.params.id));
        this.setState({ firstLoad: true });
    }

    componentDidUpdate(prevProps) {
        const new_location_id = parseInt(this.props.match.params.id);
        if (parseInt(this.props.match.params.id) != parseInt(prevProps.match.params.id)) {
            this.setState({ 
                location_id: new_location_id,
                firstLoad:   true,
                redirect:    false,
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        const { sdLocationsManagment }   = nextProps;
        const { firstLoad, location_id } = this.state;
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
        if (!sdLocationsManagment.isFetching && firstLoad) {
            const selectedEmployees_   = sdLocationsManagment.employeeLocations.filter(e => e.location_id === location_id);
            const selectedCostcenters_ = sdLocationsManagment.costcentersLocations.filter(e => e.location_id === location_id).map(e => e.costcenter_num);
            const selectedProjects_    = sdLocationsManagment.projectsLocations.filter(e => e.location_id === location_id);
            this.setState({
                selectedEmployees:   selectedEmployees_,
                selectedCostcenters: selectedCostcenters_,
                selectedProjects:    selectedProjects_,
                firstLoad:           false
            })
        }
    }

    save() {
        const { 
            selectedEmployees,
            selectedCostcenters,
            selectedProjects,
            location_id
        } = this.state;
        const { sdLocationsManagment } = this.props;
        const removedEmployees         = sdLocationsManagment.employeeLocations.filter(e => 
            selectedEmployees.find(se => se.id === e.id) === undefined);
        const newEmployees             = selectedEmployees.filter(e => 
            sdLocationsManagment.employeeLocations.find(se => se.id === e.id) === undefined);
        const removedСostcenters       = sdLocationsManagment.costcentersLocations.filter(e => 
            selectedCostcenters.find(se => se === e.costcenter_num) === undefined).map(e => { return e.costcenter_num; });
        const newСostcenters           = selectedCostcenters.filter(e => 
            sdLocationsManagment.costcentersLocations.find(se => se.costcenter_num === e) === undefined);
        const removedProjects          = sdLocationsManagment.projectsLocations.filter(e => 
            selectedProjects.find(se => se.id === e.id) === undefined);
        const newProjects              = selectedProjects.filter(e => 
            sdLocationsManagment.projectsLocations.find(se => se.id === e.id) === undefined);

        if (removedEmployees.length > 0) removedEmployees.map(e => { this.props.removeObjectFromLocation(e.id, location_id, types.EMPLOYEE)});
        if (removedСostcenters.length > 0) removedСostcenters.map(e => { this.props.removeObjectFromLocation(e, location_id, types.COSTCENTER)});
        if (removedProjects.length > 0) removedProjects.map(e => { this.props.removeObjectFromLocation(e.id, location_id, types.PROJECT)});
        if (newEmployees.length > 0) newEmployees.map(e => { this.props.addObjectToLocation(e.id, location_id, types.EMPLOYEE)});
        if (newСostcenters.length > 0) newСostcenters.map(e => { this.props.addObjectToLocation(e, location_id, types.COSTCENTER)});
        if (newProjects.length > 0) newProjects.map(e => { this.props.addObjectToLocation(e.id, location_id, types.PROJECT)});

        this.setState({ redirect: true });
        this.props.getLocationsInfo();
        this.notify();
    }

    searchCostcenters_(query, page) {
        this.props.searchCostcenters(query, page);
    }

    addCostcenter(costcenter_num, employee_id) {
        this.props.addSDManagers_costcenter(costcenter_num, employee_id);
    }

    searchEmployees_(query, page) {
        this.props.searchEmployees(query, page);
    }

    searchProjects_(query, page) {
        this.props.searchProjects(query, page);
    }

    handleSelectionEmployee(item) {
        this.setState({
            selectedEmployees: item
        });
    }

    handleSelectionCostcenters(item) {
        this.setState({
            selectedCostcenters: item
        });
    }

    handleSelectionProjects(item) {
        this.setState({
            selectedProjects: item
        });
    }

    render() {
        const { 
            selectedEmployees,
            selectedCostcenters,
            selectedProjects,
            redirect
        } = this.state;
        const { 
            search,
            sdLocationsManagment,
        } = this.props;

        if (redirect) { return(<Redirect to="/bookings?key=SD_LOCATIONS_MANAGMENT"/>); }
        
        if (!sdLocationsManagment.isFetching) {
           
            return (
                <>
                    <div className="container-fluid overflow-auto with-actions">
                        <div className="container page-title-wrapper" >
                            <h1 id="page-title">{ strings.addsdmanager }</h1>
                        </div>
                        <div className="container neomorph-card mt-2">
                            <div className="row neomorph-card-inside" >
                            <Form className="entity-management-form">
                                <FormGroup row>
                                    <Label for="fieldName" sm={4}>{ strings.employee }</Label>
                                    <Col sm={8}>
                                    <AsyncSearcher
                                        {...this.state}
                                        objects={search.employees}
                                        searchObjects={this.searchEmployees_}
                                        handleSelection={this.handleSelectionEmployee}
                                        selected={selectedEmployees}
                                        optionsRender={option => (
                                            <div key={option.id} tabindex="0" className="rbt-token rbt-token-removeable">
                                                {option.name} {option.surname} ({option.login})
                                            </div>
                                        )}
                                        labelKey={option => `${option.name} ${option.surname} (${option.login})`}
                                        textTranslation={{
                                            searching:        strings.searchingEmployyes,
                                            noresults:        strings.noresults,
                                            placeholder_name: strings.placeholder_name_e
                                        }}     
                                        multiple={true}                                           
                                    />  
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="fieldOrder" sm={4}>{ strings.costcenters }</Label>
                                    <Col sm={8}>
                                        <AsyncSearcher
                                            {...this.state}
                                            objects={search.costcenters}
                                            searchObjects={this.searchCostcenters_}
                                            handleSelection={this.handleSelectionCostcenters}
                                            selected={selectedCostcenters}
                                            optionsRender={option =>  (
                                                <div key={option} tabindex="0" className="rbt-token rbt-token-removeable">
                                                    {option}
                                                </div>
                                            )}
                                            labelKey={option => `${option}`}
                                            textTranslation={{
                                                searching:        strings.searchingCostcenters,
                                                noresults:        strings.noresults,
                                                placeholder_name: strings.placeholder_name
                                            }}  
                                            multiple={true}                                              
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="fieldOrder" sm={4}>{ strings.projects }</Label>
                                    <Col sm={8}>
                                        <AsyncSearcher
                                            {...this.state}
                                            objects={search.projects}
                                            searchObjects={this.searchProjects_}
                                            handleSelection={this.handleSelectionProjects}
                                            selected={selectedProjects}
                                            optionsRender={option =>  (
                                                <div key={option.id} tabindex="0" className="rbt-token rbt-token-removeable">
                                                    {option.name}
                                                </div>
                                            )}
                                            minLength={1}
                                            labelKey={option => `${option.name}`}
                                            textTranslation={{
                                                searching:        strings.searchProjects,
                                                noresults:        strings.noresults,
                                                placeholder_name: strings.placeholder_name_p
                                            }}  
                                            multiple={true}                                              
                                        />
                                    </Col>
                                </FormGroup>
                            </Form>
                            </div>
                        </div>
                    </div>
                    <div id="bottom-actions-block">
                        <Link to="/bookings?key=SD_LOCATIONS_MANAGMENT">
                            { strings.backtolist }
                        </Link>  
                        <Button 
                            color="success" 
                            onClick={() => { this.save(); }}
                        >
                            { strings.save }
                        </Button>                
                    </div>
                </>
            )
        } else {
            return(<Loading/>);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(AccessToSDLocationsCreate);