import { supabase } from "@/integrations/supabase/client";

const BUCKET_NAME = 'user-uploads';

export const storageService = {
  async uploadFile(userId: string, file: File, folder: string = 'images'): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${userId}/${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  },

  async uploadMultipleFiles(userId: string, files: File[], folder: string = 'images'): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadFile(userId, file, folder));
    return Promise.all(uploadPromises);
  },

  async deleteFile(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) throw error;
  },

  async listFiles(userId: string, folder: string = 'images'): Promise<string[]> {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(`${userId}/${folder}`);

    if (error) throw error;

    return data.map(file => {
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(`${userId}/${folder}/${file.name}`);
      return urlData.publicUrl;
    });
  },

  getPublicUrl(filePath: string): string {
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);
    return data.publicUrl;
  },
};
