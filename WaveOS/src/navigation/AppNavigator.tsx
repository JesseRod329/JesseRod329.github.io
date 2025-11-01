// React Navigation setup

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import OnboardingScreen from '../screens/OnboardingScreen';
import DiscoveryScreen from '../screens/DiscoveryScreen';
import WaveHandshakeScreen from '../screens/WaveHandshakeScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Discovery" component={DiscoveryScreen} />
        <Stack.Screen name="WaveHandshake" component={WaveHandshakeScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


