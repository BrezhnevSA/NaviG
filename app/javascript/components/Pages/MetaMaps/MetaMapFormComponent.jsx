import React, { Component } from 'react';
import { connect } from "react-redux";
import { Col, Row, Button, Form, FormGroup, Label, Input, CustomInput } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getMetaMaps, updateMetaMap, removeMetaMap, addMetaMap } from '../../../actions/MetaMapsActions';
import { getLocationTypes } from '../../../actions/LocationTypesActions';
import { getObjectTypes } from '../../../actions/ObjectTypesActions';
import { getMetaFields } from '../../../actions/MetaFieldsActions';
import ModalWindow    from '../ModalWindow/ModalWindowComponent';

import { toast } from 'react-toastify';
import ReactDOM from 'react-dom';

import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en:{
        editmetamap:"Edit Meta Map",
        addmetamap:"Add Meta Map",
        name:"Name",
        save:"Save",
        create:"Create",
        type:"Type",
        entity_type: 'Entity Type',
        entity_subtype: 'Entity Subtype',
        meta_field: 'Meta Field',
        isactive:"Is Active",
        backtolist:"Back to list",
        delete:"Delete",
        showinmanagement: "Show in management",
        header: "Delete meta map with name",
        description: "The object will be deleted permanently.",
        yes: "Yes",
        no: "No",
        changessaved: "Changes saved!",
    },
    ru: {
        editmetamap:"Редактировать Meta Map",
        addmetamap:"Добавить Meta Map",
        name:"Имя",
        save:"Сохранить",
        create:"Создать",
        type:"Type",
        entity_type: 'Тип Сущности',
        entity_subtype: 'Подтип Сущности',
        meta_field: 'Поле',
        isactive:"Активно",
        backtolist:"Назад к списку",
        delete:"Удалить",
        showinmanagement: "Показывать в управлении",
        header: "Удалить meta map с названием",
        description: "Объект будет удален навсегда.",
        yes: "Да",
        no: "Нет",
        changessaved: "Изменения сохранены!",
    },
    de: {
        editmetamap:"Meta Map bearbeiten",
        addmetamap:"Meta Map hinzufügen",
        name:"Name",
        save:"Speichern",
        create:"Erstellen",
        type:"Type",
        entity_type: 'Entitätstyp',
        entity_subtype: 'Subtyp',
        meta_field: 'Meta-Feld',
        isactive:"Ist aktiv",
        backtolist:"Zurück zur Liste",
        delete:"Löschen",
        showinmanagement: "Im Management anzeigen",
        header: "Meta map mit Namen löschen",
        description: "Das Objekt wird dauerhaft gelöscht.",
        yes: "Ja",
        no: "Nein",
        changessaved: "Änderungen gespeichert!",
    }
});

class MetaMapForm extends Component {

    notify = () => {
        toast.success("Changes Saved!", {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        let current_meta_map = {
            id: null,
            entity_type: 'any',
            entity_subtype_id: 'any',
            meta_field_id: 'any',
            active: true
        }

        this.state = {
            meta_map: current_meta_map,
            entities_types_available: [
                { machine_name: 'Location', name: 'Помещение' },
                { machine_name: 'ObjectItem', name: 'Объект' },
                { machine_name: 'City', name: 'Город' },
                { machine_name: 'Building', name: 'Корпус' },
                { machine_name: 'Office', name: 'Офис' },
                { machine_name: 'Floor', name: 'Этаж' },
                { machine_name: 'Employee', name: 'Сотрудник' },
            ],
            location_types_available: [],
            object_types_available: [],
            meta_fields_available: [],
            triggerModal: false
        }
        
        this.handleMetaEntityTypeChange = this.handleMetaEntityTypeChange.bind(this);
        this.handleMetaEntitySubTypeChange = this.handleMetaEntitySubTypeChange.bind(this);
        this.handleMetaFieldChange = this.handleMetaFieldChange.bind(this);
        this.handleMetaTypeActiveChange = this.handleMetaTypeActiveChange.bind(this);
        this.handleMetaTypeShowInManagementChange = this.handleMetaTypeShowInManagementChange.bind(this);

        this.save = this.save.bind(this);
        this.remove = this.remove.bind(this);

    }

    componentDidMount() {
        if (!!this.props.meta_maps)  {
            this.props.getMetaMaps();
        }

        if (!!this.props.meta_fields)  {
            this.props.getMetaFields();
        }

        if (!!this.props.object_types)  {
            this.props.getObjectTypes();
        }

        if (!!this.props.location_types)  {
            this.props.getLocationTypes();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.meta_maps != prevProps.meta_maps) {
            
            const current_meta_map_key = this.props.meta_maps.findIndex(c => c.id === parseInt(this.props.match.params.id));
            
            if (current_meta_map_key > -1) {
                let current_meta_map = this.props.meta_maps[current_meta_map_key];
                
                this.setState({
                    meta_map: current_meta_map,
                    triggerModal: false
                });
            }
        }
        if (this.props.meta_fields != prevProps.meta_fields) {
            this.setState({
                meta_fields_available: this.props.meta_fields
            });
        }
        if (this.props.location_types != prevProps.location_types) {
            this.setState({
                location_types_available: this.props.location_types
            });
        }
        if (this.props.object_types != prevProps.object_types) {
            this.setState({
                object_types_available: this.props.object_types
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    handleMetaEntityTypeChange(e) {
        this.setState({
            meta_map: {
                ...this.state.meta_map,
                entity_type: e.target.value,
                entity_subtype_id: 'any'
            }
        });
    }
    
    handleMetaEntitySubTypeChange(e) {
        this.setState({
            meta_map: {
                ...this.state.meta_map,
                entity_subtype_id: e.target.value
            }
        });
    }

    handleMetaFieldChange(e) {
        this.setState({
            meta_map: {
                ...this.state.meta_map,
                meta_field_id: e.target.value
            }
        });
    }

    handleMetaTypeActiveChange(e) {
        this.setState({
            meta_map: {
                ...this.state.meta_map,
                active: !this.state.meta_map.active
            } 
        });
    }

    handleMetaTypeShowInManagementChange(e) {
        this.setState({
            meta_map: {
                ...this.state.meta_map,
                show_in_management: !this.state.meta_map.show_in_management
            } 
        });
    }

    save() {
        
        if (this.state.meta_map.id === null) {
            let meta_map = this.state.meta_map;
            delete meta_map.id
            this.props.addMetaMap(this.state.meta_map);
        }
        else {
            this.props.updateMetaMap(this.state.meta_map);
        }
        this.notify();
        this.props.history.push("/metamaps");
    }

    remove() {
        this.props.removeMetaMap(this.state.meta_map.id);
        this.notify();
        this.props.history.push("/metamaps");
    }

    render() {
        const { 
            meta_map,
            triggerModal, 
            entities_types_available, 
            location_types_available, 
            object_types_available,
            meta_fields_available 
        } = this.state;
        let submit_text = strings.save;
        if (meta_map.id === null) {
            submit_text = strings.create;
        }

        return (
            <>
                <div className="container-fluid  overflow-auto with-actions">
                    <div className="container page-title-wrapper" >
                        {meta_map.id !== null? (
                            <h1 id="page-title">{ strings.editmetamap }</h1>
                        ) : (
                            <h1 id="page-title">{ strings.addmetamap }</h1>
                        )}
                        
                    </div>
                    <div className="container neomorph-card mt-2 edit-page">
                        <div className="row neomorph-card-inside" >
                        <Form className="entity-management-form">
                            
                            <FormGroup row>
                                <Label for="fieldName" sm={4}>{ strings.entity_type }</Label>
                                <Col sm={8}>
                                    <Input
                                        type="select"
                                        name="type"
                                        id="fieldType"
                                        value={meta_map.entity_type}
                                        onChange={this.handleMetaEntityTypeChange} >
                                            <option key={0} value="none"> --- </option>
                                        {entities_types_available.map(function(data, index) {
                                            return <option key={index + 1} value={data.machine_name}>{ data.name }</option>
                                        })}
                                    </Input>
                                </Col>
                            </FormGroup>

                            { (meta_map.entity_type === 'Location') ? 
                                <FormGroup row>
                                    <Label for="fieldName" sm={4}>{ strings.entity_subtype }</Label>
                                    <Col sm={8}>
                                        <Input
                                            type="select"
                                            name="type"
                                            id="fieldType"
                                            value={meta_map.entity_subtype_id}
                                            onChange={this.handleMetaEntitySubTypeChange} >
                                                <option key={0} value="any"> --- </option>
                                            {location_types_available.map(function(data, index) {
                                                return <option key={index + 1} value={data.id}>{ data.name }</option>
                                            })}
                                        </Input>
                                    </Col>
                                </FormGroup>
                            : <></> }
                            { (meta_map.entity_type === 'ObjectItem') ? 
                                <FormGroup row>
                                    <Label for="fieldName" sm={4}>{ strings.entity_subtype }</Label>
                                    <Col sm={8}>
                                        <Input
                                            type="select"
                                            name="type"
                                            id="fieldType"
                                            value={meta_map.entity_subtype_id}
                                            onChange={this.handleMetaEntitySubTypeChange} >
                                                <option key={0} value="any"> --- </option>
                                            {object_types_available.map(function(data, index) {
                                                return <option key={index + 1} value={data.id}>{ data.name }</option>
                                            })}
                                        </Input>
                                    </Col>
                                </FormGroup>
                            : <></> }

                            <FormGroup row>
                                <Label for="fieldName" sm={4}>{ strings.meta_field }</Label>
                                <Col sm={8}>
                                    <Input
                                        type="select"
                                        name="type"
                                        id="fieldType"
                                        value={meta_map.meta_field_id}
                                        onChange={this.handleMetaFieldChange} >
                                            <option key={0} value="none"> --- </option>
                                        {meta_fields_available.map(function(data, index) {
                                            return <option key={index + 1} value={data.id}>{ data.name }</option>
                                        })}
                                    </Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="fieldActive" sm={4}>{ strings.isactive }</Label>
                                <Col sm={8}>
                                    <Input type="checkbox"
                                        name="active"
                                        id="fieldActive"
                                        checked={ meta_map.active }
                                        value={meta_map.active}
                                        onChange={this.handleMetaTypeActiveChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="Showfield" sm={4}>{ strings.showinmanagement }</Label>
                                <Col sm={8}>
                                    <Input type="checkbox"
                                        name="active"
                                        id="Showfield"
                                        checked={ meta_map.show_in_management }
                                        value={meta_map.show_in_management}
                                        onChange={this.handleMetaTypeShowInManagementChange} />
                                </Col>
                            </FormGroup>
                        </Form>
                        </div>
                    </div>
                </div>
                <div id="bottom-actions-block">
                    <Link to="/metamaps">
                        { strings.backtolist }
                    </Link>
                    
                    <Button color="success" onClick={this.save}>
                        {submit_text}
                    </Button>
                    {meta_map.id !== null? (
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
                                        <h2>{strings.header}?</h2>
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
        updateMetaMap: meta_map => dispatch(updateMetaMap(meta_map)),
        addMetaMap: meta_map => dispatch(addMetaMap(meta_map)),
        removeMetaMap: meta_map_id => dispatch(removeMetaMap(meta_map_id)),
        getMetaMaps: () => dispatch(getMetaMaps()),

        getObjectTypes: () => dispatch(getObjectTypes()),
        getLocationTypes: () => dispatch(getLocationTypes()),
        getMetaFields: () => dispatch(getMetaFields())
    };
}

const mapStateToProps = state => {
    
    return {
        meta_maps: state.meta_maps,
        meta_fields: state.meta_fields,
        location_types: state.location_types,
        object_types: state.object_types
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(MetaMapForm);