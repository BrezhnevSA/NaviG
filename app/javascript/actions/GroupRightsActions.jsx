import * as types  from '../constants/ActionTypes';
import * as config from '../config/config';

import axios from 'axios'; 

export const getGroupRights = () => {                                   
    return (dispatch) => {
      dispatch({ type: types.REQUEST_GET_GROUPRIGHTS }) 
      return axios.get(`${config.baseUrl}/groups_rights`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.RECEIVE_GET_GROUPRIGHTS_SUCCESS, groupRights: response.data })  
        })
        .catch(error => {
          dispatch({ 
            type: types.RECEIVE_GET_GROUPRIGHTS_ERROR,
            message: error.response.message
          })  
          throw(error); 
        });
    };
};

export const updateGroupRight = (groupRight) => {                                   
    return (dispatch) => {
      return axios.put(`${config.baseUrl}/groups_rights/${groupRight.id}`, { groupright: groupRight }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.UPDATE_GROUPRIGHT, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const removeGroupRight = (id) => {                                   
    return (dispatch) => {
      return axios.delete(`${config.baseUrl}/groups_rights/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.REMOVE_GROUPRIGHT, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const addGroupRight = (groupRight) => {                                   
    return (dispatch) => {
      return axios.post(`${config.baseUrl}/groups_rights`, { groupright: groupRight }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.ADD_GROUPRIGHT, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const removeGroupRights = (ids) => {                                   
  return (dispatch) => {
    return axios.delete(`${config.baseUrl}/groups_rights_multiple`, { data: { ids }, headers: { Authorization: localStorage.getItem('auth_token') } })                               
       .then(response => {
        dispatch({ type: types.REMOVE_GROUPRIGHTS, payload: response.data })  
      })
      .catch(error => { throw(error); });
  };
};

export const addGroupRights = (groupRights) => {                                   
  return (dispatch) => {
    return axios.post(`${config.baseUrl}/groups_rights_multiple`, { grouprights: groupRights }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.ADD_GROUPRIGHTS, payload: response.data })  
      })
      .catch(error => { throw(error); });
  };
};