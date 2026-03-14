import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Check, Play, Users, Phone } from "lucide-react";
import { useEffect } from "react";

interface HeroProps {
  onOpenLeadMagnet: () => void;
}

export function Hero({ onOpenLeadMagnet }: HeroProps) {
  useEffect(() => {
    // Inject Wistia player scripts if not already present
    if (!document.querySelector('script[src="https://fast.wistia.com/player.js"]')) {
      const playerScript = document.createElement("script");
      playerScript.src = "https://fast.wistia.com/player.js";
      playerScript.async = true;
      document.head.appendChild(playerScript);
    }

    if (!document.querySelector('script[src="https://fast.wistia.com/embed/m9gt6j55n2.js"]')) {
      const embedScript = document.createElement("script");
      embedScript.src = "https://fast.wistia.com/embed/m9gt6j55n2.js";
      embedScript.async = true;
      embedScript.type = "module";
      document.head.appendChild(embedScript);
    }

    if (!document.querySelector("style[data-wistia-m9gt6j55n2]")) {
      const style = document.createElement("style");
      style.setAttribute("data-wistia-m9gt6j55n2", "true");
      style.textContent = `wistia-player[media-id='m9gt6j55n2']:not(:defined) { background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/m9gt6j55n2/swatch'); display: block; filter: blur(5px); padding-top:56.25%; }`;
      document.head.appendChild(style);
    }
  }, []);

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
              Done-for-you YouTube authority system for agencies & B2B businesses
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Add 20+ qualified sales calls{" "}
            <span className="text-gradient glow-text">every month</span>
            <br />
            with a done-for-you YouTube system.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            <span className="text-foreground font-medium">You film for 2 hours a month. We do everything else.</span>
            <br />
            YouTube videos, short-form content, LinkedIn posts, lead magnets, and email funnels — all done for you.
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
             <Button variant="glass" size="xl" data-tally-open="RGdZzj">
  Get 25 Video Ideas
  <ArrowRight size={20} />
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
              { icon: Users, text: "Built for agencies & B2B service businesses" },
              { icon: Phone, text: "20 qualified calls/month — guaranteed" },
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

        {/* VSL — Wistia Video */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              boxShadow: "0 0 40px hsl(189 100% 70% / 0.15), 0 0 80px hsl(263 86% 76% / 0.1)",
              border: "1px solid hsl(0 0% 100% / 0.1)",
            }}
          >
            {/* @ts-ignore */}
            <wistia-player media-id="m9gt6j55n2" aspect="1.7777777777777777"></wistia-player>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
