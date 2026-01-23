import { externalSupabase } from "@/integrations/externalSupabase/client";

interface SendMessageParams {
  conversationId: string;
  userId: string;
  userMessage: string;
  imageUrl?: string;
}

interface ChatResponse {
  success: boolean;
  assistantMessage?: string;
  error?: string;
}

export async function sendChatMessage(params: SendMessageParams): Promise<ChatResponse> {
  const { conversationId, userId, userMessage, imageUrl } = params;

  try {
    // 1. Save user message to database
    const { error: userMsgError } = await externalSupabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        role: "user",
        content: userMessage,
        image_url: imageUrl,
      });

    if (userMsgError) throw userMsgError;

    // 2. Call your AI API here (e.g., OpenAI, Claude, etc.)
    // Replace this with your actual AI endpoint
    const aiResponse = await callAIService(userMessage, imageUrl);

    // 3. Save assistant response to database
    const { error: assistantMsgError } = await externalSupabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        role: "assistant",
        content: aiResponse,
      });

    if (assistantMsgError) throw assistantMsgError;

    // 4. Update conversation timestamp
    await externalSupabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    return { success: true, assistantMessage: aiResponse };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to send message";
    console.error("Chat service error:", err);
    return { success: false, error: errorMessage };
  }
}

// Placeholder for AI service call - replace with your actual AI integration
async function callAIService(message: string, imageUrl?: string): Promise<string> {
  // TODO: Replace with your actual AI API call
  // Example with OpenAI, Replicate, etc.
  
  // For now, return a placeholder response
  return `This is a placeholder response. You asked: "${message}"${imageUrl ? " with an image" : ""}`;
}

// Generate title from first message
export async function generateConversationTitle(
  conversationId: string,
  firstMessage: string
): Promise<void> {
  try {
    // Simple title generation - take first 50 chars
    const title = firstMessage.length > 50 
      ? firstMessage.substring(0, 47) + "..." 
      : firstMessage;

    await externalSupabase
      .from("conversations")
      .update({ title })
      .eq("id", conversationId);
  } catch (err) {
    console.error("Failed to generate title:", err);
  }
}