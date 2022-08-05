import { combineReducers }          from 'redux';
import objectsTypesReducer          from "./ObjectsTypesReducer";
import locationsTypesReducer        from "./LocationsTypesReducer";
import citiesReducer                from "./CitiesReducer";
import buildingsReducer             from "./BuildingsReducer";
import officesReducer               from "./OfficesReducer";
import floorsReducer                from "./FloorsReducer";
import floorReducer                 from "./FloorReducer";
import profileReducer               from "./ProfileReducer";
import loginReducer                 from "./LoginReducer";
import searchReducer                from "./SearchReducer";
import heartbeatsReducer            from "./HeartBeatsReducer";
import groupRightsReducer           from "./GroupRightsReducer";
import groupsReducer                from './GroupsReducer';
import rolesReducer                 from './RolesReducer';
import rightsReducer                from './RightsReducer';
import locationsReducer             from './LocationsReducer';
import objectItemsReducer           from './ObjectItemsReducer';
import metaFieldsReducer            from "./MetaFieldsReducer";
import metaMapsReducer              from "./MetaMapsReducer";
import metaTypesReducer             from "./MetaTypesReducer";
import attributesReducer            from "./AttributesReducer";
import bookingsReducer              from "./BookingsReducer";
import sdmanagersCostcentersReducer from "./SDManagersCostcentersReducer";
import sdLocationsManagmentReducer  from "./SDLocationsManagmentReducer";
import selectionsReducer            from "./SelectionsReducer";
import reportsReducer               from './ReportsReducer';
import mapEditorBufferReducer       from './MapEditorBufferReducer';
import contractReducer              from './ContractsReducer';
import employeesReducer             from './EmployeesReducer';
import availableDatesForParkingReducer from './AvailableDatesForParkingReducer';

export const rootReducer = combineReducers({
  object_types:           objectsTypesReducer,
  location_types:         locationsTypesReducer,
  cities:                 citiesReducer,
  buildings:              buildingsReducer,
  offices:                officesReducer,
  floors:                 floorsReducer,
  floor:                  floorReducer,
  profile:                profileReducer,
  search:                 searchReducer,
  user:                   loginReducer,
  heartbeats:             heartbeatsReducer,
  groupRights:            groupRightsReducer,
  groups:                 groupsReducer,
  roles:                  rolesReducer,
  rights:                 rightsReducer,
  locations:              locationsReducer,
  object_items:           objectItemsReducer,
  meta_fields:            metaFieldsReducer,
  meta_maps:              metaMapsReducer,
  meta_types:             metaTypesReducer,
  attributes:             attributesReducer,
  bookings:               bookingsReducer,
  sdmanagers_costcenters: sdmanagersCostcentersReducer,
  sdLocationsManagment:   sdLocationsManagmentReducer,
  selections:             selectionsReducer,
  reports:                reportsReducer,
  buffer:                 mapEditorBufferReducer,
  contracts:              contractReducer,
  employees:              employeesReducer,
  available_dates_for_parking: availableDatesForParkingReducer
});
