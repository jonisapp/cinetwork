import React from 'react';
import { FlatList } from 'react-native';
import { useDispatch } from 'react-redux';

import FilmItem from './FilmItem';

import { setCurrentMovieDataLocation } from '../store/interface/interface.actions';

const FilmList = ({ films, navigation, listType }) => {

  const dispatch = useDispatch();

  return (
    <FlatList
      initialNumToRender={20}
      keyExtractor={item => item.id}
      data={films}
      renderItem={({ item }) => (
        <FilmItem
          id={item.id}
          title={item.title}
          title_fr={item.title_fr}
          year={item.year}
          onSelect={(isFilmViewed, isFilmToWatch, averageRating) => {
            const isRated = !!averageRating;
            dispatch(setCurrentMovieDataLocation('user', listType));
            navigation.navigate('film', {
              id: item.id, title: item.title, film: item, averageRating, isFilmViewed, isFilmToWatch, isRated, listType
            });
          }}
        />
      )}
    />
  );
};

export default FilmList