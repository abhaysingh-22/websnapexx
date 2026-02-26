/**
 * aiService — AI routing layer for SnapExx
 *
 * Two separate AI providers are used:
 *
 * 1. GEMINI (Google AI Studio) — called DIRECTLY from the frontend
 *    Used for: general chat / "AI Assistant" conversations
 *    Key:      VITE_GEMINI_API_KEY  (in .env)
 *
 * 2. GEMINI via Supabase Edge Function "ai-chat" (server-side)
 *    Used for: all 4 features — text guidance/analysis
 *    Secret:   GEMINI_API_KEY  (set in Supabase: supabase secrets set GEMINI_API_KEY=...)
 *
 * 3. VERTEX AI Imagen — called via existing `generate-image` edge function
 *    Used for: "Prompt to Picture" → generate_image action
 *    Secrets:  GCP_SERVICE_ACCOUNT_KEY + GCP_PROJECT_ID  (already set in generate-image fn)
 */

import { externalSupabase } from "@/integrations/externalSupabase/client";

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
  imageUrl?: string;   // populated when action === "generate_image"
  error?: string;
}

// The 4 feature modes that route to Vertex AI via the edge function
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

// ─── 1. Gemini (Google AI Studio) — direct frontend call ──────────────────────
// Used for general chat / "AI Assistant" mode
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const GEMINI_MODEL = "gemini-2.5-flash"; // fast, cost-effective for chat

async function geminiChat(params: AIRequestParams): Promise<AIServiceResponse> {
  if (!GEMINI_API_KEY) {
    return {
      success: false,
      error: "Gemini API key is not configured. Add VITE_GEMINI_API_KEY to your .env file.",
    };
  }

  try {
    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    // Build conversation history as Gemini contents array
    const contents: unknown[] = (params.conversationHistory ?? [])
      .slice(-10)
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    // User turn — include image if present
    const userParts: unknown[] = [];
    if (params.message) userParts.push({ text: params.message });
    if (params.imageUrl) {
      if (params.imageUrl.startsWith("data:")) {
        const withoutPrefix = params.imageUrl.replace("data:", "");
        const [mimeType, data] = withoutPrefix.split(";base64,");
        userParts.push({ inlineData: { mimeType, data } });
      } else {
        userParts.push({
          fileData: { mimeType: "image/jpeg", fileUri: params.imageUrl },
        });
      }
    }
    contents.push({ role: "user", parts: userParts });

    const systemInstruction = {
      parts: [
        {
          text: `You are a helpful AI creative assistant for SnapExx AI, a professional AI-powered photo editing platform.
Help users with their image editing, generation, and creative questions in a professional, friendly manner.`,
        },
      ],
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction,
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024, topP: 0.95 },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty response from Gemini");

    return { success: true, message: text };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gemini call failed";
    console.error("[geminiChat] Error:", err);
    return { success: false, error: msg };
  }
}

// ─── 2. Vertex AI — via Supabase Edge Function ────────────────────────────────
// Used for all 4 feature modes
async function vertexAIFeature(params: AIRequestParams): Promise<AIServiceResponse> {
  try {
    const { data, error } = await externalSupabase.functions.invoke("ai-chat", {
      body: {
        message: params.message,
        imageUrl: params.imageUrl,
        featureType: params.featureType,
        action: params.action ?? "chat",
        conversationHistory: params.conversationHistory ?? [],
      },
    });

    if (error) {
      console.error("[vertexAIFeature] Edge function error:", error);
      return { success: false, error: error.message };
    }

    if (!data?.success) {
      return { success: false, error: data?.error ?? "Unknown error from Vertex AI" };
    }

    return {
      success: true,
      message: data.message,
      imageUrl: data.imageUrl, // present only for generate_image action
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Vertex AI call failed";
    console.error("[vertexAIFeature] Exception:", err);
    return { success: false, error: msg };
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────
export const aiService = {
  /**
   * Main entry point — automatically routes to the correct AI provider:
   * - Feature mode (4 features) → Vertex AI via edge function
   * - Chat mode (all others)    → Gemini API directly from frontend
   */
  async sendMessage(params: AIRequestParams): Promise<AIServiceResponse> {
    if (isFeatureMode(params.featureType)) {
      // All 4 feature modes route to the Edge Function.
      // The Edge Function handles smart intent detection
      // (e.g. auto-generating images when the user asks for one in "Prompt to Picture").
      return vertexAIFeature(params);
    }
    return geminiChat(params);
  },

  /** Explicitly trigger Vertex AI Imagen image generation for "Prompt to Picture" */
  async generateImage(prompt: string): Promise<AIServiceResponse> {
    return vertexAIFeature({
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
