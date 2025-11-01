// Wave Handshake Screen - Handle mutual wave

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { createWave } from '../services/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/supabase/client';
import { Profile } from '../types';

type WaveHandshakeScreenRouteProp = RouteProp<RootStackParamList, 'WaveHandshake'>;
type WaveHandshakeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WaveHandshake'>;

export default function WaveHandshakeScreen() {
  const navigation = useNavigation<WaveHandshakeScreenNavigationProp>();
  const route = useRoute<WaveHandshakeScreenRouteProp>();
  const { receiverId } = route.params;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [receiverProfile, setReceiverProfile] = useState<Profile | null>(null);
  const [waveStatus, setWaveStatus] = useState<'idle' | 'pending' | 'mutual'>('idle');

  useEffect(() => {
    loadReceiverProfile();
  }, [receiverId]);

  const loadReceiverProfile = async () => {
    try {
      const profile = await getProfile(receiverId);
      setReceiverProfile(profile);
    } catch (error) {
      console.error('Failed to load receiver profile:', error);
      Alert.alert('Error', 'Failed to load user profile');
    }
  };

  const handleWave = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const result = await createWave(receiverId);

      if (result.wave.status === 'mutual') {
        setWaveStatus('mutual');
        // Navigate to chat if mutual
        if (result.chat) {
          setTimeout(() => {
            navigation.replace('Chat', { chatId: result.chat.id });
          }, 1500);
        }
      } else {
        setWaveStatus('pending');
        Alert.alert(
          'Wave Sent',
          'Your wave has been sent. Waiting for the other user to wave back...'
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send wave');
    } finally {
      setLoading(false);
    }
  };

  if (!receiverProfile) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Wave at</Text>
        <Text style={styles.name}>
          {receiverProfile.display_name || receiverProfile.username}
        </Text>
        <Text style={styles.username}>@{receiverProfile.username}</Text>

        {waveStatus === 'idle' && (
          <TouchableOpacity
            style={styles.waveButton}
            onPress={handleWave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.waveButtonText}>Wave 👋</Text>
            )}
          </TouchableOpacity>
        )}

        {waveStatus === 'pending' && (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.statusText}>Waiting for mutual wave...</Text>
          </View>
        )}

        {waveStatus === 'mutual' && (
          <View style={styles.statusContainer}>
            <Text style={styles.successText}>Mutual Wave! 🎉</Text>
            <Text style={styles.statusText}>Opening chat...</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#666',
    marginBottom: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  waveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
    minWidth: 200,
  },
  waveButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});


