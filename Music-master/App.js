
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/navigation/appNavigator';
import AudioProvider from './app/context/AudioProvider';
import AudioListItem from './app/component/AudioListItem';
import { View } from 'react-native';


export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer>
        <AppNavigator></AppNavigator>
      </NavigationContainer>
    </AudioProvider>
  );
  // return (
  //   <View style={{marginTop: 50}}>
  //     <AudioListItem/>
  //   </View>
  // );
}


