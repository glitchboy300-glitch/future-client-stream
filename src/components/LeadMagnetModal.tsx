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

                    <Button
                      variant="hero"
                      className="w-full"
                      onClick={() => window.open('https://tally.so/r/RGdZzj', '_blank')}
                    >
                      Get My Ideas
                      <ArrowRight size={18} />
                    </Button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
