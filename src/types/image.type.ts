export interface ImageHistory {
  id: string;
  user_id: string;
  feature_title: string;
  original_image_url: string | null;
  processed_image_url: string | null;
  prompt: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface UploadedImage {
  id: string;
  url: string;
  file: File;
  preview: string;
}

export interface ImageProcessingResult {
  success: boolean;
  processedUrl?: string;
  error?: string;
}
