"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send, User, Moon, Sun, Sparkles, Target, Activity, Apple } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";


type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AICoach() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setCurrentUser(user);

      // Fetch all user data
      const [profile, healthMetrics, goals, fitnessPrefs, nutritionPrefs, equipmentAccess] = await Promise.all([
        supabase.from("profiles").select("full_name, age").eq("user_id", user.id).maybeSingle(),
        supabase.from("health_metrics").select("weight, height").eq("user_id", user.id).maybeSingle(),
        supabase.from("user_goals").select("goal").eq("user_id", user.id),
        supabase.from("fitness_prefs").select("level, frequency_days_per_week").eq("user_id", user.id).maybeSingle(),
        supabase.from("nutrition_prefs").select("meal_frequency, diet_rules").eq("user_id", user.id).maybeSingle(),
        supabase.from("equipment_access").select("equipment").eq("user_id", user.id).maybeSingle(),
      ]);

      setUserData({
        profile: { ...profile.data, weight_kg: healthMetrics.data?.weight, height_cm: healthMetrics.data?.height },
        goals: goals.data?.map((g: any) => g.goal) || [],
        fitnessPrefs: fitnessPrefs.data,
        nutritionPrefs: nutritionPrefs.data,
        equipment: equipmentAccess.data,
      });

      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const streamChat = async (userMessage: string) => {
    if (!currentUser || streaming) return;

    setStreaming(true);
    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          userProfile: userData,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("فشل الاتصال بالمساعد");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantMessage += content;
                setMessages([
                  ...newMessages,
                  { role: "assistant", content: assistantMessage },
                ]);
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.warn("Chat error:", error);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل في الاتصال بالمساعد الذكي",
      });
    } finally {
      setStreaming(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || streaming) return;
    streamChat(input.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.push("/app/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Awdan Coach
            </h1>
            <p className="text-xs text-muted-foreground">مساعدك الشخصي في اللياقة والتغذية</p>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  معلوماتك
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData?.profile && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">الاسم:</span>
                      <span className="font-medium">{userData.profile.full_name}</span>
                    </div>
                    {userData.profile.age && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">العمر:</span>
                        <span className="font-medium">{userData.profile.age} سنة</span>
                      </div>
                    )}
                    {userData.profile.weight_kg && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">الوزن:</span>
                        <span className="font-medium">{userData.profile.weight_kg} كجم</span>
                      </div>
                    )}
                    {userData.profile.height_cm && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">الطول:</span>
                        <span className="font-medium">{userData.profile.height_cm} سم</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {userData?.goals && userData.goals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5" />
                    أهدافك
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userData.goals.map((goal: string, idx: number) => (
                      <Badge key={idx} variant="secondary">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {userData?.fitnessPrefs && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5" />
                    اللياقة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {userData.fitnessPrefs.level && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">المستوى:</span>
                      <Badge variant="outline">{userData.fitnessPrefs.level}</Badge>
                    </div>
                  )}
                  {userData.fitnessPrefs.frequency_days_per_week && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">أيام التمرين:</span>
                      <span className="font-medium">{userData.fitnessPrefs.frequency_days_per_week} أيام</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {userData?.nutritionPrefs && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Apple className="h-5 w-5" />
                    التغذية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {userData.nutritionPrefs.meal_frequency && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">عدد الوجبات:</span>
                      <span className="font-medium">{userData.nutritionPrefs.meal_frequency}</span>
                    </div>
                  )}
                  {userData.nutritionPrefs.diet_rules && userData.nutritionPrefs.diet_rules.length > 0 && (
                    <div>
                      <span className="text-muted-foreground block mb-1">القيود:</span>
                      <div className="flex flex-wrap gap-1">
                        {userData.nutritionPrefs.diet_rules.map((rule: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {rule}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-180px)] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle>محادثة مع المساعد</CardTitle>
                <p className="text-sm text-muted-foreground">
                  اسأل عن أي شيء يتعلق باللياقة، التغذية، أو التمارين
                </p>
              </CardHeader>
              
              <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <Sparkles className="h-12 w-12 text-primary/50" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">مرحباً {userData?.profile?.full_name}! 👋</h3>
                      <p className="text-muted-foreground">
                        أنا مساعدك الشخصي في اللياقة والتغذية
                        <br />
                        أعرف كل معلوماتك وأهدافك
                        <br />
                        اسألني عن أي شيء وسأعطيك إجابة مخصصة لك
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setInput("اقترح لي تمرين مناسب لي اليوم")}
                      >
                        تمرين لليوم
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setInput("ما هي الوجبات المناسبة لي؟")}
                      >
                        وجبات مقترحة
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setInput("كيف أحقق أهدافي؟")}
                      >
                        نصائح للأهداف
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-3 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {streaming && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-4 py-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="اكتب سؤالك هنا..."
                    className="min-h-[60px] resize-none"
                    disabled={streaming}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || streaming}
                    size="icon"
                    className="h-[60px] w-[60px]"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
