import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = props => {
  return(
    <View style={{...styles.card, ...props.style}}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 3,
    backgroundColor: 'white',
  }
});

export default Card;