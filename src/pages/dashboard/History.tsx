import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Trash2, MessageSquare, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useConversations } from "@/hooks/useConversations";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const { conversations, loading, deleteConversation } = useConversations();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    await deleteConversation(deleteId);
    toast.success("Conversation deleted");
    setDeleteId(null);
  };

  const handleOpenConversation = (conversationId: string) => {
    navigate(`/home?conversation=${conversationId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
          Your Activity
        </motion.h1>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : conversations.length === 0 ? (
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
        ) : (
          <>
            {/* Mobile Cards View */}
            <div className="block lg:hidden space-y-4">
              {conversations.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="card-elevated p-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base truncate">{item.title}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.updated_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end mt-3 pt-3 border-t border-border">
                    <div className="flex gap-2">
                      <motion.button 
                        className="p-2 rounded-lg hover:bg-secondary transition-all duration-300 text-accent"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleOpenConversation(item.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        className="p-2 rounded-lg hover:bg-destructive/10 transition-all duration-300 text-destructive"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeleteId(item.id)}
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
                <div className="col-span-1 font-bold"></div>
                <div className="col-span-5 font-bold">TITLE</div>
                <div className="col-span-4 font-bold">DATE & TIME</div>
                <div className="col-span-2 text-right font-bold">ACTIONS</div>
              </div>

              {/* Table Body */}
              <motion.div 
                className="divide-y divide-border"
                variants={containerVariants}
              >
                {conversations.map((item) => (
                  <motion.div 
                    key={item.id}
                    variants={itemVariants}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-secondary/50 transition-all duration-300"
                    whileHover={{ x: 4 }}
                  >
                    <div className="col-span-1">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="col-span-5">
                      <p className="font-semibold truncate">{item.title}</p>
                    </div>
                    <div className="col-span-4">
                      <p className="font-semibold">{formatDate(item.updated_at)}</p>
                      <p className="text-sm text-muted-foreground">{formatTime(item.updated_at)}</p>
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <motion.button 
                        className="p-2 rounded-lg hover:bg-secondary transition-all duration-300 text-accent"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleOpenConversation(item.id)}
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                      <motion.button 
                        className="p-2 rounded-lg hover:bg-destructive/10 transition-all duration-300 text-destructive"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeleteId(item.id)}
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this conversation and all its messages.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default History;
