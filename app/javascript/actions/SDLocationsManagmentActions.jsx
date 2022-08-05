import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import * as object_type from '../constants/ObjectLocationTypes';

import axios from 'axios'; 

export const getLocationInfo = (id) => {                                   
    return (dispatch) => {
        dispatch({ type: types.REQUEST_GET_OBJECTS_LOCATION }) 
        return axios.get(`${config.baseUrl}/sdmanagers_costcenters/objects/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
            .then(response => {
                dispatch({ type: types.RECEIVE_GET_OBJECTS_LOCATION_SUCCESS, payload: response.data })  
                })
            .catch(error => {
                dispatch({ 
                    type: types.RECEIVE_GET_OBJECTS_LOCATION_ERROR,
                    message: error.response.message
                });  
                throw(error); 
            });
        };
};

export const getLocationsInfo = () => {                                   
    return (dispatch) => {
        dispatch({ type: types.REQUEST_GET_LOCATIONS_INFO }) 
        return axios.get(`${config.baseUrl}/sdmanagers_costcenters/objects/info`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
            .then(response => {
                dispatch({ type: types.RECEIVE_GET_LOCATIONS_INFO_SUCCESS, payload: response.data })  
                })
            .catch(error => {
                dispatch({ 
                    type: types.RECEIVE_GET_LOCATIONS_INFO_ERROR,
                    message: error.response.message
                });  
                throw(error); 
            });
        };
};

export const removeObjectFromLocation = (id, location_id, type) => {                                   
    return (dispatch) => {
        return axios.delete(`${config.baseUrl}/sdmanagers_costcenters/objects/${id}?type=${type}&location_id=${location_id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
            .then(response => {
                dispatch({ 
                    type: object_type.COSTCENTER === type
                        ? types.REMOVE_COSTCENTERS_LOCATIONS
                        : object_type.EMPLOYEE === type
                            ? types.REMOVE_EMPLOYEES_LOCATIONS
                            : object_type.PROJECT === type
                                ? types.REMOVE_PROJECTS_LOCATIONS
                                : "",
                    payload: response.data 
                });  
            })
            .catch(error => { throw(error); });
    };
};

export const addObjectToLocation = (object_id, location_id, type) => {  
    return (dispatch) => {
        return axios.post(
            `${config.baseUrl}/sdmanagers_costcenters/objects`, { object_id: object_id, location_id: location_id, type: type }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
            .then(response => {
                dispatch({ 
                    type: object_type.COSTCENTER === type
                        ? types.ADD_COSTCENTERS_LOCATIONS
                        : object_type.EMPLOYEE === type
                            ? types.ADD_EMPLOYEES_LOCATIONS
                            : object_type.PROJECT === type
                                ? types.ADD_PROJECTS_LOCATIONS
                                : "",
                    payload: response.data 
                });  
            })
            .catch(error => { throw(error); });
     };
};