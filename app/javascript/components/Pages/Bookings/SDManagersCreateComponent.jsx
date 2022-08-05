import React, { Component } from 'react';
import { connect }          from "react-redux";
import { 
    Col,
    Row, 
    Button, 
    Form,
    FormGroup, 
    Label, 
}                           from 'reactstrap';
import { Link }             from 'react-router-dom';
import { toast }            from 'react-toastify';
import { Redirect }         from 'react-router-dom';

import { 
    addSDManagers_costcenter, 
    getSDManagers_costcenters    
}                         from '../../../actions/SDManagersCostcentersActions';
import { 
    searchCostcenters,
    searchEmployees
}                         from '../../../actions/SearchActions';

import AsyncSearcher from '../../Elements/AsyncSearcher';

import 'react-bootstrap-typeahead/css/Typeahead.css';

import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en:{
        addsdmanager:         "Add SD manager",
        employee:             "Employee",
        create:               "Create",
        order:                "Order",
        backtolist:           "Back to list",
        costcenters:          "Costcenters",
        searchingCostcenters: "Search costcenters",
        noresults:            "No results",
        placeholder_name:     "Type Costcenter",
        searchingEmployyes:   "Search employee",
        placeholder_name_e:   "Type Employee",
        sdmanagercreated:     "SD manager created"
    },
    ru: {
        addsdmanager:         "Добавить SD менеджера",
        employee:             "Сотрудник",
        create:               "Создать",
        order:                "Порядок",
        backtolist:           "Назад к списку",
        costcenters:          "МВЗ",
        searchingCostcenters: "Поиск МВЗ",
        noresults:            "Нет результатов",
        placeholder_name:     "Введите МВЗ",
        searchingEmployyes:   "Поиск сотрудника",
        placeholder_name_e:   "Введите имя/фамилию",
        sdmanagercreated:     "SD менеджер создан"
    },
    de: {
        addsdmanager:         "SD manager hinzufügen",
        employee:             "Mitarbeiter",
        create:               "Erstellen",
        order:                "Bestellung",
        backtolist:           "Zurück zur Liste",
        costcenters:          "Costcenters",
        searchingCostcenters: "Suche nach Kostenstellen",
        noresults:            "Keine Ergebnisse",
        placeholder_name:     "Geben Sie Kostenstelle ein",
        searchingEmployyes:   "Mitarbeiter suchen",
        placeholder_name_e:   "Typ Mitarbeiter",
        sdmanagercreated:     "SD-Manager erstellt"
    }
});

function mapDispatchToProps(dispatch) {
    return {
        addSDManagers_costcenter:  (costcenter_num, employee_id) => dispatch(addSDManagers_costcenter(costcenter_num, employee_id)),
        searchCostcenters:         (query, page) => dispatch(searchCostcenters(query, page)),
        searchEmployees:           (query, page) => dispatch(searchEmployees(query, page)),
        getSDManagers_costcenters: () => dispatch(getSDManagers_costcenters()),
    };
}

const mapStateToProps = state => {
    
    return {
        groups:                 state.groups,
        search:                 state.search,
        sdmanagers_costcenters: state.sdmanagers_costcenters,
    };
};

class SDManagersCreate extends Component {

    notify = () => {
        toast.success(strings.sdmanagercreated, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.state = {
            selectedEmployee:    [],
            selectedCostcenters: [],
            redirect:            false
        }
        
        this.save                       = this.save.bind(this);
        this.searchCostcenters_         = this.searchCostcenters_.bind(this);
        this.addCostcenter              = this.addCostcenter.bind(this);
        this.searchEmployees_           = this.searchEmployees_.bind(this);
        this.handleSelectionEmployee    = this.handleSelectionEmployee.bind(this);
        this.handleSelectionCostcenters = this.handleSelectionCostcenters.bind(this);
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    save() {
        const { 
            selectedEmployee,
            selectedCostcenters 
        } = this.state;
        selectedCostcenters.map(sc => {
            this.props.addSDManagers_costcenter(sc, selectedEmployee[0].id);
        })
        this.props.getSDManagers_costcenters();
        this.notify();
        this.setState({ redirect: true });
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

    handleSelectionEmployee(item) {
        this.setState({
            selectedEmployee: item
        });
    }

    handleSelectionCostcenters(item) {
        this.setState({
            selectedCostcenters: item
        });
    }

    render() {
        const { 
            selectedEmployee,
            selectedCostcenters,
            redirect 
        }                = this.state;
        const { search } = this.props;

        if (redirect) { return(<Redirect to="/bookings?key=SD_MANAGERS"/>); }

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
                                    selected={selectedEmployee}
                                    optionsRender={option => (
                                        <div key={option.id} tabindex="0" className="rbt-token rbt-token-removeable">
                                            {option.name} {option.surname} ({option.login})
                                        </div>
                                    )}
                                    labelKey={option => `${option.name} ${option.surname} (${option.login})`}
                                    textTranslation={{
                                        searching:        strings.searchEmployees,
                                        noresults:        strings.noresults,
                                        placeholder_name: strings.placeholder_name_e
                                    }}                                               
                                />  
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="fieldOrder" sm={4}>{ strings.costcenters }</Label>
                                <Col sm={8}>
                                    <AsyncSearcher
                                        {...this.state}
                                        objects={search.costcenters}
                                        disabled={!(selectedEmployee.length > 0)}
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
                                            searching:        strings.searchingBookings,
                                            noresults:        strings.noresults,
                                            placeholder_name: strings.placeholder_name
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
                    <Link to="/bookings?key=SD_MANAGERS">
                        { strings.backtolist }
                    </Link>
                    
                    <Button 
                        color="success" 
                        onClick={this.save} 
                        disabled={selectedCostcenters.length <= 0 && selectedEmployee.length <= 0}
                    >
                        {strings.create}
                    </Button>
                    
                </div>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(SDManagersCreate);