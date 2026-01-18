import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Wand2, GitCompare, Sparkles, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import FeaturedCard from "@/components/dashboard/FeaturedCard";
import ToolCard from "@/components/dashboard/ToolCard";
import MediaPickerDialog from "@/components/dashboard/MediaPickerDialog";
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
  const navigate = useNavigate();
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState("");

  const handleFeatureClick = (featureTitle: string) => {
    setSelectedFeature(featureTitle);
    setMediaDialogOpen(true);
  };

  const handleMediaSelected = (files: File[]) => {
    navigate("/chat", { 
      state: { 
        featureTitle: selectedFeature,
        selectedImages: files 
      } 
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
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-1 sm:mb-2">
            Welcome back, <span className="gradient-text">Alex</span>.
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">What will you create with AI today?</p>
        </motion.div>

        {/* Featured Section */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          <div className="lg:col-span-2">
            <FeaturedCard 
              image={aiPortraitHero}
              badge="⚡ Render Engine v4.0 Active"
              tag="FEATURED TOOL"
              title="AI Ad Video Generation"
              description="Transform raw scripts into high-converting cinema instantly. Next-gen synthesis for professional campaigns."
              buttonLabel="Generate Now"
              onButtonClick={() => handleFeatureClick("AI Ad Video Generation")}
            />
          </div>
          
          <motion.div 
            className="card-feature group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleFeatureClick("Prompt to Picture")}
          >
            <div className="icon-box-purple mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <Wand2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-bold text-base sm:text-lg mb-2">Prompt to Picture</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
              Transform your text prompts into stunning AI-generated images instantly.
            </p>
            <button className="btn-outline w-full text-xs sm:text-sm font-semibold">
              Generate Image
            </button>
          </motion.div>
        </motion.div>

        {/* Creative Tool Suite */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            <h2 className="text-lg sm:text-xl font-bold">Creative Tool Suite</h2>
          </div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <ToolCard 
                icon={Pencil}
                iconColorClass="icon-box-blue"
                title="Edit/Enhance Photo"
                description="Enhance your photos with AI-powered editing tools for professional results."
                buttonLabel="Start Editing"
                onButtonClick={() => handleFeatureClick("Edit/Enhance Photo")}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ToolCard 
                icon={Wand2}
                iconColorClass="icon-box-purple"
                title="Professional Mode"
                description="Advanced studio controls for pixel-perfect adjustments and seed-based consistency."
                buttonLabel="Open Studio"
                onButtonClick={() => handleFeatureClick("Professional Mode")}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ToolCard 
                icon={GitCompare}
                iconColorClass="icon-box-green"
                title="Compare Pictures"
                description="Side-by-side analysis tool to evaluate different models and lighting setups."
                buttonLabel="Start Analysis"
                onButtonClick={() => handleFeatureClick("Compare Pictures")}
              />
            </motion.div>
          </motion.div>
        </motion.div>

      </motion.div>

      {/* Media Picker Dialog */}
      <MediaPickerDialog
        open={mediaDialogOpen}
        onOpenChange={setMediaDialogOpen}
        onMediaSelected={handleMediaSelected}
        featureTitle={selectedFeature}
      />
    </DashboardLayout>
  );
};

export default Home;
