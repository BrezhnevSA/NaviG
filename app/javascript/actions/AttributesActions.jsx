import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios'; 
// Attributes Actions

let header = {
  Authorization: localStorage.getItem('auth_token')
}

export const getAttributes = (type, id, multi = '') => {                                   
    return (dispatch) => {
      return axios.get(`${config.baseUrl}/meta/${type}/${id}?multi=${multi}`, { headers: header })                               
        .then(response => {
          dispatch({ type: types.GET_ATTRIBUTES, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const updateAttributes = (type, id, data) => {                                   
    return (dispatch) => {
      return axios.post(`${config.baseUrl}/meta/${type}/${id}`, { data: JSON.stringify(data) }, { headers: header })                               
        .then(response => {
          dispatch({ type: types.UPDATE_ATTRIBUTES, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const updateContractReference = (contract) => {                                   
  return (dispatch) => {
    return axios.put(`${config.baseUrl}/meta/update_contract_reference`, contract, { headers: header })                               
      .then(response => {
        dispatch({ type: types.UPDATE_CONTRACT_REFERENCE, payload: response.data })  
      })
      .catch(error => { throw(error); });
  };
};

export const addContractReference = (contract, contract_num) => {                                   
  return (dispatch) => {
    return axios.post(`${config.baseUrl}/meta/add_contract_reference`, { contract: contract, contract_num: contract_num }, { headers: header })                               
      .then(response => {
        dispatch({ type: types.ADD_CONTRACT_REFERENCE, payload: response.data })  
      })
      .catch(error => { throw(error); });
  };
};

export const deleteContractReference = (contract_num, mv) => {                                   
  return (dispatch) => {
    return axios.delete(`${config.baseUrl}/meta/delete_contract_reference/${contract_num}`, { headers: header })                               
      .then(response => {
        dispatch({ type: types.DELETE_CONTRACT_REFERENCE, payload: {id: contract_num, mv: mv} })  
      })
      .catch(error => { throw(error); });
  };
};