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

// ─── Shared safety settings ─────────────────────────────────────────────────

const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
];

// ─── Shared request contents builder ─────────────────────────────────────────
// Builds the Gemini `contents` array (history + current user turn with images)

async function buildContents(
  params: Pick<GeminiCallParams, "message" | "imageUrl" | "imageUrls" | "conversationHistory">
): Promise<unknown[]> {
  const { message, imageUrl, imageUrls, conversationHistory } = params;

  const contents: unknown[] = conversationHistory.slice(-30).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const userParts: unknown[] = [];
  if (message) userParts.push({ text: message });

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
      const inline = await urlToInlineData(img);
      if (inline) {
        userParts.push({ inlineData: inline });
      } else {
        console.error("[gemini] Could not fetch image from URL:", img.slice(0, 80));
      }
    }
  }

  contents.push({ role: "user", parts: userParts });
  return contents;
}

// ─── Main Gemini call ────────────────────────────────────────────────────────

export async function callVertexGemini(
  params: GeminiCallParams
): Promise<GeminiResult> {
  const {
    systemPrompt,
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

  // Build conversation + current user turn
  const contents = await buildContents(params);

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
      safetySettings: SAFETY_SETTINGS,
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

// ─── Streaming Gemini call — returns SSE ReadableStream ──────────────────────
// Uses :streamGenerateContent to push tokens to the client as they arrive.
// SSE events:  { t: "chunk", v: "text" }  |  { t: "img", v: "data:..." }  |  { t: "done" }  |  { t: "error", v: "..." }

export async function callVertexGeminiStream(
  params: GeminiCallParams
): Promise<ReadableStream<Uint8Array>> {
  const {
    systemPrompt,
    accessToken,
    model = GEMINI_FLASH_MODEL,
    withImageOutput = false,
  } = params;

  const isGlobalModel = model === GEMINI_PRO_IMAGE_MODEL;
  const endpoint = isGlobalModel
    ? `https://aiplatform.googleapis.com/v1/projects/${GCP_PROJECT_ID}/locations/global/publishers/google/models/${model}:streamGenerateContent`
    : `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${GCP_PROJECT_ID}/locations/${VERTEX_LOCATION}/publishers/google/models/${model}:streamGenerateContent`;

  const contents = await buildContents(params);

  const generationConfig: Record<string, unknown> = {
    temperature: 0.7,
    maxOutputTokens: 4096,
    topP: 0.95,
  };
  if (withImageOutput) {
    generationConfig.responseModalities = ["TEXT", "IMAGE"];
  }

  const encoder = new TextEncoder();

  const vertexRes = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig,
      safetySettings: SAFETY_SETTINGS,
    }),
  });

  if (!vertexRes.ok || !vertexRes.body) {
    const errText = await vertexRes.text();
    const errMsg = `Vertex AI stream error ${vertexRes.status}: ${errText}`;
    console.error("[gemini] Stream start error:", errMsg);
    return new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ t: "error", v: errMsg })}\n\n`));
        controller.close();
      },
    });
  }

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = vertexRes.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const emit = (event: Record<string, unknown>) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Vertex AI streamGenerateContent returns a JSON array streamed line-by-line.
          // Each element is a GenerateContentResponse on its own line, optionally
          // prefixed with a leading comma and/or wrapped in `[` / `]`.
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const clean = line.trim().replace(/^[,\[]+/, "").replace(/[,\]]+$/, "").trim();
            if (!clean) continue;
            try {
              const obj = JSON.parse(clean);
              if (obj?.candidates?.[0]?.finishReason === "SAFETY") {
                emit({ t: "chunk", v: "I understand your request, but it was blocked by safety filters. Could you please rephrase?" });
                continue;
              }
              for (const part of obj?.candidates?.[0]?.content?.parts ?? []) {
                if (part.text) {
                  emit({ t: "chunk", v: part.text });
                } else if (part.inlineData?.data && part.inlineData?.mimeType) {
                  emit({ t: "img", v: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` });
                }
              }
            } catch {
              // Non-JSON line — skip
            }
          }
        }

        // Process any remaining buffered content
        if (buffer.trim()) {
          const clean = buffer.trim().replace(/^[,\[]+/, "").replace(/[,\]]+$/, "").trim();
          if (clean) {
            try {
              const obj = JSON.parse(clean);
              for (const part of obj?.candidates?.[0]?.content?.parts ?? []) {
                if (part.text) emit({ t: "chunk", v: part.text });
                else if (part.inlineData?.data) emit({ t: "img", v: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` });
              }
            } catch { /* ignore */ }
          }
        }

        emit({ t: "done" });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Streaming error";
        console.error("[gemini] Stream read error:", err);
        emit({ t: "error", v: msg });
      } finally {
        controller.close();
      }
    },
  });
}
