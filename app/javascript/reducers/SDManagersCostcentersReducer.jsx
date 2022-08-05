import * as types from '../constants/ActionTypes';

const initState = []

export default function sdmanagersCostcentersReducer(state = initState, action) {

    switch (action.type) {

        case types.REQUEST_GET_SDMANAGERS_COSTCENTERS:
            return {
                isFetching: true,
                items:      []
            };

        case types.RECEIVE_GET_SDMANAGERS_COSTCENTERS_SUCCESS:
            return {
                isFetching: false,
                items:      action.sdmanagers_costcenters
            };
   
        case types.RECEIVE_GET_SDMANAGERS_COSTCENTERS_ERROR:
            return {
                isFetching: false,
                message:    action.message,
                items:      []
            };

        case types.ADD_SDMANAGERS_COSTCENTER:
            return {
                items: [
                    ...state.items,
                    {
                        id:             action.payload.id,
                        employee_id:    action.payload.employee_id,
                        costcenter_num: action.payload.costcenter_num,
                        employee_label: action.payload.employee_label
                    }
                ],
                isFetching: false
            }

        case types.REQUEST_ADD_ALL_COSTCENTERS:
            return {
                items:      state.items,
                isFetching: true
            }

        case types.RECEIVE_ADD_ALL_COSTCENTERS_SUCCESS:
            return {
                items: [
                    ...state.items.filter(el => el.employee_id !== action.payload[0].employee_id),
                    ...action.payload
                ],
                isFetching: false
            }

        case types.RECEIVE_ADD_ALL_COSTCENTERS_ERROR:
            return {
                items:      [],
                isFetching: false
            }
            
        case types.REMOVE_SDMANAGERS_COSTCENTER:
            return {
                items:      state.items.filter(el => parseInt(el.id) !== parseInt(action.payload.id)),
                isFetching: false
            }

        case types.REQUEST_REMOVE_ALL_COSTCENTERS:
            return {
                items:      state.items,
                isFetching: true
            }

        case types.RECEIVE_REMOVE_ALL_COSTCENTERS_SUCCESS:
            return {
                items:      state.items.filter(el => parseInt(el.employee_id) !== parseInt(action.payload.id)),
                isFetching: false
            }

        case types.RECEIVE_REMOVE_ALL_COSTCENTERS_ERROR:
            return {
                items:      [],
                isFetching: false
            }
    
        default:
            return state;
    }
    
}
