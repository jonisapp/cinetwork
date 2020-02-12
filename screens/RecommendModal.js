import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import FriendsList from '../components/FriendsList';
import { recommendFilmToFriend } from '../store/user/user.actions';

const RecommendModal = ({ navigation }) => {
  const friends = useSelector(state => state.user.friends);
  const { id, displayName } = useSelector(state => state.user.profile);
  const filmId = navigation.getParam('filmId');
  const filmTitle = navigation.getParam('title');

  const dispatch = useDispatch();

  const recommendHandler = (friendId) => {
    dispatch(recommendFilmToFriend(id, displayName, filmId, filmTitle, friendId));
    navigation.pop();
  }

  return (
    <View style={styles.screen}>
      <FriendsList friends={friends} action='recommander'
        onSelect={(friendId) => {
          recommendHandler(friendId);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingTop: 20
  }
});

export default RecommendModal