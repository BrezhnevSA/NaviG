import React, { Component } from 'react';
import { connect } from "react-redux";
import { Col, Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { Link } from 'react-router-dom';
import { updateLocations, createLocations } from '../../../actions/LocationsActions';
import { searchLocationById } from '../../../actions/SearchActions';
import { toast } from 'react-toastify';
import AttributesForm from '../../Elements/Attributes/AttributesForm';

import * as meta from '../../../constants/MetaTypes';

import LocalizedStrings from 'react-localization';

import './LocationItemsForm.css';

let strings = new LocalizedStrings({
    en:{
        editlocation:"Edit Location",
        name:"Name",
        description: "Description",
        save:"Save",
        create:"Create",
        icon: "Icon",
        isactive:"Is Active",
        isrotatable: "Is Rotatable",
        isresizable: "Is Resizable",
        backtolist:"Back to list",
        delete:"Delete",
        required: "Field is required",
        fieldiscorrect: "Field is correct"
    },
    ru: {
        editlocation:"Редактировать Помещение",
        name:"Имя",
        description: "Описание",
        save:"Сохранить",
        create:"Создать",
        icon: "Иконка",
        isactive:"Активно",
        isrotatable: "Доступно вращение",
        isresizable: "Доступно масштабирование",
        backtolist:"Назад к списку",
        delete:"Удалить",
        required: "Поле, обязательное для заполнения",
        fieldiscorrect: "Поле заполнено корректно"  
    },
    de: {
        editlocation:"Standort bearbeiten",
        name:"Name",
        description: "Beschreibung",
        save:"Speichern",
        create:"Erstellen",
        icon: "Icon",
        isactive:"Ist aktiv",
        isrotatable: "Ist drehbar",
        isresizable: "Ist anpassbar",
        backtolist:"Zurück zur Liste",
        delete:"Löschen",
        required: "Feld ist erforderlich",
        fieldiscorrect: "Das Feld ist korrekt ausgefüllt"
    }
});


class LocationItemForm extends Component {

    notify = () => {
        toast.success("Changes Saved!", {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        let current_location = {
            id: null,
            name: '',
            description: '',
            is_real: false
        }

        this.state = {
            current_location: current_location,
            saveClicked:  false
        }

        this.handleLocationNameChange = this.handleLocationNameChange.bind(this);
        this.handleOLocationDescrChange = this.handleOLocationDescrChange.bind(this);

        this.save = this.save.bind(this);

    }

    componentDidMount() {
        this.props.searchLocationById(this.props.match.params.id);
    }

    componentDidUpdate(prevProps) {
        if (this.props.search && this.props.search.locationById != prevProps.search.locationById) {
            if (this.props.search.locationById) {
                let current_location = this.props.search.locationById;
                current_location['details_page'] = true;
                this.setState({
                    current_location: current_location
                });
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    handleLocationNameChange(e) {
        this.setState({
            current_location: {
                ...this.state.current_location,
                name: e.target.value
            }
        });
    }

    handleOLocationDescrChange(e) {
        this.setState({
            current_location: {
                ...this.state.current_location,
                description: e.target.value
            }
        });
    }

    save() {
        const { current_location } = this.state; 
        if (!!!current_location.name) {
            this.setState({
                saveClicked: true
            });
        } else {  
            if (current_location.id === null) {
                delete current_location['id'];
                this.props.createLocations(current_location);
                this.setState({
                    saveClicked: true
                });
            }
            else {
                // delete current_location['id'];
                this.props.updateLocations(current_location);
                if (current_location.meta_info && current_location.meta_info.length > 0) {
                    this.attributes.saveAttributes();
                }
            }

            this.notify();

            this.props.history.push("/locations?filters=true");
        }
    }

    langChange = (countryCode) => {
        this.props.langChange(countryCode);
    };

    render() {
        const { current_location, saveClicked } = this.state;

        let submit_text = strings.save;

        return (
            <>
                <div className="container-fluid  overflow-auto with-actions">
                    <div className="container page-title-wrapper" >
                        {current_location.id !== null? (
                            <h1 id="page-title">{ strings.editlocation }</h1>
                        ) : <></> }
                        
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
                                        value={current_location.name}
                                        onChange={this.handleLocationNameChange}
                                        invalid={!!!current_location.name && saveClicked} />
                                        {!!!current_location.name && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="fieldDescr" sm={4}>{ strings.description }</Label>
                                <Col sm={8}>
                                    <Input type="text"
                                        name="description"
                                        id="fieldDescr"
                                        value={current_location.description}
                                        onChange={this.handleOLocationDescrChange} />
                                </Col>
                            </FormGroup>
                        </Form>
                        {!!current_location.id ? 
                            <FormGroup row className="attributes_location_items">
                                <AttributesForm
                                    onRef={ref => (this.attributes = ref)}
                                    langChange={this.langChange}
                                    lang={this.props.lang}
                                    type={meta.META_TYPE_LOCATION}
                                    maintype={meta.META_MAINTYPE_LOCATION}
                                    id={ current_location.id }
                                    wideview={true}
                                />
                            </FormGroup>
                        : <></> }
                        </div>
                    </div>
                </div>
                <div id="bottom-actions-block">
                    <Link to="/locations?filters=true">
                        { strings.backtolist }
                    </Link>
                    
                    <Button color="success" onClick={this.save}>
                        {submit_text}
                    </Button>
                    
                </div>
            </>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        searchLocationById: (id) => dispatch(searchLocationById(id)),
        updateLocations: location => dispatch(updateLocations(location)),
        createLocations: location => dispatch(createLocations(location))
    };
}

const mapStateToProps = state => {
    
    return {
        search: state.search,
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(LocationItemForm);