import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios'; 
// MetaFields Actions

let header = {
  Authorization: localStorage.getItem('auth_token')
}

export const getMetaFields = () => {                                   
    return (dispatch) => {
      return axios.get(`${config.baseUrl}/meta_fields`, { headers: header })                               
        .then(response => {
          dispatch({ type: types.GET_META_FIELDS, MetaFields: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const updateMetaField = (MetaField) => {                                   
    return (dispatch) => {
      return axios.put(`${config.baseUrl}/meta_fields/${MetaField.id}`, { meta_field: MetaField }, { headers: header })                               
        .then(response => {
          dispatch({ type: types.UPDATE_META_FIELD, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const removeMetaField = (id) => {                                   
    return (dispatch) => {
      return axios.delete(`${config.baseUrl}/meta_fields/${id}`, { headers: header })                               
        .then(response => {
          dispatch({ type: types.REMOVE_META_FIELD, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const addMetaField = (MetaField) => {                                   
    return (dispatch) => {
      return axios.post(`${config.baseUrl}/meta_fields`, { meta_field: MetaField }, { headers: header })                               
        .then(response => {
          dispatch({ type: types.ADD_META_FIELD, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};