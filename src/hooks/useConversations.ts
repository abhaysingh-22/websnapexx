import { useState, useEffect, useCallback } from "react";
import { externalSupabase } from "@/integrations/externalSupabase/client";
import { useAuthContext } from "@/contexts/AuthContext";

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  image_url?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

export function useConversations() {
  const { session } = useAuthContext();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all conversations for the user
  const fetchConversations = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await externalSupabase
        .from("conversations")
        .select("*")
        .eq("user_id", session.user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch conversations";
      setError(message);
      console.error("Fetch conversations error:", err);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  // Create a new conversation
  const createConversation = async (title?: string): Promise<Conversation | null> => {
    if (!session?.user?.id) return null;

    try {
      const { data, error } = await externalSupabase
        .from("conversations")
        .insert({
          user_id: session.user.id,
          title: title || "New Conversation",
        })
        .select()
        .single();

      if (error) throw error;

      setConversations((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create conversation";
      setError(message);
      console.error("Create conversation error:", err);
      return null;
    }
  };

  // Update conversation title
  const updateConversationTitle = async (conversationId: string, title: string) => {
    try {
      const { error } = await externalSupabase
        .from("conversations")
        .update({ title })
        .eq("id", conversationId);

      if (error) throw error;

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, title } : conv
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update conversation";
      setError(message);
      console.error("Update conversation error:", err);
    }
  };

  // Delete a conversation
  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await externalSupabase
        .from("conversations")
        .delete()
        .eq("id", conversationId);

      if (error) throw error;

      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete conversation";
      setError(message);
      console.error("Delete conversation error:", err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    loading,
    error,
    fetchConversations,
    createConversation,
    updateConversationTitle,
    deleteConversation,
  };
}