import * as types from '../constants/ActionTypes';

const initState = {
    isFetching: true,
    items: []
};

export default function groupRightsReducer(state = initState, action) {

    switch (action.type) {

        case types.REQUEST_GET_GROUPRIGHTS:
            return {
                isFetching: true,
                items:      []
            };

        case types.RECEIVE_GET_GROUPRIGHTS_SUCCESS:
            return {
                isFetching: false,
                items:      action.groupRights
            };
   
        case types.RECEIVE_GET_GROUPRIGHTS_ERROR:
            return {
                isFetching: false,
                message:    action.message,
                items:      []
            };

        case types.ADD_GROUPRIGHT:
            return {
                    isFetching: false,
                    items: [
                        ...state.items,
                        action.payload
                    ]
            }

        case types.ADD_GROUPRIGHTS:
            return {
                    isFetching: false,
                    items: [
                        ...state.items,
                        ...action.payload
                    ]
            }

        case types.UPDATE_GROUPRIGHT:
            return {
                items: [
                    ...state.items.map(el => (el.id === action.payload.id ? {
                        id:       action.payload.id,
                        group_id: action.payload.group_id,
                        right_id: action.payload.right_id,
                    } : el))
                ],
                isFetching: false
            };

        case types.REMOVE_GROUPRIGHT:
            return {
                items: [
                ...state.items.filter(el => parseInt(el.id) !== parseInt(action.payload.id))
                ],
                isFetching: false
            };

        case types.REMOVE_GROUPRIGHTS:
            return {
                items: [
                ...state.items.filter(el => action.payload.ids.find(e => parseInt(el.id) === parseInt(e)) === undefined)
                ],
                isFetching: false
            };
    
        default:
            return state;
    }
    
}