"use client";

import { motion } from "framer-motion";
import { Target, Eye, BookOpen } from "lucide-react";

export function VisionMission() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Our Story */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              Our Story
            </div>
            <h2 className="text-4xl font-bold tracking-tight">Evolving Since 2018</h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                SheSync was launched in 2018 with the mission of helping people live healthier lives.
              </p>
              <p>
                The platform began as a fitness initiative focused on guiding individuals toward sustainable health habits.
              </p>
              <p>
                Over the years, the team expanded to include coaches, nutritionists, and physiotherapists offering both online and on-ground programs.
              </p>
              <p className="font-medium text-foreground">
                Today SheSync delivers personalized training, nutrition programs, and transformation journeys that help people change not only their bodies, but their mindset and lifestyle.
              </p>
            </div>
          </motion.div>

          {/* Vision & Mission */}
          <div className="space-y-12">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-secondary/30 border border-border flex gap-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center shrink-0">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
                <p className="text-muted-foreground">
                  To transform lives through wellness programs that improve physical health, mental wellbeing, and lifestyle balance.
                </p>
              </div>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-3xl bg-secondary/30 border border-border flex gap-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
                <p className="text-muted-foreground">
                  To provide personalized nutrition and workout programs that allow people to achieve their goals by replacing unhealthy habits with healthy ones.
                </p>
                <p className="mt-4 text-sm font-medium italic">
                  The experience should be supportive, accessible, and designed for long-term transformation.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
