import React, { Component } from 'react';
import { connect }          from "react-redux";
import OfficesSelection   from '../Selections/OfficesSelection';
import {
    setSelectedCity,
    getSelections,
    setSelectedOffice,
    setSelectedBuilding,
    setSelectedFloor
} from '../../../actions/SelectionsActions';
import { Accordion  } from "react-bootstrap";
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import Loading from '../Loading/LoadingComponent';

import LocalizedStrings from 'react-localization';

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

class CitiesSelection extends Component {

    constructor(props) {
        super(props);
        
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.state = {
            opened: true
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
        const { cities } = this.props;
        const { opened } = this.state;
        if (this.props.selections && this.props.selections['city'] && this.props.selections['city']['id'] !== id) {
            this.props.setSelectedCity(cities.find(e => e.id === id));
            this.props.setSelectedOffice('');
            this.props.setSelectedBuilding('');
            this.props.setSelectedFloor('');
            this.setState({ opened: true });
        } else {            
            this.setState({ opened: !opened });
            this.props.setSelectedOffice('');
            this.props.setSelectedBuilding('');
            this.props.setSelectedFloor('');
        }
    }

    render() {
        const { cities, selections } = this.props;
        const { opened } = this.state;
        let CustomToggleCity = <></>;
        if (cities.length > 0) {
            CustomToggleCity = ({ children, eventKey }) => {
                const decoratedOnClick = useAccordionToggle(eventKey, () => {
                    this.handleClick(children.id);
                });       
                return (
                    <div onClick={decoratedOnClick}>                    
                        <span
                            type="button"
                            className={`
                                city 
                                selection-name 
                                ${ selections && selections['city'] && selections['city']['id'] && 
                                   children.id ===  selections['city']['id'] && opened 
                                        ? "selected" 
                                        : "not-selected"
                                }
                            `}
                        >
                            {children.name}
                        </span>
                        <img 
                            src="/img/pics/vector_up.svg" 
                            className={`
                                vector_accordion 
                                ${selections && selections['city'] && selections['city']['id'] && 
                                  children.id ===  selections['city']['id'] && opened 
                                    ? "rotate_vector" 
                                    : ""
                                }
                            `}
                        ></img>
                    </div>
                );
            }
        }
        return (
            <div className="">
                <div className="">
                    <div className="locations-selection city" >
                        <ul id="citiesList">
                            {cities.length > 0 ? (
                                <Accordion defaultActiveKey={!!selections['city'] ? selections['city']['id'] : ''}>
                                    {cities.sort((a,b) => a.ord >= b.ord ? 1 : -1).map(el => (
                                        <>
                                            <CustomToggleCity  eventKey={el.id} >
                                                {el}
                                            </CustomToggleCity>                                      
                                            <Accordion.Collapse eventKey={el.id} className="tab_content text-left">
                                                <li key={`${el.id}`} >
                                                    <div className={`cities-list`}>
                                                        <OfficesSelection city={el.id} langChange={this.langChange} lang={this.state.storedLang} />
                                                    </div>
                                                </li>
                                            </Accordion.Collapse>
                                        </>
                                    ))}
                                </Accordion>
                            ) : (
                                <Loading/>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        cities:    state.cities,
        selections: state.selections
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

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(CitiesSelection);