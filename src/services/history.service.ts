// Stub history service - uses localStorage only (no backend)
import type { Conversation, Message, ChatMessage } from "@/types/history.type";

const CONVERSATIONS_KEY = 'app_conversations';
const MESSAGES_KEY = 'app_messages';

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

const getStoredConversations = (): Conversation[] => {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveConversations = (conversations: Conversation[]) => {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
};

const getStoredMessages = (): Message[] => {
  try {
    const stored = localStorage.getItem(MESSAGES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveMessages = (messages: Message[]) => {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
};

export const historyService = {
  // Conversations
  async createConversation(userId: string, featureTitle: string, previewImageUrl?: string): Promise<Conversation> {
    const conversation: Conversation = {
      id: generateId(),
      user_id: userId,
      feature_title: featureTitle,
      preview_image_url: previewImageUrl || null,
      status: 'active',
      message_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const conversations = getStoredConversations();
    conversations.unshift(conversation);
    saveConversations(conversations);

    return conversation;
  },

  async getConversations(userId: string): Promise<Conversation[]> {
    return getStoredConversations().filter(c => c.user_id === userId);
  },

  async getConversation(conversationId: string): Promise<Conversation | null> {
    const conversations = getStoredConversations();
    return conversations.find(c => c.id === conversationId) || null;
  },

  async updateConversation(conversationId: string, updates: Partial<Pick<Conversation, 'status' | 'preview_image_url'>>): Promise<Conversation> {
    const conversations = getStoredConversations();
    const index = conversations.findIndex(c => c.id === conversationId);
    
    if (index === -1) throw new Error('Conversation not found');
    
    conversations[index] = {
      ...conversations[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    saveConversations(conversations);
    return conversations[index];
  },

  async deleteConversation(conversationId: string): Promise<void> {
    const conversations = getStoredConversations().filter(c => c.id !== conversationId);
    saveConversations(conversations);
    
    // Also delete related messages
    const messages = getStoredMessages().filter(m => m.conversation_id !== conversationId);
    saveMessages(messages);
  },

  // Messages
  async addMessage(conversationId: string, userId: string, message: ChatMessage): Promise<Message> {
    const newMessage: Message = {
      id: generateId(),
      conversation_id: conversationId,
      user_id: userId,
      role: message.role,
      content: message.content,
      images: message.images || [],
      created_at: new Date().toISOString(),
    };

    const messages = getStoredMessages();
    messages.push(newMessage);
    saveMessages(messages);

    // Update conversation message count
    const conversations = getStoredConversations();
    const convIndex = conversations.findIndex(c => c.id === conversationId);
    if (convIndex !== -1) {
      conversations[convIndex].message_count = messages.filter(m => m.conversation_id === conversationId).length;
      conversations[convIndex].updated_at = new Date().toISOString();
      saveConversations(conversations);
    }

    return newMessage;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    return getStoredMessages()
      .filter(m => m.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },

  async completeConversation(conversationId: string): Promise<void> {
    await this.updateConversation(conversationId, { status: 'completed' });
  },
};
