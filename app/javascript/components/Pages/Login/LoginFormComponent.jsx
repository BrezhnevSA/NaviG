import React, { Component } from 'react';
import { connect } from "react-redux";
import { Button, Form, FormGroup, Input  } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { login } from '../../../actions/LoginActions';
import { toast } from 'react-toastify';

import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en:{
        login_to: "Login to T-Navi",
        login: "Login",
        wronglogin: "Wrong login or password",
        imputlogin: "E-mail/Windows-login",
        inputpass: "Windows password",
        login_bad: "Ошибка авторизации"
    },
    ru: {
        login_to: "Вход в T-Navi",
        login: "Войти",
        wronglogin: "Неправильный логин или пароль",
        imputlogin: "E-mail/Windows-login",
        inputpass: "Пароль EMEA2/Windows",
        login_bad: "Ошибка авторизации"
    },
    de: {
        login_to: "Login bei T-Navi",
        login: "Betreten",
        wronglogin: "Falsche Anmeldung oder falsches Passwort",
        imputlogin: "E-mail/Windows-login",
        inputpass: "Passwort EMEA2/Windows",
        login_bad: "Ошибка авторизации"
    }
});

class LoginForm extends Component {

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.state = {
            login: '',
            password: '',
            token: localStorage.getItem('auth_token'),
            inputs_changed: false,
            show_error: true,
        }

        this.handleLoginChange    = this.handleLoginChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.loginSubmit          = this.loginSubmit.bind(this);

    }

    componentDidUpdate(prevProps) {
        if (!!this.props.user) {
            
            if (this.props.user.auth_token !== this.state.token) {
                this.setState({token: this.props.user.auth_token});
            }
        }

        if (this.props.error && this.props.error.response.status === 401 && !this.state.show_error && !this.state.inputs_changed) {
            this.setState({ show_error: true, inputs_changed: true });
        }

    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());


        if (nextProps.user && !nextProps.user.isFetching && !nextProps.user.loggingIn && this.state.show_error && this.props.error && this.props.error.response.status === 401) {
            this.notify(strings.login_bad);
            this.setState({show_error: false});
        }

    }

    notify = (msg) => {
        toast.error(msg, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    handleLoginChange(e) {
        this.setState({
            login: e.target.value,
            show_error: false,
            inputs_changed: true
        });
    }

    handlePasswordChange(e) {
        this.setState({
            password: e.target.value,
            show_error: false,
            inputs_changed: true
        });
    }

    loginSubmit(e) {
        e.preventDefault();
        this.props.login(this.state.login, this.state.password, this.state.login.indexOf('@') !== -1);
        this.setState({
            show_error: false,
            inputs_changed: false
        });
    }

    render() {
        if (this.props.user != null && this.props.user.auth_token != null && this.props.user.data != null
            && this.props.user.rights != null) {
            return (
                <>
                    <Redirect to="/" />
                </>
            );
        }
        else {
            return (
                <div className="container-fluid  overflow-auto with-actions">
                    {/* <div className="container page-title-wrapper" ></div> */}
                    <div className="container neomorph-card mt-2 page-tabs">
                        <div className="row neomorph-card-inside" >
                            <div className="form-wrapper login-wrapper">
                            <div className="login-header">
                                <div className="login-label"><span>{ strings.login_to}</span></div>
                            </div>
                                <Form className="login-form" onSubmit={this.loginSubmit}>
                                    <FormGroup row>
                                        <Input type="text"
                                            name="login_name"
                                            id="fieldEmail"
                                            value={this.state.login}
                                            onChange={this.handleLoginChange}
                                            placeholder={strings.imputlogin}
                                        />
                                    </FormGroup>
                                    <FormGroup row>
                                        <Input type="password"
                                            name="password"
                                            id="fieldPassword"
                                            value={this.state.password}
                                            onChange={this.handlePasswordChange}
                                            placeholder={strings.inputpass}
                                        />
                                    </FormGroup>
                                    <FormGroup row>
                                        <Button className="button-magenta button_usual login_button" >
                                            { strings.login }
                                        </Button>
                                    </FormGroup>
                                    { this.state.show_error && this.props.error && this.props.error.response.status === 401 ?
                                        <div className="form-error" style={{color: '#990000'}}>{strings.wronglogin}</div>
                                    :
                                        <></>
                                    }
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        login: (email, password, emea2) => dispatch(login(email, password, emea2)),
    };
}

const mapStateToProps = state => {
    
    return {
        user: state.user.user,
        error: state.user.error
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(LoginForm);