
import * as types from '../constants/ActionTypes';
import * as settings from '../constants/AppSettings';

const initState = {
    history: [],
    buffer: null
}

 export default function mapEditorBufferReducer(state = initState, action) {
     switch (action.type) {

        case types.SAVE_FLOOR_TO_HISTORY:

            let history = state.history;
            history.unshift(JSON.stringify(action.payload));
            if (!!history[settings.CANCEL_ACTION_HISTORY_SIZE]) delete history[settings.CANCEL_ACTION_HISTORY_SIZE];

            return {
                ...state,
                history: history
            }

        case types.SET_FLOOR_FROM_HISTORY:
            
            let new_history = state.history;
            new_history.shift();
            
            return {
                ...state,
                history: new_history
            }

        case types.COPY_TO_BUFFER:
            
            return {
                ...state,
                buffer: action.payload
            }

        case types.CLEAR_BUFFER:
            
            return {
                ...state,
                buffer: null
            }
 
         default:
             return state;
    }
 }
 