"use client";

import { motion } from "framer-motion";
import { Globe, Users, CheckCircle2 } from "lucide-react";

const onlineServices = [
  "Online Live Group Training",
  "Online Private Coaching",
  "Online Nutrition Programs",
];

const offlineServices = [
  "Fitness Sessions",
  "Kids & Youth Programs",
  "Rehabilitation Sessions",
  "Corporate Wellness Programs",
];

export function ServicesGrid() {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 underline decoration-primary decoration-4 underline-offset-8">
          What We Offer
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Online Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group p-10 rounded-[2.5rem] bg-black text-white transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/40 transition-colors">
              <Globe className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-8 italic tracking-tighter uppercase underline decoration-primary">Online Services</h3>
            <ul className="space-y-4">
              {onlineServices.map((service, index) => (
                <li key={index} className="flex items-center gap-3 text-lg">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Offline Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group p-10 rounded-[2.5rem] bg-secondary border border-border transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
              <Users className="w-8 h-8 text-primary group-hover:text-black transition-colors" />
            </div>
            <h3 className="text-3xl font-bold mb-8 italic tracking-tighter uppercase underline decoration-black">Offline Services</h3>
            <ul className="space-y-4 text-muted-foreground">
              {offlineServices.map((service, index) => (
                <li key={index} className="flex items-center gap-3 text-lg">
                  <CheckCircle2 className="w-5 h-5 text-black shrink-0" />
                  <span className="text-foreground">{service}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
