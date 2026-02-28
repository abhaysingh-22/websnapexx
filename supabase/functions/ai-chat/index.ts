/**
 * ai-chat — Supabase Edge Function
 *
 * ALL chat (general + 5 features) routes through Vertex AI Gemini.
 *
 * Uses GCP service account credentials:
 *   GCP_SERVICE_ACCOUNT_KEY  — full JSON key
 *   GCP_PROJECT_ID           — GCP project ID
 *
 * IMAGE GENERATION  ("Prompt to Picture" + text-only)
 *   → Proxies to the existing `generate-image` edge function
 *
 * ALL OTHER FEATURES are TEXT GUIDANCE tools:
 *   They analyze images and provide expert advice/instructions.
 *   They do NOT actually modify or generate images.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-auth-exp",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ─── Vertex AI config ─────────────────────────────────────────────────────────
const GCP_PROJECT_ID = Deno.env.get("GCP_PROJECT_ID") ?? "";
const GCP_SERVICE_ACCOUNT_KEY = Deno.env.get("GCP_SERVICE_ACCOUNT_KEY") ?? "";
const VERTEX_MODEL = "gemini-2.0-flash-001";
const VERTEX_IMAGE_MODEL = "gemini-2.0-flash-exp"; // Image generation model
const VERTEX_LOCATION = "us-central1";

// ─── Request body shape ───────────────────────────────────────────────────────
interface RequestBody {
  message: string;
  imageUrl?: string;
  featureType: string;
  action?: "chat" | "generate_image";
  conversationHistory?: Array<{ role: string; content: string }>;
}

// ─── GCP Service Account Auth ─────────────────────────────────────────────────
function base64url(data: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlStr(str: string): string {
  return base64url(new TextEncoder().encode(str));
}

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const pemBody = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const binaryDer = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  return crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function getAccessToken(): Promise<string> {
  if (!GCP_SERVICE_ACCOUNT_KEY) {
    throw new Error("GCP_SERVICE_ACCOUNT_KEY is not set");
  }

  const sa = JSON.parse(GCP_SERVICE_ACCOUNT_KEY);
  const now = Math.floor(Date.now() / 1000);

  const header = base64urlStr(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64urlStr(
    JSON.stringify({
      iss: sa.client_email,
      sub: sa.client_email,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
      scope: "https://www.googleapis.com/auth/cloud-platform",
    })
  );

  const key = await importPrivateKey(sa.private_key);
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(`${header}.${payload}`)
  );

  const jwt = `${header}.${payload}.${base64url(new Uint8Array(signature))}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Failed to get access token: ${errText}`);
  }

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

// ─── Token cache ──────────────────────────────────────────────────────────────
let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getCachedAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && tokenExpiry > now + 60) {
    return cachedToken;
  }
  cachedToken = await getAccessToken();
  tokenExpiry = now + 3500;
  return cachedToken;
}

// ─── Intent detection — should we generate an image? ──────────────────────────
async function detectImageIntent(message: string, accessToken: string): Promise<boolean> {
  if (!message.trim()) return false;

  try {
    const endpoint = `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${GCP_PROJECT_ID}/locations/${VERTEX_LOCATION}/publishers/google/models/${VERTEX_MODEL}:generateContent`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: `You are an intent classifier. Reply with exactly one word:
- "GENERATE" — if the user wants to CREATE/GENERATE a new image/picture/photo/artwork.
- "CHAT" — for anything else (questions, conversation, advice, etc.)`,
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

// ─── Main handler ─────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
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

    if (!GCP_PROJECT_ID || !GCP_SERVICE_ACCOUNT_KEY) {
      return jsonError(
        "GCP_PROJECT_ID and GCP_SERVICE_ACCOUNT_KEY secrets are required.",
        500
      );
    }

    const accessToken = await getCachedAccessToken();

    // ── "Prompt to Picture" (text-only, no image attached) → detect intent ────
    if (featureType === "Prompt to Picture" && !imageUrl) {
      const shouldGenerate =
        action === "generate_image" || await detectImageIntent(message, accessToken);

      if (shouldGenerate) {
        // Use Gemini native image generation
        const result = await callVertexGemini({
          systemPrompt: getSystemPrompt(featureType),
          message,
          conversationHistory,
          accessToken,
          withImageOutput: true,
        });
        return jsonOk({
          message: result.text || "Here's your generated image! ✨",
          imageUrl: result.imageUrl,
        });
      }
    }

    // ── Determine if this feature needs image output ──────────────────────────
    const needsImageOutput = (
      featureType === "Edit/Enhance Photo" ||
      featureType === "Professional Mode"
    ) && !!imageUrl;

    // ── All chat (general + features) → Vertex AI Gemini ──────────────────────
    const systemPrompt = getSystemPrompt(featureType);
    const result = await callVertexGemini({
      systemPrompt,
      message,
      imageUrl,
      conversationHistory,
      accessToken,
      withImageOutput: needsImageOutput,
    });

    return jsonOk({
      message: result.text,
      ...(result.imageUrl ? { imageUrl: result.imageUrl } : {}),
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    console.error("[ai-chat] Error:", err);
    return jsonError(msg, 500);
  }
});

// ─── Vertex AI Gemini — text + vision (+ optional image output) ───────────────
interface GeminiResult {
  text: string;
  imageUrl?: string;
}

async function callVertexGemini({
  systemPrompt,
  message,
  imageUrl,
  conversationHistory,
  accessToken,
  withImageOutput = false,
}: {
  systemPrompt: string;
  message: string;
  imageUrl?: string;
  conversationHistory: Array<{ role: string; content: string }>;
  accessToken: string;
  withImageOutput?: boolean;
}): Promise<GeminiResult> {

  // Use a model that supports image generation when needed
  const model = withImageOutput ? VERTEX_IMAGE_MODEL : VERTEX_MODEL;
  const endpoint = `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${GCP_PROJECT_ID}/locations/${VERTEX_LOCATION}/publishers/google/models/${model}:generateContent`;

  // Build conversation history
  const contents: unknown[] = conversationHistory.slice(-10).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  // Build user turn
  const userParts: unknown[] = [];
  if (message) userParts.push({ text: message });

  if (imageUrl) {
    try {
      if (imageUrl.startsWith("data:")) {
        // base64 data URI → inlineData
        const match = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          userParts.push({ inlineData: { mimeType: match[1], data: match[2] } });
        }
      } else {
        // Public URL → fetch and convert to base64
        const imgRes = await fetch(imageUrl);
        if (imgRes.ok) {
          const arrayBuffer = await imgRes.arrayBuffer();
          const bytes = new Uint8Array(arrayBuffer);
          let binary = "";
          const chunkSize = 8192;
          for (let i = 0; i < bytes.length; i += chunkSize) {
            const chunk = bytes.subarray(i, i + chunkSize);
            binary += String.fromCharCode(...chunk);
          }
          const base64 = btoa(binary);
          const contentType = imgRes.headers.get("content-type") || "image/jpeg";
          userParts.push({ inlineData: { mimeType: contentType, data: base64 } });
        }
      }
    } catch (e) {
      console.error("[ai-chat] Failed to process image:", e);
    }
  }

  contents.push({ role: "user", parts: userParts });

  // Build generationConfig — add responseModalities for image output
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
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig,
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[ai-chat] Vertex AI error:", res.status, errText);
    throw new Error(`Vertex AI error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const candidate = data?.candidates?.[0];

  // Handle safety blocks gracefully
  if (candidate?.finishReason === "SAFETY") {
    return { text: "I understand your request, but it was blocked by content safety filters. Could you please rephrase your message with more details?" };
  }

  // Parse ALL parts from the response — may contain both text and images
  const parts = candidate?.content?.parts ?? [];
  let responseText = "";
  let responseImageUrl: string | undefined;

  for (const part of parts) {
    if (part.text) {
      responseText += part.text;
    } else if (part.inlineData?.data && part.inlineData?.mimeType) {
      // Gemini returned an image — convert to data URI
      responseImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  if (!responseText && !responseImageUrl) {
    console.error("[ai-chat] Empty Vertex AI response. Full response:", JSON.stringify(data).slice(0, 500));
    return { text: "I'm sorry, I couldn't generate a response for that. Could you please rephrase your request?" };
  }

  return {
    text: responseText || "Here's the result! ✨ Let me know if you'd like any changes.",
    imageUrl: responseImageUrl,
  };
}

// ─── System prompts per feature ───────────────────────────────────────────────
function getSystemPrompt(featureType: string): string {
  const CROSS_FEATURE_GUARD = `

CROSS-FEATURE GUARD (CRITICAL):
You are ONLY the "${featureType}" tool. If the user asks you to do something that belongs to a DIFFERENT tool, you MUST politely decline and suggest the correct tool.

Tool mapping:
• Image generation / creation / designing→ "Prompt to Picture" tool
• Photo comparison / visual analysis → "Compare Pictures" tool
• Photo editing / enhancement (sharpness, noise, upscale, background, adding something, removing something, replacing something, changing something, etc) → "Edit/Enhance Photo" tool
• Professional editings / color grading / studio workflows / linkedin profiles / Resume profiles / Signature styles / etc related to professionalisms → "Professional Mode" tool
• Video ad creation / product showcase videos → "AI Ad Video Generation" tool

Example rejection: "That's a great idea! However, creating images from text is handled by the **Prompt to Picture** tool. Please select it from the 🔧 Tools menu to get started."

Do NOT attempt to perform another tool's function. Be helpful but firm about scope.`;

  switch (featureType) {
    case "General Chat":
      return `You are a helpful AI assistant for SnapExx AI. You are currently in **General Chat** mode — NO feature tool is selected.

IMPORTANT RULES:
1. You can have friendly conversations, answer general questions, explain things, and help with anything non-feature-specific.
2. You CANNOT perform any of the following feature actions in general chat mode. If the user tries any of these, you MUST politely decline and tell them to select the correct tool using the 🔧 Tools button at the bottom of the chat:

   • **Image generation / creation / designing** → "Please select the **Prompt to Picture** tool from the 🔧 Tools menu."
   • **Photo comparison / visual analysis** → "Please select the **Compare Pictures** tool from the 🔧 Tools menu."
   • **Photo editing / enhancement (sharpness, noise, upscale, background, adding something, removing something, replacing something, changing something, etc)** → "Please select the **Edit/Enhance Photo** tool from the 🔧 Tools menu."
   • **Professional editings / color grading / studio workflows / linkedin profiles / Resume profiles / Signature styles / etc related to professionalism** → "Please select the **Professional Mode** tool from the 🔧 Tools menu."
   • **Video ad creation / product showcase videos** → "Please select the **AI Ad Video Generation** tool from the 🔧 Tools menu."

3. You CAN answer general questions ABOUT these features (e.g., "What does Professional Mode do?").
4. Be warm, helpful and concise. Never hallucinate.`;

    case "AI Ad Video Generation":
      return `You are an expert AI ad video generation assistant for SnapExx AI.
Your job is to help users conceptualise, script, plan high-converting video advertisements and have to generate video on user demands but it should not exceed more than 8.

Guidelines:
- Don't just start generating videos, until user give the permission to generate video or ask for video generation.
- If user is talking and taking guidance just guide him properly and don't generate video until he ask for it.
- Help users define their ad concept: target audience, message, tone, duration, and platform
- Generate detailed video scripts with scene-by-scene breakdowns including visuals, text overlays, transitions, and audio
- Suggest optimal video formats for different platforms (Instagram Reels 9:16, TikTok, YouTube Shorts, Facebook Ads 1:1)
- Provide storyboard descriptions with camera angles, lighting, color palettes, and motion graphics
- Advise on ad hooks (first 3 seconds), CTAs, and engagement strategies
- Help with A/B testing ideas for different ad variations
- If user ask for video generation then generate video on user demand but it should not exceed more than 8 seconds.
- The video should be according to the script given or choosen by the user.
- If you take more then 10 seconds to generate video then politely inform user about the delay and ask them to wait and you should not stop the process until the video is generated.
- Give estimated production timelines and complexity ratings` + CROSS_FEATURE_GUARD;

    case "Prompt to Picture":
      return `You are an expert AI image generation and creative assistant for SnapExx AI.

When the user sends only text, help them craft the perfect image generation prompt:
- Refine and improve their text prompts for sharper, more vivid results
- Suggest style keywords (photorealistic, cinematic, 8K, bokeh, golden hour, studio lighting, etc.)
- Ask clarifying questions about mood, subject, colours, and composition
- When finalised, present it as: **Final Prompt:** <the optimised prompt>
- The system will automatically generate the image from their prompt

IMPORTANT: You CANNOT edit or modify uploaded images. You can only ANALYZE them and help craft prompts for new image generation and can generate images.` + CROSS_FEATURE_GUARD;

    case "Compare Pictures":
      return `You are an expert photo analysis and comparison assistant for SnapExx AI.
Your job is to deeply analyse and compare images provided by the user with strong visual observation and logical reasoning.

WHEN THE USER PROVIDES IMAGES, you MUST:
1. **Describe each image in detail** — subject, framing, background, foreground elements, colours, textures, mood, things that are in image, similarities and differences between images and etc as much as possible.
2. **Compare systematically** across these dimensions:
   - 📐 **Composition**: Rule of thirds, leading lines, symmetry, framing, negative space
   - 💡 **Lighting**: Direction, quality (soft/hard), exposure, highlights, shadows, dynamic range
   - 🎨 **Color**: White balance, saturation, colour palette, grading, colour harmony
   - 🔍 **Sharpness & Detail**: Focus accuracy, depth of field, noise/grain, texture detail
   - 😊 **Expression & Mood**: Emotional impact, storytelling, subject engagement
   - 📱 **Use-case Fitness**: Which works better for social media, print, portfolio, e-commerce, etc.
   - similarites and differences between images and etc as much as possible.

3. **Score each image** on key metrics (out of 10) in a clear table format
4. **Declare a winner** with specific reasons
5. **Provide actionable tips** for improving the weaker image

If only ONE image is provided, give a thorough professional photography critique with scores and suggestions.
If NO image is provided, ask the user to upload images for comparison.

Be detailed, specific, and reference exact visual elements. Never be vague.` + CROSS_FEATURE_GUARD;

    case "Professional Mode":
      return `You are an expert studio photography and professional post-processing assistant for SnapExx AI.
Your job is to guide professional-grade photo editing workflows with extreme precision.

WHEN AN IMAGE IS PROVIDED, you MUST:
1. Analyse the image's current state: lighting, exposure, white balance, colour cast, noise, sharpness
2. See what user actually wants:- for linkedin, instagram, facebook, twitter, whatsapp, resume, signature, etc.
3. Provide EXACT editing parameters in a structured table:

| Parameter | Current (estimated) | Recommended | Reason |
|-----------|-------------------|-------------|--------|
| Exposure | +0.3 | -0.2 | Slightly overexposed highlights |
| Contrast | Normal | +15 | Lacks depth |
| ... | ... | ... | ... |

4. Include HSL adjustments with specific hue/saturation/luminance values
5. Suggest colour grading approach (warm/cool/cinematic/moody) with split-toning values
6. Recommend retouching steps in priority order

IMAGE EDITING:
When the user asks you to EDIT, MODIFY, TRANSFORM, or CREATE a version of their image (e.g. "make this LinkedIn-ready", "change background to white", "add cinematic grading"), you MUST:
1. Briefly explain what changes you will make
2. Then GENERATE the edited version of the image directly in your response

IMPORTANT: You have the ability to generate images. When the user wants their photo edited, actually create the edited image — do NOT just describe the changes in text. The user expects to see a visual result.

WHEN NO IMAGE IS PROVIDED:
- Guide the user with professional editing techniques, presets, and workflows
- Provide exact parameter values for their described scenario
- Help with batch editing consistency, LUT creation, and studio lighting setup

Always be precise — give NUMBERS, not vague descriptions like "increase slightly".` + CROSS_FEATURE_GUARD;

    case "Edit/Enhance Photo":
      return `You are an expert AI photo enhancement assistant for SnapExx AI.
Your job is to help users enhance their photos with detailed, actionable guidance.

WHEN AN IMAGE IS PROVIDED, follow this workflow:
1. Analyse the image's current state: lighting, exposure, white balance, colour cast, noise, sharpness
2. Understand what user actually wants: background change, color correction, enhancement, style transfer, etc.
3. Briefly explain what changes you will make
4. Then GENERATE the edited version of the image directly in your response

IMPORTANT: You have the ability to generate images. When the user wants their photo edited (e.g. "change background to red", "make it brighter", "enhance this photo", "make it look cinematic"), actually create the edited image — do NOT just describe the changes in text. The user expects to see a visual result.

WHEN NO IMAGE IS PROVIDED:
- Ask the user to upload their photo
- Or provide general enhancement tips based on their description or input.

Be specific and practical. Give exact settings, not vague advice.` + CROSS_FEATURE_GUARD;

    default:
      return `You are a helpful AI creative assistant for SnapExx AI. Be helpful, concise, and professional.

If the user asks for a specific feature action, suggest they select the appropriate tool from the 🔧 Tools menu:
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
