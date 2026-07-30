import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";

const Terms = () => (
  <>
    <Helmet>
      <title>Terms of Service | GenSpeak</title>
      <meta
        name="description"
        content="Terms of service for GenSpeak's done-for-you YouTube content services."
      />
      <link rel="canonical" href="https://genspeak.io/terms" />
    </Helmet>
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-20 max-w-3xl">
        <h1 className="font-heading text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-10">Last updated: July 31, 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">1. Who we are</h2>
            <p>
              GenSpeak provides done-for-you YouTube content services for B2B businesses:
              strategy, scripting, production support, editing, distribution, and related
              marketing assets. These terms govern your use of genspeak.io and our services.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">2. Services and agreements</h2>
            <p>
              The specific scope, deliverables, pricing, and timeline for client work are set
              out in a separate written service agreement signed before an engagement starts.
              If these terms conflict with a signed service agreement, the service agreement
              wins.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">3. Guarantee</h2>
            <p>
              Where we advertise a performance guarantee, its exact conditions, measurement
              method, and remedy are defined in the signed service agreement. Marketing copy
              on this website is a summary, not the binding definition.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">4. Your content</h2>
            <p>
              You keep ownership of the footage you record and the channels we manage for
              you. You give us the permissions needed to edit, publish, and promote that
              content as part of the engagement.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">5. No guarantees of platform behavior</h2>
            <p>
              YouTube, LinkedIn, and other platforms change their algorithms and policies at
              any time. We do not control those platforms and are not liable for their
              decisions, outages, or ranking changes.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">6. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, our total liability for any claim
              arising out of the website or services is limited to the amount you paid us in
              the three months before the claim arose.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">7. Contact</h2>
            <p>
              Questions about these terms? Reach us via our{" "}
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

export default Terms;
