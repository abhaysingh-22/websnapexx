import { create } from 'zustand';

interface UIStore {
  // Sidebar state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Modal states
  mediaPickerOpen: boolean;
  setMediaPickerOpen: (open: boolean) => void;
  
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;

  // Feature selection
  selectedFeature: string | null;
  setSelectedFeature: (feature: string | null) => void;

  // Loading states
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;

  // Toast/notification
  notification: {
    message: string;
    type: 'success' | 'error' | 'info';
  } | null;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  clearNotification: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Sidebar
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Media picker
  mediaPickerOpen: false,
  setMediaPickerOpen: (open) => set({ mediaPickerOpen: open }),

  // Delete dialog
  deleteDialogOpen: false,
  setDeleteDialogOpen: (open) => set({ deleteDialogOpen: open }),

  // Feature selection
  selectedFeature: null,
  setSelectedFeature: (feature) => set({ selectedFeature: feature }),

  // Processing
  isProcessing: false,
  setIsProcessing: (processing) => set({ isProcessing: processing }),

  // Notifications
  notification: null,
  showNotification: (message, type) => set({ notification: { message, type } }),
  clearNotification: () => set({ notification: null }),
}));
