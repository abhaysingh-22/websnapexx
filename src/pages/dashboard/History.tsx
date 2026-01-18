import { motion } from "framer-motion";
import { Eye, Download, ChevronLeft, ChevronRight, Calendar, Clock, Trash2, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useConversationHistory } from "@/hooks/use-chat-storage";
import aiPortraitHero from "@/assets/ai-portrait-hero.jpg";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const History = () => {
  const navigate = useNavigate();
  const { conversations, deleteConversation } = useConversationHistory();

  const hasData = conversations.length > 0;

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-6 sm:mb-8"
        >
          Activity Feed
        </motion.h1>

        {!hasData && (
          <motion.div
            variants={itemVariants}
            className="card-elevated p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No activity yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start a conversation with any AI feature to see your history here
            </p>
            <Button onClick={() => navigate("/home")}>
              Go to Home
            </Button>
          </motion.div>
        )}

        {hasData && (
          <>
            {/* Mobile Cards View */}
            <div className="block lg:hidden space-y-4">
              {conversations.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="card-elevated p-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex gap-4">
                    <img 
                      src={item.previewImage || aiPortraitHero} 
                      alt={item.featureTitle}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base truncate">{item.featureTitle}</p>
                      <p className="text-xs sm:text-sm text-accent font-medium truncate">
                        {item.messages.length} messages
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(item.updatedAt, "MMM dd, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(item.updatedAt, "HH:mm")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      item.status === "COMPLETED" 
                        ? "bg-green-500/20 text-green-600" 
                        : "bg-yellow-500/20 text-yellow-600"
                    }`}>
                      {item.status}
                    </span>
                    <div className="flex gap-2">
                      <motion.button 
                        className="p-2 rounded-lg hover:bg-secondary transition-all duration-300 text-accent"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/chat", { state: { featureTitle: item.featureTitle } })}
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        className="p-2 rounded-lg hover:bg-destructive/10 transition-all duration-300 text-destructive"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteConversation(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop Table View */}
            <motion.div variants={itemVariants} className="hidden lg:block card-elevated overflow-hidden">
              {/* Table Header */}
              <div className="table-header grid grid-cols-12 gap-4 p-4">
                <div className="col-span-2 font-bold">PREVIEW</div>
                <div className="col-span-3 font-bold">FEATURE</div>
                <div className="col-span-3 font-bold">DATE & TIME</div>
                <div className="col-span-2 font-bold">STATUS</div>
                <div className="col-span-2 text-right font-bold">ACTIONS</div>
              </div>

              {/* Table Body */}
              <motion.div 
                className="divide-y divide-border"
                variants={containerVariants}
              >
                {conversations.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    variants={itemVariants}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-secondary/50 transition-all duration-300"
                    whileHover={{ x: 4 }}
                  >
                    <div className="col-span-2">
                      <motion.img 
                        src={item.previewImage || aiPortraitHero} 
                        alt={item.featureTitle}
                        className="w-16 h-16 rounded-lg object-cover shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <div className="col-span-3">
                      <p className="font-semibold">{item.featureTitle}</p>
                      <p className="text-sm text-accent font-medium">{item.messages.length} messages</p>
                    </div>
                    <div className="col-span-3">
                      <p className="font-semibold">{format(item.updatedAt, "MMM dd, yyyy")}</p>
                      <p className="text-sm text-muted-foreground">{format(item.updatedAt, "HH:mm")}</p>
                    </div>
                    <div className="col-span-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        item.status === "COMPLETED" 
                          ? "bg-green-500/20 text-green-600" 
                          : "bg-yellow-500/20 text-yellow-600"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <motion.button 
                        className="p-2 rounded-lg hover:bg-secondary transition-all duration-300 text-accent"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/chat", { state: { featureTitle: item.featureTitle } })}
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                      <motion.button 
                        className="p-2 rounded-lg hover:bg-destructive/10 transition-all duration-300 text-destructive"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteConversation(item.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default History;
