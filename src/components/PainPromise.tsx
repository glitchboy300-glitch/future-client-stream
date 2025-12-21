import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { X, ArrowRight } from "lucide-react";

export function PainPromise() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const painPoints = [
    "They post \"tips\" nobody searches for.",
    "Their hooks lose viewers in 5 seconds.",
    "Their videos don't capture leads.",
    "They get views… and still no clients.",
  ];

  return (
    <section id="results" className="py-20 md:py-32" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12"
          >
            Most founders try YouTube.{" "}
            <span className="text-muted-foreground">Then quit.</span>
          </motion.h2>

          <div className="space-y-4 mb-12">
            {painPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                className="flex items-center gap-4 p-4 rounded-lg bg-destructive/5 border border-destructive/20"
              >
                <X size={20} className="text-destructive flex-shrink-0" />
                <span className="text-foreground">{point}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glass-card p-6 md:p-8 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/50" />
              <ArrowRight className="text-primary" />
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
            <p className="text-lg md:text-xl font-heading font-semibold text-foreground">
              GenSpeak turns YouTube into a{" "}
              <span className="text-gradient">client pipeline</span>.
            </p>
            <p className="text-muted-foreground mt-2">Not a content hobby.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}