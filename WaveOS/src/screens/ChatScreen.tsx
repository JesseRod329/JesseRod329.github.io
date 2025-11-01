// Chat Screen - 5-minute timed chat

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { ChatMessage } from '../types';
import { Alert } from 'react-native';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;
type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;

export default function ChatScreen() {
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const route = useRoute<ChatScreenRouteProp>();
  const { chatId } = route.params;
  const { user } = useAuth();
  const { messages, sendMessage, selectChat, closeChat, chats } = useChat();
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    selectChat(chatId);

    // Find chat expiration time
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      const expirationTime = new Date(chat.expires_at).getTime();
      const timer = setInterval(() => {
        const remaining = Math.max(0, Math.floor((expirationTime - Date.now()) / 1000));
        setTimeRemaining(remaining);

        if (remaining === 0) {
          clearInterval(timer);
          Alert.alert('Chat Expired', 'This chat has expired. Returning to discovery...');
          closeChat();
          navigation.replace('Discovery');
        }
      }, 1000);

      return () => {
        clearInterval(timer);
        closeChat();
      };
    }

    return () => {
      closeChat();
    };
  }, [chatId, chats]);

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;

    try {
      setSending(true);
      await sendMessage(inputText.trim());
      setInputText('');
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isOwn = item.sender_id === user?.id;

    return (
      <View style={[styles.messageContainer, isOwn && styles.ownMessage]}>
        <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
          {item.content}
        </Text>
        <Text style={styles.messageTime}>
          {new Date(item.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
        {timeRemaining !== null && (
          <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || sending) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  timer: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  messagesList: {
    padding: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    maxWidth: '75%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  ownMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  ownMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

