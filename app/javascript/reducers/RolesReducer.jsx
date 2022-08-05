import * as types from '../constants/ActionTypes';

const initState = []

export default function rolesReducer(state = initState, action) {

    switch (action.type) {

        case types.REMOVE_ROLE:
            return [
                ...state.filter(el => parseInt(el.id) !== parseInt(action.payload.id))
            ]
    
        default:
            return state;
    }
    
}