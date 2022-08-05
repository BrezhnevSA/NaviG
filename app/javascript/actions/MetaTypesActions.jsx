import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios'; 
// MetaTypes Actions

let header = {
  Authorization: localStorage.getItem('auth_token')
}

export const getMetaTypes = () => {                                   
    return (dispatch) => {
      return axios.get(`${config.baseUrl}/meta_types`, { headers: header })                               
        .then(response => {
          dispatch({ type: types.GET_META_TYPES, metaTypes: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const updateMetaType = (metaType) => {                                   
    return (dispatch) => {
      return axios.put(`${config.baseUrl}/meta_types/${metaType.id}`, { meta_type: metaType }, { headers: header })                               
        .then(response => {
          dispatch({ type: types.UPDATE_META_TYPE, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const removeMetaType = (id) => {                                   
    return (dispatch) => {
      return axios.delete(`${config.baseUrl}/meta_types/${id}`, { headers: header })                               
        .then(response => {
          dispatch({ type: types.REMOVE_META_TYPE, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const addMetaType = (metaType) => {                                   
    return (dispatch) => {
      return axios.post(`${config.baseUrl}/meta_types`, { meta_type: metaType }, { headers: header })                               
        .then(response => {
          dispatch({ type: types.ADD_META_TYPE, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};