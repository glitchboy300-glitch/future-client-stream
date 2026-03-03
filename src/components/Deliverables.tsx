import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Youtube,
  CalendarDays,
  Video,
  Image,
  Search,
  FileText,
  BarChart2,
  FileSpreadsheet,
  Smartphone,
  Mail,
  PenSquare,
  Gift,
} from "lucide-react";

export function Deliverables() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const deliverables = [
    {
      icon: Youtube,
      title: "Authority YouTube Content",
      tag: "scripted, edited, SEO optimized",
    },
    {
      icon: Smartphone,
      title: "Short-Form Video Content",
      tag: "TikTok, Instagram & YouTube Shorts",
    },
    {
      icon: PenSquare,
      title: "LinkedIn & X Written Posts",
      tag: "repurposed from your video content",
    },
    {
      icon: Gift,
      title: "Lead Magnets",
      tag: "researched, written & designed",
    },
    {
      icon: FileText,
      title: "Opt-In Pages",
      tag: "built to convert viewers into leads",
    },
    {
      icon: Mail,
      title: "Email Funnel Automation",
      tag: "nurture sequences that book calls",
    },
    {
      icon: Image,
      title: "Thumbnails + Graphics",
      tag: "high CTR style",
    },
    {
      icon: Search,
      title: "Video SEO & Optimization",
      tag: "title, description, tags, playlists",
    },
    {
      icon: CalendarDays,
      title: "Competitor Research & Strategy",
      tag: "ongoing content strategy",
    },
    {
      icon: BarChart2,
      title: "Lead Tracking Dashboard",
      tag: "ongoing",
    },
    {
      icon: Youtube,
      title: "YouTube Funnel Buildout",
      tag: "channel setup & branding",
    },
    {
      icon: FileSpreadsheet,
      title: "Monthly Performance Report",
      tag: "clear numbers + next steps",
    },
  ];

  return (
    <section id="what-you-get" className="py-20 md:py-32" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4"
          >
            What you <span className="text-gradient">get</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center text-muted-foreground mb-16 max-w-xl mx-auto"
          >
            You're not buying videos. You're buying a complete, done-for-you client acquisition system.
          </motion.p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {deliverables.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.05 * (index + 1) }}
                className="glass-card-hover p-5 group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-primary/10">
                  <item.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-heading text-sm font-semibold text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground">{item.tag}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center text-sm text-muted-foreground mt-10 max-w-md mx-auto"
          >
            Everything is built to answer one question:{" "}
            <span className="text-foreground font-medium">
              "Did this bring clients?"
            </span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
