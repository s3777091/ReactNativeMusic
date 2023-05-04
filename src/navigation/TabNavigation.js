import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../constants';

// navigation stacks
import StackHome from './StackHome';
import StackSearch from './StackSearch';
import StackLibrary from './StackLibrary';

// components
import CustomTabBar from '../components/Design/CustomTabBar';

import { AntDesign, Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ active }) => {
        let icon = <AntDesign name="home" color={colors.white} active={active} size={22}/>;

        if (route.name === 'StackSearch') {
          icon = <AntDesign name="search1" color={colors.white} active={active} size={22}/>;
        } else if (route.name === 'StackLibrary') {
          icon = <Ionicons name="albums-outline" color={colors.white} active={active} size={22}/>;
        }

        return icon;

      },
      tabBarActiveTintColor: colors.white,
      tabBarInactiveTintColor: colors.greyInactive,
    })}
    tabBar={(props) => <CustomTabBar {...props} />}
  >
    <Tab.Screen
      name="StackHome"
      component={StackHome}
      options={{
        tabBarLabel: 'Home'
      }}
    />


    <Tab.Screen
      name="StackSearch"
      component={StackSearch}
      options={{
        tabBarLabel: 'Search'
      }}
    />

    <Tab.Screen
      name="StackLibrary"
      component={StackLibrary}
      options={{
        tabBarLabel: 'Library'
      }}
    />
  </Tab.Navigator>
);
