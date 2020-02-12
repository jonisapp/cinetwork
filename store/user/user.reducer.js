import userActionsTypes from './user.types';
import { addOrRemoveMovieFromList,
        removeMovieFromList,
        addRatingToList,
        removeRatingFromList } from './user.utils';

const initialState = {
  id: null,
  user: {
    id: 'u1',
    profile: {
      logged: false,
      expoPushToken: null
    },
  },
  moviesViewed: [],
  moviesToWatch: [],
  moviesRecommended: [],
  moviesRecommendedData: [],
  lists: [],
  moviesSortCriterion: 'alphabetical',
  friends: []
};

export const userReducer = (state = initialState, action) => {
  let updatedMoviesList = [];
  let updatedMoviesViewedList = [];
  let updatedMoviesToWatchList = [];
  let updatedMoviesRecommendedData = [];
  let updatedLists = [];
  let updatedFilm = {};

  switch(action.type) {
    case userActionsTypes.FETCH_RECOMMENDED_MOVIES:
      return {
        ...state,
        moviesRecommended: action.payload
      }
    case userActionsTypes.FETCH_RECOMMENDED_MOVIE_DATA:
        updatedMoviesRecommendedData = [...state.moviesRecommendedData];
        updatedMoviesRecommendedData.push(action.payload);
      return {
        ...state,
        moviesRecommendedData: updatedMoviesRecommendedData
      }
    case userActionsTypes.TOGGLE_FILM_VIEWED_LIST:
      updatedMoviesViewedList = addOrRemoveMovieFromList(state.moviesViewed, action.payload);
      updatedMoviesToWatchList = removeMovieFromList(state.moviesToWatch, action.payload);
      return {
        ...state,
        moviesViewed: updatedMoviesViewedList,
        moviesToWatch: updatedMoviesToWatchList
      };
    case userActionsTypes.TOGGLE_FILM_TO_WATCH_LIST:
      updatedMoviesToWatchList = addOrRemoveMovieFromList(state.moviesToWatch, action.payload);
      updatedMoviesViewedList = removeMovieFromList(state.moviesViewed, action.payload);
      return {
        ...state,
        moviesToWatch: updatedMoviesToWatchList,
        moviesViewed: updatedMoviesViewedList
      };
    case userActionsTypes.TOGGLE_USER_LIST:
      updatedMoviesList = state[action.location].map(film => {
        updatedFilm = {...film};
        if(film.id === action.payload.filmId) {
          updatedFilm.lists = typeof film.lists !== 'undefined' ? film.lists : [];
          if(updatedFilm.lists.includes(action.payload.list)) {
            updatedFilm.lists = film.lists.filter(list => list !== action.payload.list);
          }
          else {
            updatedFilm.lists.push(action.payload.list);
          }
        }
        return updatedFilm;
      });
      return {
        ...state,
        [action.location]: updatedMoviesList
      };
    case userActionsTypes.RATE_FILM:
      if(action.path === 'user') {
        updatedMoviesList = addRatingToList(state, action.location, action.filmId, action.userId, action.payload);
        return {
          ...state,
          [action.location]: updatedMoviesList
        }
      } else {
        return state;
      }
    case userActionsTypes.DELETE_RATING:
      if(action.path === 'user') {
        updatedMoviesList = removeRatingFromList(state, action.location, action.filmId, action.userId)
        return {
          ...state,
          [action.location]: updatedMoviesList
        }
      } else {
        return state;
      }
    case userActionsTypes.SET_SORT_CRITERION:
      return {
        ...state,
        moviesSortCriterion: action.criterion
      }
    case userActionsTypes.ADD_LIST:
      updatedLists = state.lists ? state.lists : [];
      if(!updatedLists.includes(action.payload)) {
        updatedLists.push(action.payload)
      }
      return {
        ...state,
        lists: updatedLists
      }
    case userActionsTypes.DELETE_LIST:
      updatedLists = state.lists.filter(list => list !== action.payload);
      return {
        ...state,
        lists: updatedLists
      }
// User profile
    case userActionsTypes.SET_USER_PROFILE:
      let { id, email, displayName, photoURL } = action.payload;
      return {
        ...state,
        profile: {
          id, logged: true, email: email, displayName, photoURL
        }
      }
    case userActionsTypes.SET_USER_NOTIFICATIONS_TOKEN:
      const expoPushToken = action.payload;
      return {
        ...state,
        profile: {
          ...state.profile,
          expoPushToken: expoPushToken
        }
      }
// User friends
    case userActionsTypes.ADD_FRIEND:
      let friend = {
        id: action.payload.id,
        displayName: action.payload.displayName,
        photoURL: action.payload.photoURL,
        expoPushToken: action.payload.expoPushToken
      }
      let updatedFriends = [...state.friends];
      if(!updatedFriends.find(friend => friend.id === action.payload.id)) {
        updatedFriends.push(friend);
      } else {
        updatedFriends = updatedFriends.filter(friend => friend.id !== action.payload.id);
        updatedFriends.push(friend);
      }
      return {
        ...state,
        friends: updatedFriends
      }
    default: return state;
  }
};