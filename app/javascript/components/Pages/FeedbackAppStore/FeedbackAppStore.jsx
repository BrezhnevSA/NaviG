import React, { Component } from 'react';
import { connect } from "react-redux";
import { sendReport } from '../../../actions/ReportsActions';
import { Button, Form, FormGroup, Label, Input  } from 'reactstrap';
import { toast } from 'react-toastify';
import ReactTooltip from 'react-tooltip';

import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en:{
        profile:  "My Profile",
        sayabout: "Report a problem",
        send: "Send",
        inputmessage: "Enter a comment",
        inputtext: "Fill the form",
        inputfio: "name/email",
        messagesent: "Message sent",
        feedback: "Feedback"
    },
    ru: {
        profile: "Профиль",
        sayabout: "Сообщить о проблеме",
        send: "Отправить",
        inputmessage: "Введите комментарий",
        inputtext: "Заполните форму",
        inputfio: "ФИО/email",
        messagesent: "Сообщение отправлено",
        feedback: "Обратная связь"
    },
    de: {
        profile: "Mein Profil",
        sayabout: "Problem melden",
        send: "Senden",
        inputmessage: "Kommentar eingeben",
        inputtext: "Fülle das Formular aus",
        inputfio: "Name/email",
        messagesent: "Nachricht gesendet",
        feedback: "Rückkopplung"
    }
});

class FeedbackAppStore extends Component {

    notify = (text) => {
        toast.success(text, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);
        
        this.state = {
            message: "",
            fio: ""
        };

        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.helpSubmit          = this.helpSubmit.bind(this);
        this.handleFioChange     = this.handleFioChange.bind(this);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());  
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

    handleFioChange(e) {
        this.setState({
            fio: e.target.value
        });
    }
    
    helpSubmit(e) {
        e.preventDefault();
        this.notify(strings.messagesent);
        this.props.sendReport(this.state.message, true);
        this.setState({
            show_error: false,
            inputs_changed: false,
            message: ""
        });
    }

    render() {
        return (
            <>
                <div className="container-fluid overflow-auto with-actions">
                    <div className="container page-title-wrapper" >
                        <h1 id="page-title">{ strings.feedback }</h1>
                    </div>
                    <div>
                        <Form className="help-form" onSubmit={this.helpSubmit}>
                            <FormGroup row>
                                <Input type="text"
                                    className="feedback-input"
                                    name="message"
                                    value={this.state.fio}
                                    onChange={this.handleFioChange}
                                    placeholder={strings.inputfio}
                                />
                            </FormGroup>
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
                                        disabled={!!!this.state.message}>
                                        { strings.send }
                                    </Button>
                                </div>
                                {!!!this.state.message ?
                                    <ReactTooltip id='pleaselogin'>  
                                        <span>{strings.inputtext}</span>
                                    </ReactTooltip>
                                    : <></> 
                                }
                            </FormGroup>
                        </Form>
                    </div>
                </div>
            </>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        sendReport: (msg, anonymous) => dispatch(sendReport(msg, anonymous)),
    };
}


const mapStateToProps = state => {
    
    return {
        user: state.user
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(FeedbackAppStore);