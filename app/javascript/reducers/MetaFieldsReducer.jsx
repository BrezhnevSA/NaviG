import * as types from '../constants/ActionTypes';

const initState = []

 export default function metaFieldsReducer(state = initState, action) {
    
    switch (action.type) {

        case types.GET_META_FIELDS:
            return action.MetaFields;

        case types.GET_META_FIELD:
            return action.MetaFields;
    
        case types.ADD_META_FIELD:
            
            return [
                    ...state,
                    {
                        id: action.id,
                        name: action.payload.name,
                        meta_type: action.payload.meta_type,
                    }
            ]

        case types.UPDATE_META_FIELD:
            return [
                    ...state.map(el => (el.id === action.payload.id ? {
                        id: action.payload.id,
                        name: action.payload.name,
                        meta_type: action.payload.meta_type,
                    } : el))
            ]

        case types.REMOVE_META_FIELD:
            return [
                    ...state.filter(el => el.id !== action.payload)
            ]
    
        default:
            return state;
    }
    
}
