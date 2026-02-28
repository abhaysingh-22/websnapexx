/**
 * aiService — AI routing layer for SnapExx
 *
 * ALL chat now routes through the Supabase Edge Function "ai-chat",
 * which uses Vertex AI Gemini (GCP credentials). No direct Google AI
 * Studio calls from the frontend anymore.
 */

import { EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_ANON_KEY } from "@/integrations/externalSupabase/client";

// ─── Shared types ──────────────────────────────────────────────────────────────
export interface AIRequestParams {
  message: string;
  imageUrl?: string;
  featureType: string;
  action?: "chat" | "generate_image";
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface AIServiceResponse {
  success: boolean;
  message?: string;
  imageUrl?: string;
  error?: string;
}

// The 5 feature modes
export const VERTEX_AI_FEATURES = [
  "AI Ad Video Generation",
  "Prompt to Picture",
  "Compare Pictures",
  "Professional Mode",
  "Edit/Enhance Photo",
] as const;

export type VertexAIFeature = (typeof VERTEX_AI_FEATURES)[number];

export function isFeatureMode(featureType: string): featureType is VertexAIFeature {
  return VERTEX_AI_FEATURES.includes(featureType as VertexAIFeature);
}

// ─── Single unified AI call — everything goes through edge function ───────────
async function callEdgeFunction(params: AIRequestParams): Promise<AIServiceResponse> {
  try {
    const url = `${EXTERNAL_SUPABASE_URL}/functions/v1/ai-chat`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": EXTERNAL_SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${EXTERNAL_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        message: params.message,
        imageUrl: params.imageUrl,
        featureType: params.featureType,
        action: params.action ?? "chat",
        conversationHistory: params.conversationHistory ?? [],
      }),
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
      const errMsg = data?.error ?? `Edge function returned ${res.status}`;
      console.error("[aiService] Edge function error:", errMsg, data);
      return { success: false, error: errMsg };
    }

    return {
      success: true,
      message: data.message,
      imageUrl: data.imageUrl,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "AI service call failed";
    console.error("[aiService] Exception:", err);
    return { success: false, error: msg };
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────
export const aiService = {
  /**
   * Main entry point — ALL requests go through the edge function.
   * The edge function uses Vertex AI Gemini (GCP credentials).
   */
  async sendMessage(params: AIRequestParams): Promise<AIServiceResponse> {
    return callEdgeFunction(params);
  },

  /** Explicitly trigger image generation for "Prompt to Picture" */
  async generateImage(prompt: string): Promise<AIServiceResponse> {
    return callEdgeFunction({
      message: prompt,
      featureType: "Prompt to Picture",
      action: "generate_image",
    });
  },
};

// ─── Starter prompts shown in the empty chat state per feature ────────────────
export function getStarterPrompts(featureType: string): string[] {
  switch (featureType) {
    case "AI Ad Video Generation":
      return [
        "Create a 15-second product showcase video for a sneaker brand",
        "Generate a cinematic ad intro with dramatic lighting and text overlay",
        "Make a social media ad video for a coffee shop grand opening",
      ];
    case "Prompt to Picture":
      return [
        "A cinematic portrait of a woman in golden hour light, 8K, photorealistic",
        "Luxury product shot of a perfume bottle on a white marble surface",
        "Futuristic city skyline at night with neon reflections on wet streets",
      ];
    case "Compare Pictures":
      return [
        "Upload two images and I'll compare composition, lighting & colour",
        "Which of these photos has better lighting for Instagram?",
        "Analyse the colour grading differences between my two images",
      ];
    case "Professional Mode":
      return [
        "What settings should I use for a clean corporate headshot look?",
        "Give me a cinematic colour grade preset for golden hour portraits",
        "How do I maintain consistency when batch editing 50 product photos?",
      ];
    case "Edit/Enhance Photo":
      return [
        "Enhance sharpness and reduce noise in this portrait",
        "Make the colours more vibrant and boost contrast",
        "Remove distracting background elements from my photo",
      ];
    default:
      return [
        "What can you help me create today?",
        "Tell me about SnapExx AI's creative tools",
        "How can I enhance my photos with AI?",
      ];
  }
}
