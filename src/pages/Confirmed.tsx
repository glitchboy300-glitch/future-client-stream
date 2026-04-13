import { useEffect } from "react";
import { CheckCircle, Play, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";

/* ==========================================================
   PAGE CONFIG - Update this object to change page content
   ========================================================== */
const PAGE_CONFIG = {
  hero: {
    headline: "Your Discovery Call Is Booked",
    subtext:
      "While you wait, watch these short videos so you know exactly what to expect on our call.",
  },

  // FAQ video sections - add YouTube video IDs when ready
  videos: {
    doneForYou: {
      title: "Is This A Done-For-You Offer?",
      description:
        "Find out exactly what we handle and what you need to bring to the table.",
      videoId: "HbCqvU7bjMk",
    },
    results: {
      title: "What Kind Of Results Can I Expect?",
      description:
        "Real numbers from real clients. No hype. Just what actually happens.",
      videoId: "",
    },
    pricing: {
      title: "How Much Does This Cost?",
      description:
        "Transparent pricing breakdown so there are zero surprises on the call.",
      videoId: "",
    },
  },

  // Testimonials - add more as you collect them
  testimonials: [
    {
      name: "Name 1",
      role: "Coach",
      quote:
        "Add your first testimonial here. Keep it short and results-focused.",
    },
    {
      name: "Name 2",
      role: "Course Creator",
      quote:
        "Add your second testimonial here. Focus on the transformation.",
    },
    {
      name: "Name 3",
      role: "Entrepreneur",
      quote:
        "Add your third testimonial here. Specific numbers work best.",
    },
  ],

  // Client results cards - add more as you get case studies
  clients: [
    { name: "Client 1", result: "$0/mo to $XX,000/mo", niche: "Coaching" },
    { name: "Client 2", result: "0 to XX calls/mo", niche: "Consulting" },
    { name: "Client 3", result: "XX views/mo", niche: "Course Creator" },
  ],

  // CTA bottom section
  cta: {
    headline: "Got Questions Before the Call?",
    email: "muawaz@genspeak.io",
  },
};

/* =========================================================
   COMPONENTS
   ========================================================= */

function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  if (!videoId) {
    return (
      <div className="relative w-full aspect-video rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
        <div className="text-center">
          <Play className="w-12 h-12 text-white/30 mx-auto mb-2" />
          <p className="text-white/40 text-sm">Video coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

/* =========================================================
   MAIN PAGE
   ========================================================= */

export default function Confirmed() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Call Confirmed | GenSpeak</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* HERO */}
        <section className="pt-24 pb-16 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-medium text-sm">
                Call Confirmed
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">
              {PAGE_CONFIG.hero.headline}
            </h1>
            <p className="text-lg text-white/70">
              {PAGE_CONFIG.hero.subtext}
            </p>
          </div>
        </section>

        {/* FAQ VIDEOS */}
        {Object.values(PAGE_CONFIG.videos).map((video, i) => (
          <section key={i} className="py-12 px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-heading text-center">
                {video.title}
              </h2>
              <p className="text-white/60 mb-6 text-center">
                {video.description}
              </p>
              <YouTubeEmbed videoId={video.videoId} title={video.title} />
            </div>
          </section>
        ))}

        {/* TESTIMONIALS */}
        {PAGE_CONFIG.testimonials.length > 0 && (
          <section className="py-16 px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 font-heading text-center">
                What Our Clients Say
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {PAGE_CONFIG.testimonials.map((t, i) => (
                  <div key={i} className="gloss-card p-6 rounded-2xl">
                    <p className="text-white/80 mb-4">"{t.quote}"</p>
                    <div>
                      <p className="text-white font-semibold">{t.name}</p>
                      <p className="text-white/50 text-sm">{t.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CLIENT RESULTS */}
        {PAGE_CONFIG.clients.length > 0 && (
          <section className="py-16 px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 font-heading text-center">
                Client Results
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {PAGE_CONFIG.clients.map((c, i) => (
                  <div
                    key={i}
                    className="glass-card p-6 rounded-2xl text-center"
                  >
                    <p className="text-2xl font-bold text-gradient mb-1">
                      {c.result}
                    </p>
                    <p className="text-white font-medium">{c.name}</p>
                    <p className="text-white/50 text-sm">{c.niche}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CONTACT CTA */}
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4 font-heading">
              {PAGE_CONFIG.cta.headline}
            </h2>
            <a
              href={`mailto:${PAGE_CONFIG.cta.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition"
            >
              {PAGE_CONFIG.cta.email}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
            }
