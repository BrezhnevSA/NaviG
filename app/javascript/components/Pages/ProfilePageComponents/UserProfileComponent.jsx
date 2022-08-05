import 
    React, 
    { Component }       from 'react';
import { connect }      from "react-redux";
import { Input }       from 'reactstrap';
import { Link }         from 'react-router-dom';
import ReactTooltip     from 'react-tooltip';

import { updateProfile, getProfile }     from '../../../actions/ProfileActions';
import { getCities }      from '../../../actions/CitiesActions';
import { getOffices }     from '../../../actions/OfficesActions';
import { getBuildings }   from '../../../actions/BuildingsActions';
import { getFloors }      from '../../../actions/FloorsActions';

import LocalizedStrings from 'react-localization';

import './UserProfileComponent.css';

import Loading from '../Loading/LoadingComponent';
import AvatarChangePopupComponent from './Components/AvatarChangePopup/AvatarChangePopupComponent';
import {toast} from 'react-toastify';
import ModalConfirmAction from "../ModalConfirmAction/ModalConfirmActionComponent";

let strings = new LocalizedStrings({
    en:{
        edit:"Edit",
        about_me: "About Me",
        men: "Men",
        woman: "Woman",
        projects: "Projects",
        workperiod: "Work Period",
        contacts: "Contacts",
        additionalinfo: "Additional info",
        city: "City",
        office: "Office",
        email: "Email",
        phone: "Phone",
        mobile: "Mobile Phone",
        costcenter: "Costcenter",
        birstday_date: "Birthday date",
        gender: "Gender",
        unit: "Unit",
        education: "Education",
        webex: "Write a message",
        deleteAvatarConfirmHeader: "Do you want to delete photo?",
        deleteAvatarConfirmDescription: "It will be removed forever.",
        deleteAvatarNotification: "Photo successfully deleted!",
        phoneNumberchangesSuccesfulySaved: "Phone number successfully changed!",
        no_work_type:      "Not selected",
        hybrid:            "Hybrid",
        flex:              "Flex",    
        dekret:            "Decree",
        flex_desc:         "You work mainly from the office, you have a fixed workplace, and you can <br />periodically work from home in agreement with the manager. You decide how<br /> to distribute equipment (hardware) between the office and home.",
        hybrid_desc:       "You work mainly from home. For office work, you can book a shared desk in<br /> the area of ​​your project. With the support of the company, you transport<br /> equipment and all personal belongings from the office home. You do not <br />waste time on the road, but if you need to meet with colleagues <br />personally - meeting rooms and a shared desk at your service.",
        no_work_type_desc: "Work type not selected.", 
        dekret_desc:       "Decree",
        webexToolTipMessage: "Webex app willl open" 
    },
    ru: {
        edit:"Редактировать",
        about_me: "Обо Мне",
        men: "Мужчина",
        woman: "Женщина",
        projects: "Проекты",
        workperiod: "Период работы",
        contacts: "Контакты",
        additionalinfo: "Доп. информация",
        city: "Город",
        office: "Офис",
        email: "Электронная почта",
        phone: "Телефон для связи",
        mobile: "Мобильный телефон",
        costcenter: "Название и номер МВЗ",
        birstday_date: "День рождения",
        gender: "Пол",
        unit: "Юнит",
        education: "Образование",
        webex: "Написать сообщение",
        deleteAvatarConfirmHeader: "Удалить фото?",
        deleteAvatarConfirmDescription: "Фотография будет удалена навсегда.",
        deleteAvatarNotification: "Фотография успешно удалена!",
        phoneNumberchangesSuccesfulySaved: "Номер телефона успешно изменен!",
        no_work_type:      "Не выбран",
        hybrid:            "Hybrid",
        flex:              "Flex",      
        dekret:            "Декрет",      
        flex_desc:         "Вы работаете преимущественно из офиса, за вами закреплено рабочее место, <br />при этом вы можете периодически работать из дома по согласованию с <br />руководителем. Как распределить оборудование («железо») между офисом и <br />домом вы решаете сами.",
        hybrid_desc:       "Вы трудитесь преимущественно из дома. Для работы в офисе вы можете <br />забронировать shared desk в зоне вашего проекта. Оборудование и все личные <br />вещи из офиса вы при поддержке компании перевозите домой. Вы не тратите <br />время на дорогу, а если вам нужно встретиться с коллегами лично – <br />переговорные комнаты и shared desk к вашим услугам.",
        no_work_type_desc: "Тип работы не выбран.",
        dekret_desc:       "Декрет",
        webexToolTipMessage: "Будет открыто приложение Webex" 
    },
    de: {
        edit:"Bearbeiten",
        about_me: "über Mich",
        men: "Männer",
        woman: "Frau",
        projects: "Projekte",
        workperiod: "Arbeitszeit",
        contacts: "Kontakte",
        additionalinfo: "Zus. Information",
        city_name: "Stadt",
        office_name: "Büro",
        email: "Email",
        phone: "Telefon",
        mobile: "Handy",
        costcenter: "Costcenter",
        birstday_date: "Geburtstagsdatum",
        gender: "Geschlecht",
        unit: "Einheit",
        education: "Bildung",
        webex: "Eine Nachricht schreiben",
        deleteAvatarConfirmHeader: "Möchten Sie ein Foto löschen?",
        deleteAvatarConfirmDescription: "Es wird für immer entfernt",
        deleteAvatarNotification: "Foto erfolgreich gelöscht!",
        phoneNumberchangesSuccesfulySaved: "Telefonnummer erfolgreich geändert!",
        no_work_type:      "Nicht ausgewählt",
        hybrid:            "Hybrid",
        flex:              "Flex",       
        dekret:            "Dekret",
        flex_desc:         "Sie arbeiten hauptsächlich vom Büro aus, haben einen festen Arbeitsplatz <br />und können in Absprache mit dem Manager regelmäßig von zu Hause aus <br />arbeiten. Sie entscheiden, wie Geräte (Hardware) zwischen Büro und Zuhause<br /> verteilt werden sollen.",
        hybrid_desc:       "Sie arbeiten hauptsächlich von zu Hause aus. Für Büroarbeiten können Sie <br />einen gemeinsamen Schreibtisch im Bereich Ihres Projekts buchen. Mit <br />Unterstützung des Unternehmens transportieren Sie Geräte und alle <br />persönlichen Gegenstände vom Büro zu Hause aus. Sie tun dies nicht <br />Verschwenden Sie Zeit auf der Straße, aber wenn Sie sich persönlich mit <br />Kollegen treffen müssen - Besprechungsräume und ein gemeinsamer <br />Schreibtisch zu Ihren Diensten.",
        no_work_type_desc: "Auftragstyp nicht ausgewählt.", 
        dekret_desc:       "Dekret",
        webexToolTipMessage: "Die Webex-App wird geöffnet" 

    }
});

const VISIBLE_PROJECTS_COUNT = 1;
const DEFAULT_AVATAR_IMG_PATH = '/img/userpics/default.png';

class UserProfile extends Component {

    notify = (message) => {
        toast.success(message, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
        let current_user = JSON.parse(localStorage.getItem('current_user'));
        let saved_user = null;
        if (current_user) {
            saved_user = JSON.parse(localStorage.getItem('current_user')).id;
        }

        let id_from_url = this.props.match.params.id;
        if (id_from_url) {
            saved_user = id_from_url;
        }

        this.state = {
            birstday_date: null,
            id: saved_user,
            isAvatarEditOpen: false,
            isPhoneEditMode: false,
            phoneNumber: "",
            toogleExpandProjects: false,
            triggerAvatarRender: new Date().getMilliseconds(),
            isConfirmDeleteAvatarModalOpen: false,
            updateInProgress: false
        };

        this.handleProfileStaticPhoneChange = this.handleProfileStaticPhoneChange.bind(this);
    }

    componentDidMount() {
        const { cities, offices, buildings, floors } = this.props;
        let auth_token    = localStorage.getItem('auth_token');

        this.props.getProfile(this.state.id).then(response => {
            this.setState({phoneNumber: this.props.profile.phone})
        });
       
        if (!!cities || cities.length === 0 ) { this.props.getCities(); }
        if (!!offices || offices.length === 0 ) { this.props.getOffices(); }
        if (!!buildings || buildings.length === 0 ) { this.props.getBuildings(); }
        if (!!floors || floors.length === 0 ) { this.props.getFloors(); }
    }

    componentDidUpdate(prevProps) {

        let id_from_url = this.props.match.params.id;
        if (id_from_url) {
            if (this.state.id !== id_from_url) {
                this.props.getProfile(id_from_url);
                this.setState({
                    id: id_from_url
                })
            }
        }

        if (!this.props.profile.isFetching && this.props.profile.item && this.state.birstday_date !== this.props.profile.item.birthday) {
            this.setState({birstday_date: this.props.profile.item.birthday})
        }

        if (!this.props.profile.isFetching && this.props.profile.item && this.state.phoneNumber !== this.props.profile.item.phone && !this.state.isPhoneEditMode) {
            this.setState({phoneNumber: this.props.profile.item.phone})
        }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    getWebexMeetingLink = (email) => {
        const url = `webexteams://im?email=${email}`;

        return (<>
                    <a className="user-profile-webex-meeting-link-container" href={url} data-tip data-for='webex'>{strings.webex}</a>
                    <ReactTooltip id='webex'>  
                        <span>{strings.webexToolTipMessage}</span>
                    </ReactTooltip>
                </>
        )
    }

    handleOpenAvatarEdit = () => {
        this.setState({isAvatarEditOpen: !this.state.isAvatarEditOpen});
    };

    triggerUpdateInProgressState = (state) => {
        this.setState({updateInProgress: state})
    }

    handleOpenAvatarDeleteModal = () => {
        this.setState({isConfirmDeleteAvatarModalOpen: true});
    };

    handleProfileStaticPhoneChange(e) {
        this.setState({
            profile: {
                ...this.props.profile,
                item: {
                    ...this.props.profile.item,
                    phone: e.target.value
                }
            },
            phoneNumber: e.target.value

        });
    };

    handleActivatePhoneEdit = () => {
        this.setState({
            isPhoneEditMode: true
        });
    };

    handleCancelPhoneEdit = () => {
        this.setState({
            isPhoneEditMode: false
        });
    };

    handleSavePhoneNumber = () => {
        const {profile} = this.state;
        
        if (profile && profile.item.phone !== this.props.profile.item.phone) {
            this.setState({
                updateInProgress: true,
                isPhoneEditMode: false,
            });
            this.props.updateProfile(profile.item, null).then(response => {
                this.props.getProfile(this.state.id);
                this.notify(strings.phoneNumberchangesSuccesfulySaved);
                this.setState({updateInProgress: false});
            });
        } else {
            this.setState({isPhoneEditMode: false})
        }
    };

    handleToogleExpandProjects = () => {
        this.setState({
            toogleExpandProjects: !this.state.toogleExpandProjects
        });
    };

    handleCloseConfirmDeleteAvatarModal = () => {
        this.setState({isConfirmDeleteAvatarModalOpen: false});
    };

    handleConfirmAvatarDelete = () => {
        this.setState({
            isConfirmDeleteAvatarModalOpen: false,
            updateInProgress: true
        });
        this.props.updateProfile(this.props.profile.item, null, true).then(response => {
            this.notify(strings.deleteAvatarNotification);
            this.props.getProfile(this.state.id);
            this.setState({updateInProgress: false})
        });
    };

    reInit = () => {
        this.props.getProfile(this.state.id);
        this.setState({
            triggerAvatarRender: new Date().getMilliseconds(),
            updateInProgress: false
        });
    };

    renderPhoneSection = () => {
        const {isPhoneEditMode, phoneNumber} = this.state;
        const {profile, user} = this.props;


        if (isPhoneEditMode) {
            return (
                <div className="phone field mt-4 static user-profile-phone-static-phone-field" data-tip data-for='phone'>
                    <Input type="text"
                        name="phone_static"
                        id="fieldPhoneStatic"
                        value={phoneNumber}
                        onChange={this.handleProfileStaticPhoneChange} />
                    <span className="user-profile-phone-edit-container">
                        <img src="/img/pics/phone_number_edit_confirm.svg" 
                                        className="user-profile-pointer profile-icon"  
                                        onClick={this.handleSavePhoneNumber}
                        />
                        <img src="/img/pics/phone_number_edit_cancel.svg" 
                                        className="user-profile-pointer profile-icon"  
                                        onClick={this.handleCancelPhoneEdit}
                        />
                    </span>
                </div>
            );
        }

        return (
            <>
                 <div className="phone field mt-4 static" data-tip data-for='phone'>
                    <img src="/img/pics/phone_number.png" className="profile-icon" /> 
                    {phoneNumber ? phoneNumber : "-"}
                    
                    {( user && user.user && user.user.data && parseInt(user.user.data.id) === parseInt(profile.item.id)) && 
                        <span>
                            <img src="/img/pics/edit-1.svg" 
                                className="user-profile-pointer user-profile-phone-edit-container"  
                                onClick={this.handleActivatePhoneEdit}
                            />
                        </span>
                    }
                </div>
                <ReactTooltip id='phone'>  
                    <span>{strings.phone}</span>
                </ReactTooltip>
            </>
        );
    };

    renderProjectsSection = () => {
        const {profile} = this.props;
        const {toogleExpandProjects} = this.state;

        if (profile.item.projects && profile.item.projects.length > 0) {
            return (<span className="user-profile-projects-list-container">
               {profile.item.projects.slice(0, VISIBLE_PROJECTS_COUNT).map(project => {
                    return (<span className="userdata-wrapper">
                        <Link key={project.id} to={'/employees_in/' + project.id + '?page_type=projects'}>{project.name + " "}</Link>
                    </span>)
                })}
                {toogleExpandProjects && 
                    profile.item.projects.slice(VISIBLE_PROJECTS_COUNT, profile.item.projects.length).map(project => {
                        return (<span className="userdata-wrapper">
                            <Link key={project.id} to={'/employees_in/' + project.id + '?page_type=projects'}>{project.name + " "}</Link>
                        </span>)
                    })
                }
                {profile.item.projects.length > VISIBLE_PROJECTS_COUNT && !toogleExpandProjects &&
                    <span className="user-profile-pointer user-profile-toogle-expand-projects" onClick={this.handleToogleExpandProjects}>
                        <img src="/img/pics/projects_expand_arrow_up.svg" className="user-profile-pointer user-profile-toogle-expand-icon-minimized"/>
                    </span>
                }
                {profile.item.projects.length > VISIBLE_PROJECTS_COUNT && toogleExpandProjects &&
                    <span className="user-profile-pointer user-profile-toogle-expand-projects" onClick={this.handleToogleExpandProjects}>
                        <img src="/img/pics/projects_expand_arrow_up.svg" className="user-profile-pointer user-profile-toogle-expand-icon"/>
                    </span>
                }

            </span>);
        } else {
            return <span className="userdata-wrapper">{"-"}</span>
        }
    };

    render() {
        const { 
            user, 
            id,
            profile 
        } = this.props;

        const {triggerAvatarRender, updateInProgress} = this.state;

        if (!updateInProgress && !profile.isFetching && profile.item && profile.item.name && profile.item.surname && profile.item.email && ( user.error || user.user) ) {
            return (
                <> 
                    <div className="container-fluid profile-page-wrapper overflow-auto with-actions">
                        <div className="user-profile-view-width">
                        <div className="container-fluid neomorph-card mt-2 with_tabs">
                            <div className="row neomorph-card-inside" >
                                <div className="col-auto user-avatar-wrapper">
                                    {(user && user.user && user.user.data && profile.item && parseInt(user.user.data.id) === parseInt(profile.item.id)) && 
                                        <>
                                            <div className="user-profile-avatar-edit-button-container">
                                                <img src={profile.item.img_url === DEFAULT_AVATAR_IMG_PATH ? "/img/pics/add_photo.svg" : "/img/pics/edit_photo.svg"} className="user-profile-pointer profile-icon"  onClick={this.handleOpenAvatarEdit}/>
                                            </div>
                                            { profile.item.img_url !== DEFAULT_AVATAR_IMG_PATH && 
                                                <div className="user-profile-avatar-delete-button-container">
                                                    <img src="/img/pics/delete_photo.svg" className="user-profile-pointer profile-icon"  onClick={this.handleOpenAvatarDeleteModal}/>
                                                </div>
                                            }
                                        </>
                                    }
                                    <div id="avatar" className="avatar-div">
                                        <img
                                            className="img-profile user user-profile-image-container" 
                                            alt="User Avatar" 
                                            src={`${profile.item.img_url}?${triggerAvatarRender}`} 
                                        />
                                        <AvatarChangePopupComponent 
                                            isOpen={this.state.isAvatarEditOpen}
                                            handleClose={this.handleOpenAvatarEdit}
                                            profile={profile}
                                            updateHOC={this.reInit}
                                            triggerUpdateInProgressState={this.triggerUpdateInProgressState}
                                        />
                                        <ModalConfirmAction
                                            isOpen={this.state.isConfirmDeleteAvatarModalOpen}
                                            headerText={strings.deleteAvatarConfirmHeader}
                                            descriptionText={strings.deleteAvatarConfirmDescription}
                                            onClickClose={this.handleCloseConfirmDeleteAvatarModal}
                                            yesButtonClick={this.handleConfirmAvatarDelete}
                                            noButtonClick={this.handleCloseConfirmDeleteAvatarModal}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-8 userdata-wrapper user-profile-title-container">   
                                    <div className="mt-1">
                                        <h1 className="user-profile-title">{profile.item.name} {profile.item.surname}</h1>
                                    </div>
                                
                                    <table className="user-profile-table-container">
                                        <tbody>
                                            <tr>
                                                <td className="user-profile-table-column-title-container">
                                                    <div className="mt-5 user-profile-contacts">{strings.contacts}</div>
                                                </td>
                                                <td className="user-profile-table-column-container-additional-info">
                                                    <div className="email mt-5 user-profile-contacts">{strings.additionalinfo}</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="user-profile-table-column-container">
                                                    <div className="userdata-wrapper"> 
                                                        <div className="field mt-4" >
                                                            {/* <img src="/img/pics/place.svg" className="profile-icon" />
                                                            { profile.item.object_item_id
                                                                ? <a href={`/floors/${profile.item.place['floor_id']}?object_id=${profile.item.object_item_id}&search=true`}>
                                                                    {profile.item.place['name']}
                                                                </a>
                                                                : WORK_TYPE
                                                            }                                                         */}
                                                            <img className="work_type_icon" src="/img/pics/work_type.svg"></img>
                                                            { profile.item && profile.item.work_type == "F"
                                                                ? <span 
                                                                    className="leader-info-row" 
                                                                    data-tip={strings.flex_desc} 
                                                                    data-for="work_type_flex"
                                                                    data-effect="solid"
                                                                >
                                                                    {strings.flex}
                                                                </span>
                                                                : profile.item && profile.item.work_type == "H"
                                                                    ? <span 
                                                                        className="leader-info-row" 
                                                                        data-tip={strings.hybrid_desc}
                                                                        data-for="work_type_hybrid"
                                                                        data-effect="solid"
                                                                    >
                                                                        {strings.hybrid}
                                                                    </span>
                                                                    : profile.item && profile.item.status == "MATERNITY"
                                                                        ? <span 
                                                                            className="leader-info-row" 
                                                                            data-tip 
                                                                            data-for="work_type_dekret"
                                                                            data-effect="solid"
                                                                        >
                                                                            {strings.dekret}
                                                                        </span>
                                                                        : <span 
                                                                            className="leader-info-row" 
                                                                            data-tip 
                                                                            data-for="work_type_no_work_type"
                                                                            data-effect="solid"
                                                                        >
                                                                            {strings.no_work_type}
                                                                        </span>
                                                            }
                                                            <ReactTooltip id="work_type_flex" multiline={true}></ReactTooltip>
                                                            <ReactTooltip id="work_type_hybrid" multiline={true}></ReactTooltip>
                                                            <ReactTooltip id="work_type_no_work_type">{strings.no_work_type_desc}</ReactTooltip>
                                                            <ReactTooltip id="work_type_dekret">{strings.dekret_type_desc}</ReactTooltip>

                                                            <img className="sofa_icon" src="/img/pics/sofa.svg"></img>
                                                            { profile.item && profile.item.object_item_id && profile.item.place
                                                                ? <Link className="leader-info-row" to={`/floors/${profile.item.place['floor_id']}?object_id=${profile.item.place['id']}&search=true`}>{profile.item.place.name}</Link>
                                                                : <span>-</span>
                                                            }
                                                        </div>

                                                        <div className="phone field mt-4 static" data-tip data-for='phone'>
                                                            {this.renderPhoneSection()}
                                                        </div>

                                                        <div className="field mt-4" data-tip data-for='email'>
                                                            <img src="/img/pics/mail.svg" className="profile-icon" /> 
                                                            <a className="mail_icon" id="mail_emp" href={`mailto:${profile.item.email}`}>{profile.item.email}</a>
                                                        </div>
                                                        <ReactTooltip id='email'>  
                                                            <span>{strings.email}</span>
                                                        </ReactTooltip>

                                                        <div className="teams field mt-4">
                                                            <img src="/img/pics/webex.svg" className="profile-icon" /> 
                                                            {this.getWebexMeetingLink(profile.item.email)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="user-profile-table-column-container-additional-info">
                                                    <div className="userdata-wrapper">
                                                        <div className="field mt-4">
                                                            <img src={`/img/pics/project.svg`} className="profile-icon" /> 
                                                                {this.renderProjectsSection()}
                                                        </div>

                                                        <div className="email field mt-4" data-tip data-for='costcenter'>
                                                            <img src="/img/pics/MVZ.svg" className="profile-icon" />
                                                             <Link to={`/employees_in/${profile.item.costcenter_num}?page_type=costcenters`}>
                                                                {profile.item.costcenter_name ? profile.item.costcenter_name + ", " + profile.item.costcenter_num : "-"}
                                                            </Link>
                                                        </div>

                                                        <div className="phone field mt-4">
                                                            <img src="/img/pics/Canvas.svg" className="profile-icon" /> 
                                                            {/*cap until will be known can we get this from T-plan */}
                                                            { "-"}
                                                        </div>

                                                        <div className="phone field mt-4">
                                                            <img src="/img/pics/HUB.svg" className="profile-icon" /> 
                                                            {/*cap until will be known can we get this from T-plan */}
                                                            { "-"}
                                                        </div>
                                                    </div>
                                                </td> 
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </>
            );
        } else if (updateInProgress || profile.isFetching) {
            return (<Loading/>);
        } else {
            return (<></>);
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getProfile:     (id) => dispatch(getProfile(id)),
        updateProfile: (profile, image, delete_image) => dispatch(updateProfile(profile, image, delete_image)),
        getFloors:      () => dispatch(getFloors()),
        getCities:      () => dispatch(getCities()),
        getOffices:     () => dispatch(getOffices()),
        getBuildings:   () => dispatch(getBuildings()),
    };
}

const mapStateToProps = state => {
    return {
        profile:   state.profile,
        user:      state.user,
        cities:    state.cities,
        buildings: state.buildings,
        offices:   state.offices,
        floors:    state.floors,
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(UserProfile);