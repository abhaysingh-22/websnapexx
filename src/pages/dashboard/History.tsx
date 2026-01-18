import { motion } from "framer-motion";
import { Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";
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

const History = () => {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold italic mb-8">Activity Feed</h1>

        {/* Table */}
        <div className="card-elevated overflow-hidden">
          {/* Table Header */}
          <div className="table-header grid grid-cols-12 gap-4 p-4">
            <div className="col-span-2">PREVIEW</div>
            <div className="col-span-3">TASK NAME</div>
            <div className="col-span-3">DATE & TIME</div>
            <div className="col-span-2">STATUS</div>
            <div className="col-span-2 text-right">ACTIONS</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {historyData.map((item, index) => (
              <div 
                key={index}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-secondary/50 transition-colors"
              >
                <div className="col-span-2">
                  <img 
                    src={item.image} 
                    alt={item.taskName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </div>
                <div className="col-span-3">
                  <p className="font-medium">{item.taskName}</p>
                  <p className="text-sm text-accent">{item.package}</p>
                </div>
                <div className="col-span-3">
                  <p className="font-medium">{item.date}</p>
                  <p className="text-sm text-muted-foreground">{item.time}</p>
                </div>
                <div className="col-span-2">
                  <span className="badge-completed">{item.status}</span>
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-accent">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-accent">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="p-4 flex items-center justify-between border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Show</span>
              <select className="px-2 py-1 rounded border border-border bg-background">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span>per page</span>
              <span className="ml-4">Showing 1-10 of 248 entries</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Page 1 of 25</span>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-accent text-accent-foreground text-sm font-medium">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg hover:bg-secondary transition-colors text-sm">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg hover:bg-secondary transition-colors text-sm">
                  3
                </button>
                <span className="px-2">...</span>
                <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default History;
