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

    // Validate env vars are loaded before attempting network call
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      console.error("[Auth] Missing env vars:", { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey });
      toast({
        title: "Configuration Error",
        description: "App is not properly configured. Please contact support.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    console.info("[Auth] Supabase env vars loaded. URL:", supabaseUrl.slice(0, 30) + "...");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({
          title: "Welcome back",
          description: "Login successful. Synchronizing your bio-data...",
        });
        router.push("/dashboard");
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
    } catch (error: unknown) {
      // TypeError: "Failed to fetch" = network/CORS issue, not an auth error
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("[Auth] Network error — cannot reach Supabase:", error);
        toast({
          title: "Network Error",
          description: "Cannot connect to the server. Check your internet connection or try again in a moment.",
          variant: "destructive",
        });
      } else {
        const msg = error instanceof Error ? error.message : "Something went wrong. Please try again.";
        console.error("[Auth] Auth error:", msg);
        toast({
          title: "Authentication Error",
          description: msg,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-[#050505]">
      {/* Background Aesthetic */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
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

          {/* TODO: Add Cloudflare Turnstile CAPTCHA here to prevent brute-force.
              Integration: https://developers.cloudflare.com/turnstile/get-started/
              1. npm install @marsidev/react-turnstile
              2. Wrap form with <Turnstile siteKey={process.env.NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY} onSuccess={setToken} />
              3. Verify token server-side in handleAuth before calling supabase.auth */}
          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
              <input
                id="email"
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-md py-4 px-5 text-white text-sm focus:border-primary/50 focus:outline-none transition-all placeholder:text-slate-600"
                placeholder="sara@shesync.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
              <input
                id="password"
                required
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-md py-4 px-5 text-white text-sm focus:border-primary/50 focus:outline-none transition-all placeholder:text-slate-600"
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
