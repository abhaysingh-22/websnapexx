import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Image as ImageIcon,
  Zap,
  Lock,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useSEO } from "@/hooks/useSEO";

const Index = () => {
  const navigate = useNavigate();
  const seo = useSEO({
    title: "SnapExx — AI Image & Video Generator",
    description: "Generate high-fidelity AI images and videos instantly. Transform your ideas into stunning visuals with SnapExx's advanced AI models.",
    url: "https://snapexx.tech/",
  });

  return (
    <>
      <seo.Helmet />
      <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      {/* Navigation */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Logo />
          {/* <span className="font-bold text-xl tracking-tight">SnapExx</span> */}
        </div>
        {/* <nav className="hidden md:flex gap-6">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a>
          <a href="/faqs" className="text-muted-foreground hover:text-foreground transition-colors">FAQs</a>
        </nav> */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground hover:translate-y-0"
            onClick={() => navigate("/signin")}
          >
            Log in
          </Button>
          <Button
            size="sm"
            onClick={() => navigate("/app/home")}
            className="text-sm rounded-full px-5 hover:translate-y-0"
          >
            Launch App
            <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <section className="py-20 md:py-32 px-6 flex flex-col items-center text-center max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 text-secondary-foreground mb-8 border border-border/50">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold tracking-wider uppercase">
              The Next Generation of AI Imagery
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-foreground leading-[1.15]">
            Generate High-Fidelity <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              AI Images & Videos
            </span>{" "}
            Instantly
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Transform your ideas into stunning visuals with SnapExx. Our
            advanced AI models deliver breathtaking quality, unparalleled speed,
            and limitless creativity for professionals.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button
              size="default"
              onClick={() => navigate("/app/home")}
              className="w-full sm:w-auto text-sm px-8 h-12 rounded-full hover:translate-y-0"
            >
              Start Creating for Free
            </Button>
            {/* <Button size="default" variant="outline" onClick={() => navigate("/blog")} className="w-full sm:w-auto text-sm px-8 h-12 rounded-full border-border text-muted-foreground hover:text-foreground">
              Read Our Blog
            </Button> */}
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl text-left mt-12" id="features">
            <div className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <ImageIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Photorealistic Quality</h3>
              <p className="text-muted-foreground">Unleash the power of cutting-edge diffusion models to create images indistinguishable from reality.</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">Go from text prompt to final render in seconds, accelerating your creative workflow.</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Private & Secure</h3>
              <p className="text-muted-foreground">Your generations and prompts are fully private. You own 100% of the rights to the images you create.</p>
            </div>
          </div> */}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6 bg-background">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center opacity-90">
            <Logo />
            {/* <span className="font-bold">SnapExx</span> */}
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground font-medium">
            <a
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/cookies"
              className="hover:text-foreground transition-colors"
            >
              Cookie Policy
            </a>
          </div>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SnapExx. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Index;
