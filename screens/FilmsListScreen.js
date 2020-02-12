import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import Menu, { MenuItem } from 'react-native-material-menu';

import HeaderButton from '../components/HeaderButton';
import DrawerMenuButton from '../components/drawerMenuButton';
import FilmList from '../components/FilmList';
import FilmSectionsList from '../components/FilmSectionsList';
import Colors from '../constants/Colors';

import { setSortCriterion } from '../store/user/user.actions';
import { sortMoviesAlphabetically, sortMoviesByCriterion } from '../utils/movies.utils';


const FilmsViewed = ({ navigation }) => {
  const sortCriterion = useSelector(state => state.user.moviesSortCriterion);
  const listType = navigation.getParam('listType');
  var movies = listType !== 'discover' ? useSelector(state => state.user[listType]) : [];
  var lists = useSelector(state => state.user.lists);

  // console.log(movies);

  const [rendered, setRendered] = useState(false);
  const [activeList, setActiveList] = useState('tous');

  const dispatch = useDispatch();

  const setSortingCriterionHandler = useCallback(criterion => {
    setRendered(false);
    dispatch(setSortCriterion(criterion));
  }, [dispatch]);

  const setListHandler = useCallback(list => {
    setRendered(false);
    setActiveList(list);
  }, [setActiveList]);

  useEffect(() => {
    setTimeout(() => {
      navigation.setParams({ setSortingCriterionHandler, setListHandler, lists });
    }, 1);
  }, [setSortingCriterionHandler, setListHandler, lists]);

  useEffect(() => {
    setTimeout(() => {
      navigation.setParams({ activeList, sortCriterion });
    }, 1);
  }, [sortCriterion, activeList]);

  const renderMovieListItemsSortedAlphabetically = (movies) => (
    <FilmList
      navigation={navigation}
      films={sortMoviesAlphabetically(movies)}
      listType={listType}
    />
  );

  const renderMovieListItemsGroupedByCriterionValue = (movies, criterion) => {
    const moviesGroupedByCriterionValue = sortMoviesByCriterion(movies, criterion);
    return (
      <FilmSectionsList
        sections={moviesGroupedByCriterionValue}
        navigation={navigation}
        listType={listType}
      />
    );
  };

  const renderMovies = useCallback((movies) => {
    if(activeList !== 'tous') {
      movies = movies.filter((film) => {
        if(typeof film.lists !== 'undefined') {
          return film.lists.includes(activeList)
        }
        return false;
      });
    }

    if(movies.length === 0) {
      return [];
    }

    switch(sortCriterion) {
      case 'alphabetical':
        return renderMovieListItemsSortedAlphabetically(movies);
      default:
        return renderMovieListItemsGroupedByCriterionValue(movies, sortCriterion);
    }
  }, [movies, sortCriterion, activeList]);
  
  return (
    <View>
      {
        (movies.length > 0 && navigation.getParam('listType') !== 'moviesRecommended')
        ?
          renderMovies(movies)
        : null
      }
      {
        navigation.getParam('listType') === 'moviesRecommended'
        ?
        <FilmSectionsList
          sections={movies}
          navigation={navigation}
          listType='moviesRecommended'
        /> : null
      }
    </View>
  );
};

FilmsViewed.navigationOptions = ({ navigation }) => {
  var menu = { orderBy: null, lists: null };
  const setMenuRef = (menuType, ref) => { menu[menuType] = ref };
  const showMenu = (menuType) => { menu[menuType].show() };
  const hideMenu = (menuType) => { menu[menuType].hide() };
  const setSortingCriterionHandler = navigation.getParam('setSortingCriterionHandler');
  const setListHandler = navigation.getParam('setListHandler');
  const lists = navigation.getParam('lists');
  const sortCriterion = navigation.getParam('sortCriterion');
  const activeList = navigation.getParam('activeList');
  // console.log(lists);
  const setSortingCriterion = criterion => {
    setSortingCriterionHandler(criterion);
    hideMenu('orderBy');
  };
  const listType = navigation.getParam('listType');
  const _onChangeListTypeHandler = navigation.getParam('_onChangeListTypeHandler');
  return {
    headerTitle: listType === 'moviesViewed' ? "visionné" : (listType === 'moviesToWatch' ? 'à voir' : 'recommandé'),
    headerLeft: <DrawerMenuButton navigation={navigation} />,
    headerRight: (
      <View style={{flexDirection: 'row'}}>
        <Menu
          ref={(ref) => setMenuRef('orderBy', ref)}
          button={(
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
              <Item title='dropdown' iconName='md-funnel' color='white' onPress={() => showMenu('orderBy')} />
            </HeaderButtons>
          )}
        >
          <MenuItem onPress={() => { setSortingCriterion('alphabetical') }}>
            <Text style={{color: sortCriterion === 'alphabetical' ? Colors.selectedTextItem : Colors.textDefault}}>alphabétique</Text>
          </MenuItem>
          <MenuItem onPress={() => { setSortingCriterion('director') }}>
            <Text style={{color: sortCriterion === 'director' ? Colors.selectedTextItem : Colors.textDefault}}>réalisateur</Text>
          </MenuItem>
          <MenuItem onPress={() => { setSortingCriterion('genre') }}>
            <Text style={{color: sortCriterion === 'genre' ? Colors.selectedTextItem : Colors.textDefault}}>genre</Text>
          </MenuItem>
          <MenuItem onPress={() => { setSortingCriterion('year') }}>
            <Text style={{color: sortCriterion === 'year' ? Colors.selectedTextItem : Colors.textDefault}}>année</Text>
          </MenuItem>
        </Menu>
        <Menu
          ref={(ref) => setMenuRef('lists', ref)}
          button={(
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
              <Item title='dropdown' iconName='md-list-box' color='white' onPress={() => showMenu('lists')} />
            </HeaderButtons>
          )}
        >
          <MenuItem onPress={() => { setListHandler('tous'); hideMenu('lists'); }}>
            <Text style={{color: activeList === 'tous' ? Colors.selectedTextItem : Colors.textDefault}}>tous les films</Text>  
          </MenuItem>
          { lists ?
            lists.map((list) => (
              <MenuItem key={list} onPress={() => { setListHandler(list); hideMenu('lists'); }}>
                <Text style={{color: activeList === list ? Colors.selectedTextItem : Colors.textDefault}}>{ list }</Text>
              </MenuItem>
            )) : null
          }
        </Menu>
      </View>
    )
  };
};

const styles = StyleSheet.create({
  spinnerContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default FilmsViewed;