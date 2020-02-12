import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../constants/Colors';

const FilmItem = ({id, onSelect, title, title_fr}) => {
  const filmViewed = useSelector(state => state.user.moviesViewed.find(movie => movie.id === id));
  const filmToWatch = useSelector(state => state.user.moviesToWatch.find(movie => movie.id === id));
  const averageRating = filmViewed ? filmViewed.averageRating : null;

  const _onSelectHandler = () => {
    onSelect(!!filmViewed, !!filmToWatch, averageRating);
  }

  return (
    <TouchableOpacity style={styles.item} onPress={_onSelectHandler}>
      <Text style={styles.title}>{ title_fr }</Text>
      <Text style={styles.rating}>{ averageRating }</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#E3DCD3',
    padding: 15,
    backgroundColor: '#F4F0EB'
  },
  title: {
    fontFamily: 'open-sans-cond',
    fontSize: 18,
    color: Colors.textDefault
  },
  rating: {
    fontFamily: 'open-sans-cond-bold',
    fontSize: 18,
    color: Colors.textDefault
  }
});

export default FilmItem;