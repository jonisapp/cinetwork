import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import Menu, { MenuItem } from 'react-native-material-menu';
import Prompt from 'react-native-prompt-crossplatform';

import Colors from '../constants/Colors';
import Button from '../components/Button';

import { addList, deleteList, toggleUserList } from '../store/user/user.actions';

const ListsModal = ({ navigation }) => {
  const filmId = navigation.getParam('filmId');
  const path = navigation.getParam('path');
  const location = navigation.getParam('location');

  const selectedFilm = useSelector(state => state.user[location].find(film => film.id === filmId));

  const lists = useSelector(state => state.user.lists);
  const [listName, setListName] = useState('');
  const [addListPromptVisible, setAddListPromptVisible] = useState(false);

  const dispatch = useDispatch();

  const deleteListHandler = useCallback((list) => {
    dispatch(deleteList(list));
  }, [dispatch, deleteList]);

  const renderListItem = (list, selectedFilm, onPress) => {
    var menu = null;
    const setMenuRef = (ref) => { menu = ref };
    const showMenu = () => { menu.show() };
    const hideMenu = () => { menu.hide() };

    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: '#ccc', borderBottomWidth: 0.5,
        backgroundColor: typeof selectedFilm.lists !== 'undefined' ? (selectedFilm.lists.includes(list) ? Colors.backgroundLight: 'white') : 'white'}}
      >
        <View>
          <TouchableOpacity onPress={onPress}>
            <View style={{margin: 20}}>
              <Text>{ list }</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableWithoutFeedback
            onPress={() => showMenu()}
          >
            <View style={{padding: 20}}>
              <Menu
                ref={(ref) => setMenuRef(ref)}
                button={(
                  <Ionicons
                    name='md-more'
                    size={20}
                    color='#333'
                  />
                )}
                >
                <MenuItem onPress={() => { hideMenu() }}>modifier</MenuItem>
                <MenuItem onPress={() => { deleteListHandler(list); hideMenu() }}>supprimer</MenuItem>
              </Menu>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.screen}>
        <ScrollView>
          {
            lists ?
              lists.map(list => (
                <View
                  key={list}
                >
                { renderListItem(list, selectedFilm, () => { dispatch(toggleUserList(filmId, list, path, location)) }) }
                </View>
              ))
            : null
          }
          <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center', marginVertical: 20}}>
            <Button color={Colors.success} title='+ LISTE' onPress={() => setAddListPromptVisible(true)} />
          </View>
        </ScrollView>
      </View>
      <View>
        <Prompt
          title="Ajouter une liste"
          inputPlaceholder="nom de la liste"
          isVisible={addListPromptVisible}
          onChangeText={(text) => {
            setListName(text);
          }}
          onCancel={() => {
            setAddListPromptVisible(false);
          }}
          onSubmit={() => {
            if(listName.length > 0) {
              dispatch(addList(listName));
            }
            setListName('');
            setAddListPromptVisible(false);
          }}
          submitButtonText='valider'
          cancelButtonText='annuler'
          promptBoxStyle={{borderRadius: 15}}
          headingStyle={{fontSize: 18, fontWeight: 'bold', fontFamily: 'normal'}}
          inputStyle={{fontSize: 18, fontFamily: 'normal'}}
          btnTextStyle={{fontSize: 18, fontFamily: 'normal'}}
          primaryColor={Colors.primary}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingTop: 24
  }
});

export default ListsModal