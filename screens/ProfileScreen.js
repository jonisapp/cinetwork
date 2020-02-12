import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { useSelector } from 'react-redux';

import firebase from '../firebase/config';

import DrawerMenuButton from '../components/drawerMenuButton';
import Colors from '../constants/Colors';

const ProfileScreen = ({ navigation }) => {
  const profile = useSelector(state => state.user.profile);
  const { displayName, photoURL } = profile;

  return (
    <View style={styles.screen}>
      <Text style={styles.userName}>{ displayName }</Text>
      <Image style={styles.photo} source={{uri: photoURL}} />
      <Button title='Sign out' onPress={() => { firebase.auth().signOut(); navigation.navigate('auth'); }}/>
    </View>
  );
};

ProfileScreen.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: 'Profil',
    headerLeft: <DrawerMenuButton navigation={navigation} />
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.textDefault
  },
  photo: {
    margin : 10,
    width: 50,
    height: 50,
    borderRadius: 100
  }
});

export default ProfileScreen;