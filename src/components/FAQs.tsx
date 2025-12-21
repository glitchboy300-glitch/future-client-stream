import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const faqs = [
    {
      question: "Do I need a big following?",
      answer:
        "No. You need the right videos and a clear path to a call.",
    },
    {
      question: "I don't know what to say on camera.",
      answer:
        "You won't wing it. We give you the script, structure, and talking points.",
    },
    {
      question: "How much time will this take me?",
      answer:
        "About an hour a week to film. We do the rest.",
    },
    {
      question: "What if my niche is boring?",
      answer:
        "Good. Boring niches print money when you answer buyer questions better than competitors.",
    },
    {
      question: "Is this ads or organic?",
      answer:
        "Organic. We build an asset that compounds.",
    },
    {
      question: "When do I see results?",
      answer:
        'We aim for clients in 90 days. Not "someday".',
    },
  ];

  return (
    <section id="faqs" className="py-20 md:py-32" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12"
          >
            Frequently asked <span className="text-gradient">questions</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="glass-card border-white/10 px-6 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="text-left font-heading font-medium text-foreground hover:text-primary transition-colors py-5 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}