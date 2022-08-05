import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios'; 

export const getSDManagers_costcenters = () => {                                   
    return (dispatch) => {
      dispatch({ type: types.REQUEST_GET_SDMANAGERS_COSTCENTERS }) 
      return axios.get(`${config.baseUrl}/sdmanagers_costcenters`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.RECEIVE_GET_SDMANAGERS_COSTCENTERS_SUCCESS, sdmanagers_costcenters: response.data })  
        })
        .catch(error => {
          dispatch({ 
            type: types.RECEIVE_GET_SDMANAGERS_COSTCENTERS_ERROR,
            message: error.response.message
          })  
          throw(error); 
        });
    };
};

export const removeSDManagers_costcenter = (id, employee_id) => {                                   
    return (dispatch) => {
      return axios.delete(`${config.baseUrl}/sdmanagers_costcenters/${id}?employee_id=${employee_id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.REMOVE_SDMANAGERS_COSTCENTER, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const removeAllCostcenters = (id, employee_id) => {                                   
  return (dispatch) => {
    dispatch({ type: types.REQUEST_REMOVE_ALL_COSTCENTERS }) 
    return axios.delete(`${config.baseUrl}/sdmanagers_costcenters/${id}?employee_id=${employee_id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.RECEIVE_REMOVE_ALL_COSTCENTERS_SUCCESS, payload: response.data })  
      })
      .catch(error => { 
        dispatch({ 
          type: types.RECEIVE_REMOVE_ALL_COSTCENTERS_ERROR,
          message: error.response.message
        }) 
        throw(error); 
      });
  };
};

export const addSDManagers_costcenter = (costcenter_num, employee_id) => {  
    return (dispatch) => {
      return axios.post(
        `${config.baseUrl}/sdmanagers_costcenters`, { costcenter_num: costcenter_num, employee_id: employee_id }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.ADD_SDMANAGERS_COSTCENTER, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const addAllCostcenters = (employee_id) => {  
  return (dispatch) => {
    dispatch({ type: types.REQUEST_ADD_ALL_COSTCENTERS }) 
    return axios.post(
      `${config.baseUrl}/sdmanagers_costcenters?all=true`, { costcenter_num: -1, employee_id: employee_id }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.RECEIVE_ADD_ALL_COSTCENTERS_SUCCESS, payload: response.data })  
      })
      .catch(error => { 
        dispatch({ 
          type: types.RECEIVE_ADD_ALL_COSTCENTERS_ERROR,
          message: error.response.message
        }) 
        throw(error); 
      });
  };
};