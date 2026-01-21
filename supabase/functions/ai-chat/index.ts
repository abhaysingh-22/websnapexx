// AI Chat Edge Function

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface RequestBody {
  messages: AIMessage[];
  featureContext?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, featureContext }: RequestBody = await req.json();
    console.log('AI Chat request received:', { messageCount: messages.length, featureContext });

    // Build system message based on feature context
    const systemMessage = featureContext 
      ? `You are an AI assistant specialized in ${featureContext}. Help the user with their request professionally and concisely.`
      : 'You are a helpful AI assistant for an image editing platform. Help users with their creative projects.';

    // For now, return a mock response
    // In production, this would call the Lovable AI Gateway
    const aiResponse = generateMockResponse(messages, featureContext);

    console.log('AI response generated successfully');

    return new Response(
      JSON.stringify({ message: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const error = err as Error;
    console.error('AI Chat error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateMockResponse(messages: AIMessage[], featureContext?: string): string {
  const lastMessage = messages[messages.length - 1];
  
  const responses: Record<string, string> = {
    'AI Headshots': "I'd be happy to help enhance your headshot! For the best results, please upload a clear, well-lit photo of yourself. I can adjust lighting, background, and overall professional appearance.",
    'Background Remover': "I can help remove the background from your image! Upload your photo and I'll cleanly separate the subject from the background. You can then add a new background or keep it transparent.",
    'AI Enhance': "Let me enhance your image! I can improve clarity, adjust colors, and bring out the best details in your photo. Upload your image to get started.",
    'Object Removal': "I can remove unwanted objects from your photos seamlessly. Just upload your image and tell me what you'd like removed, and I'll handle the rest.",
    'Product Shots': "I specialize in creating professional product photography. Upload your product image and I'll enhance it with professional lighting, clean backgrounds, and optimal presentation.",
  };

  return responses[featureContext || ''] || 
    "I'm here to help with your image editing needs! Please describe what you'd like to accomplish or upload an image to get started.";
}