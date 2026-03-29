import { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Image as ImageIcon, 
  Sparkles, 
  ArrowLeft,
  Loader2,
  User,
  Cpu,
  X,
  Download
} from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import ChatLayout from "@/layouts/ChatLayout";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConversations, Message } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { externalSupabase } from "@/integrations/externalSupabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { aiService, getStarterPrompts, isFeatureMode } from "@/services/aiService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert a File to a base64 data URI so the backend can read it */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Generate a short title from the first message and save it */
async function generateTitle(convId: string, firstMessage: string) {
  const title =
    firstMessage.length > 50
      ? firstMessage.substring(0, 47) + "..."
      : firstMessage;

  await externalSupabase
    .from("conversations")
    .update({ title })
    .eq("id", convId);
}

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  images?: string[];
  videoUrl?: string;
  timestamp: Date;
}

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { session } = useAuthContext();
  
  // Get conversationId from URL params or location state
  const urlConversationId = searchParams.get("conversation");
  const { featureTitle = "AI Assistant", selectedImages = [] } = location.state || {};
  
  const { createConversation, updateConversationTitle } = useConversations();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(urlConversationId);
  const { messages: dbMessages, fetchMessages, setMessages, loading: messagesLoading } = useMessages(currentConversationId);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const scrollAreaWrapRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const shouldAutoScrollRef = useRef(false);
  const isFirstMessage = useRef(true);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cancel any in-progress typewriter on unmount
  useEffect(() => {
    return () => { if (typingIntervalRef.current) clearInterval(typingIntervalRef.current); };
  }, []);

  // Convert DB messages to display format
  const messages: DisplayMessage[] = dbMessages.map((msg: Message) => {
    const rawUrl = msg.image_url;
    const isVideo = rawUrl ? rawUrl.includes('.mp4') : false;
    return {
      id: msg.id,
      role: msg.role,
      content: msg.content,
      images: rawUrl && !isVideo ? [rawUrl] : undefined,
      videoUrl: rawUrl && isVideo ? rawUrl : undefined,
      timestamp: new Date(msg.created_at),
    };
  });

  // Initialize - load existing conversation or prepare for new one
  useEffect(() => {
    if (urlConversationId) {
      setCurrentConversationId(urlConversationId);
      fetchMessages();
      isFirstMessage.current = false;
    }
    setIsInitialized(true);
  }, [urlConversationId]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (currentConversationId && isInitialized) {
      fetchMessages();
    }
  }, [currentConversationId, isInitialized]);

  // Scroll to bottom when viewing existing conversation with messages
  useEffect(() => {
    if (isInitialized && messages.length > 0 && urlConversationId) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      });
    }
  }, [isInitialized, urlConversationId, messages.length]);

  useEffect(() => {
    // Convert selected files to base64 data URIs
    if (selectedImages && selectedImages.length > 0) {
      Promise.all(selectedImages.map((file: File) => fileToBase64(file))).then(
        (urls) => setPreviewImages(urls)
      );
    }
  }, [selectedImages]);

  useEffect(() => {
    // Only auto-scroll when user actively sends a message
    if (shouldAutoScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      shouldAutoScrollRef.current = false;
    }
  }, [messages]);

  // Direct database insert for messages (avoids race condition with hook state)
  const insertMessage = async (
    convId: string,
    role: "user" | "assistant",
    content: string,
    imageUrl?: string
  ): Promise<Message | null> => {
    if (!session?.user?.id) return null;

    try {
      const { data, error } = await externalSupabase
        .from("messages")
        .insert({
          conversation_id: convId,
          user_id: session.user.id,
          role,
          content,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state immediately
      setMessages((prev) => [...prev, data]);

      // Update conversation's updated_at
      await externalSupabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", convId);

      return data;
    } catch (err) {
      console.error("Insert message error:", err);
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim() && previewImages.length === 0) return;

    const userContent = input;
    const userImages = [...previewImages];
    
    setInput("");
    setPreviewImages([]);
    setIsLoading(true);
    shouldAutoScrollRef.current = true;

    try {
      let convId = currentConversationId;

      // Create conversation if it doesn't exist
      if (!convId) {
        const newConversation = await createConversation(featureTitle || "New Conversation");
        if (!newConversation) {
          console.error("Failed to create conversation");
          setIsLoading(false);
          return;
        }
        convId = newConversation.id;
        setCurrentConversationId(convId);
        isFirstMessage.current = true;
      }

      // Add user message to database using direct insert
      await insertMessage(convId, "user", userContent, userImages[0]);

      // Generate title from first message
      if (isFirstMessage.current && userContent.trim()) {
        const title = userContent.length > 50 ? userContent.substring(0, 47) + "..." : userContent;
        await generateTitle(convId, userContent);
        await updateConversationTitle(convId, title);
        isFirstMessage.current = false;
      }

      // Build conversation history for context (last 30 messages)
      const conversationHistory = messages.slice(-30).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      // Call AI and typewriter-animate the response word-by-word
      const aiResult = await aiService.sendMessage({
        message: userContent,
        imageUrl: userImages[0],
        featureType: featureTitle || "Edit/Enhance Photo",
        conversationHistory,
        userId: session?.user?.id,
      });

      if (aiResult.success && aiResult.message) {
        // Animate word-by-word then persist
        await new Promise<void>((resolve) => {
          const tokens = aiResult.message!.split(" ");
          let i = 0;
          typingIntervalRef.current = setInterval(() => {
            i++;
            setStreamingContent(tokens.slice(0, i).join(" "));
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            if (i >= tokens.length) {
              clearInterval(typingIntervalRef.current!);
              typingIntervalRef.current = null;
              resolve();
            }
          }, 18);
        });
        setStreamingContent("");
        await insertMessage(convId!, "assistant", aiResult.message, aiResult.videoUrl ?? aiResult.imageUrl);
      } else {
        await insertMessage(
          convId!,
          "assistant",
          "Server busy! Please try again later"
        );
      }
      shouldAutoScrollRef.current = true;
      setIsLoading(false);
      
    } catch (error) {
      if (currentConversationId) {
        await insertMessage(
          currentConversationId,
          "assistant",
          "Server busy! Please try again later"
        );
      }
      setIsLoading(false);
    }
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
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const base64Urls = await Promise.all(Array.from(files).map(fileToBase64));
        setPreviewImages(prev => [...prev, ...base64Urls]);
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
      <div className="flex flex-col h-[calc(100dvh-16px)] sm:h-[calc(100dvh-32px)] md:h-[calc(100dvh-64px)] max-w-4xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-border mb-3 sm:mb-4"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/home")}
            className="shrink-0 w-8 h-8 sm:w-10 sm:h-10"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-sm sm:text-lg truncate">{featureTitle}</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {isFeatureMode(featureTitle || "") ? "Vertex AI" : "Gemini AI"}
            </p>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <div ref={scrollAreaWrapRef} className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-3 sm:space-y-4 pb-4 px-1 sm:px-2">
              <AnimatePresence>
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-48 sm:h-64 text-center px-4"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                      <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Start a conversation</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mb-4">
                      Upload an image or type a message to get started with {featureTitle}
                    </p>
                    {/* Starter prompt chips */}
                    <div className="flex flex-col gap-2 w-full max-w-sm">
                      {getStarterPrompts(featureTitle || "").map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => setInput(prompt)}
                          className="text-xs text-left px-3 py-2 rounded-xl border border-border hover:bg-muted transition-colors truncate"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex gap-2 sm:gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                      ) : (
                        <Cpu className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                    </div>
                    <div className={`max-w-[85%] sm:max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                      {message.videoUrl && (
                        <div className="mb-2">
                          <video
                            src={message.videoUrl}
                            controls
                            className="w-full max-w-xs sm:max-w-sm rounded-xl border border-border"
                          />
                        </div>
                      )}
                      {message.images && message.images.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
                          {message.images.map((img, imgIndex) => (
                            <div key={imgIndex} className="relative group">
                              <img
                                src={img}
                                alt={`Uploaded ${imgIndex + 1}`}
                                className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 object-cover rounded-xl border border-border"
                              />
                              <button
                                onClick={() => handleDownloadImage(img, imgIndex)}
                                className="absolute bottom-1 right-1 w-6 h-6 sm:w-7 sm:h-7 bg-background/90 backdrop-blur-sm text-foreground rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-background"
                                title="Download image"
                              >
                                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted rounded-tl-sm"
                        }`}
                      >
                        {message.role === "user" ? (
                          <p className="text-xs sm:text-sm whitespace-pre-wrap">{message.content}</p>
                        ) : (
                          <div className="text-xs sm:text-sm prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-pre:bg-background/60 prose-pre:text-xs prose-code:text-xs prose-code:bg-background/60 prose-code:px-1 prose-code:rounded prose-table:text-xs">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1 px-2">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2 sm:gap-3"
                  >
                    <motion.div 
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-accent/30 to-primary/30 border border-accent/40 bg-[length:200%_200%]"
                      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Cpu className="w-3 h-3 sm:w-4 sm:h-4 text-accent animate-pulse" />
                    </motion.div>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2 sm:px-4 sm:py-3 max-w-[75vw] sm:max-w-[60vw]">
                      {streamingContent ? (
                        <div className="text-xs sm:text-sm prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-pre:bg-background/60 prose-pre:text-xs prose-code:text-xs prose-code:bg-background/60 prose-code:px-1 prose-code:rounded">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamingContent}</ReactMarkdown>
                          <span className="inline-block w-[2px] h-[14px] bg-foreground/60 ml-0.5 animate-pulse align-middle" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-accent" />
                          <motion.span 
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="text-xs sm:text-sm text-accent font-medium"
                          >
                            Generating response...
                          </motion.span>
                        </div>
                      )}
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
              className="flex gap-2 sm:gap-3 p-2 sm:p-3 border-t border-border overflow-x-auto"
            >
              {previewImages.map((img, index) => (
                <div key={index} className="relative shrink-0 group">
                  <img
                    src={img}
                    alt={`Preview ${index + 1}`}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg sm:rounded-xl border-2 border-border"
                  />
                  <button
                    onClick={() => removePreviewImage(index)}
                    className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                  >
                    <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
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
          className="border-t border-border pt-3 sm:pt-4"
        >
          <div className="flex items-end gap-1.5 sm:gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddImage}
              className="shrink-0 w-9 h-9 sm:w-10 sm:h-10"
            >
              <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 120) + "px";
                }}
                placeholder="Type your message..."
                rows={1}
                className="w-full resize-none rounded-lg sm:rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[40px] sm:min-h-[48px] max-h-[100px] sm:max-h-[120px]"
                style={{ 
                  overflowY: input.split('\n').length > 3 ? 'auto' : 'hidden'
                }}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() && previewImages.length === 0}
              size="icon"
              className="shrink-0 w-9 h-9 sm:w-10 sm:h-10"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground text-center mt-1.5 sm:mt-2">
            AI responses are generated and may not always be accurate
          </p>
        </motion.div>
      </div>
    </ChatLayout>
  );
};

export default Chat;
