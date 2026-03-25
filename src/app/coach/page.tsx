"use client";

import { useState, useRef, useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/** Typed message interface for coach conversations. */
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function CoachPage() {
  const { onboardingData, user } = useUserStore();
  const firstName = user?.fullName?.split(" ")[0] || "Champ";
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Welcome back, ${firstName}. I've synchronized with your SheSync profile. Your biometrics suggest a high-readiness state today. How can I assist your protocol?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          userProfile: {
            firstName,
            fitnessLevel: onboardingData.fitnessLevel?.currentLevel,
            primaryGoal: onboardingData.fitnessGoals?.primaryGoal,
            cyclePhase: onboardingData.cycle?.trackCycle ? "Follicular" : "General", 
            equipment: onboardingData.equipment?.availableEquipment,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        throw new Error("Empty response from AI Coach");
      }
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "Connection error";
      console.error("Coach Sync Error:", error);
      toast({
        title: "Coach Sync Failed",
        description: errorMsg,
        variant: "destructive",
      });
      // Add an error message to the conversation so the user sees feedback inline
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having difficulty connecting right now. Please try your question again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)]">
      <header className="px-6 py-4 border-b border-white/5 bg-background-dark/50 backdrop-blur-sm z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Coach Concierge</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="size-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium italic">SheSync AI Active</span>
            </div>
          </div>
          <div className="size-10 rounded-sm bg-secondary/10 border border-secondary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary text-[20px]">architecture</span>
          </div>
        </div>
      </header>

      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex flex-col gap-2 max-w-[85%]", msg.role === "user" && "ml-auto items-end text-right")}>
            <div className={cn(
              "p-4 rounded-sm border transition-all duration-500",
              msg.role === "assistant" 
                ? "bg-secondary/5 rounded-bl-none border-secondary/20 text-slate-200" 
                : "bg-white/5 rounded-br-none border-white/5 text-slate-300"
            )}>
              <p className="text-sm leading-relaxed tracking-wide">{msg.content}</p>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-slate-600 font-bold px-1">
              {msg.role === "assistant" ? "SheSync AI" : "You"}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3 text-slate-500">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-secondary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-secondary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-secondary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Synchronizing...</span>
          </div>
        )}
      </main>

      <div className="p-6 bg-background-dark/80 backdrop-blur-xl border-t border-white/5">
        <div className="relative flex items-center bg-white/5 rounded-sm border border-white/10 p-1.5 group focus-within:border-secondary/40 transition-all duration-300">
          <input 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-4 text-white placeholder:text-slate-600 tracking-tight" 
            placeholder="Inquire about your protocol..." 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            className="bg-secondary text-black size-10 rounded-sm flex items-center justify-center hover:bg-secondary/80 transition-all active:scale-90 disabled:opacity-50 disabled:grayscale"
            disabled={isLoading}
          >
            <span className="material-symbols-outlined text-[20px] font-bold">arrow_upward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
