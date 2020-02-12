import interfaceActionsTypes from './interface.types';

export const setCurrentMovieDataLocation = (path, location) => {
  return {
    type: interfaceActionsTypes.SET_CURRENT_MOVIE_DATA_LOCATION,
    payload: {path, location}
  }
};