import * as types from '../constants/ActionTypes';

const initState = {
    isFetching:           true,
    employeeLocations:    [],
    costcentersLocations: [],
    projectsLocations:    [],
    locationsInfo:        [],
};

export default function sdLocationsManagmentReducer(state = initState, action) {

    switch (action.type) {

        case types.REQUEST_GET_OBJECTS_LOCATION:
            return {
                isFetching:           true,
                employeeLocations:    [],
                costcentersLocations: [],
                projectsLocations:    [],
                locationsInfo:        [],
            };

        case types.RECEIVE_GET_OBJECTS_LOCATION_SUCCESS:
            return {
                isFetching:           false,
                employeeLocations:    action.payload.employeeLocations,
                costcentersLocations: action.payload.costcentersLocations,
                projectsLocations:    action.payload.projectsLocations,
                locationsInfo:        [],
            };
   
        case types.RECEIVE_GET_OBJECTS_LOCATION_ERROR:
            return {
                isFetching:           false,
                message:              action.message,
                employeeLocations:    [],
                costcentersLocations: [],
                projectsLocations:    [],
                locationsInfo:        [],
            };

        case types.REQUEST_GET_LOCATIONS_INFO:
            return {
                isFetching:           true,
                employeeLocations:    [],
                costcentersLocations: [],
                projectsLocations:    [],
                locationsInfo:        [],
            };

        case types.RECEIVE_GET_LOCATIONS_INFO_SUCCESS:
            return {
                isFetching:           false,
                employeeLocations:    [],
                costcentersLocations: [],
                projectsLocations:    [],
                locationsInfo:        action.payload
            };
    
        case types.RECEIVE_GET_LOCATIONS_INFO_ERROR:
            return {
                isFetching:           false,
                message:              action.message,
                employeeLocations:    [],
                costcentersLocations: [],
                projectsLocations:    [],
                locationsInfo:        [],
            };

        case types.ADD_COSTCENTERS_LOCATIONS:
            return {
                isFetching:           false,
                costcentersLocations: [
                    ...state.costcentersLocations,
                    {
                        id:             action.payload.id,
                        costcenter_num: action.payload.costcenter_num,
                        location_id:    action.payload.location_id,
                    }
                ],
                employeeLocations:    state.employeeLocations,
                projectsLocations:    state.projectsLocations,
                locationsInfo:        [],
            };

        case types.REMOVE_COSTCENTERS_LOCATIONS:
            return {
                isFetching:           false,
                costcentersLocations: state.costcentersLocations.filter(el => parseInt(el.id) !== parseInt(action.payload.object_id)),
                employeeLocations:    state.employeeLocations,
                projectsLocations:    state.projectsLocations,
                locationsInfo:        [],
            };

        case types.ADD_EMPLOYEES_LOCATIONS:
            return {
                isFetching:           false,
                employeeLocations:    [
                    ...state.employeeLocations,
                    {
                        id:          action.payload.id,
                        employee_id: action.payload.employee_id,
                        location_id: action.payload.location_id,
                    }
                ],
                costcentersLocations: state.costcentersLocations,
                projectsLocations:    state.projectsLocations,
                locationsInfo:        [],
            };

        case types.REMOVE_EMPLOYEES_LOCATIONS:
            return {
                isFetching:           false,
                costcentersLocations: state.costcentersLocations,
                employeeLocations:    state.employeeLocations.filter(el => parseInt(el.id) !== parseInt(action.payload.object_id)),
                projectsLocations:    state.projectsLocations,
                locationsInfo:        [],
            };

        case types.ADD_PROJECTS_LOCATIONS:
            return {
                isFetching:           false,
                projectsLocations:    [
                    ...state.projectsLocations,
                    {
                        id:          action.payload.id,
                        project_id:  action.payload.project_id,
                        location_id: action.payload.location_id,
                    }
                ],
                costcentersLocations: state.costcentersLocations,
                employeeLocations:    state.employeeLocations,
                locationsInfo:        [],
            };

        case types.REMOVE_PROJECTS_LOCATIONS:
            return {
                isFetching:           false,
                costcentersLocations: state.costcentersLocations,
                employeeLocations:    state.employeeLocations,
                projectsLocations:    state.projectsLocations.filter(el => parseInt(el.id) !== parseInt(action.payload.object_id)),
                locationsInfo:        [],
            };
    
        default:
            return state;
    }
    
}
