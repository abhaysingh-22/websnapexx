import { useState, useEffect, useCallback } from 'react';
import { historyService } from '@/services/history.service';
import { useAuth } from './useAuth';
import type { Conversation, Message, ChatMessage } from '@/types/history.type';

export const useHistory = () => {
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      setIsLoading(false);
      return;
    }

    try {
      const data = await historyService.getConversations(user.id);
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    } else {
      setConversations([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchConversations]);

  const createConversation = useCallback(async (featureTitle: string, previewImageUrl?: string): Promise<Conversation | null> => {
    if (!user) return null;

    try {
      const conversation = await historyService.createConversation(user.id, featureTitle, previewImageUrl);
      setConversations(prev => [conversation, ...prev]);
      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }, [user]);

  const deleteConversation = useCallback(async (conversationId: string): Promise<boolean> => {
    try {
      await historyService.deleteConversation(conversationId);
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  }, []);

  const refreshHistory = useCallback(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    createConversation,
    deleteConversation,
    refreshHistory,
  };
};

export const useConversation = (conversationId: string | null) => {
  const { user } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversation = useCallback(async () => {
    if (!conversationId) {
      setConversation(null);
      setMessages([]);
      setIsLoading(false);
      return;
    }

    try {
      const [conversationData, messagesData] = await Promise.all([
        historyService.getConversation(conversationId),
        historyService.getMessages(conversationId),
      ]);
      setConversation(conversationData);
      setMessages(messagesData);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  const addMessage = useCallback(async (message: ChatMessage): Promise<Message | null> => {
    if (!conversationId || !user) return null;

    try {
      const newMessage = await historyService.addMessage(conversationId, user.id, message);
      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  }, [conversationId, user]);

  const completeConversation = useCallback(async (): Promise<boolean> => {
    if (!conversationId) return false;

    try {
      await historyService.completeConversation(conversationId);
      setConversation(prev => prev ? { ...prev, status: 'completed' } : null);
      return true;
    } catch (error) {
      console.error('Error completing conversation:', error);
      return false;
    }
  }, [conversationId]);

  return {
    conversation,
    messages,
    isLoading,
    addMessage,
    completeConversation,
    refreshConversation: fetchConversation,
  };
};
