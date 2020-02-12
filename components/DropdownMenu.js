import React from 'react';
import Menu, { MenuItem } from 'react-native-material-menu';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from './HeaderButton';

const DropdownMenu = ({ menuItems }) => {
  console.log(menuItems);
  var menu = null;
  const setMenuRef = ref => {
    menu = ref;
  };
  const showMenu = () => {
    menu.show();
  };
  const hideMenu = () => {
    menu.hide();
  };

  const renderMenuItems = () => {
    menuItems.map(menuItem => (
      <MenuItem key={menuItem[0]} onPress={() => {}}>caca</MenuItem>
    ));
  };

  return (
    <Menu
      ref={setMenuRef}
      button={(
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item title='dropdown' iconName='md-funnel' color='white' onPress={showMenu} />
        </HeaderButtons>
      )}
    >
      {
        renderMenuItems()
      }
    </Menu>
  );
};

export default DropdownMenu;