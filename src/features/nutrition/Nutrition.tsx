"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Calendar, Info, Moon, Sun, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { saveWeeklyMealPlanAction, logMealAction } from "@/features/nutrition/actions";
import AddMealDialog from "./AddMealDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { BrandLogo } from "@/components/ui/BrandLogo";
import Link from "next/link";


type FoodAlternative = {
  id: string;
  category: string;
  title: string;
  color: string;
  items: string[];
};

type WeeklyMealPlan = {
  id: string;
  day_number: number;
  breakfast: string;
  snack: string;
  lunch: string;
  dinner: string;
};

export default function Nutrition() {
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [nutritionPrefs, setNutritionPrefs] = useState<any>(null);
  const [meals, setMeals] = useState<any[]>([]);
  const [foodAlternatives, setFoodAlternatives] = useState<FoodAlternative[]>([]);
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyMealPlan[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const fetchFoodAlternatives = async () => {
    try {
      const { data, error } = await supabase
        .from("food_alternatives")
        .select("id, category, title, color, items")
        .order("category");

      if (error) throw error;
      
      if (data) {
        const formattedData = data.map(item => ({
          ...item,
          items: Array.isArray(item.items) ? item.items as string[] : []
        }));
        setFoodAlternatives(formattedData);
      }
    } catch (error) {
      console.warn("Warning fetching food alternatives:", error);
      // Fallback to empty array to prevent crash
      setFoodAlternatives([]);
    }
  };

  const fetchWeeklyPlans = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("weekly_meal_plans")
        .select("id, day_number, breakfast, snack, lunch, dinner")
        .eq("user_id", userId)
        .eq("week_number", 1)
        .order("day_number");

      if (error) throw error;
      setWeeklyPlans(data || []);
    } catch (error) {
      console.warn("Warning fetching weekly plans:", error);
      setWeeklyPlans([]);
    }
  };

  const generateMealPlan = async () => {
    if (!user) return;
    setIsGeneratingPlan(true);

    try {
      const { data: profile } = await supabase.from('profiles').select('user_id, full_name, age, fitness_level, fitness_goals, equipment_access').eq('user_id', user.id).maybeSingle();
      
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_meal_plan',
          userProfile: profile
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to generate meal plan");
      }
      
      const data = await response.json();
      
      if (data.mealPlan && Array.isArray(data.mealPlan)) {
        toast({ title: "Plan Generated! 🚀", description: "Your custom AI nutrition plan is ready and saved." });
        
        // Format for Supabase
        const formattedPlans = data.mealPlan.map((day: any) => ({
          user_id: user.id,
          week_number: 1,
          day_number: day.day_number,
          breakfast: day.breakfast,
          snack: day.snack,
          lunch: day.lunch,
          dinner: day.dinner
        }));

        await saveWeeklyMealPlanAction(formattedPlans);
        
        await fetchWeeklyPlans(user.id);
      }
    } catch (error: any) {
      console.warn("Warning generating meal plan:", error);
      toast({ title: "Generation delayed", description: error.message || "The AI is busy, please try again soon.", variant: "destructive" });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const fetchMeals = async (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from("meals")
      .select("id, meal_type, notes, kcal, protein, carbs, fat, created_at")
      .eq("user_id", userId)
      .eq("date", today)
      .order("created_at", { ascending: false });

    if (data) {
      setMeals(data);
      const totals = data.reduce((acc, meal) => ({
        calories: acc.calories + (meal.kcal || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fats: acc.fats + (meal.fat || 0)
      }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
      setTotals(totals);
    }
  };

  const handleLogSuggestedMeal = async (type: string, content: string) => {
    if (!user) return;
    
    // Estimate calories based on type if not provided (simplified)
    const kcalMap:Record<string, number> = { "breakfast": 400, "snack": 200, "lunch": 600, "dinner": 500 };
    
    try {
      await logMealAction({
        meal_type: type,
        notes: content,
        kcal: kcalMap[type] || 500,
        date: new Date().toISOString().split('T')[0]
      });
      
      toast({ title: "Meal Logged! 🥗", description: `Added ${type} to your daily intake.` });
      await fetchMeals(user.id);
    } catch (err) {
      toast({ title: "Error", description: "Failed to log meal", variant: "destructive" });
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push("/login");
        return;
      }
      setUser(authUser);
      
      // Fetch nutrition preferences
      const { data: nutritionData } = await supabase
        .from("nutrition_prefs")
        .select("diet_rules, meal_frequency, water_liters, goals")
        .eq("user_id", authUser.id)
        .maybeSingle();
      
      setNutritionPrefs(nutritionData);

      await Promise.all([
        fetchMeals(authUser.id),
        fetchFoodAlternatives(),
        fetchWeeklyPlans(authUser.id)
      ]);
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  // Realtime subscription for weekly meal plans
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('weekly-meal-plans-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weekly_meal_plans',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            fetchWeeklyPlans(user.id);
          } else if (payload.eventType === 'DELETE') {
            setWeeklyPlans(prev => prev.filter(p => p.id !== (payload.old as any).id));
          }
          // Only notify on INSERT (new plan generated), not on every sync event
          if (payload.eventType === 'INSERT') {
            toast({
              title: "تم التحديث",
              description: "تم تحديث الخطة الغذائية بنجاح",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <BrandLogo size="lg" withText={false} className="animate-pulse mb-4" />
        <p className="text-muted-foreground">Preparing your SheSync Nutrition Plan...</p>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BrandLogo size="sm" withText={false} />
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">Nutrition</h1>
            {nutritionPrefs && (
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                {nutritionPrefs.meal_frequency?.replace('_', ' ') || '3 meals'} • Water goal: {nutritionPrefs.water_liters}L
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="tracker" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="tracker">Daily Tracker</TabsTrigger>
            <TabsTrigger value="alternatives">Food Alternatives</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Plan</TabsTrigger>
          </TabsList>

          {/* Daily Tracker Tab */}
          <TabsContent value="tracker" className="space-y-6">
            {/* Today's Suggested section */}
            {weeklyPlans.length > 0 && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Today's AI Suggestion
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px]">Day {new Date().getDay() === 0 ? 7 : new Date().getDay()}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const todayNum = new Date().getDay() === 0 ? 7 : new Date().getDay();
                    const todayPlan = weeklyPlans.find(p => p.day_number === todayNum);
                    if (!todayPlan) return <p className="text-xs text-muted-foreground">No suggestion for today.</p>;
                    
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { type: "breakfast", content: todayPlan.breakfast },
                          { type: "snack", content: todayPlan.snack },
                          { type: "lunch", content: todayPlan.lunch },
                          { type: "dinner", content: todayPlan.dinner },
                        ].map((m) => (
                          <div key={m.type} className="p-3 rounded-lg bg-background/50 border flex items-center justify-between group">
                            <div className="flex-1">
                              <p className="text-[10px] uppercase font-bold text-primary mb-1">{m.type}</p>
                              <p className="text-xs line-clamp-2">{m.content}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 text-[10px] px-2"
                              onClick={() => handleLogSuggestedMeal(m.type, m.content)}
                            >
                              Log It
                            </Button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Today's Nutrition</CardTitle>
                {user && <AddMealDialog userId={user.id} onMealAdded={() => fetchMeals(user.id)} />}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Calories</span>
                      <span className="text-sm text-muted-foreground">
                        {totals.calories} / {nutritionPrefs?.water_liters ? Math.round(nutritionPrefs.water_liters * 500) : 2000} kcal
                      </span>
                    </div>
                    <Progress value={(totals.calories / (nutritionPrefs?.water_liters ? nutritionPrefs.water_liters * 500 : 2000)) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Protein</span>
                      <span className="text-sm text-muted-foreground">{totals.protein.toFixed(1)} / 120 g</span>
                    </div>
                    <Progress value={(totals.protein / 120) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Carbs</span>
                      <span className="text-sm text-muted-foreground">{totals.carbs.toFixed(1)} / 200 g</span>
                    </div>
                    <Progress value={(totals.carbs / 200) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Fats</span>
                      <span className="text-sm text-muted-foreground">{totals.fats.toFixed(1)} / 65 g</span>
                    </div>
                    <Progress value={(totals.fats / 65) * 100} className="h-2" />
                  </div>
                  {nutritionPrefs?.goals && nutritionPrefs.goals.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        <strong>Nutrition Goals:</strong> {nutritionPrefs.goals.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Meals</CardTitle>
              </CardHeader>
              <CardContent>
                {meals.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No meals logged today</p>
                ) : (
                  <div className="space-y-3">
                    {meals.map((meal) => (
                      <div key={meal.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium capitalize">{meal.meal_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {meal.notes} • {meal.kcal} kcal
                          </p>
                          {(meal.protein || meal.carbs || meal.fat) && (
                            <p className="text-xs text-muted-foreground mt-1">
                              P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Food Alternatives Tab */}
          <TabsContent value="alternatives" className="space-y-6">
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Food Alternatives
                </CardTitle>
                <CardDescription>
                  دليل شامل للحصص الغذائية والبدائل الصحية
                </CardDescription>
              </CardHeader>
            </Card>

            {foodAlternatives.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">Loading alternatives...</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {foodAlternatives.map((category) => (
                  <Card key={category.id} className="overflow-hidden">
                    <CardHeader className={`${category.color} text-white`}>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-2">
                        {category.items.map((item: string, idx: number) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span className="text-right w-full">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Weekly Plan Tab */}
          <TabsContent value="weekly" className="space-y-6">
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  الخطة الأسبوعية
                </CardTitle>
                <CardDescription>
                  خطة وجبات لمدة 6 أيام
                </CardDescription>
              </CardHeader>
            </Card>

            {!weeklyPlans.length && !isGeneratingPlan ? (
              <Card className="mb-6 border-primary/20 bg-card/60 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl mb-2">Ready for your custom meal plan?</CardTitle>
                  <CardDescription>Generate a hyper-personalized 7-day nutrition schedule using SheSync AI.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-8 p-6">
                  <Button size="lg" onClick={generateMealPlan} className="gap-2 text-lg px-8 py-6 rounded-xl hover:scale-105 transition-transform bg-primary">
                    <Sparkles className="h-5 w-5" /> Generate Meal Plan
                  </Button>
                </CardContent>
              </Card>
            ) : isGeneratingPlan ? (
              <Card className="mb-6 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" /> AI is crafting your nutrition plan...
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
                {weeklyPlans.map((day) => (
                  <Card key={day.id}>
                    <CardHeader className="bg-muted/30">
                      <div className="flex items-center justify-between">
                        <CardTitle>اليوم {day.day_number}</CardTitle>
                        <Badge variant="outline">4 وجبات</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <div className="font-semibold text-sm text-primary">الإفطار</div>
                          <p className="text-sm text-right">{day.breakfast}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="font-semibold text-sm text-primary">سناك</div>
                          <p className="text-sm text-right">{day.snack}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="font-semibold text-sm text-primary">الغداء</div>
                          <p className="text-sm text-right">{day.lunch}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="font-semibold text-sm text-primary">العشاء</div>
                          <p className="text-sm text-right">{day.dinner}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
