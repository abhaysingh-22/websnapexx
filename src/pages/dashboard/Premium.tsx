import { motion } from "framer-motion";
import { Check, X, Crown, Zap, Shield } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { cn } from "@/lib/utils";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  tier: string;
  name: string;
  price: string;
  period: string;
  buttonLabel: string;
  features: PlanFeature[];
  featured?: boolean;
  icon: typeof Crown;
}

const plans: PricingPlan[] = [
  {
    tier: "BASIC",
    name: "Free Starter",
    price: "$0",
    period: "/mo",
    buttonLabel: "Get Started",
    icon: Zap,
    features: [
      { text: "Standard AI Models", included: true },
      { text: "Standard Resolution", included: true },
      { text: "Watermarked Exports", included: true },
      { text: "No Commercial License", included: false },
    ],
  },
  {
    tier: "FLEX",
    name: "Pro Weekly",
    price: "$19",
    period: "/week",
    buttonLabel: "Choose Pro",
    icon: Shield,
    features: [
      { text: "Advanced AI Access", included: true },
      { text: "4K Ultra HD Exports", included: true },
      { text: "Priority Processing", included: true },
      { text: "Commercial Usage", included: true },
    ],
  },
  {
    tier: "POWER",
    name: "Pro Monthly",
    price: "$49",
    period: "/mo",
    buttonLabel: "Upgrade Now",
    featured: true,
    icon: Crown,
    features: [
      { text: "Unlimited Generations", included: true },
      { text: "Enterprise Grade Models", included: true },
      { text: "Batch Processing (Unlimited)", included: true },
      { text: "24/7 Priority Support", included: true },
    ],
  },
];

const comparisonData = [
  { feature: "AI Model Access", free: "Standard v1", pro: "Advanced v4.2", power: "Enterprise RAW" },
  { feature: "Export Quality", free: "720p", pro: "4K HD", power: "8K RAW" },
  { feature: "Batch Processing", free: "N/A", pro: "10/session", power: "Unlimited" },
  { feature: "Cloud Storage", free: "1GB", pro: "50GB", power: "500GB" },
  { feature: "Commercial Rights", free: false, pro: true, power: true },
  { feature: "Priority Support", free: "Community", pro: "Email 24h", power: "Dedicated" },
];

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

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6 },
  },
};

const Premium = () => {
  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <p className="text-xs font-bold tracking-widest text-accent uppercase mb-2">
            NEXTERA ECOSYSTEM
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2">
            Premium Subscription Plans
          </h1>
          <p className="text-muted-foreground max-w-lg text-sm sm:text-base leading-relaxed">
            Elevate your professional workflow with NextEra's futuristic AI tools. 
            Choose the plan that scales with your creativity.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
          variants={containerVariants}
        >
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <motion.div 
                key={plan.name}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "rounded-2xl p-5 sm:p-6 relative",
                  plan.featured 
                    ? "bg-primary text-primary-foreground shadow-xl ring-2 ring-accent" 
                    : "bg-card border border-border"
                )}
              >
                {plan.featured && (
                  <motion.div 
                    className="absolute -top-3 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full whitespace-nowrap">
                      ⭐ RECOMMENDED
                    </span>
                  </motion.div>
                )}

                <div className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4",
                  plan.featured ? "bg-accent/20" : "bg-secondary"
                )}>
                  <Icon className={cn(
                    "w-5 h-5 sm:w-6 sm:h-6",
                    plan.featured ? "text-accent" : "text-accent"
                  )} />
                </div>

                <p className={cn(
                  "text-xs font-bold tracking-widest mb-1 uppercase",
                  plan.featured ? "text-primary-foreground/70" : "text-accent"
                )}>
                  {plan.tier}
                </p>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{plan.name}</h3>
                
                <div className="flex items-baseline gap-1 mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-4xl font-extrabold">{plan.price}</span>
                  <span className={cn(
                    "text-sm font-medium",
                    plan.featured ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {plan.period}
                  </span>
                </div>

                <motion.button 
                  className={cn(
                    "w-full py-2.5 sm:py-3 rounded-xl font-bold mb-4 sm:mb-6 text-sm sm:text-base transition-all duration-300",
                    plan.featured 
                      ? "bg-accent text-accent-foreground hover:bg-accent/90" 
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.buttonLabel}
                </motion.button>

                <ul className="space-y-2 sm:space-y-3">
                  {plan.features.map((feature, idx) => (
                    <motion.li 
                      key={idx} 
                      className="flex items-center gap-2 text-xs sm:text-sm font-medium"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                    >
                      {feature.included ? (
                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                      ) : (
                        <X className={cn(
                          "w-4 h-4 flex-shrink-0",
                          plan.featured ? "text-primary-foreground/50" : "text-muted-foreground"
                        )} />
                      )}
                      <span className={cn(
                        !feature.included && !plan.featured && "text-muted-foreground"
                      )}>
                        {feature.text}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Detailed Comparison Table */}
        <motion.div variants={itemVariants} className="card-elevated overflow-hidden">
          <h2 className="text-xl sm:text-2xl font-bold text-center py-4 sm:py-6">Detailed Comparison</h2>
          
          {/* Mobile Comparison Cards */}
          <div className="block sm:hidden p-4 space-y-4">
            {comparisonData.map((row, idx) => (
              <div key={idx} className="bg-secondary/50 rounded-xl p-4">
                <p className="font-semibold text-sm mb-3">{row.feature}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground mb-1">Free</p>
                    <p className="font-medium">
                      {typeof row.free === 'boolean' 
                        ? (row.free ? <Check className="w-4 h-4 text-accent" /> : "—")
                        : row.free
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Pro</p>
                    <p className="font-medium">
                      {typeof row.pro === 'boolean' 
                        ? (row.pro ? <Check className="w-4 h-4 text-accent" /> : "—")
                        : row.pro
                      }
                    </p>
                  </div>
                  <div className="text-accent">
                    <p className="text-accent/70 mb-1">Power</p>
                    <p className="font-bold">
                      {typeof row.power === 'boolean' 
                        ? (row.power ? <Check className="w-4 h-4 text-accent" /> : "—")
                        : row.power
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="text-left p-3 sm:p-4 font-bold text-xs sm:text-sm">FEATURE</th>
                  <th className="text-left p-3 sm:p-4 font-bold text-xs sm:text-sm">FREE</th>
                  <th className="text-left p-3 sm:p-4 font-bold text-xs sm:text-sm">PRO</th>
                  <th className="text-left p-3 sm:p-4 bg-accent/10 font-bold text-xs sm:text-sm">POWER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparisonData.map((row, idx) => (
                  <motion.tr 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="hover:bg-secondary/30 transition-colors duration-300"
                  >
                    <td className="p-3 sm:p-4 font-semibold text-xs sm:text-sm">{row.feature}</td>
                    <td className="p-3 sm:p-4 text-muted-foreground font-medium text-xs sm:text-sm">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent" /> : <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-muted block" />
                      ) : row.free}
                    </td>
                    <td className="p-3 sm:p-4 font-medium text-xs sm:text-sm">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent" /> : <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-muted block" />
                      ) : row.pro}
                    </td>
                    <td className="p-3 sm:p-4 bg-accent/5 text-accent font-bold text-xs sm:text-sm">
                      {typeof row.power === 'boolean' ? (
                        row.power ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent" /> : <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-muted block" />
                      ) : row.power}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 sm:p-4 text-center text-xs text-muted-foreground border-t border-border font-medium">
            <span className="block sm:inline">* All prices in USD</span>
            <span className="hidden sm:inline mx-2">•</span>
            <span className="block sm:inline">Cancel anytime</span>
            <span className="hidden sm:inline mx-2">•</span>
            <span className="block sm:inline">Commercial license: Pro tiers only</span>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Premium;
