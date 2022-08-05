import React, { Component } from 'react';
import { connect }          from "react-redux";
import { 
    Link, 
    Redirect 
}                           from 'react-router-dom';

import {
    setSelectedFloor,
    getSelections
} from '../../../actions/SelectionsActions';

import * as rbac   from '../../../rbac/rbac';
import * as rights from '../../../constants/Rights';

import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en:{
        title: "Floors list"
    },
    ru: {
        title: "Выберите этаж"
    },
    de: {
        title: "Bodenliste"
    }
});

class FloorsSelection extends Component {

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

    handleClick(id){
        const { floors } = this.props;
        this.props.setSelectedFloor(floors.find(e => e.id === id));
    }

    render() {
        const { floors, selections, offices, buildings, user } = this.props;
        let floors_filtered = [];
        const building_id        = this.props.selections['building']['id'];
        const selected_building  = localStorage.getItem('selected_building') === ''
            ? ''
            : JSON.parse(localStorage.getItem('selected_building'));
        const show_parkings = user.user && user.user.rights 
            ? rbac.isSatisfied([rights.DELETE_AVAILABLE_DATES_FOR_PARKING], user.user.rights)
            : false ;
        if (selected_building !== '') {
            floors_filtered = floors && floors.length > 0 
                ? floors.filter(el => el.building_id === building_id && el.active && (
                    (el.id !== 55 && el.id !== 56 && el.id !== 57 && !show_parkings) || show_parkings
                ))
                : [];
        } else if (selected_building === '' && selections.office !== '') {
            buildings.map(b => {
                if (b.office_id === selections.office.id) {
                    floors_filtered = floors_filtered.concat(floors.filter(f => f.building_id === b.id));
                }
            })
        } else if (selected_building === '') {
            offices.map(o => {
                if (o.city_id === selections.city.id) {
                    buildings.map(b => {
                        if (b.office_id === o.id) {
                            floors_filtered = floors_filtered.concat(floors.filter(f => f.building_id === b.id));
                        }
                    })
                }
            });
        }

        return (
            <div className="floor-selection">
                <div className="">
                    <div className="locations-selection floor" >
                        <ul id="floorsList">
                            {floors_filtered.length > 0 ? (
                                floors_filtered.sort((a,b) => a.ord >= b.ord ? 1 : -1).map(el => (
                                        <li key={`${el.id}`} onClick={() => { this.handleClick(el.id); }}>
                                            <Link to={`/floors/${el.id}`} className="selection-name">{el.name}</Link>
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
        floors:     state.floors,
        offices:    state.offices,
        buildings:  state.buildings,
        selections: state.selections,
        user:       state.user
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getSelections:       () => dispatch(getSelections()),
        setSelectedFloor:    (floor) => dispatch(setSelectedFloor(floor)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(FloorsSelection);