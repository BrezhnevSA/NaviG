import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios'; 
import moment from 'moment';

export const getAvailableDates = () => {
  return (dispatch) => {
    dispatch({ type: types.REQUEST_GET_AVAILABLE_DATES_FOR_PARKING }) 
    return axios.get(
      `${config.baseUrl}/available_dates_for_parking`, { 
        headers: { Authorization: localStorage.getItem('auth_token') } 
      })                               
      .then(response => {
        dispatch({ type: types.RECEIVE_GET_AVAILABLE_DATES_FOR_PARKING_SUCCESS, dates: response.data })  
      })
      .catch(error => {
        dispatch({ 
          type: types.RECEIVE_GET_AVAILABLE_DATES_FOR_PARKING_ERROR,
          message: error.response.message
        })  
        throw(error); 
      });
  };
}

export const removeAvailableDates = (id) => {                                   
    return (dispatch) => {
      return axios.delete(`${config.baseUrl}/available_dates_for_parking/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.REMOVE_AVAILABLE_DATES_FOR_PARKING, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const addAvailableDates = (dates, object_item_id) => {  
    return (dispatch) => {
      dispatch({ type: types.REQUEST_ADD_AVAILABLE_DATES_FOR_PARKING }) 
      return axios.post(
        `${config.baseUrl}/available_dates_for_parking`, 
        { 
          date_start:     moment(dates.date_start).format("YYYY-MM-DD"), 
          date_end:       moment(dates.date_end).format("YYYY-MM-DD"), 
          object_item_id: object_item_id, 
        }, { 
          headers: { Authorization: localStorage.getItem('auth_token') } 
        })                               
        .then(response => {
          dispatch({ type: types.RECEIVE_ADD_AVAILABLE_DATES_FOR_PARKING_SUCCESS, payload: response.data })  
        })
        .catch(error => { 
          dispatch({ 
            type: types.RECEIVE_ADD_AVAILABLE_DATES_FOR_PARKING_ERROR,
            message: error.response.data.message
          })  
          throw(error); 
        });
    };
};

export const updateAvailableDates = (dates) => {                                   
    return (dispatch) => {
      dispatch({ type: types.REQUEST_UPDATE_AVAILABLE_DATES_FOR_PARKING }) 
      return axios.put(`${config.baseUrl}/available_dates_for_parking/${dates.id}`, { dates: dates }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.RECEIVE_UPDATE_AVAILABLE_DATES_FOR_PARKING_SUCCESS, payload: response.data })  
        })
        .catch(error => { 
          dispatch({ 
            type: types.RECEIVE_UPDATE_AVAILABLE_DATES_FOR_PARKING_ERROR,
            message: error.response.data.message
          })  
          throw(error); 
        });
    };
};
