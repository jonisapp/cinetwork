import React, { useState, useCallback, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Animated, TouchableWithoutFeedback, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import StarRating from 'react-native-star-rating';
import Flag from 'react-native-flags';
import ExpandableCard from '../components/ExpandableCard';

import SafeAreaView from '../components/SafeAreaView';
import Button from '../components/Button';
import Colors from '../constants/Colors';
import DistributionDiagram from '../components/DistributionDiagram';

import LANDS from '../interface/lands';
import { toggleFilmList, fetchRecommendedMovieData } from '../store/user/user.actions';
import ratingCriterions from '../interface/ratingCriterions';
import { getGlobalAverageRating, getCriterionAverageRating } from '../utils/movies.utils';

const FilmScreen = ({ navigation }) => {

  const dispatch = useDispatch();

  const userProfile = useSelector(state => state.user.profile);
  const userFriends = useSelector(state => state.user.friends);
  
  const filmId = navigation.getParam('id');
  const { location, path } = useSelector(state => state.interface.currentMovieLocation);
  var selectedFilm = useSelector(state => state[path][location].find(film => film.id === filmId));

  // temporaire
  if(!selectedFilm || typeof selectedFilm.title_fr === 'undefined') {
    selectedFilm = navigation.getParam('film');
  }

  console.log(selectedFilm);

  const {
    title,
    title_fr,
    director_firstname,
    director_name,
    scenarists,
    actors,
    genre,
    subgenres,
    lands,
    year,
    duration,
    music,
    synopsis,
    screenImageUrl,
    ratings,
    trailerYoutubeId
  } = selectedFilm;

  let cinetworkRating = getGlobalAverageRating(ratings);

  const hasRatings = typeof ratings !== 'undefined' ? true : false;
  let isUserRated = false;

  const iterableUsersRatings = hasRatings ? Object.keys(selectedFilm.ratings).map(user => { return { userId: user, ...selectedFilm.ratings[user] } }) : [];

  if(hasRatings) {
    isUserRated = iterableUsersRatings.find(user => user.userId === userProfile.id) ? true : false;
  }
  
  let userAverageRating = isUserRated ? iterableUsersRatings.find(user => user.userId === userProfile.id).averageRating : null;

  const noImageAvailableUrl = 'https://bionic.com.cy/packs/_/assets/images/no-image-placeholder-eb7da0b9897e4da2bd189d1fd0c17ebb.jpg';
  const isFilmViewed = !!useSelector(state => state.user.moviesViewed.find(film => film.id === filmId));
  const isFilmToWatch = !!useSelector(state => state.user.moviesToWatch.find(film => film.id === filmId));

  let selectedFilmList = null;
  if(isFilmToWatch || isFilmViewed) {
    selectedFilmList = isFilmViewed ? 'moviesViewed' : 'moviesToWatch';
  }

  const landsAndFlags = Array.isArray(lands) ? lands.map(land => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{marginRight: 5, fontFamily: 'open-sans-cond', fontSize: 18}}>{ LANDS[land] ? LANDS[land] : land  }</Text>
        <Flag code={land} size={24}/>
      </View>
    );
  }) : undefined;

  const _renderMovieInformation = (key, value) => {
    return (
      <View style={styles.labelContainer}>
        <View><Text style={styles.label}>{ key }</Text></View>
        {
          Array.isArray(value) ?
          <View style={{flex: 1}}>
            {
              value.map(item => (
                <Text key={ item } style={{...styles.text, textAlign: 'right'}}>{ item }</Text>
              ))
            }
          </View>
          :
            <View style={{flex: 1}}><Text style={styles.text}>{ value }</Text></View>
        }
      </View>
    );
  };

  const toggleFilmViewedListHandler = useCallback(() => {
    dispatch(toggleFilmList(selectedFilm, userProfile, 'viewed', isFilmViewed, isFilmToWatch, userFriends));
  }, [dispatch, selectedFilm, isFilmViewed, isFilmToWatch]);

  const toggleFilmToWatchListHandler = useCallback(() => {
    dispatch(toggleFilmList(selectedFilm, userProfile, 'towatch', isFilmViewed, isFilmToWatch, userFriends));
  }, [dispatch, selectedFilm, isFilmViewed, isFilmToWatch]);

  const _rateFilmHandler = useCallback(() => {
    navigation.navigate('ratingModal', { film: selectedFilm, path, location });
  }, [selectedFilm, location, path]);

  const StarRatingDefaultProps = {
    starSize: 20,
    disabled: true,
    halfStarEnabled: true,
    emptyStarColor: Colors.primaryTransparent,
    fullStarColor: Colors.active,
    maxStars: 5
  };
  const _renderComments = () => {
    if(typeof ratings !== 'undefined') {
      return Object.keys(ratings).map(user => {
        return (
          <View
            key={ratings[user].displayName}
            style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
          >
            <View>
              <Text style={styles.userText}>{ ratings[user].displayName }</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{marginRight: 10}}>
                <Text style={styles.userText}>({ ratings[user].averageRating })</Text>
              </View>
              <StarRating
                rating={ratings[user].averageRating}
                {...StarRatingDefaultProps}
              />
            </View>
          </View>
        )
      });
    }
    else {
      return null;
    }
  };

  const [imdbRating, setImdbRating] = useState('');

  const [ratingContainerMaximized, setRatingContainerMaximized] = useState(false);

  const [imageAnimatedValue] = useState(new Animated.Value(0));
  const [imageOpacityValue] = useState(new Animated.Value(0));
  const [interpolationHandledByAnimation] = useState({ value: false });
  const _scrollMomentumHandler = (e) => {
    if(interpolationHandledByAnimation.value || true) {
      imageAnimatedValue.stopAnimation();
      Animated.timing(imageAnimatedValue, {
        toValue: e.nativeEvent.contentOffset.y,
        duration: 500,
        useNativeDriver: true
      }).start(() => {
        interpolationHandledByAnimation.value = false;
      });
    }
  };
  const _scrollHandler = (e) => {
    imageOpacityValue.setValue(e.nativeEvent.contentOffset.y);
    if(!interpolationHandledByAnimation.value) {
      const velocity = e.nativeEvent.velocity.y;
      if(Math.abs(velocity) < 4 || Math.abs(velocity) > 9 && Math.abs(velocity) < 11) {
        imageAnimatedValue.setValue(e.nativeEvent.contentOffset.y);
      } else {
        interpolationHandledByAnimation.value = true;
      }
    }
  };
  const imageZoomInterpolation = imageAnimatedValue.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 3]
  });
  const imageOpacityInterpolation = imageOpacityValue.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0]
  });

  const criterionRatingAverages = ratings ? getCriterionAverageRating(ratings) : null;

  useEffect(() => {
    fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=ff806c72&t=${title}`).then(res => {
      return res.json();
    }).then(data => {
      if(!!data) {
        setImdbRating(data.imdbRating);
      }
    });
  }, [title, ratingContainerMaximized]);

  return (
    <SafeAreaView>
      <View style={{backgroundColor: 'white'}}>
        {selectedFilm ?
          <ScrollView onScroll={_scrollHandler} onMomentumScrollEnd={_scrollMomentumHandler} onScrollEndDrag={_scrollMomentumHandler}>
            <View style={styles.imageContainer}>
              <Animated.Image style={[styles.image, { opacity: imageOpacityInterpolation, transform: [{ scale: imageZoomInterpolation }] }]}
                source={{ uri: screenImageUrl ? screenImageUrl : noImageAvailableUrl }}
              />
              {trailerYoutubeId && !ratingContainerMaximized ?
                <View style={{position: 'absolute', left: 0, top: 0}}>
                  <Button
                    title='bande-annonce'
                    onPress={() => navigation.navigate('trailerModal', {trailerYoutubeId})}
                    textColor='white' 
                    icon={{name: 'md-play-circle', color: 'white'}}
                    color='rgba(0, 0, 0, 0.5)'
                    style={{margin: 5, paddingHorizontal: 15, paddingVertical: 7, elevation: 0}}
                  />
                </View> : null
              }
              {userAverageRating || cinetworkRating ?
                <TouchableWithoutFeedback onPress={() => setRatingContainerMaximized(() => !ratingContainerMaximized)}>
                  <View style={{...styles.ratingContainer, flexDirection: 'row', borderBottomLeftRadius: ratingContainerMaximized ? 0 : 25, padding: ratingContainerMaximized ? 15 : 10, paddingTop: ratingContainerMaximized ? 15 : 5}}>
                      {
                        ratingContainerMaximized &&
                        <View style={{flex: 1, justifyContent: 'space-between', marginRight: 20}}>
                          <View style={{paddingBottom: 5}}>
                            <Text style={{color: '#fff', fontFamily: 'open-sans-cond-bold', fontSize: 16}}>Moyenne par critère</Text>
                          </View>
                          {
                            criterionRatingAverages &&
                            Object.keys(criterionRatingAverages).map(criterion => (
                              <View key={criterion} style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View>
                                  <Text style={{color: '#fff', fontFamily: 'open-sans-cond', fontSize: 16}}>{ ratingCriterions[criterion] }</Text>
                                </View>
                                <StarRating
                                  rating={criterionRatingAverages[criterion].average}
                                  {...{...StarRatingDefaultProps, emptyStarColor: '#777777'}}
                                />
                              </View>
                            ))
                          }
                        </View>
                      }
                      <View style={{flexDirection: 'column'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                          <Text style={styles.ratingText}>{ userProfile.displayName.split(' ')[0] }</Text><Text style={styles.rating}>{ userAverageRating ? userAverageRating : ' - ' }</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                          <Text style={styles.ratingText}>Cinetwork</Text><Text style={styles.rating}>{ cinetworkRating ? cinetworkRating : ' - ' }</Text>
                        </View>
                        {
                          !!imdbRating && ratingContainerMaximized &&
                          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={styles.ratingText}>IMDb</Text><Text style={styles.rating}>{ imdbRating + '/10' }</Text>
                          </View>
                        }
                        <View style={{width: '100%'}}> 
                          <DistributionDiagram
                            height={20}
                            //values={Object.keys(ratings).map(user => ratings[user].averageRating)}
                            steps={10}
                            stepValue={0.5}
                            activeColor='white'
                            inactiveColor='rgba(255, 255, 255, 0.3)'
                            maximized={ratingContainerMaximized}
                          />
                        </View>
                      </View>
                  </View>
                </TouchableWithoutFeedback>
              : null}
              {
                !ratingContainerMaximized &&
                  <View style={styles.titleContainer}>
                    <Text style={{...styles.title, fontSize: title_fr.length < 25 ? 26 : 20}}>{ title_fr }</Text>
                  </View>
              }
            </View>

            <View style={{marginHorizontal: 20}}>
              <View style={{...styles.buttonsContainer, paddingVertical: 20}}>
                <View style={{flex: 1, marginRight: 5}}>
                  <Button
                    title='visionné'
                    onPress={toggleFilmViewedListHandler}
                    textColor={isFilmViewed ? 'orange' : 'white'}
                    icon={{name: 'md-checkmark', color: isFilmViewed ? 'orange' : 'white'}}
                    color={Colors.tertiary}
                  />
                </View>
                <View style={{flex: 1, marginLeft: 5, marginRight: 5}}>
                  <Button
                    title='à voir'
                    onPress={toggleFilmToWatchListHandler}
                    textColor={isFilmToWatch ? 'orange' : 'white'}
                    icon={{name: 'md-eye', color: isFilmToWatch ? 'orange' : 'white'}}
                    color={Colors.tertiary}
                  />
                </View>
                {isFilmViewed || isFilmToWatch ?
                  <View style={{flex: 1, marginLeft: 5}}>
                    <Button
                      title='liste...'
                      onPress={() => {
                        navigation.navigate('listsModal', { filmId, path, location: selectedFilmList });
                      }}
                      textColor={
                        typeof selectedFilm.lists !== 'undefined' ? (selectedFilm.lists.length > 0 ? 'orange' : 'white') : null
                      }
                      icon={{
                        name: 'md-list-box',
                        color: (
                          typeof selectedFilm.lists !== 'undefined' ? (selectedFilm.lists.length > 0 ? 'orange' : 'white') : null
                        )
                      }}
                      color={Colors.tertiary}
                    />
                  </View> : null
                }
              </View>
            </View>
            <ExpandableCard
              style={{backgroundColor: Colors.backgroundLight, marginHorizontal: 20}}
              labelStyle={{fontFamily: 'open-sans-cond-bold'}}
              valueStyle={{fontFamily: 'open-sans-cond'}}
              collapsedCardItems={[
                {label: 'Réalisateur', value: `${director_firstname} ${director_name}`},
                {label: scenarists.length === 1 ? 'Scénariste' : 'Scénariste (...)', value: scenarists[0]},
                {label: 'Genre', value: genre},
                {label: 'Année', value: year},
                {label: 'Durée', value: `${Math.floor(duration / 60)}h${duration % 60 < 10 ? '0'+(duration % 60).toString() : duration % 60}`}
              ]}
              expandedCardItems={[
                {label: 'Titre original', value: title},
                {label: 'Réalisateur', value: `${director_firstname} ${director_name}`},
                {label: scenarists.length === 1 ? 'Scénariste' : 'Scénaristes', value: scenarists},
                {label: 'Acteurs principaux', value: actors},
                {label: 'Genre', value: genre},
                {label: 'Sous-genres', value: subgenres},
                {label: 'Pays', value: landsAndFlags},
                {label: 'Année', value: year},
                {label: 'Durée', value: `${Math.floor(duration / 60)}h${duration % 60 < 10 ? '0'+(duration % 60).toString() : duration % 60}`},
                {label: 'Musique', value: music}
              ]}
            />
            <View style={styles.descriptionContainer}>
              {synopsis
              ? <View><Text style={styles.text}>{ synopsis }</Text></View> : null}
            </View>
            { ratings
            ?
              (Object.keys(ratings).length !== 0) ? (
                <View style={styles.commentsContainer}>
                  <View style={{marginBottom: 5, backgroundColor: Colors.backgroundLight, borderRadius: 20, borderWidth: 1, borderColor: '#E3D2E5'}}>
                    <Text style={{fontFamily: 'open-sans-cond-bold', fontSize: 18, color: Colors.textDefault, textAlign: 'center'}}>Avis</Text>
                  </View>
                  { _renderComments() } 
                </View>
              ) : null
            : null }
            <View style={{marginVertical: 10, marginBottom: 20, marginHorizontal: 20}}>
              <View style={{...styles.buttonsContainer, marginVertical : 10}}>
                <View style={{flex: 1, marginRight: 5}}>
                  <Button
                    title='noter'
                    onPress={_rateFilmHandler}
                    textColor={isUserRated ? 'orange' : 'white'}
                    icon={{name: 'md-star', color: isUserRated ? 'orange' : 'white'}}
                    color={Colors.tertiary}
                  />
                </View>
                <View style={{flex: 1, marginLeft: 5}}>
                  <Button
                    title='commenter'
                    onPress={() => {
                      navigation.navigate('commentModal');
                    }}
                    icon={{name: 'md-create', color: 'white'}}
                    color={Colors.tertiary}
                  />
                </View>
              </View>
              <View style={{...styles.buttonsContainer}}>
                <View style={{flex: 1}}>
                  <Button
                    title='recommander'
                    onPress={() => navigation.navigate('recommendModal', { filmId, title })}
                    icon={{name: 'md-share', color: 'white'}}
                    color={Colors.tertiary}
                  />
                </View>
              </View>
              <View>
              </View>
            </View>
          </ScrollView>
        : null}
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000'
  },
  image: {
    width: '100%',
    height: 270
  },
  ratingContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  rating: {
    marginLeft: 10,
    color: 'white',
    fontFamily: 'open-sans-cond-bold',
    fontSize: 16
  },
  ratingText: {
    color: 'white',
    fontFamily: 'open-sans-cond',
    fontSize: 16
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 25,
    backgroundColor: Colors.primaryTransparent,
    borderTopLeftRadius: 55,
    borderTopRightRadius: 55
  },
  title: {
    textAlign: 'center',
    fontFamily: 'open-sans-cond-bold',
    color: 'white'
  },
  descriptionContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 0
  },
  commentsContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  label: {
    marginVertical: 5,
    fontFamily: 'open-sans-cond-bold',
    fontSize: 18,
    color: Colors.textDefault
  },
  text: {
    width: '100%',
    marginVertical: 5,
    fontFamily: 'open-sans-cond',
    fontSize: 18,
    textAlign: 'right'
  },
  userText: {
    fontSize: 16,
    fontFamily: 'open-sans-cond-bold',
    color: Colors.textDefault
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default FilmScreen;