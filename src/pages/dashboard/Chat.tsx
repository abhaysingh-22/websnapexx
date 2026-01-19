import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Image as ImageIcon, 
  Sparkles, 
  ArrowLeft,
  Loader2,
  User,
  Bot,
  X,
  Download
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import ChatLayout from "@/layouts/ChatLayout";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStorage, ChatMessage } from "@/hooks/use-chat-storage";

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { featureTitle, selectedImages, conversationId } = location.state || { 
    featureTitle: "AI Assistant", 
    selectedImages: [],
    conversationId: undefined
  };
  
  const { messages, addMessage, completeConversation, isLoaded } = useChatStorage(conversationId, featureTitle);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const scrollAreaWrapRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const shouldAutoScrollRef = useRef(false);

  // Scroll to bottom when viewing existing conversation with messages
  useEffect(() => {
    if (isLoaded && messages.length > 0 && conversationId) {
      // Viewing existing chat - scroll to bottom to show latest messages
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      });
    }
  }, [isLoaded, conversationId]);

  useEffect(() => {
    // Convert selected files to preview URLs and hold them in input area (don't auto-send)
    if (selectedImages && selectedImages.length > 0) {
      const urls = selectedImages.map((file: File) => URL.createObjectURL(file));
      setPreviewImages(urls);
    }
  }, [selectedImages]);

  useEffect(() => {
    // Only auto-scroll when user actively sends a message
    if (shouldAutoScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      shouldAutoScrollRef.current = false;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && previewImages.length === 0) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      images: previewImages.length > 0 ? [...previewImages] : undefined,
      timestamp: new Date(),
    };

    shouldAutoScrollRef.current = true;
    addMessage(userMessage);
    setInput("");
    setPreviewImages([]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand what you're looking for. Let me process that for you...",
        "That's a great idea! I'll help you achieve that effect.",
        "I'm analyzing the image and applying the requested changes...",
        "Here's what I suggest based on your request...",
        "I've processed your request. The enhanced version is ready!",
      ];
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)] + "\n\nIs there anything else you'd like me to adjust or any other modifications you'd like to make?",
        timestamp: new Date(),
      };
      shouldAutoScrollRef.current = true;
      addMessage(aiResponse);
      completeConversation();
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAddImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const urls = Array.from(files).map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...urls]);
      }
    };
    input.click();
  };

  const removePreviewImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDownloadImage = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `snapex-ai-image-${Date.now()}-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  return (
    <ChatLayout>
      <div className="flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 pb-4 border-b border-border mb-4"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/home")}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">{featureTitle}</h1>
              <p className="text-xs text-muted-foreground">AI-powered assistance</p>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <div ref={scrollAreaWrapRef} className="flex-1 pr-4">
          <ScrollArea className="h-full">
            <div className="space-y-4 pb-4">
              <AnimatePresence>
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-64 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Start a conversation</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Upload an image or type a message to get started with {featureTitle}
                    </p>
                  </motion.div>
                )}

                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div className={`max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                      {message.images && message.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {message.images.map((img, imgIndex) => (
                            <div key={imgIndex} className="relative group">
                              <img
                                src={img}
                                alt={`Uploaded ${imgIndex + 1}`}
                                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-border"
                              />
                              <button
                                onClick={() => handleDownloadImage(img, imgIndex)}
                                className="absolute bottom-1 right-1 w-7 h-7 bg-background/90 backdrop-blur-sm text-foreground rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-background"
                                title="Download image"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted rounded-tl-sm"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 px-2">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Image Preview */}
        <AnimatePresence>
          {previewImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2 p-2 border-t border-border overflow-x-auto"
            >
              {previewImages.map((img, index) => (
                <div key={index} className="relative shrink-0">
                  <img
                    src={img}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePreviewImage(index)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-border pt-4"
        >
          <div className="flex items-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddImage}
              className="shrink-0"
            >
              <ImageIcon className="w-5 h-5" />
            </Button>
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[48px] max-h-[120px]"
                style={{ 
                  height: 'auto',
                  overflowY: input.split('\n').length > 3 ? 'auto' : 'hidden'
                }}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() && previewImages.length === 0}
              size="icon"
              className="shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            AI responses are generated and may not always be accurate
          </p>
        </motion.div>
      </div>
    </ChatLayout>
  );
};

export default Chat;
