import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
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
}

const plans: PricingPlan[] = [
  {
    tier: "BASIC",
    name: "Free Starter",
    price: "$0",
    period: "/mo",
    buttonLabel: "Get Started",
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
  { feature: "Export Quality", free: "720p (Compressed)", pro: "4K High Definition", power: "8K Lossless RAW" },
  { feature: "Batch Processing", free: "UNAVAILABLE", pro: "Up to 10/session", power: "Unlimited Concurrent" },
  { feature: "Cloud Storage", free: "1GB Shared", pro: "50GB Dedicated", power: "500GB SSD Vault" },
  { feature: "Commercial Rights", free: false, pro: true, power: true },
  { feature: "Priority Support", free: "Community Only", pro: "Email (24h)", power: "Dedicated Manager" },
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
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Premium = () => {
  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-accent uppercase mb-2">
              NEXTERA ECOSYSTEM
            </p>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-extrabold">Premium Subscription Plans</h1>
              <motion.button 
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Detailed Comparison
              </motion.button>
            </div>
            <p className="text-muted-foreground mt-2 max-w-lg leading-relaxed">
              Elevate your professional workflow with NextEra's futuristic AI tools. 
              Choose the plan that scales with your creativity.
            </p>
          </div>
          <motion.button 
            className="btn-outline text-sm font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            View Enterprise Plans
          </motion.button>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
        >
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.name}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "rounded-2xl p-6 relative",
                plan.featured 
                  ? "bg-primary text-primary-foreground shadow-xl" 
                  : "bg-card border border-border"
              )}
            >
              {plan.featured && (
                <motion.div 
                  className="absolute -top-3 right-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full pulse-subtle">
                    RECOMMENDED
                  </span>
                </motion.div>
              )}

              <p className={cn(
                "text-xs font-bold tracking-widest mb-1 uppercase",
                plan.featured ? "text-primary-foreground/70" : "text-accent"
              )}>
                {plan.tier}
              </p>
              <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className={cn(
                  "text-sm font-medium",
                  plan.featured ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  {plan.period}
                </span>
              </div>

              <motion.button 
                className={cn(
                  "w-full py-3 rounded-xl font-bold mb-6 transition-all duration-300",
                  plan.featured 
                    ? "bg-accent text-accent-foreground hover:bg-accent/90" 
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {plan.buttonLabel}
              </motion.button>

              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <motion.li 
                    key={idx} 
                    className="flex items-center gap-2 text-sm font-medium"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                  >
                    {feature.included ? (
                      <Check className={cn(
                        "w-4 h-4",
                        plan.featured ? "text-accent" : "text-accent"
                      )} />
                    ) : (
                      <X className={cn(
                        "w-4 h-4",
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
          ))}
        </motion.div>

        {/* Detailed Comparison Table */}
        <motion.div variants={itemVariants} className="card-elevated overflow-hidden">
          <h2 className="text-2xl font-bold text-center py-6">Detailed Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="text-left p-4 font-bold">FEATURE</th>
                  <th className="text-left p-4 font-bold">FREE STARTER</th>
                  <th className="text-left p-4 font-bold">PRO WEEKLY</th>
                  <th className="text-left p-4 bg-accent/10 font-bold">PRO MONTHLY</th>
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
                    <td className="p-4 font-semibold">{row.feature}</td>
                    <td className="p-4 text-muted-foreground font-medium">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="w-5 h-5 text-accent" /> : <span className="w-5 h-5 rounded-full bg-muted block" />
                      ) : (
                        row.free === "UNAVAILABLE" ? (
                          <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs font-bold rounded">
                            {row.free}
                          </span>
                        ) : row.free
                      )}
                    </td>
                    <td className="p-4 font-medium">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="w-5 h-5 text-accent" /> : <span className="w-5 h-5 rounded-full bg-muted block" />
                      ) : row.pro}
                    </td>
                    <td className="p-4 bg-accent/5 text-accent font-bold">
                      {typeof row.power === 'boolean' ? (
                        row.power ? <Check className="w-5 h-5 text-accent" /> : <span className="w-5 h-5 rounded-full bg-muted block" />
                      ) : row.power}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 text-center text-xs text-muted-foreground border-t border-border font-medium">
            <span>* All prices are in USD</span>
            <span className="mx-4">* Cancel subscription anytime from your dashboard</span>
            <span>* Commercial license applies to Pro tiers only</span>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Premium;
