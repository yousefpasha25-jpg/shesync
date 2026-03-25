"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Dumbbell, Apple, Droplet, TrendingUp, Users, Settings, LogOut, Moon, Sun, Sparkles, CreditCard, Languages, Heart, Activity, Calendar, Clock, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AIChat from "@/features/ai-coach/AIChat";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { PersonalizationEngine } from "@/features/onboarding/PersonalizationEngine";
import { ProgressTracker } from "@/features/progress/ProgressTracker";
import { BrandLogo } from "@/components/ui/BrandLogo";

// Supabase client is already initialized in @/lib/supabase/client

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [fitnessPrefs, setFitnessPrefs] = useState<any>(null);
  const [nutritionPrefs, setNutritionPrefs] = useState<any>(null);
  const [userGoals, setUserGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [waterIntake, setWaterIntake] = useState(0);
  const [addingWater, setAddingWater] = useState(false);
  const [workoutsThisWeek, setWorkoutsThisWeek] = useState(0);
  const [todayMeals, setTodayMeals] = useState<any[]>([]);
  const [todayCalories, setTodayCalories] = useState(0);
  const [todayWorkout, setTodayWorkout] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { toggleLanguage } = useLanguage();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          router.push("/login");
          return;
        }

        setUser(authUser);

        // Fetch dashboard data — try RPC first, fall back to direct queries
        const { data: rpcData, error: rpcError } = await supabase.rpc("get_dashboard_data", { p_user_id: authUser.id });

        if (!rpcError && rpcData) {
          if (!rpcData.profile) {
            // No profile means onboarding is genuinely incomplete
            router.push("/onboarding");
            return;
          }
          setProfile(rpcData.profile);
          setUserGoals(rpcData.active_goals ? rpcData.active_goals.map((g: any) => g.goal) : []);
          setWorkoutsThisWeek(rpcData.recent_workouts ? rpcData.recent_workouts.filter((log: any) => log.completed).length : 0);
        } else {
          // RPC failed (function may not exist yet) — fall back to direct profile query
          console.warn("Dashboard: RPC unavailable, falling back to direct query:", rpcError?.message);
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name, age, fitness_goals")
            .eq("user_id", authUser.id)
            .maybeSingle();
          if (profileData) {
            setProfile(profileData);
          }
        }

        // Fetch today's water intake
        const today = new Date().toISOString().split('T')[0];
        const { data: waterData } = await supabase
          .from("water_logs")
          .select("ml")
          .eq("user_id", authUser.id)
          .eq("date", today);

        if (waterData) {
          const total = waterData.reduce((sum, log) => sum + log.ml, 0);
          setWaterIntake(total);
        }

        // Fetch meals
        const { data: mealsData } = await supabase
          .from("meals")
          .select("*")
          .eq("user_id", authUser.id)
          .eq("date", today);
          
        if (mealsData) {
          setTodayMeals(mealsData);
          setTodayCalories(mealsData.reduce((sum, m) => sum + (m.kcal || 0), 0));
        }

        // Fetch workout plan
        const { data: planData } = await supabase
          .from("user_plans")
          .select("plan_data")
          .eq("user_id", authUser.id)
          .maybeSingle();

        if (planData?.plan_data) {
          try {
            const parsed = typeof planData.plan_data === 'string' ? JSON.parse(planData.plan_data) : planData.plan_data;
            if (Array.isArray(parsed) && parsed.length > 0) {
              const dayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; 
              setTodayWorkout(parsed[dayIndex % parsed.length]);
            }
          } catch(e) {}
        }
      } catch (error) {
        console.warn("Error fetching user data:", error);
        // Suppress the red error toast for empty states or missing tables to keep the UX clean
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Setup realtime subscriptions for water logs
    const waterChannel = supabase
      .channel('water_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'water_logs'
        },
        async (payload) => {
          // Refetch water data
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) {
            const today = new Date().toISOString().split('T')[0];
            const { data: waterData } = await supabase
              .from("water_logs")
              .select("ml")
              .eq("user_id", authUser.id)
              .eq("date", today);

            if (waterData) {
              const total = waterData.reduce((sum, log) => sum + log.ml, 0);
              setWaterIntake(total);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(waterChannel);
    };
  }, [router, toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleAddWater = async () => {
    if (!user || addingWater) return;
    
    setAddingWater(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: existingLog, error: fetchError } = await supabase
        .from("water_logs")
        .select("id, ml")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const newTotal = (existingLog?.ml || 0) + 250;

      if (existingLog) {
        // 2. UPDATE
        const { error: updateError } = await supabase
          .from("water_logs")
          .update({ ml: newTotal })
          .eq("id", existingLog.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("water_logs")
          .insert({
            user_id: user.id,
            ml: 250,
            date: today
          });
        if (insertError) throw insertError;
      }

      setWaterIntake(newTotal);
      toast({
        title: "Success! 💧",
        description: `Added 250ml. Total: ${newTotal}ml`,
      });
    } catch (error: any) {
      console.error("Dashboard: Error adding water:", error);
      toast({
        variant: "destructive",
        title: "Logging Failed",
        description: error.message || "Could not save water intake. Please check your connection.",
      });
    } finally {
      setAddingWater(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <BrandLogo size="lg" withText={false} className="animate-pulse mb-4" />
        <p className="text-muted-foreground">Loading your Awdan Dashboard...</p>
      </div>
      </div>
    );
  }

  const targetWater = nutritionPrefs?.water_liters ? Math.round(nutritionPrefs.water_liters * 1000) : 2000;
  
  const goalMessage = userGoals.includes("lose_weight") 
    ? "Let's crush those weight loss goals today!"
    : userGoals.includes("gain_muscle")
    ? "Time to build some strength!"
    : userGoals.includes("get_fit")
    ? "Ready to level up your fitness?"
    : "Let's make today count!";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BrandLogo size="sm" withText={true} className="flex-row items-center gap-3" />
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1" onClick={() => router.push("/pricing")}>
              <CreditCard className="h-4 w-4" />
              Plans & Pricing
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Global Responsive Padding and Max-Width are handled in layout.tsx */}
      <div className="py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Good morning, {profile?.full_name?.split(' ')[0] || profile?.name?.split(' ')[0] || "Champ"}!
            </h1>
            <p className="text-sm text-muted-foreground">{goalMessage}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 px-3 py-1 text-primary border-primary/20">
              <Flame className="h-3 w-3" />
              7 day streak
            </Badge>
          </div>
        </div>

        <div className="mb-10">
          <ProgressTracker />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Weekly Workouts</p>
                  <p className="text-2xl font-bold">{workoutsThisWeek}/5</p>
                  <Progress value={(workoutsThisWeek / 5) * 100} className="h-1 mt-2" />
                </div>
                <Activity className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Today's Calories</p>
                  <p className="text-2xl font-bold">{todayCalories}</p>
                  <Progress value={Math.min((todayCalories / 2000) * 100, 100)} className="h-1 mt-2" />
                </div>
                <Flame className="h-8 w-8 text-orange-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs text-muted-foreground">Sleep</p>
                    <Badge variant="outline" className="text-[10px] h-4 px-1 bg-muted">Coming soon</Badge>
                  </div>
                  <p className="text-2xl font-bold">7.5h</p>
                  <Badge className="mt-1 h-5 text-xs bg-primary/20 text-primary hover:bg-primary/20">Good</Badge>
                </div>
                <Moon className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs text-muted-foreground">Recovery Score</p>
                    <Badge variant="outline" className="text-[10px] h-4 px-1 bg-muted">Coming soon</Badge>
                  </div>
                  <p className="text-2xl font-bold">85%</p>
                  <Badge className="mt-1 h-5 text-xs bg-primary text-primary-foreground hover:bg-primary">Excellent</Badge>
                </div>
                <Heart className="h-8 w-8 text-red-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">🏆 Champions</span>
                <Badge variant="secondary" className="text-[10px] h-5">V2 Roadmap</Badge>
              </CardTitle>
              <CardDescription className="text-xs">Top performers this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: "Emma Johnson", stat: "7 workouts", streak: "14 day streak", icon: "🏅" },
                  { name: "Maria Garcia", stat: "21 workouts", streak: "21 day streak", icon: "🥇" },
                  { name: "Sarah Chen", stat: "56 workouts", streak: "8 day streak", icon: "🥈" },
                  { name: "You", stat: "5 workouts", streak: "7 day streak", icon: "⭐", highlight: true },
                ].map((person, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded ${person.highlight ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{person.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{person.name}</p>
                        <p className="text-xs text-muted-foreground">{person.stat}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{person.streak}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <PersonalizationEngine />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Period Tracking
                  </span>
                  <Badge variant="secondary" className="text-[10px] h-5">V2 Roadmap</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-3">
                  <p className="text-3xl font-bold text-primary mb-1">12</p>
                  <p className="text-xs text-muted-foreground">days until</p>
                  <p className="text-sm font-medium mt-2">Follicular phase</p>
                </div>
                <Progress value={57} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground text-center">day 16/28</p>
                <div className="mt-3 p-2 bg-primary/5 rounded text-xs text-center border border-primary/10">
                  Energy levels optimal for strength training
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-blue-400" />
                  Water Intake
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-3">
                  <p className="text-2xl font-bold">{waterIntake}/{targetWater}ml</p>
                  <p className="text-xs text-muted-foreground">{Math.floor(waterIntake / 250)} glasses</p>
                  <Progress value={(waterIntake / targetWater) * 100} className="h-2 mt-2" />
                </div>
                <Button 
                  className="w-full hover-scale shadow-glow" 
                  size="sm"
                  onClick={handleAddWater}
                  disabled={addingWater}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Log 250ml
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-primary" />
                    Today's Workout
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">Moderate</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {todayWorkout ? (
                  <>
                    <div className="mb-3">
                      <p className="font-medium">{todayWorkout.focus || todayWorkout.day}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {todayWorkout.duration || "45 min"}
                      </p>
                    </div>
                    <Button className="w-full hover-scale shadow-elegant" onClick={() => router.push("/train")}>
                      Start Workout
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <p className="font-medium text-muted-foreground">No plan generated</p>
                    </div>
                    <Button className="w-full" variant="outline" onClick={() => router.push("/train")}>
                      Create Plan
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Apple className="h-4 w-4 text-orange-400" />
                  Today's Meals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todayMeals.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-2">No meals logged today</p>
                    <Button variant="outline" size="sm" onClick={() => router.push("/eat")}>Log a meal</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todayMeals.slice(0, 3).map((meal, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded border border-border/50">
                        <div>
                          <p className="text-sm font-medium capitalize">{meal.meal_type || "Meal"}</p>
                          <p className="text-xs text-muted-foreground">{meal.notes} • {meal.kcal} cal</p>
                        </div>
                        <Badge variant="secondary" className="h-5 text-primary">✓</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <Button variant="outline" className="justify-start gap-2" size="sm" onClick={() => router.push("/train")}>
                    <Calendar className="h-4 w-4" />
                    Schedule Workout
                  </Button>
                  <Button variant="outline" className="justify-start gap-2" size="sm" onClick={() => router.push("/eat")}>
                    <Apple className="h-4 w-4" />
                    Plan Meals
                  </Button>
                  <Button variant="outline" className="justify-start gap-2" size="sm" onClick={() => router.push("/coach")}>
                    <Sparkles className="h-4 w-4" />
                    AI Coach
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  🏃‍♀️ Week Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <p className="text-sm font-medium mb-1">Workouts this week</p>
                  <p className="text-2xl font-bold text-primary">{workoutsThisWeek}/5</p>
                  <Progress value={(workoutsThisWeek / 5) * 100} className="h-1 bg-primary/20 mt-2" />
                </div>
                <p className="text-xs text-muted-foreground">2 days left to hit your goal!</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col items-center opacity-50 hover:opacity-100 transition-opacity">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Zone de Danger</p>
          <button 
            type="button"
            className="text-xs text-red-500 hover:text-red-400 underline underline-offset-4 decoration-red-500/30"
            onClick={async () => {
              if (confirm("Are you sure you want to permanently delete your account and all data? This cannot be undone.")) {
                const { deleteAccountAction } = await import("@/features/profile/actions");
                await deleteAccountAction();
                window.location.href = "/login";
              }
            }}
          >
            Delete Account (GDPR)
          </button>
        </div>
      </div>
      <AIChat />
    </div>
  );
}
