import * as types from '../constants/ActionTypes';

const user = JSON.parse(localStorage.getItem('user'));

export default function loginReducer(state = { isFetching : true }, action) {

    switch (action.type) {
        
        case types.LOGIN_FAILURE:
            return {
                loggingIn: false,
                user: [],
                error: action.error,
                isFetching : false
            };

        case types.REQUEST_LOGIN:
            return {
                loggingIn: false,
                user: [],
                isFetching : true
            };

        case types.LOGIN:
            return {
                loggingIn: true,
                user: action.result,
                isFetching : false
            };

        case types.LOGOUT:
            return {
                loggingIn: false,
                user: null
            };

        case types.REQUEST_GET_USER_BY_TOKEN:
            return {
                loggingIn: state.loggingIn,
                user: state.user,
                isFetching: true
            };

        case types.GET_USER_BY_TOKEN_SUCCESS:
            return {
                loggingIn: action.result.auth_token && action.result.data && action.result.rights ? true: false,
                user: action.result,
                isFetching: false
            };

        case types.GET_USER_BY_TOKEN_FAILURE:
            return {
                ...state,
                error: action.error,
                loggingIn: false,
                isFetching: false
            };

        default:
            return state
    }
}