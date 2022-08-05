import * as types  from '../constants/ActionTypes';
import * as config from '../config/config';

import axios from 'axios'; 

export const getGroups = () => {                                   
    return (dispatch) => {
      dispatch({ type: types.REQUEST_GET_GROUPS }) 
      return axios.get(`${config.baseUrl}/groups`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.RECEIVE_GET_GROUPS_SUCCESS, groups: response.data })  
        })
        .catch(error => { 
          dispatch({ 
            type:    types.RECEIVE_GET_GROUPS_ERROR, 
            message: error.response.message 
          }) 
          throw(error); 
        });
    };
};

export const updateGroup = (group, ids, rolable_type) => {                                   
    return (dispatch) => {
      return axios.put(`${config.baseUrl}/groups/${group.id}`, { group: group, ids: ids, rolable_type: rolable_type }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.UPDATE_GROUP, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const removeGroup = (id) => {                                   
    return (dispatch) => {
      return axios.delete(`${config.baseUrl}/groups/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.REMOVE_GROUP, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const addGroup = (group, ids, rolable_type) => {                                   
    return (dispatch) => {
      return axios.post(`${config.baseUrl}/groups`, { group: group, ids: ids, rolable_type: rolable_type }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.ADD_GROUP, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};