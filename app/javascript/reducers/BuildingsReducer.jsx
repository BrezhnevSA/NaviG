import * as types from '../constants/ActionTypes';

const initState = []

export default function buildingsReducer(state = initState, action) {

    switch (action.type) {

        case types.GET_BUILDINGS:
            return action.buildings;

        case types.GET_BUILDING:
            return action.building;
   
        case types.ADD_BUILDING:
            
            return [
                    ...state,
                    {
                        id: action.payload.id,
                        name: action.payload.name,
                        short_name: action.payload.short_name,
                        ord: action.payload.ord,
                        office_id: action.payload.office_id,
                        active: action.payload.active,
                        meta_info: action.payload.meta_info
                    }

            ]

        case types.UPDATE_BUILDING:
            return [
                    ...state.map(el => (el.id === action.payload.id ? {
                        id: action.payload.id,
                        name: action.payload.name,
                        short_name: action.payload.short_name,
                        ord: action.payload.ord,
                        office_id: action.payload.office_id,
                        active: action.payload.active,
                        meta_info: action.payload.meta_info
                    } : el))
            ]

        case types.REMOVE_BUILDING:
            return [
                    ...state.filter(el => el.id !== action.payload.id)
            ]
    
        default:
            return state;
    }
    
}
