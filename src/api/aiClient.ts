// Stub AI client - no backend, returns mock responses

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
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: "I'm a demo AI assistant. Connect to a backend to enable real AI functionality.",
    };
  },

  async processImage(imageUrl: string, prompt: string, featureType: string): Promise<AIResponse> {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      message: "Image processing demo. Connect to a backend to enable real AI image processing.",
    };
  },

  async generateSuggestion(context: string): Promise<AIResponse> {
    // Simulate suggestion
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: "Try adjusting brightness and contrast for better results.",
    };
  },
};
