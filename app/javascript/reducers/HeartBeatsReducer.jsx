import * as types from '../constants/ActionTypes';

const initialState = []

 export default function heartbeatsReducer(state = initialState, action) {

    switch (action.type) {

        case types.REQUEST_GET_HEARTBEATS:
            return {
                items:      state.items,
                isFetching: true,
                count: state.count
            };

        case types.RECEIVE_GET_HEARTBEATS_SUCCESS:
            return {
                items:      action.heartbeats,
                count:      action.count,
                isFetching: false
            };

        case types.RECEIVE_GET_HEARTBEATS_ERROR:
            return {
                items:      [],
                message:    action.message,
                isFetching: false,
                count:      0
            };

        default:
            return state;
    }
    
}