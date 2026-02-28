/**
 * storageService — Supabase Storage helpers for SnapExx
 *
 * Bucket: "user-images" (private)
 *   uploads/   → images the user uploads before sending to AI
 *   generated/ → AI-generated images returned from the edge function
 *
 * Path pattern:  {userId}/uploads/{timestamp}-{ext}
 *                {userId}/generated/{timestamp}.{ext}
 */

import { externalSupabase } from "@/integrations/externalSupabase/client";

export interface StorageResult {
  success: boolean;
  storagePath?: string;
  signedUrl?: string;
  error?: string;
}

const BUCKET = "user-images";

// ─── Shared helpers ─────────────────────────────────────────────────────────

function dataUriToBlob(dataUri: string): { blob: Blob; mimeType: string } | null {
  const match = dataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;

  const mimeType = match[1];
  const base64Data = match[2];

  try {
    const byteCharacters = atob(base64Data);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    return { blob: new Blob([byteArray], { type: mimeType }), mimeType };
  } catch {
    return null;
  }
}

async function createSignedUrl(storagePath: string, expiresIn: number): Promise<string | null> {
  const { data, error } = await externalSupabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, expiresIn);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

// ─── Upload user-provided image ──────────────────────────────────────────────

/**
 * Uploads a base64 data URI to  users/{userId}/uploads/{timestamp}.{ext}
 * Returns a signed URL valid for 1 hour (sufficient for the edge function call).
 */
export async function uploadUserImage(
  base64DataUri: string,
  userId: string
): Promise<StorageResult> {
  try {
    const parsed = dataUriToBlob(base64DataUri);
    if (!parsed) return { success: false, error: "Invalid image data URI" };

    const { blob, mimeType } = parsed;
    const ext = mimeType.split("/")[1]?.split("+")[0] || "jpg";
    const storagePath = `${userId}/uploads/${Date.now()}.${ext}`;

    const { error: uploadError } = await externalSupabase.storage
      .from(BUCKET)
      .upload(storagePath, blob, { contentType: mimeType, upsert: false });

    if (uploadError) {
      console.error("[storageService] Upload error:", uploadError);
      return { success: false, error: uploadError.message };
    }

    // 1 hour — enough to get through the edge function call
    const signedUrl = await createSignedUrl(storagePath, 3600);
    if (!signedUrl) return { success: false, error: "Failed to create signed URL" };

    console.log("[storageService] User image uploaded:", storagePath);
    return { success: true, storagePath, signedUrl };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Upload failed";
    console.error("[storageService] Exception:", err);
    return { success: false, error: msg };
  }
}

// ─── Upload AI-generated image ───────────────────────────────────────────────

/**
 * Uploads a base64 data URI returned by the AI to users/{userId}/generated/{timestamp}.{ext}
 * Returns a signed URL valid for 7 days so the image can be displayed in history.
 */
export async function uploadGeneratedImage(
  base64DataUri: string,
  userId: string
): Promise<StorageResult> {
  try {
    const parsed = dataUriToBlob(base64DataUri);
    if (!parsed) return { success: false, error: "Invalid image data URI" };

    const { blob, mimeType } = parsed;
    const ext = mimeType.split("/")[1]?.split("+")[0] || "png";
    const storagePath = `${userId}/generated/${Date.now()}.${ext}`;

    const { error: uploadError } = await externalSupabase.storage
      .from(BUCKET)
      .upload(storagePath, blob, { contentType: mimeType, upsert: false });

    if (uploadError) {
      console.error("[storageService] Generated upload error:", uploadError);
      return { success: false, error: uploadError.message };
    }

    // 7 days for generated images (shown in chat history)
    const signedUrl = await createSignedUrl(storagePath, 3600 * 24 * 7);
    if (!signedUrl) return { success: false, error: "Failed to create signed URL" };

    console.log("[storageService] Generated image uploaded:", storagePath);
    return { success: true, storagePath, signedUrl };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Upload failed";
    console.error("[storageService] Exception:", err);
    return { success: false, error: msg };
  }
}
