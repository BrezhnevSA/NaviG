import * as types from '../constants/ActionTypes';

const initState = []

export default function attributesReducer(state = initState, action) {

    switch (action.type) {

        case types.GET_ATTRIBUTES:

            return action.payload;
   
        case types.UPDATE_ATTRIBUTES:
            return action.payload;

        case types.UPDATE_CONTRACT_REFERENCE:
            if (action.payload.info && action.payload.info.length === 0) {
                return [];
            } else {
                return [
                    ...state.map(el => (el.metavalue === action.payload.metavalue ? {
                        metavalue: action.payload.metavalue,
                        info: action.payload.info
                    } : el))
                ];
            }

        case types.ADD_CONTRACT_REFERENCE:
            let contract_added = false;
            let contracts = state.map(el => {
                if (parseInt(el.metavalue) === parseInt(action.payload.metavalue)) {
                    contract_added = true;
                    return {
                        metavalue: action.payload.metavalue,
                        info: [ ...el.info, ...action.payload.info ]
                    }
                } else {
                    return el;
                }                
            });
            if (!contract_added) {
                contracts.push({
                    metavalue: action.payload.metavalue,
                    info: action.payload.info
                })
            }
            return contracts

        case types.DELETE_CONTRACT_REFERENCE:
            return state.map(el => {
                if (parseInt(el.metavalue) === parseInt(action.payload.mv)) {
                    el.info = el.info.filter(i => parseInt(i.metavalueid) !== parseInt(action.payload.id))
                };
                return el;
            });

        default:
            return state;
    }
    
}
