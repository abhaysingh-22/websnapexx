import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Images, ChevronRight, X } from "lucide-react";
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
  /** Maximum number of images the user may select. Defaults to 1. */
  maxImages?: number;
}

type Step = "choose" | "camera-live" | "gallery-permission";

const MediaPickerDialog = ({ 
  open, 
  onOpenChange, 
  onMediaSelected,
  featureTitle,
  maxImages = 1,
}: MediaPickerDialogProps) => {
  const [step, setStep] = useState<Step>("choose");
  const { toast } = useToast();

  // Camera refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Stop camera on unmount or dialog close
  useEffect(() => {
    if (!open) {
      stopCamera();
      setStep("choose");
    }
    return () => stopCamera();
  }, [open, stopCamera]);

  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      streamRef.current = stream;
      setStep("camera-live");

      // Wait for DOM update then attach stream to video
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please enable camera access in your browser settings.",
        variant: "destructive",
      });
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: "image/jpeg" });
        onMediaSelected([file]);
        resetAndClose();
      }
    }, "image/jpeg", 0.9);
  };

  const handleChooseGallery = () => {
    setStep("gallery-permission");
  };

  const requestGalleryAccess = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = maxImages > 1;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        // Enforce the hard cap here so even if the OS bypasses `multiple=false`
        // the user never gets more files than allowed.
        onMediaSelected(Array.from(files).slice(0, maxImages));
        resetAndClose();
      } else {
        setStep("choose");
      }
    };
    setTimeout(() => input.click(), 100);
  };

  const resetAndClose = () => {
    stopCamera();
    setStep("choose");
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
            className="space-y-3 sm:space-y-4"
          >
            <p className="text-xs sm:text-sm text-muted-foreground text-center mb-4 sm:mb-6">
              Choose how you'd like to add {maxImages > 1 ? `up to ${maxImages} photos` : "a photo"} for <span className="font-semibold text-foreground">{featureTitle}</span>
            </p>
            
            <motion.button
              onClick={handleTakePhoto}
              className="w-full p-3 sm:p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all duration-300 flex items-center gap-3 sm:gap-4 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <h4 className="font-semibold text-sm sm:text-base">Take Photo</h4>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Capture a new photo using your camera</p>
              </div>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
            </motion.button>

            <motion.button
              onClick={handleChooseGallery}
              className="w-full p-3 sm:p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all duration-300 flex items-center gap-3 sm:gap-4 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/50 flex items-center justify-center group-hover:bg-secondary transition-colors flex-shrink-0">
                <Images className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-foreground" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <h4 className="font-semibold text-sm sm:text-base">Choose from Gallery</h4>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Select photos from your device</p>
              </div>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
            </motion.button>
          </motion.div>
        );

      case "camera-live":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Live camera viewfinder */}
            <div className="relative rounded-xl overflow-hidden bg-black aspect-[4/3]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Viewfinder corners */}
              <div className="absolute inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/70 rounded-tl" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white/70 rounded-tr" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white/70 rounded-bl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/70 rounded-br" />
              </div>
            </div>

            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  stopCamera();
                  setStep("choose");
                }}
                className="flex-1 text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={capturePhoto}
                className="flex-1 text-sm gap-2"
              >
                <Camera className="w-4 h-4" />
                Capture
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
            className="text-center space-y-4 sm:space-y-6"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-secondary/30 flex items-center justify-center">
              <Images className="w-8 h-8 sm:w-10 sm:h-10 text-secondary-foreground" />
            </div>
            <div>
              <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Gallery Access</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Allow access to your photos to select images for <span className="font-medium text-foreground">{featureTitle}</span>
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                onClick={() => setStep("choose")}
                className="flex-1 text-sm"
              >
                Cancel
              </Button>
              <Button 
                onClick={requestGalleryAccess}
                className="flex-1 text-sm"
              >
                Allow Access
              </Button>
            </div>
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
          <DialogTitle className="text-center">
            {step === "camera-live" ? "Take Photo" : "Add Photos"}
          </DialogTitle>
        </DialogHeader>
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPickerDialog;
