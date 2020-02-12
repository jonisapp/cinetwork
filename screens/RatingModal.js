import React, { useCallback, useReducer } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { Tooltip, Text } from 'react-native-elements';
import StarRating from 'react-native-star-rating';

import SafeAreaView from '../components/SafeAreaView';
import Button from '../components/Button';
import Card from '../components/Card';
import Colors from '../constants/Colors';

import Rating from '../model/rating';
import { rateFilm, deleteRating } from '../store/user/user.actions';

const ratingInitialState = new Rating();

const ratingReducer = (state, action) => {
  if(action.type === 'reset') {
    return ratingInitialState;
  }
  return {
    ...state,
    [action.type]: action.value
  };
}

const RatingModal = ({ navigation }) => {
  const film = navigation.getParam('film');
  const location = navigation.getParam('location');
  const path = navigation.getParam('path');

  const filmId = film.id;
  const userId = useSelector(state => state.user.profile.id);
  const displayName = useSelector(state => state.user.profile.displayName);

  let ratings = film.ratings;
  let filmRating = null;
  if(typeof ratings !== 'undefined') {
    filmRating = ratings[userId] ? ratings[userId].rating : null;
  }
  if(!filmRating || typeof filmRating !== 'object') {
    filmRating = ratingInitialState;
  }

  const [ratingState, ratingDispatch] = useReducer(ratingReducer, filmRating);

  const dispatch = useDispatch();

  const submitRatingHandler = useCallback(() => {
    dispatch(rateFilm(filmId, userId, displayName, ratingState, path, location));
    navigation.goBack();
  }, [dispatch, filmId, userId, displayName, ratingState]);

  const deleteRatingHandler = useCallback(() => {
    dispatch(deleteRating(filmId, userId, path, location));
    ratingDispatch({ type: 'reset' })
    navigation.goBack();
  }, [dispatch, filmId]);

  const StarRatingDefaultProps = {
    starSize: 35,
    disabled: false,
    halfStarEnabled: true,
    emptyStarColor: Colors.primaryTransparent,
    fullStarColor: Colors.active,
    maxStars: 5
  };

  return (
    <SafeAreaView>
      <ScrollView>
      <View style={styles.screen}>
        <View style={styles.titleContainer}>
          <Text style={{...styles.title, fontSize: film.title.length < 25 ? 22 : 18}}>{film.title}</Text>
        </View>
        <Card style={{paddingHorizontal: 0, marginHorizontal: 10}}>
          <View style={styles.starRatingContainer}>
            <Tooltip
              popover={<Text style={{color: Colors.primary}}>crédibilité de l'intrigue dans son contexte et de ses trames secondaires.</Text>}
              height={80} withOverlay={false} backgroundColor={Colors.backgroundLight}
            >
              <View style={styles.label}>
                <Ionicons name='ios-information-circle-outline' color={Colors.success} size={20} />
                <Text style={styles.labelText}>Cohérence</Text>
              </View>
            </Tooltip>
            <StarRating
              rating={ratingState.consistency}
              selectedStar={rating => ratingDispatch({ type: 'consistency', value: rating })}
              {...StarRatingDefaultProps}
            />
          </View>
          <View style={styles.starRatingContainer}>
            <Tooltip
              popover={<Text style={{color: 'white'}}>capacité du film de se distinguer d'une manière ou d'une autre de ceux déjà existants.</Text>}
              height={90} withOverlay={false} backgroundColor={Colors.primary}
            >
              <View style={styles.label}>
                <Ionicons name='ios-information-circle-outline' color={Colors.success} size={20} />
                <Text style={styles.labelText}>Originalité</Text>
              </View>
            </Tooltip>
            <StarRating
              rating={ratingState.originality}
              selectedStar={rating => ratingDispatch({ type: 'originality', value: rating })}
              {...StarRatingDefaultProps}
            />
          </View>
          <View style={styles.starRatingContainer}>
            <Tooltip
              popover={<Text style={{color: 'white'}}>présence d'événements inattendus qui rendent le scénario moins prévisible</Text>}
              height={110} withOverlay={false} backgroundColor={Colors.primary}
            >
              <View style={styles.label}>
                <Ionicons name='ios-information-circle-outline' color={Colors.success} size={20} />
                <Text style={styles.labelText}>Étonnement</Text>
              </View>
            </Tooltip>
            <StarRating
              rating={ratingState.surprise}
              selectedStar={rating => ratingDispatch({ type: 'surprise', value: rating })}
              {...StarRatingDefaultProps}
            />
          </View>
          <View style={styles.starRatingContainer}>
            <Tooltip
              popover={<Text style={{color: 'white'}}>présence de contenu riche et réfléchi ou d'éléments qui incitent à la réflexion.</Text>}
              height={90} withOverlay={false} backgroundColor={Colors.primary}
            >
              <View style={styles.label}>
                <Ionicons name='ios-information-circle-outline' color={Colors.success} size={20} />
                <Text style={styles.labelText}>Réflexion</Text>
              </View>
            </Tooltip>
            <StarRating
              rating={ratingState.thinking}
              selectedStar={rating => ratingDispatch({ type: 'thinking', value: rating })}
              {...StarRatingDefaultProps}
            />
          </View>
          <View style={styles.starRatingContainer}>
            <Tooltip
                popover={<Text style={{color: 'white'}}>qualité de jeu des acteurs, en adéquation avec leur rôle dans l'intrigue.</Text>}
                height={80} withOverlay={false} backgroundColor={Colors.primary}
            >
              <View style={styles.label}>
                <Ionicons name='ios-information-circle-outline' color={Colors.success} size={20} />
                <Text style={styles.labelText}>Interprétation</Text>
              </View>
            </Tooltip>
            <StarRating
              rating={ratingState.performance}
              selectedStar={rating => ratingDispatch({ type: 'performance', value: rating })}
              {...StarRatingDefaultProps}
            />
          </View>
          <View style={styles.starRatingContainer}>
            <Tooltip
                popover={<Text style={{color: 'white'}}>qualité visuelle de la photographie, des décors, costumes ou effets spéciaux.</Text>}
                height={80} withOverlay={false} backgroundColor={Colors.primary}
            >
              <View style={styles.label}>
                <Ionicons name='ios-information-circle-outline' color={Colors.success} size={20} />
                <Text style={styles.labelText}>Esthétique</Text>
              </View>
            </Tooltip>
            <StarRating
              rating={ratingState.esthetic}
              selectedStar={rating => ratingDispatch({ type: 'esthetic', value: rating })}
              {...StarRatingDefaultProps}
            />
          </View>
          <View style={styles.starRatingContainer}>
            <Tooltip
                popover={<Text style={{color: 'white'}}>qualité de l'atmosphère visuelle et sonore, en adéquation avec le scénario.</Text>}
                height={90} withOverlay={false} backgroundColor={Colors.primary}
            >
              <View style={styles.label}>
                <Ionicons name='ios-information-circle-outline' color={Colors.success} size={20} />
                <Text style={styles.labelText}>Ambiance</Text>
              </View>
            </Tooltip>
            <StarRating
              rating={ratingState.ambience}
              selectedStar={rating => ratingDispatch({ type: 'ambience', value: rating })}
              {...StarRatingDefaultProps}
            />
          </View>
          <View style={styles.starRatingContainer}>
            <Tooltip
              popover={<Text style={{color: 'white'}}>Richesse ou originalité musicale, en adéquation avec le scénario.</Text>}
              height={80} withOverlay={false} backgroundColor={Colors.primary}
            >
              <View style={styles.label}>
                <Ionicons name='ios-information-circle-outline' color={Colors.success} size={20} />
                <Text style={styles.labelText}>Musique</Text>
              </View>
            </Tooltip>
            <StarRating
              rating={ratingState.music}
              selectedStar={rating => ratingDispatch({ type: 'music', value: rating })}
              {...StarRatingDefaultProps}
            />
          </View>
        </Card>
        <View style={styles.buttonContainer}>
          <Button color={Colors.danger} title='SUPPRIMER' onPress={deleteRatingHandler} />
          <Button color={Colors.success} title='SAUVEGARDER' onPress={submitRatingHandler} />
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    backgroundColor: Colors.backgroundLight
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20
  },
  title: {
    fontFamily: 'open-sans-cond-bold',
    fontSize: 22,
    color: Colors.primary
  },
  starRatingContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 5,
    justifyContent: 'space-between',
    position: 'relative'
  },
  label: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelText: {
    marginLeft: 5,
    marginVertical: 10,
    fontFamily: 'open-sans-cond-bold',
    fontSize: 18,
    color: Colors.primary 
  },
  buttonContainer: {
    marginVertical: 20,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default RatingModal;