import axios from 'axios'; 

import * as config from '../config/config';
import * as types  from '../constants/ActionTypes';

export const getHeartbeats = (page, sizePerPage, filters, sortField, sortOrder) => {                                   
    return (dispatch) => {
        dispatch({ 
            type: types.REQUEST_GET_HEARTBEATS 
        })
        return axios.post(
            `${config.baseUrl}/get_heartbeats`, 
            { 
                page: page, 
                per_page: sizePerPage,
                filters: filters,
                sorting: {field: sortField, order: sortOrder} 
            }, { 
                headers: { Authorization: localStorage.getItem('auth_token') } 
            })                               
            
        .then(response => {
            dispatch({
                type:       types.RECEIVE_GET_HEARTBEATS_SUCCESS,
                heartbeats: response.data.heartbeats,
                count:      response.data.count
            })
        })
        .catch(error => { 
            dispatch({
                type:    types.RECEIVE_GET_HEARTBEATS_ERROR,
                message: error.response.message
            });
            throw(error); 
        });
    };
};