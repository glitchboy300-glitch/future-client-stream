import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Video, BarChart3, Globe2 } from "lucide-react";

export function OfferStack() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const offers = [
    {
      icon: Target,
      title: "Authority YouTube Channel",
      description: "We build your YouTube channel into an authority platform that attracts your ideal clients and pre-sells them on working with you before they ever get on a call.",
    },
    {
      icon: Globe2,
      title: "Multi-Platform Content System",
      description: "We turn your YouTube videos into a full content system — short-form videos for TikTok, Instagram, and YouTube Shorts, plus written posts for LinkedIn & X to maximize your reach.",
    },
    {
      icon: BarChart3,
      title: "Automated Client Pipeline",
      description: "We convert your audience into qualified sales calls with custom lead magnets, opt-in pages, and automated email sequences that nurture leads and book appointments on autopilot.",
    },
  ];

  return (
    <section className="py-20 md:py-32" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              The YouTube Client System{" "}
              <span className="text-gradient">(Done-For-You)</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              You're not buying videos.{" "}
              <span className="text-foreground font-medium">You're buying new clients.</span>
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {offers.map((offer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                className="glass-card-hover p-6 md:p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 border border-primary/20">
                  <offer.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                  {offer.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {offer.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center text-sm text-muted-foreground mt-8"
          >
            If you don't see 20 qualified sales calls on your calendar,{" "}
            <span className="text-primary font-medium">we work for free until you do.</span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}