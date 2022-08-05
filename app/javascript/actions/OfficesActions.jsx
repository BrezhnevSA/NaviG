import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios';    
// Office Actions

export const getOffices = () => {                                   
    return (dispatch) => {
      return axios.get(`${config.baseUrl}/offices`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.GET_OFFICES, offices: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const updateOffice = (office) => {                                   
    return (dispatch) => {
      return axios.put(`${config.baseUrl}/offices/${office.id}`, { office: office }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.UPDATE_OFFICE, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const removeOffice = (id) => {                                   
    return (dispatch) => {
      return axios.delete(`${config.baseUrl}/offices/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.REMOVE_OFFICE, payload: id })  
        })
        .catch(error => { throw(error); });
    };
};

export const addOffice = (office) => {                                   
    return (dispatch) => {
      return axios.post(`${config.baseUrl}/offices`, { office: office }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.ADD_OFFICE, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};