import React, { Component } from 'react';
import { connect } from "react-redux";
import { Col, Row, Button, Form, FormGroup, Label, Input, CustomInput } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getMetaTypes, updateMetaType, removeMetaType, addMetaType } from '../../../actions/MetaTypesActions';
import { toast } from 'react-toastify';
import ReactDOM from 'react-dom';

import {METATYPES_LIST} from '../../../constants/MetaTypes';
import ModalWindow    from '../ModalWindow/ModalWindowComponent';

import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en:{
        editmetatype: "Edit Meta Type",
        addmetatype:  "Add Meta Type",
        name:         "Name",
        save:         "Save",
        create:       "Create",
        type:         "Type",
        isactive:     "Is Active",
        backtolist:   "Back to list",
        delete:       "Delete",
        notselected:  "Not selected",
        header: "Delete meta type with name",
        description: "The object will be deleted permanently.",
        yes: "Yes",
        no: "No",
        changessaved: "Changes saved!",
    },
    ru: {
        editmetatype: "Редактировать Meta Type",
        addmetatype:  "Добавить Meta Type",
        name:         "Имя",
        save:         "Сохранить",
        create:       "Создать",
        type:         "Тип",
        isactive:     "Активно",
        backtolist:   "Назад к списку",
        delete:       "Удалить",
        notselected:  "Не выбран",
        header: "Удалить мета тип с названием",
        description: "Объект будет удален навсегда.",
        yes: "Да",
        no: "Нет",
        changessaved: "Изменения сохранены!",
    },
    de: {
        editmetatype: "Metatyp bearbeiten",
        addmetatype:  "Metatyp hinzufügen",
        name:         "Name",
        save:         "Speichern",
        create:       "Erstellen",
        type:         "Type",
        isactive:     "Ist aktiv",
        backtolist:   "Zurück zur Liste",
        delete:       "Löschen",
        notselected:  "Nicht ausgewählt",
        header: "Meta type mit Namen löschen",
        description: "Das Objekt wird dauerhaft gelöscht.",
        yes: "Ja",
        no: "Nein",
        changessaved: "Änderungen gespeichert!",
    }
});

class MetaTypeForm extends Component {

    notify = () => {
        toast.success(strings.changessaved, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        let current_meta_type = {
            id: null,
            name: '',
            metatype: '',
        }

        this.state = {
            meta_type: current_meta_type,
            triggerModal: false
        }
        
        this.handleMetaTypeNameChange = this.handleMetaTypeNameChange.bind(this);
        this.handleMetaTypeTypeChange = this.handleMetaTypeTypeChange.bind(this);
        this.handleMetaTypeActiveChange = this.handleMetaTypeActiveChange.bind(this);

        this.save = this.save.bind(this);
        this.remove = this.remove.bind(this);

    }

    componentDidMount() {
        if (!!this.props.meta_types)  {
            this.props.getMetaTypes();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.meta_types != prevProps.meta_types) {
            
            const current_meta_type_key = this.props.meta_types.findIndex(c => c.id === parseInt(this.props.match.params.id));
            
            if (current_meta_type_key > -1) {
                let current_meta_type = this.props.meta_types[current_meta_type_key];
                
                this.setState({
                    meta_type: current_meta_type,
                    triggerModal: false
                });
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    handleMetaTypeNameChange(e) {
        this.setState({
            meta_type: {
                ...this.state.meta_type,
                name: e.target.value
            }
        });
    }
    
    handleMetaTypeTypeChange(e) {
        this.setState({
            meta_type: {
                ...this.state.meta_type,
                metatype: e.target.value
            }
        });
    }

    handleMetaTypeActiveChange(e) {
        this.setState({
            meta_type: {
                ...this.state.meta_type,
                active: !this.state.meta_type.active
            } 
        });
    }

    save() {
        
        if (this.state.meta_type.id === null) {
            this.props.addMetaType(this.state.meta_type);
        }
        else {
            this.props.updateMetaType(this.state.meta_type);
        }
        this.notify();
        this.props.history.push("/metatypes");
    }

    remove() {
        this.props.removeMetaType(this.state.meta_type.id);
        this.notify();
        this.props.history.push("/metatypes");
    }

    render() {
        const { meta_type, triggerModal } = this.state;
        let submit_text = strings.save;
        if (this.state.meta_type.id === null) {
            submit_text = strings.create;
        }

        return (
            <>
                <div className="container-fluid  overflow-auto with-actions">
                    <div className="container page-title-wrapper" >
                        {meta_type.id !== null? (
                            <h1 id="page-title">{ strings.editmetatype }</h1>
                        ) : (
                            <h1 id="page-title">{ strings.addmetatype }</h1>
                        )}
                        
                    </div>
                    <div className="container neomorph-card mt-2 edit-page">
                        <div className="row neomorph-card-inside" >
                        <Form className="entity-management-form">
                            <FormGroup row>
                                <Label for="fieldName" sm={4}>{ strings.name }</Label>
                                <Col sm={8}>
                                    <Input type="text"
                                        name="name"
                                        id="fieldName"
                                        value={meta_type.name}
                                        onChange={this.handleMetaTypeNameChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="fieldType" sm={4}>{ strings.type }</Label>
                                <Col sm={8}>
                                    <Input
                                        type="select"
                                        name="type"
                                        id="fieldType"
                                        value={meta_type.metatype}
                                        onChange={(e) => { this.handleMetaTypeTypeChange(e);} } >
                                        <option value="" key="none">- {strings.notselected} -</option>
                                        {METATYPES_LIST.map(function(el, index) {
                                            return <option value={el.value} key={el.key}>{el.label}</option>;
                                        })}
                                    </Input>
                                </Col>
                            </FormGroup>
                        </Form>
                        </div>
                    </div>
                </div>
                <div id="bottom-actions-block">
                    <Link to="/metatypes">
                        { strings.backtolist }
                    </Link>
                    
                    <Button color="success" onClick={this.save}>
                        {submit_text}
                    </Button>
                    {meta_type.id !== null? (
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
                                        <h2>{strings.header} {meta_type.name.length > 20 ? `${meta_type.name.substring(0, 19)}...` : meta_type.name }?</h2>
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
        updateMetaType: meta_type => dispatch(updateMetaType(meta_type)),
        addMetaType: meta_type => dispatch(addMetaType(meta_type)),
        removeMetaType: meta_type_id => dispatch(removeMetaType(meta_type_id)),
        getMetaTypes: () => dispatch(getMetaTypes())
    };
}

const mapStateToProps = state => {
    
    return {
        meta_types: state.meta_types,
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(MetaTypeForm);