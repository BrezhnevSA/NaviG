import * as types from '../constants/ActionTypes';

const initState = []

 export default function officesReducer(state = initState, action) {

    switch (action.type) {

        case types.GET_OFFICES:
            return action.offices;

        case types.GET_OFFICE:
            return action.office;
    
        case types.ADD_OFFICE:
            
            return [
                    ...state,
                    {
                        id: action.payload.id,
                        name: action.payload.name,
                        short_name: action.payload.short_name,
                        address: action.payload.address,
                        city_id: action.payload.city_id,
                        active: action.payload.active,
                        ord: action.payload.ord,
                        meta_info: action.payload.meta_info
                    }

            ]

        case types.UPDATE_OFFICE:
            return [
                    ...state.map(el => (el.id === action.payload.id ? {
                        id: action.payload.id,
                        name: action.payload.name,
                        short_name: action.payload.short_name,
                        address: action.payload.address,
                        city_id: action.payload.city_id,
                        active: action.payload.active,
                        ord: action.payload.ord,
                        meta_info: action.payload.meta_info
                    } : el))
            ]

        case types.REMOVE_OFFICE:
            return [
                    ...state.filter(el => el.id !== action.payload)
            ]
    
        default:
            return state;
    }
    
}