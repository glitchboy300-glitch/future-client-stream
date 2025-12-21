import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Check, Play, TrendingUp, Users, Phone } from "lucide-react";

interface HeroProps {
  onOpenLeadMagnet: () => void;
}

export function Hero({ onOpenLeadMagnet }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
          >
            <Play size={14} className="text-primary" />
            <span className="text-sm text-muted-foreground">
              Done-for-you YouTube acquisition for service businesses
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Sign new clients from{" "}
            <span className="text-gradient glow-text">YouTube</span>
            <br />
            in 90 days.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            <span className="text-foreground font-medium">You film. We do everything else.</span>
            <br />
            Strategy, scripts, editing, thumbnails, SEO, publishing, lead capture, tracking.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            <div className="flex flex-col items-center">
              <Button variant="hero" size="xl" asChild>
                <a href="https://calendly.com/muawaz-genspeak/30min" target="_blank" rel="noopener noreferrer">
                  Book a Call
                  <ArrowRight size={20} />
                </a>
              </Button>
              <span className="text-xs text-muted-foreground mt-2">
                15 minutes. If it's not a fit, I'll tell you.
              </span>
            </div>

            <div className="flex flex-col items-center">
             <Button variant="glass" size="xl" onClick={() => window.open('https://tally.so/r/RGdZzj', '_blank')}>
              </Button>
              <span className="text-xs text-muted-foreground mt-2">
                Tell me your niche. I'll send ideas you can post this week.
              </span>
            </div>
          </motion.div>

          {/* Mini Proof Points */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12"
          >
            {[
              { icon: Check, text: "Done-for-you system" },
              { icon: Users, text: "Built for service businesses" },
              { icon: Phone, text: "Work free until you win" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <item.icon size={16} className="text-primary" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Client Acquisition Pipeline
              </h3>
              <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary">
                Live Dashboard
              </span>
            </div>

            {/* Pipeline Steps */}
            <div className="grid grid-cols-4 gap-2 md:gap-4 mb-6">
              {[
                { label: "Views", value: "24.5K", trend: "+18%" },
                { label: "Leads", value: "847", trend: "+24%" },
                { label: "Calls", value: "156", trend: "+31%" },
                { label: "Clients", value: "23", trend: "+42%" },
              ].map((step, index) => (
                <div
                  key={index}
                  className="relative p-3 md:p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <p className="text-xs text-muted-foreground mb-1">{step.label}</p>
                  <p className="font-heading text-lg md:text-2xl font-bold text-foreground">
                    {step.value}
                  </p>
                  <span className="text-xs text-primary">{step.trend}</span>
                  {index < 3 && (
                    <ArrowRight
                      size={16}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-primary/50 hidden md:block"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Animated Line Graph Placeholder */}
            <div className="h-24 relative">
              <svg className="w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(189 100% 70%)" />
                    <stop offset="100%" stopColor="hsl(263 86% 76%)" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="hsl(189 100% 70% / 0.3)" />
                    <stop offset="100%" stopColor="hsl(189 100% 70% / 0)" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,60 C50,55 80,50 120,40 C160,30 200,35 240,25 C280,15 320,20 360,10 L400,5"
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  className="animate-fade-in"
                />
                <path
                  d="M0,60 C50,55 80,50 120,40 C160,30 200,35 240,25 C280,15 320,20 360,10 L400,5 L400,80 L0,80 Z"
                  fill="url(#areaGradient)"
                  className="animate-fade-in"
                />
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                <span>Week 1</span>
                <span>Week 12</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
