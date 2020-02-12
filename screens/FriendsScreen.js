import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../components/HeaderButton';
import DrawerMenuButton from '../components/drawerMenuButton';

import FriendsList from '../components/FriendsList';

const FriendsScreen = () => {
  const friends = useSelector(state => state.user.friends);

  return (
    <View>
      <FriendsList friends={friends} onSelect={() => {}} />
    </View>
  );
};

FriendsScreen.navigationOptions = ({ navigation }) => {
  return {
    headerLeft: <DrawerMenuButton navigation={ navigation } />,
    headerTitle: 'Amis',
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
          title="add-friend"
          iconName='md-person-add'
          color='white'
          onPress={() => { navigation.navigate('addFriendModal') }}
          />
      </HeaderButtons>
    )
  }
};

const styles = StyleSheet.create({

});

export default FriendsScreen;