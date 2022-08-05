import React, { Component } from 'react';
import { connect }          from "react-redux";
import {
    Navbar
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { getUserByToken }  from '../../actions/LoginActions';
import Search from './SearchComponent';
import FloorBreadcrumbs from './FloorBreadcrumbsComponent';
import Help from './HelpComponent';
import UserBlock from './UserBlockComponent';
import LangSelector from './LangSelectorComponent';
import { 
    setShowLocationNames, 
    generateFloorImage, 
    setMarkDSReady, 
    setInventoryMode, 
    setSidebarMarkUpState,
    selectNewElement
 } from '../../actions/FloorActions';
import * as rbac from '../../rbac/rbac';
import * as rights from '../../constants/Rights';

class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            helpOpened: false
        }

        this.langChange = this.langChange.bind(this);

        this.closeHelpModal = this.closeHelpModal.bind(this);
    }

    componentDidMount() {

    }

    langChange = (countryCode) => {
        this.props.langChange(countryCode);
    };

    openHelpModal() {
        document.addEventListener("click", this.handleOutsideClick, false);
        this.setState({
            helpOpened: true
        });
    }

    closeHelpModal() {
        document.removeEventListener("click", this.handleOutsideClick, false);
        this.setState({
            helpOpened: false
        });
    }

    handleOutsideClick = e => {
        if (!this.node.contains(e.target)) {
            if (!this.state.helpOpened) {
                document.addEventListener("click", this.handleOutsideClick, false);
            } else {
                document.removeEventListener("click", this.handleOutsideClick, false);
            }
            this.setState({
                helpOpened: !this.state.helpOpened
            });
        };
    };  

    goToPlan() {
        if ((window.location.pathname.split('/')[1] === 'floors') &&
            (!!window.location.pathname.split('/')[2]) &&
            (window.location.pathname.split('/')[3] != 'edit')) {
            this.props.generateFloorImage(window.location.pathname.split('/')[2]).then(response => {
                let current_floor_id = 0;
                if ((window.location.pathname.split('/')[1] === 'floors') && (!!window.location.pathname.split('/')[2])) {
                    current_floor_id = window.location.pathname.split('/')[2];
                }
                let map_file_image = 'floor_plan_' + current_floor_id + '.svg';
                window.location.href = "/img/plans/" + map_file_image + "?" + Math.random().toString(); 
                return null;
            })
            .catch(error => { throw(error); });;
        }
    }

    render() {
        const { floor, user } = this.props;
        let user_rights = [];

        if (user && user.loggingIn && user.user.rights) {
            user_rights = user.user.rights;
        }

        let current_floor_id = 0;
        if ((window.location.pathname.split('/')[1] === 'floors') && (!!window.location.pathname.split('/')[2])) {
            current_floor_id = window.location.pathname.split('/')[2];
        }

        return (
            <div className="navbar-wrapper">
                <Navbar color="light" light expand="md" className="navbar-top container-fluid">
                    <div id="logoArea">
                        <Link to="/" onClick={() => { this.props.getUserByToken(); }}>
                            {/* <span className="site-name align-top d-inline-block">!"§! ! Navi local</span> */}
                            <img style={{'height': '34px', 'marginTop': '-10px'}} src="/img/pics/logo2.svg"></img>
                        </Link>
                    </div>
                    { user && user.loggingIn ? (
                            <div className="userblock-item search_block">
                                <Search lang={this.props.lang} />
                            </div>
                        ) : (
                            <></>
                        )
                    }
                    <div id="breadcrumbsArea">
                        <FloorBreadcrumbs />
                    </div>
                    <div id="sideMenu">
                            { (window.location.pathname.split('/')[1] === 'floors') && (!!window.location.pathname.split('/')[2]) ?
                                <>
                                    { user_rights.length > 0 ?
                                        <>
                                            { rbac.isSatisfied([rights.VIEW_INVENTORY], user_rights) && window.location.pathname.split('/')[3] != 'edit' ?
                                                <div className="userblock-item" >
                                                    <span 
                                                        className="inventory_mode header-icon flag" 
                                                        onClick={() => {
                                                            this.props.setInventoryMode(!floor.inventory_mode);
                                                            this.props.selectNewElement({data: { type: null, data: { id: -1 } } });
                                                            this.props.setSidebarMarkUpState(false);                                                            
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                            <path className="header-icon flag" style={{fill: `${floor.inventory_mode ? '#5aa0a0' : '#5c636a'}`}} d="M1.56504 3H3.13008V3.75C3.13008 4.575 3.83435 5.25 4.69512 5.25H9.39024C10.251 5.25 10.9553 4.575 10.9553 3.75V3H12.5203V6.75H14.0854V3C14.0854 2.175 13.3811 1.5 12.5203 1.5H9.24939C8.92073 0.63 8.05996 0 7.04268 0C6.02541 0 5.16463 0.63 4.83598 1.5H1.56504C0.704268 1.5 0 2.175 0 3V13.5C0 14.325 0.704268 15 1.56504 15H6.26016V13.5H1.56504V3ZM7.04268 1.5C7.47307 1.5 7.8252 1.8375 7.8252 2.25C7.8252 2.6625 7.47307 3 7.04268 3C6.6123 3 6.26016 2.6625 6.26016 2.25C6.26016 1.8375 6.6123 1.5 7.04268 1.5Z" fill="#383838"/>
                                                            <path className="header-icon flag" style={{fill: `${floor.inventory_mode ? '#5aa0a0' : '#5c636a'}`}} d="M14.7573 8.42893C14.4322 8.12004 13.8931 8.12004 13.5681 8.42893L9.81018 12.0075L8.01844 10.3124C7.69339 10.0035 7.16221 10.0035 6.82924 10.3124C6.50419 10.6213 6.50419 11.1336 6.82924 11.4424L9.24729 13.7327C9.55648 14.0265 10.0559 14.0265 10.3651 13.7327L14.7493 9.559C15.0823 9.25011 15.0823 8.73781 14.7573 8.42893Z" fill="#383838"/>
                                                        </svg>
                                                    </span>
                                                </div>
                                            : <></>}
                                        </>
                                    :<></>}
                                    { user_rights.length > 0 ?
                                        <>
                                        { rbac.isSatisfied([rights.UPDATE_FLOOR], user_rights) ?
                                            <>
                                            <div className="userblock-item">
                                                { window.location.pathname.split('/')[3] != 'edit' ? 
                                                    <>
                                                        <Link to={ '/floors/' + current_floor_id + '/edit' } className="header-icon edit">
                                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M11.4897 1.29595C11.3709 1.28533 11.2506 1.27991 11.129 1.27991H4.85645C2.64731 1.27991 0.856445 3.07077 0.856445 5.27991V11.5525C0.856445 13.7616 2.64731 15.5525 4.85645 15.5525H11.129C13.3381 15.5525 15.129 13.7616 15.129 11.5525V5.27991C15.129 5.05673 15.1107 4.83783 15.0756 4.6246L14.129 5.56948V11.5525C14.129 13.2093 12.7859 14.5525 11.129 14.5525H4.85645C3.19959 14.5525 1.85645 13.2093 1.85645 11.5525V5.27991C1.85645 3.62305 3.19959 2.27991 4.85645 2.27991H10.504L11.4897 1.29595Z" fill="#383838"/>
                                                                    <path d="M14.8957 1.35595C13.9602 0.419799 13.2576 0.559929 13.2576 0.559929L9.33137 4.48617L4.93673 8.88016L4.28149 11.9695L7.37149 11.3143L11.7661 6.92158L15.6924 2.99534C15.6917 2.99534 15.8325 2.29274 14.8957 1.35595ZM7.1879 10.9432L6.13433 11.1702C6.01773 10.9465 5.86667 10.7424 5.68669 10.5656C5.50967 10.3857 5.30568 10.2344 5.08205 10.1173L5.30912 9.0644L5.61403 8.76014C5.61403 8.76014 6.18687 8.77181 6.83433 9.41927C7.48113 10.0654 7.49346 10.6396 7.49346 10.6396L7.1879 10.9432Z" fill="#383838"/>
                                                                </svg>
                                                        </Link>
                                                    </>
                                                    :
                                                    <>
                                                        <Link to={ "/floors/" + current_floor_id } className="header-icon">
                                                            <img 
                                                                className="go_to_floor_edit_btn" 
                                                                src="/img/pics/view_mode.svg"
                                                                style={{ display: 'block' }}
                                                            ></img>
                                                        </Link>
                                                    </>
                                                }
                                            </div>
                                            </>
                                        : <></> }
                                        </>
                                    : <></> }
                                    { user_rights.length > 0 ?
                                        <>
                                            { rbac.isSatisfied([rights.UPDATE_META_VALUE], user_rights) && window.location.pathname.split('/')[3] != 'edit' ?
                                                <div className="userblock-item" >
                                                    <span 
                                                        className="mark_ds_ready header-icon flag" 
                                                        onClick={() => {
                                                            this.props.setMarkDSReady(!floor.mark_ds_ready);
                                                            this.props.selectNewElement({data: { type: null, data: { id: -1 } } });
                                                            this.props.setSidebarMarkUpState(false);                                                            
                                                        }}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path className="header-icon flag" style={{fill: `${floor.mark_ds_ready ? '#5aa0a0' : '#5c636a'}`}} d="M0.699219 1.49836V15.553H2.69049V8.68988C8.28304 7.16468 11.8713 13.3725 15.6992 9.53664V1.49836C9.75338 5.35299 6.62023 -1.92714 0.699219 1.49836Z" fill="#383838"/>
                                                        </svg>
                                                    </span>
                                                </div>
                                            : <></>}
                                        </>
                                    :<></>}
                                    { window.location.pathname.split('/')[3] != 'edit' ? 
                                        <div className="userblock-item">

                                            <a onClick={() => this.goToPlan()}
                                                className="header-icon printer" target="_blank">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12.1278 1.05277C12.1278 0.974198 12.0635 0.909912 11.9849 0.909912H4.4135C4.33493 0.909912 4.27065 0.974198 4.27065 1.05277V3.69563H12.1278V1.05277ZM14.2706 4.83848H2.12779C1.3385 4.83848 0.699219 5.47777 0.699219 6.26706V12.1242C0.699219 12.4403 0.954576 12.6956 1.27065 12.6956H4.27065V15.0528C4.27065 15.1313 4.33493 15.1956 4.4135 15.1956H11.9849C12.0635 15.1956 12.1278 15.1313 12.1278 15.0528V12.6956H15.1278C15.4439 12.6956 15.6992 12.4403 15.6992 12.1242V6.26706C15.6992 5.47777 15.0599 4.83848 14.2706 4.83848ZM10.9135 13.9813H5.48493V9.05277H10.9135V13.9813ZM13.8421 7.55277C13.8421 7.63134 13.7778 7.69563 13.6992 7.69563H12.9849C12.9064 7.69563 12.8421 7.63134 12.8421 7.55277V6.83848C12.8421 6.75991 12.9064 6.69563 12.9849 6.69563H13.6992C13.7778 6.69563 13.8421 6.75991 13.8421 6.83848V7.55277Z" fill="#383838"/>
                                                </svg>
                                            </a>
                                        </div>
                                    : <></> }
                                    
                                </>
                            : <></>}
                        { user && user.loggingIn ? (
                                <div className="userblock-item user_block">
                                    <UserBlock lang={this.props.lang} />
                                </div>
                            ) : (
                                <></>
                            )
                        }
                        <div className="userblock-item text_block">
                            <span className="header-icon">
                                <LangSelector langChange={this.langChange} lang={this.props.lang} />
                            </span>
                        </div>
                        
                            <div className="userblock-item text_block" ref={node => { this.node = node; }}>
                                { user && user.loggingIn ? (
                                        <span className="header-icon">
                                            <button className="header-icon button-faq" onClick={() => this.openHelpModal()} >
                                                FAQ
                                            </button>
                                        </span>
                                    ) : (
                                        <span className="header-icon">
                                            <Link className="header-icon button-faq" to="/faq" >
                                                FAQ
                                            </Link>
                                        </span>
                                    ) 
                                }
                                { user && user.loggingIn ? (
                                        <div id="helpModal" className={`${this.state.helpOpened ? "opened" : "closed"}`}>
                                            <a href="#" className="close-help-modal" onClick={() => { this.closeHelpModal(); }}></a>
                                            <Help closeModal={this.closeHelpModal} langChange={this.langChange} lang={this.state.storedLang} />
                                        </div>
                                    ) : (
                                        <></>
                                    ) 
                                }
                            </div>
                    </div>
                </Navbar>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        floor:  state.floor,
        user:   state.user,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        setShowLocationNames:  (show_location_names) => dispatch(setShowLocationNames(show_location_names)),
        generateFloorImage:    (id) => dispatch(generateFloorImage(id)),
        setMarkDSReady:        (status) => dispatch(setMarkDSReady(status)),
        setInventoryMode:      (status) => dispatch(setInventoryMode(status)),
        setSidebarMarkUpState: (val) => dispatch(setSidebarMarkUpState(val)),
        selectNewElement:      (object) => dispatch(selectNewElement(object)),
        getUserByToken:        () => dispatch(getUserByToken()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Header);