import React, { Component } from 'react';
import { connect } from "react-redux";
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getMetaFields, updateMetaField, removeMetaField, addMetaField } from '../../../actions/MetaFieldsActions';
import { getMetaTypes } from '../../../actions/MetaTypesActions';
import { toast } from 'react-toastify';
import ModalWindow    from '../ModalWindow/ModalWindowComponent';

import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en:{
        editfield:"Edit Meta Field",
        addfield:"Add Meta Field",
        name:"Name",
        type: "Type",
        save:"Save",
        create:"Create",
        backtolist:"Back to list",
        delete:"Delete",
        showinmanagement: "Show in management",
        header: "Delete meta field with name",
        description: "The object will be deleted permanently.",
        yes: "Yes",
        no: "No",
        changessaved: "Changes saved!",
    },
    ru: {
        editfield:"Редактировать Поле",
        addfield:"Добавить Поле",
        name:"Имя",
        type: "Тип",
        save:"Сохранить",
        create:"Создать",
        backtolist:"Назад к списку",
        delete:"Удалить",
        showinmanagement: "Показывать в управлении",
        header: "Удалить мета поле с названием",
        description: "Объект будет удален навсегда.",
        yes: "Да",
        no: "Нет",
        changessaved: "Изменения сохранены!",
    },
    de: {
        editfield:"Meta-Feld bearbeiten",
        addfield:"Meta-Feld hinzufügen",
        name:"Name",
        type: "Typ",
        save:"Speichern",
        create:"Erstellen",
        backtolist:"Zurück zur Liste",
        delete:"Löschen",
        showinmanagement: "Im Management anzeigen",
        header: "Meta field mit Namen löschen",
        description: "Das Objekt wird dauerhaft gelöscht.",
        yes: "Ja",
        no: "Nein",
        changessaved: "Änderungen gespeichert!",
    }
});

class MetaFieldForm extends Component {

    notify = () => {
        toast.success(strings.changessaved, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        let current_meta_fields = {
            id: null,
            name: '',
            meta_type_id: 'none'
        }

        this.state = {
            meta_fields: current_meta_fields,
            meta_types: [],
            triggerModal: false
        }

        
        this.handleLocationTypeNameChange = this.handleLocationTypeNameChange.bind(this);
        this.handleLocationTypeColorChange = this.handleLocationTypeColorChange.bind(this);
        this.handleMetaTypeTypeChange = this.handleMetaTypeTypeChange.bind(this);

        this.save = this.save.bind(this);
        this.remove = this.remove.bind(this);

    }

    componentDidMount() {

        if (!!this.props.meta_types)  {
            this.props.getMetaTypes();
        }

        if (!!this.props.meta_fields)  {
            this.props.getMetaFields();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.meta_fields != prevProps.meta_fields) {
            
            const current_meta_fields_key = this.props.meta_fields.findIndex(c => c.id === parseInt(this.props.match.params.id));
            
            if (current_meta_fields_key > -1) {
                let current_meta_fields = this.props.meta_fields[current_meta_fields_key];
                
                this.setState({
                    meta_fields: current_meta_fields,
                    triggerModal: false
                });
            }
        }
        if (this.props.meta_types != prevProps.meta_types) {
            this.setState({
                meta_types: this.props.meta_types,
                triggerModal: false
            });
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
            meta_fields: {
                ...this.state.meta_fields,
                name: e.target.value
            }
        });
    }

    handleMetaTypeTypeChange(e) {
        this.setState({
            meta_fields: {
                ...this.state.meta_fields,
                meta_type_id: e.target.value
            }
        });
    }
    
    handleLocationTypeColorChange(e) {
        
        this.setState({
            meta_fields: {
                ...this.state.meta_fields,
                bg: e.target.value
            }
        });
    }

    save() {
        
        if (this.state.meta_fields.id === null) {
            let meta = this.state.meta_fields;
            delete meta.id
            this.props.addMetaField(meta);
        }
        else {
            this.props.updateMetaField(this.state.meta_fields);
        }
        this.notify();
        this.props.history.push("/metafields");
    }

    remove() {
        this.props.removeMetaField(this.state.meta_fields.id);        
        this.notify();
        this.props.history.push("/metafields");
    }

    render() {
        const { meta_fields, triggerModal, meta_types } = this.state;
        let submit_text = strings.save;
        if (meta_fields.id === null) {
            submit_text = strings.create;
        }

        return (
            <>
                <div className="container-fluid  overflow-auto with-actions">
                    <div className="container page-title-wrapper" >
                        {meta_fields.id !== null? (
                            <h1 id="page-title">{ strings.editfield }</h1>
                        ) : (
                            <h1 id="page-title">{ strings.addfield }</h1>
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
                                        value={meta_fields.name}
                                        onChange={this.handleLocationTypeNameChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="fieldName" sm={4}>{ strings.type }</Label>
                                <Col sm={8}>
                                    <Input
                                        type="select"
                                        name="type"
                                        id="fieldType"
                                        value={meta_fields.meta_type_id}
                                        onChange={this.handleMetaTypeTypeChange} >
                                            <option key={0} value="none"> --- </option>
                                        {meta_types.map(function(data, index) {
                                            return <option key={index + 1} value={data.id}>{ data.name }</option>
                                        })}
                                    </Input>
                                </Col>
                            </FormGroup>
                        </Form>
                        </div>
                    </div>
                </div>
                <div id="bottom-actions-block">
                    <Link to="/metafields">
                        { strings.backtolist }
                    </Link>
                    
                    <Button color="success" onClick={this.save}>
                        {submit_text}
                    </Button>
                    {meta_fields.id !== null? (
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
                                        <h2>{strings.header} {meta_fields.name.length > 20 ? `${meta_fields.name.substring(0, 19)}...` : meta_fields.name }?</h2>
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
        updateMetaField: meta_fields => dispatch(updateMetaField(meta_fields)),
        addMetaField: meta_fields => dispatch(addMetaField(meta_fields)),
        removeMetaField: meta_fields_id => dispatch(removeMetaField(meta_fields_id)),
        getMetaFields: () => dispatch(getMetaFields()),
        getMetaTypes: () => dispatch(getMetaTypes())
    };
}

const mapStateToProps = state => {
    
    return {
        meta_fields: state.meta_fields,
        meta_types: state.meta_types
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(MetaFieldForm);