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
      { text: "1 Prompt-to-Image generation", included: true },
      { text: "2 Photo Enhancements", included: true },
      { text: "1 Compare Pictures session", included: true },
      { text: "1 Professional Portrait", included: true },
      { text: "AI video generation", included: false },
    ],
  },
  {
    tier: "FLEX",
    name: "Weekly Member",
    price: "$4",
    period: "/week",
    buttonLabel: "Choose Pro",
    icon: Shield,
    features: [
      { text: "5 Prompt-to-Image generation", included: true },
      { text: "3 Photo Enhancements", included: true },
      { text: "5 Compare Pictures sessions", included: true },
      { text: "1 Professional Portrait per day", included: true },
      { text: "AI video generation (2 times)", included: true },
    ],
  },
  {
    tier: "POWER",
    name: "Monthly Member",
    price: "$11",
    period: "/mo",
    buttonLabel: "Upgrade Now",
    featured: true,
    icon: Crown,
    features: [
      { text: "Unlimited Prompt-to-Image generation", included: true },
      { text: "Unlimited Photo Enhancements", included: true },
      { text: "Unlimited Compare Pictures sessions", included: true },
      { text: "Unlimited Professional Portraits", included: true },
      { text: "AI video generation (2/day)", included: true },
    ],
  },
];

const comparisonData = [
  { feature: "Prompt-to-Image generation", free: "1 use", pro: "5/ Week", power: "Unlimited" },
  { feature: "Photo Enhancements", free: "2 uses ", pro: "3/ Week", power: "Unlimited" },
  { feature: "Compare Pictures sessions", free: "1 use", pro: "5/ Week", power: "Unlimited" },
  { feature: "Professional Portraits", free: "1 use", pro: "1/ Day", power: "Unlimited" },
  { feature: "AI video generation", free: false, pro: "2/ Week", power: "2/ Day" },
  { feature: "Priority Support", free: "Community", pro: "Email 24*7", power: "Dedicated" },
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
      <div
                                   className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div  className="mb-6 sm:mb-8">
          <p className="text-xs font-bold tracking-widest text-accent uppercase mb-2">
            SNAPEXX ECOSYSTEM
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2">
            Premium Subscription Plans
          </h1>
          <p className="text-muted-foreground max-w-lg text-sm sm:text-base leading-relaxed">
            Elevate your professional workflow with SnapExx's AI tools. 
            Choose the plan that scales with your creativity.
          </p>
        </div>

        {/* here this banner starts */}
        {/* Launch Offer Card */}
        <div
                                           className="mb-8 sm:mb-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-red-400 to-pink-400 opacity-75 blur-lg" />
          <div className="relative bg-gradient-to-br from-purple-500 via-red-400 to-pink-500 rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20">
            <div className="absolute top-0 right-0 opacity-10 text-8xl">✨</div>
            
            <div className="flex items-center gap-4 sm:gap-6 relative z-10">
              <div
                                                  className="flex-shrink-0 text-5xl sm:text-6xl"
              >
                🎯
              </div>
              
              <div className="flex-1">
                <p 
                                                                           className="text-xs sm:text-sm font-bold tracking-widest text-white/90 uppercase mb-2"
                >
                  🎉 Special Launch Offer
                </p>
                <h3 
                                                                           className="text-2xl sm:text-4xl font-extrabold text-white mb-1"
                >
                  Unlimited Credits
                </h3>
                <p 
                                                                           className="text-sm sm:text-base text-white/90 font-medium"
                >
                  You have unlimited credits to explore all features
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* here this banner ends */}

        {/* Pricing Cards */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
                   >
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div 
                key={plan.name}
                                                                   className={cn(
                  "rounded-2xl p-5 sm:p-6 relative",
                  plan.featured 
                    ? "bg-blue-50 text-blue-900 shadow-lg ring-1 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-100 dark:ring-blue-700/40" 
                    : "bg-card border border-border"
                )}
              >
                {plan.featured && (
                  <div 
                    className="absolute -top-3 left-1/2 -translate-x-1/2"
                                                                                 >
                    <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full whitespace-nowrap">
                      ⭐ RECOMMENDED
                    </span>
                  </div>
                )}

                <div className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4",
                  plan.featured ? "bg-blue-100 dark:bg-blue-800/30" : "bg-secondary"
                )}>
                  <Icon className={cn(
                    "w-5 h-5 sm:w-6 sm:h-6",
                    plan.featured ? "text-blue-600 dark:text-blue-200" : "text-accent"
                  )} />
                </div>

                <p className={cn(
                  "text-xs font-bold tracking-widest mb-1 uppercase",
                  plan.featured ? "text-blue-700 dark:text-blue-200/80" : "text-accent"
                )}>
                  {plan.tier}
                </p>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{plan.name}</h3>
                
                <div className="flex items-baseline gap-1 mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-4xl font-extrabold">{plan.price}</span>
                  <span className={cn(
                    "text-sm font-medium",
                    plan.featured ? "text-blue-700/80 dark:text-blue-200/70" : "text-muted-foreground"
                  )}>
                    {plan.period}
                  </span>
                </div>

                <button 
                  className={cn(
                    "w-full py-2.5 sm:py-3 rounded-xl font-bold mb-4 sm:mb-6 text-sm sm:text-base transition-all duration-300",
                    plan.featured 
                      ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400" 
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  )}
                                                      >
                  {plan.buttonLabel}
                </button>

                <ul className="space-y-2 sm:space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li 
                      key={idx} 
                      className="flex items-center gap-2 text-xs sm:text-sm font-medium"
                                                                                         >
                      {feature.included ? (
                        <Check className={cn("w-4 h-4 flex-shrink-0", plan.featured ? "text-blue-600 dark:text-blue-200" : "text-accent")} />
                      ) : (
                        <X className={cn(
                          "w-4 h-4 flex-shrink-0",
                          plan.featured ? "text-blue-200/70 dark:text-blue-200/40" : "text-muted-foreground"
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
            );
          })}
        </div>

        {/* Detailed Comparison Table */}
        <div  className="card-elevated overflow-hidden">
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
                        ? (row.free ? <Check className="w-4 h-4 text-accent" /> : <X className="w-4 h-4 text-muted-foreground" />)
                        : row.free
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Pro</p>
                    <p className="font-medium">
                      {typeof row.pro === 'boolean' 
                        ? (row.pro ? <Check className="w-4 h-4 text-accent" /> : <X className="w-4 h-4 text-muted-foreground" />)
                        : row.pro
                      }
                    </p>
                  </div>
                  <div className="text-blue-700 dark:text-blue-200">
                    <p className="text-blue-700/70 dark:text-blue-200/70 mb-1">Power</p>
                    <p className="font-bold">
                      {typeof row.power === 'boolean' 
                        ? (row.power ? <Check className="w-4 h-4 text-blue-600 dark:text-blue-200" /> : <X className="w-4 h-4 text-blue-200/70 dark:text-blue-200/40" />)
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
                  <th className="text-left p-3 sm:p-4 font-bold text-xs sm:text-sm bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200">POWER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparisonData.map((row, idx) => (
                  <tr 
                    key={idx}
                                                                                                        className="hover:bg-secondary/30 transition-colors duration-300"
                  >
                    <td className="p-3 sm:p-4 font-semibold text-xs sm:text-sm">{row.feature}</td>
                    <td className="p-3 sm:p-4 text-muted-foreground font-medium text-xs sm:text-sm">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent" /> : <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                      ) : row.free}
                    </td>
                    <td className="p-3 sm:p-4 font-medium text-xs sm:text-sm">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent" /> : <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                      ) : row.pro}
                    </td>
                    <td className="p-3 sm:p-4 bg-blue-50 text-blue-700 font-bold text-xs sm:text-sm dark:bg-blue-900/20 dark:text-blue-200">
                      {typeof row.power === 'boolean' ? (
                        row.power ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-200" /> : <X className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200/70 dark:text-blue-200/40" />
                      ) : row.power}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 sm:p-4 text-center text-xs text-muted-foreground border-t border-border font-medium">
            <span className="block sm:inline">Unlock Premium</span>
            <span className="hidden sm:inline mx-2">•</span>
            <span className="block sm:inline">Pro</span>
            <span className="hidden sm:inline mx-2">•</span>
            <span className="block sm:inline">Power</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Premium;
