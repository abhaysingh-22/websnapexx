import { supabase } from "@/integrations/supabase/client";
import type { Conversation, Message, ChatMessage } from "@/types/history.type";

export const historyService = {
  // Conversations
  async createConversation(userId: string, featureTitle: string, previewImageUrl?: string): Promise<Conversation> {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        feature_title: featureTitle,
        preview_image_url: previewImageUrl,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return data as Conversation;
  },

  async getConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Conversation[];
  },

  async getConversation(conversationId: string): Promise<Conversation | null> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as Conversation;
  },

  async updateConversation(conversationId: string, updates: Partial<Pick<Conversation, 'status' | 'preview_image_url'>>): Promise<Conversation> {
    const { data, error } = await supabase
      .from('conversations')
      .update(updates)
      .eq('id', conversationId)
      .select()
      .single();

    if (error) throw error;
    return data as Conversation;
  },

  async deleteConversation(conversationId: string): Promise<void> {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (error) throw error;
  },

  // Messages
  async addMessage(conversationId: string, userId: string, message: ChatMessage): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        role: message.role,
        content: message.content,
        images: message.images || [],
      })
      .select()
      .single();

    if (error) throw error;
    return data as Message;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []) as Message[];
  },

  async completeConversation(conversationId: string): Promise<void> {
    await this.updateConversation(conversationId, { status: 'completed' });
  },
};
