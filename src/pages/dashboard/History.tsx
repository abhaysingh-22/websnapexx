import { motion } from "framer-motion";
import { Eye, Download, ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import aiPortraitHero from "@/assets/ai-portrait-hero.jpg";

const historyData = Array(6).fill({
  image: aiPortraitHero,
  taskName: "AI Portrait Refinement",
  package: "Enhancement Package v2.4",
  date: "Oct 24, 2023",
  time: "14:20 PM",
  status: "COMPLETED",
});

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

        {/* Mobile Cards View */}
        <div className="block lg:hidden space-y-4">
          {historyData.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="card-elevated p-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex gap-4">
                <img 
                  src={item.image} 
                  alt={item.taskName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base truncate">{item.taskName}</p>
                  <p className="text-xs sm:text-sm text-accent font-medium truncate">{item.package}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="badge-completed text-xs font-semibold">{item.status}</span>
                <div className="flex gap-2">
                  <motion.button 
                    className="p-2 rounded-lg hover:bg-secondary transition-all duration-300 text-accent"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                  <motion.button 
                    className="p-2 rounded-lg hover:bg-secondary transition-all duration-300 text-accent"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-4 h-4" />
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
            <div className="col-span-3 font-bold">TASK NAME</div>
            <div className="col-span-3 font-bold">DATE & TIME</div>
            <div className="col-span-2 font-bold">STATUS</div>
            <div className="col-span-2 text-right font-bold">ACTIONS</div>
          </div>

          {/* Table Body */}
          <motion.div 
            className="divide-y divide-border"
            variants={containerVariants}
          >
            {historyData.map((item, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-secondary/50 transition-all duration-300"
                whileHover={{ x: 4 }}
              >
                <div className="col-span-2">
                  <motion.img 
                    src={item.image} 
                    alt={item.taskName}
                    className="w-16 h-16 rounded-lg object-cover shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <div className="col-span-3">
                  <p className="font-semibold">{item.taskName}</p>
                  <p className="text-sm text-accent font-medium">{item.package}</p>
                </div>
                <div className="col-span-3">
                  <p className="font-semibold">{item.date}</p>
                  <p className="text-sm text-muted-foreground">{item.time}</p>
                </div>
                <div className="col-span-2">
                  <span className="badge-completed font-semibold">{item.status}</span>
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <motion.button 
                    className="p-2 rounded-lg hover:bg-secondary transition-all duration-300 text-accent"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye className="w-5 h-5" />
                  </motion.button>
                  <motion.button 
                    className="p-2 rounded-lg hover:bg-secondary transition-all duration-300 text-accent"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          <motion.div 
            variants={itemVariants}
            className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              <span>Show</span>
              <select className="px-2 py-1 rounded border border-border bg-background font-semibold">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span>per page</span>
              <span className="ml-4 hidden sm:inline">Showing 1-10 of 248 entries</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-medium">Page 1 of 25</span>
              <div className="flex items-center gap-1">
                <motion.button 
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>
                <button className="w-8 h-8 rounded-lg bg-accent text-accent-foreground text-sm font-bold">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg hover:bg-secondary transition-colors text-sm font-medium">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg hover:bg-secondary transition-colors text-sm font-medium">
                  3
                </button>
                <span className="px-2 font-bold">...</span>
                <motion.button 
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile Pagination */}
        <div className="lg:hidden flex items-center justify-center gap-2 mt-6">
          <button className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium px-4">Page 1 of 25</span>
          <button className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default History;
