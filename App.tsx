import 'react-native-gesture-handler';
import AppLoading from 'expo-app-loading'
import React, { useEffect } from 'react';
import { PlantProps } from './src/libs/storage';
import Routes from './src/routes';

import * as Notifications from 'expo-notifications'

import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost'


const App = () => {
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      async notification => {
        const data = notification.request.content.data.plant as PlantProps;
        console.log(data)
      });

    return () => subscription.remove();
  }, [])

  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  })

  if (!fontsLoaded)
    return <AppLoading />

  return (
    <Routes />
  );
}


export default App;