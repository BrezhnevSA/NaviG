import * as types from '../constants/ActionTypes';

const initState = {
    isFetching: false,
    isFetchingAdd: false,
    isFetchingUpdate: false,
    items: [],
}

export default function availableDatesForParkingReducer(state = initState, action) {

    switch (action.type) {

        case types.REQUEST_GET_AVAILABLE_DATES_FOR_PARKING: 
            return {
                isFetching: true,
                isFetchingAdd: state.isFetchingAdd,
                isFetchingUpdate: state.isFetchingUpdate,
                items: state.items,
            };

        case types.RECEIVE_GET_AVAILABLE_DATES_FOR_PARKING_SUCCESS:
            return {
                isFetching: false,
                isFetchingAdd: false,
                isFetchingUpdate: state.isFetchingUpdate,
                items: action.dates.dates,
            };

        case types.RECEIVE_GET_AVAILABLE_DATES_FOR_PARKING_ERROR:
            return {
                isFetching: false,
                isFetchingAdd: state.isFetchingAdd,
                isFetchingUpdate: state.isFetchingUpdate,
                message: action.message,
                items: [],
            };

        case types.REMOVE_AVAILABLE_DATES_FOR_PARKING:
            return {
                items: [
                    ...state.items.filter(el => parseInt(el.id) !== parseInt(action.payload.id))
                ],
                isFetching:    state.isFetching,
                isFetchingAdd: state.isFetchingAdd,
                isFetchingUpdate: state.isFetchingUpdate,
            }

        case types.REQUEST_ADD_AVAILABLE_DATES_FOR_PARKING:
            return {
                isFetching:    state.isFetching,
                isFetchingAdd: true,
                isFetchingUpdate: state.isFetchingUpdate,
                items:         state.items,
            }

        case types.RECEIVE_ADD_AVAILABLE_DATES_FOR_PARKING_SUCCESS:
            return {
                isFetching: state.isFetching,
                isFetchingAdd: state.isFetching,
                isFetchingUpdate: state.isFetchingUpdate,
                items: [...state.items, action.payload],
            }

        case types.RECEIVE_ADD_AVAILABLE_DATES_FOR_PARKING_ERROR:
            return {
                isFetching: state.isFetching,
                isFetchingAdd: false,
                isFetchingUpdate: state.isFetchingUpdate,
                error: true,
                msg: action.message,
                items: state.items,
            }

        case types.REQUEST_UPDATE_AVAILABLE_DATES_FOR_PARKING:
            return {
                isFetching:       state.isFetching,
                isFetchingAdd:    state.isFetchingAdd,
                isFetchingUpdate: true,
                items:            state.items,
            }

        case types.RECEIVE_UPDATE_AVAILABLE_DATES_FOR_PARKING_SUCCESS:
            return {
                isFetching: state.isFetching,
                isFetchingAdd: state.isFetchingAdd,
                isFetchingUpdate: false,
                items: state.items.map(e => {
                    if (e.id === action.payload.id) {
                        return action.payload;
                    }
                    return e;
                }),
            }

        case types.RECEIVE_UPDATE_AVAILABLE_DATES_FOR_PARKING_ERROR:
            return {
                isFetching: state.isFetching,
                isFetchingAdd: state.isFetchingAdd,
                isFetchingUpdate: false,
                error: true,
                msg: action.message,
                items: state.items,
            }
    
        default:
            return state;
    }
    
}
