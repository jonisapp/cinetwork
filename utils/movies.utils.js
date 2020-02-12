import Rating from '../model/rating';
import CriterionAverageRating from '../model/criterionAverageRating';

export const sortMoviesAlphabetically = (movies => {
  return movies.sort((a, b) => a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1);
});

export const sortMoviesByCriterion = (arr_movies, criterion) => {
  let currentCriterionValue = arr_movies[0][criterion];
  let currentMoviesSortedByCurrentCriterion = [];
  let moviesSortedByCriterion = [];
  while(arr_movies.length > 0) {
    currentMoviesSortedByCurrentCriterion = arr_movies.filter(movie => {
      if(movie[criterion] === currentCriterionValue) {
        return movie;
      }
    });
    arr_movies = arr_movies.filter(movie => {
      if(movie[criterion] !== currentCriterionValue) {
        return movie;
      }
    });
    moviesSortedByCriterion.push({
      title: currentCriterionValue,
      data: currentMoviesSortedByCurrentCriterion
    });
    currentCriterionValue = arr_movies.length !== 0 ? arr_movies[0][criterion] : null;
    currentMoviesSortedByCurrentCriterion = [];
  }
  const moviesSortedByCriterionAndByOrder = moviesSortedByCriterion.sort((movies_cat_1, movies_cat_2) => {
    if(movies_cat_1.title < movies_cat_2.title) {
      return -1;
    }
    else {
      return 1;
    }
  });
  return moviesSortedByCriterionAndByOrder;
};

export const getGlobalAverageRating = (ratings) => {
  const hasRatings = typeof ratings !== 'undefined' ? true : false;

  if(hasRatings) {
    let sum = 0;
    let ratingsCount = 0;
    Object.keys(ratings).forEach(user => {
      ++ratingsCount;
      sum += ratings[user].averageRating;
    });
    const cinetworkRating = Math.round((sum / ratingsCount) * 10) / 10;
    return cinetworkRating;
  }
  return null;
};

export const getCriterionAverageRating = (ratings) => {
  const criterionRatings = new CriterionAverageRating();
  Object.keys(ratings).forEach(user => {
    Object.keys(ratings[user].rating).forEach(criterion => {
      if(ratings[user].rating[criterion] !== 0) {
        criterionRatings[criterion].count += 1;
        criterionRatings[criterion].total += ratings[user].rating[criterion];
      }
    });
  });
  Object.keys(criterionRatings).forEach(criterion => {
    if(criterionRatings[criterion].count > 0) {
      criterionRatings[criterion].average = criterionRatings[criterion].total / criterionRatings[criterion].count;
    } else {
      delete criterionRatings[criterion];
    }
  });
  return criterionRatings;
};