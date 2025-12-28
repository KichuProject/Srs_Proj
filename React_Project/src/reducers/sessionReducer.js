import { SESSION_ACTIONS } from './actionTypes';

export const sessionReducer = (state, action) => {
  switch (action.type) {
    case SESSION_ACTIONS.ADD_SESSION:
      return [...state, { ...action.payload, id: Date.now().toString() }];
    
    case SESSION_ACTIONS.UPDATE_SESSION:
      return state.map(session =>
        session.id === action.payload.id ? action.payload : session
      );
    
    case SESSION_ACTIONS.DELETE_SESSION:
      return state.filter(session => session.id !== action.payload);
    
    case SESSION_ACTIONS.SET_SESSIONS:
      return action.payload;
    
    default:
      return state;
  }
};
