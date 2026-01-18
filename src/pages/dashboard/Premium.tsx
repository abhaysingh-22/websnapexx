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

const Premium = () => {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-accent mb-2">
              NEXTERA ECOSYSTEM
            </p>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">Premium Subscription Plans</h1>
              <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg">
                Detailed Comparison
              </button>
            </div>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Elevate your professional workflow with NextEra's futuristic AI tools. 
              Choose the plan that scales with your creativity.
            </p>
          </div>
          <button className="btn-outline text-sm">
            View Enterprise Plans
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={cn(
                "rounded-2xl p-6 relative",
                plan.featured 
                  ? "bg-primary text-primary-foreground shadow-xl" 
                  : "bg-card border border-border"
              )}
            >
              {plan.featured && (
                <div className="absolute -top-3 right-4">
                  <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                    RECOMMENDED
                  </span>
                </div>
              )}

              <p className={cn(
                "text-xs font-semibold tracking-widest mb-1",
                plan.featured ? "text-primary-foreground/70" : "text-accent"
              )}>
                {plan.tier}
              </p>
              <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={cn(
                  "text-sm",
                  plan.featured ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  {plan.period}
                </span>
              </div>

              <button className={cn(
                "w-full py-3 rounded-xl font-medium mb-6",
                plan.featured 
                  ? "bg-accent text-accent-foreground" 
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              )}>
                {plan.buttonLabel}
              </button>

              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
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
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Detailed Comparison Table */}
        <div className="card-elevated overflow-hidden">
          <h2 className="text-2xl font-bold text-center py-6">Detailed Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="text-left p-4">FEATURE</th>
                  <th className="text-left p-4">FREE STARTER</th>
                  <th className="text-left p-4">PRO WEEKLY</th>
                  <th className="text-left p-4 bg-accent/10">PRO MONTHLY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparisonData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4 text-muted-foreground">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="w-5 h-5 text-accent" /> : <span className="w-5 h-5 rounded-full bg-muted block" />
                      ) : (
                        row.free === "UNAVAILABLE" ? (
                          <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs font-medium rounded">
                            {row.free}
                          </span>
                        ) : row.free
                      )}
                    </td>
                    <td className="p-4">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="w-5 h-5 text-accent" /> : <span className="w-5 h-5 rounded-full bg-muted block" />
                      ) : row.pro}
                    </td>
                    <td className="p-4 bg-accent/5 text-accent font-medium">
                      {typeof row.power === 'boolean' ? (
                        row.power ? <Check className="w-5 h-5 text-accent" /> : <span className="w-5 h-5 rounded-full bg-muted block" />
                      ) : row.power}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 text-center text-xs text-muted-foreground border-t border-border">
            <span>* All prices are in USD</span>
            <span className="mx-4">* Cancel subscription anytime from your dashboard</span>
            <span>* Commercial license applies to Pro tiers only</span>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Premium;
