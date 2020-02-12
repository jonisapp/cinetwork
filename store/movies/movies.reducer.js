import moviesActionsTypes from './movies.types';

import userActionsTypes from '../user/user.types';
import { addRatingToList, removeRatingFromList } from '../user/user.utils';

const initialState = {
  movies: [],
  lastFetchedMovieId: null,
  isMoviesLoaded: false
};

export const moviesReducer = (state = initialState, action) => {
  let updatedMoviesList = [];

  switch(action.type) {
    case moviesActionsTypes.FETCH_MOVIES_START:
      return {
        ...state,
        isMoviesLoaded: false
      }
    case moviesActionsTypes.FETCH_MOVIES:
      console.log('----------------------- fetch movies -----------------------');
      // action.payload.forEach(film => (film.title));
      return {
        ...state,
        movies: action.payload,
        lastFetchedMovieId: action.payload.length > 0 ? action.lastVisible : null,
        isMoviesLoaded: true
      }
    case moviesActionsTypes.FETCH_MOVIES_LAZYLOAD:
      console.log('---------------------- lazyload movies ---------------------')
      // action.payload.forEach(film => console.log(film.title));
      return {
        ...state,
        movies: [...state.movies, ...action.payload],
        lastFetchedMovieId: action.payload.length > 0 ? action.lastVisible : null,
        isMoviesLoaded: true
      }
    case moviesActionsTypes.FETCH_FRIENDS_MOVIES:
      console.log('---------------------- friends movies ---------------------')
      return {
        ...state,
        movies: action.payload,
        isMoviesLoaded: true
      }
    case userActionsTypes.RATE_FILM:
      if(action.path === 'movies') {
        updatedMoviesList = addRatingToList(state, action.location, action.filmId, action.userId, action.payload);
        return {
          ...state,
          movies: updatedMoviesList
        }
      } else {
        return state;
      }
    case userActionsTypes.DELETE_RATING:
      if(action.path === 'movies') {
        updatedMoviesList = removeRatingFromList(state, action.location, action.filmId, action.userId)
        return {
          ...state,
          movies: updatedMoviesList
        }
      } else {
        return state;
      }
    default: return state;
  }
};