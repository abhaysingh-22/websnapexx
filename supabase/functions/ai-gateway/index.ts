/**
 * ai-gateway — Supabase Edge Function
 *
 * Single entry point for ALL AI features in SnapExx:
 *   • General chat          → Gemini 2.0 Flash
 *   • Prompt to Picture     → Imagen 4       (imagen-4.0-generate-001)
 *   • Edit/Enhance Photo    → Gemini 3 Pro Image Preview   (gemini-3-pro-image-preview)
 *   • Professional Mode     → Gemini 3 Pro Image Preview   (gemini-3-pro-image-preview)
 *   • Compare Pictures      → Gemini 2.0 Flash             (gemini-2.0-flash-001)
 *   • AI Ad Video Generation → Veo 3.1 Fast  (veo-3.1-fast-generate-preview)
 *
 * Architecture:
 *   auth/gcpAuth.ts    — GCP service account auth + intent detection
 *   models/gemini.ts   — Vertex AI Gemini (text, vision, image output)
 *   models/imagen.ts   — Vertex AI Imagen 4  (dedicated text-to-image)
 *   models/veo.ts      — Vertex AI Veo 3.1 Fast (video generation)
 *   features/*.ts      — System prompts per feature
 *
 * Env secrets required:
 *   GCP_SERVICE_ACCOUNT_KEY  — full service account JSON
 *   GCP_PROJECT_ID           — GCP project ID
 *   GCS_VIDEO_BUCKET         — bucket name ONLY, no gs:// prefix (e.g. "snapexx-video-bucket")
 */

import { getCachedAccessToken, detectImageIntent, GCP_PROJECT_ID } from "./auth/gcpAuth.ts";
import {
  callVertexGemini,
  callVertexGeminiStream,
  GEMINI_FLASH_MODEL,
  GEMINI_PRO_IMAGE_MODEL,
} from "./models/gemini.ts";
import { callImagen } from "./models/imagen.ts";
import { generateVideo } from "./models/veo.ts";

import { promptToPicturePrompt } from "./features/promptToPicture.ts";
import { professionalModePrompt } from "./features/professionalMode.ts";
import { editEnhancePrompt } from "./features/editEnhance.ts";
import { comparePicturesPrompt } from "./features/comparePictures.ts";
import { videoGenerationPrompt } from "./features/videoGeneration.ts";

// ─── CORS headers ─────────────────────────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-auth-exp",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ─── Request body ─────────────────────────────────────────────────────────────
interface RequestBody {
  message: string;
  imageUrl?: string;
  /** Multiple images — used by Compare Pictures for side-by-side analysis. */
  imageUrls?: string[];
  featureType: string;
  action?: "chat" | "generate_image" | "generate_video";
  conversationHistory?: Array<{ role: string; content: string }>;
  userId?: string;
}

// ─── Video generation intent detection ───────────────────────────────────────
// Fires when the user explicitly asks to generate a video (no frontend enum needed).
function wantsVideoGeneration(message: string, action?: string): boolean {
  if (action === "generate_video") return true;
  const lower = message.toLowerCase();
  const generateVerbs = ["generate", "create", "make", "produce", "build", "go ahead", "yes", "ok", "proceed", "do it", "start", "let's go", "lets go", "shoot", "render"];
  const videoNouns = ["video", "ad", "advertisement", "clip", "reel", "short", "commercial"];
  return generateVerbs.some((v) => lower.includes(v)) && videoNouns.some((n) => lower.includes(n));
}

// ─── System prompt router ─────────────────────────────────────────────────────
function getSystemPrompt(featureType: string): string {
  switch (featureType) {
    case "Prompt to Picture":
      return promptToPicturePrompt;
    case "Professional Mode":
      return professionalModePrompt;
    case "Edit/Enhance Photo":
      return editEnhancePrompt;
    case "Compare Pictures":
      return comparePicturesPrompt;
    case "AI Ad Video Generation":
      return videoGenerationPrompt;

    case "General Chat":
    default:
      return `You are a helpful AI assistant for SnapExx AI. You are currently in **General Chat** mode — NO feature tool is selected.

IMPORTANT RULES:
1. You can have friendly conversations, answer general questions, explain things, and help with anything non-feature-specific.
2. You CANNOT perform any of the following feature actions in general chat mode. If the user tries any of these, you MUST politely decline and tell them to select the correct tool using the 🔧 Tools button:

   • **Image generation / creation** → "Please select the **Prompt to Picture** tool from the 🔧 Tools menu."
   • **Photo comparison / visual analysis** → "Please select the **Compare Pictures** tool from the 🔧 Tools menu."
   • **Photo editing / enhancement** → "Please select the **Edit/Enhance Photo** tool from the 🔧 Tools menu."
   • **Professional editing / color grading / LinkedIn / Resume** → "Please select the **Professional Mode** tool from the 🔧 Tools menu."
   • **Video ad creation** → "Please select the **AI Ad Video Generation** tool from the 🔧 Tools menu."

3. You CAN answer general questions ABOUT these features (e.g. "What does Professional Mode do?").
4. Be warm, helpful, and concise. Never hallucinate.`;
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  // Pre-flight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();
    const {
      message,
      imageUrl,
      imageUrls,
      featureType,
      action,
      conversationHistory = [],
      userId = "anonymous",
    } = body;

    if (!message && !imageUrl) {
      return jsonError("message or imageUrl is required", 400);
    }

    if (!GCP_PROJECT_ID || !Deno.env.get("GCP_SERVICE_ACCOUNT_KEY")) {
      return jsonError(
        "GCP_PROJECT_ID and GCP_SERVICE_ACCOUNT_KEY secrets are required.",
        500
      );
    }

    const accessToken = await getCachedAccessToken();
    const systemPrompt = getSystemPrompt(featureType);

    // ── Video generation ────────────────────────────────────────────────────
    // Trigger Veo when the user explicitly asks for generation (via action flag OR
    // natural language keywords like "generate the video" / "go ahead" etc.).
    if (featureType === "AI Ad Video Generation" && wantsVideoGeneration(message, action)) {
      // Env stores bucket name only — no gs:// prefix
      const rawBucket = Deno.env.get("GCS_VIDEO_BUCKET") ?? "";
      // Strip any accidentally included gs:// prefix or trailing slashes
      const bucketName = rawBucket.replace(/^gs:\/\//, "").replace(/\/.*$/, "").trim();
      if (!bucketName) {
        return jsonError("GCS_VIDEO_BUCKET secret is required for video generation.", 500);
      }

      // ── Resolve reference image for image-to-video ──────────────────────
      let imageBase64: string | undefined;
      let imageMimeType: string | undefined;

      if (imageUrl) {
        try {
          if (imageUrl.startsWith("data:")) {
            // Already base64 data URI — extract parts
            const match = imageUrl.match(/^data:(image\/\w+);base64,(.+)$/);
            if (match) {
              imageMimeType = match[1];
              imageBase64 = match[2];
            }
          } else {
            // HTTPS URL (e.g. Supabase signed URL) — fetch and convert to base64
            const imgRes = await fetch(imageUrl);
            if (imgRes.ok) {
              const contentType = imgRes.headers.get("content-type") || "image/jpeg";
              imageMimeType = contentType.split(";")[0].trim();
              const buf = await imgRes.arrayBuffer();
              // Convert to base64 using Deno's btoa
              const bytes = new Uint8Array(buf);
              let binary = "";
              for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              imageBase64 = btoa(binary);
            } else {
              console.warn("[ai-gateway] Failed to fetch reference image, falling back to text-to-video");
            }
          }
        } catch (err) {
          console.warn("[ai-gateway] Error processing reference image, falling back to text-to-video:", err);
        }
      }

      const veoResult = await generateVideo({
        prompt: message,
        accessToken,
        bucketName,
        userId,
        sampleCount: 1,
        durationSeconds: 8,
        imageBase64,
        imageMimeType,
      });

      if (veoResult.error) {
        return jsonError(veoResult.error, 500);
      }

      return jsonOk({
        message: "Your video has been generated! 🎬",
        videoUrl: veoResult.videoUrl,
      });
    }

    // ── Prompt to Picture — Imagen 4 for generation, Gemini Flash for chat ────
    if (featureType === "Prompt to Picture" && !imageUrl) {
      const shouldGenerate =
        action === "generate_image" ||
        (await detectImageIntent(message, accessToken));

      if (shouldGenerate) {
        // Use Imagen 4 (imagen-4.0-generate-001) for high-quality text-to-image
        const imagenResult = await callImagen({
          prompt: message,
          accessToken,
          sampleCount: 1,
          aspectRatio: "1:1",
        });

        if (imagenResult.error) {
          // Gracefully fall back to Gemini Pro Image if Imagen fails
          console.error("[ai-gateway] Imagen 4 failed, using Gemini fallback:", imagenResult.error);
          const fallback = await callVertexGemini({
            systemPrompt,
            message,
            conversationHistory,
            accessToken,
            model: GEMINI_PRO_IMAGE_MODEL,
            withImageOutput: true,
          });
          return jsonOk({
            message: fallback.text || "Here's your generated image! ✨",
            imageUrl: fallback.imageUrl,
          });
        }

        return jsonOk({
          message: "Here's your generated image! ✨",
          imageUrl: imagenResult.imageUrl,
        });
      }
    }

    // ── Professional Mode & Edit/Enhance — Gemini 3 Pro Image Preview ────────
    // Supports multimodal input + native image generation output
    if (
      featureType === "Professional Mode" ||
      featureType === "Edit/Enhance Photo"
    ) {
      const result = await callVertexGemini({
        systemPrompt,
        message,
        imageUrl,
        conversationHistory,
        accessToken,
        model: GEMINI_PRO_IMAGE_MODEL,
        withImageOutput: !!imageUrl,
      });
      return jsonOk({
        message: result.text,
        ...(result.imageUrl ? { imageUrl: result.imageUrl } : {}),
      });
    }

    // ── Compare Pictures & General Chat — Gemini 2.0 Flash ──────────────────
    // Vision-only (no image output needed). Supports multiple images for Compare.
    const result = await callVertexGemini({
      systemPrompt,
      message,
      imageUrl,
      imageUrls,
      conversationHistory,
      accessToken,
      model: GEMINI_FLASH_MODEL,
      withImageOutput: false,
    });

    return jsonOk({
      message: result.text,
      ...(result.imageUrl ? { imageUrl: result.imageUrl } : {}),
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    console.error("[ai-gateway] Error:", err);
    return jsonError(msg, 500);
  }
});

// ─── Response helpers ─────────────────────────────────────────────────────────
function jsonOk(data: Record<string, unknown>) {
  return new Response(JSON.stringify({ success: true, ...data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
