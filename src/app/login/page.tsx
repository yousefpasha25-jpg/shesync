"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Welcome back",
          description: "Login successful. Synchronizing your bio-data...",
        });
        router.push("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        toast({
          title: "Account created",
          description: "Please check your email to verify your account or proceed to onboarding.",
        });
        router.push("/onboarding");
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-[#050505]">
      {/* Background Aesthetic */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b]/20 to-transparent"></div>
        <Image 
          src="https://images.unsplash.com/photo-1541534741688-6078c64b5903?q=80&w=2670&auto=format&fit=crop" 
          alt="Fitness" 
          fill
          priority
          className="object-cover opacity-20 grayscale"
          sizes="100vw"
        />
        <div className="absolute inset-0 backdrop-blur-[2px]"></div>
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card p-8 md:p-10 space-y-8 animate-in fade-in zoom-in duration-500">
          <header className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white uppercase">
              {isLogin ? "Sign In" : "Join Awdin"}
            </h1>
            <p className="text-slate-400 text-sm tracking-wide">
              {isLogin ? "Welcome to your elite performance portal" : "Begin your hyper-personalized bio-journey"}
            </p>
          </header>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-md py-4 px-5 text-white text-sm focus:border-primary/50 focus:ring-0 transition-all placeholder:text-slate-600"
                placeholder="sara@awdin.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-md py-4 px-5 text-white text-sm focus:border-primary/50 focus:ring-0 transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-md shadow-lg shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="tracking-[0.2em] uppercase text-xs">{isLogin ? "Continue" : "Register"}</span>
              )}
            </button>
          </form>

          <footer className="text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-gold hover:text-white transition-colors"
            >
              {isLogin ? "Create an elite account" : "Back to member login"}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
