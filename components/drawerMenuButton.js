import React from 'react';
import { Platform } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from './HeaderButton';

const DrawerMenuButton = ({ navigation }) => {
  return (
    <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item title='Menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
      color='white'
      onPress={() => {
        navigation.toggleDrawer();
      }} />
    </HeaderButtons>
  );
};

export default DrawerMenuButton;