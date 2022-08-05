import * as types from '../constants/ActionTypes';

const initState = []

export default function locationsReducer(state = initState, action) {

    switch (action.type) {

        case types.REQUEST_GET_LOCATIONS:
            return {
                isFetching: true,
                message:    action.message,
                items:      [],
                count:      0
            };

        case types.RECEIVE_GET_LOCATIONS_SUCCEESS:
            return { 
                isFetching: false, 
                items:      action.locations.items, 
                count:      action.locations.count
            };
    
        case types.RECEIVE_GET_LOCATIONS_ERROR:
            return {
                isFetching: false,
                message:    action.message,
                items:      [],
                count:      0
            };

        case types.REQUEST_GET_LOCATIONS_NOT_IN_CONTRACT:
            return {
                isFetchingNotInContract: true,
                itemsNotInContract: [],
                countNotInContract: 0,                         
                isFetching: state.isFetching, 
                items: state.items, 
                count: state.count,
                message: state.message
            };

        case types.RECEIVE_GET_LOCATIONS_NOT_IN_CONTRACT_SUCCEESS:
            return { 
                isFetchingNotInContract: false,
                itemsNotInContract: action.locationsNotInContract.locations,
                countNotInContract: action.locationsNotInContract.count,                 
                isFetching: state.isFetching, 
                items: state.items, 
                count: state.count,
                message: state.message
            };
    
        case types.RECEIVE_GET_LOCATIONS_NOT_IN_CONTRACT_ERROR:
            return {
                isFetchingNotInContract: false,
                itemsNotInContract: [],
                countNotInContract: 0, 
                messageNotInContract: state.message,             
                isFetching: state.isFetching, 
                items: state.items, 
                count: state.count,
                message: state.message
            };
            

        case types.UPDATE_LOCATION_DETAILS:
            return [
                    ...state.map(el => (el.id === action.payload.id ? {
                        id: action.payload.id,
                        name: action.payload.name,
                        description: action.payload.description,
                        meta_info: action.payload.meta_info
                    } : el))
            ]

        case types.CREATE_LOCATION_DETAILS:
            return [
                    ...state,
                    {
                        id: action.payload.id,
                        name: action.payload.name,
                        description: action.payload.description,
                        is_real: false
                    }
            ]
    
        default:
            return state;
    }
    
}
