"use client";

import { motion } from "framer-motion";
import { Award, Star, Quote } from "lucide-react";
import NextImage from "next/image";

const mentors = [
  {
    name: "Sara Hassan",
    role: "Founder & Elite Coach",
    bio: "International fitness instructor and triathlete with 10+ years of experience.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
  },
  {
    name: "Coach Mira",
    role: "CrossFit Specialist",
    bio: "Transforming women through functional strength and high-intensity training.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mira",
  },
  {
    name: "Dr. Laila",
    role: "Nutrition Expert",
    bio: "Specializing in hormonal health and personalized metabolic nutrition.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laila",
  },
];

const testimonials = [
  {
    text: "SheSync changed how I look at fitness. It's not just about the gym anymore; it's a lifestyle.",
    author: "Amira R.",
    result: "Lost 12kg in 4 months",
  },
  {
    text: "The AI coach feels like having a real person next to me. The plans are scarily accurate!",
    author: "Noor S.",
    result: "First triathlon completed",
  },
];

export function TrustSections() {
  return (
    <div className="space-y-32 py-24">
      {/* Meet the Coaches */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">Meet the Experts</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our world-class coaches and health experts are here to guide your transformation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mentors.map((coach, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-8 rounded-[2rem] bg-secondary/30 border border-border hover:bg-secondary/50 transition-all text-center"
            >
              <div className="size-24 rounded-2xl bg-black mx-auto mb-6 overflow-hidden border-2 border-primary/20 group-hover:scale-105 transition-transform relative">
                <NextImage src={coach.avatar} alt={coach.name} title={coach.name} fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-1">{coach.name}</h3>
              <p className="text-primary text-sm font-semibold mb-4 italic italic">{coach.role}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{coach.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Success Stories & Testimonials */}
      <section className="bg-black text-white py-24 rounded-[3rem] mx-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tighter">Success Stories</h2>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="size-5 fill-primary text-primary" />)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-6"
              >
                <Quote className="size-10 text-primary opacity-50" />
                <p className="text-xl italic leading-relaxed text-white/90">"{t.text}"</p>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">{t.author}</p>
                    <p className="text-primary text-sm font-medium">{t.result}</p>
                  </div>
                  <Award className="size-8 text-primary/30" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
