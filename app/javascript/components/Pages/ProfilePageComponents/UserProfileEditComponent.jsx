import React, { Component } from 'react';
import { connect }          from "react-redux";
import { Redirect }         from 'react-router-dom';
import { 
    Col, 
    Button, 
    Form, 
    FormGroup, 
    Label, 
    Input,
}                           from 'reactstrap';
import { Link }             from 'react-router-dom';
import { toast }            from 'react-toastify';
import AvatarEditor         from 'react-avatar-editor';

import { 
    updateProfile, 
    getProfile 
} from '../../../actions/ProfileActions';

import LocalizedStrings from 'react-localization';

import AttributesForm from '../../Elements/Attributes/AttributesForm';

let strings = new LocalizedStrings({
    en:{
        name:"Name",
        surname:"Lastname",
        grade:"Grade",
        email:"E-mail",
        birthday:"Birthday",
        phonestatic:"Phone Static",
        phonemobile:"Phone Mobile",
        education:"Education",
        upload:"Upload",
        save:"Save",
        aboutme: "About Me",
        selectfile: "Select file",
        filenotselected: "File not selected",
        backtolist:"Back to list",
    },
    ru: {
        name:"Имя",
        surname:"Фамилия",
        grade:"Возраст",
        email:"Электронная почта",
        birthday:"День рождения",
        phonestatic:"Тел. стационарный",
        phonemobile:"Мобильный телефон",
        education:"Образование",
        upload:"Загрузить",
        save:"Сохранить",
        aboutme: "Обо мне",
        selectfile: "Выбрать файл",
        filenotselected: "Файл не выбран",
        backtolist:"Назад к списку",
    },
    de: {
        name:"Name",
        surname:"Nachname",
        grade:"Alter",
        email:"E-Mail",
        birthday:"Geburtstag",
        phonestatic:"Festnetztelefon",
        phonemobile:"Handy",
        education:"Education",
        upload:"Hochladen",
        save:"Speichern",
        aboutme: "Über mich",
        selectfile: "Datei aussuchen",
        filenotselected: "Datei nicht ausgewählt",
        backtolist:"Zurück zur Liste",
    }
});

class UserProfileEdit extends Component {

    notify = () => {
        toast.success("Changes Saved!", {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props)
        let saved_user = JSON.parse(localStorage.getItem('current_user'));

        let profile = {
            name:    "",
            surname: "",
            grade:   "",
            email:   "",
            phone:   "",
            mobile:  "",
            education: ""
        }

        this.state = {
            file:          !this.props.profile.isFetching ? props.profile.item.photo : null,
            birstday_date: new Date(),
            profile:       profile,
            redirect:      false,
            filename:      "",
            id:            saved_user.id,
            scale:         1,
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.handleProfileNameChange        = this.handleProfileNameChange.bind(this);
        this.handleProfileLastnameChange    = this.handleProfileLastnameChange.bind(this);
        this.handleProfileGradeChange       = this.handleProfileGradeChange.bind(this);
        this.handleProfileEmailChange       = this.handleProfileEmailChange.bind(this);
        this.handleProfileBirstdayChange    = this.handleProfileBirstdayChange.bind(this);
        this.handleProfileStaticPhoneChange = this.handleProfileStaticPhoneChange.bind(this);
        this.handleProfileMobilePhoneChange = this.handleProfileMobilePhoneChange.bind(this);
        this.handleProfileEducationChange   = this.handleProfileEducationChange.bind(this);
        this.handleProfileAboutChange       = this.handleProfileAboutChange.bind(this);
        
        this.updateProfile = this.updateProfile.bind(this);
        this.imagestore    = this.imagestore.bind(this);
    }

    componentDidMount() {
        this.props.getProfile(this.state.id);
    }
    
    toDate(dateStr) {
        const [year, month, day] = dateStr.split("-")
        return new Date(year, month - 1, day)
    }

    componentDidUpdate(prevProps) {
        if (!this.props.profile.isFetching && this.props.profile.item !== prevProps.profile.item) {
            this.setState({
                profile: this.props.profile,
                birstday_date: this.toDate(this.props.profile.item.birthday)
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    triggerInputFile = () => this.fileInput.click()

    imagestore = img => {
        this.setState({
            file: img.src
        });
    }

    _handleImageChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        let img = new Image();
        img.src = window.URL.createObjectURL(file);
        img.onload = () => this.imagestore(img);
        reader.readAsDataURL(file);
        this.setState({ 
            filename: file.name
        });
    }

    updateProfile(profile, canvasScaled) {
        this.props.updateProfile(profile.item, canvasScaled);
        this.notify();
    }

    handleProfileNameChange(e) {
        this.setState({
            profile: {
                ...this.state.profile,
                item: {
                    ...this.state.profile.item,
                    name: e.target.value
                }
            }
        });
    }

    handleProfileLastnameChange(e) {
        this.setState({
            profile: {
                ...this.state.profile,
                item: {
                    ...this.state.profile.item,
                    surname: e.target.value
                }
            }
        });
    }

    handleProfileGradeChange(e) {
        this.setState({
            profile: {
                ...this.state.profile,
                item: {
                    ...this.state.profile.item,
                    grade: e.target.value
                }
            }
        });
    }

    handleProfileEmailChange(e) {
        this.setState({
            profile: {
                ...this.state.profile,
                item: {
                    ...this.state.profile.item,
                    email: e.target.value
                }
            }
        });
    }

    handleProfileBirstdayChange(date) {
        this.setState({
            birstday_date: date
        });
    }

    handleProfileStaticPhoneChange(e) {
        this.setState({
            profile: {
                ...this.state.profile,
                item: {
                    ...this.state.profile.item,
                    phone: e.target.value
                }
            }
        });
    }

    handleProfileMobilePhoneChange(e) {
        this.setState({
            profile: {
                ...this.state.profile,
                item: {
                    ...this.state.profile.item,
                    mobile: e.target.value
                }
            }
        });
    }

    handleProfileEducationChange(e) {
        this.setState({
            profile: {
                ...this.state.profile,
                item: {
                    ...this.state.profile.item,
                    education: e.target.value
                }
            }
        });
    }

    handleProfileAboutChange(e) {
        this.setState({
            profile: {
                ...this.state.profile,
                item: {
                    ...this.state.profile.item,
                    info: e.target.value
                }
            }
        });
    }

    onClickSave = () => {
        let canvasScaled;
        let { profile } = this.state;
        if (this.editor) {
            // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
            // drawn on another canvas, or added to the DOM.
            if (this.state.filename) {
                const canvas = this.editor.getImage().toDataURL();
                // If you want the image resized to the canvas size (also a HTMLCanvasElement)
                canvasScaled = this.editor.getImageScaledToCanvas().toDataURL();
                this.setState({ canvas: canvasScaled });  
            }          
        }
        this.updateProfile(profile, canvasScaled);

        this.props.history.push("/profile/" + profile.item['id']);
    }

    handleScale(e) {
        const scale = parseFloat(e.target.value)
        this.setState({ scale })
    }

    setEditorRef = (editor) => this.editor = editor

    render() {
        let { canvas, redirect, profile, id } = this.state;
        let imgPreview;
        if (canvas) {
            imgPreview = <img src={canvas} alt='' className="img_user_preview" />;
        }

        if (redirect) {
            return <Redirect to='/profile'/>;
        }
        if (!profile.isFetching && profile.item && profile.item.id) {
            return (
                <>
                    <div id="scrollable-content" className="container-fluid profile-page-form-wrapper overflow-auto with-actions">
                        <Form>
                        <div className="container neomorph-card mt-2">
                            <div className="row neomorph-card-inside" >
                                <div className="col-6 user-avatar-wrapper">
                                    <FormGroup row>
                                        <Button onClick={this.triggerInputFile}> {strings.selectfile} </Button>                            
                                        <input className="form-control" 
                                            type="file"
                                            ref={fileInput => this.fileInput = fileInput} 
                                            onChange={(e)=>this._handleImageChange(e)} 
                                            style={{ display: 'none' }}/>
                                        <Label style={{ marginLeft: '5px' }}>
                                            { 
                                                this.state.filename 
                                                    ? this.state.filename.length <= 17 
                                                        ? this.state.filename
                                                        : this.state.filename.substring(0, 16) + "..."
                                                    : strings.filenotselected 
                                            }
                                        </Label>
                                    </FormGroup>
                                    {this.state.file ?
                                        <FormGroup row>
                                            <AvatarEditor
                                                ref={this.setEditorRef}
                                                scale={parseFloat(this.state.scale)}
                                                image={this.state.file}
                                                width={200}
                                                height={300}
                                                border={25}
                                                color={[155, 155, 155, 0.6]} // RGBA
                                                rotate={0}
                                            />
                                        </FormGroup>
                                    : <></>
                                    }
                                    {this.state.file ?
                                        <FormGroup row>
                                            <Label for="scale" sm={2}>Zoom:</Label>
                                            <Col sm={6} className="range-col"> 
                                                <input
                                                    id="scale"
                                                    className="range-input"
                                                    name="scale"
                                                    type="range"
                                                    onChange={(e) => {this.handleScale(e);}}
                                                    min={this.state.allowZoomOut ? '0.1' : '1'}
                                                    max="2"
                                                    step="0.01"
                                                    defaultValue="1"
                                                />
                                        </Col> 
                                        </FormGroup>
                                    : <></>
                                }
                                </div>
                                <div className="col-6 user-data-left-wrapper">
                                    <FormGroup row>
                                        <Label for="fieldPhoneStatic" sm={4}>{ strings.phonestatic }</Label>
                                        <Col sm={8}>
                                            <Input type="text"
                                                name="phone_static"
                                                id="fieldPhoneStatic"
                                                value={profile.item.phone}
                                                onChange={this.handleProfileStaticPhoneChange} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="fieldPhoneMobile" sm={4}>{ strings.phonemobile }</Label>
                                        <Col sm={8}>
                                            <Input type="text"
                                                name="phone_mobile"
                                                id="fieldPhoneMobile"
                                                value={profile.item.mobile}
                                                onChange={this.handleProfileMobilePhoneChange} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="fieldEducation" sm={4}>{ strings.education }</Label>
                                        <Col sm={8}>
                                            <Input type="text"
                                                name="education"
                                                id="fieldEducation"
                                                value={profile.item.education}
                                                onChange={this.handleProfileEducationChange} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="userAbout" sm={4}>{ strings.aboutme }</Label>
                                        <Col sm={8}>
                                            <Input type="textarea"
                                                name="about"
                                                id="userAbout"
                                                value={profile.item.info}
                                                onChange={this.handleProfileAboutChange} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <AttributesForm
                                            onRef={ref => (this.attributes = ref)}
                                            langChange={this.langChange}
                                            lang={this.props.lang}
                                            type="Employee"
                                            maintype="employee"
                                            id={profile.item.id}
                                            multi={true}
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                        </div>
                        </Form>
                        
                    </div>
                    <div id="bottom-actions-block">
                        <Link to={`/profile/${id}`}>
                            { strings.backtolist }
                        </Link>

                        <Button color="success" onClick={()=> {this.onClickSave();}}>
                            { strings.save }
                        </Button>
                    </div>
                </>
            );
        } else {
            return (<></>);
        }
    }
}

const mapStateToProps = state => {
    return {
        profile: state.profile
    };
};

function mapDispatchToProps(dispatch) {
    return {
        updateProfile: (profile, image) => dispatch(updateProfile(profile, image)),
        getProfile:    (id) => dispatch(getProfile(id)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(UserProfileEdit);