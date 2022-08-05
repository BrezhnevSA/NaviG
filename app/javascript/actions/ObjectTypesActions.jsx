import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios';  
// ObjectTypes Actions

export const getObjectTypes = () => {                                   
    return (dispatch) => {
      return axios.get(`${config.baseUrl}/object_types`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.GET_OBJECT_TYPES, object_types: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const updateObjectType = (objectType) => {                                   
    return (dispatch) => {
      
      return axios.put(`${config.baseUrl}/object_types/${objectType.id}`, { object_type: objectType }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.UPDATE_OBJECT_TYPE, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const removeObjectType = (id) => {                                   
    return (dispatch) => {
      return axios.delete(`${config.baseUrl}/object_types/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.REMOVE_OBJECT_TYPE, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const addObjectType = (objectType) => {                                   
    return (dispatch) => {
      return axios.post(`${config.baseUrl}/object_types`, { object_type: objectType }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.ADD_OBJECT_TYPE, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};