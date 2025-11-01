// Onboarding Screen - Auth, permissions, ghost zone setup

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { requestAllPermissions } from '../utils/permissions';
import { getGhostZones, createGhostZone } from '../services/supabase/client';
import * as Location from 'expo-location';

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen() {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'auth' | 'permissions' | 'ghost-zones'>('auth');
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    if (user && step === 'auth') {
      setStep('permissions');
    }
  }, [user, step]);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isLogin && !username) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    try {
      setLoading(true);
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, username);
      }
      setStep('permissions');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPermissions = async () => {
    try {
      setLoading(true);
      const status = await requestAllPermissions();
      setPermissionsGranted(status.allGranted);

      if (status.allGranted) {
        setStep('ghost-zones');
      } else {
        Alert.alert(
          'Permissions Required',
          'Please enable Bluetooth and Location permissions in Settings to continue.'
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to request permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipGhostZones = async () => {
    // Navigate to discovery screen
    navigation.replace('Discovery');
  };

  const handleAddGhostZone = async () => {
    try {
      setLoading(true);
      const { coords } = await Location.getCurrentPositionAsync();
      
      await createGhostZone({
        name: 'Home',
        latitude: coords.latitude,
        longitude: coords.longitude,
        radius_meters: 100,
      });

      Alert.alert('Success', 'Ghost zone added. You can add more later in settings.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add ghost zone');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    navigation.replace('Discovery');
  };

  if (authLoading || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {step === 'auth' && (
        <View style={styles.section}>
          <Text style={styles.title}>Welcome to WaveOS</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Sign in to continue' : 'Create an account'}
          </Text>

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleAuth}>
            <Text style={styles.buttonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.link}>
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'permissions' && (
        <View style={styles.section}>
          <Text style={styles.title}>Permissions</Text>
          <Text style={styles.subtitle}>
            WaveOS needs Bluetooth and Location permissions to detect nearby users and manage
            ghost zones.
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleRequestPermissions}>
            <Text style={styles.buttonText}>Grant Permissions</Text>
          </TouchableOpacity>

          {permissionsGranted && (
            <TouchableOpacity style={styles.button} onPress={() => setStep('ghost-zones')}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {step === 'ghost-zones' && (
        <View style={styles.section}>
          <Text style={styles.title}>Ghost Zones</Text>
          <Text style={styles.subtitle}>
            Ghost zones are safe spaces (like home or work) where you won't be discoverable. You
            can add them now or skip and add them later.
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleAddGhostZone}>
            <Text style={styles.buttonText}>Add Current Location as Ghost Zone</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSecondary} onPress={handleFinish}>
            <Text style={styles.buttonTextSecondary}>Skip for Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  section: {
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 15,
  },
});


