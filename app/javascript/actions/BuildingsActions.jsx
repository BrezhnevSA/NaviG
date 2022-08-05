import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios';

export const getBuildings = () => {                                   
    return (dispatch) => {
      return axios.get(`${config.baseUrl}/buildings`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.GET_BUILDINGS, buildings: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const updateBuilding = (building) => {                                   
    return (dispatch) => {
      return axios.put(`${config.baseUrl}/buildings/${building.id}`, { building: building }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.UPDATE_BUILDING, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const removeBuilding = (id) => {                                   
    return (dispatch) => {
      return axios.delete(`${config.baseUrl}/buildings/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.REMOVE_BUILDING, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const addBuilding = (building) => {                                   
    return (dispatch) => {
      return axios.post(`${config.baseUrl}/buildings`, { building: building }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.ADD_BUILDING, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};