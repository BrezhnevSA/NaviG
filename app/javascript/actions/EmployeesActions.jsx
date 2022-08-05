import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios'; 

export const getAllEmployees = (statuses, page, ppp, filters, sorting) => {        
    return (dispatch) => {
      dispatch({ type: types.REQUEST_GET_ALL_EMPLOYEES }) 
      return axios.post(
        `${config.baseUrl}/search/employees/all`,
        {
          statuses: statuses,
          page: page,
          per_page: ppp,
          filters: filters,
          sorting: sorting,
        },
       { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.RECEIVE_GET_ALL_EMPLOYEES_SUCCESS, employees: response.data.staff, count: response.data.count })  
        })
        .catch(error => {
          dispatch({ 
            type: types.RECEIVE_GET_ALL_EMPLOYEES_ERROR,
            message: error.response.message
          })  
          throw(error); 
        });
    };
};