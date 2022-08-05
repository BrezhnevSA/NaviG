import * as types from '../constants/ActionTypes';

const initState = {
    items: [],
    count: 0
}

export default function contractsReducer(state = initState, action) {

    switch (action.type) {

        case types.REQUEST_GET_CONTRACTS:
            return {
                isFetching: true,
                items: state.items,
                count: state.count
            };

        case types.RECEIVE_GET_CONTRACTS_SUCCESS:
            return {
                isFetching: false,
                items: action.contracts.contracts,
                count: action.contracts.count
            };
        
        case types.RECEIVE_GET_CONTRACTS_ERROR:
            return {
                isFetcing: false,
                message: actions.message,
                items: [],
                count: 0
            }

        case types.REQUEST_GET_CONTRACT:
            return {
                isFetching: state.isFetching,
                items: state.items,
                count: state.count,
                contract: action.contract
            };

        case types.ADD_CONTRACT:            
            return {                
                isFetching: state.isFetching,
                items: [
                    ...state.items,
                    {
                        name: action.payload.name,
                        office_id: action.payload.office_id,
                        price: action.payload.price,
                    }
                ],
                count: state.count + 1,
            }

        case types.UPDATE_CONTRACT:
            return {
                isFetching: state.isFetching,
                items: state.items.map(el => (el.id === action.payload.id ? {
                    id: action.payload.id,
                    name: action.payload.name,
                    office_id: action.payload.office_id,
                    price: action.payload.price,
                } : el)),
                count: state.count,                    
            }
            

        case types.DELETE_CONTRACT:
            return {
                isFetching: state.isFetching,
                items: state.items.filter(el => el.id !== parseInt(action.payload.id)),
                count: state.count - 1,
            }
    
        default:
            return state;
    }
    
}
