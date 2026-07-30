import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";

const Privacy = () => (
  <>
    <Helmet>
      <title>Privacy Policy | GenSpeak</title>
      <meta
        name="description"
        content="How GenSpeak collects, uses, and protects your information."
      />
      <link rel="canonical" href="https://genspeak.io/privacy" />
    </Helmet>
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-20 max-w-3xl">
        <h1 className="font-heading text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: July 31, 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Who we are</h2>
            <p>
              GenSpeak ("we", "us") is a done-for-you YouTube content service for B2B
              businesses, operated by Muhammad Muawaz. Our website is{" "}
              <a href="https://genspeak.io" className="text-primary">genspeak.io</a>.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">What we collect</h2>
            <p>We collect information you give us directly:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Name, email, and business details you submit through our forms (hosted by Tally).</li>
              <li>Booking details when you schedule a call (processed by Cal.com).</li>
            </ul>
            <p className="mt-2">
              We also use embedded services that may set cookies or collect usage data when
              you interact with them: Wistia (video hosting), YouTube (video embeds), Tally
              (forms), and Cal.com (scheduling). Each operates under its own privacy policy.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">How we use it</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To respond to your inquiry and prepare for booked calls.</li>
              <li>To deliver our services if you become a client.</li>
              <li>To improve our website and offers.</li>
            </ul>
            <p className="mt-2">We do not sell your personal information.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Data retention</h2>
            <p>
              We keep inquiry and client information only as long as needed for the purposes
              above, or as required by law. You can ask us to delete your information at any
              time.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Your rights</h2>
            <p>
              You can request access to, correction of, or deletion of your personal
              information. Contact us through the form linked below and we will act on your
              request promptly.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Contact</h2>
            <p>
              Reach us via our{" "}
              <a
                href="https://tally.so/r/b58pL1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                contact form
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  </>
);

export default Privacy;
