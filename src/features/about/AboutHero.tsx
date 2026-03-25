"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function AboutHero() {
  return (
    <section className="relative py-20 overflow-hidden bg-black text-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-32 h-32 mb-8 rounded-full overflow-hidden border-4 border-white shadow-2xl">
            <Image
              src="/awdan-logo.jpg.jpeg"
              alt="Awdan Vibes Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
            Awdan Vibes
          </h1>
          
          <p className="text-xl md:text-2xl text-primary font-medium mb-6">
            Transforming lives through wellness, fitness, and AI-powered coaching.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-white/80 leading-relaxed">
              Awdan Vibes was launched to help people build a healthy lifestyle through structured training, nutrition programs, and expert coaching.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
