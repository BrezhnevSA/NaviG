import * as types from '../constants/ActionTypes';

const initState = []

 export default function locationsTypesReducer(state = initState, action) {
    
    switch (action.type) {

        case types.GET_LOCATION_TYPES:
            
            return action.locationTypes;

        case types.GET_LOCATION_TYPE:
            return action.locationsType;
    
        case types.ADD_LOCATION_TYPE:
            
            return [
                    ...state,
                    {
                        id: action.payload.id,
                        name: action.payload.name,
                        bg: action.payload.bg,
                        active: action.payload.active
                    }

            ]

        case types.UPDATE_LOCATION_TYPE:
            return [
                    ...state.map(el => (el.id === action.payload.id ? {
                        id: action.payload.id,
                        name: action.payload.name,
                        bg: action.payload.bg,
                        active: action.payload.active
                    } : el))
            ]

        case types.REMOVE_LOCATION_TYPE:
            return [
                    ...state.filter(el => el.id !== action.payload.id)
            ]
    
        default:
            return state;
    }
    
}
