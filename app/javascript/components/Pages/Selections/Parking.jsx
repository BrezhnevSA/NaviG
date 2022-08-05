import React, { Component } from 'react';
import { connect }          from "react-redux";
import { Link }             from 'react-router-dom';

import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en:{ 
        parking_eliz:      "Parking Elizavetinsky",
        parking_ostrov:    "Parking Ostrov",
        parking_voron:     "Parking Voronezh",
        parking_selection: "Parkings"
    },
    ru: {
        parking_eliz:      "Парковка Елизаветинский",
        parking_ostrov:    "Парковка Остров",
        parking_voron:     "Парковка Воронеж",
        parking_selection: "Парковки"
    },
    de: {
        parking_eliz:      "Parkplatz Elizavetinsky",
        parking_ostrov:    "Parkplatz Ostrov",
        parking_voron:     "Parkplatz Voronezh",
        parking_selection: "Parken"
    }
});

class ParkingSelection extends Component {

    constructor(props) {
        super(props);
        
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.state = {};
    }

    componentDidMount(){
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    render() {
        return (
            <div className="container-fluid overflow-auto with-actions heartbeats">
                <div className="container page-title-wrapper" >
                    <div className="heart-beats-component-page-title">
                        <h1 className="title_element">{ strings.parking_selection }</h1>                                
                    </div>
                </div>                        
                <div className="container neomorph-card mt-2">
                    <div className="row neomorph-card-inside" >
                        <div className="locations-selection city" >
                            <Link to="/floors/56" className="parking_link">
                                <p>
                                    {strings.parking_eliz}
                                </p>
                            </Link>
                            <Link to="/floors/57" className="parking_link">
                                <p>
                                    {strings.parking_ostrov}
                                </p>
                            </Link>
                            <Link to="/floors/55" className="parking_link">
                                <p>
                                    {strings.parking_voron}
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>
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
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(ParkingSelection);