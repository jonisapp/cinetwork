import React from 'react';
import { FlatList, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';

const FriendsList = ({ friends, action, onSelect }) => {
  return (
    <View style={styles.screen}>
      <FlatList
        keyExtractor={item => item.id}
        data={friends}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelect(item.id)}>
            <View style={styles.friendItem}>
              <Image style={styles.photo} source={{ uri: item.photoURL }} />
              <View style={styles.textContainer}>
                <View>
                  <Text style={styles.friendName}>{ item.displayName }</Text>
                </View>
                {action ?
                  <View>
                    <Text style={styles.actionText}>{ action }</Text>
                  </View>
                : null}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.backgroundLight
  },
  friendItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    width: '100%',
    borderBottomWidth: 0.5,
    borderColor: '#ccc'
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 100
  },
  textContainer: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  actionText: {
    color: Colors.selectedTextItem,
    fontWeight: 'bold'
  }
});

export default FriendsList;