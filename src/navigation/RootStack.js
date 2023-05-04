import * as React from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// navigation
import TabNavigation from './TabNavigation';

// screens
import ModalMusicPlayer from '../screens/ModalMusicPlayer';
import HubScreen from '../screens/Hub';



import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default () => (
  <NavigationContainer theme={DarkTheme}>
    <Stack.Navigator
      screenOptions={{
        presentation: 'fullScreenModal'
      }}
    >
      <Stack.Screen
        name="TabNavigation"
        component={TabNavigation}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="ModalMusicPlayer"
        component={ModalMusicPlayer}
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
          animation: 'slide_from_bottom'
        }}
      />

      <Stack.Screen
        name="Hub"
        component={HubScreen}
        options={{
          animation: 'slide_from_left',
          headerShown: false,
          presentation: 'fullScreenModal'
        }}
        initialParams={{
          title: 'Thể loại',
          image:
            'https://photo-zmp3.zmdcdn.me/cover/d/2/2/3/d223524cfa359d16b2c0d6e4497c126f.jpg'
        }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
          animation: 'slide_from_bottom'
        }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
          animation: 'slide_from_bottom'
        }}
      />

    </Stack.Navigator>
  </NavigationContainer>
);
