import * as types  from '../constants/ActionTypes';
import * as config from '../config/config';

import axios from 'axios'; 

export const getRights = () => {                                   
    return (dispatch) => {
      return axios.get(`${config.baseUrl}/rights`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.GET_RIGHTS, rights: response.data })  
        })
        .catch(error => { throw(error); });
    };
};