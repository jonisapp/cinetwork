import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Colors from '../constants/Colors';

import AuthScreen from '../screens/Auth';

import SearchScreen from '../screens/SearchScreen';
import FilmsListScreen from '../screens/FilmsListScreen';
import FilmScreen from '../screens/FilmScreen';
import FriendsScreen from '../screens/FriendsScreen';
import RatingModal from '../screens/RatingModal';
import CommentModal from '../screens/CommentModal';
import RecommendModal from '../screens/RecommendModal';
import AddFriendModal from '../screens/AddFriendModal';
import TrailerModal from '../screens/TrailerModal';
import ProfileScreen from '../screens/ProfileScreen';
import ListsModal from '../screens/ListsModal';

import { enableScreens } from 'react-native-screens';

enableScreens();

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: Colors.primary
  },
  headerTintColor: 'white',
};

const FilmsViewedNavigator = createStackNavigator({
  films: {
    screen: FilmsListScreen,
    params: {
      listType: 'moviesViewed'
    }
  },
  film: {
    screen: FilmScreen,
    navigationOptions: {
      header: null
    }
  }
}, {
  defaultNavigationOptions
});

const FilmsToWatchNavigator = createStackNavigator({
  films: {
    screen: FilmsListScreen,
    params: {
      listType: 'moviesToWatch'
    }
  },
  film: {
    screen: FilmScreen,
    navigationOptions: {
      header: null
    }
  }
}, {
  defaultNavigationOptions
});

const FilmsRecommendedNavigator = createStackNavigator({
  films: {
    screen: FilmsListScreen,
    params: {
      listType: 'moviesRecommended'
    }
  },
  film: {
    screen: FilmScreen,
    navigationOptions: {
      header: null
    }
  }
}, {
  defaultNavigationOptions
});

const discoverNavigator = createStackNavigator({
  search: SearchScreen,
  film: {
    screen: FilmScreen,
    navigationOptions: {
      header: null
    }
  }
}, {
  defaultNavigationOptions
});

const moviesNavigator = createMaterialBottomTabNavigator({
  films: {
    screen: FilmsViewedNavigator,
    navigationOptions: {
      tabBarLabel: 'visionné',
      tabBarIcon: () => {
        return <Ionicons name='md-checkmark' size={25} color='white' />
      }
    }
  },
  towatch: {
    screen: FilmsToWatchNavigator,
    navigationOptions: {
      tabBarLabel: 'à voir',
      tabBarIcon: () => {
        return <Ionicons name='md-eye' size={25} color='white' />
      }
    }
  },
  recommended: {
    resetOnBlur: true,
    screen: FilmsRecommendedNavigator,
    navigationOptions: {
      tabBarLabel: 'recommandé',
      tabBarIcon: () => {
        return <Ionicons name='md-thumbs-up' size={25} color='white' />
      }
    }
  }
}
, {
  activeColor: 'white',
  barStyle: {
    backgroundColor: Colors.primary
  }
});

const authNavigator = createStackNavigator({
  auth: AuthScreen
}, {
  defaultNavigationOptions
});

const FriendsNavigator = createStackNavigator({
  friends: {
    screen: FriendsScreen
  }
}, {
  defaultNavigationOptions
});

const ProfileNavigator = createStackNavigator({
  profile: {
    screen: ProfileScreen
  }
}, {
  defaultNavigationOptions
});

const drawerNavigator = createDrawerNavigator({
  search: {
    screen: discoverNavigator,
    navigationOptions: {
      title: 'Rechercher'
    }
  },
  myMovies: {
    screen: moviesNavigator,
    navigationOptions: {
      title: 'Mes films'
    }
  },
  friends: {
    screen: FriendsNavigator,
    navigationOptions: {
      title: 'Amis'
    }
  },
  profile: {
    screen: ProfileNavigator,
    navigationOptions : {
      title: 'Profil'
    }
  }
}, {
  unmountInactiveRoutes: true,
  contentOptions: {
    activeTintColor: Colors.primary
  }
});

const mainNavigator = createStackNavigator({
  main: drawerNavigator,
  ratingModal: RatingModal,
  commentModal: CommentModal,
  recommendModal: RecommendModal,
  addFriendModal: AddFriendModal,
  trailerModal: TrailerModal,
  listsModal: ListsModal
}, {
  mode: 'modal',
  headerMode: 'none'
});

const rootNavigator = createSwitchNavigator({
  auth: authNavigator,
  app: mainNavigator
});

export default createAppContainer(rootNavigator);