import { motion } from "framer-motion";
import { ImageIcon, Wand2, GitCompare, Sparkles } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import FeaturedCard from "@/components/dashboard/FeaturedCard";
import ToolCard from "@/components/dashboard/ToolCard";
import aiPortraitHero from "@/assets/ai-portrait-hero.jpg";

const Home = () => {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold italic mb-2">Welcome back, Alex.</h1>
          <p className="text-muted-foreground">What will you create with AI today?</p>
        </div>

        {/* Featured Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
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
          
          <div className="card-feature">
            <div className="icon-box-blue mb-4">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Prompt to Picture</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Generate ultra-realistic visuals and illustrations from simple text descriptions.
            </p>
            <button className="btn-outline w-full text-sm">
              Launch Creator
            </button>
          </div>
        </div>

        {/* Creative Tool Suite */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold">Creative Tool Suite</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard 
              icon={ImageIcon}
              iconColorClass="icon-box-blue"
              title="Prompt to Picture"
              description="Generate ultra-realistic visuals and illustrations from simple text descriptions."
              buttonLabel="Launch Creator"
            />
            <ToolCard 
              icon={Wand2}
              iconColorClass="icon-box-purple"
              title="Professional Mode"
              description="Advanced studio controls for pixel-perfect adjustments and seed-based consistency."
              buttonLabel="Open Studio"
            />
            <ToolCard 
              icon={GitCompare}
              iconColorClass="icon-box-green"
              title="Compare Pictures"
              description="Side-by-side analysis tool to evaluate different models, prompts, and lighting setups."
              buttonLabel="Start Analysis"
            />
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Home;
