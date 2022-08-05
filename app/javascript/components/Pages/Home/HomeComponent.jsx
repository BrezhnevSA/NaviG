import React, { Component } from 'react';
import CitiesSelection    from '../Selections/CitiesSelection';
import BuildingsSelection from '../Selections/BuildingsSelection';
import FloorsSelection    from '../Selections/FloorsSelection';
import { connect }        from "react-redux";
import LocalizedStrings   from 'react-localization';

import {
    setSelectedCity,
    getSelections,
    setSelectedOffice,
    setSelectedBuilding,
    setSelectedFloor
} from '../../../actions/SelectionsActions';
import { Redirect } from 'react-router-dom';

import Loading from '../Loading/LoadingComponent';

import * as app_settings from '../../../constants/AppSettings';

let strings = new LocalizedStrings({
    en:{ 
        title:  "Cities list",
    },
    ru: {
        title:  "Выберите город",
    },
    de: {
        title:  "Liste der Städte",
    }
});

class HomeComponent extends Component {

    constructor(props) {
        super(props);

        super(props);
        
        this.langChange = this.langChange.bind(this);

        this.state = {

        };

    }

    langChange = (countryCode) => {
        this.props.langChange(countryCode);
    };

    componentDidMount(){
        this.props.getSelections();
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    render() {
        const { selections, buildings, lang, user } = this.props;
        if (user && user.user && user.user.rights && user.user.rights.length > 0 && !user.isFetching) {
            return (
                <>
                    <div id="homepageSelector" className={`home-main office-selection city-${selections.city ? selections.city.id : 0}`}>
                        <div className="selector-row">
                            <div className="city-office-selection-wrapper">
                                <CitiesSelection langChange={this.langChange} lang={lang} />
                            </div>
                            <div className="building-selection-wrapper selector-col">
                                { !!selections['office'] ?
                                    <BuildingsSelection />
                                : <></> }
                            </div>
                            <div className="floor-selection-wrapper selector-col">
                                { !!selections['building'] ?
                                    <FloorsSelection />
                                : <></> }
                            </div>
                            { selections.city && selections.city.id == 2 && selections.office && selections.office.id == 2 ?
                                <div className="selector-bc">
                                    <div className="bc_and_vo">
                                        <img src="/img/plan_elizavet/big_vo.svg"></img>
                                        <div className="b4_and_enter">
                                            <div 
                                                className={`b4_building ${selections.building.id == app_settings.ELIZAVETINSKY_B4_ID ? 'b4_selected' : ''}`}
                                                onClick={() => { 
                                                    this.props.setSelectedBuilding(buildings.find(b => b.id == app_settings.ELIZAVETINSKY_B4_ID));
                                                    this.props.setSelectedFloor(''); 
                                                }}
                                            ></div>
                                            <div className="enter_bc"></div>
                                        </div>
                                        <div className="b5_b3_bo_b1">
                                            <div>
                                                <div 
                                                    className={`b5_building ${selections.building.id == app_settings.ELIZAVETINSKY_B5_ID ? 'b5_selected' : ''}`}
                                                    onClick={() => { 
                                                        this.props.setSelectedBuilding(buildings.find(b => b.id == app_settings.ELIZAVETINSKY_B5_ID));
                                                        this.props.setSelectedFloor(''); 
                                                    }}
                                                ></div>
                                                <div 
                                                    className={`b3_building ${selections.building.id == app_settings.ELIZAVETINSKY_B3_ID ? 'b3_selected' : ''}`}
                                                    onClick={() => { 
                                                        this.props.setSelectedBuilding(buildings.find(b => b.id == app_settings.ELIZAVETINSKY_B3_ID));
                                                        this.props.setSelectedFloor(''); 
                                                    }}
                                                ></div>
                                            </div>
                                            <div>
                                                <div 
                                                    className={`b0_building ${selections.building.id == app_settings.ELIZAVETINSKY_B0_ID ? 'b0_selected' : ''}`}
                                                    onClick={() => { 
                                                        this.props.setSelectedBuilding(buildings.find(b => b.id == app_settings.ELIZAVETINSKY_B0_ID));
                                                        this.props.setSelectedFloor(''); 
                                                    }}
                                                ></div>
                                                <div 
                                                    className={`b1_building ${selections.building.id == app_settings.ELIZAVETINSKY_B1_ID ? 'b1_selected' : ''}`}
                                                    onClick={() => { 
                                                        this.props.setSelectedBuilding(buildings.find(b => b.id == app_settings.ELIZAVETINSKY_B1_ID));
                                                        this.props.setSelectedFloor(''); 
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div 
                                            className={`b2_building ${selections.building.id == app_settings.ELIZAVETINSKY_B2_ID ? 'b2_selected' : ''}`}
                                            onClick={() => { 
                                                this.props.setSelectedBuilding(buildings.find(b => b.id == app_settings.ELIZAVETINSKY_B2_ID));
                                                this.props.setSelectedFloor(''); 
                                            }}
                                        ></div>
                                    </div>
                                    <div className="line_12"></div>
                                </div>
                                : <></>
                            }
                        </div>
                    </div>
                </>
            );
        } else if (user && (!user.user || !user.user.rights) && !user.isFetching) {
            return (<Redirect to="/login" />);
        } else {
            return (<Loading/>);
        }
    }
}

const mapStateToProps = state => {
    return {
        cities:     state.cities,
        selections: state.selections,
        buildings:  state.buildings,
        user:       state.user
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getSelections:       () => dispatch(getSelections()),
        setSelectedCity:     (city) => dispatch(setSelectedCity(city)),
        setSelectedOffice:   (office) => dispatch(setSelectedOffice(office)),
        setSelectedBuilding: (building) => dispatch(setSelectedBuilding(building)),
        setSelectedFloor:    (floor) => dispatch(setSelectedFloor(floor)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(HomeComponent);