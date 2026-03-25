"use client";

import { motion } from "framer-motion";
import { User2, Users2, HeartPulse } from "lucide-react";
import NextImage from "next/image";

const team = [
  {
    category: "Founder",
    icon: User2,
    members: [
      {
        name: "Sara El Awdan",
        role: "International fitness instructor and triathlete",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
      },
    ],
  },
  {
    category: "Coaches",
    icon: Users2,
    members: [
      { name: "Fitness trainers", role: "Expert Coaching", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coach1" },
      { name: "CrossFit trainers", role: "Strength & Conditioning", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coach2" },
      { name: "Yoga instructors", role: "Mind & Body", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coach3" },
      { name: "Mobility specialists", role: "Flexibility Experts", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coach4" },
    ],
  },
  {
    category: "Health Experts",
    icon: HeartPulse,
    members: [
      { name: "Nutritionists", role: "Dietary Guidance", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Expert1" },
      { name: "Physiotherapists", role: "Physical Therapy", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Expert2" },
      { name: "Sports rehabilitation", role: "Recovery Specialists", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Expert3" },
    ],
  },
];

export function TeamSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Meet The Team</h2>
        
        <div className="space-y-20">
          {team.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <group.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{group.category}</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {group.members.map((member, memberIndex) => (
                  <motion.div
                    key={memberIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: memberIndex * 0.1 }}
                    className="group relative p-6 rounded-3xl bg-secondary/50 border border-border hover:bg-secondary transition-colors"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-2xl bg-black mb-4 overflow-hidden group-hover:scale-105 transition-transform relative">
                        <NextImage 
                          src={member.avatar} 
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h4 className="text-lg font-bold mb-1">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
