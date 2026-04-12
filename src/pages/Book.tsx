import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const CAL_LINK = "muawaz-genspeak/30min";

const Book = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Cal.com embed v2 initialization snippet
    (function (C, A, L) {
      let p = function (a, ar) {
        a.q.push(ar);
      };
      let d = C.document;
      C.Cal =
        C.Cal ||
        function () {
          let cal = C.Cal;
          let ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () {
              p(api, arguments);
            };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else p(cal, ar);
            return;
          }
          p(cal, ar);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    // @ts-ignore
    Cal("init", { origin: "https://cal.com" });

    // @ts-ignore
    Cal("inline", {
      elementOrSelector: "#cal-embed",
      calLink: CAL_LINK,
      layout: "month_view",
    });

    // @ts-ignore
    Cal("on", {
      action: "bookingSuccessful",
      callback: () => {
        navigate("/confirmed");
      },
    });

    // @ts-ignore
    Cal("ui", {
      theme: "dark",
      styles: { branding: { brandColor: "#FFFFFF" } },
      hideEventTypeDetails: false,
      layout: "month_view",
    });
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
