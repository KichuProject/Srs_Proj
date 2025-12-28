import { TRAINER_ACTIONS } from './actionTypes';

export const trainerReducer = (state, action) => {
  switch (action.type) {
    case TRAINER_ACTIONS.ADD_TRAINER:
      return [...state, { ...action.payload, id: Date.now().toString() }];
    
    case TRAINER_ACTIONS.UPDATE_TRAINER:
      return state.map(trainer =>
        trainer.id === action.payload.id ? action.payload : trainer
      );
    
    case TRAINER_ACTIONS.DELETE_TRAINER:
      return state.filter(trainer => trainer.id !== action.payload);
    
    case TRAINER_ACTIONS.SET_TRAINERS:
      return action.payload;
    
    default:
      return state;
  }
};
