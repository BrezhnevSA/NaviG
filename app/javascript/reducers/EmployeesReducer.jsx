import * as types from '../constants/ActionTypes';

const initState = []

export default function employeesReducer(state = initState, action) {

    switch (action.type) {

        case types.REQUEST_GET_ALL_EMPLOYEES:
            return {
                isFetching: true,
                items:      state.items,
            }

        case types.RECEIVE_GET_ALL_EMPLOYEES_SUCCESS:
            return {
                isFetching: false,
                items:      action.employees,
                count:      action.count,
            };

        case types.RECEIVE_GET_ALL_EMPLOYEES_ERROR:
            return {
                isFetching: false,
                message:    action.message,
                items:      []
            };
    
        default:
            return state;
    }
    
}