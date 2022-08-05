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
import { Redirect }         from 'react-router-dom';

import { 
    updateBuilding, 
    addBuilding, 
    removeBuilding, 
    getBuildings 
}                           from '../../../actions/BuildingsActions';

import { setAllSelections } from '../../../actions/SelectionsActions';
import { getOffices }       from '../../../actions/OfficesActions';

import AttributesForm from '../../Elements/Attributes/AttributesForm';
import ModalWindow    from '../ModalWindow/ModalWindowComponent';

import LocalizedStrings from 'react-localization';

import * as meta from '../../../constants/MetaTypes';

let strings = new LocalizedStrings({
    en:{
        editbuilding: "Edit Building",
        addbuilding: "Add Building",
        name: "Name",
        short_name: 'Short name',
        office: "Office",
        save:"Save",
        create:"Create",
        order:"Order",
        orderplaceholder:"Enter number",
        isactive:"Is Active",
        backtolist:"Back to list",
        delete:"Delete",
        notselected: "Not selected",
        header: "Delete building with name",
        description: "The object will be deleted permanently.",
        yes: "Yes",
        no: "No",
        changessaved: "Changes Saved!",
        required: "Field is required",
        fieldiscorrect: "Field is correct"
    },
    ru: {
        editbuilding:"Редактировать Корпус",
        addbuilding:"Добавить Корпус",
        name: "Имя",
        short_name: 'Короткое имя',
        office: "Офис",
        save:"Сохранить",
        create:"Создать",
        order:"Порядок",
        orderplaceholder:"Введите число",
        isactive:"Активно",
        backtolist:"Назад к списку",
        delete:"Удалить",
        notselected: "Не выбран",
        header: "Удалить корпус с названием",
        description: "Объект будет удален навсегда.",
        yes: "Да",
        no: "Нет",
        changessaved: "Изменения сохранены!",
        required: "Поле, обязательное для заполнения",
        fieldiscorrect: "Поле заполнено корректно"  
    },
    de: {
        editbuilding:"Gebäude bearbeiten",
        addbuilding:"Gebäude hinzufügen",
        name: "Name",
        short_name: 'Kurzer Name',
        office: "Office",
        save:"Speichern",
        create:"Erstellen",
        order:"Bestellung",
        orderplaceholder:"Nummer eingeben",
        isactive:"Ist aktiv",
        backtolist:"Zurück zur Liste",
        delete:"Löschen",
        notselected: "Nicht ausgewählt",
        header: "Gebäude mit Namen löschen",
        description: "Das Objekt wird dauerhaft gelöscht.",
        yes: "Ja",
        no: "Nein",
        changessaved: "Änderungen gespeichert!",
        required: "Feld ist erforderlich",
        fieldiscorrect: "Das Feld ist korrekt ausgefüllt"  
    }
});


class BuildingForm extends Component {

    notify = () => {
        toast.success(strings.chagessaved, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        let current_building = {
            id: null,
            name: '',
            short_name: '',
            ord: 0,
            office_id: '',
            active: true
        }

        this.state = {
            building: current_building,
            redirect: false,
            triggerModal: false,
            saveClicked:  false
        }
        
        this.handleBuildingNameChange = this.handleBuildingNameChange.bind(this);
        this.handleBuildingShortNameChange = this.handleBuildingShortNameChange.bind(this);
        this.handleBuildingOrderChange = this.handleBuildingOrderChange.bind(this);
        this.handleBuildingActiveChange = this.handleBuildingActiveChange.bind(this);
        this.handleOfficeChange = this.handleOfficeChange.bind(this);

        this.save = this.save.bind(this);
        this.remove = this.remove.bind(this);

    }

    componentDidMount() {
        if (!!this.props.offices)  {
            this.props.getOffices();
        }

        if (!!this.props.buildings)  {
            this.props.getBuildings();
        }
        
    }

    componentDidUpdate(prevProps) {

        if (this.props.buildings != prevProps.buildings) {
            const current_building_key = this.props.buildings.findIndex(c => c.id === parseInt(this.props.match.params.id));
            
            if (current_building_key > -1) {
                let current_building = this.props.buildings[current_building_key];
                
                this.setState({
                    building: current_building,
                    triggerModal: false
                });
            }
        }
        if (this.props.offices != prevProps.offices) {
            this.setState({
                offices: this.props.offices,
                triggerModal: false
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    handleBuildingNameChange(e) {
        this.setState({
            building: {
                ...this.state.building,
                name: e.target.value
            }
        });
    }
    
    handleBuildingShortNameChange(e) {
        this.setState({
            building: {
                ...this.state.building,
                short_name: e.target.value
            }
        });
    }

    handleOfficeChange(e) {
        
        this.setState({
            building: {
                ...this.state.building,
                office_id: e.target.value
            }
        });
    }
    
    handleBuildingOrderChange(e) {
        
        this.setState({
            building: {
                ...this.state.building,
                ord: e.target.value
            }
        });
    }

    handleBuildingActiveChange(e) {
        this.setState((state) => ({
            ...state,
            building: {
                ...state.building,
                active: !state.building.active
            } 
        }));
    }

    save() {
        const { building } = this.state; 
        if (!!!building.name || !!!building.short_name || !!!building.office_id) {
            this.setState({
                saveClicked: true
            });
        } else {  
            if (building.id === null) {
                this.props.addBuilding(building);
                this.setState({
                    redirect: true,
                    saveClicked: true
                });
            }
            else {
                let floor = JSON.parse(localStorage.getItem('selected_floor'));
                if (!!!building.active && floor && parseInt(floor.building_id) === parseInt(building.id)) {
                    this.props.setAllSelections(JSON.parse(localStorage.getItem('selected_city')), JSON.parse(localStorage.getItem('selected_office')), { id: null }, { id: null });
                }
                this.props.updateBuilding(building);
                this.attributes.saveAttributes();
            }

            this.notify();

            this.props.history.push("/buildings");
        }
    }

    remove() {
        this.props.removeBuilding(this.state.building.id);
        this.notify();
        this.setState({
            redirect: true
        });
    }

    langChange = (countryCode) => {
        this.props.langChange(countryCode);
    };

    render() {

        const { building, redirect, triggerModal, saveClicked } = this.state;
        
        let submit_text = strings.save;
        if (building.id === null) {
            submit_text = strings.create;
        }
        if (redirect) {
            return (
                <>
                    <Redirect to="/buildings" />
                </>
            );
        }
        else {
            return (
                <>
                    <div className="container-fluid overflow-auto with-actions">
                        <div className="container page-title-wrapper" >
                            {building.id !== null? (
                                <h1 id="page-title">{ strings.editbuilding }</h1>
                            ) : (
                                <h1 id="page-title">{ strings.addbuilding }</h1>
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
                                            value={building.name}
                                            onChange={this.handleBuildingNameChange}
                                            invalid={!!!building.name && saveClicked} />
                                            {!!!building.name && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="fieldShortName" sm={4}>{ strings.short_name }*</Label>
                                    <Col sm={8}>
                                        <Input type="text"
                                            name="short_name"
                                            id="fieldShortName"
                                            value={building.short_name}
                                            onChange={this.handleBuildingShortNameChange}
                                            invalid={!!!building.short_name && saveClicked} />
                                            {!!!building.short_name && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="office_id" sm={4}>{ strings.office }*</Label>
                                    <Col sm={8}>
                                        <Input
                                            type="select"
                                            name="office_id"
                                            id="office_id"
                                            value={building.office_id}
                                            onChange={this.handleOfficeChange} 
                                            invalid={!!!building.office_id && saveClicked}>
                                            <option value="" key="none">- {strings.notselected} -</option>
                                            {this.props.offices.map(function(data, index) {
                                                return <option key={index + 1} value={data.id}>{ data.name }</option>
                                            })}
                                        </Input>
                                        {!!!building.office_id && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>}
                                    </Col>
                                </FormGroup>                                    
                                <FormGroup row>
                                    <Label for="fieldOrder" sm={4}>{ strings.order }</Label>
                                    <Col sm={8}>
                                        <Input
                                            type="number"
                                            name="order"
                                            id="fieldOrder"
                                            value={building.ord}
                                            onChange={this.handleBuildingOrderChange}
                                            placeholder={`${ strings.orderplaceholder }`}  />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="fieldOrder" sm={4}>{ strings.isactive }</Label>
                                    <Col sm={8}>
                                        <Input type="checkbox"
                                            name="active"
                                            id="fieldActive"
                                            checked={building.active }
                                            value={building.active}
                                            onChange={this.handleBuildingActiveChange} />{' '}
                                    </Col>
                                </FormGroup>
                                {building.id !== null ? (
                                    <FormGroup row>
                                        <AttributesForm
                                            onRef={ref => (this.attributes = ref)}
                                            langChange={this.langChange}
                                            lang={this.props.lang}
                                            type={meta.META_TYPE_BUILDING}
                                            maintype={meta.META_MAINTYPE_BUILDING}
                                            id={ building.id }
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
                        <Link to="/buildings">
                            { strings.backtolist }
                        </Link>
                        
                        <Button color="success" onClick={this.save}>
                            {submit_text}
                        </Button>
                        {building.id !== null? (
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
                                            <h2>{strings.header} {building.name.length > 20 ? `${building.name.substring(0, 19)}...` : building.name}?</h2>
                                        </div>
                                    }
                                    body={
                                        <div className="modal-body-1">
                                            <p>{strings.description}</p>
                                            <div className="modal-buttons">
                                                <Button 
                                                    className="button-magenta button_usual btn_small"
                                                    onClick={() => { this.remove(); this.setState({triggerModal: false})}}
                                                >{strings.yes}</Button>
                                                <Button 
                                                    className="button_usual button_decline btn_small btn_right"
                                                    onClick={() => { this.setState({triggerModal: false})}}
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
            )
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getOffices: () => dispatch(getOffices()),
        getBuildings: () => dispatch(getBuildings()),
        updateBuilding: building => dispatch(updateBuilding(building)),
        addBuilding: building => dispatch(addBuilding(building)),
        removeBuilding: building_id => dispatch(removeBuilding(building_id)),
        setAllSelections:    (city, office, building, floor) => dispatch(setAllSelections(city, office, building, floor)),
    };
}

const mapStateToProps = state => {
    
    return {
        buildings: state.buildings,
        offices:   state.offices,
        user:      state.user
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(BuildingForm);