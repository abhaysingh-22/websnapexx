import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Users, PenTool, Megaphone, Rocket, Globe, Clock, Zap, Brain, MessageSquare, Image, Video } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Footer from "@/components/ui/Footer";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const audienceCards = [
  {
    icon: Rocket,
    title: "SaaS Founders",
    content:
      "Running a SaaS means shipping fast and communicating value clearly. SnapExx lets you turn changelogs, feature pages, and landing pages into polished videos in minutes — no video editor, no freelancer, no delays. Paste your URL. Pick a style. Get a video that explains your product the way your customers actually consume content. Use it on your homepage, in onboarding emails, or across social channels. SaaS founders using AI video generators like SnapExx cut their content production cycle from days to under an hour — freeing up bandwidth for what matters: building and selling.",
  },
  {
    icon: PenTool,
    title: "Bloggers",
    content:
      "Long-form blog content is powerful — but not everyone reads. Studies show that adding video to a blog post can increase organic traffic by over 150%. With SnapExx, bloggers can convert website to video directly from existing articles. The AI reads your post, extracts key points, and generates a visual walkthrough that can be embedded or shared on YouTube, Instagram, or TikTok. There is no need to learn editing software or spend hours on production. Your written content becomes your script. SnapExx does the rest. For bloggers looking to repurpose content efficiently, this is the most practical AI content video tool available today.",
  },
  {
    icon: Sparkles,
    title: "Content Creators",
    content:
      "Content creators live and die by output volume. The algorithm rewards consistency, but quality still matters. SnapExx gives creators a way to produce high-quality video content at scale — without a studio, a camera, or an editing suite. Convert a portfolio page into a highlight reel. Turn a product review blog into a visual breakdown. Transform a newsletter into a short-form explainer. SnapExx is not a toy with preset templates. It uses AI to understand your content and build videos that actually make sense. For creators managing multiple platforms, it is a genuine time-saver and a competitive advantage.",
  },
  {
    icon: Megaphone,
    title: "Marketing Teams",
    content:
      "Marketing teams are under constant pressure to deliver more content, faster, across more channels. SnapExx plugs directly into that workflow. Instead of briefing a designer, waiting for a draft, reviewing, revising, and approving — you paste a URL and get a video. Use it for campaign landing pages, event promotions, product launches, or partner co-marketing. The AI video generator adapts to the structure and tone of the source material, producing videos that match your brand's voice without manual intervention. Teams that adopt SnapExx report a measurable reduction in creative bottlenecks and a faster time-to-publish across all channels.",
  },
  {
    icon: Rocket,
    title: "Startup Founders",
    content:
      "Early-stage startups rarely have the budget for a video production team. But investors, customers, and partners all expect professional visual content. SnapExx levels the playing field. Convert your pitch deck landing page into a video walkthrough. Turn your product documentation into an explainer. Generate social-ready clips from your company blog. You do not need to choose between spending money and looking polished. SnapExx is the website to video tool that lets bootstrapped founders punch above their weight — with content that looks like it came from a funded marketing department.",
  },
];

const Blog = () => {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.title = "SnapExx Blog";
  }, []);

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/home" className="flex items-center">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            {/* <Link
              to="/home"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link> */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
                                 >
        {/* Minimal Hero Border */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
          <div
                                                   className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8"
          >
            <Globe className="w-4 h-4" />
            SnapExx Blog
          </div>

          <h1
                                                   className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight mb-6"
          >
            How SnapExx Helps You Create{" "}
            <span className="text-accent">
              Videos from Any Website
            </span>
          </h1>

          <p
                                                   className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            A practical guide to using SnapExx — the AI video generator that turns web pages into
            professional videos — for SaaS founders, bloggers, creators, marketers, and startups.
          </p>

          <div
                                                   className="flex items-center justify-center gap-4 mt-8 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              7 min read
            </span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span>March 2026</span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article
        className="max-w-4xl mx-auto px-4 sm:px-6 pb-20"
                                 >
        {/* Intro Section */}
        <section  className="mb-16">
          <div className="prose-section">
            <h2 className="section-heading">The Problem With Video Content Today</h2>
            <p className="section-text">
              Video is no longer optional. It dominates social feeds, improves conversion rates, boosts SEO rankings,
              and holds attention better than any other format. But creating video content remains expensive, slow, and
              technically demanding. Most businesses know they need more video. They just cannot produce it fast enough.
            </p>
            <p className="section-text">
              Traditional video production involves scripting, storyboarding, recording, editing, and rendering. Even a
              simple 60-second explainer video can take days and cost hundreds of dollars. For teams operating at speed — 
              startups, solo creators, lean marketing departments — this bottleneck is a real problem.
            </p>
          </div>
        </section>

        {/* What is SnapExx */}
        <section  className="mb-16">
          <div className="prose-section">
            <h2 className="section-heading">What Is SnapExx?</h2>
            <p className="section-text">
              SnapExx is an <strong className="text-foreground">AI video generator</strong> that converts any web page
              into a professional video. You provide a URL. The AI analyzes the page — its text, structure, images, and
               — and produces a video that communicates the same message visually.
            </p>
            <p className="section-text">
              It is not screen recording. It is not a slideshow. SnapExx uses advanced AI models to understand
              your content and create a video that feels intentionally produced. Think of it as a{" "}
              <strong className="text-foreground">website to video</strong> converter that actually understands what
              it is reading.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {[
                { icon: Zap, label: "Instant Generation", desc: "URL in, video out" },
                { icon: Globe, label: "Any Web Page", desc: "Blogs, landing pages, docs" },
                { icon: Clock, label: "Minutes, Not Days", desc: "No editing required" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex flex-col items-center text-center p-5 rounded-2xl bg-card border border-border hover:border-accent/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                    <f.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">{f.label}</h4>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section  className="mb-16">
          <div className="prose-section">
            <h2 className="section-heading">How It Works</h2>
            <p className="section-text">The process is straightforward:</p>

            <div className="space-y-4 mt-6">
              {[
                {
                  step: "01",
                  title: "Paste your URL",
                  desc: "Enter the web page you want to convert — a blog post, landing page, product page, or documentation.",
                },
                {
                  step: "02",
                  title: "AI analyzes the content",
                  desc: "SnapExx reads the page structure, extracts key information, identifies images, and understands tone and topic.",
                },
                {
                  step: "03",
                  title: "Video is generated",
                  desc: "The AI produces a polished video — with visuals, text overlays, transitions, and pacing that match the source material.",
                },
                {
                  step: "04",
                  title: "Download or share",
                  desc: "Export your video and use it anywhere — social media, email campaigns, presentations, or your website.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="flex gap-4 p-5 rounded-xl bg-card border border-border hover:border-accent/20 transition-all group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-accent">{s.step}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                      {s.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who Benefits Section */}
        <section  className="mb-16">
          <div className="prose-section">
            <h2 className="section-heading">Who Benefits from SnapExx?</h2>
            <p className="section-text">
              SnapExx is designed for anyone who needs professional video content but does not have the time, budget, or
              technical skills for traditional production. Here is how specific audiences benefit from this{" "}
              <strong className="text-foreground">AI content video tool</strong>.
            </p>
          </div>

          {/* Audience Cards */}
          <div className="space-y-6 mt-10">
            {audienceCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 sm:p-8 transition-colors hover:border-accent/40"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent"
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">{card.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{card.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why It Matters */}
        <section  className="mb-16">
          <div className="prose-section">
            <h2 className="section-heading">Why This Matters Now</h2>
            <p className="section-text">
              The demand for video is accelerating. Platforms like LinkedIn, Instagram, TikTok, and even Google
              increasingly favor video content in their algorithms. Businesses that do not adapt will lose visibility.
            </p>
            <p className="section-text">
              But the supply side has not kept up. Video remains the hardest content type to produce at scale. Tools like
              SnapExx close that gap. By letting you{" "}
              <strong className="text-foreground">convert website to video</strong> with AI, they remove the biggest
              barriers: time, cost, and technical skill.
            </p>
            <p className="section-text">
              This is not about replacing professional videographers. It is about making video accessible to the
              millions of businesses, creators, and marketers who need it but cannot afford traditional production.
            </p>
          </div>
        </section>

        {/* What Makes SnapExx Different */}
        <section  className="mb-16">
          <div className="prose-section">
            <h2 className="section-heading">What Makes SnapExx Different</h2>
            <p className="section-text">
              There are other tools in the AI video space. Some let you create videos from text prompts. Others
              offer template-based editors. SnapExx is different because it starts with your actual web content.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {[
                {
                  title: "Content-aware AI",
                  desc: "SnapExx reads and understands your page — not just the words, but the structure, hierarchy, and intent.",
                },
                {
                  title: "No templates needed",
                  desc: "Videos are generated dynamically based on your content. Every video is unique to your page.",
                },
                {
                  title: "Built for speed",
                  desc: "From URL to finished video in minutes. No drag-and-drop editors. No learning curve.",
                },
                {
                  title: "Multi-purpose output",
                  desc: "Videos work across platforms — social media, websites, email embeds, presentations, and more.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-5 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all"
                >
                  <h4 className="text-sm font-semibold text-foreground mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Memory & Context Section */}
        <section  className="mb-16">
          <div className="prose-section">
            <h2 className="section-heading">How SnapExx Remembers Your Conversations</h2>
            <p className="section-text">
              One of the most important aspects of any <strong className="text-foreground">AI content video tool</strong> is
              how well it understands context. SnapExx is built with intelligent conversation memory — meaning the AI
              does not treat every message as an isolated request. It remembers what you said, what you asked for, and
              what it already delivered.
            </p>
            <p className="section-text">
              When you work inside a SnapExx session, the AI retains the last 30 messages of your conversation. This
              gives it enough context to handle multi-step creative workflows — refining a video concept, adjusting
              tone, iterating on a script — without you having to repeat yourself.
            </p>
          </div>

          {/* Memory cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {[
              {
                icon: MessageSquare,
                label: "30-Message Memory",
                desc: "The AI remembers your last 30 messages for rich, multi-turn creative sessions.",
              },
              {
                icon: Image,
                label: "Live Image Context",
                desc: "Upload an image and the AI sees it in real time — perfect for image-to-video generation.",
              },
              {
                icon: Brain,
                label: "Context-Aware Responses",
                desc: "The AI tracks your creative direction across turns so refinements feel natural and seamless.",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/60 hover:border-accent/40 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-3 text-accent">
                  <card.icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1.5">{card.label}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose-section mt-8">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3">What Does This Mean in Practice?</h3>
            <p className="section-text">
              Suppose you are working on an ad video. You describe the product, the AI suggests a concept, you ask for
              a different hook — all within the same conversation. Because SnapExx remembers the full thread (up to 30
              messages), it does not lose track of your product details or creative preferences. You get coherent,
              iterative collaboration instead of starting from scratch each time.
            </p>
            <p className="section-text">
              For image-based workflows, the AI can see the image you upload in the current message and use it directly
              — whether that means editing a photo, generating a video from it, or analyzing its composition. This is
              what makes SnapExx feel less like a tool and more like a creative partner that pays attention.
            </p>
            <p className="section-text">
              This approach to AI memory is deliberate. A 30-message window keeps responses fast, costs predictable,
              and context sharp — without the latency that comes from processing thousands of messages. It is the right
              balance between remembering enough and staying responsive.
            </p>
          </div>
        </section>

        {/* Final Section */}
        <section  className="mb-12">
          <div className="prose-section">
            <h2 className="section-heading">Getting Started</h2>
            <p className="section-text">
              SnapExx is built to be simple. Sign up, paste a URL, and generate your first video. There are no complex
              settings to configure and no software to install. The AI handles the creative decisions — you keep control
              over the final output.
            </p>
            <p className="section-text">
              Whether you are a solo blogger looking to repurpose written content, a startup founder building your
              first product demo, or a marketing team scaling content production — SnapExx is designed to fit into your
              workflow without adding friction.
            </p>
            <p className="section-text">
              The future of content is video. The future of video creation is AI. SnapExx brings both together in a
              tool that is practical, fast, and built for real work.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-10 p-8 rounded-2xl bg-accent/5 border border-accent/20 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
              Ready to turn your website into video?
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
              Start generating professional videos from any web page — in minutes, not days.
            </p>
            <Link
              to="/home"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white text-sm font-semibold rounded-xl hover:bg-accent/90 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Try SnapExx Now
            </Link>
          </div>
        </section>
      </article>

      <Footer />

      <style>{`
        .section-heading {
          font-size: 1.5rem;
          font-weight: 700;
          color: hsl(var(--foreground));
          margin-bottom: 1rem;
          letter-spacing: -0.015em;
        }
        @media (min-width: 640px) {
          .section-heading {
            font-size: 1.75rem;
          }
        }
        .section-text {
          font-size: 0.975rem;
          line-height: 1.8;
          color: hsl(var(--muted-foreground));
          margin-bottom: 1rem;
        }
        .prose-section {
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default Blog;
