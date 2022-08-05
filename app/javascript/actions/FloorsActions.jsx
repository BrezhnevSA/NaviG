import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios'; 
// Floors Actions

export const getFloors = () => {
    return (dispatch) => {
      return axios.get(`${config.baseUrl}/floors`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.GET_FLOORS, floors: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const updateFloor = (floor) => {
    return (dispatch) => {
      return axios.put(`${config.baseUrl}/floors/${floor.id}`, { floor: JSON.stringify(floor) }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.UPDATE_FLOOR, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const removeFloor = (id) => {
    return (dispatch) => {
      return axios.delete(`${config.baseUrl}/floors/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.REMOVE_FLOOR, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const addFloor = (floor) => {
    return (dispatch) => {
      return axios.post(`${config.baseUrl}/floors`, { floor: JSON.stringify(floor) }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.ADD_FLOOR, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};