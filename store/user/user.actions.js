import userActionsTypes from './user.types';

import { calculateUserRatingAverage } from './user.utils';

import { mongodb } from '../../stitch/stitch';
import firebase, { firestore } from '../../firebase/config';

// console.log(firebase.firestore.FieldValue.arrayUnion);

import { createTextIndex } from '../../utils/utils'; firestore

export const fetchMoviesRecommended = (userId) => {
  return async dispatch => {
    const userRef = firestore.doc(`users/${userId}`);
    const snapshot = await userRef.get();
    let moviesRecommended_arr = [];
    if(!!snapshot.exists) {
      const moviesRecommended = snapshot.data().moviesRecommended ? snapshot.data().moviesRecommended : null;
      if(!!moviesRecommended) {
        moviesRecommended_arr = Object.keys(moviesRecommended).map(userId => {
          return {
            title: moviesRecommended[userId].displayName,
            data: Object.keys(moviesRecommended[userId].movies).map(movieId => {
              return {
                id: movieId,
                title_fr: moviesRecommended[userId].movies[movieId]
              }
            })
          };
        });
      }
      dispatch({
        type: userActionsTypes.FETCH_RECOMMENDED_MOVIES,
        payload: moviesRecommended_arr
      });
    }
  };
};

export const fetchRecommendedMovieData = filmId => {
  return async dispatch => {
    let filmRef = firestore.collection('films').doc(filmId);
    const snapshot = await filmRef.get();
    dispatch({
      type: userActionsTypes.FETCH_RECOMMENDED_MOVIE_DATA,
      payload: {
        ...snapshot.data(),
        id: snapshot.id
      }
    });
  };
};

export const updateMoviesRecommendedLocalData = (moviesRecommended, moviesRecommendedData) => {
  return async dispatch => {
    moviesRecommended.forEach(friendMovies => {
      friendMovies.data.forEach(movie => {
        if(!moviesRecommendedData.find(movieData => movieData.id === movie.id)) {
          dispatch(fetchRecommendedMovieData(movie.id));
        }
      });
    })
  };
};

export const toggleFilmList = (movie, userProfile, list, isFilmViewed, isFilmToWatch, friends) => {
  return async dispatch => {
    dispatch({
      type: list === 'viewed' ? userActionsTypes.TOGGLE_FILM_VIEWED_LIST : userActionsTypes.TOGGLE_FILM_TO_WATCH_LIST,
      payload: movie,
    });

    let modifier = {$push:{}, $pull:{}};
    if((!isFilmViewed || isFilmToWatch) && list === 'viewed') {
      modifier.$push = {usersViewed: userProfile.id};
    } else {
      modifier.$pull = {usersViewed: userProfile.id};
    }
    if((!isFilmToWatch || isFilmViewed) && list === 'towatch') {
      modifier.$push = {...modifier.$push, usersToWatch: userProfile.id};
    } else {
      modifier.$pull = {...modifier.$pull, usersToWatch: userProfile.id};
    }
    if(Object.entries(modifier.$push).length === 0) { delete modifier.$push }
    if(Object.entries(modifier.$pull).length === 0) { delete modifier.$pull }
    mongodb().collection('films').updateOne({
      id: movie.id
    }, modifier,
    {
      upsert: true
    });

    await firestore.collection('films').doc(movie.id).set({
      'usersViewed': {
        [userProfile.id]: (!isFilmViewed || isFilmToWatch) && list === 'viewed'
      },
      'usersToWatch': {
        [userProfile.id]: (!isFilmToWatch || isFilmViewed) && list === 'towatch'
      }
    }
    , { merge: true });

    if(list === 'viewed' && !isFilmViewed) {
      const friendsWhoAreElilgible = friends.filter(friend => !!friend.expoPushToken);
      const notifications = friendsWhoAreElilgible.map(friend => {
        if(friend.expoPushToken) {
          return {
            to: friend.expoPushToken,
            sound: 'default',
            title: userProfile.displayName,
            body:  userProfile.displayName + ' a regardé le film ' + movie.title_fr + '. Découvrez ce film sans plus attendre !'
          }
        }
      });
      console.log(notifications);
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notifications)
      });
    }
  }
};

export const toggleUserList = (filmId, list, path, location) => {
  return {
    type: userActionsTypes.TOGGLE_USER_LIST,
    payload: {filmId, list},
    path,
    location
  };
}

export const rateFilm = (filmId, userId, displayName, ratingState, path, location) => {
  return async dispatch => {
    const userRating = {
      displayName,
      rating: ratingState,
      averageRating: calculateUserRatingAverage(ratingState)
    };
    await firestore.collection('films').doc(filmId).set({
      ratings: {
        [userId]: userRating
      }
    }, { merge: true });

    dispatch({
      type: userActionsTypes.RATE_FILM,
      filmId,
      userId,
      payload: userRating,
      path,
      location
    });
  }
}

export const deleteRating = (filmId, userId, path, location) => {
  return async dispatch => {
    firestore.collection('films').doc(filmId).update({
      [`ratings.${userId}`]: firebase.firestore.FieldValue.delete()
    });

    dispatch({
      type: userActionsTypes.DELETE_RATING,
      filmId,
      userId,
      path,
      location
    });
  }
}

export const setSortCriterion = (criterion) => {
  return {
    type: userActionsTypes.SET_SORT_CRITERION,
    criterion
  };
}

export const addList = (listname) => {
  return {
    type: userActionsTypes.ADD_LIST,
    payload: listname
  };
}

export const deleteList = (listname) => {
  return {
    type: userActionsTypes.DELETE_LIST,
    payload: listname
  };
}

export const setUserProfile = (userData) => {
  return async dispatch => {
    let userDoc = {};
    const userRef = firestore.doc(`users/${userData.uid}`);
    const snapshot = await userRef.get();
    if(!snapshot.exists) {
      const createdAt = new Date();
      const { email, displayName, photoURL } = userData;
      let nameIndex = createTextIndex(displayName);
      if(displayName.split(' ').length > 1) {
        const displayName_arr = displayName.split(' ');
        const inversedIndex = createTextIndex(displayName_arr[1] + " " + displayName_arr[0]);
        nameIndex = {...nameIndex, ...inversedIndex};
      }
      
      try {
        userDoc = {
          id: userData.uid, email, displayName, photoURL, createdAt, nameIndex
        };
         const res = await userRef.set(userDoc);
      } catch(err) {
        console.log(err); 
      }
    }
    else if(!!snapshot.exists) {
      userDoc = snapshot.data();
    }
    dispatch({
      type: userActionsTypes.SET_USER_PROFILE,
      payload: userDoc
    });
  };
};

export const setUserNotificationsToken = (token, userId) => {
  return async dispatch => {
    const userRef = firestore.doc(`users/${userId}`);
    userRef.set({
      expoPushToken: token
    }, { merge: true });

    dispatch({
      type: userActionsTypes.SET_USER_NOTIFICATIONS_TOKEN,
      payload: token
    });
  }
}

export const addFriend = (friendId) => {
  return async dispatch => {
    const userRef = firestore.doc(`users/${friendId}`);
    const snapshot = await userRef.get();
    if(!!snapshot.exists) {
      dispatch({
        type: userActionsTypes.ADD_FRIEND,
        payload: {
          id: snapshot.id,
          ...snapshot.data()
        }
      });
    }
  }
}

export const recommendFilmToFriend = (userId, displayName, filmId, filmTitle, friendId) => {
  return async dispatch => {
    const res = await firestore.collection('users').doc(friendId).set({
      moviesRecommended: {
        [userId]: {
          displayName,
          movies: {[filmId]: filmTitle}
        }
      }
    }, { merge: true });
  }
};