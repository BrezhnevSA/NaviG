import * as types from '../constants/ActionTypes';

export const getSelections = () => {
    return (dispatch) => {
        dispatch({ type: types.GET_SELECTIONS })
    };
};

export const setSelectedCity = (city) => {
    return (dispatch) => {
        dispatch({ type: types.SET_SELECTED_CITY, city: city })
    };
};

export const setSelectedOffice = (office) => {
    return (dispatch) => {
        dispatch({ type: types.SET_SELECTED_OFFICE, office: office })
    };
};

export const setSelectedBuilding = (building) => {
    return (dispatch) => {
        dispatch({ type: types.SET_SELECTED_BUILDING, building: building })
    };
};

export const setSelectedFloor = (floor) => {
    return (dispatch) => {
        dispatch({ type: types.SET_SELECTED_FLOOR, floor: floor })
    };
};

export const setAllSelections = (city, office, building, floor) => {
    return (dispatch) => {
        dispatch({ type: types.SET_ALL_SELECTIONS, data: { floor: floor, office: office, building: building, city: city } })
    };
}

export const missBuildingSelection = (payload) => {
    return (dispatch) => {
        dispatch({ type: types.MISS_BUILDING_SELECTION, payload: payload })
    };
}

export const scd = () => {
    return (dispatch) => {
        dispatch({ type: types.SCD })
    };
}