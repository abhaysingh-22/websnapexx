import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Images, X, Check, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMediaSelected: (files: File[]) => void;
  featureTitle: string;
}

type Step = "choose" | "gallery-permission" | "gallery-select" | "camera-permission";

const MediaPickerDialog = ({ 
  open, 
  onOpenChange, 
  onMediaSelected,
  featureTitle 
}: MediaPickerDialogProps) => {
  const [step, setStep] = useState<Step>("choose");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [galleryAccess, setGalleryAccess] = useState<"selected" | "all" | null>(null);
  const { toast } = useToast();

  const handleTakePhoto = async () => {
    setStep("camera-permission");
  };

  const handleChooseGallery = () => {
    setStep("gallery-permission");
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      
      // Create file input for camera capture
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.capture = "environment";
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          onMediaSelected(Array.from(files));
          resetAndClose();
        }
      };
      input.click();
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please enable camera access in your browser settings.",
        variant: "destructive",
      });
      setStep("choose");
    }
  };

  const handleGalleryAccessChoice = (access: "selected" | "all") => {
    setGalleryAccess(access);
    setStep("gallery-select");
    
    // Open file picker
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = access === "all";
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setSelectedFiles(Array.from(files));
        onMediaSelected(Array.from(files));
        resetAndClose();
      } else {
        setStep("choose");
      }
    };
    input.click();
  };

  const resetAndClose = () => {
    setStep("choose");
    setSelectedFiles([]);
    setGalleryAccess(null);
    onOpenChange(false);
  };

  const renderStep = () => {
    switch (step) {
      case "choose":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground text-center mb-6">
              Choose how you'd like to add photos for <span className="font-semibold text-foreground">{featureTitle}</span>
            </p>
            
            <motion.button
              onClick={handleTakePhoto}
              className="w-full p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all duration-300 flex items-center gap-4 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold">Take Photo</h4>
                <p className="text-xs text-muted-foreground">Capture a new photo using your camera</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </motion.button>

            <motion.button
              onClick={handleChooseGallery}
              className="w-full p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all duration-300 flex items-center gap-4 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center group-hover:bg-secondary transition-colors">
                <Images className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold">Choose from Gallery</h4>
                <p className="text-xs text-muted-foreground">Select photos from your device</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </motion.button>
          </motion.div>
        );

      case "camera-permission":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Camera Access Required</h4>
              <p className="text-sm text-muted-foreground">
                We need permission to access your camera to take photos.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setStep("choose")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={requestCameraPermission}
                className="flex-1"
              >
                Allow Camera
              </Button>
            </div>
          </motion.div>
        );

      case "gallery-permission":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-secondary/30 flex items-center justify-center mb-4">
                <Images className="w-10 h-10 text-secondary-foreground" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Gallery Access</h4>
              <p className="text-sm text-muted-foreground">
                Choose how you'd like to share your photos
              </p>
            </div>

            <motion.button
              onClick={() => handleGalleryAccessChoice("selected")}
              className="w-full p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all duration-300 flex items-center gap-4 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-sm">Select Photos</h4>
                <p className="text-xs text-muted-foreground">Choose specific photos to use</p>
              </div>
            </motion.button>

            <motion.button
              onClick={() => handleGalleryAccessChoice("all")}
              className="w-full p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all duration-300 flex items-center gap-4 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center">
                <Images className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-sm">Select Multiple Photos</h4>
                <p className="text-xs text-muted-foreground">Choose multiple photos at once</p>
              </div>
            </motion.button>

            <Button 
              variant="ghost" 
              onClick={() => setStep("choose")}
              className="w-full mt-2"
            >
              Back
            </Button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Add Photos</DialogTitle>
        </DialogHeader>
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPickerDialog;
