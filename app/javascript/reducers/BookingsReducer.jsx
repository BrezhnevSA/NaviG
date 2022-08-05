import * as types from '../constants/ActionTypes';

const initState = []

export default function bookingsReducer(state = initState, action) {

    switch (action.type) {

        case types.REQUEST_GET_PAGE_OF_BOOKINGS: 
            return {
                isFetching: true,
                isFetchingAdd: state.isFetchingAdd,
                isFetchingUpdate: state.isFetchingUpdate,
                isFetching_for_place: state.isFetching_for_place,
                items: state.items,
                items_for_place: state.items_for_place,
                can_book: state.can_book,
                count: state.count
            };

        case types.RECEIVE_GET_PAGE_OF_BOOKINGS_SUCCESS:
            return {
                isFetching: false,
                isFetchingAdd: false,
                isFetchingUpdate: state.isFetchingUpdate,
                isFetching_for_place: state.isFetching_for_place,
                items: action.bookings.bookings,
                items_for_place: state.items_for_place,
                can_book: state.can_book,
                count: action.bookings.count
            };

        case types.RECEIVE_GET_PAGE_OF_BOOKINGS_ERROR:
            return {
                isFetching: false,
                isFetchingAdd: state.isFetchingAdd,
                isFetchingUpdate: state.isFetchingUpdate,
                isFetching_for_place: state.isFetching_for_place,
                message: action.message,
                can_book: state.can_book,
                items: [],
                items_for_place: state.items_for_place,
                count: 0
            };

        case types.REQUEST_GET_PAGE_OF_BOOKINGS_FOR_PLACE: 
            return {
                isFetching: state.isFetching,
                isFetching_for_place: true,
                isFetchingAdd: state.isFetchingAdd,
                isFetchingUpdate: state.isFetchingUpdate,
                items_for_place: state.items_for_place,
                items: state.items,
                can_book: state.can_book,
                count: state.count
            };

        case types.RECEIVE_GET_PAGE_OF_BOOKINGS_FOR_PLACE_SUCCESS:
            return {
                isFetching: state.isFetching,
                isFetching_for_place: false,
                isFetchingAdd: state.isFetchingAdd,
                isFetchingUpdate: state.isFetchingUpdate,
                items_for_place: action.bookings.bookings,
                items: state.items,
                can_book: action.bookings.can_book,
                count: state.count
            };

        case types.RECEIVE_GET_PAGE_OF_BOOKINGS_FOR_PLACE_ERROR:
            return {
                isFetching: state.isFetching,
                isFetching_for_place: false,
                isFetchingAdd: state.isFetchingAdd,
                isFetchingUpdate: state.isFetchingUpdate,
                message: action.message,
                can_book: state.can_book,
                items_for_place: [],
                items: state.items,
                count: 0
            };

        case types.REMOVE_BOOKING:
            return {
                items: [
                    ...state.items.filter(el => parseInt(el.id) !== parseInt(action.payload.id))
                ],
                isFetching:    state.isFetching,
                isFetchingAdd: state.isFetchingAdd,
                isFetchingUpdate: state.isFetchingUpdate,
                isFetching_for_place: state.isFetching_for_place,
                can_book:      state.can_book
            }

        case types.REQUEST_ADD_BOOKING:
            return {
                isFetching:    state.isFetching,
                isFetchingAdd: true,
                isFetchingUpdate: state.isFetchingUpdate,
                isFetching_for_place: state.isFetching_for_place,
                items:         state.items,
                items_for_place: state.items_for_place,
                can_book:      state.can_book
            }

        case types.RECEIVE_ADD_BOOKING_SUCCESS:
            let bookings = state.items;
            let bookings_for_place = state.items_for_place;

            const booking = state.items.find(e => e.id === action.payload.id);
            if (booking === undefined) {
                bookings.push(action.payload);
            }
            const booking_for_place = state.items_for_place.find(e => e.id === action.payload.id);
            if (booking_for_place === undefined) {
                bookings_for_place.push(action.payload);
            }
            return {
                isFetching: state.isFetching,
                isFetchingAdd: state.isFetching,
                isFetchingUpdate: state.isFetchingUpdate,
                isFetching_for_place: state.isFetching_for_place,
                items: bookings,
                items_for_place: bookings_for_place,
                can_book: state.can_book
            }

        case types.RECEIVE_ADD_BOOKING_ERROR:
            return {
                isFetching: state.isFetching,
                isFetchingAdd: false,
                isFetchingUpdate: state.isFetchingUpdate,
                isFetching_for_place: state.isFetching_for_place,
                error: true,
                msg: action.message,
                items: state.items,
                items_for_place: state.items_for_place,
                can_book: state.can_book
            }

        case types.REQUEST_UPDATE_BOOKING:
            return {
                isFetching:    state.isFetching,
                isFetchingAdd: state.isFetchingAdd,
                isFetchingUpdate: true,
                isFetching_for_place: state.isFetching_for_place,
                items:         state.items,
                items_for_place: state.items_for_place,
                can_book:      state.can_book
            }

        case types.RECEIVE_UPDATE_BOOKING_SUCCESS:
            return {
                isFetching: state.isFetching,
                isFetchingAdd: state.isFetchingAdd,
                isFetchingUpdate: false,
                isFetching_for_place: state.isFetching_for_place,
                items: state.items.map(e => {
                    if (e.id === action.payload.id || e.id === action.payload.booking_id_prev) {
                        return action.payload;
                    }
                    return e;
                }),
                items_for_place: state.items_for_place,
                can_book: state.can_book
            }

        case types.RECEIVE_UPDATE_BOOKING_ERROR:
            return {
                isFetching: state.isFetching,
                isFetchingAdd: state.isFetchingAdd,
                isFetchingUpdate: false,
                isFetching_for_place: state.isFetching_for_place,
                error: true,
                msg: action.message,
                items: state.items,
                items_for_place: state.items_for_place,
                can_book: state.can_book
            }
    
        default:
            return state;
    }
    
}
