import React, { Component } from 'react';
import { connect } from "react-redux";
import { Col, Button, Form, FormGroup, Label, Input, FormFeedback  } from 'reactstrap';
import { Link } from 'react-router-dom';
import { updateObjectItem } from '../../../actions/ObjectItemsActions';
import { searchDSPlaceById } from '../../../actions/SearchActions';
import AttributesForm from '../../Elements/Attributes/AttributesForm';
import { toast } from 'react-toastify';

import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en:{
        editobjectitem:"Edit Object Item",
        name:"Name",
        comment:"Comment",
        save:"Save",
        create:"Create",
        isrotatable: "Is Rotatable",
        isresizable: "Is Resizable",
        backtolist:"Back to list",
        delete:"Delete",
        header: "Delete object with name",
        description: "The object will be deleted permanently.",
        yes: "Yes",
        no: "No",
        changessaved: "Changes saved!",
        required: "Field is required",
        fieldiscorrect: "Field is correct"
    },
    ru: {
        editobjectitem:"Редактировать Объект",
        name:"Имя",
        comment:"Комментарий",
        save:"Сохранить",
        create:"Создать",
        isrotatable: "Доступно вращение",
        isresizable: "Доступно масштабирование",
        backtolist:"Назад к списку",
        delete:"Удалить",
        header: "Удалить объект с названием",
        description: "Объект будет удален навсегда.",
        yes: "Да",
        no: "Нет",
        changessaved: "Изменения сохранены!",
        required: "Поле, обязательное для заполнения",
        fieldiscorrect: "Поле заполнено корректно"  
    },
    de: {
        editobjectitem:"Objektelement bearbeitenn",
        name:"Name",
        comment:"Kommentar",
        save:"Speichern",
        create:"Erstellen",
        isrotatable: "Ist drehbar",
        isresizable: "Ist anpassbar",
        backtolist:"Zurück zur Liste",
        delete:"Löschen",
        header: "Objekt mit Namen löschen",
        description: "Das Objekt wird dauerhaft gelöscht.",
        yes: "Ja",
        no: "Nein",
        changessaved: "Änderungen gespeichert!",
        required: "Feld ist erforderlich",
        fieldiscorrect: "Das Feld ist korrekt ausgefüllt"
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
            resizable: false
        }

        this.state = {
            current_object_item: current_object_item,
            triggerModal: false,
            saveClicked:  false
        }
        
        this.handleObjectItemNameChange = this.handleObjectItemNameChange.bind(this);
        this.handleObjectItemCommentChange = this.handleObjectItemCommentChange.bind(this);

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

    save() {
        const { current_object_item } = this.state; 
        if (!!!current_object_item.name) {
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

            this.props.history.push("/objects?filters=true");
        }
    }

    langChange = (countryCode) => {
        this.props.langChange(countryCode);
    };

    render() {
        const { triggerModal, saveClicked, current_object_item } = this.state;
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
                                <FormGroup row>
                                    <Label for="fieldName" sm={4}>{ strings.name }*</Label>
                                    <Col sm={8}>
                                        <Input type="text"
                                            name="name"
                                            id="fieldName"
                                            value={current_object_item.name}
                                            onChange={this.handleObjectItemNameChange}
                                            invalid={!!!current_object_item.name && saveClicked} />
                                            {!!!current_object_item.name && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="fieldComment" sm={4}>{ strings.comment }</Label>
                                    <Col sm={8}>
                                        <Input type="text"
                                            name="comment"
                                            id="fieldComment"
                                            value={current_object_item.comment}
                                            onChange={this.handleObjectItemCommentChange} />
                                    </Col>
                                </FormGroup>
                            </Form>
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
                                    />
                                </FormGroup>
                            : <></> } 
                        </div>
                    </div>
                </div>
                <div id="bottom-actions-block">
                    <Link to="/objects?filters=true">
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

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(ObjectTypeForm);