"use client";

import { motion } from "framer-motion";
import { Award, Zap, Sparkles } from "lucide-react";

const benefits = [
  {
    title: "Expert Coaches",
    description: "Certified trainers and specialists dedicated to your success.",
    icon: Award,
  },
  {
    title: "Personalized Programs",
    description: "Programs tailored specifically to your individual goals and needs.",
    icon: Zap,
  },
  {
    title: "Life Changing Experience",
    description: "Fitness that improves not just your body, but your mindset and lifestyle.",
    icon: Sparkles,
  },
];

export function WhyAwdan() {
  return (
    <section className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="w-20 h-20 rounded-3xl bg-black flex items-center justify-center mx-auto mb-8 group-hover:bg-primary transition-colors duration-300">
                <benefit.icon className="w-10 h-10 text-primary group-hover:text-black transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
