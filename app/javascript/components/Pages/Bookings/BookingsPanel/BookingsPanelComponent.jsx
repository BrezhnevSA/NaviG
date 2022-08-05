import React, { Component } from 'react';
import { connect }          from 'react-redux';
import { 
    Tabs,
    Tab,
}                           from 'react-bootstrap';
import { 
    Row,
    Col, 
    Button, 
    Input,
    Container, 
}                           from 'reactstrap';
import queryString          from 'query-string';

import { getPageOfBookings }         from '../../../../actions/BookingsActions';
import { getLocationsInfo }          from '../../../../actions/SDLocationsManagmentActions';
import { getSDManagers_costcenters } from '../../../../actions/SDManagersCostcentersActions';
import { searchEmployeeById }        from '../../../../actions/SearchActions';

import BookingTab           from './Tabs/BookingTabComponent';
import SDManagersTab        from './Tabs/SDManagersTabComponent';
import SDLocationsManagment from './Tabs/SDLocationsManagmentComponent';
import NoAccess             from '../../NoAccess/NoAccessComponent';

import * as rbac   from '../../../../rbac/rbac';
import * as rights from '../../../../constants/RightsForComponents';
import * as tabs   from '../../../../constants/TabsTypes';

import './BookingsPanel.css';

import LocalizedStrings        from 'react-localization';
import SearchBookingsComponent from './Tabs/SearchBookingsComponent';

let strings = new LocalizedStrings({
    en:{
        mybookings:            "My Bookings",
        all:                   "All",
        sd_managers:           "SD Managers",
        sd_location_managment: "SD location management",
        searchingBookings:     "Book Now",
    },
    ru: {
        mybookings:            "Мои бронирования",
        all:                   "Все",
        sd_managers:           "SD Менеджеры",
        sd_location_managment: "Управление SD помещениями",
        searchingBookings:     "Забронировать",
    },
    de: {
        mybookings:            "Meine Buchungen",
        all:                   "Alles",
        sd_managers:           "SD-Manager",
        sd_location_managment: "SD-Standortverwaltung",
        searchingBookings:     "Buchen Sie Jetzt",
    }
});

function mapDispatchToProps(dispatch) {
    return {
        getLocationsInfo:          () => dispatch(getLocationsInfo()),
        getSDManagers_costcenters: () => dispatch(getSDManagers_costcenters()),
        searchEmployeeById:  (id) => dispatch(searchEmployeeById(id)),
        getPageOfBookings: (page, sizePerPage, filters, sortField, sortOrder, allBookings) => dispatch(getPageOfBookings(page, sizePerPage, filters, sortField, sortOrder, allBookings))
    };
}

const mapStateToProps = state => {
    return {
        user:                   state.user,
        sdLocationsManagment:   state.sdLocationsManagment,
        sdmanagers_costcenters: state.sdmanagers_costcenters,
    };
};

class BookingsPanel extends Component {

    constructor(props) {
        super(props);
        const key = queryString.parse(this.props.location.search).key;

        this.state = {
            key: [tabs.SEARCH, tabs.MY_BOOKINGS, tabs.ALL, tabs.SD_MANAGERS, tabs.SD_LOCATIONS_MANAGMENT].includes(key)
                        ? key
                        : tabs.SEARCH,
            firstLoad: true
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.setKey = this.setKey.bind(this);
    }

    componentDidMount() {
        const parsed_params = queryString.parse(this.props.location.search);
        this.setKey(queryString.parse(this.props.location.search).key)
        if (parsed_params.employee && (parsed_params.switchState === 'true')) {
            this.props.searchEmployeeById(parsed_params.employee);
            this.setState({ searchEmployee: true })
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.search !== prevProps.location.search) {
            if ((queryString.parse(this.props.location.search).key !== this.state.key)) {
                this.setKey(queryString.parse(this.props.location.search).key)
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    setKey(key) {
        switch (key) {
            case tabs.SD_MANAGERS:
                this.props.getSDManagers_costcenters();
                this.props.history.push('/bookings?key=SD_MANAGERS');
                break;
            case tabs.SD_LOCATIONS_MANAGMENT:
                this.props.getLocationsInfo();
                this.props.history.push('/bookings?key=SD_LOCATIONS_MANAGMENT');
                break;
            case tabs.SEARCH:
                this.props.history.push('/bookings?key=SEARCH');
                break;
            case tabs.ALL:
                this.props.getPageOfBookings(1, 10, [], "created_at", "desc");
                this.props.history.push('/bookings?key=ALL');
                break;
            case tabs.MY_BOOKINGS:
                this.props.getPageOfBookings(1, 10, [{ field: "employee_id", value: this.props.user.user.data.id }], "created_at", "desc");
                this.props.history.push('/bookings?key=MY_BOOKINGS');
                break;
            default:
                break;
        }
        this.setState({ key : key });
    }

    render() {
        let { key, firstLoad }  = this.state;
        let { user }            = this.props;

        return (
            <>
                <div className="container-fluid overflow-auto">
                    {/* <Container style={{ 'paddingLeft': '0', 'paddingRight': '0', 'paddingTop': '5px'}}> */}
                        <Tabs 
                            id="bookings-tabs" 
                            activeKey={key}
                            onSelect={(k) => this.setKey(k)}
                            className="bookings"
                        >
                            <Tab eventKey={tabs.SEARCH} title={strings.searchingBookings}  tabClassName="profile-tabitem">
                            <div className="profile-tab-space"><SearchBookingsComponent {...this.props} tabType={key}/></div>
                            </Tab>
                            <Tab eventKey={tabs.MY_BOOKINGS} title={strings.mybookings}  tabClassName="profile-tabitem">
                            <div className="profile-tab-space"><BookingTab {...this.props} tabType={key}/></div>
                            </Tab>
                            {rbac.isSatisfied(rights.list.find(e => e.name === "ALL_BOOKING_TAB_RIGHTS").rights, user.user.rights) ? (
                                <Tab eventKey={tabs.ALL} title={strings.all}  tabClassName="profile-tabitem">
                                    <div className="profile-tab-space"><BookingTab {...this.props} tabType={key}/></div>
                                </Tab>
                                ) : (<></>)
                            }
                            {rbac.isSatisfied(rights.list.find(e => e.name === "SDMANAGERS_COSTCENTERS_TAB_RIGHTS").rights, user.user.rights) ? (
                                <Tab eventKey={tabs.SD_MANAGERS} title={strings.sd_managers}  tabClassName="profile-tabitem">
                                    <div className="profile-tab-space"><SDManagersTab {...this.props} tabType={key}/></div>
                                </Tab>
                                ) : (<></>)
                            }
                            {rbac.isSatisfied(rights.list.find(e => e.name === "SD_LOCATIONS_MANAGMENT_TAB_RIGHTS").rights, user.user.rights) ? (
                                <Tab eventKey={tabs.SD_LOCATIONS_MANAGMENT} title={strings.sd_location_managment}  tabClassName="profile-tabitem">
                                    <div className="profile-tab-space"><SDLocationsManagment {...this.props} tabType={key}/></div>
                                </Tab>
                                ) : (<></>)
                            }
                        </Tabs>
                    {/* </Container> */}
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(BookingsPanel);