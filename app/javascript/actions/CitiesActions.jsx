import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios'; 
// Cities Actions

export const getCities = () => {                         
    return (dispatch) => {
      return axios.get(`${config.baseUrl}/cities`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.GET_CITIES, cities: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const updateCity = (city) => {                                   
    return (dispatch) => {
      return axios.put(`${config.baseUrl}/cities/${city.id}`, { city: city }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.UPDATE_CITY, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const removeCity = (id) => {                                   
    return (dispatch) => {
      return axios.delete(`${config.baseUrl}/cities/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.REMOVE_CITY, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const addCity = (city) => {                                   
    return (dispatch) => {
      return axios.post(`${config.baseUrl}/cities`, { city: city }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.ADD_CITY, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};