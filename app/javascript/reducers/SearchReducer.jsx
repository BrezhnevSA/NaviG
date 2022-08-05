import * as types from '../constants/ActionTypes';

const initState = {
    employees_for_group: {
        isFetching: true,
        items: []
    },
    employees_in_costcenter: {
        isFetching: true,
        items: []
    },
    employees_in_project: {
        isFetching: true,
        items: []
    }
}

 export default function searchReducer(state = initState, action) {
    switch (action.type) {
        
        case types.GET_EMPLOYEES:
            
            return {
                ...state,
                employees: action.employees
            }

        case types.GET_EMPLOYEEBY_ID:
        
            return {
                ...state,
                employeeById: action.employeeById
            }

        case types.REQUEST_SEARCH_EMPLOYEES_ON_PLACE:
    
            return {
                ...state,
                foundEmployeesOnPlace: [],
                foundEmployeesOnPlaceFetching: true
            }

        case types.RECEIVE_SEARCH_EMPLOYEES_ON_PLACE_SUCCESS:
        
            return {
                ...state,
                foundEmployeesOnPlace: action.foundEmployeesOnPlace,
                foundEmployeesOnPlaceFetching: false
            }

        case types.RECEIVE_SEARCH_EMPLOYEES_ON_PLACE_ERROR:
    
            return {
                ...state,
                foundEmployeesOnPlace: [],
                foundEmployeesOnPlaceFetching: false,
                message: action.message
            }

        case types.REQUEST_SEARCH_EMPLOYEES_FOR_GROUP:
            return { 
                ...state,
                employees_for_group: {
                    isFetching: true,
                    items:      []
                }
            };

        case types.RECEIVE_SEARCH_EMPLOYEES_FOR_GROUP_SUCCESS:
            return { 
                ...state,
                employees_for_group: {
                    isFetching: false,
                    items:      action.employees_for_group
                }
            };

        case types.RECEIVE_SEARCH_EMPLOYEES_FOR_GROUP_ERROR:
            return { 
                ...state,
                employees_for_group: {
                    isFetching: false,
                    items:      [],
                    message:    action.message
                }
            };

        case types.REQUEST_GET_EMPLOYEES_IN_COSTCENTERS:
            return { 
                ...state,
                employees_in_costcenter: {
                    isFetching: true,
                    items:      null
                }
            };

        case types.RECEIVE_GET_EMPLOYEES_IN_COSTCENTERS_SUCCESS:
            return { 
                ...state,
                employees_in_costcenter: {
                    isFetching: false,
                    items:      action.employees_in_costcenter
                }
            };

        case types.RECEIVE_GET_EMPLOYEES_IN_COSTCENTERS_ERROR:
            return { 
                ...state,
                employees_in_costcenter: {
                    isFetching: false,
                    items:      null,
                    message:    action.message
                }
            };

        case types.REQUEST_GET_EMPLOYEES_IN_PROJECT:
            return { 
                ...state,
                employees_in_project: {
                    isFetching: true,
                    items:      null
                }
            };

        case types.RECEIVE_GET_EMPLOYEES_IN_PROJECT_SUCCESS:
            return { 
                ...state,
                employees_in_project: {
                    isFetching: false,
                    items:      action.employees_in_project
                }
            };

        case types.RECEIVE_GET_EMPLOYEES_IN_PROJECT_ERROR:
            return { 
                ...state,
                employees_in_project: {
                    isFetching: false,
                    items:      null,
                    message:    action.message
                }
            };

        case types.REQUEST_SEARCH_EMPLOYEES_WITH_NO_PLACE:
    
            return {
                ...state,
                foundEmployeesWithNoPlace: [],
                foundEmployeesWithNoPlaceFethcing: true
            }

        case types.RECEIVE_SEARCH_EMPLOYEES_WITH_NO_PLACE_SUCCESS:

            return {
                ...state,
                foundEmployeesWithNoPlace: action.foundEmployeesWithNoPlace,
                foundEmployeesWithNoPlaceFethcing: false
            }

        case types.RECEIVE_SEARCH_EMPLOYEES_WITH_NO_PLACE_ERROR:

            return {
                ...state,
                foundEmployeesWithNoPlace: [],
                foundEmployeesWithNoPlaceFethcing: false,
                message: action.message
            }

        case types.REQUEST_SEARCH_ROOMS_AND_LOCATIONS:

            return {
                ...state,
                foundLocations: [],
                foundLocationsFetching: true,
            }

        case types.RECEIVE_SEARCH_ROOMS_AND_LOCATIONS_SUCCESS:

            return {
                ...state,
                foundLocations: action.foundLocations,
                foundLocationsFetching: false,
            }

        case types.RECEIVE_SEARCH_ROOMS_AND_LOCATIONS_ERROR:

            return {
                ...state,
                foundLocations: [],
                foundLocationsFetching: false,
                message: action.message
            }

        case types.REQUEST_SEARCH_LOCATIONS_FOR_CONTRACTS:

            return {
                ...state,
                foundLocationsForContract: [],
                foundLocationsForContractsFetching: true,
            }

        case types.RECEIVE_SEARCH_LOCATIONS_FOR_CONTRACTS_SUCCESS:

            return {
                ...state,
                foundLocationsForContract: action.foundLocations,
                foundLocationsForContractsFetching: false,
            }

        case types.RECEIVE_SEARCH_LOCATIONS_FOR_CONTRACTS_ERROR:

            return {
                ...state,
                foundLocationsForContract: [],
                foundLocationsForContractsFetching: false,
                message: action.message
            }

        case types.REQUEST_SEARCH_OBJECTS_AND_DESKS:

            return {
                ...state,
                foundObjects: [],
                foundObjectsFetching: true,
            }

        case types.RECEIVE_SEARCH_OBJECTS_AND_DESKS_SUCCESS:

            return {
                ...state,
                foundObjects: action.foundObjects,
                foundObjectsFetching: false,
            }

        case types.RECEIVE_SEARCH_OBJECTS_AND_DESKS_ERROR:

            return {
                ...state,
                foundObjects: [],
                foundObjectsFetching: false,
                message: action.message
            }

        case types.REQUEST_SEARCH_BOOKINGS:
            return { 
                ...state,
                bookings: {
                    isFetching: true,
                    items:      []
                }
            };

        case types.RECEIVE_SEARCH_BOOKINGS_SUCCESS:
            return { 
                ...state,
                bookings: {
                    isFetching: false,
                    items:      action.bookings
                }
            };

        case types.RECEIVE_SEARCH_BOOKINGS_ERROR:
            return { 
                ...state,
                bookings: {
                    isFetching: false,
                    items:      [],
                    message:    action.message,
                    status:     action.status,
                    book_from:  action.meta.length > 0 ? action.meta[0].book_from : '',
                    book_to:    action.meta.length > 0 ? action.meta[0].book_to : '',
                }
            };

        case types.GET_DS_PLACES:
            
            return {
                ...state,
                object_items: action.object_items
            }

        case types.SEARCH_LOCATIONS:
            return {
                ...state,
                locations: action.locations
            }

        case types.GET_OBJECT_ITEM_BY_ID:
    
            return {
                ...state,
                objectItemById: action.objectItemById
            }

        case types.GET_LOCATION_BY_ID:

            return {
                ...state,
                locationById: action.locationById
            }

        case types.REQUEST_GET_COSTCENTERS:
        
            return {
                ...state,
                costcenters: [],
                costcentersFetching: true
            }

        case types.RECEIVE_GET_COSTCENTERS_SUCCESS:
    
            return {
                ...state,
                costcenters: action.costcenters,
                costcentersFetching: false
            }
            
        case types.RECEIVE_GET_COSTCENTERS_ERROR:
    
            return {
                ...state,
                costcenters: [],
                costcentersFetching: false,
                message: action.message
            }

        case types.GET_ALL_COSTCENTERS:
    
            return {
                ...state,
                costcenters_all: action.costcenters_all
            }

        case types.REQUEST_GET_PROJECTS:
    
            return {
                ...state,
                projects: [],
                projectsFetching: true
            }

        case types.RECEIVE_GET_PROJECTS_SUCCESS:

            return {
                ...state,
                projects: action.projects,
                projectsFetching: false
            }
 
        case types.RECEIVE_GET_PROJECTS_ERROR:

            return {
                ...state,
                projects: [],
                projectsFetching: false,
                message: action.message
            }  
                     
        case types.GET_ALL_PROJECTS:

            return {
                ...state,
                projects_all: action.projects_all
            }

        case types.SEARCH_LOCATION:
        
            return {
                ...state,
                locations: action.locations
            }

        case types.GET_SEARCH_STATS:
        
            return {
                ...state,
                stats: action.stats
            }

        case types.GET_SEARCH_RESULTS:
        
            return {
                ...state,
                details_results: action.details_results
            }

        case types.REQUEST_GET_INVENTORY:
    
            return {
                ...state,
                inventory: [],
                inventoryFetching: true
            }

        case types.RECEIVE_GET_INVENTORY_SUCCESS:
    
            return {
                ...state,
                inventory: action.inventory,
                inventoryFetching: false
            }
            
        case types.RECEIVE_GET_INVENTORY_ERROR:
    
            return {
                ...state,
                inventory: [],
                inventoryFetching: false,
                message: action.message
            }
            
        default:
            return state;
    }
}