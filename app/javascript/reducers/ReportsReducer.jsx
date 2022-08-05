import * as types from '../constants/ActionTypes';

const initState = {
    isFetching: true,
    non_seated_employees: []
};

export default function reportsReducer(state = initState, action) {

    switch (action.type) {

        case types.REQUEST_GET_NON_SEATED_EMPLOYYES_REPORT:
            return {
                isFetching:           true,
                non_seated_employees: []
            };

        case types.RECEIVE_GET_NON_SEATED_EMPLOYYES_REPORT_SUCCESS:
            return {
                isFetching:           false,
                non_seated_employees: action.report
            };
   
        case types.RECEIVE_GET_NON_SEATED_EMPLOYYES_REPORT_ERROR:
            return {
                isFetching:           false,
                message:              action.message,
                non_seated_employees: []
            };

        case types.REQUEST_GET_RESERVATIONS_REPORT:
            return {
                isFetching:   true,
                reservations: []
            };

        case types.RECEIVE_GET_RESERVATIONS_REPORT_SUCCESS:
            return {
                isFetching:   false,
                reservations: action.report
            };
    
        case types.RECEIVE_GET_RESERVATIONS_REPORT_ERROR:
            return {
                isFetching:   false,
                message:      action.message,
                reservations: []
            };

        case types.REQUEST_GET_COSTCENTER_PLACES_REPORT:
            return {
                isFetching:        true,
                costcenter_places: []
            };

        case types.RECEIVE_GET_COSTCENTER_PLACES_REPORT_SUCCESS:
            return {
                isFetching:        false,
                costcenter_places: action.report
            };
   
        case types.RECEIVE_GET_COSTCENTER_PLACES_REPORT_ERROR:
            return {
                isFetching:        false,
                message:           action.message,
                costcenter_places: []
            };

        case types.REQUEST_GET_METERAGE_REPORT:
            return {
                isFetching: true,
                meterage:   []
            };

        case types.RECEIVE_GET_METERAGE_REPORT_SUCCESS:
            return {
                isFetching: false,
                meterage:   action.report
            };
    
        case types.RECEIVE_GET_METERAGE_REPORT_ERROR:
            return {
                isFetching: false,
                message:    action.message,
                meterage:   []
            };

        case types.REQUEST_GET_RELOCATION_REPORT:
            return {
                isFetching: true,
                relocation: []
            };

        case types.RECEIVE_GET_RELOCATION_REPORT_SUCCESS:
            return {
                isFetching: false,
                relocation: action.report
            };
    
        case types.RECEIVE_GET_RELOCATION_REPORT_ERROR:
            return {
                isFetching: false,
                message:    action.message,
                relocation: []
            };

        case types.SEND_REPORT:
            return {
                ...state
            };

        default:
            return state;
    }
}