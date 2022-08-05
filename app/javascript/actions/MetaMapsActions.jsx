import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios'; 
// MetaMaps Actions

let header = {
  Authorization: localStorage.getItem('auth_token')
}

export const getMetaMaps = () => {                                   
    return (dispatch) => {
      return axios.get(`${config.baseUrl}/meta_maps`, { headers: header })                               
        .then(response => {
          dispatch({ type: types.GET_META_MAPS, metaMaps: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const updateMetaMap = (MetaMap) => {                                   
    return (dispatch) => {
      return axios.put(`${config.baseUrl}/meta_maps/${MetaMap.id}`, { meta_map: MetaMap }, { headers: header })                               
        .then(response => {
          dispatch({ type: types.UPDATE_META_MAP, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const removeMetaMap = (id) => {                                   
    return (dispatch) => {
      return axios.delete(`${config.baseUrl}/meta_maps/${id}`, { headers: header })                               
        .then(response => {
          dispatch({ type: types.REMOVE_META_MAP, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const addMetaMap = (MetaMap) => {                                   
    return (dispatch) => {
      return axios.post(`${config.baseUrl}/meta_maps`, { meta_map: MetaMap }, { headers: header })                               
        .then(response => {
          dispatch({ type: types.ADD_META_MAP, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};