// Main App component

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './contexts/AuthContext';
import { PresenceProvider } from './contexts/PresenceContext';
import { ChatProvider } from './contexts/ChatContext';
import Navigation from './navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <PresenceProvider>
        <ChatProvider>
          <Navigation />
          <StatusBar style="auto" />
        </ChatProvider>
      </PresenceProvider>
    </AuthProvider>
  );
}


