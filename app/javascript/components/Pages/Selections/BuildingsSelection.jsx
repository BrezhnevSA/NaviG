import React, { Component } from 'react';
import { connect }          from "react-redux";
import {
    setSelectedBuilding,
    setSelectedFloor,
    getSelections
} from '../../../actions/SelectionsActions';

import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en:{
        title: "Buildings list"
    },
    ru: {
        title: "Выберите корпус"
    },
    de: {
        title: "Bauliste"
    }
});

class BuildingsSelection extends Component {

    constructor(props) {
        super(props);
        
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.state = {
            buildings_filtered: [],
            current_office_id: 0,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount(){
        this.props.getSelections();
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidUpdate(prevProps) {
        if (!!this.props.selections['office']) {
            if ((this.props.selections['office']['id'] != this.state.current_office_id) ||
                this.props.buildings.length !== prevProps.buildings.length ||
                this.state.current_office_id === 0) {
                const { selections, offices, buildings }    = this.props;
                let buildings_filtered = [];
                const office_id        = selections['office']['id'];
                const selected_office  = localStorage.getItem('selected_office') === ''
                    ? ''
                    : JSON.parse(localStorage.getItem('selected_office'));

                if (selected_office !== '') {
                    buildings_filtered = buildings && buildings.length > 0
                        ? buildings.filter(el => el.office_id === office_id && el.active)
                        : [];
                    if ((buildings_filtered.length === 1)) {
                        this.handleClick(buildings_filtered[0]['id']);
                    }
                } else if (selected_office === '') {
                    offices.map(o => {
                        if (o.city_id === selections.city.id) {
                            buildings_filtered = buildings_filtered.concat(buildings.filter(b => b.office_id === o.id && el.active));
                            if ((buildings_filtered.length === 1)) {
                                this.handleClick(buildings_filtered[0]['id']);
                            }
                        }
                    });
                }
                this.setState({
                    buildings_filtered: buildings_filtered,
                    current_office_id: office_id
                    });
            }
        }
        
    }

    handleClick(id){
        const { buildings } = this.props;
        this.props.setSelectedBuilding(buildings.find(e => e.id === id));
        this.props.setSelectedFloor('');
    }

    render() {
        return (
            <div className="building-selection">
                <div className="">
                    <div className="locations-selection building" >
                        <ul id="buildingsList" >
                            {this.state.buildings_filtered.length > 1 ? (
                                    this.state.buildings_filtered.sort((a,b) => a.ord >= b.ord ? 1 : -1).map(el => (
                                        <li key={`${el.id}`}>
                                            <div onClick={() => { this.handleClick(el.id); }}
                                                className={`selection-name building ${
                                                    !!this.props.selections['building'] ? 
                                                    (el.id ===  this.props.selections['building']['id'] ? "selected" : "not-selected") : "not-selected"
                                                    }`} >
                                                {el.name}</div>
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
        buildings:  state.buildings,
        selections: state.selections,
        offices:    state.offices
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getSelections:       () => dispatch(getSelections()),
        setSelectedBuilding: (building) => dispatch(setSelectedBuilding(building)),
        setSelectedFloor:    (floor) => dispatch(setSelectedFloor(floor))
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(BuildingsSelection);