"use client";

import Link from "next/link";
import Image from "next/image";

interface WorkoutCardProps {
  id: string;
  type: string;
  duration: string;
  title: string;
  imageUrl: string;
}

export function WorkoutCard({ id, type, duration, title, imageUrl }: WorkoutCardProps) {
  return (
    <div className="group relative aspect-[16/10] sm:aspect-video md:aspect-[16/9] overflow-hidden rounded-2xl bg-card shadow-lg">
      <div className="absolute inset-0">
        <Image 
          src={imageUrl} 
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
      </div>
      <div className="absolute inset-0 p-6 flex flex-col justify-end space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3 text-primary">
            <span className="text-[10px] font-bold uppercase tracking-widest">{type}</span>
            <span className="h-1 w-1 rounded-full bg-primary/50"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{duration}</span>
          </div>
          <h4 className="text-2xl font-bold text-foreground tracking-tight">{title}</h4>
        </div>
        <Link 
          href={`/exercise/${id}`}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-lg">play_arrow</span>
          <span className="uppercase tracking-widest text-sm">Start Workout</span>
        </Link>
      </div>
    </div>
  );
}
