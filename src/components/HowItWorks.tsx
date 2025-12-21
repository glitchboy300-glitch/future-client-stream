import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Map, Film, TrendingUp, Clock } from "lucide-react";

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: "1",
      title: "Plan",
      description: "We map your niche, offer, and the exact videos that bring buyers.",
      icon: Map,
    },
    {
      number: "2",
      title: "Produce",
      description: "You film from our script. We handle editing, thumbnails, SEO, and upload.",
      icon: Film,
    },
    {
      number: "3",
      title: "Convert",
      description: "We route viewers into a simple funnel that turns attention into calls.",
      icon: TrendingUp,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16"
          >
            How it <span className="text-gradient">works</span>
          </motion.h2>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.15 * (index + 1) }}
                  className="relative"
                >
                  <div className="glass-card p-6 md:p-8 text-center relative z-10">
                    {/* Step Number */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
                      <span className="font-heading text-2xl font-bold text-primary-foreground">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Time Commitment Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 max-w-md mx-auto"
          >
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Clock size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground">
                  <span className="font-medium">Your weekly time:</span> ~60 minutes filming
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Our job:</span> everything else
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}