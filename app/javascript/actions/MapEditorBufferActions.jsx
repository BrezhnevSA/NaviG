import * as types from '../constants/ActionTypes';

import * as config from '../config/config';

import axios from 'axios'; 

export function saveToHistory(payload) {
    return {
        type: types.SAVE_FLOOR_TO_HISTORY,
        payload
    };
}

export function afterSetFromHistory() {
    return {
        type: types.SET_FLOOR_FROM_HISTORY
    };
}

export function saveToBuffer(payload) {
    return {
        type: types.COPY_TO_BUFFER,
        payload
    };
}

export function clearBuffer(payload) {
    return {
        type: types.CLEAR_BUFFER
    };
}