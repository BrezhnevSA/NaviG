import React, { Component } from 'react';
import { connect }          from "react-redux";
import { withRouter }       from 'react-router-dom';
import { scd }              from '../../actions/SelectionsActions';
import LocalizedStrings     from 'react-localization';

import './Footer.css';

const VERSION = "1.0";
const DATE_VER = "18.05.2021";

let strings = new LocalizedStrings({
    en:{
        dt_it: "2022 New expierence in maps",
        version: "Version",
        from: "from",
        life: "BEST OFFICE MAP",
        release_notes: "Release Notes",
        close: "Close",
        empty: "So far empty here",
        contact_us: "Contact us"
    },
    ru: {
        dt_it: "2022 New expierence in maps",
        version: "Версия",
        from: "от",
        life: "BEST OFFICE MAP",
        release_notes: "Release Notes",
        close: "Закрыть",
        empty: "Пока что здесь пусто",
        contact_us: "Contact us"
    },
    de: {
        dt_it: "2022 New expierence in maps",
        version: "Version",
        from: "von",
        life: "BEST OFFICE MAP",
        release_notes: "Release Notes",
        close: "Schließen",
        empty: "Bisher leer hier",
        contact_us: "Contact us"
    }
});

class Footer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            secret_click_counter: 0
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());  
    }

    componentDidMount() { }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    render() {
        let { secret_click_counter } = this.state;

        return (
            <div className="footer">
                <div className="first_row_footer">
                    <div 
                        className={`
                            logo_footer 
                            ${secret_click_counter % 5 == 0 && secret_click_counter % 10 !== 0 && secret_click_counter > 0 
                                ? 'secret_click' 
                                : secret_click_counter % 5 == 0 && secret_click_counter % 10 == 0 && secret_click_counter > 0
                                    ? 'secret_click_re' 
                                    : ''
                            }
                        `}
                        onClick={() => { 
                            this.setState({ secret_click_counter: secret_click_counter + 1 });
                            if (secret_click_counter == 20) { this.props.scd(); }
                        }}
                    >
                        <img src="/img/pics/logo_white_2.svg"></img>
                    </div>
                    <div className="life_for_sharing">{strings.life}</div>
                </div>
                <hr className="line_footer" align="center" size="2" color="#FFFFFF" />
                <div className="last_row_footer">
                    <div className="dt_it">{strings.dt_it}</div>
                    <div className="version">{strings.version} {VERSION} {strings.from} {DATE_VER}</div>
                    <div className="release_notes" onClick={() => this.props.history.push('/release-notes')}>{strings.release_notes}</div>
                </div>
                {/* <div id="helpModal" className={`${triggerModal ? "opened" : "closed"}`}>
                    <a href="#" className="close-help-modal" onClick={() => { this.setState({triggerModal: false})}}></a>
                    <Help closeModal={() => { this.setState({triggerModal: false})}} langChange={this.langChange} lang={this.state.storedLang} />
                </div> */}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
    };
};

function mapDispatchToProps(dispatch) {
    return {
        scd: () => dispatch(scd()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false }) (withRouter(Footer));