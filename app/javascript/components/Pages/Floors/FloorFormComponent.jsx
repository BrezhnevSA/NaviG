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

import { 
    updateFloor, 
    removeFloor, 
    addFloor, 
    getFloors 
}                         from '../../../actions/FloorsActions';
import { getBuildings }   from '../../../actions/BuildingsActions';

import LocalizedStrings from 'react-localization';

import AttributesForm from '../../Elements/Attributes/AttributesForm';
import ModalWindow    from '../ModalWindow/ModalWindowComponent';

import * as meta from '../../../constants/MetaTypes';

let strings = new LocalizedStrings({
    en:{
        editfloor:"Edit Floor",
        addfloor:"Add Floor",
        gotoplan: "Go to plan",
        building: "Building",
        name:"Name",
        short_name: 'Short name',
        save:"Save",
        create:"Create",
        order:"Order",
        orderplaceholder:"Enter number",
        isactive:"Is Active",
        backtolist:"Back to list",
        delete:"Delete",
        notselected: "Not selected",
        header: "Delete floor with name",
        description: "The object will be deleted permanently.",
        yes: "Yes",
        no: "No",
        changessaved: "Changes saved!",
        required: "Field is required",
        fieldiscorrect: "Field is correct"
    },
    ru: {
        editfloor:"Редактировать Этаж",
        addfloor:"Добавить Этаж",
        gotoplan: "Перейти к плану",
        building: "Корпус",
        name:"Имя",
        short_name: 'Короткое имя',
        save:"Сохранить",
        create:"Создать",
        order:"Порядок",
        orderplaceholder:"Введите число",
        isactive:"Активно",
        backtolist:"Назад к списку",
        delete:"Удалить",
        notselected: "Не выбран",
        header: "Удалить этаж с названием",
        description: "Объект будет удален навсегда.",
        yes: "Да",
        no: "Нет",
        changessaved: "Изменения сохранены!",
        required: "Поле, обязательное для заполнения",
        fieldiscorrect: "Поле заполнено корректно"  
    },
    de: {
        editfloor:"Etage bearbeiten",
        addfloor:"Etage hinzufügen",
        gotoplan: "Nach Plan gehen",
        building: "Gebäude",
        name:"Name",
        short_name: 'Kurzer Name',
        save:"Speichern",
        create:"Erstellen",
        order:"Bestellung",
        orderplaceholder:"Nummer eingeben",
        isactive:"Ist aktiv",
        backtolist:"Zurück zur Liste",
        delete:"Löschen",
        notselected: "Nicht ausgewählt",
        header: "Stadt mit Namen löschen",
        description: "Das Fußboden wird dauerhaft gelöscht.",
        yes: "Ja",
        no: "Nein",
        changessaved: "Änderungen gespeichert!",
        required: "Feld ist erforderlich",
        fieldiscorrect: "Das Feld ist korrekt ausgefüllt"
    }
});


class FloorForm extends Component {

    notify = () => {
        toast.success(strings.chagessaved, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        let current_floor = {
            id: null,
            name: '',
            short_name: '',
            ord: 0,
            active: true
        }

        this.state = {
            current_floor: current_floor,
            triggerModal: false,
            saveClicked:  false
        }

        
        this.handleFloorNameChange = this.handleFloorNameChange.bind(this);
        this.handleFloorShortNameChange = this.handleFloorShortNameChange.bind(this);
        this.handleFloorOrderChange = this.handleFloorOrderChange.bind(this);
        this.handleFloorActiveChange = this.handleFloorActiveChange.bind(this);
        this.handleBuildingChange = this.handleBuildingChange.bind(this);

        this.save = this.save.bind(this);
        this.remove = this.remove.bind(this);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {
        if (!!this.props.buildings)  {
            this.props.getBuildings();
        }

        if (!!this.props.floors)  {
            this.props.getFloors();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.floors != prevProps.floors) {
            
            const current_floors_key = this.props.floors.findIndex(c => c.id === parseInt(this.props.match.params.id));
            
            if (current_floors_key > -1) {
                let current_floor = this.props.floors[current_floors_key];
                
                this.setState({
                    current_floor: current_floor,
                    triggerModal: false
                });
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    handleFloorNameChange(e) {
        this.setState({
            current_floor: {
                ...this.state.current_floor,
                name: e.target.value
            }
        });
    }

    handleFloorShortNameChange(e) {
        this.setState({
            current_floor: {
                ...this.state.current_floor,
                short_name: e.target.value
            }
        });
    }
    
    handleFloorOrderChange(e) {
        this.setState({
            current_floor: {
                ...this.state.current_floor,
                ord: e.target.value
            }
        });
    }

    handleFloorActiveChange(e) {
        
        this.setState((state) => ({
            ...state,
            current_floor: {
                ...state.current_floor,
                active: !state.current_floor.active
            } 
        }));
    }
    
    handleBuildingChange(e) {
        
        this.setState({
            current_floor: {
                ...this.state.current_floor,
                building_id: e.target.value
            }
        });
    }

    save() {
        const { current_floor } = this.state; 
        if (!!!current_floor.name || !!!current_floor.short_name || !!!current_floor.building_id) {
            this.setState({
                saveClicked: true
            });
        } else {   
            if (this.state.current_floor.id === null) {
                this.props.addFloor(this.state.current_floor);            
                this.setState({
                    saveClicked: true
                });
            }
            else {
                this.props.updateFloor(this.state.current_floor);
                this.attributes.saveAttributes();
            }

            this.notify();

            this.props.history.push("/floors");
        }
    }

    remove() {
        this.props.removeFloor(this.state.current_floor.id);
        this.notify();
        this.props.history.push("/floors");
    }

    langChange = (countryCode) => {
        this.props.langChange(countryCode);
    };

    render() {
        const { current_floor, triggerModal, saveClicked } = this.state;

        let submit_text = strings.save;
        if (current_floor.id === null) {
            submit_text = strings.create;
        }

        return (
            <>
                <div id="scrollable-content" className="container-fluid overflow-auto with-actions correct-padding-on-no-footer-page">
                    <div className="container page-title-wrapper" >
                        {current_floor.id !== null? (
                            <h1 id="page-title">{ strings.editfloor }</h1>
                        ) : (
                            <h1 id="page-title">{ strings.addfloor }</h1>
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
                                        value={current_floor.name}
                                        onChange={this.handleFloorNameChange}
                                        invalid={!!!current_floor.name && saveClicked} />
                                        {!!!current_floor.name && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="fieldShortName" sm={4}>{ strings.short_name }*</Label>
                                <Col sm={8}>
                                    <Input type="text"
                                        name="short_name"
                                        id="fieldShortName"
                                        value={current_floor.short_name}
                                        onChange={this.handleFloorShortNameChange}
                                        invalid={!!!current_floor.short_name && saveClicked} />
                                        {!!!current_floor.short_name && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="building_id" sm={4}>{ strings.building }*</Label>
                                <Col sm={8}>
                                    <Input
                                        type="select"
                                        name="building_id"
                                        id="building_id"
                                        value={current_floor.building_id}
                                        onChange={this.handleBuildingChange}
                                        invalid={!!!current_floor.building_id && saveClicked} >
                                        <option value="" key="none">- {strings.notselected} -</option>
                                        {this.props.buildings.map(function(data, index) {
                                            
                                            return <option key={index + 1} value={data.id}>{ data.name }</option>
                                        })}
                                    </Input>
                                    {!!!current_floor.building_id && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>}
                                </Col>
                            </FormGroup>                            
                            <FormGroup row>
                                <Label for="fieldOrder" sm={4}>{ strings.order }</Label>
                                <Col sm={8}>
                                    <Input
                                        type="number"
                                        name="order"
                                        id="fieldOrder"
                                        value={current_floor.ord}
                                        onChange={this.handleFloorOrderChange}
                                        placeholder={`${ strings.orderplaceholder }`} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="fieldActive" sm={4}>{ strings.isactive }</Label>
                                <Col sm={8}>
                                    <Input type="checkbox"
                                        name="active"
                                        id="fieldActive"
                                        checked={ current_floor.active }
                                        value={current_floor.active}
                                        onChange={this.handleFloorActiveChange} />
                                </Col>
                            </FormGroup>

                            {current_floor.id !== null? (
                                <div className="center">
                                    <Link to={"/floors/" + current_floor.id + "/edit"}>
                                        { strings.gotoplan }
                                    </Link>
                                </div>
                            ) : (
                                <></>
                            )}
                            
                            {current_floor.id !== null ? (
                                <FormGroup row>
                                    <AttributesForm
                                        onRef={ref => (this.attributes = ref)}
                                        langChange={this.langChange}
                                        lang={this.props.lang}
                                        type={meta.META_TYPE_FLOOR}
                                        maintype={meta.META_MAINTYPE_FLOOR}
                                        id={ current_floor.id }
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
                    <Link to="/floors">
                        { strings.backtolist }
                    </Link>
                    
                    <Button color="success" onClick={this.save}>
                        {submit_text}
                    </Button>
                    {current_floor.id !== null? (
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
                                            <h2>{strings.header} {current_floor.name.length > 20 ? `${current_floor.name.substring(0, 19)}...` : current_floor.name}?</h2>
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
        getBuildings:   () => dispatch(getBuildings()),
        updateFloor:    floor => dispatch(updateFloor(floor)),
        getFloors:      () => dispatch(getFloors()),
        addFloor:       floor => dispatch(addFloor(floor)),
        removeFloor:    floor_id => dispatch(removeFloor(floor_id)),
    };
}

const mapStateToProps = state => {
    
    return {
        buildings: state.buildings,
        floors:    state.floors,
        user:      state.user
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(FloorForm);