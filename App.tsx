import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { StatusBar } from 'expo-status-bar';
import { Home, Cast, CastMemberProfile, CueSheets, PlotPage, NewCueSheet, Todos } from './src/Pages';
import { LoadAssets } from './src/Components';

const MainStack = createStackNavigator()

export default function App() {
  return (
    <LoadAssets>
      <NavigationContainer>
        <StatusBar style={'light'} />
        <MainStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <MainStack.Screen component={Home} name={'Home'} />
          <MainStack.Screen component={Cast} name={'Cast'} />
          <MainStack.Screen component={CastMemberProfile} name={'CastProfile'} options={{ presentation: 'modal' }} />
          <MainStack.Screen component={CueSheets} name={'CueSheets'} />
          <MainStack.Screen component={NewCueSheet} name={'NewCueSheet'} options={{ presentation: 'modal' }} />
          <MainStack.Screen component={PlotPage} name={'PlotPage'} options={{ gestureEnabled: false }} />
          <MainStack.Screen component={Todos} name={'Todos'} options={{ gestureEnabled: false }} />
        </MainStack.Navigator>
      </NavigationContainer>
    </LoadAssets>
  );
};

