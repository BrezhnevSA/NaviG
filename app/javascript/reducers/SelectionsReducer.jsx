import * as types from '../constants/ActionTypes';

const initState = {
    city:     JSON.parse(localStorage.getItem('selected_city')),
    office:   JSON.parse(localStorage.getItem('selected_office')),
    building: JSON.parse(localStorage.getItem('selected_building')),
    floor:    JSON.parse(localStorage.getItem('selected_floor'))
}

 export default function selectionsReducer(state = initState, action) {

    switch (action.type) {

        case types.SET_SELECTED_CITY:
            localStorage.setItem('selected_city', JSON.stringify(action.city));
            return {
                city:     action.city,
                office:   state.office,
                building: state.building,
                floor:    state.floor,
                miss_buildings_selection: state.payload,
                scd:      state.scd
            }

        case types.SET_SELECTED_OFFICE:
            localStorage.setItem('selected_office', JSON.stringify(action.office));
            return {
                city:     state.city,
                office:   action.office,
                building: state.building,
                floor:    state.floor,
                miss_buildings_selection: state.miss_buildings_selection,
                scd:      state.scd
            }

        case types.SET_SELECTED_BUILDING:
            localStorage.setItem('selected_building', JSON.stringify(action.building));
            return {
                city:     state.city,
                office:   state.office,
                building: action.building,
                floor:    state.floor,
                miss_buildings_selection: state.miss_buildings_selection,
                scd:      state.scd
            }

        case types.SET_SELECTED_FLOOR:
            localStorage.setItem('selected_floor', JSON.stringify(action.floor));
            return {
                city:     state.city,
                office:   state.office,
                building: state.building,
                floor:    action.floor,
                miss_buildings_selection: state.miss_buildings_selection,
                scd:      state.scd
            }

        case types.GET_SELECTIONS:
            return {
                city:     JSON.parse(localStorage.getItem('selected_city')),
                office:   JSON.parse(localStorage.getItem('selected_office')),
                building: JSON.parse(localStorage.getItem('selected_building')),
                floor:    JSON.parse(localStorage.getItem('selected_floor')),
                miss_buildings_selection: state.miss_buildings_selection,
                scd:      state.scd
            };
    
        case types.SET_ALL_SELECTIONS:
            return {
                city:     action.data.city,
                office:   action.data.office,
                building: action.data.building,
                floor:    action.data.floor,
                miss_buildings_selection: state.miss_buildings_selection,
                scd:      state.scd
            };    
                        
        case types.MISS_BUILDING_SELECTION:
            return {
                city:     state.city,
                office:   state.office,
                building: state.building,
                floor:    state.floor,
                miss_buildings_selection: action.payload,
                scd:      state.scd
            };    
            
        case types.SCD:
            return {
                city:     state.city,
                office:   state.office,
                building: state.building,
                floor:    state.floor,
                miss_buildings_selection: state.miss_buildings_selection,
                scd:      !state.scd
            };   

        default:
            return state;
    }
    
}