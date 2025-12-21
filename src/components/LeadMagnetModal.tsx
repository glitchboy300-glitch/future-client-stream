import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const niches = [
  "Marketing Agency",
  "Coaching/Consulting",
  "Real Estate",
  "Legal Services",
  "Financial Services",
  "SaaS/Tech",
  "Health & Wellness",
  "E-commerce",
  "Education/Training",
  "Other",
];

export function LeadMagnetModal({ isOpen, onClose }: LeadMagnetModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [niche, setNiche] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (niche && email) {
      setStep(2);
    }
  };

  const handleClose = () => {
    setStep(1);
    setNiche("");
    setEmail("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
          >
            <div className="glass-card p-8 relative neon-border">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
                      <Lightbulb size={28} className="text-primary-foreground" />
                    </div>

                    <h3 className="font-heading text-2xl font-bold text-foreground text-center mb-2">
                      Get 25 video ideas for your niche
                    </h3>
                    <p className="text-sm text-muted-foreground text-center mb-8">
                      Pick your niche. I'll send ideas designed to attract buyers
                      (not random viewers).
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">
                          Your niche
                        </label>
                        <Select value={niche} onValueChange={setNiche}>
                          <SelectTrigger className="w-full bg-white/5 border-white/10 text-foreground">
                            <SelectValue placeholder="Select your niche" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-white/10">
                            {niches.map((n) => (
                              <SelectItem
                                key={n}
                                value={n}
                                className="text-foreground hover:bg-white/10 focus:bg-white/10"
                              >
                                {n}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">
                          Email
                        </label>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        variant="hero"
                        className="w-full"
                        disabled={!niche || !email}
                      >
                        Send My Ideas
                        <ArrowRight size={18} />
                      </Button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center"
                  >
                    {/* Success Icon */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
                      <Check size={28} className="text-primary-foreground" />
                    </div>

                    <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                      Sent!
                    </h3>
                    <p className="text-muted-foreground mb-8">
                      Want help turning these into clients?
                    </p>

                    <Button variant="hero" className="w-full" asChild>
                      <a
                        href="https://calendly.com/muawaz-genspeak/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Book a Call
                        <ArrowRight size={18} />
                      </a>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}