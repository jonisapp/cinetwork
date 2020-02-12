import { firestore } from '../../firebase/config';
import { mongodb } from '../../stitch/stitch';

import moviesActionsTypes from './movies.types';

export const fetchFriendsMovies = (params = null) => {
  return dispatch => {
    dispatch(fetchMoviesStart());
    if(Array.isArray(params.friends)) {
      if(params.friends.length > 0) {
        let query = {'usersViewed': {[`$${!params.viewed ? 'nin' : 'all'}`]: params.friends}};
        if(typeof params.genre !== 'undefined') {
          if(params.genre !== 'tous') {
            query.genres = params.genre
          }
        } else if(typeof params.from !== 'undefined') {
          if(!(params.from === 1890 && params.to === 2020)) {
            query.$and = [
              {year: {$gt: params.from}},
              {year: {$lt: params.to}}
            ];
          }
        }
        console.log(query);
        mongodb().collection('films').find(query).toArray().then(movies => {
          dispatch({
            type: moviesActionsTypes.FETCH_FRIENDS_MOVIES,
            payload: movies
          });
        });
      }
    }
  }
}

export const fetchMovies = (params = null) => {
  const hasSubgenre = typeof params.subgenre !== 'undefined';
  const isSubgenreAll = hasSubgenre ? (params.subgenre === 'tous' ? true : false) : false;
  return async dispatch => {
    ///////////////////////////
    tmpParams = { ...params };
    delete tmpParams.startAfter;
    // console.log(tmpParams);
    
    //////////////////////////
    let isLazyLoad = false;
    dispatch(fetchMoviesStart());
    let moviesRef = firestore.collection('films');
    if(params) {
      if(typeof params.searchText !== 'undefined') {
        if(params.searchText !== '') {
          if(parseInt(params.searchText) > 1895 && parseInt(params.searchText) < 2050) {
            moviesRef = moviesRef.where('year', '==', parseInt(params.searchText));
          } else {
            moviesRef = moviesRef.where('searchIndex.'+params.searchText.trim().toLowerCase(), '==', true);
          }
        }
      } else if(typeof params.genre !== 'undefined') {
        if(params.genre !== 'tous' && !Array.isArray(params.friends)) {
          if(isSubgenreAll || ['aventure', 'fantastique', 'romance', 'western'].includes(params.genre)) {
            moviesRef = moviesRef.where('genres', 'array-contains', params.genre);
          } else {
            moviesRef = moviesRef.where('genre', '==', params.genre);
          }
          moviesRef = moviesRef.orderBy('title');
        } else {
          moviesRef = moviesRef.where('genre', '==', params.genre);
        }
      } else if(typeof params.from !== 'undefined') {
        if(!(params.from === 1890 && params.to === 2020)) {
          moviesRef = moviesRef.where('year', '>=', params.from)
          .where('year', '<=', params.to)
          .orderBy('year');
        }
      }
      if(hasSubgenre) {
        if(params.subgenre !== 'tous') {
          moviesRef = moviesRef.where('subgenres', 'array-contains', params.subgenre);
        }
      }

      moviesRef = moviesRef.limit(18);

      if(typeof params.startAfter !== 'undefined') {
        isLazyLoad = true;
        moviesRef = moviesRef.startAfter(params.startAfter);
      }
    }
    const snapshot = await moviesRef.get();
    const movies = snapshot.docs.map(movie => {
      const movieData = movie.data();
      return {
        ...movieData,
        id: movie.id
      };
    });

    const lastVisible = snapshot.docs[snapshot.docs.length-1];

    dispatch({
      type: isLazyLoad ? moviesActionsTypes.FETCH_MOVIES_LAZYLOAD : moviesActionsTypes.FETCH_MOVIES,
      payload: movies,
      lastVisible
    });
  }
}

export const fetchMoviesStart = () => {
  return {
    type: moviesActionsTypes.FETCH_MOVIES_START
  }
}




// const batch = firestore.batch();
// movies.forEach(movie => {
//   const newDoc = cacaRef.doc();
//   batch.set(newDoc, {...movie});
// });
// batch.commit();