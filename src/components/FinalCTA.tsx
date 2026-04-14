import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinalCTAProps {
  onOpenLeadMagnet: () => void;
}

export function FinalCTA({ onOpenLeadMagnet }: FinalCTAProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-32" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              If you want clients, you need{" "}
              <span className="text-gradient">attention</span>.
            </h2>
            <p className="text-xl text-muted-foreground">
              If you want attention, you need a{" "}
              <span className="text-foreground font-medium">system</span>.
            </p>
          </motion.div>

          {/* Book a Call Card — centered, full width */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-lg shadow-primary/30 mx-auto">
                <Calendar size={24} className="text-primary-foreground" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                Book a Call
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Walk away with a custom content plan built around your business.
              </p>
              <Button variant="hero" className="w-full" asChild>
                <a href="https://tally.so/r/b58pL1" target="_blank" rel="noopener noreferrer">
                  Book a Call
                  <ArrowRight size={18} />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
