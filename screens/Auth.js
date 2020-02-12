import React, { useEffect } from 'react';
import { View, Button, Text, TextInput, ScrollView, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { SocialIcon } from 'react-native-elements';
import { useDispatch } from 'react-redux';

import firebase from '../firebase/config';

import loginWithFacebook from '../firebase/firebase.auth';
import { setUserProfile } from '../store/user/user.actions';

const AuthScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if(!!user) {
        dispatch(setUserProfile(user))
        navigation.navigate('app');
      }
    })
  }, [dispatch]);

  return (
    <KeyboardAvoidingView
      behavior='padding'
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <View style={styles.screen}>
        <SocialIcon
          onPress={async () => await loginWithFacebook()}
          style={{paddingHorizontal: 20}}
          title='Se connecter avec Facebook'
          button
          type='facebook'
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  label: {
    marginVertical: 8
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '70%'
  }
});

export default AuthScreen;