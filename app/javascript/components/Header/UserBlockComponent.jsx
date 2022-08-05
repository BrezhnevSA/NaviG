import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import { selectNewElement } from '../../actions/FloorActions';
import LocalizedStrings from 'react-localization';
import { Redirect }         from 'react-router-dom';
import { getProfile }  from '../../actions/ProfileActions';
import LoginForm       from '../Pages/Login/LoginFormComponent';

let strings = new LocalizedStrings({
    en:{
        profile: "My Profile",
        imhere:  "I'm here",
        logout:  "Log Out",
        login:   "Log in"
    },
    ru: {
        profile: "Профиль",
        imhere:  "Я здесь",
        logout:  "Выйти",
        login:   "Войти"
    },
    de: {
        profile: "Mein Profil",
        imhere:  "Ich bin da",
        logout:  "Ausloggen",
        login:   "Anmeldung"
    }
});

class UserBlock extends Component {

    constructor(props) {
        super(props);
        
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.state = {
            place_url_redirect: null,
            loginOpened: false
        };

        this.loadNewData = this.loadNewData.bind(this);
    }

    loadNewData(id){
        this.props.getProfile(id);
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidUpdate(prevProps) {
        if (!!this.state.place_url_redirect) {
            this.setState({
                place_url_redirect: null
            });
        }
    }

    gotoIamHere() {
        const { user } = this.props;
        const user_place = user && user.user ? user.user.place : null;
        const current_floor_id = !!this.props.floor ? (!!this.props.floor.floor ? this.props.floor.floor['id'] : -1) : -1;
        const parsed_url = window.location.href.split('/');

        if (user_place['floor_id'] != current_floor_id || (parsed_url.length >= 4 && parsed_url[3] !== 'floors')) {
            if (!!user_place['name']) {
                this.setState({
                    place_url_redirect: '/floors/' + user_place['floor_id'] + "#" + user_place['name']
                });
            }
            else {
                this.setState({
                    place_url_redirect: '/floors/' + user_place['floor_id'] + "?object_id=" + user_place['id']
                });
            }
        }
        else {
            this.props.selectNewElement({ 
                data: {
                    data: this.props.floor.object_items.find(
                        (data) => data.id == user_place['id']
                    ),
                    type: 'object'
                }
            });
        }
    }

    openLoginModal() {
        document.addEventListener("click", this.handleOutsideClick, false);
        this.setState({
            loginOpened: true
        });
    }

    closeLoginModal() {
        document.removeEventListener("click", this.handleOutsideClick, false);
        this.setState({
            loginOpened: false
        });
    }

    handleOutsideClick = e => {
        if (!!this.node) {
            if (!this.node.contains(e.target)) {
                if (!this.state.loginOpened) {
                    document.addEventListener("click", this.handleOutsideClick, false);
                } else {
                    document.removeEventListener("click", this.handleOutsideClick, false);
                }
                this.setState({
                    loginOpened: !this.state.loginOpened
                });
            };
        }
    };  

    render() {
        const { user } = this.props;
        const user_data = !!user && user.user ? user.user.data : null;
        const user_place = !!user && user.user ? user.user.place : null;

        if (!!this.state.place_url_redirect) {
            return <Redirect to={this.state.place_url_redirect} />;
        } else {
            return (
                <>
                { !!user && user.loggingIn ? (
                    <Nav className="ml-auto" navbar>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                <span className="header-icon">
                                    <img src={`/img/pics/${user.user && user.user.data && user.user.data.gender == 'м' ? 'boy_authorised' : 'girl_authorised'}.svg`}></img>
                                </span>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem>
                                    <Link to={`/profile/${user_data.id}`} onClick={() => { this.loadNewData(user_data.id); }}>{strings.profile}</Link>  
                                </DropdownItem>
                                { !!user_place ? 
                                    <DropdownItem>
                                        <a onClick={() => { this.gotoIamHere(); }} >
                                            {strings.imhere}
                                        </a>
                                    </DropdownItem>
                                : <></> }
                                <DropdownItem divider />
                                <DropdownItem>
                                    <Link to={"/logout"}>{strings.logout}</Link>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                ) : (
                    <></>
                )}
                </>
            );
        }
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        floor: state.floor
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getProfile: (id) => dispatch(getProfile(id)),
        selectNewElement: object => dispatch(selectNewElement(object)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(UserBlock);