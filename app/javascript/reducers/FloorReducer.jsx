
import * as types from '../constants/ActionTypes';

const initState = {
    costcenters_backlight: false,
    projects_backlight:    false,
    is_Fetching:           true,
    show_location_names:   false,
    show_ds_light:         false,
    show_object_items:     false,
    mark_ds_ready:         false,
    inventory_mode:        false,
    show_desk_type:        {
        sharing:  false,
        employee: false,
        guest:    false,
        reserved: false
    },
    sidebar_markup_state:  false
}

 export default function floorReducer(state = initState, action) {
     switch (action.type) {

        case types.REQUEST_GET_FLOOR_DETAILS:            
            let p_floor = [];
            if (!!state.floor && !!state.floor.floor) {
                p_floor                          = {};
                p_floor['floor']                 = { floor_id: null }
                p_floor['costcenters']           = [];
                p_floor["costcenters_backlight"] = false;
                p_floor["sidebar_markup_state"]  = false;
                p_floor["projects_backlight"]    = false;
                p_floor["show_desk_type"]        = {
                    sharing:  false,
                    employee: false,
                    guest:    false,
                    reserved: false
                };
                p_floor['history']               = [];
                p_floor['show_location_names']   = false;
                p_floor['show_ds_light']         = false;
                p_floor['show_object_names']     = false;
                p_floor['show_object_items']     = false;
                p_floor['mark_ds_ready']         = false;
                p_floor['inventory_mode']        = false;
                p_floor['attributes']            = [];
            } else {
                p_floor = state.floor !== undefined 
                ? state 
                : {
                    costcenters_backlight: false,
                    sidebar_markup_state:  false,
                    projects_backlight:    false,
                    show_desk_type:        {
                        sharing:  false,
                        employee: false,
                        guest:    false,
                        reserved: false
                    },
                    is_Fetching:           true,
                    floor:                 { floor_id: null },
                    history:               [],
                    costcenters:           [],
                    locations:             [],
                    object_items:          [],
                    selected_item:         null,
                    show_location_names:   false,
                    show_ds_light:         false,
                    show_object_names:     false,
                    show_object_items:     false,
                    mark_ds_ready:         false,
                    inventory_mode:        false,
                    attributes:            []
                };
            }
            p_floor["is_Fetching"]           = true;
            p_floor['locked']                = {};

            return p_floor;

        case types.RECEIVE_GET_FLOOR_DETAILS_SUCCEESS:            
            let floor                      = action.floor;
            // let floor  = JSON.parse(JSON.stringify(action.floor));
            floor["is_Fetching"]           = false;
            floor['locations']             = floor['locations'].map(el => {
                if (!Array.isArray(el.dots) && !!el.dots) {
                    el.dots = el.dots.replaceAll(', nil', '')
                    el.dots = el.dots.replaceAll('nil,', '')
                    el.dots = el.dots.replaceAll('nil', '')
                    el.dots = el.dots.split("=>").join(":")
                    el.dots = JSON.parse(el.dots);
                }                
                return el;
            });
            floor["costcenters_backlight"] = false;
            floor["sidebar_markup_state"]  = false;
            floor["projects_backlight"]    = false;
            floor["show_desk_type"]        = {
                sharing:  false,
                employee: false,
                guest:    false,
                reserved: false
            };
            floor["show_location_names"]   = state.show_location_names;
            floor["show_ds_light"]         = state.show_ds_light;
            floor["show_object_names"]     = state.show_object_names;
            floor["show_object_items"]     = state.show_object_items;
            floor["mark_ds_ready"]         = state.mark_ds_ready;
            floor["inventory_mode"]        = state.inventory_mode;
            floor['history']               = [];
            floor['locked']                = action.floor.locked;
            floor['attributes']            = action.floor.attributes;

            return floor;

        case types.RECEIVE_GET_FLOOR_DETAILS_ERROR:        
            let e_floor                      = state.floor;
            e_floor["is_Fetching"]           = false;
            e_floor['floor']                 = { floor_id: null };
            e_floor['selected_item']         = null;
            e_floor['locations']             = [];
            e_floor["costcenters_backlight"] = false;
            e_floor["sidebar_markup_state"]  = false;
            e_floor["projects_backlight"]    = false;
            e_floor["show_desk_type"]        = {
                sharing:  false,
                employee: false,
                guest:    false,
                reserved: false
            };
            e_floor["show_location_names"]   = [];
            e_floor["show_ds_light"]         = [];
            e_floor["show_object_names"]     = [];
            e_floor["show_object_items"]     = [];
            e_floor["mark_ds_ready"]         = [];
            e_floor["inventory_mode"]        = [];

            e_floor["history"]               = [];
            e_floor['locked']                = {};
            e_floor['attributes']            = [];
            
            return e_floor;

        case types.UPDATE_ONE_METAVALUE:
            let t_attributes = state.attributes;
            let updated = false;
            // console.log(t_attributes)
            t_attributes = t_attributes.map(a => {
                if (a.id === parseInt(action.payload.id)) {
                    a.value = action.payload.value;
                    updated = true;
                }
                return a;
            })
            if (!updated) { t_attributes.push(action.payload); }
            return {
                ...state,
                attributes: t_attributes
            };

        case types.INIT_FLOOR_DETAILS:
        
            let new_floor = {};
            new_floor['selected_item'] = null;
            new_floor['locations'] = [];
            new_floor['object_items'] = [];
            new_floor['floor'] = {
                floor_id: null
            }
            new_floor['costcenters'] = [];
            new_floor['is_Fetching'] = true;
            new_floor['history'] = [];
            new_floor["costcenters_backlight"] = state.costcenters_backlight;
            new_floor["sidebar_markup_state"]  = state.sidebar_markup_state;
            new_floor["projects_backlight"]    = state.projects_backlight;
            new_floor["show_desk_type"]        = state.show_desk_type;
            new_floor["show_location_names"]   = state.show_location_names;
            new_floor["show_ds_light"]         = state.show_ds_light;
            new_floor["show_object_names"]     = state.show_object_names;
            new_floor["show_object_items"]     = state.show_object_items;
            new_floor["mark_ds_ready"]         = state.mark_ds_ready;
            new_floor["inventory_mode"]        = state.inventory_mode;
            return new_floor;

        case types.UPDATE_FLOOR_DETAILS:
            action.payload["attributes"]            = state.attributes;
            action.payload["costcenters_backlight"] = state.costcenters_backlight;
            action.payload["sidebar_markup_state"]  = state.sidebar_markup_state;
            action.payload["projects_backlight"]    = state.projects_backlight;
            action.payload["show_desk_type"]        = state.show_desk_type;
            action.payload["show_location_names"]   = state.show_location_names;
            action.payload["show_ds_light"]         = state.show_ds_light;
            action.payload["show_object_names"]     = state.show_object_names;
            action.payload["show_object_items"]     = state.show_object_items;
            action.payload["mark_ds_ready"]         = state.mark_ds_ready;
            action.payload["inventory_mode"]        = state.inventory_mode;
            return action.payload;

        case types.REMOVE_FLOOR_DETAILS:
            action.payload["costcenters_backlight"] = state.costcenters_backlight;
            action.payload["sidebar_markup_state"]  = state.sidebar_markup_state;
            action.payload["projects_backlight"]    = state.projects_backlight;
            action.payload["show_desk_type"]        = state.show_desk_type;
            action.payload["show_location_names"]   = state.show_location_names;
            action.payload["show_ds_light"]         = state.show_ds_light;
            action.payload["show_object_names"]     = state.show_object_names;
            action.payload["show_object_items"]     = state.show_object_items;
            action.payload["mark_ds_ready"]         = state.mark_ds_ready;
            action.payload["inventory_mode"]        = state.inventory_mode;
            return action.floor;
   
        case types.ADD_OBJECT:
            
            return {
                    ...state,
                    object_items: state.object_items.concat({
                        name: "",
                        id: state.object_items.length + 1 + 'new',
                        isnew: true,
                        angle: 0,
                        top: 150,
                        left: 150,
                        width: 50,
                        height: 50,
                        comment: '',
                        employee_id: null,
                        location_id: null,
                        floor_id: action.payload.floor_id,
                        object_type_id: action.payload.object_type_id,
                        scale: 100,
                        tooltip: '',
                        type_name: ''
                    })

            }
         
        case types.UPDATE_OBJECT:
            let newobj = false;
            if (action.payload.isnew === true) {
                newobj = true;
            }
            
            return {
                    ...state,
                    object_items: state.object_items.map(el => {
                        if (el.id === action.payload.id)  {
                            return {
                                ...el,
                                can_book: action.payload.can_book,
                                id: action.payload.id,
                                name: action.payload.name,
                                isnew: newobj,
                                angle: action.payload.angle,
                                costcenter_num: action.payload.costcenter_num,
                                top: action.payload.top,
                                left: action.payload.left,
                                width: action.payload.width,
                                height: action.payload.height,
                                comment: action.payload.comment,
                                employee_id: action.payload.employee_id,
                                location_id: action.payload.location_id,
                                object_type_id: action.payload.object_type_id,
                                scale: action.payload.scale,
                                tooltip: action.payload.tooltip,
                                type_name: action.payload.type_name,
                                status: action.payload.status,
                            }
                        } else if (el.id != action.id && el.employee_id === action.payload.employee_id && action.payload.was_seated) {
                            el.employee_id = null;
                            el.tooltip = " ";
                            el.status = 'RESERVED';
                            el.costcenter_num = el.employee_costcenter_num;
                        }
                        return el;
                    })
                }

        case types.GET_OBJECT_ITEM:

            return {
                    ...state,
                    object_items: state.object_items.map(el => (el.id === action.id ? {
                            id: action.payload.id,
                            name: action.payload.name,
                            isnew: newobj,
                            angle: action.payload.angle,
                            top: action.payload.top,
                            left: action.payload.left,
                            width: action.payload.width,
                            height: action.payload.height,
                            comment: action.payload.comment,
                            employee_id: action.payload.employee_id,
                            location_id: action.payload.location_id,
                            object_type_id: action.payload.object_type_id,
                            scale: action.payload.scale,
                            tooltip: action.payload.tooltip,
                            type_name: action.payload.type_name
                        } : el))
                }
 
        case types.DELETE_OBJECT:
            
            return {
                    ...state,
                    object_items: state.object_items.filter(el => el.id != action.payload.id)
            }
 
        case types.ADD_LOCATION:
            
            return {
                    ...state,
                    locations: state.locations.concat({
                        name: "",
                        id: state.locations.length + 1 + 'new',
                        isnew: true,
                        top: 150,
                        left: 150,
                        dots: [
                            {x: 40, y: 40},
                            {x: 300, y: 40},
                            {x: 300, y: 300},
                            {x: 40, y: 300},
                            {x: 40, y: 40}
                        ],
                        name_position: null,
                        description: null,
                        costcenter: null,
                        location_type_id: action.payload.location_type_id
                    })
            }
 
        case types.UPDATE_LOCATION:
            let newloc = false;
            if (action.payload.isnew === true) {
                newloc = true;
            }
            
            return {
                    ...state,
                    locations: state.locations.map(el => (el.id === action.payload.id ? {
                        id: action.payload.id,
                        location_type_id: action.payload.location_type_id,
                        name: action.payload.name,
                        isnew: newloc,
                        top: action.payload.top,
                        left: action.payload.left,
                        name_position: action.payload.name_position,
                        dots: action.payload.dots
                    } : el))
            }
            
 
        case types.DELETE_LOCATION:
            
            return {
                ...state,
                locations: state.locations.filter(el => el.id !== action.payload.id)
                
            }
 
        case types.UPDATE_FLOOR_NAME:
            return {
                ...state,
                floor: {
                    ...state.floor,
                    name: action.payload.name
                }
            }
            
        case types.UPDATE_FLOOR_BUILDING:
            return {
                ...state,
                floor: {
                    ...state.floor,
                    building_id: action.payload.building_id
                }
            }
            
        case types.COSTCENTERS_BACKLIGHT_CHANGED:
            return {
                ...state,
                costcenters_backlight: !state.costcenters_backlight
            }   

        case types.SET_COSTCENTERS_TO_SHOW:
            return {
                ...state,
                costcenters: action.payload
            }  

        case types.SET_PROJECTS_TO_SHOW:
            return {
                ...state,
                projects: action.payload
            }

        case types.PROJECTS_BACKLIGHT_CHANGED:
            return {
                ...state,
                projects_backlight: !state.projects_backlight
            }

        case types.SET_PROJECTS_BACKLIGHT:
            return {
                ...state,
                projects_backlight: action.payload
            }
            
        case types.SHOW_DESK_TYPE:
            return {
                ...state,
                show_desk_type: action.payload
            }

        case types.SET_SIDEBAR_MARKUP_STATE:
            return {
                ...state,
                sidebar_markup_state: action.payload
            }

        case types.SET_COSTCETNERS_BACKLIGHT:
            return {
                ...state,
                costcenters_backlight: action.payload
            }

        case types.ELEMENT_SELECTED:

            let subtype_id = null;
            if ((action.payload.data['type'] === 'object') && (!!action.payload.data.data)) {
                subtype_id = action.payload.data.data['object_type_id'];
            }
            else if ((action.payload.data['type'] === 'location') && (!!action.payload.data.data)) {
                subtype_id = action.payload.data.data['location_type_id'];
            }
            
            let locations = [];
            if (!!action.payload.data.data && !!state.locations) {
                locations = state.locations.map(el => (el.id === action.payload.data.data.id ? {
                    ...el,
                    selected: true,
                } : {
                    ...el,
                    selected: false,
                }));
            }

            return {
                ...state,
                selected_type: action.payload.data.type,
                selected_subtype: subtype_id,
                selected_item: action.payload.data.data,
                locations: locations
            }

        // case types.RESET_TOOLTIP:
            
        //     return {
        //         ...state,
        //         tooltip: null
        //     }

        case types.GET_TOOLTIP:

            return {
                ...state,
                tooltip: !!action.tooltip.employee_id ? action.tooltip.name + ' ' + action.tooltip.surname : null
            }

        case types.RESET_FLOOR_STATE:

            return action.payload

        case types.SHOW_LOCATION_NAMES:
            localStorage.setItem("show_location_names", action.payload);
            return {
                ...state,
                show_location_names: action.payload
            }

        case types.SHOW_DS_LIGHT:
            localStorage.setItem("show_ds_light", action.payload);
            return {
                ...state,
                show_ds_light: action.payload
            }

        case types.SHOW_OBJECT_ITEMS:
            localStorage.setItem("show_object_items", action.payload);
            return {
                ...state,
                show_object_items: action.payload
            }

        case types.SHOW_OBJECT_NAMES:
            localStorage.setItem("show_object_names", action.payload);
            return {
                ...state,
                show_object_names: action.payload
            }

        case types.MARK_DS_READY:
            return {
                ...state,
                mark_ds_ready: action.payload
            }

        case types.INVENTORY_MODE:
            return {
                ...state,
                inventory_mode: action.payload
            }

        case types.LOCK_FLOOR:

            return {
                ...state,
                locked: action.payload
            }

        default:
            return state;
            
    }
 }
 