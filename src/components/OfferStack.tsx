import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Video, BarChart3 } from "lucide-react";

export function OfferStack() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const offers = [
    {
      icon: Target,
      title: "Positioning + Content Strategy",
      description: "We pick topics that attract buyers, not browsers.",
    },
    {
      icon: Video,
      title: "Weekly Video Production (You Film)",
      description: "We write the script and structure. You record. We edit, package, and publish.",
    },
    {
      icon: BarChart3,
      title: "Lead Capture + Tracking",
      description: "Every video points to an offer. We track clicks, leads, and booked calls.",
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
            If you don't sign new clients in 90 days,{" "}
            <span className="text-primary font-medium">we work for free until you do.</span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}