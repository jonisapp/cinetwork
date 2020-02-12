import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, Text, StyleSheet, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';
import { addFriend } from '../store/user/user.actions';

import { firestore } from '../firebase/config';
import Colors from '../constants/Colors';


const AddFriendModal = ({ navigation }) => {

  const [users, setUsers] = useState([]);

  const searchFriendHandler = async (text) => {
    const usersRef = firestore.collection('users');
    if(text) {
      usersRef.where(`nameIndex.${text.trim().toLowerCase()}`, '==', true);
      const snapshot = await usersRef.get();
      const users = snapshot.docs.map(user => {
        const userData = user.data();
        return {
          id: user.id,
          ...userData
        }
      });
      setUsers(users);
    }
    else {
      setUsers([]);
    }
  }

  const dispatch = useDispatch();

  const addFriendHandler = (friendId) => {
    dispatch(addFriend(friendId));
    navigation.navigate('friends')
  }

  return (
    <View style={styles.screen}>
      <TextInput
        style={styles.input}
        onChangeText={(text) => {
          searchFriendHandler(text);
        }}
      />
      <View style={styles.itemsContainer}>
        <FlatList
          keyExtractor={item => item.id}
          data={users}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => addFriendHandler(item.id)}>
              <View style={styles.item}>
                  <Text
                    style={styles.itemText}
                  >{ item.displayName }
                  </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    marginTop: 20
  },
  input: {
    paddingHorizontal: 5,
    width: '100%',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  itemsContainer: {
    padding: 5,
    backgroundColor: Colors.backgroundLight,
    height: '100%'
  },
  item: {
    backgroundColor: '#ddd',
    padding: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 2
  },
  itemText: {
    textAlign: 'center',
    fontSize: 20
  }
});

export default AddFriendModal;