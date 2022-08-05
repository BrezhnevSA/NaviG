import * as types from '../constants/ActionTypes';

const initState = {
    isFetching: true,
    item: null
};

 export default function profileReducer(state = initState, action) {
    switch (action.type) {
        
        case types.REQUEST_GET_PROFILE:
            return {
                isFetching: true,
                item:       null
            };
   
        case types.RECEIVE_GET_PROFILE_SUCCEESS:
            return {
                isFetching: false,
                item:       action.profile
            };

        case types.RECEIVE_GET_PROFILE_ERROR:
            return {
                isFetching: false,
                message:    action.message,
                item:       null
            };

        case types.UPDATE_PROFILE:
            return {
                isFetching: false,
                item: {
                    active:          action.profile.active,
                    birthday:        action.profile.birthday,
                    city_id:         action.profile.city_id,
                    city_name:       action.profile.city_name,
                    costcenter_name: action.profile.costcenter_name,
                    costcenter_num:  action.profile.costcenter_num,
                    created_at:      action.profile.created_at,
                    email:           action.profile.email,
                    employee_id:     action.profile.employee_id,
                    gender:          action.profile.gender,
                    grade:           action.profile.grade,
                    id:              action.profile.id,
                    img_url:         action.profile.img_url,
                    info:            action.profile.info,
                    login:           action.profile.login,
                    mobile:          action.profile.mobile,
                    name:            action.profile.name,
                    office_id:       action.profile.office_id,
                    office_name:     action.profile.office_name,
                    patronymic:      action.profile.patronymic,
                    phone:           action.profile.phone,
                    position_id:     action.profile.position_id,
                    position_name:   action.profile.position_name,
                    education:       action.profile.education,
                    status:          action.profile.status,
                    surname:         action.profile.surname,
                    unit:            action.profile.unit,
                    updated_at:      action.profile.updated_at,
                }
            };
            
        default:
            return state;
    }
}