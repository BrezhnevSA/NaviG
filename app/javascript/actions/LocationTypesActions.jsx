import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios'; 
// LocationTypes Actions

export const getLocationTypes = () => {                                   
    return (dispatch) => {
      return axios.get(`${config.baseUrl}/location_types`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.GET_LOCATION_TYPES, locationTypes: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const updateLocationType = (locationType) => {                                   
    return (dispatch) => {
      return axios.put(`${config.baseUrl}/location_types/${locationType.id}`, { location_type: JSON.stringify(locationType) }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.UPDATE_LOCATION_TYPE, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const removeLocationType = (id) => {                                   
    return (dispatch) => {
      return axios.delete(`${config.baseUrl}/location_types/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.REMOVE_LOCATION_TYPE, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const addLocationType = (locationType) => {                                   
    return (dispatch) => {
      return axios.post(`${config.baseUrl}/location_types`, { location_type: JSON.stringify(locationType) }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.ADD_LOCATION_TYPE, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};