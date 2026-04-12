import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const CALENDLY_URL = "https://calendly.com/muawaz-genspeak/30min";

function isCalendlyEvent(e) {
  return (
    e.origin === "https://calendly.com" &&
    e.data.event &&
    e.data.event.startsWith("calendly.")
  );
}

const Book = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);

    const handleMessage = (e) => {
      if (isCalendlyEvent(e) && e.data.event === "calendly.event_scheduled") {
        window.location.href = "/confirmed";
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Book a Call | GenSpeak</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-black flex flex-col items-center justify-start pt-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Book Your Strategy Call
          </h1>
          <p className="text-gray-400 text-lg">
            Pick a time that works for you. 30 minutes. No fluff.
          </p>
        </div>
        <div
          className="calendly-inline-widget w-full max-w-3xl"
          data-url={CALENDLY_URL}
          style={{ minWidth: "320px", height: "700px" }}
        />
      </div>
    </>
  );
};

export default Book;