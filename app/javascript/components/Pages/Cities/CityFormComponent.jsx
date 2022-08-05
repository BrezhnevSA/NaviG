import React, { Component } from 'react';
import { connect }          from "react-redux";
import { 
    Col, 
    Button, 
    Form, 
    FormGroup, 
    Label, 
    Input,
    FormFeedback 
}                           from 'reactstrap';
import { Link }             from 'react-router-dom';
import { toast }            from 'react-toastify';
import { Redirect }          from 'react-router-dom';

import { 
    updateCity, 
    addCity, 
    removeCity, 
    getCities 
}                           from '../../../actions/CitiesActions';
import { setAllSelections } from '../../../actions/SelectionsActions';

import AttributesForm from '../../Elements/Attributes/AttributesForm';
import ModalWindow    from '../ModalWindow/ModalWindowComponent';

import LocalizedStrings from 'react-localization';

import * as meta from '../../../constants/MetaTypes';

let strings = new LocalizedStrings({
    en:{
        editcity:"Edit City",
        addcity:"Add City",
        name:"Name",
        short_name: 'Short name',
        save:"Save",
        create:"Create",
        order:"Order",
        orderplaceholder:"Enter number",
        isactive:"Is Active",
        backtolist:"Back to list",
        delete:"Delete",
        header: "Delete city with name",
        description: "The object will be deleted permanently.",
        yes: "Yes",
        no: "No",
        changessaved: "Changes Saved!",
        required: "Field is required",
        fieldiscorrect: "Field is correct"
    },
    ru: {
        editcity:"Редактировать Город",
        addcity:"Добавить Город",
        name:"Имя",
        short_name: 'Короткое имя',
        save:"Сохранить",
        create:"Создать",
        order:"Порядок",
        orderplaceholder:"Введите число",
        isactive:"Активно",
        backtolist:"Назад к списку",
        delete:"Удалить",
        header: "Удалить город с названием",
        description: "Объект будет удален навсегда.",
        yes: "Да",
        no: "Нет",
        changessaved: "Изменения сохранены!",
        required: "Поле, обязательное для заполнения",
        fieldiscorrect: "Поле заполнено корректно"  
    },
    de: {
        editcity:"Stadt bearbeiten",
        addcity:"Stadt hinzufügen",
        name:"Name",
        short_name: 'Kurzer Name',
        save:"Speichern",
        create:"Erstellen",
        order:"Bestellung",
        orderplaceholder:"Nummer eingeben",
        isactive:"Ist aktiv",
        backtolist:"Zurück zur Liste",
        delete:"Löschen",
        header: "Stadt mit Namen löschen",
        description: "Das Objekt wird dauerhaft gelöscht.",
        yes: "Ja",
        no: "Nein",
        changessaved: "Änderungen gespeichert!",
        required: "Feld ist erforderlich",
        fieldiscorrect: "Das Feld ist korrekt ausgefüllt"   
    }
});

class CityForm extends Component {

    notify = () => {
        toast.success(strings.chagessaved, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        let current_city = {
            id: null,
            name: '',
            short_name: '',
            ord: 0,
            active: true
        }

        this.state = {
            current_city: current_city,
            redirect: false,
            triggerModal: false,
            saveClicked:  false
        }
        
        this.handleCityNameChange = this.handleCityNameChange.bind(this);
        this.handleCityShortNameChange = this.handleCityShortNameChange.bind(this);
        this.handleCityOrderChange = this.handleCityOrderChange.bind(this);
        this.handleCityActiveChange = this.handleCityActiveChange.bind(this);

        this.save = this.save.bind(this);
        this.remove = this.remove.bind(this);

    }

    componentDidUpdate(prevProps) {
        if (this.props.cities != prevProps.cities) {
            const current_city_key = this.props.cities.findIndex(c => c.id === parseInt(this.props.match.params.id));
            
            if (current_city_key > -1) {
                let current_city = this.props.cities[current_city_key];
                
                this.setState({
                    current_city: current_city,
                    triggerModal: false
                });
            }
        }
    }
    
    componentDidMount() {
        if (!!this.props.cities) {
            this.props.getCities();
        }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    handleCityNameChange(e) {
        this.setState({
            current_city: {
                ...this.state.current_city,
                name: e.target.value
            }
        });
    }

    handleCityShortNameChange(e) {
        this.setState({
            current_city: {
                ...this.state.current_city,
                short_name: e.target.value
            }
        });
    }
    
    handleCityOrderChange(e) {
        this.setState({
            current_city: {
                ...this.state.current_city,
                ord: e.target.value
            }
        });
    }

    handleCityActiveChange(e) {
        
        this.setState((state) => ({
            ...state,
            current_city: {
                ...state.current_city,
                active: !state.current_city.active
            } 
        }));
    }

    save() {
        const { current_city } = this.state; 
        if (!!!current_city.name || !!!current_city.short_name) {
            this.setState({
                saveClicked: true
            });
        } else {   
            if (current_city.id === null) {
                this.props.addCity(current_city);
                this.setState({
                    saveClicked: true
                });
            }
            else {
                let office = JSON.parse(localStorage.getItem('selected_office'));
                if (!!!current_city.active && office && parseInt(office.city_id) === parseInt(current_city.id)) {
                    this.props.setAllSelections({ id: null }, { id: null }, { id: null }, { id: null });
                }
                this.props.updateCity(current_city);
                this.attributes.saveAttributes();
            }
            
            this.notify();

            this.props.history.push("/cities");
        }
    }

    remove() {
        this.props.removeCity(this.state.current_city.id);
        this.notify();
        this.props.history.push("/cities");
    }

    langChange = (countryCode) => {
        this.props.langChange(countryCode);
    };

    render() {
        const { triggerModal, current_city, redirect, saveClicked } = this.state;
        let submit_text = strings.save;
        if (this.state.current_city.id === null) {
            submit_text = strings.create;
        }

        return (
            <>
                <div className="container-fluid overflow-auto with-actions">
                    <div className="container page-title-wrapper" >
                        {this.state.current_city.id !== null? (
                            <h1 id="page-title">{ strings.editcity }</h1>
                        ) : (
                            <h1 id="page-title">{ strings.addcity}</h1>
                        )}
                        
                    </div>
                    <div className="container neomorph-card mt-2 edit-page">
                        <div className="row neomorph-card-inside" >
                        <Form className="entity-management-form">
                            <FormGroup row>
                                <Label for="fieldName" sm={4}>{ strings.name }*</Label>
                                <Col sm={8}>
                                    <Input type="text"
                                        name="name"
                                        id="fieldName"
                                        value={current_city.name}
                                        onChange={this.handleCityNameChange}
                                        invalid={!!!current_city.name && saveClicked} />
                                        {!!!current_city.name && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="fieldShortName" sm={4}>{ strings.short_name }*</Label>
                                <Col sm={8}>
                                    <Input type="text"
                                        name="short_name"
                                        id="fieldShortName"
                                        value={current_city.short_name}
                                        onChange={this.handleCityShortNameChange}
                                        invalid={!!!current_city.short_name && saveClicked} />
                                        {!!!current_city.short_name && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="fieldOrder" sm={4}>{ strings.order }</Label>
                                <Col sm={8}>
                                    <Input
                                        type="number"
                                        name="order"
                                        id="fieldOrder"
                                        value={current_city.ord}
                                        onChange={this.handleCityOrderChange}
                                        placeholder={`${ strings.orderplaceholder }`} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="fieldOrder" sm={4}>{ strings.isactive }</Label>
                                <Col sm={8}>
                                    <Input type="checkbox"
                                        name="active"
                                        id="fieldActive"
                                        checked={current_city.active }
                                        value={current_city.active}
                                        onChange={this.handleCityActiveChange} />
                                </Col>
                            </FormGroup>
                            {current_city.id !== null ? (
                                <FormGroup row>
                                    <AttributesForm
                                        onRef={ref => (this.attributes = ref)}
                                        langChange={this.langChange}
                                        lang={this.props.lang}
                                        type={meta.META_TYPE_CITY}
                                        maintype={meta.META_MAINTYPE_CITY}
                                        id={ current_city.id }
                                    />
                                </FormGroup>
                            ) : (
                                <></>
                            )}
                        </Form>
                        </div>
                    </div>
                </div>
                <div id="bottom-actions-block">
                    <Link to="/cities">
                        { strings.backtolist }
                    </Link>
                    
                    <Button color="success" onClick={this.save}>
                        {submit_text}
                    </Button>
                    {current_city.id !== null? (
                        <>
                            <Button color="danger" onClick={() => { this.setState({triggerModal: true})}}>
                                {strings.delete}
                            </Button>
                            <ModalWindow 
                                modalIsOpen={triggerModal}
                                header={
                                    <div className="modal-header-1">
                                        <div className="close-modal" >
                                            <img className="close-link" src="/img/pics/cross_black.svg" onClick={() => this.setState({ triggerModal: false})}></img>
                                        </div>
                                        <h2>{strings.header} {current_city.name.length > 20 ? `${current_city.name.substring(0, 19)}...` : current_city.name }?</h2>
                                    </div>
                                }
                                body={
                                    <div className="modal-body-1">
                                        <p>{strings.description}</p>
                                        <div className="modal-buttons">
                                            <Button 
                                                className="button-magenta button_usual btn_small"
                                                onClick={() => { this.remove(); this.setState({ triggerModal: false})}}
                                            >{strings.yes}</Button>
                                            <Button 
                                                className="button_usual button_decline btn_small btn_right"
                                                onClick={() => { this.setState({ triggerModal: false})}}
                                            >{strings.no}</Button>
                                        </div>
                                    </div>
                                }
                            />
                        </>
                    ) : (
                        <></>
                    )}
                    
                </div>
            </>
        );        
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateCity:          city => dispatch(updateCity(city)),
        addCity:             city => dispatch(addCity(city)),
        removeCity:          city_id => dispatch(removeCity(city_id)),
        getCities:           () => dispatch(getCities()),
        setAllSelections:    (city, office, building, floor) => dispatch(setAllSelections(city, office, building, floor)),
    };
}

const mapStateToProps = state => {
    
    return {
        cities:     state.cities,
        user:       state.user,
        selections: state.selections
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(CityForm);