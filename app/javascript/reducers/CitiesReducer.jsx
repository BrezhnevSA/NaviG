import * as types from '../constants/ActionTypes';

const initState = []

export default function citiesReducer(state = initState, action) {

    switch (action.type) {

        case types.GET_CITIES:
            return action.cities;

        case types.GET_CITY:
            return action.city;
   
        case types.ADD_CITY:
            
            return [
                    ...state,
                    {
                        id: action.payload.id,
                        name: action.payload.name,
                        short_name: action.payload.short_name,
                        ord: action.payload.ord,
                        active: action.payload.active,
                        meta_info: action.payload.meta_info
                    }

            ]

        case types.UPDATE_CITY:
            return [
                    ...state.map(el => (el.id === action.payload.id ? {
                        id: action.payload.id,
                        name: action.payload.name,
                        short_name: action.payload.short_name,
                        ord: action.payload.ord,
                        active: action.payload.active,
                        meta_info: action.payload.meta_info
                    } : el))
            ]

        case types.REMOVE_CITY:
            return [
                    ...state.filter(el => el.id !== action.payload.id)
            ]
    
        default:
            return state;
    }
    
}
