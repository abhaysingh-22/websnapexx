import { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  User,
  Bot,
  X,
  Download,
  Wrench,
  Video,
  Wand2,
  Pencil,
  Camera,
  GitCompare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useConversations, Message } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";

import { externalSupabase } from "@/integrations/externalSupabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { aiService, getStarterPrompts, isFeatureMode } from "@/services/aiService";
import { useAuth } from "@/hooks/useAuth";
import MediaPickerDialog from "@/components/dashboard/MediaPickerDialog";

// ─── Feature definitions ─────────────────────────────────────────────────────
interface FeatureDef {
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  requiresImage: boolean;
}

const FEATURES: FeatureDef[] = [
  {
    title: "AI Ad Video Generation",
    description: "Generate high-converting ad videos from prompts",
    icon: Video,
    iconColor: "text-red-400 bg-red-500/10",
    requiresImage: false,
  },
  {
    title: "Prompt to Picture",
    description: "Transform text prompts into stunning images",
    icon: Wand2,
    iconColor: "text-purple-400 bg-purple-500/10",
    requiresImage: false,
  },
  {
    title: "Edit/Enhance Photo",
    description: "AI-powered photo editing and enhancement",
    icon: Pencil,
    iconColor: "text-blue-400 bg-blue-500/10",
    requiresImage: true,
  },
  {
    title: "Professional Mode",
    description: "Resume, portfolio & professional photo generation",
    icon: Camera,
    iconColor: "text-amber-400 bg-amber-500/10",
    requiresImage: true,
  },
  {
    title: "Compare Pictures",
    description: "Side-by-side photo comparison and analysis",
    icon: GitCompare,
    iconColor: "text-green-400 bg-green-500/10",
    requiresImage: true,
  },
];

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

// ─── Display message type ────────────────────────────────────────────────────
interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  images?: string[];
  timestamp: Date;
}

const Home = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { session } = useAuthContext();

  // Chat state
  const { createConversation, updateConversationTitle } = useConversations();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const { messages: dbMessages, fetchMessages, setMessages } = useMessages(currentConversationId);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const scrollAreaWrapRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const shouldAutoScrollRef = useRef(false);
  const isFirstMessage = useRef(true);

  // Feature / tool selection
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const [pendingFeature, setPendingFeature] = useState<string>("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/signin");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Convert DB messages to display format
  const messages: DisplayMessage[] = dbMessages.map((msg: Message) => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    images: msg.image_url ? [msg.image_url] : undefined,
    timestamp: new Date(msg.created_at),
  }));

  // Fetch messages when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      fetchMessages();
    }
  }, [currentConversationId]);

  // Auto-scroll when messages change
  useEffect(() => {
    if (messages.length > 0) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [messages.length, isLoading]);

  // Get display name
  const displayName = user?.user_metadata?.full_name || "there";

  // Current active feature title for AI routing
  const activeFeatureType = selectedFeature || "General Chat";

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleSelectFeature = (feature: FeatureDef) => {
    setToolsOpen(false);

    if (feature.requiresImage) {
      // Open media picker for image-based features
      setPendingFeature(feature.title);
      setMediaDialogOpen(true);
    } else {
      setSelectedFeature(feature.title);
    }
  };

  const handleMediaSelected = async (files: File[]) => {
    setSelectedFeature(pendingFeature);
    // Convert files to base64 data URIs (works for both preview AND backend)
    const base64Urls = await Promise.all(files.map(fileToBase64));
    setPreviewImages((prev) => [...prev, ...base64Urls]);
  };

  const handleDeselectFeature = () => {
    setSelectedFeature(null);
  };

  // Direct database insert for messages
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

      setMessages((prev) => [...prev, data]);

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
        const newConversation = await createConversation(activeFeatureType || "New Conversation");
        if (!newConversation) {
          console.error("Failed to create conversation");
          setIsLoading(false);
          return;
        }
        convId = newConversation.id;
        setCurrentConversationId(convId);
        isFirstMessage.current = true;
      }

      // Add user message
      await insertMessage(convId, "user", userContent, userImages[0]);

      // Generate title from first message
      if (isFirstMessage.current && userContent.trim()) {
        const title = userContent.length > 50 ? userContent.substring(0, 47) + "..." : userContent;
        await generateTitle(convId, userContent);
        await updateConversationTitle(convId, title);
        isFirstMessage.current = false;
      }

      // Build conversation history
      const conversationHistory = messages.slice(-10).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      // Call AI
      const aiResult = await aiService.sendMessage({
        message: userContent,
        imageUrl: userImages[0],
        featureType: activeFeatureType,
        conversationHistory,
      });

      if (aiResult.success && aiResult.message) {
        await insertMessage(convId!, "assistant", aiResult.message, aiResult.imageUrl);
      } else {
        await insertMessage(
          convId!,
          "assistant",
          `Sorry, I encountered an error: ${aiResult.error || "Unknown error"}. Please try again.`
        );
      }
      shouldAutoScrollRef.current = true;
      setIsLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
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
    // Route through the gallery permission dialog
    setGalleryDialogOpen(true);
  };

  const handleGalleryMediaSelected = async (files: File[]) => {
    const base64Urls = await Promise.all(files.map(fileToBase64));
    setPreviewImages((prev) => [...prev, ...base64Urls]);
  };

  const removePreviewImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
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

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] md:h-[calc(100vh-72px)] max-w-5xl w-full mx-auto px-3 sm:px-4 lg:px-6">
        {/* Continuous chat container — messages + input in one box */}
        <div className="flex-1 flex flex-col min-h-0 rounded-2xl border border-border/50 bg-card/40 dark:bg-card/20 overflow-hidden">
          {/* Messages Area */}
          <div ref={scrollAreaWrapRef} className="flex-1 min-h-0 overflow-y-auto chat-scrollbar">
            <div className="space-y-3 sm:space-y-4 pb-4 pt-4 px-4 sm:px-6">
              <AnimatePresence>
                {/* Empty state — Welcome */}
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4"
                  >


                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl sm:text-3xl font-bold mb-2"
                    >
                      Hello, <span className="gradient-text">{displayName}</span>
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-sm sm:text-base text-muted-foreground max-w-md mb-2"
                    >
                      {selectedFeature
                        ? `You're using ${selectedFeature}. Ask me anything!`
                        : "How can I help you today? Start chatting or pick a tool below."}
                    </motion.p>

                    {/* Selected Feature indicator */}
                    {selectedFeature && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-accent/10 border border-accent/20"
                      >
                        {(() => {
                          const feat = FEATURES.find((f) => f.title === selectedFeature);
                          const Icon = feat?.icon || Sparkles;
                          return <Icon className="w-4 h-4 text-accent" />;
                        })()}
                        <span className="text-sm font-medium text-accent">{selectedFeature}</span>
                        <button
                          onClick={handleDeselectFeature}
                          className="ml-1 p-0.5 rounded-full hover:bg-accent/20 transition-colors"
                        >
                          <X className="w-3 h-3 text-accent" />
                        </button>
                      </motion.div>
                    )}

                    {/* Starter prompt chips */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-col gap-2 w-full max-w-sm mt-2"
                    >
                      {getStarterPrompts(activeFeatureType).map((prompt, i) => (
                        <motion.button
                          key={i}
                          onClick={() => setInput(prompt)}
                          className="text-xs sm:text-sm text-left px-4 py-2.5 rounded-xl border border-border/60 bg-card/50 hover:bg-card hover:border-accent/30 hover:shadow-sm transition-all duration-200 truncate"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          {prompt}
                        </motion.button>
                      ))}
                    </motion.div>
                  </motion.div>
                )}

                {/* Chat messages */}
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-2 sm:gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-gradient-to-br from-accent/20 to-primary/20 text-accent"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </div>
                    <div className={`max-w-[85%] sm:max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                      {message.images && message.images.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
                          {message.images.map((img, imgIndex) => (
                            <div key={imgIndex} className="relative group">
                              <img
                                src={img}
                                alt={`Uploaded ${imgIndex + 1}`}
                                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg border border-border"
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
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2 sm:gap-3"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2 sm:px-4 sm:py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-accent" />
                        <span className="text-xs sm:text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </div>

        {/* Image Preview */}
        <AnimatePresence>
          {previewImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2 sm:gap-3 p-2 sm:p-3 border-t border-border/30 overflow-x-auto"
            >
              {previewImages.map((img, index) => (
                <div key={index} className="relative shrink-0 group">
                  <img
                    src={img}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg sm:rounded-xl border-2 border-border"
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

        {/* Selected Feature Badge (above input) */}
        <AnimatePresence>
          {selectedFeature && messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="px-1 pt-2"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs sm:text-sm">
                {(() => {
                  const feat = FEATURES.find((f) => f.title === selectedFeature);
                  const Icon = feat?.icon || Sparkles;
                  return <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent" />;
                })()}
                <span className="font-medium text-accent">{selectedFeature}</span>
                <button
                  onClick={handleDeselectFeature}
                  className="ml-0.5 p-0.5 rounded-full hover:bg-accent/20 transition-colors"
                >
                  <X className="w-3 h-3 text-accent/70" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area — inside the same container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-border/30 p-3 sm:p-4"
        >
          <div className="flex items-end gap-1.5 sm:gap-2">
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
                placeholder={
                  selectedFeature
                    ? `Message ${selectedFeature}...`
                    : "Message SnapExx AI..."
                }
                rows={1}
                className="w-full resize-none rounded-xl border border-border/60 bg-background/60 dark:bg-background/40 px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/30 min-h-[44px] max-h-[120px] placeholder:text-muted-foreground/50 transition-all duration-200"
                style={{
                  overflowY: input.split("\n").length > 3 ? "auto" : "hidden",
                }}
              />
            </div>
          </div>
          {/* Action row: tools + gallery on left, send on right */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-0.5">
              {/* Tools Button */}
              <Popover open={toolsOpen} onOpenChange={setToolsOpen}>
                <PopoverTrigger asChild>
                  <button
                    className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                    title="Tools"
                  >
                    <Wrench className="w-[18px] h-[18px]" />
                    {selectedFeature && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="start"
                  className="w-72 sm:w-80 p-2"
                  sideOffset={8}
                >
                  <div className="mb-2 px-2 pt-1">
                    <h4 className="text-sm font-semibold text-foreground">Tools</h4>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Select a tool to unlock its capabilities
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    {FEATURES.map((feature) => {
                      const Icon = feature.icon;
                      const isActive = selectedFeature === feature.title;
                      return (
                        <button
                          key={feature.title}
                          onClick={() => handleSelectFeature(feature)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                            isActive
                              ? "bg-accent/10 border border-accent/20"
                              : "hover:bg-muted border border-transparent"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${feature.iconColor}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium truncate">
                              {feature.title}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                              {feature.description}
                            </p>
                          </div>
                          {isActive && (
                            <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {selectedFeature && (
                    <button
                      onClick={handleDeselectFeature}
                      className="w-full mt-1 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors text-center"
                    >
                      Clear selection
                    </button>
                  )}
                </PopoverContent>
              </Popover>

              {/* Gallery / Image Upload — routes through permission dialog */}
              <button
                onClick={handleAddImage}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                title="Upload image"
              >
                <ImageIcon className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!input.trim() && previewImages.length === 0}
              className="p-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Send message"
            >
              <Send className="w-[18px] h-[18px]" />
            </button>
          </div>
        </motion.div>
        </div>  {/* End continuous container */}

          <p className="text-[9px] sm:text-[10px] text-muted-foreground text-center mt-2 pb-2">
            AI responses are generated and may not always be accurate
          </p>
      </div>

      {/* Media Picker Dialog — for feature tool selection */}
      <MediaPickerDialog
        open={mediaDialogOpen}
        onOpenChange={setMediaDialogOpen}
        onMediaSelected={handleMediaSelected}
        featureTitle={pendingFeature}
      />

      {/* Gallery Dialog — for the gallery icon in input bar */}
      <MediaPickerDialog
        open={galleryDialogOpen}
        onOpenChange={setGalleryDialogOpen}
        onMediaSelected={handleGalleryMediaSelected}
        featureTitle={selectedFeature || "Upload Photos"}
      />
    </DashboardLayout>
  );
};

export default Home;