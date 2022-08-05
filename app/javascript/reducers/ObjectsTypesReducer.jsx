import * as types from '../constants/ActionTypes';

const initState = []

 export default function objectsTypesReducer(state = initState, action) {

    switch (action.type) {

        case types.GET_OBJECT_TYPES:
            
            return action.object_types;

        case types.GET_OBJECT_TYPE:
            return action.object_type;
    
        case types.ADD_OBJECT_TYPE:
            
            return [
                    ...state,
                    {
                        id: action.payload.id,
                        name: action.payload.name,
                        icon: action.payload.icon,
                        active: action.payload.active,
                        resizable: action.payload.resizable,
                        rotatable: action.payload.rotatable
                    }

            ]

        case types.UPDATE_OBJECT_TYPE:
            return [
                    ...state.map(el => (el.id === action.payload.id ? {
                        id: action.payload.id,
                        name: action.payload.name,
                        icon: action.payload.icon,
                        active: action.payload.active,
                        resizable: action.payload.resizable,
                        rotatable: action.payload.rotatable
                    } : el))
            ]

        case types.REMOVE_OBJECT_TYPE:
            return [
                    ...state.filter(el => el.id !== action.payload.id)
            ]
    
        default:
            return state;
    }
    
}