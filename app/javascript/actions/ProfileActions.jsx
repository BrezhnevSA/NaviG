import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios'; 
// Profile Actions

export const getProfile = (id) => {     
    return (dispatch) => {
      dispatch({ type: types.REQUEST_GET_PROFILE }) 
      return axios.get(`${config.baseUrl}/employees/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          
          dispatch({ type: types.RECEIVE_GET_PROFILE_SUCCEESS, profile: response.data })  
        })
        .catch(error => {
          dispatch({ 
            type: types.RECEIVE_GET_PROFILE_ERROR,
            message: error.response.message
          })  
          throw(error); 
        });
    };
};

export const updateProfile  = (profile, image, delete_image = false) => {
    return (dispatch) => {

      return axios.patch(`${config.baseUrl}/employees/${profile.id}`, { employee: profile, image: image, delete_image: delete_image }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          
          dispatch({ type: types.UPDATE_PROFILE, profile: response.data })  
        })
        .catch(error => {
          throw(error);
        });
    };
};