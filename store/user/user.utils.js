export const addOrRemoveMovieFromList = (list, film) => {
  if(!list.find((movie => movie.id === film.id))) {
    return [...list, film];
  }
  else {
    return list.filter(movie => movie.id !== film.id);
  }
};

export const removeMovieFromList = (list, film) => {
  return list.filter(movie => movie.id !== film.id);
};

export const calculateUserRatingAverage = (rating) => {
  var averageRating = 0.0;
  var criterionsQuantity = 0;
  var sum = 0;
  Object.keys(rating).forEach(criterion => {
    if(rating[criterion] !== 0) {
      ++criterionsQuantity;
      sum += rating[criterion];
    }
    averageRating = Math.round((sum / criterionsQuantity) * 10) / 10;
  });
  return averageRating;
}

export const addRatingToList = (state, location, filmId, userId, ratingState) => {
  return state[location].map(film => {
    if(film.id === filmId) {
      ratings = film.ratings ? film.ratings : {};
      return {
        ...film,
        ratings: {...ratings, [userId]: ratingState}
      }
    }
    return film;
  });
};

export const removeRatingFromList = (state, location, filmId, userId) => {
  return state[location].map(film => {
    if(film.id === filmId && typeof film.ratings !== 'undefined') {
      let updatedRatings = {...film.ratings}
      delete updatedRatings[userId];
      return {
        ...film,
        ratings: updatedRatings
      }
    }
    return film;
  });
}