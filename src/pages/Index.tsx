import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { OurWork } from "@/components/OurWork";
import { PainPromise } from "@/components/PainPromise";
import { OfferStack } from "@/components/OfferStack";
import { HowItWorks } from "@/components/HowItWorks";
import { Deliverables } from "@/components/Deliverables";
import { Guarantee } from "@/components/Guarantee";
import { FAQs } from "@/components/FAQs";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { LeadMagnetModal } from "@/components/LeadMagnetModal";
import { Helmet } from "react-helmet-async";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://genspeak.io/#organization",
      name: "GenSpeak",
      url: "https://genspeak.io",
      logo: "https://genspeak.io/favicon.png",
      description:
        "Done-for-you YouTube agency for B2B companies and agencies. GenSpeak handles strategy, scripting, editing, and funnels so founders turn YouTube into a client pipeline.",
      founder: { "@type": "Person", name: "Muhammad Muawaz" },
      knowsAbout: [
        "YouTube marketing",
        "B2B client acquisition",
        "YouTube channel management",
        "video content strategy",
        "lead generation",
        "short form content",
        "email funnels",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://genspeak.io/#website",
      url: "https://genspeak.io",
      name: "GenSpeak",
      description:
        "Done-for-you YouTube agency for B2B companies. You film 2 hours a month. We do everything else.",
      publisher: { "@id": "https://genspeak.io/#organization" },
      inLanguage: "en",
    },
    {
      "@type": "FAQPage",
      "@id": "https://genspeak.io/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Do I need a big following?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. You need the right videos and a clear path to a call.",
          },
        },
        {
          "@type": "Question",
          name: "I don't know what to say on camera.",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You won't wing it. We give you the script, structure, and talking points.",
          },
        },
        {
          "@type": "Question",
          name: "How much time will this take me?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "About an hour a week to film. We do the rest.",
          },
        },
        {
          "@type": "Question",
          name: "What if my niche is boring?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Good. Boring niches print money when you answer buyer questions better than competitors.",
          },
        },
        {
          "@type": "Question",
          name: "Is this ads or organic?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Organic. We build an asset that compounds.",
          },
        },
        {
          "@type": "Question",
          name: "When do I see results?",
          acceptedAnswer: {
            "@type": "Answer",
            text: 'We aim for clients in 90 days. Not "someday".',
          },
        },
      ],
    },
  ],
};

const Index = () => {
  const [isLeadMagnetOpen, setIsLeadMagnetOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>GenSpeak | B2B YouTube Agency That Adds 20+ Sales Calls a Month</title>
        <meta
          name="description"
          content="GenSpeak is a done-for-you YouTube agency for B2B companies and agencies. You film 2 hours a month. We handle strategy, scripts, editing, and funnels. 20 qualified sales calls a month, guaranteed."
        />
        <link rel="canonical" href="https://genspeak.io/" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="min-h-screen">
        {/* Noise Overlay */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-noise" />

        <Navbar onOpenLeadMagnet={() => setIsLeadMagnetOpen(true)} />

        <main>
          <Hero onOpenLeadMagnet={() => setIsLeadMagnetOpen(true)} />
          <OurWork />
          <PainPromise />
          <OfferStack />
          <HowItWorks />
          <Deliverables />
          <Guarantee onOpenLeadMagnet={() => setIsLeadMagnetOpen(true)} />
          <FAQs />
          <FinalCTA onOpenLeadMagnet={() => setIsLeadMagnetOpen(true)} />
        </main>

        <Footer />

        <LeadMagnetModal
          isOpen={isLeadMagnetOpen}
          onClose={() => setIsLeadMagnetOpen(false)}
        />
      </div>
    </>
  );
};

export default Index;
