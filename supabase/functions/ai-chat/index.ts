/**
 * ai-chat — Supabase Edge Function
 *
 * Routes requests for SnapExx's 4 AI features:
 *
 *  TEXT (feature guidance / analysis / comparison)
 *    → Gemini API  (server-side, secret: GEMINI_API_KEY)
 *
 *  IMAGE GENERATION  ("Prompt to Picture" with action: "generate_image")
 *    → Proxies to the existing `generate-image` edge function
 *      (that function already uses GCP_SERVICE_ACCOUNT_KEY + GCP_PROJECT_ID)
 *
 * Required Supabase secret  (set once):
 *   supabase secrets set GEMINI_API_KEY=your_google_ai_studio_key
 *
 * No other secrets needed here — SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * are injected automatically by Supabase into every edge function.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-auth-exp",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ─── Gemini config ────────────────────────────────────────────────────────────
// Using gemini-1.5-pro for full vision + text support across all 4 features
const GEMINI_API_KEY = Deno.env.get("VITE_GEMINI_API_KEY") ?? "";
const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_ENDPOINT =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// ─── Request body shape ───────────────────────────────────────────────────────
interface RequestBody {
  message: string;
  imageUrl?: string;                       // base64 data URI or public URL
  featureType: string;                     // one of the 4 feature names
  action?: "chat" | "generate_image";      // default "chat"
  conversationHistory?: Array<{ role: string; content: string }>;
}

// ─── Intent detection — quick Gemini call to classify user intent ──────────────
async function detectImageIntent(message: string): Promise<boolean> {
  if (!GEMINI_API_KEY || !message.trim()) return false;

  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: `You are an intent classifier. Your ONLY job is to determine if the user wants to CREATE/GENERATE a new image.

Reply with exactly one word:
- "GENERATE" — if the user is asking to create, generate, make, draw, design, or produce a new image/picture/photo/artwork.
- "CHAT" — if the user is asking a question, having a conversation, requesting help with prompts, asking for advice, or anything else that is NOT directly requesting image creation.

Examples:
"A cinematic portrait of a woman in golden hour" → GENERATE
"Create a logo for my brand" → GENERATE
"Generate a futuristic city" → GENERATE
"How do I make better prompts?" → CHAT
"What styles work best for portraits?" → CHAT
"Can you help me improve this prompt?" → CHAT
"Tell me about image generation" → CHAT
"Hello" → CHAT`,
          }],
        },
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 10 },
      }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toUpperCase();
    return reply === "GENERATE";
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  // ── Preflight — must return 204 with CORS headers for browsers to proceed ────
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();
    const {
      message,
      imageUrl,
      featureType,
      action,
      conversationHistory = [],
    } = body;

    if (!message && !imageUrl) {
      return jsonError("message or imageUrl is required", 400);
    }

    if (!GEMINI_API_KEY) {
      return jsonError(
        "VITE_GEMINI_API_KEY secret is not set. Run: supabase secrets set VITE_GEMINI_API_KEY=your_key",
        500
      );
    }

    // ── "Prompt to Picture" — smart intent detection ──────────────────────────
    // If caller explicitly says generate_image, honour that.
    // Otherwise, ask Gemini to classify: does the user want to generate or chat?
    if (featureType === "Prompt to Picture") {
      const shouldGenerate =
        action === "generate_image" || await detectImageIntent(message);

      if (shouldGenerate) {
        try {
          const publicUrl = await callGenerateImageFunction(message);
          return jsonOk({
            message: "Here's your generated image! ✨ Let me know if you'd like any changes or a new variation.",
            imageUrl: publicUrl,
          });
        } catch (genErr) {
          const errMsg = genErr instanceof Error ? genErr.message : "Image generation failed";
          console.error("[ai-chat] Image generation error:", genErr);
          return jsonError(errMsg, 500);
        }
      }
    }

    // ── Feature text chat → Gemini API (server-side) ──────────────────────────
    const systemPrompt = getSystemPrompt(featureType);
    const reply = await callGemini({ systemPrompt, message, imageUrl, conversationHistory });
    return jsonOk({ message: reply });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    console.error("[ai-chat] Error:", err);
    return jsonError(msg, 500);
  }
});

// ─── Proxy to existing `generate-image` edge function ─────────────────────────
// That function handles: GCP auth → Vertex AI Imagen → Supabase Storage upload
// Request:  { prompt: string }
// Response: { url: string }  (public Supabase Storage URL)
async function callGenerateImageFunction(prompt: string): Promise<string> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const res = await fetch(`${supabaseUrl}/functions/v1/generate-image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(`generate-image function error: ${data.error ?? res.statusText}`);
  }

  if (!data.url) {
    throw new Error("generate-image did not return a URL");
  }

  return data.url as string;
}

// ─── Gemini API — text + vision ───────────────────────────────────────────────
async function callGemini({
  systemPrompt,
  message,
  imageUrl,
  conversationHistory,
}: {
  systemPrompt: string;
  message: string;
  imageUrl?: string;
  conversationHistory: Array<{ role: string; content: string }>;
}): Promise<string> {

  // Build conversation history (Gemini uses "model" for assistant turns)
  const contents: unknown[] = conversationHistory.slice(-10).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  // Build user turn — include image inline if provided
  const userParts: unknown[] = [];
  if (message) userParts.push({ text: message });

  if (imageUrl) {
    if (imageUrl.startsWith("data:")) {
      // base64 data URI  →  inlineData
      const withoutPrefix = imageUrl.replace("data:", "");
      const [mimeType, data] = withoutPrefix.split(";base64,");
      userParts.push({ inlineData: { mimeType, data } });
    } else {
      // Public URL  →  fileData
      userParts.push({ fileData: { mimeType: "image/jpeg", fileUri: imageUrl } });
    }
  }

  contents.push({ role: "user", parts: userParts });

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        topP: 0.95,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini");
  return text;
}

// ─── System prompts per feature ───────────────────────────────────────────────
function getSystemPrompt(featureType: string): string {
  // Cross-feature guard — appended to every feature prompt
  const CROSS_FEATURE_GUARD = `

CROSS-FEATURE GUARD (CRITICAL):
You are ONLY the "${featureType}" tool. If the user asks you to do something that belongs to a DIFFERENT tool, you MUST politely decline and suggest the correct tool.

Tool mapping:
• Image generation / creation → "Prompt to Picture" tool
• Photo comparison / visual analysis → "Compare Pictures" tool
• Photo editing / enhancement (sharpness, noise, upscale, background) → "Edit/Enhance Photo" tool
• Professional editing settings / color grading / studio workflows → "Professional Mode" tool
• Video ad creation / product showcase videos → "AI Ad Video Generation" tool

Example rejection: "That's a great idea! However, creating images from text is handled by the **Prompt to Picture** tool. Please select it from the 🔧 Tools menu to get started."

Do NOT attempt to perform another tool's function. Be helpful but firm about scope.`;

  switch (featureType) {
    case "AI Ad Video Generation":
      return `You are an expert AI ad video generation assistant for SnapExx AI.
Your job is to help users conceptualise, script, and plan high-converting video advertisements.

Guidelines:
- Help users define their ad concept: target audience, message, tone, duration, and platform
- Generate detailed video scripts with scene-by-scene breakdowns including visuals, text overlays, transitions, and audio cues
- Suggest optimal video formats and durations for different platforms (Instagram Reels, TikTok, YouTube Shorts, Facebook Ads)
- Provide storyboard descriptions with camera angles, lighting, color palettes, and motion graphics ideas
- Advise on best practices for ad hooks (first 3 seconds), CTAs, and engagement strategies
- Help with A/B testing ideas for different ad variations
- Give estimated production timelines and complexity ratings` + CROSS_FEATURE_GUARD;

    case "Prompt to Picture":
      return `You are an expert AI image generation assistant for SnapExx AI, powered by Vertex AI Imagen.
Your job is to help users craft perfect prompts that produce stunning, high-quality images.

Guidelines:
- Help refine and improve their text prompts for sharper, more vivid results
- Suggest style keywords (photorealistic, cinematic, 8K, bokeh, golden hour, studio lighting, etc.)
- Ask clarifying questions about mood, subject, colours, and composition when needed
- Optimise prompts for Imagen's best output quality
- When the prompt is finalised, present it in a clearly labelled block:
  **Final Prompt:** <the complete, optimised prompt here>
- Let the user know they can click "Generate Image" to create it with Vertex AI Imagen` + CROSS_FEATURE_GUARD;

    case "Compare Pictures":
      return `You are an expert photo analysis and comparison assistant for SnapExx AI.
Your job is to analyse and compare images provided by the user.

Guidelines:
- Identify differences in lighting, exposure, composition, colour grading, sharpness, and depth of field
- Give a professional photography critique for each image with scores (e.g. Composition: 8/10)
- Recommend which image is stronger for specific use-cases: social media, print, portfolio, e-commerce
- Provide specific, actionable improvement suggestions
- Describe every key visual element you observe in detail when an image is attached` + CROSS_FEATURE_GUARD;

    case "Professional Mode":
      return `You are an expert studio photography and professional post-processing assistant for SnapExx AI.
Your job is to guide professional-grade photo editing workflows.

Guidelines:
- Provide precise editing parameters: exposure, contrast, highlights, shadows, whites, blacks, clarity, dehaze
- Guide colour grading, LUT selection, split-toning, and HSL adjustments with exact values
- Advise on seed-based consistency for batch editing sessions
- Suggest advanced retouching: frequency separation, dodge & burn, skin smoothing techniques
- Help with studio lighting simulation, white balance correction, and commercial-grade finishing
- Provide parameters in a structured table format when giving editing instructions` + CROSS_FEATURE_GUARD;

    case "Edit/Enhance Photo":
      return `You are an expert AI photo enhancement assistant for SnapExx AI.
Your job is to help users enhance their photos using AI-powered tools.

Guidelines:
- Analyse uploaded images and identify specific areas for improvement
- Guide upscaling, noise reduction, sharpening, and detail recovery with step-by-step instructions
- Provide before/after improvement plans with clear, numbered steps
- Suggest colour correction, exposure balancing, and tone mapping adjustments
- Help with background enhancement, object removal, and selective adjustments
- Give estimated improvement percentages to set expectations` + CROSS_FEATURE_GUARD;

    default:
      return `You are a helpful AI creative assistant for SnapExx AI, a professional AI-powered photo editing platform.
Help users with their image editing, generation, and creative tasks in a professional, concise manner.

If the user asks you to perform a specific feature action, suggest they select the appropriate tool from the 🔧 Tools menu:
• Image generation → "Prompt to Picture"
• Photo comparison → "Compare Pictures"
• Photo editing → "Edit/Enhance Photo"
• Professional editing → "Professional Mode"
• Video ad creation → "AI Ad Video Generation"`;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
