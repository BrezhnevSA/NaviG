import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios'; 
import { func } from 'prop-types';

export const getFloorDetails = (id) => {   
    return (dispatch) => {
        dispatch({ type: types.REQUEST_GET_FLOOR_DETAILS })  
        return axios.get(`${config.baseUrl}/floors/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
            .then(response => {
                dispatch({ type: types.RECEIVE_GET_FLOOR_DETAILS_SUCCEESS, floor: response.data })  
            })
            .catch(error => { 
                dispatch({ type: types.RECEIVE_GET_FLOOR_DETAILS_ERROR, message: error })
                throw(error); 
            });
    };
};

export function initFloorDetails() {

    return {
        type: types.INIT_FLOOR_DETAILS
    };
};

export const updateFloorDetails = (floor, file) => {                                   
    return (dispatch) => {
      let data = new FormData()
      data.append('floor', JSON.stringify(floor))
      data.append('name', 'image')
      data.append('image', file == null ? '' : file)
      return axios.post(`${config.baseUrl}/floor_details/${floor.floor.id}`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.UPDATE_FLOOR_DETAILS, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const updateOneMetaValue = (data) => {                                   
    return (dispatch) => {
      return axios.put(`${config.baseUrl}/meta/update_one_metavalue`, { data: data }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.UPDATE_ONE_METAVALUE, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const removeFloorDetails = (id) => {                                   
    return (dispatch) => {
      return axios.delete(`${config.baseUrl}/floors/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.REMOVE_FLOOR_DETAILS, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const generateFloorImage = (id) => {                         
    return (dispatch) => {
        return axios.get(`${config.baseUrl}/floors/${id}/plan`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        // .then(response => {
        //     // no need for dispatch here 
        // })
        // .catch(error => { throw(error); });
    };
};

// Objects Actions

export const getObjectInfo = (id) => {                         
    return (dispatch) => {
        return axios.get(`${config.baseUrl}/object_items/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
            dispatch({ type: types.GET_OBJECT_ITEM, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export function addObjectToMap(payload) {

    return {
        type: types.ADD_OBJECT,
        payload
    };
}

export function updateObject(payload, save = false) {

    if (!save) {
        return {
            type: types.UPDATE_OBJECT,
            payload
        };
    }
    else {
        return (dispatch) => {
            return axios.put(`${config.baseUrl}/object_items/${payload.id}`, { object_item: JSON.stringify(payload) }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
              .then(response => {
                dispatch({ type: types.UPDATE_OBJECT, payload: response.data })  
              })
              .catch(error => { throw(error); });
          };
    }
}

export function removeObject(payload) {
    return {
        type: types.DELETE_OBJECT,
        payload
    };
}

// Locations Actions

export function addLocationToMap(payload) {
    return {
        type: types.ADD_LOCATION,
        payload
    };
}

export function updateLocation(payload) {
    return {
        type: types.UPDATE_LOCATION,
        payload
    };
}

export function removeLocation(payload) {
    return {
        type: types.DELETE_LOCATION,
        payload
    };
}

// Floor Actions

export function updateFloorName(payload) {
    return {
        type: types.UPDATE_FLOOR_NAME,
        payload
    };
}

export function updateFloorBuilding(payload) {
    return {
        type: types.UPDATE_FLOOR_BUILDING,
        payload
    };
}

export function selectNewElement(payload) {
    return {
        type: types.ELEMENT_SELECTED,
        payload
    };
}

export function costcetnersBacklightChanged() {
    return {
        type: types.COSTCENTERS_BACKLIGHT_CHANGED
    };
}

export function projectsBacklightChanged() {
    return {
        type: types.PROJECTS_BACKLIGHT_CHANGED
    };
}

export function setProjectsBacklight(val) {
    return {
        type: types.SET_PROJECTS_BACKLIGHT,
        payload: val
    };
}

export function setCostcentersBacklight(val) {
    return {
        type: types.SET_COSTCETNERS_BACKLIGHT,
        payload: val
    };
}

export function resetFloorState(payload) {
    return {
        type: types.RESET_FLOOR_STATE,
        payload
    };
}

export function setShowLocationNames(payload) {
    return {
        type: types.SHOW_LOCATION_NAMES,
        payload
    };
}

export function setShowDsLight(payload) {
    return {
        type: types.SHOW_DS_LIGHT,
        payload
    };
}

export function setShowObjects(payload) {
    return {
        type: types.SHOW_OBJECT_ITEMS,
        payload
    };
}

export function setShowObjectsNames(payload) {
    return {
        type: types.SHOW_OBJECT_NAMES,
        payload
    };
}

export function setShowDeskType(payload) {
    return {
        type: types.SHOW_DESK_TYPE,
        payload
    };
}

export function setSidebarMarkUpState(payload) {
    return {
        type: types.SET_SIDEBAR_MARKUP_STATE,
        payload
    };
}

export function setMarkDSReady(payload) {
    return {
        type: types.MARK_DS_READY,
        payload
    };
}

export function setInventoryMode(payload) {
    return {
        type: types.INVENTORY_MODE,
        payload
    };
}

export function lockFloor(id) {
    return (dispatch) => {
        return axios.post(`${config.baseUrl}/floors/${id}/lock`, { }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
          .then(response => {
            dispatch({ type: types.LOCK_FLOOR, payload: response.data })  
          })
          .catch(error => { throw(error); });
      };
}

export function setCostcentersToShow(payload) {
    return {
        type: types.SET_COSTCENTERS_TO_SHOW,
        payload
    }
}

export function setProjectsToShow(payload) {
    return {
        type: types.SET_PROJECTS_TO_SHOW,
        payload
    }
}