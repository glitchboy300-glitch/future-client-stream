import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Lightbulb, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
interface FinalCTAProps {
  onOpenLeadMagnet: () => void;
}
export function FinalCTA({
  onOpenLeadMagnet
}: FinalCTAProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px"
  });
  return <section className="py-20 md:py-32" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={isInView ? {
          opacity: 1,
          y: 0
        } : {}} transition={{
          duration: 0.6
        }} className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              If you want clients, you need{" "}
              <span className="text-gradient">attention</span>.
            </h2>
            <p className="text-xl text-muted-foreground">
              If you want attention, you need a{" "}
              <span className="text-foreground font-medium">system</span>.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Book a Call Card */}
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} animate={isInView ? {
            opacity: 1,
            x: 0
          } : {}} transition={{
            duration: 0.6,
            delay: 0.2
          }} className="glass-card p-8 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
                  <Calendar size={24} className="text-primary-foreground" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                  Book a Call
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Walk away with a custom 90-day content plan.
                </p>
                <Button variant="hero" className="w-full" asChild>
                  <a href="https://calendly.com/muawaz-genspeak/30min" target="_blank" rel="noopener noreferrer">
                    Book a Call
                    <ArrowRight size={18} />
                  </a>
                </Button>
              </div>
            </motion.div>

            {/* Lead Magnet Card */}
            <motion.div initial={{
            opacity: 0,
            x: 30
          }} animate={isInView ? {
            opacity: 1,
            x: 0
          } : {}} transition={{
            duration: 0.6,
            delay: 0.3
          }} className="glass-card p-8 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center mb-6 shadow-lg shadow-secondary/30">
                  <Lightbulb size={24} className="text-primary-foreground" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">25 video ideas in your niche</h3>
                <p className="text-sm text-muted-foreground mb-6">Get 25 proven video concepts, tailored for your niche
              </p>
                <Button variant="glass" className="w-full" data-tally-open="RGdZzj">
                  Get Free Ideas
                  <ArrowRight size={18} />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>;
}
