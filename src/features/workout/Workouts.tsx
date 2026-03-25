"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { updateFitnessGoalsAction } from "@/features/workout/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Play, ExternalLink, Calendar, Info, Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ExerciseSlideshow } from "@/features/workout/ExerciseSlideshow";
import { Skeleton } from "@/components/ui/skeleton";
import { BrandLogo } from "@/components/ui/BrandLogo";


// Exercise demo data for Day 3 - Full Body
const day3ExerciseDemos = [
  { name: "Jumping Jacks", duration: "30 sec", image: "/exercises/jumping-jacks.jpg" },
  { name: "Dynamic Lunges", reps: "5/side", image: "/exercises/dynamic-lunges.jpg" },
  { name: "Band Pull-Aparts", reps: "10", image: "/exercises/band-pull-aparts.jpg" },
  { name: "Hip Hinge Drill", reps: "5", image: "/exercises/hip-hinge.jpg" },
  { name: "Push-Up Variation", sets: 3, reps: "8-12", image: "/exercises/push-up.jpg" },
  { name: "Squat to Press", sets: 3, reps: "10", image: "/exercises/squat-to-press.jpg" },
  { name: "Bent-Over Rows", sets: 3, reps: "12", image: "/exercises/bent-over-rows.jpg" },
  { name: "Glute Bridges", sets: 3, reps: "12", image: "/exercises/glute-bridges.jpg" },
  { name: "Pallof Press", sets: 3, reps: "10/side", image: "/exercises/pallof-press.jpg" },
  { name: "Air Squats", reps: "AMRAP", image: "/exercises/air-squats.jpg" },
  { name: "Mountain Climbers", reps: "Slow", image: "/exercises/mountain-climbers.jpg" },
];

// Removed hardcoded workoutProgram to use dynamic AI Generation

export default function Workouts() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [fitnessPrefs, setFitnessPrefs] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [aiExercises, setAiExercises] = useState<any[]>([]);
  const [aiPlan, setAiPlan] = useState<any[] | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [completingWorkout, setCompletingWorkout] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [workoutNotes, setWorkoutNotes] = useState("");
  const [workoutRPE, setWorkoutRPE] = useState([5]);
  const { toast } = useToast();
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setCurrentUser(user);

      // Fetch fitness preferences
      const { data: fitnessData } = await supabase
        .from("fitness_prefs")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      setFitnessPrefs(fitnessData);

      // Fetch profile for AI context
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      setUserProfile(profileData);

      // Fetch AI suggested individual exercises
      const { data: exercisesData } = await supabase
        .from("user_exercises")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_completed", false)
        .order("created_at", { ascending: false });

      // Fetch the persisted full AI 7-day plan
      const { data: existingPlanData } = await supabase
        .from("user_plans")
        .select("plan_data")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingPlanData?.plan_data) {
        try {
          const parsed = typeof existingPlanData.plan_data === 'string' 
            ? JSON.parse(existingPlanData.plan_data) 
            : existingPlanData.plan_data;
          setAiPlan(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          console.warn("Could not parse existing aiPlan data", e);
        }
      }

      setAiExercises(exercisesData || []);
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const generatePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_workout',
          userProfile: userProfile
        })
      });
      if (!response.ok) throw new Error("Failed to generate plan");
      const data = await response.json();
      if (data.plan) {
        setAiPlan(data.plan);
        toast({ title: "Plan Generated! 🚀", description: "Your custom AI workout is ready and saved." });

        // Save to Database
        const { error: saveError } = await supabase
          .from('user_plans')
          .upsert({
            user_id: currentUser?.id || userProfile?.id,
            plan_data: data.plan,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
          
        if (saveError) {
          console.warn("Could not save to user_plans, trying fallback to profiles...", saveError);
          // Fallback to storing in profiles if user_plans fails RLS or is missing
          await updateFitnessGoalsAction(data.plan);
        }
      }
    } catch (error) {
      console.warn("Warning generating plan:", error);
      toast({ title: "Generation delayed", description: "The AI is busy, please try again soon.", variant: "destructive" });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleCompleteWorkout = async () => {
    if (!currentUser || completingWorkout || selectedDay === null) return;

    // Defensive check: Ensure the selected workout day exists in the current generated plan
    const currentWorkout = aiPlan?.find(w => w.day === selectedDay);
    // Ignore exercises check if it hasn't been strictly generated, just proceed and log anyway.
    if (!currentWorkout) {
      console.warn("Attempted to complete workout but currentWorkout not found.");
      toast({ title: "Error", description: "Workout day not found.", variant: "destructive" });
      setCompletingWorkout(false);
      return;
    }

    setCompletingWorkout(true);
    try {
      const today = new Date().toISOString().split("T")[0];

      const { error } = await supabase.from("workout_logs").upsert({
        profile_id: currentUser.id,
        date: today,
        completed: true,
        notes: workoutNotes.trim() || null,
        rpe: workoutRPE[0],
      }, { onConflict: 'profile_id,date' });

      if (error) throw error;

      toast({
        title: "رائع! 💪",
        description: "تم تسجيل التمرين بنجاح",
      });

      setWorkoutNotes("");
      setWorkoutRPE([5]);
      setSelectedDay(null);
    } catch (error: any) {
      console.warn("Warning logging workout:", error);
      toast({
        title: "خطأ في الحفظ",
        description: error.message || "حدث خطأ أثناء حفظ التمرين.",
        variant: "destructive"
      });
    } finally {
      setCompletingWorkout(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <BrandLogo size="lg" withText={false} className="animate-pulse mb-4" />
        <p className="text-muted-foreground">Preparing your SheSync Training Plan...</p>
      </div>
      </div>
    );
  }

  return (
    <div>
      <main className="py-4 max-w-5xl mx-auto">
        {/* AI Suggested Exercises */}
        {aiExercises.length > 0 && (
          <Card className="mb-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/30">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span>🤖</span>
                تمارين مقترحة من المساعد
              </CardTitle>
              <CardDescription>تمارين مخصصة أضافها المساعد الذكي بناءً على أهدافك</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="p-4 rounded-lg border bg-card/50 backdrop-blur-sm hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{exercise.exercise_name}</h4>
                        {exercise.category && (
                          <Badge variant="secondary" className="mt-1">
                            {exercise.category}
                          </Badge>
                        )}
                      </div>
                      {exercise.difficulty && <Badge variant="outline">{exercise.difficulty}</Badge>}
                    </div>
                    {exercise.description && (
                      <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 text-sm">
                      {exercise.sets && <span className="px-2 py-1 rounded bg-muted">{exercise.sets} مجموعات</span>}
                      {exercise.reps && <span className="px-2 py-1 rounded bg-muted">{exercise.reps} تكرار</span>}
                      {exercise.duration_minutes && (
                        <span className="px-2 py-1 rounded bg-muted">{exercise.duration_minutes} دقيقة</span>
                      )}
                    </div>
                    {exercise.equipment && exercise.equipment.length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">المعدات: {exercise.equipment.join("، ")}</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Program Generator */}
        {(!aiPlan || aiPlan.length === 0) && !isGeneratingPlan ? (
          <Card className="mb-6 border-primary/20 bg-card/60 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Ready for your custom workout plan?</CardTitle>
              <CardDescription>Generate a hyper-personalized 7-day workout schedule using SheSync AI.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8 p-6">
              <Button size="lg" onClick={generatePlan} className="gap-2 text-lg px-8 py-6 rounded-xl hover:scale-105 transition-transform bg-primary">
                <Sparkles className="h-5 w-5" /> Generate AI Workout
              </Button>
            </CardContent>
          </Card>
        ) : isGeneratingPlan ? (
          <Card className="mb-6 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" /> AI is crafting your schedule...
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">Your 7-Day Custom AI Plan</CardTitle>
                <CardDescription>Generated specifically for your goals and fitness level.</CardDescription>
              </CardHeader>
            </Card>

            {Array.isArray(aiPlan) && aiPlan.map((day: any, dIdx: number) => (
              <Card key={dIdx} className="overflow-hidden shadow-sm">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{day.day}</CardTitle>
                      <CardDescription className="mt-1">{day.focus} • {day.duration}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-sm">
                        {day.exercises?.length || 0} Exercises
                      </Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedDay(day.day)} className="gap-2 bg-primary">
                            <Check className="h-4 w-4" />
                            Complete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>تسجيل التمرين</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>ملاحظات (اختياري)</Label>
                              <Textarea
                                placeholder="كيف كان التمرين؟"
                                value={workoutNotes}
                                onChange={(e) => setWorkoutNotes(e.target.value)}
                                className="min-h-[100px]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>RPE (مستوى الجهد): {workoutRPE[0]}/10</Label>
                              <Slider
                                value={workoutRPE}
                                onValueChange={setWorkoutRPE}
                                min={1}
                                max={10}
                                step={1}
                                className="w-full"
                              />
                            </div>
                            <Button onClick={handleCompleteWorkout} disabled={completingWorkout} className="w-full">
                              تسجيل التمرين
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="exercises" className="border-0">
                      <AccordionTrigger className="px-6 hover:bg-muted/50">View Exercises</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 mt-2">
                        <ul className="space-y-3">
                          {day.exercises && day.exercises.map((ex: string, eIdx: number) => (
                            <li key={eIdx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/50 text-sm">
                              <span className="text-primary mt-0.5">•</span>
                              <span className="font-medium">{ex}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
