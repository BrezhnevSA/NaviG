import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios'; 
// Contracts Actions

export const getContracts = () => {                         
    return (dispatch) => {
      return axios.get(`${config.baseUrl}/get_contracts`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.REQUEST_GET_CONTRACTS, contracts: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const getContract = (id) => {                         
    return (dispatch) => {
      return axios.get(`${config.baseUrl}/contracts/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.REQUEST_GET_CONTRACT, contract: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const getPageOfContracts = (page, sizePerPage, filters, sortField, sortOrder) => {
  return (dispatch) => {
    dispatch({ type: types.REQUEST_GET_CONTRACTS }) 
    return axios.post(
      `${config.baseUrl}/get_contracts`,
      { 
        per_page: sizePerPage,
        page: page,
        filters: filters,
        sorting: {field: sortField, order: sortOrder}
      }, { 
        headers: { Authorization: localStorage.getItem('auth_token') } 
      })                               
      .then(response => {
        dispatch({ type: types.RECEIVE_GET_CONTRACTS_SUCCESS, contracts: response.data })  
      })
      .catch(error => {
        dispatch({ 
          type: types.RECEIVE_GET_CONTRACTS_ERROR,
          message: error.response.message
        })  
        throw(error); 
      });
  };
}

export const updateContract = (contract) => {                                   
    return (dispatch) => {
      return axios.put(`${config.baseUrl}/contracts/${contract.contract.id}`, { contract: contract.contract, locations: contract.locations }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.UPDATE_CONTRACT, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const deleteContract = (id, mv_ids) => {   
    return (dispatch) => {
      return axios.delete(`${config.baseUrl}/contracts/${id}`, { data:{ mv_ids }, headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.DELETE_CONTRACT, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const addContract = (contract) => {                                   
    return (dispatch) => {
      return axios.post(`${config.baseUrl}/contracts`, { contract: contract }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.ADD_CONTRACT, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};