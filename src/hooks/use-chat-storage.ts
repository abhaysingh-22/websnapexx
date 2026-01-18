import { useState, useEffect, useCallback } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  images?: string[];
  timestamp: Date;
}

export interface Conversation {
  id: string;
  featureTitle: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  previewImage?: string;
  status: "COMPLETED" | "IN_PROGRESS";
}

const STORAGE_KEY = "chat_conversations";

const getConversations = (): Conversation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.map((conv: any) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      messages: conv.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch {
    return [];
  }
};

const saveConversations = (conversations: Conversation[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error("Failed to save conversations:", error);
  }
};

export const useChatStorage = (conversationId?: string, featureTitle?: string) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Load or create conversation
  useEffect(() => {
    if (conversationId) {
      const conversations = getConversations();
      const existing = conversations.find((c) => c.id === conversationId);
      if (existing) {
        setConversation(existing);
        setMessages(existing.messages);
      }
    } else if (featureTitle) {
      // Create new conversation
      const newConv: Conversation = {
        id: Date.now().toString(),
        featureTitle,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "IN_PROGRESS",
      };
      setConversation(newConv);
      setMessages([]);
    }
  }, [conversationId, featureTitle]);

  // Save message and update conversation
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      const updated = [...prev, message];
      
      setConversation((conv) => {
        if (!conv) return null;
        
        const updatedConv: Conversation = {
          ...conv,
          messages: updated,
          updatedAt: new Date(),
          previewImage: message.images?.[0] || conv.previewImage,
        };

        // Save to localStorage
        const conversations = getConversations();
        const existingIndex = conversations.findIndex((c) => c.id === conv.id);
        if (existingIndex >= 0) {
          conversations[existingIndex] = updatedConv;
        } else {
          conversations.unshift(updatedConv);
        }
        saveConversations(conversations);

        return updatedConv;
      });

      return updated;
    });
  }, []);

  // Mark conversation as completed
  const completeConversation = useCallback(() => {
    setConversation((conv) => {
      if (!conv) return null;
      
      const updatedConv: Conversation = {
        ...conv,
        status: "COMPLETED",
        updatedAt: new Date(),
      };

      const conversations = getConversations();
      const existingIndex = conversations.findIndex((c) => c.id === conv.id);
      if (existingIndex >= 0) {
        conversations[existingIndex] = updatedConv;
        saveConversations(conversations);
      }

      return updatedConv;
    });
  }, []);

  return {
    conversation,
    messages,
    addMessage,
    completeConversation,
    conversationId: conversation?.id,
  };
};

// Hook for getting all conversations (for History page)
export const useConversationHistory = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    setConversations(getConversations());
  }, []);

  const refreshHistory = useCallback(() => {
    setConversations(getConversations());
  }, []);

  const deleteConversation = useCallback((id: string) => {
    const conversations = getConversations().filter((c) => c.id !== id);
    saveConversations(conversations);
    setConversations(conversations);
  }, []);

  return { conversations, refreshHistory, deleteConversation };
};
