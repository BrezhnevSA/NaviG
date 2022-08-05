import React, { Component } from 'react';
import { connect } from "react-redux";
import { Button, Form, FormGroup, Label, Input  } from 'reactstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LocalizedStrings from 'react-localization';
import { sendReport } from '../../actions/ReportsActions';
import './HelpComponent.css';
import ReactTooltip from 'react-tooltip';

let strings = new LocalizedStrings({
    en:{
        profile:  "My Profile",
        goto:  "go to ",
        faq: "FAQ",
        pap: "Privacy and Policy",
        sayabout: "Report a problem",
        send: "Send",
        inputmessage: "Enter a comment",
        inputtext: "Fill the form",
        pleaselogin: "You must be logged in to send a message",
        messagesent: "Message sent"
    },
    ru: {
        profile: "Профиль",
        goto:  "перейти в ",
        faq: "FAQ",
        pap: "Политика конфиденциальности",
        sayabout: "Сообщить о проблеме",
        send: "Отправить",
        inputmessage: "Введите комментарий",
        inputtext: "Заполните форму",
        pleaselogin: "Необходимо залогиниться, чтобы отправить сообщение",
        messagesent: "Сообщение отправлено"
    },
    de: {
        profile: "Mein Profil",
        goto:  "gehe zu ",
        faq: "FAQ",
        pap: "Datenschutz und Richtlinien",
        sayabout: "Problem melden",
        send: "Senden",
        inputmessage: "Kommentar eingeben",
        inputtext: "Fülle das Formular aus",
        pleaselogin: "Sie müssen angemeldet sein, um eine Nachricht senden zu können",
        messagesent: "Nachricht gesendet"
    }
});

const modalContentStyles = {
    content : {
      transform             : 'translate(-50%, -50%)',
      minWidth              : "80%",
      minHeight             : "80vh",
    }
};

class Help extends Component {

    notify = (text) => {
        toast.success(text, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            message: ""
        };
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());  
        
        
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.helpSubmit          = this.helpSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    handleMessageChange(e) {
        this.setState({
            message: e.target.value,
            show_error: false,
            inputs_changed: true
        });
    }

    helpSubmit(e) {
        e.preventDefault();
        this.notify(strings.messagesent);
        this.props.sendReport(this.state.message);
        this.setState({
            show_error: false,
            inputs_changed: false,
            message: ""
        });
        this.props.closeModal();
    }

    render() {
        const { user } = this.props;
        return (
            <div className="form-wrapper">
                <div className="help-header">
                    <Link className="help-link" to='/faq' onClick={() => { this.props.closeModal(); }}><span >{ strings.goto }</span><span style={{fontWeight: '600'}}>{ strings.faq }</span></Link>
                    <a className="help-link" href="/Data_privacy_information_en_T-Navi_Mobile.pdf" onClick={() => { this.props.closeModal(); }}><span style={{fontWeight: '600'}}>{ strings.pap }</span></a>
                    <div className="help-label"><span style={{fontWeight: '600'}}>{ strings.sayabout }</span></div>
                </div>
                <Form className="help-form" onSubmit={this.helpSubmit}>
                    <FormGroup row>
                        <textarea type="message"
                            name="message"
                            id="fieldMessage"
                            value={this.state.message}
                            onChange={this.handleMessageChange}
                            placeholder={strings.inputmessage}
                        />
                    </FormGroup>
                    <FormGroup row>
                        <div 
                            data-tip 
                            data-for="pleaselogin"
                            className="div_send_report">
                            <Button 
                                type="submit"
                                className="button-magenta button_usual report_button" 
                                onClick={() => { /* send report*/ }}
                                disabled={!user.loggingIn || !!!this.state.message}>
                                { strings.send }
                            </Button>
                        </div>
                        {!user.loggingIn ?
                            <ReactTooltip id='pleaselogin'>  
                                <span>{strings.pleaselogin}</span>
                            </ReactTooltip>
                            : !!!this.state.message ?
                                <ReactTooltip id='pleaselogin'>  
                                    <span>{strings.inputtext}</span>
                                </ReactTooltip>
                                : <></> 
                        }
                    </FormGroup>
                    { this.state.show_error && this.props.error && this.props.error.response.status === 401 ?
                        <div className="form-error" style={{color: '#990000'}}>{strings.wronglogin}</div>
                    :
                        <></>
                    }
                </Form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user:   state.user,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        sendReport: (msg) => dispatch(sendReport(msg)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Help);