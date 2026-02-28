/**
 * gcpAuth.ts — GCP Service Account authentication helpers
 *
 * Exports:
 *   getCachedAccessToken()  — returns a valid OAuth2 bearer token (cached)
 *   detectImageIntent()     — classifies a message as GENERATE vs CHAT
 *   GCP_PROJECT_ID          — re-exported for other modules
 *   VERTEX_LOCATION         — Vertex AI region
 */

export const GCP_PROJECT_ID = Deno.env.get("GCP_PROJECT_ID") ?? "";
export const VERTEX_LOCATION = "us-central1";

const GCP_SERVICE_ACCOUNT_KEY = Deno.env.get("GCP_SERVICE_ACCOUNT_KEY") ?? "";

// ─── Base64-url helpers ──────────────────────────────────────────────────────

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

// ─── RSA-SHA256 key import ────────────────────────────────────────────────────

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

// ─── Fetch a fresh access token via service account JWT ──────────────────────

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
    throw new Error(`Failed to get GCP access token: ${errText}`);
  }

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

// ─── In-memory token cache (valid for one function instance) ─────────────────

let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function getCachedAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && tokenExpiry > now + 60) {
    return cachedToken;
  }
  cachedToken = await getAccessToken();
  tokenExpiry = now + 3500;
  return cachedToken;
}

// ─── Intent detection — should we generate an image? ─────────────────────────

export async function detectImageIntent(
  message: string,
  accessToken: string
): Promise<boolean> {
  if (!message.trim()) return false;

  // Always use the fast flash model for intent classification
  const model = "gemini-2.0-flash-001";

  try {
    const endpoint = `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${GCP_PROJECT_ID}/locations/${VERTEX_LOCATION}/publishers/google/models/${model}:generateContent`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: `You are an intent classifier. Reply with exactly one word:
- "GENERATE" — if the user wants to CREATE/GENERATE a new image/picture/photo/artwork.
- "CHAT" — for anything else (questions, conversation, advice, etc.)`,
            },
          ],
        },
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 10 },
      }),
    });

    if (!res.ok) return false;
    const data = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toUpperCase();
    return reply === "GENERATE";
  } catch {
    return false;
  }
}
