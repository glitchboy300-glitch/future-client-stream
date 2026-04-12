import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const CAL_LINK = "muawaz-genspeak/30min";

const Book = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load Cal.com embed script
    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      if (window.Cal) {
        // @ts-ignore
        window.Cal("init", { origin: "https://cal.com" });
        // @ts-ignore
        window.Cal("inline", {
          elementOrSelector: "#cal-embed",
          calLink: CAL_LINK,
          layout: "month_view",
        });
        // Listen for booking confirmation
        // @ts-ignore
        window.Cal("on", {
          action: "bookingSuccessful",
          callback: () => {
            navigate("/confirmed");
          },
        });
      }
    };

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [navigate]);

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
          id="cal-embed"
          className="w-full max-w-3xl"
          style={{ minWidth: "320px", height: "700px", overflow: "auto" }}
        />
      </div>
    </>
  );
};

export default Book;
