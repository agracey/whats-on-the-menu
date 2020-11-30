import { createStore } from "redux";

const lunch = 'Not Decided', dinner = 'Not Decided'
const initState = {
    'monday': {lunch, dinner},
    'tuesday': {lunch, dinner},
    'wednesday': {lunch, dinner},
    'thursday': {lunch, dinner},
    'friday': {lunch, dinner},
    'saturday': {lunch, dinner},
    'sunday': {lunch, dinner}
}

const rootReducer = (state = initState, action) =>{

    switch (action.type){
      case 'LIST_LOAD':
          return {...state, ...action.payload}
      default:
          return state
    }
}

export default createStore(rootReducer);
