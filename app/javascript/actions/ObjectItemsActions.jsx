import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios'; 
// ObjectItems Actions

export const getObjectItems = (page = null, per_page = null, type_id = null, sortField = null, sortOrder = null, meta_sort = null, filters = null) => {    
  return (dispatch) => { 
    dispatch({ type: types.REQUEST_GET_OBJECT_ITEMS })                    
      return axios.get(`${config.baseUrl}/object_items?page=${page ? page : ''}&per_page=${per_page ? per_page : ''}&type_id=${type_id ? type_id : ''}&sort_field=${sortField ? sortField : ''}&sort_order=${sortOrder ? sortOrder : ''}&meta_sort=${meta_sort ? meta_sort : ''}&filters=${JSON.stringify(filters ? filters : [])}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.RECEIVE_GET_OBJECT_ITEMS_SUCCEESS, object_items: response.data });
        })
        .catch(error => { 
          dispatch({ 
            type: types.RECEIVE_GET_OBJECT_ITEMS_ERROR,
            message: error.response.message
          })
          throw(error); 
        });
    };
};

export const updateObjectItem = (object_item) => {                                   
    return (dispatch) => {
      if (!!!object_item['details_page']) object_item['details_page'] = false
      return axios.put(`${config.baseUrl}/object_items/${object_item.id}`, { object_item: JSON.stringify(object_item) }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.UPDATE_OBJECT_DETAILS, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const removeObjectItem = (id) => {                                   
  return (dispatch) => {
    return axios.delete(`${config.baseUrl}/object_items/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                          
      .then(response => {
        dispatch({ type: types.REMOVE_OBJECT_ITEM, payload: id })  
      })
      .catch(error => { throw(error); });
  };
};