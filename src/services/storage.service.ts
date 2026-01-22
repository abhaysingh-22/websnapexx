// Stub storage service - uses local URLs only (no backend)

export const storageService = {
  async uploadFile(userId: string, file: File, folder: string = 'images'): Promise<string> {
    // Create a local object URL for the file
    return URL.createObjectURL(file);
  },

  async uploadMultipleFiles(userId: string, files: File[], folder: string = 'images'): Promise<string[]> {
    return files.map(file => URL.createObjectURL(file));
  },

  async deleteFile(filePath: string): Promise<void> {
    // Revoke object URL if it's a blob URL
    if (filePath.startsWith('blob:')) {
      URL.revokeObjectURL(filePath);
    }
  },

  async listFiles(userId: string, folder: string = 'images'): Promise<string[]> {
    // No persistent storage - return empty
    return [];
  },

  getPublicUrl(filePath: string): string {
    return filePath;
  },
};
