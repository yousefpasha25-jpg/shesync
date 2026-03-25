"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Exercise {
  name: string;
  sets?: number;
  reps?: number | string;
  duration?: string;
  image: string;
}

interface ExerciseSlideshowProps {
  exercises: Exercise[];
  title?: string;
}

export const ExerciseSlideshow = ({ exercises, title = "Exercise Demos" }: ExerciseSlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 15000; // 15 seconds

  useEffect(() => {
    if (!isPlaying) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / SLIDE_DURATION) * 100;

      if (newProgress >= 100) {
        setProgress(0);
        setCurrentIndex((prev) => (prev + 1) % exercises.length);
      } else {
        setProgress(newProgress);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, exercises.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % exercises.length);
    setProgress(0);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + exercises.length) % exercises.length);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setProgress(0);
    }
  };

  const currentExercise = exercises[currentIndex];

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background">
      <div className="relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-xl font-bold mb-1">{title}</h3>
              <p className="text-white/80 text-sm">
                Exercise {currentIndex + 1} of {exercises.length}
              </p>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
              SheSync
            </Badge>
          </div>
        </div>

        {/* Exercise Image */}
        <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-primary/5">
          <NextImage
            src={currentExercise.image}
            alt={currentExercise.name}
            fill
            className="object-contain"
          />
        </div>

        {/* Exercise Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6">
          <h4 className="text-white text-2xl font-bold mb-2">{currentExercise.name}</h4>
          <div className="flex flex-wrap gap-2">
            {currentExercise.sets && (
              <Badge className="bg-primary/80 text-white backdrop-blur-sm">
                {currentExercise.sets} Sets
              </Badge>
            )}
            {currentExercise.reps && (
              <Badge className="bg-primary/80 text-white backdrop-blur-sm">
                {currentExercise.reps} Reps
              </Badge>
            )}
            {currentExercise.duration && (
              <Badge className="bg-primary/80 text-white backdrop-blur-sm">
                {currentExercise.duration}
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="default" size="icon" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={goToNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-center gap-1 mt-4">
          {exercises.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setProgress(0);
              }}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};
