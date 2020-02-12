import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

const CommentModal = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <Text>comment</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingTop: 20
  }
});

export default CommentModal;