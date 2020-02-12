import interfaceActionsTypes from './interface.types';
import userActionsTypes from '../user/user.types';

const initialState = {
  currentMovieLocation: null
};

export const interfaceReducer = (state = initialState, action) => {
  switch(action.type) {
    case interfaceActionsTypes.SET_CURRENT_MOVIE_DATA_LOCATION:
      return {
        ...state,
        currentMovieLocation: action.payload
      }
    case userActionsTypes.TOGGLE_FILM_TO_WATCH_LIST:
      if(state.currentMovieLocation.path === 'user') {
        return {
          ...state,
          currentMovieLocation: {
            path: 'user',
            location: 'moviesToWatch'
          }
        };
      }
      else {
        return state;
      }
    case userActionsTypes.TOGGLE_FILM_VIEWED_LIST:
      if(state.currentMovieLocation.path === 'user') {
        return {
          ...state,
          currentMovieLocation: {
            path: 'user',
            location: 'moviesViewed'
          }
        };
      }
      else {
        return state;
      }
    default: return state;
  }
}