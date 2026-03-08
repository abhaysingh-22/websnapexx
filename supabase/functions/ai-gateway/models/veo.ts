/**
 * veo.ts — Vertex AI Veo 3.1 Fast video generation wrapper
 *
 * Model:    veo-3.1-fast-generate-001
 * Endpoint: :predictLongRunning  (async LRO)
 *
 * Flow:
 *   1. Construct namespaced GCS output path from bucketName + userId
 *   2. Submit job → receive operation name
 *   3. Poll until done
 *   4. Sign the returned gs:// URI → return a 1-hour HTTPS signed URL
 *
 * Env secrets required:
 *   GCS_VIDEO_BUCKET       — bucket name ONLY, e.g. "snapexx-video-bucket"
 *   GCP_SERVICE_ACCOUNT_KEY — full service account JSON (also used for Vertex auth)
 */

import { GCP_PROJECT_ID, VERTEX_LOCATION } from "../auth/gcpAuth.ts";

// ─── Constants ────────────────────────────────────────────────────────────────

const VEO_MODEL = "veo-3.1-fast-generate-001";
const POLL_INTERVAL_MS = 5_000;
const DEFAULT_MAX_POLLS = 72; // 6-minute ceiling (configurable via VeoCallParams)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VeoResult {
  videoUrl?: string; // signed HTTPS URL valid for 1 hour
  error?: string;
}

export interface VeoCallParams {
  prompt: string;
  accessToken: string;
  /** Bucket name only — no "gs://" prefix, no trailing slash. */
  bucketName: string;
  /** Used to namespace the output path: videos/{userId}/{timestamp}-{uuid}.mp4 */
  userId: string;
  sampleCount?: number;           // 1–4, default 1
  durationSeconds?: 4 | 6 | 8;   // Veo 3.x accepted values, default 8
  /** Override the default poll ceiling of DEFAULT_MAX_POLLS. */
  maxPolls?: number;
  /** Optional reference image for image-to-video generation (base64-encoded). */
  imageBase64?: string;
  /** MIME type of the reference image (e.g. "image/png", "image/jpeg"). */
  imageMimeType?: string;
}

// ─── GCS Signed URL (V4 — RSA-SHA256) ────────────────────────────────────────
// Produces a public HTTPS signed URL for a private GCS object.
// Uses the service account private key from GCP_SERVICE_ACCOUNT_KEY.

async function signGcsUrl(
  bucketName: string,
  objectPath: string, // path inside bucket, no leading slash
  expiresInSeconds = 3600
): Promise<string> {
  const saJson = Deno.env.get("GCP_SERVICE_ACCOUNT_KEY");
  if (!saJson) throw new Error("GCP_SERVICE_ACCOUNT_KEY is not set");

  const sa = JSON.parse(saJson);
  const serviceAccountEmail = sa.client_email as string;
  const privateKeyPem = sa.private_key as string;

  // Import RSA-SHA256 private key
  const pemBody = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const keyDer = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    keyDer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  // Build V4 signing components
  const now = new Date();
  const datestamp = now.toISOString().slice(0, 10).replace(/-/g, "");           // YYYYMMDD
  const requestTimestamp = now.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z"; // YYYYMMDDTHHmmSSZ
  const credentialScope = `${datestamp}/auto/storage/goog4_request`;
  const credential = `${serviceAccountEmail}/${credentialScope}`;
  const host = "storage.googleapis.com";
  const resource = `/${bucketName}/${objectPath}`;

  // Canonical query string — parameters must be sorted lexicographically
  const rawParams: [string, string][] = [
    ["X-Goog-Algorithm", "GOOG4-RSA-SHA256"],
    ["X-Goog-Credential", credential],
    ["X-Goog-Date", requestTimestamp],
    ["X-Goog-Expires", String(expiresInSeconds)],
    ["X-Goog-SignedHeaders", "host"],
  ];
  rawParams.sort(([a], [b]) => a.localeCompare(b));
  const canonicalQueryString = rawParams
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  // Canonical request
  const canonicalRequest = [
    "GET",
    resource,
    canonicalQueryString,
    `host:${host}\n`, // canonical headers block (trailing newline required)
    "host",           // signed headers
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  // Hash canonical request
  const encoder = new TextEncoder();
  const canonicalHash = Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", encoder.encode(canonicalRequest))
    )
  )
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // String to sign
  const stringToSign = [
    "GOOG4-RSA-SHA256",
    requestTimestamp,
    credentialScope,
    canonicalHash,
  ].join("\n");

  // RSA-SHA256 signature → hex
  const rawSig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    encoder.encode(stringToSign)
  );
  const hexSig = Array.from(new Uint8Array(rawSig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `https://${host}${resource}?${canonicalQueryString}&X-Goog-Signature=${hexSig}`;
}

// ─── Step 1: Submit LRO job ───────────────────────────────────────────────────

async function submitVeoJob(
  params: VeoCallParams,
  outputGcsUri: string
): Promise<{ operationName?: string; error?: string }> {
  const { prompt, accessToken, sampleCount = 1, durationSeconds = 8, imageBase64, imageMimeType } = params;

  const endpoint =
    `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1` +
    `/projects/${GCP_PROJECT_ID}/locations/${VERTEX_LOCATION}` +
    `/publishers/google/models/${VEO_MODEL}:predictLongRunning`;

  // Build instance — include reference image when provided (image-to-video)
  const instance: Record<string, unknown> = { prompt };
  if (imageBase64 && imageMimeType) {
    instance.image = {
      bytesBase64Encoded: imageBase64,
      mimeType: imageMimeType,
    };
    console.log("[veo] Image-to-video mode — reference image attached");
  } else {
    console.log("[veo] Text-to-video mode — no reference image");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      instances: [instance],
      parameters: {
        storageUri: outputGcsUri,
        sampleCount,          // integer 1–4
        durationSeconds,      // 4 | 6 | 8 (Veo 3.x)
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[veo] Submit failed:", res.status, errText);
    return { error: `Veo submit failed (${res.status}): ${errText}` };
  }

  const data = await res.json();
  if (!data?.name) {
    console.error("[veo] No operation name:", JSON.stringify(data).slice(0, 200));
    return { error: "Veo job submitted but no operation name returned" };
  }

  return { operationName: data.name };
}

// ─── Step 2: Poll LRO until done ─────────────────────────────────────────────
// Official docs (Feb 2026) confirm the Veo poll API is:
//   POST .../publishers/google/models/{model}:fetchPredictOperation
//   Body: { "operationName": "<full name returned by predictLongRunning>" }
// The full name format is:
//   projects/{p}/locations/{l}/publishers/google/models/{m}/operations/{uuid}
// Pass it as-is — do NOT strip or normalise.

async function pollOperation(
  operationName: string,
  accessToken: string,
  maxPolls: number
): Promise<{ videoGcsUri?: string; error?: string }> {
  const endpoint =
    `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1` +
    `/projects/${GCP_PROJECT_ID}/locations/${VERTEX_LOCATION}` +
    `/publishers/google/models/${VEO_MODEL}:fetchPredictOperation`;

  console.log("[veo] Polling via fetchPredictOperation, operation:", operationName);
  for (let i = 0; i < maxPolls; i++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ operationName }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { error: `Poll failed (${res.status}): ${errText}` };
    }

    const data = await res.json();

    if (data.error) {
      return { error: data.error.message ?? "Veo generation failed during polling" };
    }

    if (data.done) {
      const videoGcsUri: string | undefined =
        data?.response?.videos?.[0]?.gcsUri ??
        data?.response?.generatedSamples?.[0]?.video?.uri;

      if (!videoGcsUri) {
        console.error("[veo] Done but no URI:", JSON.stringify(data).slice(0, 300));
        return { error: "Veo job completed but returned no video URI" };
      }

      return { videoGcsUri };
    }

    console.log(`[veo] Poll ${i + 1}/${maxPolls} — processing...`);
  }

  return {
    error: `Veo timed out after ${(maxPolls * POLL_INTERVAL_MS) / 1000}s`,
  };
}

// ─── Step 3: Resolve gs:// URI → object path ──────────────────────────────────

function gcsUriToObjectPath(
  bucketName: string,
  gcsUri: string
): string | null {
  const prefix = `gs://${bucketName}/`;
  if (!gcsUri.startsWith(prefix)) return null;
  return gcsUri.slice(prefix.length);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function generateVideo(params: VeoCallParams): Promise<VeoResult> {
  const { bucketName, userId, accessToken, maxPolls = DEFAULT_MAX_POLLS } = params;

  // Namespaced output path — unique per request
  const filename = `${Date.now()}-${crypto.randomUUID()}.mp4`;
  const objectPath = `videos/${userId}/${filename}`;
  const outputGcsUri = `gs://${bucketName}/${objectPath}`;

  console.log("[veo] Output URI:", outputGcsUri);

  // Step 1 — Submit
  const submission = await submitVeoJob(params, outputGcsUri);
  if (submission.error || !submission.operationName) {
    return { error: submission.error ?? "Failed to submit Veo job" };
  }

  console.log("[veo] Operation:", submission.operationName);

  // Step 2 — Poll
  const pollResult = await pollOperation(
    submission.operationName,
    accessToken,
    maxPolls
  );
  if (pollResult.error || !pollResult.videoGcsUri) {
    return { error: pollResult.error ?? "Polling ended without a video URI" };
  }

  console.log("[veo] Video GCS URI:", pollResult.videoGcsUri);

  // Step 3 — Sign: convert gs:// → HTTPS
  const resolvedPath = gcsUriToObjectPath(bucketName, pollResult.videoGcsUri);
  if (!resolvedPath) {
    return {
      error: `Unexpected GCS URI format (bucket mismatch): ${pollResult.videoGcsUri}`,
    };
  }

  let videoUrl: string;
  try {
    videoUrl = await signGcsUrl(bucketName, resolvedPath, 3600);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[veo] Signing error:", err);
    return { error: `Failed to generate signed URL: ${msg}` };
  }

  console.log("[veo] Signed URL created successfully");
  return { videoUrl };
}
