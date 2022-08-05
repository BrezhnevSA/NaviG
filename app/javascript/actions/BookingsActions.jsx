import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios'; 
import moment from 'moment';

export const getPageOfBookings = (page, sizePerPage, filters, sortField, sortOrder) => {
  return (dispatch) => {
    dispatch({ type: types.REQUEST_GET_PAGE_OF_BOOKINGS }) 
    return axios.post(
      `${config.baseUrl}/get_bookings`,
      { 
        per_page: sizePerPage,
        page: page,
        filters: filters,
        sorting: {field: sortField, order: sortOrder}
      }, { 
        headers: { Authorization: localStorage.getItem('auth_token') } 
      })                               
      .then(response => {
        dispatch({ type: types.RECEIVE_GET_PAGE_OF_BOOKINGS_SUCCESS, bookings: response.data })  
      })
      .catch(error => {
        dispatch({ 
          type: types.RECEIVE_GET_PAGE_OF_BOOKINGS_ERROR,
          message: error.response.message
        })  
        throw(error); 
      });
  };
}

export const getPageOfBookingsForPlace = (page, sizePerPage, filters, sortField, sortOrder, user_id, no_current_date = false) => {
  return (dispatch) => {
    dispatch({ type: types.REQUEST_GET_PAGE_OF_BOOKINGS_FOR_PLACE }) 
    return axios.post(
      `${config.baseUrl}/get_bookings`,
      { 
        per_page: sizePerPage,
        page: page,
        filters: filters,
        sorting: {field: sortField, order: sortOrder},
        user_id: user_id,
        no_current_date: no_current_date
      }, { 
        headers: { Authorization: localStorage.getItem('auth_token') } 
      })                               
      .then(response => {
        dispatch({ type: types.RECEIVE_GET_PAGE_OF_BOOKINGS_FOR_PLACE_SUCCESS, bookings: response.data })  
      })
      .catch(error => {
        dispatch({ 
          type: types.RECEIVE_GET_PAGE_OF_BOOKINGS_FOR_PLACE_ERROR,
          message: error.response.message
        })  
        throw(error); 
      });
  };
}

export const updateBooking = (booking_data) => {                                   
    return (dispatch) => {
      dispatch({ type: types.REQUEST_UPDATE_BOOKING }) 
      return axios.put(`${config.baseUrl}/bookings/${booking_data.id}`, { booking_data: booking_data }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.RECEIVE_UPDATE_BOOKING_SUCCESS, payload: response.data })  
        })
        .catch(error => { 
          dispatch({ 
            type: types.RECEIVE_UPDATE_BOOKING_ERROR,
            message: error.response.data.message
          })  
          throw(error); 
        });
    };
};

export const removeBooking = (id) => {                                   
    return (dispatch) => {
      return axios.delete(`${config.baseUrl}/bookings/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.REMOVE_BOOKING, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const addBooking = (book_from, book_to, employee, switchState, object_item) => {  
    return (dispatch) => {
      dispatch({ type: types.REQUEST_ADD_BOOKING }) 
      return axios.post(
        `${config.baseUrl}/bookings`, 
        { 
          book_from:   moment(book_from).format("YYYY-MM-DD"), 
          book_to:     moment(book_to).format("YYYY-MM-DD"), 
          employee:    employee, 
          switchState: switchState,
          object_item: object_item
        }, { 
          headers: { Authorization: localStorage.getItem('auth_token') } 
        })                               
        .then(response => {
          dispatch({ type: types.RECEIVE_ADD_BOOKING_SUCCESS, payload: response.data })  
        })
        .catch(error => { 
          dispatch({ 
            type: types.RECEIVE_ADD_BOOKING_ERROR,
            message: error.response.data.message
          })  
          throw(error); 
        });
    };
};