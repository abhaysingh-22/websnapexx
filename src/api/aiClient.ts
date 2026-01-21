import { supabase } from "@/integrations/supabase/client";

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const aiClient = {
  async chat(messages: AIMessage[], featureContext?: string): Promise<AIResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { messages, featureContext },
      });

      if (error) throw error;
      return { success: true, message: data.message };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'AI request failed';
      return { success: false, error: errorMessage };
    }
  },

  async processImage(imageUrl: string, prompt: string, featureType: string): Promise<AIResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-image-process', {
        body: { imageUrl, prompt, featureType },
      });

      if (error) throw error;
      return { success: true, message: data.result };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Image processing failed';
      return { success: false, error: errorMessage };
    }
  },

  async generateSuggestion(context: string): Promise<AIResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-suggestion', {
        body: { context },
      });

      if (error) throw error;
      return { success: true, message: data.suggestion };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Suggestion generation failed';
      return { success: false, error: errorMessage };
    }
  },
};
