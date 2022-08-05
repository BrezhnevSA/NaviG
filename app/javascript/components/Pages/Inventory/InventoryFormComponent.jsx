import React, { Component } from 'react';
import { connect } from "react-redux";
import { Col, Button, Form, FormGroup, Label, Input, FormFeedback  } from 'reactstrap';
import { Link } from 'react-router-dom';
import { updateObjectItem } from '../../../actions/ObjectItemsActions';
import { searchDSPlaceById } from '../../../actions/SearchActions';
import AttributesForm from '../../Elements/Attributes/AttributesForm';
import { toast } from 'react-toastify';
import * as status from '../../../constants/ObjectItemsStatus';

import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en:{
        editobjectitem:"EDIT PLACE",
        name:"Name",
        save:"Save",
        create:"Create",
        backtolist:"Back to list",
        changessaved: "Changes saved!",
        required: "Field is required",
        fieldiscorrect: "Field is correct",
        status: "Status"  
    },
    ru: {
        editobjectitem:"РЕДАКТИРОВАТЬ МЕСТО",
        name:"Название места",
        save:"Сохранить",
        create:"Создать",
        backtolist:"Назад к списку",
        changessaved: "Изменения сохранены!",
        required: "Поле, обязательное для заполнения",
        fieldiscorrect: "Поле заполнено корректно",
        status: "Статус"  
    },
    de: {
        editobjectitem:"ORT BEARBEITEN",
        name:"Name",
        save:"Speichern",
        create:"Erstellen",
        backtolist:"Zurück zur Liste",
        changessaved: "Änderungen gespeichert!",
        required: "Feld ist erforderlich",
        fieldiscorrect: "Das Feld ist korrekt ausgefüllt",
        status: "Status"  
    }
});

class InventoryForm extends Component {

    notify = () => {
        toast.success(strings.changessaved, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        let current_object_item = {
            id: null,
            name: '',
            comment: '',
            icon: '',
            active: true,
            object_type_id: '',
            details_page: true,
            token: new Date().getTime(),
            rotatable: false,
            resizable: false,
            status: ''
        }

        this.state = {
            current_object_item: current_object_item,
            triggerModal: false,
            saveClicked:  false
        }
        
        this.handleObjectItemNameChange = this.handleObjectItemNameChange.bind(this);
        this.handleObjectItemCommentChange = this.handleObjectItemCommentChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);

        this.save = this.save.bind(this);

    }

    componentDidMount() {
        this.props.searchDSPlaceById(parseInt(this.props.match.params.id));
    }

    componentDidUpdate(prevProps) {
        if (this.props.search && this.props.search.objectItemById != prevProps.search.objectItemById) {
            if (this.props.search.objectItemById) {
                let current_object_item = this.props.search.objectItemById;
                current_object_item['details_page'] = true;
                this.setState({
                    current_object_item: current_object_item,
                    triggerModal: false
                });
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    handleObjectItemNameChange(e) {
        this.setState({
            current_object_item: {
                ...this.state.current_object_item,
                name: e.target.value
            }
        });
    }

    handleObjectItemCommentChange(e) {
        this.setState({
            current_object_item: {
                ...this.state.current_object_item,
                comment: e.target.value
            }
        });
    }

    handleStatusChange(e) {
        this.setState({ current_object_item: {
            ...this.state.current_object_item,
            status: e.target.value
        }})
    }

    save() {
        const { current_object_item } = this.state; 
        if (!!!current_object_item.name || !!!current_object_item.status) {
            this.setState({
                saveClicked: true
            });
        } else { 
            this.props.updateObjectItem(current_object_item);

            this.setState({
                token: new Date().getTime(),
                saveClicked: true
            });

            if (!!current_object_item['id']) {
                this.attributes.saveAttributes()
            }

            this.notify();

            this.props.history.push("/inventory?filters=true");
        }
    }

    langChange = (countryCode) => {
        this.props.langChange(countryCode);
    };

    render() {
        const { triggerModal, saveClicked, current_object_item } = this.state;
        const path = window.location.pathname.split('/');
        let submit_text = strings.save;        
        if (current_object_item.id === null) {
            submit_text = strings.create;
        }

        return (
            <>
                <div className="container-fluid  overflow-auto with-actions">
                    <div className="container page-title-wrapper" >
                        {current_object_item.id !== null ? (
                            <h1 id="page-title">{ strings.editobjectitem }</h1>
                        ) : <></> }
                        
                    </div>
                    <div className="container neomorph-card mt-2 edit-page">
                        <div className="row neomorph-card-inside" >
                            <Form className="entity-management-form">
                                <FormGroup row className="form-row-40">
                                    <Label for="fieldName" className="inventory-main-field attr-inventory" >{ strings.name }*</Label>
                                    <Col>
                                        <Input type="text"
                                            className="inventory-input"
                                            name="name"
                                            id="fieldNameInv"
                                            value={current_object_item.name}
                                            onChange={this.handleObjectItemNameChange}
                                            invalid={!!!current_object_item.name && saveClicked} 
                                        />
                                            {!!!current_object_item.name && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>}
                                    </Col>
                                </FormGroup>
                                <FormGroup row style={{marginBottom: '-2px'}}>
                                    <Label for="fieldStatus" className="inventory-main-field attr-inventory" >{ strings.status }*</Label>
                                    <Col>
                                        <Input
                                            type="select"
                                            name="status"
                                            id="fieldStatusInv"
                                            className={`select_element ${!!status ? "black_text" : ""} inventory-input`}
                                            value={current_object_item.status}
                                            onChange={this.handleStatusChange}
                                        >
                                            <option value="" key="none">{strings.status}</option>
                                            <option key={status.RESERVED} value={status.RESERVED}>{ status.RESERVED }</option>
                                            <option key={status.SHARING} value={status.SHARING}>{ status.SHARING }</option>
                                        </Input>
                                    </Col>
                                </FormGroup>
                                <FormGroup row style={{marginBottom: '30.5px'}}>
                                    <Label></Label>
                                    <Col style={{marginTop: '-2px'}}>
                                        <label className={`${!!!current_object_item.status && saveClicked ? "required-field-label" : "required_field_hidden"}`}>{strings.required}</label>
                                    </Col>
                                </FormGroup>
                                {!!current_object_item['id'] ? 
                                    <FormGroup row className="attributes_location_items">
                                        <AttributesForm
                                            onRef={ref => (this.attributes = ref)}
                                            langChange={this.langChange}
                                            lang={this.props.lang}
                                            type="ObjectItem"
                                            maintype="object"
                                            id={ current_object_item['id'] }
                                            wideview={true}
                                            hideDSReady={true}
                                            inventoryForm={path.length == 3 && path[1] == 'inventory' && !isNaN(path[2])}
                                            hideTitle={path.length == 3 && path[1] == 'inventory' && !isNaN(path[2])}
                                        />
                                    </FormGroup>
                                : <></> } 
                                <FormGroup row className="form-row-40">
                                    <Button className="button_decline btn_150">
                                        <a href="/inventory?filters=true" className="booking_link_text">
                                            { strings.backtolist }
                                        </a>
                                    </Button>
                                    <Button className="button-magenta booking-button btn_150 btn-save-form" onClick={this.save}>
                                        {submit_text}
                                    </Button>
                                </FormGroup>
                            </Form>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    
    return {
        search: state.search,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        searchDSPlaceById: (id) => dispatch(searchDSPlaceById(id)),
        updateObjectItem: object_item => dispatch(updateObjectItem(object_item)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(InventoryForm);