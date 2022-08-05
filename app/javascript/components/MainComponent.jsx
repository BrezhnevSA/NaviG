import React, { Component } from 'react';
import { connect }          from 'react-redux';
import styled               from 'styled-components';
import { 
    BrowserRouter, 
    Switch, 
    Route, 
    Redirect 
}                           from 'react-router-dom';

import Header  from './Header/HeaderComponent';
import Footer  from './Footer/FooterComponent';
import Sidebar from './SidebarComponent';

import * as rbac       from '../rbac/rbac';
import * as rights     from '../constants/RightsForComponents';
import * as rights_all from '../constants/Rights';
import * as app        from '../constants/AppSettings';
import * as styles     from '../constants/Styles';

import { getUserByToken }  from '../actions/LoginActions';

import Logout from './Pages/ProfilePageComponents/Logout'

import NotFound from './Pages/NotFound/NotFoundComponent';

import HeartBeats from './Pages/HeartBeats/HeartBeatsComponent';

import MapEditor from './Pages/MapComponents/MapEditorComponent/MapEditorComponent'
import MapViewer from './Pages/MapComponents/MapViewerComponent/MapViewerComponent'

import Cities   from './Pages/Cities/CitiesComponent'
import CityForm from './Pages/Cities/CityFormComponent'

import Buildings    from './Pages/Buildings/BuildingsComponent'
import BuildingForm from './Pages/Buildings/BuildingFormComponent'

import Floors    from './Pages/Floors/FloorsComponent'
import FloorForm from './Pages/Floors/FloorFormComponent'

import Offices    from './Pages/Offices/OfficesComponent'
import OfficeForm from './Pages/Offices/OfficeFormComponent'

import ObjectTypes    from './Pages/ObjectTypes/ObjectTypesComponent'
import ObjectTypeForm from './Pages/ObjectTypes/ObjectTypeFormComponent'

import LocationTypes    from './Pages/LocationTypes/LocationTypesComponent'
import LocationTypeForm from './Pages/LocationTypes/LocationTypeFormComponent'

import LocationItems    from './Pages/LocationItems/LocationItemsComponent'
import LocationItemForm from './Pages/LocationItems/LocationItemFormComponent'

import ObjectItems    from './Pages/ObjectItems/ObjectItemsComponent'
import ObjectItemForm from './Pages/ObjectItems/ObjectItemFormComponent'

import MetaFields from './Pages/MetaFields/MetaFieldsComponent'
import MetaFieldForm from './Pages/MetaFields/MetaFieldFormComponent'

import MetaMaps from './Pages/MetaMaps/MetaMapsComponent'
import MetaMapForm from './Pages/MetaMaps/MetaMapFormComponent'

import MetaTypes from './Pages/MetaTypes/MetaTypesComponent'
import MetaTypeForm from './Pages/MetaTypes/MetaTypeFormComponent'

import UserProfile from './Pages/ProfilePageComponents/UserProfileComponent'
import UserProfileEdit from './Pages/ProfilePageComponents/UserProfileEditComponent'

import GroupRight from './Pages/GroupRights/GroupRightsComponent';
import GroupForm  from './Pages/GroupRights/GroupFormComponent';

import GroupRightsForPages from './Pages/GroupRightsForPages/GroupRightsForPagesComponent';

import RelocationReport         from './Pages/Reports/RelocationReportComponent';
import NonSeatedEmployeesReport from './Pages/Reports/NonSeatedEmployeesReportComponent';
import ReservationsReport       from './Pages/Reports/ReservationsReportComponent';
import CostcenterPlacesReport   from './Pages/Reports/CostcenterPlacesReportComponent';
import MeterageReport           from './Pages/Reports/MeterageReportComponent';

import BookingsPanel   from './Pages/Bookings/BookingsPanel/BookingsPanelComponent';
import BookingEdit     from './Pages/Bookings/BookingEditComponent';

import SDManagersCreate from './Pages/Bookings/SDManagersCreateComponent';

import AccessToSDLocationsCreateComponent from './Pages/Bookings/AccessToSDLocationsCreateComponent';

import HomeComponent from './Pages/Home/HomeComponent';

import EmployyeesIn from './Pages/EmployeesIn/EmployyeesIn';

import Contracts     from './Pages/Contracts/ContractsComponent';
import ContractsForm from './Pages/Contracts/ContractsFormComponent';

import SearchPage from './Pages/SearchPage/SearchPageComponent';

import Faq from './Pages/Faq/Faq';

import FeedbackAppStore from './Pages/FeedbackAppStore/FeedbackAppStore';

import EmployeesManagement from './Pages/EmployeesManagement/EmployeesManagementComponent';

import ReleaseNotes from './Pages/ReleaseNotes/ReleaseNotes';

import InventoryComponent     from './Pages/Inventory/InventoryComponent';
import InventoryFormComponent from './Pages/Inventory/InventoryFormComponent';

import LoginFormComponent from './Pages/Login/LoginFormComponent';

import Parking from './Pages/Selections/Parking';

const MainWrapper = styled.main`
    position: relative;
    overflow: hidden;
    transition: all .15s;
    margin-left: ${props => (props.expanded ? 240 : 100)}px;
    min-height: 100vh;
    background: white;
`;

function mapDispatchToProps(dispatch) {
    return {
        getUserByToken: () => dispatch(getUserByToken()),
    };
}

const mapStateToProps = state => {
    return {
        user:       state.user,
        selections: state.selections
    };
};

class Main extends Component {

    constructor(props) {
        super(props);
        this.onToggle = this.onToggle.bind(this);
        
        let storedLang = 'RU';
        
        if (localStorage.getItem('lang')) {
            storedLang = localStorage.getItem('lang');
        }

        localStorage.setItem('lang', storedLang);

        this.state = {
            storedLang: storedLang,
            expanded: false
        };

        this.langChange = this.langChange.bind(this);
        this.props.getUserByToken();
    }

    langChange(lang) {
        
        this.setState({storedLang: lang}, function () {
            localStorage.setItem('storedLang', lang);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.storedLang !== localStorage.getItem('lang')) {
            this.setState({storedLang: localStorage.getItem('lang')}, function () {
                localStorage.setItem('storedLang', nextProps.storedLang);
            });            
        }
    }

    onToggle() {

        // this.setState(state => ({
        //     ...state,
        //     expanded: !state.expanded
        // }));
    }

    render() {
        const { expanded } = this.state;
        const { user, selections } = this.props;

        let page_by_url = window.location.href.split('/')[3];
        let is_floor_page_without_sub_doms = page_by_url === 'floors' && window.location.href.split('/')[4] !== undefined 
                                             ? page_by_url !== 'floors'
                                             : true

        let ProtectedCities   = rbac.protect(rights.list.find(e => e.name === "CITIES_RIGHTS").rights, Cities, user);
        let ProtectedCityForm = rbac.protect(rights.list.find(e => e.name === "CITY_FORM_RIGHTS").rights, CityForm, user);

        let ProtectedBuildings    = rbac.protect(rights.list.find(e => e.name === "BULDINGS_RIGHTS").rights, Buildings, user);
        let ProtectedBuildingForm = rbac.protect(rights.list.find(e => e.name === "BULDINGS_FORM_RIGHTS").rights, BuildingForm, user);

        let ProtectedLocationTypes    = rbac.protect(rights.list.find(e => e.name === "LOCATION_TYPES_RIGHTS").rights, LocationTypes, user);
        let ProtectedLocationTypeForm = rbac.protect(rights.list.find(e => e.name === "LOCATION_TYPE_FORM_RIGHTS").rights, LocationTypeForm, user);

        let ProtectedObjectTypes    = rbac.protect(rights.list.find(e => e.name === "OBJECT_TYPES_RIGHTS").rights, ObjectTypes, user);
        let ProtectedObjectTypeForm = rbac.protect(rights.list.find(e => e.name === "OBJECT_TYPE_FORM_RIGHTS").rights, ObjectTypeForm, user);

        let ProtectedOffices    = rbac.protect(rights.list.find(e => e.name === "OFFICES_RIGHTS").rights, Offices, user);
        let ProtectedOfficeForm = rbac.protect(rights.list.find(e => e.name === "OFFICE_FORM_RIGHTS").rights, OfficeForm, user);

        let ProtectedGroupRight = rbac.protect(rights.list.find(e => e.name === "GROUPRIGHTS_RIGHTS").rights, GroupRight, user);
        let ProtectedGroupForm  = rbac.protect(rights.list.find(e => e.name === "GROUP_FORM_RIGHTS").rights, GroupForm, user);

        let ProtectedMapEditor = rbac.protect(rights.list.find(e => e.name === "MAPEDITOR_RIGHTS").rights, MapEditor, user);
        let ProtectedMapViewer = rbac.protect(rights.list.find(e => e.name === "MAPVIEWER_RIGHTS").rights, MapViewer, user);

        let ProtectedFloors    = rbac.protect(rights.list.find(e => e.name === "FLOORS_RIGHTS").rights, Floors, user);
        let ProtectedFloorForm = rbac.protect(rights.list.find(e => e.name === "FLOOR_FORM_RIGHTS").rights, FloorForm, user);

        let ProtectedLocationItems    = rbac.protect(rights.list.find(e => e.name === "LOCATIONS_RIGHTS").rights, LocationItems, user);
        let ProtectedLocationItemForm = rbac.protect(rights.list.find(e => e.name === "LOCATION_FORM_RIGHTS").rights, LocationItemForm, user);

        let ProtectedObjectItems    = rbac.protect(rights.list.find(e => e.name === "OBJECT_ITEMS_RIGHTS").rights, ObjectItems, user);
        let ProtectedObjectItemForm = rbac.protect(rights.list.find(e => e.name === "OBJECT_ITEM_FORM_RIGHTS").rights, ObjectItemForm, user);

        let ProtectedMetaFields    = rbac.protect(rights.list.find(e => e.name === "META_FIELDS_RIGHTS").rights, MetaFields, user);
        let ProtectedMetaFieldForm = rbac.protect(rights.list.find(e => e.name === "META_FIELDS_FORM_RIGHTS").rights, MetaFieldForm, user);

        let ProtectedMetaMaps    = rbac.protect(rights.list.find(e => e.name === "META_MAPS_RIGHTS").rights, MetaMaps, user);
        let ProtectedMetaMapForm = rbac.protect(rights.list.find(e => e.name === "META_MAPS_FORM_RIGHTS").rights, MetaMapForm, user);

        let ProtectedMetaTypes    = rbac.protect(rights.list.find(e => e.name === "META_TYPES_RIGHTS").rights, MetaTypes, user);
        let ProtectedMetaTypeForm = rbac.protect(rights.list.find(e => e.name === "META_TYPES_FORM_RIGHTS").rights, MetaTypeForm, user);

        let ProtectedHeartBeats = rbac.protect(rights.list.find(e => e.name === "HEARTBEATS_RIGHTS").rights, HeartBeats, user);

        let ProtectedRelocationReport         = rbac.protect(rights.list.find(e => e.name === "REPORTS_RIGHTS").rights, RelocationReport, user);
        let ProtectedNonSeatedEmployeesReport = rbac.protect(rights.list.find(e => e.name === "REPORTS_RIGHTS").rights, NonSeatedEmployeesReport, user);
        let ProtectedReservationsReport       = rbac.protect(rights.list.find(e => e.name === "REPORTS_RIGHTS").rights, ReservationsReport, user);
        let ProtectedCostcenterPlacesReport   = rbac.protect(rights.list.find(e => e.name === "REPORTS_RIGHTS").rights, CostcenterPlacesReport, user);
        let ProtectedMeterageReport           = rbac.protect(rights.list.find(e => e.name === "REPORTS_RIGHTS").rights, MeterageReport, user);

        let ProtectedBookingEdit    = rbac.protectOnlyLogging(BookingEdit, user);
        let ProtectedBookingsPanel  = rbac.protectOnlyLogging(BookingsPanel, user);

        let ProtectedSDManagersCreate = rbac.protect(rights.list.find(e => e.name === "SDMANAGERS_CREATE_TAB_RIGHTS").rights, SDManagersCreate, user);

        let ProtectedAccessToSDLocationsCreateComponent = rbac.protect(rights.list.find(e => e.name === "ACCESS_TO_SD_LOCATIONS_CREATE_RIGHTS").rights, AccessToSDLocationsCreateComponent, user);

        let ProtectedContracts = rbac.protect(rights.list.find(e => e.name === "CONTRACTS_RIGHTS").rights, Contracts, user);
        let ProtectedContractsForm = rbac.protect(rights.list.find(e => e.name === "CONTRACTS_FORM_RIGHTS").rights, ContractsForm, user);

        let ProtectedGroupRightsForPages = rbac.protect(rights.list.find(e => e.name === "GROUPRIGHTS_RIGHTS_FOR_PAGES").rights, GroupRightsForPages, user);

        let ProtectedEmployeesManagement = rbac.protect(rights.list.find(e => e.name === "EMPLOYEES_PANEL_RIGHTS").rights, EmployeesManagement, user);

        let ProtectedInventory     = rbac.protect(rights.list.find(e => e.name === "INVENTORY_RIGHTS").rights, InventoryComponent, user);
        let ProtectedInventoryForm = rbac.protect(rights.list.find(e => e.name === "INVENTORY_FORM_RIGHTS").rights, InventoryFormComponent, user);

        // let ProtectedFaq = rbac.protectOnlyLogging(Faq, user);

        let ProtectedHomeComponent = rbac.protectOnlyLogging(HomeComponent, user);

        let ProtectedSearchPage = rbac.protectOnlyLogging(SearchPage, user);

        let ProtectedUserProfileEdit = rbac.protectOnlyLogging(UserProfileEdit, user);
        let ProtectedUserProfile     = rbac.protectOnlyLogging(UserProfile, user);

        let ProtectedEmployyeesIn = rbac.protectOnlyLogging(EmployyeesIn, user);

        let ProtectedParking = rbac.protect([rights_all.ADD_AVAILABLE_DATES_FOR_PARKING], Parking, user);

        return (
            <>
            <BrowserRouter>
                <div className={`sidebar-wrapper ${this.state.expanded ? "opened" : "closed"}`}>
                    <Sidebar expanded={expanded}
                        onToggle={this.onToggle}
                        lang={this.state.storedLang} />
                </div>
                <MainWrapper expanded={expanded} handlerFromParant={this.handleData}
                    className={`main-wrapper ${this.state.expanded ? "opened" : "closed"}`} >
                    <div className="App">
                        <Header langChange={this.langChange} lang={this.state.storedLang} />
                        <div id="scrollable-content-wrapper" className="overflow-hidden">
                            <div id="scrollable-content">
                                <Switch>
                                    <Route exact path='/login' render={(props) => <LoginFormComponent {...props} langChange={this.langChange} lang={this.state.storedLang}/>} />
        
                                    <Route exact path='/' render={(props) => <ProtectedHomeComponent {...props} langChange={this.langChange} lang={this.state.storedLang}/>} />
        
                                    <Route exact path='/search/' render={(props) => <ProtectedSearchPage {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    
                                    <Route path='/logout/' render={(props) => <Logout {...props} />} />

                                    <Route path='/heartbeats/' render={(props) => <ProtectedHeartBeats {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    
                                    <Route path='/floor/:id/edit/' render={(props) => <ProtectedMapEditor {...props} langChange={this.langChange} lang={this.state.storedLang} />}  />
                                    <Route path='/floor/:id/'      render={(props) => <ProtectedMapViewer {...props} langChange={this.langChange} lang={this.state.storedLang} />}  />
                                    
                                    <Route path='/profile/edit/' render={(props) => <ProtectedUserProfileEdit {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/profile/:id/'  render={(props) => <ProtectedUserProfile {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/profile'       render={(props) => <ProtectedUserProfile {...props} langChange={this.langChange} lang={this.state.storedLang} />} />

                                    <Route path='/cities/:id/' render={(props) => <ProtectedCityForm {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/cities/'     render={(props) => <ProtectedCities {...props} langChange={this.langChange} lang={this.state.storedLang} />} />

                                    <Route path='/buildings/:id/' render={(props) => <ProtectedBuildingForm {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/buildings/'     render={(props) => <ProtectedBuildings {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                
                                    <Route path='/floors/new' render={(props) => <ProtectedFloorForm {...props} langChange={this.langChange} lang={this.state.storedLang} />}  />
                                    <Route path='/floors/:id/edit' render={(props) => <ProtectedMapEditor {...props} langChange={this.langChange} lang={this.state.storedLang} />}  />
                                    <Route path='/floors/:id/details' render={(props) => <ProtectedFloorForm {...props} langChange={this.langChange} lang={this.state.storedLang} />}  />
                                    <Route path='/floors/:id/' render={(props) => <ProtectedMapViewer {...props} langChange={this.langChange} lang={this.state.storedLang} />}  />
                                    <Route path='/floors/'     render={(props) => <ProtectedFloors {...props} langChange={this.langChange} lang={this.state.storedLang} />}  />

                                    <Route path='/offices/:id/' render={(props) => <ProtectedOfficeForm {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/offices/'     render={(props) => <ProtectedOffices {...props} langChange={this.langChange} lang={this.state.storedLang} />} />

                                    <Route path='/objecttypes/:id/' render={(props) => <ProtectedObjectTypeForm {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/objecttypes/'     render={(props) => <ProtectedObjectTypes {...props} langChange={this.langChange} lang={this.state.storedLang} />} />

                                    <Route path='/locationtypes/:id/' render={(props) => <ProtectedLocationTypeForm {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/locationtypes/'     render={(props) => <ProtectedLocationTypes {...props} langChange={this.langChange} lang={this.state.storedLang} />} />

                                    <Route path='/rights_for_pages/' render={(props) => <ProtectedGroupRightsForPages {...props} langChange={this.langChange} lang={this.state.storedLang} />} />                               

                                    <Route path='/grouprights/'     render={(props) => <ProtectedGroupRight {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/groups/:id'       render={(props) => <ProtectedGroupForm {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    
                                    <Route path='/relocation_reports' render={(props) => <ProtectedRelocationReport {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/reservations_with_comments_report' render={(props) => <ProtectedNonSeatedEmployeesReport {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/reservations_report' render={(props) => <ProtectedReservationsReport {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/costcenter_places_report' render={(props) => <ProtectedCostcenterPlacesReport {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/meterage_report/:id' render={(props) => <ProtectedMeterageReport {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    
                                    <Route path='/objects/:id/' render={(props) => <ProtectedObjectItemForm {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/objects/'     render={(props) => <ProtectedObjectItems {...props} langChange={this.langChange} lang={this.state.storedLang} />} />

                                    <Route path='/locations/:id/' render={(props) => <ProtectedLocationItemForm {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/locations/'     render={(props) => <ProtectedLocationItems {...props} langChange={this.langChange} lang={this.state.storedLang} />} />

                                    <Route path='/metafields/:id/' render={(props) => <ProtectedMetaFieldForm {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/metafields/'     render={(props) => <ProtectedMetaFields {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    
                                    <Route path='/metamaps/:id/' render={(props) => <ProtectedMetaMapForm {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/metamaps/'     render={(props) => <ProtectedMetaMaps {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    
                                    <Route path='/metatypes/:id/' render={(props) => <ProtectedMetaTypeForm {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/metatypes/'     render={(props) => <ProtectedMetaTypes {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    
                                    <Route path='/bookings/:id/edit' render={(props) => <ProtectedBookingEdit {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/bookings/' render={(props) => <ProtectedBookingsPanel {...props} langChange={this.langChange} lang={this.state.storedLang} />} />

                                    <Route path='/sdmanagers/' render={(props) => <ProtectedSDManagersCreate {...props} langChange={this.langChange} lang={this.state.storedLang} />} />

                                    <Route path='/sdlocation_access/:id' render={(props) => <ProtectedAccessToSDLocationsCreateComponent {...props} langChange={this.langChange} lang={this.state.storedLang} />} />

                                    <Route path='/employees_in/:search_id' render={(props) => <ProtectedEmployyeesIn {...props} langChange={this.langChange} lang={this.state.storedLang} />} />

                                    <Route path='/contracts/:id' render={(props) => <ProtectedContractsForm {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/contracts/' render={(props) => <ProtectedContracts {...props} langChange={this.langChange} lang={this.state.storedLang} />} />

                                    <Route path='/faq/' render={(props) => <Faq {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path='/feedbackappstore/' render={(props) => <FeedbackAppStore {...props} langChange={this.langChange} lang={this.state.storedLang} />} />

                                    <Route path='/release-notes/' render={(props) => <ReleaseNotes {...props} langChange={this.langChange} lang={this.state.storedLang} />} />

                                    <Route path='/employees/' render={(props) => <ProtectedEmployeesManagement {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    
                                    <Route path={`/${app.INVENTORY_PATH}/:id`} render={(props) => <ProtectedInventoryForm {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    <Route path={`/${app.INVENTORY_PATH}/`} render={(props) => <ProtectedInventory {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    
                                    <Route path='/parking/' render={(props) => <ProtectedParking {...props} langChange={this.langChange} lang={this.state.storedLang} />} />
                                    
                                    <Route exact path='/404' render={(props) => <NotFound />} />

                                    <Redirect to="/404" />
                                </Switch>
                                {selections.scd ? styles.ducks : <></>}
                                {page_by_url && page_by_url !== '#' && page_by_url !== '' && is_floor_page_without_sub_doms && 
                                    <Footer langChange={this.langChange} lang={this.state.storedLang}/>
                                }     
                            </div>
                        </div>
                    </div>
                </MainWrapper>       
            </BrowserRouter>
        </>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Main);