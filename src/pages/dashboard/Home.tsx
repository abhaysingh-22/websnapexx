import { motion } from "framer-motion";
import { ImageIcon, Wand2, GitCompare, Sparkles } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import FeaturedCard from "@/components/dashboard/FeaturedCard";
import ToolCard from "@/components/dashboard/ToolCard";
import aiPortraitHero from "@/assets/ai-portrait-hero.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const Home = () => {
  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            Welcome back, <span className="gradient-text">Alex</span>.
          </h1>
          <p className="text-muted-foreground text-lg">What will you create with AI today?</p>
        </motion.div>

        {/* Featured Section */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12"
        >
          <div className="lg:col-span-2">
            <FeaturedCard 
              image={aiPortraitHero}
              badge="⚡ Render Engine v4.0 Active"
              tag="FEATURED TOOL"
              title="AI Ad Video Generation"
              description="Transform raw scripts into high-converting cinema instantly. Next-gen synthesis for professional campaigns."
              buttonLabel="Generate Now"
            />
          </div>
          
          <motion.div 
            className="card-feature group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="icon-box-blue mb-4 group-hover:scale-110 transition-transform duration-300">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Prompt to Picture</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Generate ultra-realistic visuals and illustrations from simple text descriptions.
            </p>
            <button className="btn-outline w-full text-sm font-semibold">
              Launch Creator
            </button>
          </motion.div>
        </motion.div>

        {/* Creative Tool Suite */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold">Creative Tool Suite</h2>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <ToolCard 
                icon={ImageIcon}
                iconColorClass="icon-box-blue"
                title="Prompt to Picture"
                description="Generate ultra-realistic visuals and illustrations from simple text descriptions."
                buttonLabel="Launch Creator"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ToolCard 
                icon={Wand2}
                iconColorClass="icon-box-purple"
                title="Professional Mode"
                description="Advanced studio controls for pixel-perfect adjustments and seed-based consistency."
                buttonLabel="Open Studio"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ToolCard 
                icon={GitCompare}
                iconColorClass="icon-box-green"
                title="Compare Pictures"
                description="Side-by-side analysis tool to evaluate different models, prompts, and lighting setups."
                buttonLabel="Start Analysis"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Home;
