import * as types from '../constants/ActionTypes';

const initState = {
    items:      [],
    isFetching: true
}

export default function groupsReducer(state = initState, action) {

    switch (action.type) {

        case types.REQUEST_GET_GROUPS:
            return {
                items: [],
                isFetching: true
            };

        case types.RECEIVE_GET_GROUPS_SUCCESS:
            return {
                items: action.groups,
                isFetching: false
            };

        case types.RECEIVE_GET_GROUPS_ERROR:
            return {
                items: [],
                isFetching: false,
                message: action.message
            };

        case types.ADD_GROUP:
            return {
                    items: [
                        ...state.items,
                        {
                            id: action.payload.id,
                            name: action.payload.name,
                        }
                    ],
                    isFetching: false
                };

        case types.UPDATE_GROUP:
            return {
                items: [
                    ...state.items.map(el => (el.id === action.payload.id ? {
                        id: action.payload.id,
                        name: action.payload.name,
                    } : el))
                ],
                isFetching: false
            };

        case types.REMOVE_GROUP:
            return {
                items: [
                    ...state.items.filter(el => parseInt(el.id) !== parseInt(action.payload.id))
                ],
                isFetching: false
            };
    
        default:
            return state;
    }
    
}