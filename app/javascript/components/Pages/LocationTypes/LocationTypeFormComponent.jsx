import React, { Component } from 'react';
import { connect } from "react-redux";
import { Col, Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { Link } from 'react-router-dom';
import { updateLocationType, addLocationType, removeLocationType, getLocationTypes } from '../../../actions/LocationTypesActions';
import { toast } from 'react-toastify';
import ModalWindow from '../ModalWindow/ModalWindowComponent';

import LocalizedStrings from 'react-localization';

import './LocationTypeForm.css';

let strings = new LocalizedStrings({
    en:{
        editlocationtype:"Edit Location Type",
        addlocationtype:"Add Location Type",
        name:"Name",
        save:"Save",
        create:"Create",
        bg:"Background",
        isactive:"Is Active",
        backtolist:"Back to list",
        delete:"Delete",
        header: "Delete location type with name",
        description: "The object will be deleted permanently.",
        yes: "Yes",
        no: "No",
        changessaved: "Changes saved!",
        required: "Field is required",
        fieldiscorrect: "Field is correct",
        bgnoselected: "Background not selected"
    },
    ru: {
        editlocationtype:"Редактировать Тип Помещений",
        addlocationtype:"Добавить Тип Помещений",
        name:"Имя",
        save:"Сохранить",
        create:"Создать",
        bg:"Заливка",
        isactive:"Активно",
        backtolist:"Назад к списку",
        delete:"Удалить",
        header: "Удалить тип помещения с названием",
        description: "Объект будет удален навсегда.",
        yes: "Да",
        no: "Нет",
        changessaved: "Изменения сохранены!",
        required: "Поле, обязательное для заполнения",
        fieldiscorrect: "Поле заполнено корректно",
        bgnoselected: "Заливка не выбрана"
    },
    de: {
        editlocationtype:"Standorttyp bearbeiten",
        addlocationtype:"Standorttyp hinzufügen",
        name:"Name",
        save:"Speichern",
        create:"Erstellen",
        bg:"Hintergrund",
        isactive:"Ist aktiv",
        backtolist:"Zurück zur Liste",
        delete:"Löschen",
        header: "Art der Räumlichkeiten mit Namen löschen",
        description: "Das Objekt wird dauerhaft gelöscht.",
        yes: "Ja",
        no: "Nein",
        changessaved: "Änderungen gespeichert!",
        required: "Feld ist erforderlich",
        fieldiscorrect: "Das Feld ist korrekt ausgefüllt",
        bgnoselected: "Hintergrund nicht ausgewählt"
    }
});

class LocationTypeForm extends Component {

    notify = () => {
        toast.success(strings.changessaved, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        const images = this.importAll(require.context('../../../../../public/img/textures/', false, /\.(png|jpe?g|svg)$/));

        let current_location_type = {
            id: null,
            name: '',
            bg: '',
            active: true
        }

        this.state = {
            location_type: current_location_type,
            images: images,
            triggerModal: false,
            filename: ""
        }

        this.handleLocationTypeNameChange = this.handleLocationTypeNameChange.bind(this);
        this.handleLocationTypeColorChange = this.handleLocationTypeColorChange.bind(this);
        this.handleLocationTypeActiveChange = this.handleLocationTypeActiveChange.bind(this);

        this.save = this.save.bind(this);
        this.remove = this.remove.bind(this);

    }

    componentDidMount() {
        
        this.props.getLocationTypes();
    }

    componentDidUpdate(prevProps) {
        if (this.props.location_types != prevProps.location_types) {
            
            const current_location_type_key = this.props.location_types.findIndex(c => c.id === parseInt(this.props.match.params.id));
            
            if (current_location_type_key > -1) {
                let current_location_type = this.props.location_types[current_location_type_key];
                
                this.setState({
                    location_type: current_location_type,
                    triggerModal: false
                });
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }
    
    importAll(r) {
        return r.keys().map(r);
    }

    handleLocationTypeNameChange(e) {
        this.setState({
            location_type: {
                ...this.state.location_type,
                name: e.target.value
            }
        });
    }
    
    handleLocationTypeColorChange(e) {
        
        this.setState({
            location_type: {
                ...this.state.location_type,
                bg: e.target.value
            }
        });
    }

    handleLocationTypeActiveChange(e) {
        
        this.setState((state) => ({
            ...state,
            location_type: {
                ...state.location_type,
                active: !state.location_type.active
            } 
        }));
    }

    save() {
        const { location_type } = this.state; 
        if (!!!location_type.name || location_type.bg === "") {
            this.setState({
                saveClicked: true
            });
        } else {   
            if (location_type.id === null) {
                this.props.addLocationType(location_type);
                this.setState({
                    saveClicked: true
                });
            }
            else {
                this.props.updateLocationType(location_type);
            }

            this.notify();

            this.props.history.push("/locationtypes");
        }
    }

    remove() {
        this.props.removeLocationType(this.state.location_type.id);
        this.notify();
        this.props.history.push("/locationtypes");
    }

    changeBG(data) {
        this.setState({
            location_type: {
                ...this.state.location_type,
                bg: data
            }
        });
    }

    render() {
        const { location_type, triggerModal, images, saveClicked }  =this.state;
        let submit_text = strings.save;
        if (location_type.id === null) {
            submit_text = strings.create;
        }

        let current_bg = location_type.bg;

        return (
            <>
                <div className="container-fluid  overflow-auto with-actions">
                    <div className="container page-title-wrapper" >
                        {location_type.id !== null? (
                            <h1 id="page-title">{ strings.editlocationtype }</h1>
                        ) : (
                            <h1 id="page-title">{ strings.addlocationtype }</h1>
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
                                        value={location_type.name}
                                        onChange={this.handleLocationTypeNameChange}
                                        invalid={!!!location_type.name && saveClicked} />
                                    {!!!location_type.name && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="fieldColor" sm={4}>{ strings.bg }*</Label>
                                <Col sm={8} id="textureSelection">
                                    {images.map((data, index) => {                                        
                                        return <div
                                            onClick={() => this.changeBG(data)}
                                            className={`textureSelect ${current_bg == data ? "active" : location_type.bg === "" && saveClicked ? 'no_bg' : ''}`} >
                                            <img width="50" heigth="50" src={data} />
                                        </div>
                                    })}                                    
                                </Col>
                            </FormGroup>
                            {location_type.bg === "" && saveClicked ?
                                <FormGroup row>
                                    <Col sm={4} id="textSelectionSpace"></Col>
                                    <Col sm={8} id="textSelection" >
                                        <div className='no_bg_text'>
                                            {strings.bgnoselected}
                                        </div>
                                    </Col>
                                </FormGroup>
                            : <></>}                            
                            <FormGroup row>
                                <Label for="fieldActive" sm={4}>{ strings.isactive }</Label>
                                <Col sm={8}>
                                    <Input type="checkbox"
                                        name="active"
                                        id="fieldActive"
                                        checked={ location_type.active }
                                        value={location_type.active}
                                        onChange={this.handleLocationTypeActiveChange} />
                                </Col>
                            </FormGroup>
                        </Form>
                        </div>
                    </div>
                </div>
                <div id="bottom-actions-block">
                    <Link to="/locationtypes">
                        { strings.backtolist }
                    </Link>
                    
                    <Button color="success" onClick={this.save}>
                        {submit_text}
                    </Button>
                    {location_type.id !== null? (
                        <>
                            <Button color="danger" onClick={() => { this.setState({triggerModal: true})}}>
                                { strings.delete }
                            </Button>
                            <ModalWindow 
                                modalIsOpen={triggerModal}
                                closeModal={this.closeModal}
                                header={
                                    <div className="modal-header-1">
                                        <div className="close-modal" >
                                            <img className="close-link" src="/img/pics/cross_black.svg" onClick={() => this.setState({ triggerModal: false})}></img>
                                        </div>
                                        <h2>
                                            {strings.header} {location_type.name.length > 20 ? `${location_type.name.substring(0, 19)}...` : location_type.name }?
                                        </h2>
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
        updateLocationType: location_types => dispatch(updateLocationType(location_types)),
        addLocationType: location_types => dispatch(addLocationType(location_types)),
        removeLocationType: location_types_id => dispatch(removeLocationType(location_types_id)),
        getLocationTypes: () => dispatch(getLocationTypes())
    };
}

const mapStateToProps = state => {
    
    return {
        location_types: state.location_types,
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(LocationTypeForm);