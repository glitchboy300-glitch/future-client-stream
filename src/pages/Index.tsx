import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PainPromise } from "@/components/PainPromise";
import { OfferStack } from "@/components/OfferStack";
import { HowItWorks } from "@/components/HowItWorks";
import { Deliverables } from "@/components/Deliverables";
import { Guarantee } from "@/components/Guarantee";
import { FAQs } from "@/components/FAQs";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { LeadMagnetModal } from "@/components/LeadMagnetModal";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Index = () => {
  const [isLeadMagnetOpen, setIsLeadMagnetOpen] = useState(false);

  return (
    <HelmetProvider>
      <Helmet>
        <title>GenSpeak | Sign New Clients from YouTube in 90 Days</title>
        <meta
          name="description"
          content="Done-for-you YouTube client acquisition system for service businesses. You film, we do everything else. Sign new clients in 90 days or we work for free."
        />
        <meta
          name="keywords"
          content="YouTube marketing, client acquisition, service business, content strategy, video marketing"
        />
        <link rel="canonical" href="https://genspeak.io" />
      </Helmet>

      <div className="min-h-screen">
        {/* Noise Overlay */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-noise" />

        <Navbar onOpenLeadMagnet={() => setIsLeadMagnetOpen(true)} />

        <main>
          <Hero onOpenLeadMagnet={() => setIsLeadMagnetOpen(true)} />
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
    </HelmetProvider>
  );
};

export default Index;