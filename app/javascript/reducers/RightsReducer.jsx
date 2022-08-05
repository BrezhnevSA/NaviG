import * as types from '../constants/ActionTypes';

const initState = []

export default function rightsReducer(state = initState, action) {

    switch (action.type) {

        case types.GET_RIGHTS:
            return action.rights;
   
        default:
            return state;
    }
    
}