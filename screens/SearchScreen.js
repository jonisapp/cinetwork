import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useSelector } from 'react-redux';
import {  ScrollView, View, Image, TextInput, Text,
          FlatList, TouchableOpacity, StyleSheet,
          ActivityIndicator, Animated } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import { useDispatch } from 'react-redux';

import DrawerMenuButton from '../components/drawerMenuButton';
import SwitchButtons from '../components/SwitchButtons';
import Colors from '../constants/Colors';

import GENRES from '../interface/genres';
import YEARS from '../interface/years';
import ZoomFadeIn_animation from '../animations/ZoomFadeIn';

import { firestore } from '../firebase/config';
import { fetchMovies, fetchFriendsMovies } from '../store/movies/movies.actions';
import { setCurrentMovieDataLocation } from '../store/interface/interface.actions';

import { getGlobalAverageRating } from '../utils/movies.utils';
//import FriendsList from '../components/FriendsList';

const searchQueryInitialState = {
  fetch: false
};

const searchQueryReducer = (state, action) => {
  switch(action.type) {
    case 'setQuery':
      return action.payload;
    case 'updateQuery':
      return {
        ...state,
        ...action.payload
      };
    case 'reset':
      return {
        ...state,
        fetch: false
      }
  }
}

const MovieCard = ({ onSelect, imageUrl, ratings }) => {
  const averageRating = getGlobalAverageRating(ratings);
  return (
    <View style={{...styles.cardContainer}}>
      <TouchableOpacity
        style={styles.card}
        onPress={onSelect}
      >
        <View style={{borderWidth: 0.5, borderColor: '#333'}}>
          <View style={{position: 'relative', elevation : 3, borderWidth: 0.5, borderColor: Colors.backgroundDark}}>
            <Image
            style={styles.image}
            source={{ uri: imageUrl ? imageUrl : './' }}
            resizeMode='cover'
            />
            { averageRating
            ?
              <View style={styles.averageRaitingContainer}>
                <Text style={{color: '#333', fontWeight: 'bold'}}>{ averageRating }{averageRating.toString().length === 1 ? '.0' : null}</Text>
              </View>
            : null }
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const SearchScreen = ({ navigation }) => {
  const isMoviesLoaded = useSelector(state => state.movies.isMoviesLoaded);
  const films = useSelector(state => state.movies.movies);
  const lastFetchedMovie = useSelector(state => state.movies.lastFetchedMovieId);
  const friends = useSelector(state => state.user.friends);
  const userProfile = useSelector(state => state.user.profile);

  const [searchCriterion, setSearchCriterion] = useState('Genres');
  const [filterByFriends, setFilterByFriends] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [previousSearchText, setPreviousSearchText] = useState('');

  const [animatedViewPagerSwipe] = useState(new Animated.Value(0.1));

  const [searchQueryState, searchQueryDispatch] = useReducer(searchQueryReducer, searchQueryInitialState);

  const dispatch = useDispatch();

  const lazyLoad = useCallback(() => {
    console.log('lazy');
    if(!!lastFetchedMovie && isMoviesLoaded && searchText === '' && !searchQueryState.friends) {
      dispatch(fetchMovies({ ...searchQueryState, startAfter: lastFetchedMovie }));
    }
  }, [lastFetchedMovie, films]);

  const setPreviousSearchTextHandler = useCallback((text) => {
    setPreviousSearchText(text);
  }, [setPreviousSearchText]);

  useEffect(() => {
    setTimeout(() => {
      navigation.setParams({ searchText, setSearchText, setPreviousSearchTextHandler });
    }, 1);
  }, [searchText, setSearchText, setPreviousSearchTextHandler]);

  useEffect(() => {
    if(searchText.length > 3 && searchText.length > previousSearchText.length) {
      this.viewPager.setPage(1);
      dispatch(fetchMovies({searchText}));
    }
    else if(searchText === '') {
      this.viewPager.setPage (0);
    }
  }, [searchText, dispatch, previousSearchText]);

  useEffect(() => {
    if(!!searchQueryState.fetch) {
      if(typeof searchQueryState.friends !== 'undefined') {
        if(searchQueryState.friends.length > 0) {
          this.viewPager.setPage(1);
          console.log(searchQueryState);
          dispatch(fetchFriendsMovies(searchQueryState));
        }
      } else {
        this.viewPager.setPage(1);
        dispatch(fetchMovies(searchQueryState));
      }
      searchQueryDispatch({ type: 'reset' });
    }
  }, [searchQueryState]);

  let genres = [];
  for(const genre in GENRES) {
    genres.push(genre);
  }

  const animatedStyle = {
    backgroundColor: animatedViewPagerSwipe.interpolate({
      inputRange:[0.01, 0.99],
      outputRange: ['#20002B', Colors.backgroundDark]
    })
  };

  return (
    <ViewPager
      ref={(viewPager) => { this.viewPager = viewPager }}
      onPageScroll={(e) => {
        if(e.nativeEvent.offset !== 0) {
          animatedViewPagerSwipe.setValue(e.nativeEvent.offset);
        }
      }}
      style={styles.viewPager}
    >
      <Animated.View style={[{flex: 1, height: '100%'}, animatedStyle]}>
        <ScrollView style={{flex: 1,width: '100%', height: '100%'}}>
          <ZoomFadeIn_animation>
            <View style={styles.screenChoice}>
              <SwitchButtons
                defaultSelected='Films'
                buttons={['Films', 'Séries']}
                onSwitch={(index) => { console.log(index) }}
              />
              <SwitchButtons
                defaultSelected='Genres'
                disposition='horizontal'
                buttons={['Genres', 'Années', 'Amis']}
                persistableValues={['Amis']}
                maxSwitchedButtons={2}
                onSwitch={ criterion => { if(criterion !== 'Amis') { setSearchCriterion(criterion) } else { setFilterByFriends(!filterByFriends) }}}
              />
              { searchCriterion === 'Genres' ?
                <SwitchButtons
                  onPress={genre => {
                    if(genre === 'tous' && !filterByFriends) {
                      searchQueryDispatch({ type: 'setQuery', payload: {genre: 'tous', fetch: true} });
                      return;
                    } else if(['aventure', 'fantastique', 'romance', 'western'].includes(genre) && !filterByFriends) {
                      searchQueryDispatch({ type: 'setQuery', payload: {genre: genre.toLowerCase(), fetch: true} });
                      return;
                    }

                    searchQueryDispatch({ type: 'setQuery', payload: {genre: genre.toLowerCase(), fetch: false} });
                  }}
                  disposition='grid'
                  buttons={genres}
                /> : null
              }
              {
                searchCriterion === 'Genres' && typeof searchQueryState.genre !== 'undefined' && !filterByFriends ?
                <SwitchButtons
                  onSwitch={subgenre => {
                    searchQueryDispatch({ type: 'updateQuery', payload: {subgenre: subgenre.toLowerCase(), fetch: true} });
                  }}
                  disposition='grid'
                  buttons={GENRES[searchQueryState.genre]}
                /> : null
              }
              { searchCriterion === 'Années' ?
                <SwitchButtons
                  onSwitch={years => {
                    if(!filterByFriends) {
                      searchQueryDispatch({ type: 'setQuery', payload: {from: YEARS[years].from, to: YEARS[years].to, fetch: true} });
                    } else {
                      searchQueryDispatch({ type: 'setQuery', payload: {from: YEARS[years].from, to: YEARS[years].to, fetch: false} });
                    }
                  }}
                  disposition='grid'
                  buttons={Object.keys(YEARS).map(label => label)}
                /> : null
              }
              { filterByFriends &&
                <React.Fragment>
                  <SwitchButtons
                    onSwitch={(friend, friends) => {
                      searchQueryDispatch({ type: 'updateQuery', payload: {friends, fetch: false} });
                    }}
                    disposition='vertical'
                    buttons={[...friends.map(friend => {return { value: friend.id, label: friend.displayName }}), {value: userProfile.id, label: userProfile.displayName}]}
                    maxSwitchedButtons={3}
                  />
                  <SwitchButtons
                    onPress={(viewed) => {
                      searchQueryDispatch({ type: 'updateQuery', payload: {viewed, fetch: true} });
                    }}
                    disposition='horizontal'
                    buttons={[{value: true, label: 'visionné'}, {value: false, label: 'non visionné'}]}
                  />
                </React.Fragment>
              }
            </View>
          </ZoomFadeIn_animation>
        </ScrollView>
      </Animated.View>
      <Animated.View style={[styles.screen, animatedStyle]}>
        <FlatList
          keyExtractor={item => item.id}
          data={films}
          renderItem={({ item }) => (
            <MovieCard
              onSelect={() => {
                dispatch(setCurrentMovieDataLocation('movies', 'movies'));
                if(typeof searchQueryState.friends !== 'undefined') {
                  let moviesRef = firestore.collection('films');
                  moviesRef.doc(item.id).get().then(snapshot => {
                    navigation.navigate('film', { id: item.id, film: snapshot.data(), listType: 'discover' });
                  });
                } else {
                  navigation.navigate('film', { id: item.id, film: item, listType: 'discover' });
                }
              }}
              imageUrl={item.coverImageUrl}
              ratings={item.ratings}
            />
          )}
          horizontal={false}
          numColumns={3}
          onEndReached={lazyLoad}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            lastFetchedMovie
            ?
              (<View style={styles.spinnerContainer}>
                { !isMoviesLoaded ? <ActivityIndicator size='large' color={Colors.primary} /> : null }
              </View>)
            : null
          }
        />
      </Animated.View>
    </ViewPager>
  );
};

SearchScreen.navigationOptions = ({ navigation }) => {
  const setPreviousSearchTextHandler = navigation.getParam('setPreviousSearchTextHandler');
  const setSearchText = navigation.getParam('setSearchText');
  const searchText = navigation.getParam('searchText');
  return {
    headerTitle: 'Rechercher',
    headerLeft: <DrawerMenuButton navigation={navigation} />,
    headerRight: <TextInput style={styles.searchInput} onChangeText={(text) => {
      setPreviousSearchTextHandler(searchText);
      setSearchText(text);
    }} />
  };
};

const styles = StyleSheet.create({
  viewPager: {
    flex: 1
  },
  screenChoice: {
    height: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20
  },
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
  },
  screen: {
    padding: 5,
    width: '100%',
    height: '100%'
  },
  searchInput: {
    width: 150,
    backgroundColor: 'white',
    marginRight: 10,
    borderRadius: 5,
    paddingHorizontal: 5
  },
  cardContainer: {
    flex: 1/3
  },
  averageRaitingContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 28,
    paddingLeft: 5,
    paddingBottom: 1,
    paddingRight: 2,
    borderBottomLeftRadius: 15,
    backgroundColor: 'rgba(255, 216, 0, 0.8)',
    borderLeftWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(177, 107, 0, 0.8)'
  },
  card: {
    margin: 5,
    height: 150
  },
  image: {
    width: '100%',
    height: '100%'
  }
});

export default SearchScreen;