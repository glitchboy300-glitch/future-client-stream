import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Book from "./pages/Book";
import Confirmed from "./pages/Confirmed";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/book" element={<Book />} />
    <Route path="/confirmed" element={<Confirmed />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/terms" element={<Terms />} />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);
