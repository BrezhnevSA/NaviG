import React, { Component } from 'react';
import { connect }          from 'react-redux';
import { Link } from 'react-router-dom';
import LocalizedStrings from 'react-localization';

import './NoaccessComponent.css';


let strings = new LocalizedStrings({
    en:{
        no_rights: "Not enough rights",
        please_login: "Please login",
        go_to_login: "Go to login"
    },
    ru: {
        no_rights: "Недостаточно прав",
        please_login: "Пожалуйста, войдите в систему",
        go_to_login: "Перейти ко входу в систему"
    },
    de: {
        no_rights: "Nicht genügend Rechte",
        please_login: "Bitte loggen Sie sich ein",
        go_to_login: "Gehe zum Login"
    }
});

class NoAccess extends Component {

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    
    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    render() {
        const { user } = this.props;
        return (
            <div className="container-fluid  overflow-auto with-actions">
                {/* <div className="container page-title-wrapper" >
                    <h1 id="page-title">{ strings.login}</h1>
                </div> */}
                <div className="container neomorph-card mt-2 page-tabs">
                    <div className="row neomorph-card-inside" >
                        <div className="noaccess-container">
                            { user && !user.loggingIn ?
                                (
                                    <div class="noaccess-message">
                                        <div class="noaccess-center-subelement">{strings.please_login}</div>
                                        <div class="noaccess-center-subelement"><Link to="/login">{strings.go_to_login}</Link></div>
                                    </div>
                                ) : (
                                    <div class="noaccess-message">{strings.no_rights}</div>
                                )
                            }
                            <img src="/img/access_denied.png" className="noaccess-center-subelement noaccess"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return { };
}

const mapStateToProps = state => {
    return {
        user: state.user
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(NoAccess);