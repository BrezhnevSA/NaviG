import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios'; 
// Locations Actions

export const getLocations = (page = null, per_page = null, type_id = null, sortField = null, sortOrder = null, meta_sort = null, filters = null, no_meta = false) => {    
    return (dispatch) => {
      dispatch({ type: types.REQUEST_GET_LOCATIONS }) 
      return axios.get(`${config.baseUrl}/locations?page=${page ? page : ''}&per_page=${per_page ? per_page : ''}&type_id=${type_id ? type_id : ''}&sort_field=${sortField ? sortField : ''}&sort_order=${sortOrder ? sortOrder : ''}&meta_sort=${meta_sort ? meta_sort : ''}&filters=${JSON.stringify(filters ? filters : [])}&no_meta=${no_meta}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                                       .then(response => {
          dispatch({ type: types.RECEIVE_GET_LOCATIONS_SUCCEESS, locations: response.data });
        })
        .catch(error => { 
          dispatch({ 
            type: types.RECEIVE_GET_LOCATIONS_ERROR,
            message: error.response.message
          })
          throw(error); 
        });
    };
};

export const updateLocations = (location) => {                 
    return (dispatch) => {
      return axios.put(`${config.baseUrl}/locations/${location.id}`, { location: location }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.UPDATE_LOCATION_DETAILS, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const createLocations = (location) => {                                   
  return (dispatch) => {
    return axios.post(`${config.baseUrl}/locations`, { location: location }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.CREATE_LOCATION_DETAILS, payload: response.data })  
      })
      .catch(error => { throw(error); });
  };
};

export const getLocationsNotInContract = (page, sizePerPage, contract_id, office_id = null) => {
  return (dispatch) => {
    dispatch({ type: types.REQUEST_GET_LOCATIONS_NOT_IN_CONTRACT }) 
    return axios.post(
      `${config.baseUrl}/locations/not_in_contract`,
      { 
        per_page: sizePerPage,
        page: page,
        contract_id: contract_id,
        office_id: office_id
      }, { 
        headers: { Authorization: localStorage.getItem('auth_token') } 
      })                               
      .then(response => {
        dispatch({ type: types.RECEIVE_GET_LOCATIONS_NOT_IN_CONTRACT_SUCCEESS, locationsNotInContract: response.data })  
      })
      .catch(error => {
        dispatch({ 
          type: types.RECEIVE_GET_LOCATIONS_NOT_IN_CONTRACT_ERROR,
          message: error.response.message
        })  
        throw(error); 
      });
  };
}