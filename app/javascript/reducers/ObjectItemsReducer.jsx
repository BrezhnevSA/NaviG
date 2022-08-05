import * as types from '../constants/ActionTypes';

const initState = []

export default function objectItemsReducer(state = initState, action) {

    switch (action.type) {

        case types.REQUEST_GET_OBJECT_ITEMS:
            return {
                isFetching: true,
                message:    action.message,
                items:      [],
                count:      0
            };
    
        case types.RECEIVE_GET_OBJECT_ITEMS_SUCCEESS:
            return { 
                isFetching: false, 
                items:      action.object_items.items, 
                count:      action.object_items.count
            };
    
        case types.RECEIVE_GET_OBJECT_ITEMS_ERROR:
            return {
                isFetching: false,
                message:    action.message,
                items:      [],
                count:      0
            };
            
        case types.UPDATE_OBJECT_DETAILS:
            return [
                    ...state.items.map(el => (el.id === action.payload.id ? {
                        id: action.payload.id,
                        name: action.payload.name,
                        comment: action.payload.comment,
                        scale: action.payload.scale
                    } : el))
            ]

        case types.REMOVE_OBJECT_ITEM:
            return {
                isFetching: state.isFetching,
                message:    state.message,
                items:      state.items.filter(el => el.id === action.payload),
                count:      state.count              
            };
    
        default:
            return state;
    }
    
}
