import * as types from '../constants/ActionTypes';

const initState = []

 export default function metaMapsReducer(state = initState, action) {
    
    switch (action.type) {

        case types.GET_META_MAPS:
            
            return action.metaMaps;

        case types.GET_META_MAP:
            return action.metaMaps;
    
        case types.ADD_META_MAP:
            
            return [
                    ...state,
                    {
                        id: action.id,
                        entity_type: action.payload.entity_type,
                        entity_subtype_id: action.payload.entity_subtype,
                        meta_field_id: action.payload.meta_field,
                        active: action.payload.active,
                        show_in_management: action.payload.show_in_management
                    }

            ]

        case types.UPDATE_META_MAP:
            return [
                    ...state.map(el => (el.id === action.payload.id ? {
                        id: action.payload.id,
                        entity_type: action.payload.entity_type,
                        entity_subtype_id: action.payload.entity_subtype,
                        meta_field_id: action.payload.meta_field,
                        active: action.payload.active,
                        show_in_management: action.payload.show_in_management
                    } : el))
            ]

        case types.REMOVE_META_MAP:
            return [
                    ...state.filter(el => el.id !== action.payload)
            ]
    
        default:
            return state;
    }
    
}
