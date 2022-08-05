import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios'; 
// Search Actions

export const searchEmployeeById = (id) => {
  return (dispatch) => {
    return axios.get(`${config.baseUrl}/employees/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.GET_EMPLOYEEBY_ID, employeeById: response.data })  
      })
      .catch(error => { throw(error); });
  };
};

export const searchProjects = (query, page) => {        
  return (dispatch) => {
    dispatch({ type: types.REQUEST_GET_PROJECTS }) 
    return axios.get(`${config.baseUrl}/search/projects?query=${query}&page=${page}&per_page=50`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.RECEIVE_GET_PROJECTS_SUCCESS, projects: response.data })  
      })
      .catch(error => { 
        dispatch({ 
          type: types.RECEIVE_GET_PROJECTS_ERROR,
          message: error.response.message
        }) 
        throw(error); 
      });
  };
};

export const searchAllProjects = () => {        
  return (dispatch) => {
    return axios.get(`${config.baseUrl}/search/projects/all`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.GET_ALL_PROJECTS, projects_all: response.data })  
      })
      .catch(error => { throw(error); });
  };
};

export const searchCostcenters = (query, page, with_text = false) => {        
  return (dispatch) => {
    dispatch({ type: types.REQUEST_GET_COSTCENTERS })  
    return axios.get(`${config.baseUrl}/search/costcenters?query=${query}&page=${page}&per_page=50&with_text=${with_text}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.RECEIVE_GET_COSTCENTERS_SUCCESS, costcenters: response.data })  
      })
      .catch(error => { 
        dispatch({ 
          type: types.RECEIVE_GET_COSTCENTERS_ERROR,
          message: error.response.message
        }) 
        throw(error); 
      });
  };
};

export const searchAllCostcenters = () => {        
  return (dispatch) => {
    return axios.get(`${config.baseUrl}/search/costcenters/all`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.GET_ALL_COSTCENTERS, costcenters_all: response.data })  
      })
      .catch(error => { throw(error); });
  };
};

export const searchDSPlaces = (query, page, id) => {        
    return (dispatch) => {
      return axios.get(`${config.baseUrl}/search/places?query=${query}&page=${page}&per_page=50&employee_id=${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.GET_DS_PLACES, object_items: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const searchLocations = (query, page) => {        
  return (dispatch) => {
    return axios.get(`${config.baseUrl}/search/places?query=${query}&page=${page}&per_page=50`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.SEARCH_LOCATIONS, locations: response.data })  
      })
      .catch(error => { throw(error); });
  };
};

export const searchDSPlaceById = (id) => {        
  return (dispatch) => {
    return axios.get(`${config.baseUrl}/object_items/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.GET_OBJECT_ITEM_BY_ID, objectItemById: response.data })  
      })
      .catch(error => { throw(error); });
  };
};

export const searchLocationById = (id) => {        
  return (dispatch) => {
    return axios.get(`${config.baseUrl}/locations/${id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.GET_LOCATION_BY_ID, locationById: response.data })  
      })
      .catch(error => { throw(error); });
  };
};

export const searchEmployees = (query, page) => {        
  
    return (dispatch) => {
      return axios.get(`${config.baseUrl}/search/employees?query=${query}&page=${page}&per_page=50`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.GET_EMPLOYEES, employees: response.data })  
        })
        .catch(error => { throw(error); });
    };
};

export const searchEmployeesForGroup = (group_id) => {        
  return (dispatch) => {
    dispatch({ type: types.REQUEST_SEARCH_EMPLOYEES_FOR_GROUP })  
    return axios.get(`${config.baseUrl}/search/employees_for_group?group_id=${group_id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.RECEIVE_SEARCH_EMPLOYEES_FOR_GROUP_SUCCESS, employees_for_group: response.data })  
      })
      .catch(error => { 
        dispatch({ 
          type: types.RECEIVE_SEARCH_EMPLOYEES_FOR_GROUP_ERROR,
          message: error.response.message
        }) 
        throw(error); 
      });
  };
};

export const searchEmployeesInCostcenter = (costcenter_num) => {        
  return (dispatch) => {
    dispatch({ type: types.REQUEST_GET_EMPLOYEES_IN_COSTCENTERS })  
    return axios.get(`${config.baseUrl}/search/employees_in_costcenter?costcenter_num=${costcenter_num}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.RECEIVE_GET_EMPLOYEES_IN_COSTCENTERS_SUCCESS, employees_in_costcenter: response.data })  
      })
      .catch(error => { 
        dispatch({ 
          type: types.RECEIVE_GET_EMPLOYEES_IN_COSTCENTERS_ERROR,
          message: error.response.message
        }) 
        throw(error); 
      });
  };
};

export const downloadSearchEmployeesInCostcenter  = (costcenter_num, costcenter_name) => {
  return axios.get(`${config.baseUrl}/search/employees_in_costcenter?costcenter_num=${costcenter_num}&as_file=true`, { headers: { Authorization: localStorage.getItem('auth_token') }, responseType: 'blob' },)                               
      .then(response => {
          if (!window.navigator.msSaveOrOpenBlob) {
              // BLOB NAVIGATOR
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `employees_in_costcenter_${costcenter_name}.xls`);
              document.body.appendChild(link);
              link.click();
          } else {
              // BLOB FOR EXPLORER 11
              const url = window.navigator.msSaveOrOpenBlob(new Blob([response.data]), `employees_in_costcenter_${costcenter_name}.xls`);
          }
      }).catch(error => { throw(error); });
}

export const searchEmployeesInProject = (project_id) => {        
  return (dispatch) => {
    dispatch({ type: types.REQUEST_GET_EMPLOYEES_IN_PROJECT })  
    return axios.get(`${config.baseUrl}/search/employees_in_project?project_id=${project_id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.RECEIVE_GET_EMPLOYEES_IN_PROJECT_SUCCESS, employees_in_project: response.data })  
      })
      .catch(error => { 
        dispatch({ 
          type: types.RECEIVE_GET_EMPLOYEES_IN_PROJECT_ERROR,
          message: error.response.message
        }) 
        throw(error); 
      });
  };
};

export const downloadSearchEmployeesInProject  = (project_id, project_name) => {
  return axios.get(`${config.baseUrl}/search/employees_in_project?project_id=${project_id}&as_file=true`, { headers: { Authorization: localStorage.getItem('auth_token') }, responseType: 'blob' },)                               
      .then(response => {
          if (!window.navigator.msSaveOrOpenBlob) {
              // BLOB NAVIGATOR
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `employees_in_project_${project_name}.xls`);
              document.body.appendChild(link);
              link.click();
          } else {
              // BLOB FOR EXPLORER 11
              const url = window.navigator.msSaveOrOpenBlob(new Blob([response.data]), `employees_in_project_${project_name}.xls`);
          }
      }).catch(error => { throw(error); });
}

export const searchEmployeesOnPlace = (query, page, statuses) => {        
  const statuses_str = statuses.join(',')
  return (dispatch) => {
    dispatch({ type: types.REQUEST_SEARCH_EMPLOYEES_ON_PLACE }) 
    return axios.get(`${config.baseUrl}/search/employees_on_place?query=${query}&employee_statuses=${statuses_str}&page=${page}&per_page=5`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.RECEIVE_SEARCH_EMPLOYEES_ON_PLACE_SUCCESS, foundEmployeesOnPlace: response.data })  
      })
      .catch(error => {
        dispatch({ 
          type: types.RECEIVE_SEARCH_EMPLOYEES_ON_PLACE_ERROR,
          message: error.response.message
        })  
        throw(error); 
      });
  };
};

export const searchEmployeesWithNoPlace = (query, page, statuses) => {        
  const statuses_str = statuses.join(',')
  return (dispatch) => {
    dispatch({ type: types.REQUEST_SEARCH_EMPLOYEES_WITH_NO_PLACE }) 
    return axios.get(`${config.baseUrl}/search/employees_with_no_place?query=${query}&employee_statuses=${statuses_str}&page=${page}&per_page=5`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.RECEIVE_SEARCH_EMPLOYEES_WITH_NO_PLACE_SUCCESS, foundEmployeesWithNoPlace: response.data })  
      })
      .catch(error => {
        dispatch({ 
          type: types.RECEIVE_SEARCH_EMPLOYEES_WITH_NO_PLACE_ERROR,
          message: error.response.message
        })  
        throw(error); 
      });
  };
};

export const searchRoomsAndLocations = (query, page, location_type_ids) => {        
  const location_type_ids_str = location_type_ids.join(',')
  return (dispatch) => {
    dispatch({ type: types.REQUEST_SEARCH_ROOMS_AND_LOCATIONS }) 
    return axios.get(`${config.baseUrl}/search/rooms_and_locations?query=${query}&location_type_ids=${location_type_ids_str}&page=${page}&per_page=500`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.RECEIVE_SEARCH_ROOMS_AND_LOCATIONS_SUCCESS, foundLocations: response.data })  
      })
      .catch(error => {
        dispatch({ 
          type: types.RECEIVE_SEARCH_ROOMS_AND_LOCATIONS_ERROR,
          message: error.response.message
        })  
        throw(error); 
      });
  };
};

export const searchLocationsForContracts = (query, page, office_id) => {  
  return (dispatch) => {
    dispatch({ type: types.REQUEST_SEARCH_LOCATIONS_FOR_CONTRACTS }) 
    return axios.get(`${config.baseUrl}/search/locations_for_contract?query=${query}&page=${page}&per_page=500&office_id=${office_id}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.RECEIVE_SEARCH_LOCATIONS_FOR_CONTRACTS_SUCCESS, foundLocations: response.data })  
      })
      .catch(error => {
        dispatch({ 
          type: types.RECEIVE_SEARCH_LOCATIONS_FOR_CONTRACTS_ERROR,
          message: error.response.message
        })  
        throw(error); 
      });
  };
};

export const searchObjectsAndDesks = (query, page, object_type_ids) => {        
  const object_type_ids_str = object_type_ids.join(',')
  return (dispatch) => {
    dispatch({ type: types.REQUEST_SEARCH_OBJECTS_AND_DESKS }) 
    return axios.get(`${config.baseUrl}/search/objects_and_desks?query=${query}&object_type_ids=${object_type_ids_str}&page=${page}&per_page=5`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.RECEIVE_SEARCH_OBJECTS_AND_DESKS_SUCCESS, foundObjects: response.data })  
      })
      .catch(error => {
        dispatch({ 
          type: types.RECEIVE_SEARCH_OBJECTS_AND_DESKS_ERROR,
          message: error.response.message
        })  
        throw(error); 
      });
  };
};

export const searchBookings = (book_from, book_to, employee, switchState, office_id = "", building_id = "") => {   
  return (dispatch) => {
    dispatch({ type: types.REQUEST_SEARCH_BOOKINGS }) 
    let booking_data = { 
      book_from: book_from, 
      book_to: book_to, 
      employee: employee, 
      switchState: switchState,
      office_id: parseInt(office_id),
      building_id: parseInt(building_id)
    };
    return axios.post(`${config.baseUrl}/bookings/search_available_places`, { booking_data: booking_data }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.RECEIVE_SEARCH_BOOKINGS_SUCCESS, bookings: response.data })  
      })
      .catch(error => {
        dispatch({ 
          type: types.RECEIVE_SEARCH_BOOKINGS_ERROR,
          message: error.response.data.message,
          status: error.response.status,
          meta: error.response.data.meta
        })  
        throw(error); 
      });
  };
};

export const searchLocation = (query, page) => {        
  
  return (dispatch) => {
    return axios.get(`${config.baseUrl}/search/locations?query=${query}&page=${page}&per_page=50`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.SEARCH_LOCATION, locations: response.data })  
      })
      .catch(error => { throw(error); });
  };
};

export const searchStats = (query) => {        
  
  return (dispatch) => {
    return axios.get(`${config.baseUrl}/search/stats?query=${query}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.GET_SEARCH_STATS, stats: response.data })  
      })
      .catch(error => { throw(error); });
  };
};

export const searchDetailsResults = (target, query) => {        
  
  return (dispatch) => {
    return axios.get(`${config.baseUrl}/search/results/${target}?query=${query}`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
        dispatch({ type: types.GET_SEARCH_RESULTS, details_results: response.data.results })
      })
      .catch(error => { throw(error); });
  };
};

export const getInventory = (page, ppp, filters, sorting, meta_sort = '') => {    
  return (dispatch) => { 
    dispatch({ type: types.REQUEST_GET_INVENTORY })                    
    return axios.post(
      `${config.baseUrl}/search/inventory_all`,
      {
        page: page,
        per_page: ppp,
        filters: filters,
        sorting: sorting,
        meta_sort: meta_sort,
      },
     { headers: { Authorization: localStorage.getItem('auth_token') } })                               
      .then(response => {
          dispatch({ type: types.RECEIVE_GET_INVENTORY_SUCCESS, inventory: response.data });
        })
        .catch(error => { 
          dispatch({ 
            type: types.RECEIVE_GET_INVENTORY_ERROR,
            message: error.response.message
          })
          throw(error); 
        });
    };
};