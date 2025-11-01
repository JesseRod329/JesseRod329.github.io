// Chat Context - manages active chats and messages

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase/client';
import { getActiveChats, getChatMessages, sendChatMessage } from '../services/supabase/client';
import { Chat, ChatMessage } from '../types';

interface ChatContextType {
  chats: Chat[];
  activeChatId: string | null;
  messages: ChatMessage[];
  loading: boolean;
  loadChats: () => Promise<void>;
  selectChat: (chatId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const loadChats = useCallback(async () => {
    try {
      setLoading(true);
      const activeChats = await getActiveChats();
      setChats(activeChats as Chat[]);
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectChat = useCallback(async (chatId: string) => {
    try {
      setActiveChatId(chatId);
      const chatMessages = await getChatMessages(chatId);
      setMessages(chatMessages);

      // Subscribe to new messages
      const channel = supabase
        .channel(`chat:${chatId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `chat_id=eq.${chatId}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as ChatMessage]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('Failed to select chat:', error);
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeChatId) return;

      try {
        await sendChatMessage(activeChatId, content);
        // Message will be added via realtime subscription
      } catch (error) {
        console.error('Failed to send message:', error);
        throw error;
      }
    },
    [activeChatId]
  );

  const closeChat = useCallback(() => {
    setActiveChatId(null);
    setMessages([]);
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        messages,
        loading,
        loadChats,
        selectChat,
        sendMessage,
        closeChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};


