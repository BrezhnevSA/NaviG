import React, { Component } from 'react';
import { connect }          from "react-redux";
import {
    Redirect 
}                           from 'react-router-dom';
import {
    setSelectedOffice,
    setSelectedBuilding,
    setSelectedFloor,
    getSelections,
    missBuildingSelection
} from '../../../actions/SelectionsActions';

import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en:{ 
        title:  "Offices list"
    },
    ru: {
        title:  "Выберите офис"
    },
    de: {
        title:  "Liste der Büros"
    }
});

class OfficesSelection extends Component {

    constructor(props) {
        super(props);
        
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.state = {
        };

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount(){
        this.props.getSelections();
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    handleClick(id) {
        const { offices } = this.props;
        if (this.props.selections['office']['id'] !== id) {
            this.props.setSelectedOffice(offices.find(e => e.id === id));
            this.props.setSelectedBuilding('');
            this.props.setSelectedFloor('');
        }
    }

    render() {
        const { offices }    = this.props;
        let offices_filtered = [];
        const city_id        = parseInt(this.props.city);
        const selected_city  = localStorage.getItem('selected_city') === ''
            ? ''
            : JSON.parse(localStorage.getItem('selected_city'));
        if (selected_city === '') {
            return(<Redirect to="/" />)
        }
        offices_filtered = offices && offices.length > 0 
            ? offices.filter(el => el.city_id === city_id && el.active)
            : [];

        return (
            <div>
                <div className="">
                    <div className="locations-selection office" >
                        <ul id="officesList">
                            {offices_filtered.length > 0 ? (
                                    offices_filtered.sort((a,b) => a.ord >= b.ord ? 1 : -1).map(el => (
                                        <li key={`${el.id}`} >
                                            <div onClick={() => { this.handleClick(el.id); }}
                                                className={`selection-name office ${el.id ===  this.props.selections['office']['id'] ? "selected" : "not-selected"}`}>
                                                {/* <img src="/img/pics/businesscenter.png" className="office-icon"></img> */}
                                                {el.name}
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <></>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        offices:    state.offices,
        selections: state.selections,
        floors:     state.floors,
        buildings:  state.buildings
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getSelections:       () => dispatch(getSelections()),
        setSelectedOffice:   (office) => dispatch(setSelectedOffice(office)),
        setSelectedBuilding: (building) => dispatch(setSelectedBuilding(building)),
        setSelectedFloor:    (floor) => dispatch(setSelectedFloor(floor)),
        missBuildingSelection: (val) => dispatch(missBuildingSelection(val))
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(OfficesSelection);