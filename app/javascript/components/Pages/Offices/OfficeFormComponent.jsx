import React, { Component } from 'react';
import { connect } from "react-redux";
import { Col, Row, Button, Form, FormGroup, Label, Input, CustomInput, FormFeedback } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getCities } from '../../../actions/CitiesActions';
import { updateOffice, addOffice, removeOffice, getOffices } from '../../../actions/OfficesActions';
import { setAllSelections } from '../../../actions/SelectionsActions';
import { toast } from 'react-toastify';
import ReactDOM from 'react-dom';
import {Redirect } from 'react-router-dom';

import LocalizedStrings from 'react-localization';

import AttributesForm from '../../Elements/Attributes/AttributesForm';
import ModalWindow    from '../ModalWindow/ModalWindowComponent';

import * as meta from '../../../constants/MetaTypes';

let strings = new LocalizedStrings({
    en:{
        editoffice:"Edit Office",
        addoffice:"Add Office",
        name:"Name",
        short_name: 'Short name',
        save:"Save",
        city: "City",
        create:"Create",
        order:"Order",
        orderplaceholder:"Enter number",
        isactive:"Is Active",
        backtolist:"Back to list",
        delete:"Delete",
        notselected: "Not selected",
        header: "Delete office with name",
        description: "The object will be deleted permanently.",
        yes: "Yes",
        no: "No",
        required: "Field is required",
        fieldiscorrect: "Field is correct",
        changessaved:     "Changes Saved!"
    },
    ru: {
        editoffice:"Редактировать Офис",
        addoffice:"Добавить Офис",
        name:"Имя",
        short_name: 'Короткое имя',
        save:"Сохранить",
        city: "Город",
        create:"Создать",
        order:"Порядок",
        orderplaceholder:"Введите число",
        isactive:"Активно",
        backtolist:"Назад к списку",
        delete:"Удалить",
        notselected: "Не выбран",
        header: "Удалить офис с названием",
        description: "Объект будет удален навсегда.",
        yes: "Да",
        no: "Нет",
        required: "Поле, обязательное для заполнения",
        fieldiscorrect: "Поле заполнено корректно",
        changessaved:     "Изменения сохранены!"  
    },
    de: {
        editoffice:"Büro bearbeiten",
        addoffice:"Büro hinzufügen",
        name:"Name",
        short_name: 'Kurzer Name',
        save:"Speichern",
        city: "Die Stadt",
        create:"Erstellen",
        order:"Bestellung",
        orderplaceholder:"Nummer eingeben",
        isactive:"Ist aktiv",
        backtolist:"Zurück zur Liste",
        delete:"Löschen",
        notselected: "Nicht ausgewählt",
        header: "Büro mit Namen löschen",
        description: "Das Objekt wird dauerhaft gelöscht.",
        yes: "Ja",
        no: "Nein",
        required: "Feld ist erforderlich",
        fieldiscorrect: "Das Feld ist korrekt ausgefüllt",
        changessaved:     "Änderungen gespeichert!"
    }
});

class OfficeForm extends Component {

    notify = () => {
        toast.success(strings.changessaved, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        let current_office = null;

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        current_office = {
            id: null,
            name: '',
            short_name: '',
            ord: 0,
            active: true
        }

        this.state = {
            office: current_office,
            triggerModal: false,
            redirect: false,
            saveClicked: false
        }
        
        this.handleOfficeNameChange = this.handleOfficeNameChange.bind(this);
        this.handleOfficeShortNameChange = this.handleOfficeShortNameChange.bind(this);
        this.handleOfficeOrderChange = this.handleOfficeOrderChange.bind(this);
        this.handleOfficeActiveChange = this.handleOfficeActiveChange.bind(this);
        this.handleOfficeCityChange = this.handleOfficeCityChange.bind(this);

        this.save = this.save.bind(this);
        this.remove = this.remove.bind(this);

    }

    componentDidMount() {
        if (!!this.props.cities)  {
            this.props.getCities();
        }

        if (!!this.props.offices)  {
            this.props.getOffices();
        }
    }

    componentDidUpdate(prevProps) {
        if ((this.props.offices != prevProps.offices) && (this.props.match.params.id !== 'new')) {
            
            const current_office_key = this.props.offices.findIndex(c => c.id === parseInt(this.props.match.params.id));
            
            if (current_office_key > -1) {
                let current_office = this.props.offices[current_office_key];
                this.setState({
                    office: current_office,
                    triggerModal: false
                });
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    handleOfficeNameChange(e) {
        this.setState({
            office: {
                ...this.state.office,
                name: e.target.value
            }
        });
    }
    
    handleOfficeShortNameChange(e) {
        this.setState({
            office: {
                ...this.state.office,
                short_name: e.target.value
            }
        });
    }
    
    handleOfficeOrderChange(e) {
        this.setState({
            office: {
                ...this.state.office,
                ord: e.target.value
            }
        });
    }

    handleOfficeCityChange(e) {
        this.setState({
            office: {
                ...this.state.office,
                city_id: e.target.value
            }
        });
    }

    handleOfficeActiveChange(e) {
        
        this.setState((state) => ({
            ...state,
            office: {
                ...state.office,
                active: !state.office.active
            } 
        }));
    }

    save() {
        if (!!!this.state.office.name || !!!this.state.office.short_name || !!!this.state.office.city_id) {
            this.setState({
                saveClicked: true
            });
        } else {   
            if (this.state.office.id === null) {
                let office = this.state.office;
                delete office.id;
                this.props.addOffice(this.state.office);
            }
            else {
                let building = JSON.parse(localStorage.getItem('selected_building'));
                if (!!!this.state.office.active && building && parseInt(building.office_id) === parseInt(this.state.office.id)) {
                    this.props.setAllSelections(JSON.parse(localStorage.getItem('selected_city')), { id: null }, { id: null }, { id: null });
                }
                this.props.updateOffice(this.state.office);
                this.attributes.saveAttributes();
            }

            this.notify();

            this.props.history.push("/offices");
        }
    }

    remove() {
        this.props.removeOffice(this.state.office.id);
        this.setState({
            redirect: true
        });
    }

    langChange = (countryCode) => {
        this.props.langChange(countryCode);
    };

    render() {

        const { office, triggerModal, redirect, saveClicked } = this.state;

        let submit_text = strings.save;
        if (office.id === null) {
            submit_text = strings.create;
        }

        if (redirect) {
            return (
                <>
                    <Redirect to="/offices" />
                </>
            );
        }
        else {
            return (
                <>
                    <div className="container-fluid  overflow-auto with-actions">
                        <div className="container page-title-wrapper" >
                            {office.id !== null? (
                                <h1 id="page-title">{ strings.editoffice }</h1>
                            ) : (
                                <h1 id="page-title">{ strings.addoffice }</h1>
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
                                            value={office.name}
                                            onChange={this.handleOfficeNameChange}
                                            invalid={!!!office.name && saveClicked} />
                                            {!!!office.name && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="fieldShortName" sm={4}>{ strings.short_name }*</Label>
                                    <Col sm={8}>
                                        <Input type="text"
                                            name="short_name"
                                            id="fieldShortName"
                                            value={office.short_name}
                                            onChange={this.handleOfficeShortNameChange}
                                            invalid={!!!office.short_name && saveClicked} />
                                            {!!!office.short_name && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="city_id" sm={4}>{ strings.city }*</Label>
                                    <Col sm={8}>
                                        <Input
                                            type="select"
                                            name="city_id"
                                            id="city_id"
                                            value={office.city_id}
                                            onChange={this.handleOfficeCityChange}
                                            invalid={!!!office.city_id && saveClicked} >
                                            <option value="" key="none">- {strings.notselected} -</option>
                                            {this.props.cities.map(function(data, index) {
                                                return <option key={index + 1} value={data.id}>{ data.name }</option>
                                            })}
                                        </Input>
                                            {!!!office.city_id && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="fieldOrder" sm={4}>{ strings.order }</Label>
                                    <Col sm={8}>
                                        <Input
                                            type="number"
                                            name="order"
                                            id="fieldOrder"
                                            value={office.ord}
                                            onChange={this.handleOfficeOrderChange}
                                            placeholder={`${ strings.orderplaceholder }`} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="fieldOrder" sm={4}>{ strings.isactive }</Label>
                                    <Col sm={8}>
                                        <Input type="checkbox"
                                            name="active"
                                            id="fieldActive"
                                            checked={ office.active }
                                            value={office.active}
                                            onChange={this.handleOfficeActiveChange} />
                                    </Col>
                                </FormGroup>
                                {office.id !== null ? (
                                    <FormGroup row>
                                        <AttributesForm
                                            onRef={ref => (this.attributes = ref)}
                                            langChange={this.langChange}
                                            lang={this.props.lang}
                                            type={meta.META_TYPE_OFFICE}
                                            maintype={meta.META_MAINTYPE_OFFICE}
                                            id={ office.id }
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
                        <Link to="/offices">
                            { strings.backtolist }
                        </Link>
                        
                        <Button color="success" onClick={this.save}>
                            {submit_text}
                        </Button>
                        {office.id !== null? (
                            <>
                                <Button color="danger" onClick={() => { this.setState({triggerModal: true})}}>
                                    { strings.delete }
                                </Button>
                                <ModalWindow 
                                    modalIsOpen={triggerModal}
                                    header={
                                        <div className="modal-header-1">
                                            <div className="close-modal" >
                                                <img className="close-link" src="/img/pics/cross_black.svg" onClick={() => this.setState({ triggerModal: false})}></img>
                                            </div>
                                            <h2>{strings.header} {office.name.length > 20 ? `${office.name.substring(0, 16)}...` : office.name}?</h2>
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
}

function mapDispatchToProps(dispatch) {
    return {
        updateOffice: office => dispatch(updateOffice(office)),
        addOffice: office => dispatch(addOffice(office)),
        removeOffice: office_id => dispatch(removeOffice(office_id)),
        getCities: () => dispatch(getCities()),
        getOffices: () => dispatch(getOffices()),
        setAllSelections: (city, office, building, floor) => dispatch(setAllSelections(city, office, building, floor)),
    };
}

const mapStateToProps = state => {
    
    return {
        offices: state.offices,
        cities: state.cities,
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(OfficeForm);