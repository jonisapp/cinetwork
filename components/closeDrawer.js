import React from 'react';
import { NavigationEvents, navigation } from 'react-navigation';

const CloseDrawer = () => {
  return (
    <NavigationEvents
      onDidFocus={() => { navigation.closeDrawer() }}
    />
  );
};

export default CloseDrawer;