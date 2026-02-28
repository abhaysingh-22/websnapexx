/**
 * gemini.ts — Vertex AI Gemini model wrapper
 *
 * Handles text chat, vision (image understanding), and native image generation
 * via Gemini's responseModalities: ["TEXT", "IMAGE"] capability.
 */

import { GCP_PROJECT_ID, VERTEX_LOCATION } from "../auth/gcpAuth.ts";

// ─── Model IDs (confirmed from Google AI docs, Feb 2026) ──────────────────────

/** Gemini 2.0 Flash — Compare Pictures, intent detection, general chat */
export const GEMINI_FLASH_MODEL = "gemini-2.0-flash-001";

/** Gemini 3 Pro Image Preview — Professional Mode, Edit/Enhance Photo
 *  Supports vision input + native image generation output */
export const GEMINI_PRO_IMAGE_MODEL = "gemini-3-pro-image-preview";

export interface GeminiResult {
  text: string;
  imageUrl?: string; // base64 data URI if model returned an image
}

export interface GeminiCallParams {
  systemPrompt: string;
  message: string;
  /** Single image (all features except Compare Pictures). */
  imageUrl?: string;
  /** Multiple images for side-by-side analysis (Compare Pictures). */
  imageUrls?: string[];
  conversationHistory: Array<{ role: string; content: string }>;
  accessToken: string;
  /** Explicit model override. Defaults to GEMINI_FLASH_MODEL. */
  model?: string;
  /** When true, adds responseModalities: ["TEXT", "IMAGE"] to the request. */
  withImageOutput?: boolean;
}

// ─── Fetch and convert a remote URL to inline base64 ────────────────────────

async function urlToInlineData(
  url: string
): Promise<{ mimeType: string; data: string } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return {
      mimeType: res.headers.get("content-type") || "image/jpeg",
      data: btoa(binary),
    };
  } catch {
    return null;
  }
}

// ─── Main Gemini call ────────────────────────────────────────────────────────

export async function callVertexGemini(
  params: GeminiCallParams
): Promise<GeminiResult> {
  const {
    systemPrompt,
    message,
    imageUrl,
    imageUrls,
    conversationHistory,
    accessToken,
    model = GEMINI_FLASH_MODEL,
    withImageOutput = false,
  } = params;

  // gemini-3-pro-image-preview uses locations/global on the root domain.
  // All other Gemini models use the regional subdomain (us-central1).
  const isGlobalModel = model === GEMINI_PRO_IMAGE_MODEL;
  const endpoint = isGlobalModel
    ? `https://aiplatform.googleapis.com/v1/projects/${GCP_PROJECT_ID}/locations/global/publishers/google/models/${model}:generateContent`
    : `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${GCP_PROJECT_ID}/locations/${VERTEX_LOCATION}/publishers/google/models/${model}:generateContent`;

  // Build history (last 10 turns)
  const contents: unknown[] = conversationHistory.slice(-10).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  // Build current user turn
  const userParts: unknown[] = [];
  if (message) userParts.push({ text: message });

  // Resolve all images to inline base64 — supports both single and multi-image
  const allImages: string[] = [];
  if (imageUrls && imageUrls.length > 0) {
    allImages.push(...imageUrls);
  } else if (imageUrl) {
    allImages.push(imageUrl);
  }

  for (const img of allImages) {
    if (img.startsWith("data:")) {
      const match = img.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        userParts.push({ inlineData: { mimeType: match[1], data: match[2] } });
      }
    } else {
      // Signed URL or public URL — fetch and convert
      const inline = await urlToInlineData(img);
      if (inline) {
        userParts.push({ inlineData: inline });
      } else {
        console.error("[gemini] Could not fetch image from URL:", img.slice(0, 80));
      }
    }
  }

  contents.push({ role: "user", parts: userParts });

  // Generation config — add responseModalities when image output is needed
  const generationConfig: Record<string, unknown> = {
    temperature: 0.7,
    maxOutputTokens: 4096,
    topP: 0.95,
  };
  if (withImageOutput) {
    generationConfig.responseModalities = ["TEXT", "IMAGE"];
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig,
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_ONLY_HIGH",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH",
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[gemini] Vertex AI error:", res.status, errText);
    throw new Error(`Vertex AI error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const candidate = data?.candidates?.[0];

  // Safety block — return a graceful message
  if (candidate?.finishReason === "SAFETY") {
    return {
      text: "I understand your request, but it was blocked by safety filters. Could you please rephrase with more details?",
    };
  }

  const parts = candidate?.content?.parts ?? [];
  let responseText = "";
  let responseImageUrl: string | undefined;

  for (const part of parts) {
    if (part.text) {
      responseText += part.text;
    } else if (part.inlineData?.data && part.inlineData?.mimeType) {
      responseImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  if (!responseText && !responseImageUrl) {
    console.error(
      "[gemini] Empty response. Raw:",
      JSON.stringify(data).slice(0, 500)
    );
    return {
      text: "I'm sorry, I couldn't generate a response for that. Could you please rephrase your request?",
    };
  }

  return {
    text: responseText || "Here's the result! ✨ Let me know if you'd like any changes.",
    imageUrl: responseImageUrl,
  };
}
