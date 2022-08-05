import * as config from '../config/config';

import * as types from '../constants/ActionTypes';

import axios from 'axios'; 
// LocationTypes Actions

export const login = (login, password, emea2) => {
  return (dispatch) => {
    dispatch({ type: types.REQUEST_LOGIN })  
    axios.post(`${config.baseUrl}/login`, { login: login, password: password, emea2: emea2 })                               
      .then(response => {
        
        localStorage.setItem('current_user', JSON.stringify(response.data.data));
        localStorage.setItem('current_user_place', JSON.stringify(response.data.place));
        localStorage.setItem('auth_token', response.data.auth_token);
        localStorage.setItem('show_ok_info', true);
        dispatch({ type: types.LOGIN, result: response.data })  
      })
      .catch(error => { 
        dispatch({ type: types.LOGIN_FAILURE, error });

      });
  };

};

export const logout = () => {
  return (dispatch) => {

    localStorage.removeItem('current_user');
    localStorage.removeItem('current_user_place');
    localStorage.removeItem('auth_token');
    
    dispatch({ type: types.LOGOUT, result: null })
  };
};

export const getUserByToken = () => {
  return (dispatch) => {
    dispatch({ type: types.REQUEST_GET_USER_BY_TOKEN })  
    axios.get(`${config.baseUrl}/get_user_by_token`, { headers: { Authorization: localStorage.getItem('auth_token') ? localStorage.getItem('auth_token'): null } })                               
      .then(response => {
        dispatch({ type: types.GET_USER_BY_TOKEN_SUCCESS, result: response.data })  
      })
      .catch(error => { 
        dispatch({ type: types.GET_USER_BY_TOKEN_FAILURE, error });
      });
  };
};