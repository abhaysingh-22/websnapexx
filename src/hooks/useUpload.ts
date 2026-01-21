import { useState, useCallback } from 'react';
import { storageService } from '@/services/storage.service';
import { useAuth } from './useAuth';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export const useUpload = () => {
  const { user } = useAuth();
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const uploadFile = useCallback(async (file: File, folder: string = 'images'): Promise<string | null> => {
    if (!user) {
      setState(prev => ({ ...prev, error: 'Not authenticated' }));
      return null;
    }

    setState({ isUploading: true, progress: 0, error: null });

    try {
      const url = await storageService.uploadFile(user.id, file, folder);
      setState({ isUploading: false, progress: 100, error: null });
      return url;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setState({ isUploading: false, progress: 0, error: errorMessage });
      return null;
    }
  }, [user]);

  const uploadMultipleFiles = useCallback(async (files: File[], folder: string = 'images'): Promise<string[]> => {
    if (!user) {
      setState(prev => ({ ...prev, error: 'Not authenticated' }));
      return [];
    }

    setState({ isUploading: true, progress: 0, error: null });

    try {
      const urls = await storageService.uploadMultipleFiles(user.id, files, folder);
      setState({ isUploading: false, progress: 100, error: null });
      return urls;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setState({ isUploading: false, progress: 0, error: errorMessage });
      return [];
    }
  }, [user]);

  const deleteFile = useCallback(async (filePath: string): Promise<boolean> => {
    try {
      await storageService.deleteFile(filePath);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';
      setState(prev => ({ ...prev, error: errorMessage }));
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    clearError,
  };
};
