/**
 * imagen.ts — Vertex AI Imagen 4 model wrapper
 *
 * Imagen 4 is Google's highest-quality text-to-image model,
 * offering photorealistic output up to 2K resolution.
 *
 * Model: imagen-4.0-generate-001
 * API:   Vertex AI — projects.locations.publishers.models.predict
 *
 * Docs: https://cloud.google.com/vertex-ai/generative-ai/docs/image/generate-images
 */

import { GCP_PROJECT_ID, VERTEX_LOCATION } from "../auth/gcpAuth.ts";

/** Imagen 4 — fast, high-quality text-to-image up to 2K resolution */
const IMAGEN_MODEL = "imagen-4.0-generate-001";

export interface ImagenResult {
  imageUrl?: string; // base64 data URI: data:image/png;base64,...
  error?: string;
}

export interface ImagenCallParams {
  prompt: string;
  accessToken: string;
  sampleCount?: number;    // 1–4, default 1
  aspectRatio?: string;    // "1:1" | "16:9" | "9:16" | "4:3" | "3:4"
  negativePrompt?: string;
}

// ─── Call Imagen 4 ───────────────────────────────────────────────────────────

export async function callImagen(
  params: ImagenCallParams
): Promise<ImagenResult> {
  const {
    prompt,
    accessToken,
    sampleCount = 1,
    aspectRatio = "1:1",
    negativePrompt,
  } = params;

  const endpoint = `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${GCP_PROJECT_ID}/locations/${VERTEX_LOCATION}/publishers/google/models/${IMAGEN_MODEL}:predict`;

  const requestBody: Record<string, unknown> = {
    instances: [{ prompt }],
    parameters: {
      sampleCount,
      ...(aspectRatio ? { aspectRatio } : {}),
      ...(negativePrompt ? { negativePrompt } : {}),
    },
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[imagen] Vertex AI error:", res.status, errText);
    return { error: `Imagen error ${res.status}: ${errText}` };
  }

  const data = await res.json();
  const prediction = data?.predictions?.[0];

  if (!prediction?.bytesBase64Encoded) {
    console.error("[imagen] No image in response:", JSON.stringify(data).slice(0, 300));
    return { error: "Imagen returned no image data" };
  }

  const mimeType = prediction.mimeType ?? "image/png";
  return {
    imageUrl: `data:${mimeType};base64,${prediction.bytesBase64Encoded}`,
  };
}
