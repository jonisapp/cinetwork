import React from 'react';
import { View, StatusBar } from 'react-native';
import Colors from '../constants/Colors';

const SafeAreaView = (props) => {
  return (
    <View style={{paddingTop: StatusBar.currentHeight, backgroundColor: Colors.primary}}>
      { props.children }
    </View>
  );
};

export default SafeAreaView;