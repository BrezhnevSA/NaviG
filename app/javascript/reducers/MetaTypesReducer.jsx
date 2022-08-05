import * as types from '../constants/ActionTypes';

const initState = []

 export default function metaTypesReducer(state = initState, action) {
    
    switch (action.type) {

        case types.GET_META_TYPES:
            
            return action.metaTypes;

        case types.GET_LOCATION_TYPE:
            return action.metaTypes;
    
        case types.GET_META_TYPE:
            
            return [
                    ...state,
                    {
                        id: action.id,
                        name: action.payload.name,
                        type: action.payload.type,
                    }

            ]

        case types.UPDATE_META_TYPE:
            return [
                    ...state.map(el => (el.id === action.payload.id ? {
                        id: action.payload.id,
                        name: action.payload.name,
                        type: action.payload.type,
                    } : el))
            ]

        case types.REMOVE_META_TYPE:
            return [
                    ...state.filter(el => el.id !== action.payload)
            ]
    
        default:
            return state;
    }
    
}
