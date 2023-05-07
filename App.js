import * as React from 'react';
import { StatusBar } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { func } from './src/constants';

// root stack navigation
import RootStack from './src/navigation/RootStack';

import AsyncStorage from '@react-native-async-storage/async-storage';
// app context state
import AppState from './src/context/AppState';

const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await func.loadAssetsAsync();
        const userDetail = await AsyncStorage.getItem('userDetail');
        if (userDetail !== null) {
          const data = JSON.parse(userDetail);
          
          const detail = {
            Avatar: data.Avatar, 
            Email: data.Email, 
            isActive: data.isActive, 
            isLogin: data.isLogin, 
            name: data.name
          }
          updateState('userDetail', detail);
        }
      } catch (e) {
        // console.warn(e);
      } finally {
        // loading is complete
        setIsLoading(false);
      }
    }

    prepare();
  }, []);

  React.useEffect(() => {
    // when loading is complete
    if (isLoading === false) {
      // hide splash function
      const hideSplash = async () => SplashScreen.hideAsync();

      // hide splash screen to show app
      hideSplash();

    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <AppState>
      <StatusBar barStyle="light-content" />
      <RootStack />
    </AppState>
  );
};

export default App;
