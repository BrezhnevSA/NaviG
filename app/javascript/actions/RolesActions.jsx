import * as types  from '../constants/ActionTypes';
import * as config from '../config/config';

import axios from 'axios'; 

export const removeRoles = (ids, group_id, rolable_type) => {  
    const ids_string = ids.join(',');                                 
    return (dispatch) => {
      return axios.delete(`${config.baseUrl}/roles?ids=${ids_string}&group_id=${group_id}&rolable_type=${rolable_type}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.REMOVE_ROLE, payload: response.data })  
        })
        .catch(error => { throw(error); });
    };
};