import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// screens
import HomeScreen from '../screens/Home';
import AlbumScreen from '../screens/Album';
import ArtistScreen from '../screens/Artitst';

import SearchResultScreen from '../screens/SearchResults';
const Stack = createNativeStackNavigator();

export default () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerShown: false
      }}
    />
    <Stack.Screen
      name="Album"
      component={AlbumScreen}
      options={{
        headerShown: false
      }}
      initialParams={{ title: 'Tải nhạc' }}
    />
    <Stack.Screen
      name="SearchResults"
      component={SearchResultScreen}
      options={{
        headerShown: false
      }}
    />
    
    <Stack.Screen
        name="Artist"
        component={ArtistScreen}
        options={{
          headerShown: false,
        }}
      />
  </Stack.Navigator>
);
