import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Button = props => {
  return (
    <TouchableOpacity
      style={{...styles.button, backgroundColor: props.color, ...props.style}}
      onPress={props.onPress}
    >
      <View style={{flexDirection: 'row'}}>
        {
          props.icon ?
          <Ionicons
            style={{marginRight: 10}}
            name={props.icon.name}
            size={props.icon.size ? props.icon.size : 20}
            color={props.icon.color ? props.icon.color : 'white'}
          /> : null
        }
        <Text style={{...styles.text, color: (props.textColor ? props.textColor : 'white')}}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    elevation: 5
  },
  text: {
    fontWeight: 'bold',
    color: 'white'
  }
});

export default Button;