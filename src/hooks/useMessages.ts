import { useState, useCallback, useRef, useEffect } from "react";
import { externalSupabase } from "@/integrations/externalSupabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Message } from "./useConversations";

export function useMessages(conversationId: string | null) {
  const { session } = useAuthContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use ref to always have latest conversationId in addMessage
  const conversationIdRef = useRef(conversationId);
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async () => {
    const convId = conversationIdRef.current;
    if (!convId || !session?.user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await externalSupabase
        .from("messages")
        .select("*")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch messages";
      setError(message);
      console.error("Fetch messages error:", err);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  // Add a new message
  const addMessage = async (
    role: "user" | "assistant",
    content: string,
    imageUrl?: string
  ): Promise<Message | null> => {
    const convId = conversationIdRef.current;
    if (!convId || !session?.user?.id) {
      console.error("Cannot add message: missing conversationId or user", { convId, userId: session?.user?.id });
      return null;
    }

    try {
      const { data, error } = await externalSupabase
        .from("messages")
        .insert({
          conversation_id: convId,
          user_id: session.user.id,
          role,
          content,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (error) throw error;

      setMessages((prev) => [...prev, data]);

      // Update conversation's updated_at
      await externalSupabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", convId);

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add message";
      setError(message);
      console.error("Add message error:", err);
      return null;
    }
  };

  // Clear messages (for UI state)
  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    loading,
    error,
    fetchMessages,
    addMessage,
    clearMessages,
    setMessages,
  };
}