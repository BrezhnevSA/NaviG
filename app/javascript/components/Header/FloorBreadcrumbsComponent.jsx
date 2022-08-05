import React, { Component } from 'react';
import { connect }          from "react-redux";
import { Link }         from 'react-router-dom';
import { setSelectedBuilding, setSelectedFloor, setSelectedOffice, setSelectedCity, setAllSelections } from '../../actions/SelectionsActions';
import "./FloorBreadcrumbs.css";

class FloorBreadcrumbs extends Component {

    constructor(props) {
        super(props)

        this.state = {            
            floor_breadcrumbs: null,
            is_floor_page: false,
            url: null,
            hover: false
        };

    }

    componentDidUpdate(prevProps) {

        if (this.state.url != window.location.pathname) {
            const path = window.location.pathname.split('/');

            if (path[1] === 'floors' && !!path[2]) {
                this.setState({
                    is_floor_page: true,
                    url: window.location.pathname
                });
            }
            else {
                this.setState({
                    is_floor_page: false,
                    url: window.location.pathname
                });
            }
            this.updateBreadCrumbs();
        }

        if (this.props.floor !== prevProps.floor) {
            this.updateBreadCrumbs();
        }
    }

    updateBreadCrumbs() {
        // floor breadcrumbs
        if ((!!this.props.buildings) &&
                (!!this.props.floor.floor)) {
            let building = this.props.buildings.find(b => b.id == this.props.floor.floor['building_id']);
            if (!!this.props.offices && !!building) {
                const office = this.props.offices.find(o => o.id == building['office_id']);
                if (!!this.props.cities && !!office) {
                    const city = this.props.cities.find(o => o.id == office['city_id']);
                    const buildings_in_office_count = this.props.buildings.filter(b => b.office_id == office['id']).length;
                    if (buildings_in_office_count == 1) building = null;
                    this.setState({
                        floor_breadcrumbs: { building: building, office: office, city: city }
                    });
                }
            }
        }
    }

    handleClickCity = () => {
        const {floor_breadcrumbs} = this.state;
        const {setAllSelections} = this.props;

        if (floor_breadcrumbs && floor_breadcrumbs.city) {
            setAllSelections(floor_breadcrumbs.city, {id: null}, {id: null}, {id: null});
        }
    }

    handleClickOffice = () => {
        const {floor_breadcrumbs} = this.state;
        const {setAllSelections} = this.props;

        if (floor_breadcrumbs && floor_breadcrumbs.office) {
            setAllSelections(floor_breadcrumbs.city, floor_breadcrumbs.office, {id: null}, {id: null});
        }
    }

    handleClickBuilding = () => {
        const {floor_breadcrumbs} = this.state;
        const {setAllSelections} = this.props;

        if (floor_breadcrumbs && floor_breadcrumbs.building) {
            setAllSelections(floor_breadcrumbs.city, floor_breadcrumbs.office, floor_breadcrumbs.building, {id: null});
        }
    }
    
    render() {
        const {floor, floors} = this.props;
        const { hover } = this.state;
        return (
            <>
                { this.state.is_floor_page ?
                    <div className="floor-name-wrapper">
                        
                        { !!this.state.floor_breadcrumbs ? 
                            <div className="breadcrumbs">
                                <Link onClick={this.handleClickCity} to="/">{ this.state.floor_breadcrumbs['city'] ? this.state.floor_breadcrumbs['city']['name'] : '' }</Link>
                                <span className="separator">
                                    <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.42727 4.93945L0.711047 0.342529L7.00603 5.34253L0.703857 10.3425L8.42727 5.74141C8.60616 5.63467 8.70442 5.49215 8.70386 5.34064C8.70442 5.18855 8.60616 5.04611 8.42727 4.93945Z" fill="#383838"/>
                                    </svg>
                                </span>
                                <Link onClick={this.handleClickOffice} to="/">
                                    { this.state.floor_breadcrumbs['office']['name'] }
                                </Link>
                                <span className="separator">
                                    <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.42727 4.93945L0.711047 0.342529L7.00603 5.34253L0.703857 10.3425L8.42727 5.74141C8.60616 5.63467 8.70442 5.49215 8.70386 5.34064C8.70442 5.18855 8.60616 5.04611 8.42727 4.93945Z" fill="#383838"/>
                                    </svg>
                                </span>
                                { !!this.state.floor_breadcrumbs['building'] ?
                                    <>
                                        <Link onClick={this.handleClickBuilding} to="/">
                                            { this.state.floor_breadcrumbs['building']['name'] }
                                        </Link>
                                        <span className="separator">
                                            <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.42727 4.93945L0.711047 0.342529L7.00603 5.34253L0.703857 10.3425L8.42727 5.74141C8.60616 5.63467 8.70442 5.49215 8.70386 5.34064C8.70442 5.18855 8.60616 5.04611 8.42727 4.93945Z" fill="#383838"/>
                                            </svg>
                                        </span>
                                    </>
                                : <></> }
                                { !!floor.floor ?
                                    <div className="floor-name-bc" onMouseEnter={() => { this.setState({ hover : true })}} onMouseLeave={() => { this.setState({ hover : false })}}>
                                        { floor.floor['name'] }
                                        <div 
                                            className={`floor_selector ${hover ? 'hover' : ''}`} 
                                            onMouseEnter={() => { this.setState({ hover : true })}} 
                                        >
                                            {floors.map(item => {
                                                return item.building_id === floor.floor.building_id && item.name !== floor.floor['name'] 
                                                    ? <a key={item.id} href={"/floors/" + item.id} className="floor_selector_item">
                                                        {item.name}
                                                      </a>
                                                    : null;
                                            }).filter(o => o)}
                                        </div> 
                                    </div>    
                                        : <></>
                                }
                            </div>
                        : <></> }
                    </div>
                : <></> }
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        floor:  state.floor,
        floors: state.floors,
        cities: state.cities,
        buildings: state.buildings,
        offices: state.offices,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        setAllSelections: (city, office, building, floor) => dispatch(setAllSelections(city, office, building, floor))
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(FloorBreadcrumbs);