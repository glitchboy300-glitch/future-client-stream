import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Play } from "lucide-react";

const videos = [
  { id: "zv03UY4k5UE", title: "How to Generate 30 Winning Ad Angles in 1 Hour" },
  { id: "0SdJjuKroBs", title: "13 OpenClaw Skills I Can't Live Without" },
  { id: "u6R8no74vzg", title: "The NEW AI Second Brain That Replaces Obsidian" },
  { id: "G3ZqeGHmg7k", title: "How a Cannabis Dispensary Generated $922K Using SEO" },
  { id: "iUfCpDYxjjA", title: "Watch me Generate Unlimited Leads Using Claude Code" },
  { id: "xWUMt3HcMY0", title: "My Lead Generation Strategy Is Boring, But It Booked Me 200+ Sales Calls" },
];

export function OurWork() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState<string[]>([]);

  return (
    <section id="our-work" className="py-20 md:py-32" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4"
          >
            Videos we've made for{" "}
            <span className="text-gradient">clients</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center text-muted-foreground mb-16 max-w-xl mx-auto"
          >
            A few of the videos we've produced, edited, and shipped for the
            businesses we work with.
          </motion.p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((video, index) => {
              const isActive = active.includes(video.id);
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.05 * (index + 1) }}
                  className="glass-card overflow-hidden group"
                >
                  <div className="relative aspect-video">
                    {isActive ? (
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
                        title={`${video.title} (client video produced by GenSpeak)`}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActive((prev) => [...prev, video.id])}
                        aria-label={`Play video: ${video.title}`}
                        className="absolute inset-0 w-full h-full cursor-pointer"
                      >
                        <img
                          src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                          alt={`Thumbnail of client YouTube video produced by GenSpeak: ${video.title}`}
                          width={480}
                          height={360}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute inset-0 bg-background/30 transition-colors group-hover:bg-background/10" />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 shadow-lg transition-transform group-hover:scale-110">
                            <Play
                              size={26}
                              className="ml-1 text-primary-foreground"
                              fill="currentColor"
                            />
                          </span>
                        </span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
