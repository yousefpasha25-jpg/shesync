"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";

export default function ProfilePage() {
  const { user, logout, onboardingData } = useUserStore();
  const router = useRouter();
  const { toast } = useToast();
  
  // Uses shared singleton from @/lib/supabase/client

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      logout(); // Clear Zustand store
      toast({
        title: "Signed Out",
        description: "Your session has been securely closed.",
      });
      router.push("/login");
    }
  };

  const firstName = user?.fullName?.split(" ")[0] || "Champion";

  return (
    <div className="px-6 pt-12 space-y-10 pb-32">
      {/* Profile Header */}
      <header className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-accent-gold rounded-full blur opacity-40"></div>
          <div className="relative size-24 rounded-full bg-slate-800 border-2 border-white/10 flex items-center justify-center overflow-hidden">
             <span className="material-symbols-outlined text-4xl text-slate-500">person</span>
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">{user?.fullName || "Elite Member"}</h1>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">Synchronized Since 2026</p>
        </div>
      </header>

      {/* Fitness Profile Section */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Your Bio-Profile</h2>
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-card-dark border border-white/5 p-4 rounded-xl flex items-center justify-between">
            <span className="text-sm text-slate-400">Primary Goal</span>
            <span className="text-sm font-semibold text-white uppercase tracking-wider">
              {onboardingData.fitnessGoals?.primaryGoal?.replace("_", " ") || "Not Set"}
            </span>
          </div>
          <div className="bg-card-dark border border-white/5 p-4 rounded-xl flex items-center justify-between">
            <span className="text-sm text-slate-400">Fitness Level</span>
            <span className="text-sm font-semibold text-white uppercase tracking-wider">
              {onboardingData.fitnessLevel?.currentLevel || "Not Set"}
            </span>
          </div>
          <div className="bg-card-dark border border-white/5 p-4 rounded-xl flex items-center justify-between">
            <span className="text-sm text-slate-400">Dietary Style</span>
            <span className="text-sm font-semibold text-white uppercase tracking-wider">
              {onboardingData.nutrition?.dietaryPreference?.replace("_", " ") || "Not Set"}
            </span>
          </div>
        </div>
      </section>

      {/* Account Actions */}
      <section className="space-y-4 pt-4">
         <button
          onClick={() => router.push("/settings/devices")}
          className="w-full bg-card-dark border border-white/5 p-4 rounded-xl flex items-center gap-4 group hover:border-white/10 transition-all"
        >
          <span className="material-symbols-outlined text-slate-400 group-hover:text-white transition-colors">settings</span>
          <span className="text-sm font-medium text-slate-200">Account Settings</span>
        </button>
        
        <button 
          onClick={handleSignOut}
          className="w-full bg-red-900/10 border border-red-900/20 p-4 rounded-xl flex items-center gap-4 group hover:bg-red-900/20 transition-all text-red-400"
        >
          <span className="material-symbols-outlined group-hover:scale-110 transition-transform">logout</span>
          <span className="text-sm font-bold uppercase tracking-widest">Sign Out Securely</span>
        </button>
      </section>

      {/* Philosophy Footer */}
      <footer className="pt-8 text-center opacity-30">
        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">The Future of Female Performance</p>
      </footer>
    </div>
  );
}
