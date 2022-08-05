import * as hb_types  from './HeartBeatTypes';

export const items = [
    {
        type: hb_types.BOOKING_CREATING, 
        color: 'rgba(144, 189, 0,   0.55)' 
    }, {
        type: hb_types.BOOKING_EDITING,
        color: 'rgba(137, 75,  189, 0.55)' 
    }, {
        type: hb_types.BOOKING_REMOVING,
        color: 'rgba(225, 2,   63,  0.55)' 
    }, {
        type: hb_types.MOVING,
        color: 'rgba(231, 0,   252, 0.55)' 
    }, {
        type: hb_types.MOVING_TO_DS,
        color: 'rgba(0,   200, 255, 0.55)' 
    }, {
        type: hb_types.MOVING_TO_GT,
        color: 'rgba(180, 200, 255, 0.55)' 
    }, {
        type: hb_types.REMOVE_RESERVATION,
        color: 'rgba(189, 54,  47,  0.55)' 
    }, {
        type: hb_types.REMOVING,
        color: 'rgba(120, 54,  47,  0.55)' 
    }, {
        type: hb_types.REMOVING_FROM_DS,
        color: 'rgba(18,  54,  180, 0.55)' 
    }, {
        type: hb_types.REMOVING_FROM_GT,
        color: 'rgba(100,  150, 180, 0.55)' 
    }, {
        type: hb_types.RESERVATION,
        color: 'rgba(252, 151, 0,   0.55)' 
    }, {
        type: hb_types.SEAT,
        color: 'rgba(81,  163, 81,  0.55)' 
    }
]