import React, { Component } from 'react';

import ReactFlagsSelect from 'react-flags-select';
//import css module
import 'react-flags-select/css/react-flags-select.css';

class LangSelector extends Component {

    constructor(props) {
        super(props);

    }

    langChange = (countryCode) => {
        localStorage.setItem('lang', countryCode);
        this.props.langChange(countryCode);
        
    };

    render() {
        return (
            <ReactFlagsSelect onSelect={this.langChange}
                defaultCountry={this.props.lang}
                countries={["US", "DE", "RU"]} 
                customLabels={{"US": "EN", "DE": "DE","RU": "RU"}} />
        );
    }
}

export default LangSelector;