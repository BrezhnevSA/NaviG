import * as types from '../constants/ActionTypes';

const initState = []

export default function floorsReducer(state = initState, action) {

    
    switch (action.type) {

        case types.GET_FLOORS:
            return action.floors;

        case types.GET_FLOOR:
            return action.floor;
   
        case types.ADD_FLOOR:
            
            return [
                    ...state,
                    {
                        id: action.payload.id,
                        name: action.payload.name,
                        short_name: action.payload.short_name,
                        ord: action.payload.ord,
                        building_id: action.payload.building_id,
                        active: action.payload.active,
                        building_name: action.payload.building_name
                    }

            ]

        case types.UPDATE_FLOOR:
            return [
                    ...state.map(el => (el.id === action.payload.id ? {
                        id: action.payload.id,
                        name: action.payload.name,
                        short_name: action.payload.short_name,
                        ord: action.payload.ord,
                        building_id: action.payload.building_id,
                        active: action.payload.active,
                        meta_info: action.payload.meta_info,
                        building_name: action.payload.building_name
                    } : el))
            ]

        case types.REMOVE_FLOOR:
            return [
                    ...state.filter(el => el.id !== action.payload.id)
            ]
    
        default:
            return state;
    }
    
}