import React, { useState, useEffect, useCallback } from 'react';
import { AsyncStorage } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import thunk from 'redux-thunk';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

import Navigation from './navigation/navigation';

import { fetchMoviesRecommended, updateMoviesRecommendedLocalData } from './store/user/user.actions';
import { setUserNotificationsToken } from './store/user/user.actions';
import { moviesReducer } from './store/movies/movies.reducer';
import { userReducer } from './store/user/user.reducer';
import { interfaceReducer } from './store/interface/interface.reducers';

import './cancel-warnings';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user']
}

const rootReducer = combineReducers({
  movies: moviesReducer,
  user: userReducer,
  interface: interfaceReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewares = [thunk]

const store = createStore(persistedReducer, applyMiddleware(...middlewares));

const persistor = persistStore(store);

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans-cond": require("./assets/fonts/OpenSansCondensed-Light.ttf"),
    "open-sans-cond-bold": require("./assets/fonts/OpenSansCondensed-Bold.ttf")
  });
};

const AppData = () => {
  const userId = useSelector(state => state.user.profile.id);
  const userExpoPushToken = useSelector(state => state.user.profile.expoPushToken);
  const moviesRecommended = useSelector(state => state.user.moviesRecommended);
  const moviesRecommendedData = useSelector(state => state.user.moviesRecommendedData);

  const dispatch = useDispatch();

  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if(existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if(finalStatus !== 'granted') {
      return;
    }
    let token = await Notifications.getExpoPushTokenAsync();
    return token;
  }

  useEffect(() => {
    async function getExpoPushToken() {
      const token = await registerForPushNotificationsAsync();
      dispatch(setUserNotificationsToken(token, userId));
    }
    console.log(userExpoPushToken);
    if(!userExpoPushToken) {
      getExpoPushToken();
    }
  }, []);

  // useEffect(() => {
  //   firestore.collection('films').get().then(snapshot => {
  //     snapshot.docs.forEach(film => {
  //       mongodb().collection('films').insertOne({
  //         id: film.id,
  //         title: film.data().title,
  //         genre: film.data().genre,
  //         genres: film.data().genres,
  //         subgenres: film.data().subgenres,
  //         year: film.data().year,
  //         coverImageUrl: film.data().coverImageUrl,
  //         usersViewed: [],
  //         usersToWatch: []
  //       });
  //     });
  //   })
  // }, []);

  const loadMoviesRecommended = useCallback(async () => {
    await dispatch(fetchMoviesRecommended(userId));    
  }, [dispatch]);

  const loadMoviesRecommendedData = useCallback(async () => {
    await dispatch(updateMoviesRecommendedLocalData(moviesRecommended, moviesRecommendedData));
  }, [dispatch]);

  // useEffect(() => {
  //   loadMoviesRecommended();
  // }, []);

  // useEffect(() => {
  //   loadMoviesRecommendedData();
  // }, [moviesRecommendedData]);

  return (
    null
  );
};

export default function App() {
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppData />
      {
        isFontLoaded
        ? (
          <Navigation />
        )
        : (
          <AppLoading startAsync={fetchFonts} onFinish={() => setIsFontLoaded(true)} />
        )
      }
      </PersistGate>
    </Provider>
  );
}
