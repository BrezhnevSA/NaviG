import React, { Component } from 'react';
import { connect } from "react-redux";
import { Col, Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { Link } from 'react-router-dom';
import { updateObjectType, addObjectType, removeObjectType, getObjectTypes } from '../../../actions/ObjectTypesActions';
import { toast } from 'react-toastify';
import ModalWindow    from '../ModalWindow/ModalWindowComponent';

import LocalizedStrings from 'react-localization';

import * as utils from '../../../utils/functions';

import './ObjectTypesForm.css';

let strings = new LocalizedStrings({
    en:{
        editobjecttype:"Edit Object Type",
        addobjecttype:"Add Object Type",
        name:"Name",
        save:"Save",
        create:"Create",
        icon: "Icon",
        isactive:"Is Active",
        isrotatable: "Is Rotatable",
        isresizable: "Is Resizable",
        backtolist:"Back to list",
        delete:"Delete",
        header: "Delete object type with name",
        description: "The object will be deleted permanently.",
        yes: "Yes",
        no: "No",
        changessaved: "Changes saved!",
        required: "Field is required",
        fieldiscorrect: "Field is correct",
        selectfile: "Select file",
        filenotselected: "File not selected",
    },
    ru: {
        editobjecttype:"Редактировать Типы Объектов",
        addobjecttype:"Добавить Типы Объектов",
        name:"Имя",
        save:"Сохранить",
        create:"Создать",
        icon: "Иконка",
        isactive:"Активно",
        isrotatable: "Доступно вращение",
        isresizable: "Доступно масштабирование",
        backtolist:"Назад к списку",
        delete:"Удалить",
        header: "Удалить тип объекта с названием",
        description: "Объект будет удален навсегда.",
        yes: "Да",
        no: "Нет",
        changessaved: "Изменения сохранены!",
        required: "Поле, обязательное для заполнения",
        fieldiscorrect: "Поле заполнено корректно",
        selectfile: "Выбрать файл",
        filenotselected: "Файл не выбран", 
    },
    de: {
        editobjecttype:"Objekttyp bearbeiten",
        addobjecttype:"Objekttyp hinzufügen",
        name:"Name",
        save:"Speichern",
        create:"Erstellen",
        icon: "Icon",
        isactive:"Ist aktiv",
        isrotatable: "Ist drehbar",
        isresizable: "Ist anpassbar",
        backtolist:"Zurück zur Liste",
        delete:"Löschen",
        header: "Objekttyp mit Namen löschen",
        description: "Das Objekt wird dauerhaft gelöscht.",
        yes: "Ja",
        no: "Nein",
        changessaved: "Änderungen gespeichert!",
        required: "Feld ist erforderlich",
        fieldiscorrect: "Das Feld ist korrekt ausgefüllt",
        selectfile: "Datei aussuchen",
        filenotselected: "Datei nicht ausgewählt",
    }
});


class ObjectTypeForm extends Component {

    notify = () => {
        toast.success(strings.changessaved, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        let current_object_type = {
            id: null,
            name: '',
            icon: '',
            active: true,
            new_icon: '',
            token: new Date().getTime(),
            rotatable: false,
            resizable: false
        }

        this.state = {
            current_object_type: current_object_type,
            triggerModal: false,
            saveClicked:  false,
            filename: ""
        }
        
        this.handleObjectTypeNameChange = this.handleObjectTypeNameChange.bind(this);
        this.handleObjectTypeActiveChange = this.handleObjectTypeActiveChange.bind(this);
        this.handleObjectTypeRotatableChange = this.handleObjectTypeRotatableChange.bind(this);
        this.handleObjectTypeResizableChange = this.handleObjectTypeResizableChange.bind(this);
        
        this.changeTypeIcon = this.changeTypeIcon.bind(this);

        this.save = this.save.bind(this);
        this.remove = this.remove.bind(this);

    }

    componentDidMount() {
        if (!!this.props.object_types)  {
            this.props.getObjectTypes();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.object_types != prevProps.object_types) {
            
            const current_object_type_key = this.props.object_types.findIndex(c => c.id === parseInt(this.props.match.params.id));

            if (current_object_type_key > -1) {
                let current_object_type = this.props.object_types[current_object_type_key];
                
                this.setState({
                    current_object_type: current_object_type
                });
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    handleObjectTypeNameChange(e) {
        this.setState({
            current_object_type: {
                ...this.state.current_object_type,
                name: e.target.value
            }
        });
    }

    handleObjectTypeActiveChange(e) {
        
        this.setState((state) => ({
            ...state,
            current_object_type: {
                ...state.current_object_type,
                active: !state.current_object_type.active
            } 
        }));
    }

    handleObjectTypeRotatableChange(e) {
        this.setState((state) => ({
            ...state,
            current_object_type: {
                ...state.current_object_type,
                rotatable: !state.current_object_type.rotatable
            } 
        }));
    }

    handleObjectTypeResizableChange(e) {
        this.setState((state) => ({
            ...state,
            current_object_type: {
                ...state.current_object_type,
                resizable: !state.current_object_type.resizable
            } 
        }));
    }

    triggerInputFile = () => this.fileInput.click()

    changeTypeIcon(e) {

        let selected_file = '';
        this.setState({
            filename: e.target.files[0].name 
        })
        this.getBase64(e.target.files[0], (result) => {
            selected_file = result;
            
            this.setState((state) => ({
                ...state,
                token: new Date().getTime(),
                current_object_type: {
                    ...state.current_object_type,
                    new_icon: selected_file
                }
            }));
        });
    }

    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    save() {
        const { current_object_type } = this.state; 
        if (!!!current_object_type.name || (current_object_type.new_icon === "" && current_object_type.icon === "")) {
            this.setState({
                saveClicked: true
            });
        } else {   
            if (current_object_type.id === null) {
                this.props.addObjectType(current_object_type);
                this.setState({
                    saveClicked: true
                });
            }
            else {
                this.props.updateObjectType(current_object_type);
            }

            this.setState({
                token: new Date().getTime()
            });

            this.notify();

            this.props.history.push("/objecttypes");
        }
    }

    remove() {
        this.props.removeObjectType(this.state.current_object_type.id);
        this.notify();
        this.props.history.push("/objecttypes");
    }

    render() {
        const { current_object_type, triggerModal, saveClicked, filename } = this.state;
        let submit_text = strings.save;
        if (current_object_type.id === null) {
            submit_text = strings.create;
        }
        
        return (
            <>
                <div className="container-fluid  overflow-auto with-actions">
                    <div className="container page-title-wrapper" >
                        {current_object_type.id !== null? (
                            <h1 id="page-title">{ strings.editobjecttype }</h1>
                        ) : (
                            <h1 id="page-title">{ strings.addobjecttype }</h1>
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
                                        value={current_object_type.name}
                                        onChange={this.handleObjectTypeNameChange}
                                        invalid={!!!current_object_type.name && saveClicked} />
                                        {!!!current_object_type.name && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="fieldIcon" sm={4}>{ strings.icon }*</Label>
                                <Col sm={8}>
                                    
                                    {!!current_object_type.new_icon? (
                                        <img
                                            src={current_object_type.new_icon}
                                            alt="Object type icon" width="100" />
                                    ) : (
                                        <></>
                                    )}

                                    {(!!current_object_type.icon && !!!current_object_type.new_icon)? (
                                        <img
                                            src={`/img/editor-icons/objects/${current_object_type.icon}?${utils.getRandomInt(500)}`}
                                            alt="Object type icon" width="100" />
                                    ) : (
                                        <></>
                                    )}
                                   
                                    <Button onClick={this.triggerInputFile}> {strings.selectfile} </Button>                            
                                    <input className="form-control" 
                                        type="file"
                                        ref={fileInput => this.fileInput = fileInput} 
                                        onChange={this.changeTypeIcon} 
                                        style={{ display: 'none' }}
                                        invalid={!!!current_object_type.new_icon && saveClicked}/>
                                    <Label style={{ marginLeft: '5px' }} className={`${(current_object_type.new_icon === "" && current_object_type.icon === "") && saveClicked ? 'no_file_icon' : ''}`}>
                                        { 
                                            filename 
                                                ? filename .length <= 17 
                                                    ? filename
                                                    : filename.substring(0, 16) + "..."
                                                : strings.filenotselected 
                                        }
                                    </Label>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="fieldActive" sm={4}>{ strings.isactive }</Label>
                                <Col sm={8}>
                                    <Input type="checkbox"
                                        name="active"
                                        id="fieldActive"
                                        checked={ current_object_type.active  }
                                        value={current_object_type.active}
                                        onChange={this.handleObjectTypeActiveChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="fieldRotatable" sm={4}>{ strings.isrotatable }</Label>
                                <Col sm={8}>
                                    <Input type="checkbox"
                                        name="rotatable"
                                        id="fieldRotatable"
                                        checked={ current_object_type.rotatable  }
                                        value={current_object_type.rotatable}
                                        onChange={this.handleObjectTypeRotatableChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="fieldResizable" sm={4}>{ strings.isresizable }</Label>
                                <Col sm={8}>
                                    <Input type="checkbox"
                                        name="resizable"
                                        id="fieldResizable"
                                        checked={ current_object_type.resizable  }
                                        value={current_object_type.resizable}
                                        onChange={this.handleObjectTypeResizableChange} />
                                </Col>
                            </FormGroup>
                        </Form>
                        </div>
                    </div>
                </div>
                <div id="bottom-actions-block">
                    <Link to="/objecttypes">
                        { strings.backtolist }
                    </Link>
                    
                    <Button color="success" onClick={this.save}>
                        {submit_text}
                    </Button>
                    {current_object_type.id !== null? (
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
                                        <h2>{strings.header} {current_object_type.name.length > 20 ? `${current_object_type.name.substring(0, 19)}...` : current_object_type.name }?</h2>
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
        getObjectTypes: () => dispatch(getObjectTypes()),
        updateObjectType: object_type => dispatch(updateObjectType(object_type)),
        addObjectType: object_type => dispatch(addObjectType(object_type)),
        removeObjectType: object_type_id => dispatch(removeObjectType(object_type_id))
    };
}

const mapStateToProps = state => {
    
    return {
        object_types: state.object_types,
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(ObjectTypeForm);