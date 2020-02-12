import React, { useCallback } from 'react';
import { SectionList, View, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

import Colors from '../constants/Colors';
import { fetchRecommendedMovieData } from '../store/user/user.actions';

import { setCurrentMovieDataLocation } from '../store/interface/interface.actions';

import FilmItem from './FilmItem';

const FilmSectionsList = ({ navigation, sections, listType }) => {
  const dispatch = useDispatch();

  return (
    <SectionList
      initialNumToRender={20}
      sections={sections}
      keyExtractor={item => item.id}
      renderSectionHeader={({ section }) => {
        return (
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        );
      }}
      renderItem={({ item }) => {
        return (
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
      )}}
    />
  );
};

const styles = StyleSheet.create({
  sectionTitleContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: Colors.secondary
  },
  sectionTitle: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default FilmSectionsList;