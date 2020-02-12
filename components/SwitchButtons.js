import React, { useEffect, useReducer } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';

import Button from './Button';

const addOrRemoveItem = (items, item, maxItems) => {
  let updatedItems = [...items];
  if(items.includes(item)) {
    updatedItems = updatedItems.filter(value => value !== item);
  }
  else {
    if(items.length + 1 <= maxItems) {
      updatedItems.push(item);
    }
  }
  return updatedItems
}

const reducer = (state, action) => {
  if(state.maxSwitchedButtons > 1) {
    let updatedselectedButtonsIndexes;
    let updatedselectedButtonsLabels;
    if(action.persistableValues.length === 0 || action.persistableValues.includes(action.value)) {
      updatedselectedButtonsIndexes = addOrRemoveItem(state.selectedButtonsIndexes, action.index, state.maxSwitchedButtons);
      updatedselectedButtonsLabels = addOrRemoveItem(state.selectedButtonsLabels, action.value, state.maxSwitchedButtons);
      return {
        ...state,
        lastSelectedButtonIndex: action.index,
        lastSelectedButtonValue: action.value,
        selectedButtonsIndexes: updatedselectedButtonsIndexes,
        selectedButtonsLabels: updatedselectedButtonsLabels,
      }
    } else {
      if(state.lastNonPersistableValue !== null) {
        updatedselectedButtonsIndexes = state.selectedButtonsIndexes.filter(index => index !== state.lastNonPersistableIndex);
        updatedselectedButtonsLabels = state.selectedButtonsLabels.filter(value => value !== state.lastNonPersistableValue);
      }
      else {
        updatedselectedButtonsIndexes = state.selectedButtonsIndexes.length !== 0 ? [...state.selectedButtonsIndexes] : [];
        updatedselectedButtonsLabels = state.selectedButtonsLabels.length !== 0 ? [...state.selectedButtonsLabels] : [];
      }
      updatedselectedButtonsIndexes.push(action.index);
      updatedselectedButtonsLabels.push(action.value);
      return {
        ...state,
        lastSelectedButtonIndex: action.index,
        lastSelectedButtonValue: action.value,
        selectedButtonsIndexes: updatedselectedButtonsIndexes,
        selectedButtonsLabels: updatedselectedButtonsLabels,
        lastNonPersistableIndex: action.index,
        lastNonPersistableValue: action.value
      }
    }
  } else {
    return {
      ...state,
      lastSelectedButtonIndex: action.index,
      lastSelectedButtonValue: action.value
    }
  }
};

const borderRadius = 30;
const borderWidth = 1;

const SwitchButtons = ({ buttons, onPress, onSwitch, disposition, width, columns, maxSwitchedButtons, defaultSelected, persistableValues }) => {
  const initialState = {
    lastSelectedButtonIndex: null,
    lastSelectedButtonValue: null,
    selectedButtonsIndexes: [],
    selectedButtonsLabels: [],
    maxSwitchedButtons,
    lastNonPersistableValue: null,
    lastNonPersistableIndex: null
  };
  const [state, dispatchSwitched] = useReducer(reducer, initialState);

  if(!disposition) {
    disposition = 'horizontal';
  }

  const { selectedButtonsIndexes, selectedButtonsLabels, lastSelectedButtonIndex, lastSelectedButtonValue  } = state;

  useEffect(() => {
    if(onSwitch && lastSelectedButtonIndex !== null) {
      if(maxSwitchedButtons === 1 && typeof lastSelectedButtonValue !== 'undefined') {
        onSwitch(lastSelectedButtonValue);
      }
      onSwitch(lastSelectedButtonValue, selectedButtonsLabels)
    };
  }, [selectedButtonsIndexes, selectedButtonsLabels, lastSelectedButtonIndex, lastSelectedButtonValue]);

  const renderButtons = (buttons, disposition, columnPosition, colsNum = 0) => {
    return buttons.map((button, i) => {
      let currentIndex = colsNum * buttons.length + i;
      let buttonPosition = 'center'
      if(i === 0) {
        buttonPosition = 'first';
      } else if(i === buttons.length - 1) {
        buttonPosition = 'last'
      }

      const buttonValue = typeof button === 'string' ? button : button.value;

      return (
        <Button
          key={i}
          onPress={() => {
            dispatchSwitched({index: currentIndex, value: buttonValue, persistableValues});
            if(onPress) {
              onPress(buttonValue);
            }
          }}
          title={typeof button === 'string' ? button : button.label}
          textColor='#EDB7FF'
          style={{
            ...styles.button,
            ...styles[`${columnPosition}${buttonPosition}_${disposition}`],
            ...((state.maxSwitchedButtons === 1 && state.lastSelectedButtonIndex === currentIndex) || state.selectedButtonsIndexes.includes(currentIndex) || state.lastSelectedButtonIndex === null && buttonValue === defaultSelected ? styles.selectedButton : {})
          }}
        />
      )
    });
  };

  const renderGridButtons = (buttons, cols = 2) => {
    const numberOfButtons = buttons.length;
    const numberOfButtonsPerColumn = numberOfButtons / cols;
    const allButtons = [];
    let columnPosition = 'firstColumn_';
    for(let i = 0; i < cols; ++i) {
      const columnButtons_arr = buttons.slice(i * numberOfButtonsPerColumn, i * numberOfButtonsPerColumn + numberOfButtonsPerColumn);
      if(i > 0 && i < cols - 1) {
        columnPosition = 'centerColumn_';
      }
      else if(i == cols - 1) {
        columnPosition = 'lastColumn_'
      }
      const renderedButtons = (
        <View key={i} style={{flexDirection: 'column', flex: 1}}>
          { renderButtons(columnButtons_arr, 'vertical', columnPosition, i) }
        </View>
      );
      allButtons.push(renderedButtons);
    }
    return allButtons;
  };

  return (
    <View style={{width: width ? width : '100%'}}>
      <ScrollView style={{width: '100%'}}>
          {
            ['horizontal', 'vertical'].includes(disposition)
            ?
              <View style={{...styles.buttonsContainer, ...(disposition === 'vertical' ? styles.dispositionVertical : styles.dispositionHorizontal)}}>
                { renderButtons(buttons, disposition, "") }
              </View>
            :
              <View style={{flexDirection: 'row', marginVertical: 10}}>
                { renderGridButtons(buttons, columns) }
              </View>
          }
      </ScrollView>
    </View>
  );
};

SwitchButtons.defaultProps = {
  maxSwitchedButtons: 1,
  persistableValues: [],
  onPress: null
};

const styles = StyleSheet.create({
  buttonsContainer: {
    marginVertical: 10,
  },
  dispositionHorizontal: {
    flexDirection: 'row'
  },
  dispositionVertical: {
    flexDirection: 'column'
  },
  dispositionGrid: {
    flexDirection: 'row'
  },
  button: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 10,
    elevation: 0,
    borderWidth,
    borderColor: '#7F439B',
    backgroundColor: 'transparent',
    color: '#7F439B', //AB5AD0
    borderRadius: 0,
  },
  selectedButton: {
    color: 'white',
    backgroundColor: 'rgba(222, 150, 255, 0.2)'
  },
  first_horizontal: {
    borderTopLeftRadius: borderRadius,
    borderBottomLeftRadius: borderRadius
  },
  center_horizontal: {
    borderRadius: 0,
    borderLeftWidth: 0
  },  
  last_horizontal: {
    borderLeftWidth: 0,
    borderTopRightRadius: borderRadius,
    borderBottomRightRadius: borderRadius
  },
  first_vertical: {
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius
  },
  center_vertical: {
    borderTopWidth: 0
  },  
  last_vertical: {
    borderTopWidth: 0,
    borderBottomLeftRadius: borderRadius,
    borderBottomRightRadius: borderRadius
  },
  firstColumn_first_vertical: {
    borderTopLeftRadius: borderRadius
  },
  firstColumn_center_vertical: {
    borderTopWidth: 0
  },
  firstColumn_last_vertical: {
    borderTopWidth: 0,
    borderBottomLeftRadius: borderRadius,
  },
  centerColumn_first_vertical: {
    borderLeftWidth: 0
  },
  centerColumn_center_vertical: {
    borderTopWidth: 0,
    borderLeftWidth: 0
  },
  centerColumn_last_vertical: {
    borderTopWidth: 0,
    borderLeftWidth: 0
  },
  lastColumn_first_vertical: {
    borderLeftWidth: 0,
    borderTopRightRadius: borderRadius
  },
  lastColumn_center_vertical: {
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  lastColumn_last_vertical: {
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: borderRadius
  },
});

export default SwitchButtons;