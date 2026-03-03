import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuaranteeProps {
  onOpenLeadMagnet: () => void;
}

export function Guarantee({ onOpenLeadMagnet }: GuaranteeProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const clarifiers = [
    "You show up and film; we handle the rest.",
    "We build and manage your entire content-to-call pipeline.",
    "If you don't see 20 new qualified calls on your calendar, we work for free until you do.",
  ];

  return (
    <section id="guarantee" className="py-20 md:py-32" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12"
          >
            The <span className="text-gradient">guarantee</span>
          </motion.h2>

          {/* Main Guarantee Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-2xl blur-xl" />
            <div className="glass-card p-8 md:p-12 relative neon-border">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/40">
                  <Shield size={32} className="text-primary-foreground" />
                </div>
              </div>

              <p className="font-heading text-xl md:text-2xl lg:text-3xl font-bold text-center text-foreground mb-8">
                We guarantee to ADD 20 qualified sales calls per month using YouTube as your authority channel —{" "}
                <span className="text-gradient">
                  or we refund everything and work for free until you do.
                </span>
              </p>

              <div className="space-y-3 max-w-md mx-auto">
                {clarifiers.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <Check
                      size={18}
                      className="text-primary flex-shrink-0 mt-0.5"
                    />
                    <span className="text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <Button variant="neon" size="lg" asChild>
              <a
                href="https://calendly.com/muawaz-genspeak/30min"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a Call
                <ArrowRight size={18} />
              </a>
            </Button>
            <Button variant="glass" size="lg" onClick={onOpenLeadMagnet}>
              Get 25 Video Ideas
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}