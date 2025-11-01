// Discovery Screen - Shows nearby users count

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { usePresence } from '../contexts/PresenceContext';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';

type DiscoveryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Discovery'>;

export default function DiscoveryScreen() {
  const navigation = useNavigation<DiscoveryScreenNavigationProp>();
  const { user } = useAuth();
  const { nearbyUsers, isScanning, startPresence, stopPresence, refreshNearbyUsers } =
    usePresence();
  const { chats, loadChats } = useChat();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Start presence when screen mounts
    startPresence().catch(console.error);

    // Load active chats
    loadChats();

    return () => {
      // Stop presence when screen unmounts
      stopPresence();
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshNearbyUsers(), loadChats()]);
    setRefreshing(false);
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate('WaveHandshake', { receiverId: userId });
  };

  const handleChatPress = (chatId: string) => {
    navigation.navigate('Chat', { chatId });
  };

  const nearbyCount = nearbyUsers.filter((u) => u.user).length;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Discovery</Text>
        <Text style={styles.subtitle}>
          {isScanning ? 'Scanning for nearby users...' : 'Not scanning'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby Users</Text>
        <View style={styles.countContainer}>
          <Text style={styles.count}>{nearbyCount}</Text>
          <Text style={styles.countLabel}>people nearby</Text>
        </View>

        {nearbyUsers.length > 0 && (
          <View style={styles.userList}>
            {nearbyUsers.map((nearbyUser) => {
              if (!nearbyUser.user) return null;
              return (
                <TouchableOpacity
                  key={nearbyUser.beacon_id}
                  style={styles.userCard}
                  onPress={() => handleUserPress(nearbyUser.user!.id)}
                >
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                      {nearbyUser.user.display_name || nearbyUser.user.username}
                    </Text>
                    <Text style={styles.userUsername}>@{nearbyUser.user.username}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.waveButton}
                    onPress={() => handleUserPress(nearbyUser.user!.id)}
                  >
                    <Text style={styles.waveButtonText}>Wave</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {nearbyUsers.length === 0 && isScanning && (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" />
            <Text style={styles.emptyText}>Looking for nearby users...</Text>
          </View>
        )}

        {nearbyUsers.length === 0 && !isScanning && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No nearby users detected</Text>
            <Text style={styles.emptySubtext}>
              Make sure Bluetooth is enabled and you're not in a ghost zone
            </Text>
          </View>
        )}
      </View>

      {chats.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Chats</Text>
          {chats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={styles.chatCard}
              onPress={() => handleChatPress(chat.id)}
            >
              <Text style={styles.chatText}>Chat with user</Text>
              <Text style={styles.chatTime}>
                Expires in {Math.max(0, Math.floor((new Date(chat.expires_at).getTime() - Date.now()) / 60000))} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  countContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
  },
  count: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  countLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  userList: {
    gap: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },
  userUsername: {
    fontSize: 14,
    color: '#666',
  },
  waveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  waveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  chatCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  chatText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  chatTime: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
});


