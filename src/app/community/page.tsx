"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase/client";
import { cn } from "../../lib/utils";
import { postCommunityChatAction } from "@/features/community/actions";

interface LeaderboardItem {
  user_id: string;
  full_name: string;
  points: number;
  streak: number;
}

interface ChatMessage {
  id: string;
  user_id: string;
  full_name: string;
  message: string;
  created_at: string;
}

const FALLBACK_LEADERBOARD: LeaderboardItem[] = [
  { user_id: "1", full_name: "Amira", points: 2840, streak: 12 },
  { user_id: "2", full_name: "Laila", points: 2100, streak: 8 },
  { user_id: "3", full_name: "Sara", points: 1950, streak: 5 },
  { user_id: "4", full_name: "Fatima", points: 1820, streak: 7 },
];

export default function CommunityPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>(FALLBACK_LEADERBOARD);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUser();
    fetchMessages();
    fetchLeaderboard();
    const channel = supabase
      .channel("community_chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_chat" },
        (payload: any) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from("leaderboard")
      .select("*, profiles(full_name)")
      .order("points", { ascending: false })
      .limit(10);
    
    if (data && data.length > 0) {
      setLeaderboard(data.map((item: any) => ({
        user_id: item.user_id,
        full_name: item.profiles?.full_name || "Champion",
        points: item.points,
        streak: item.current_streak
      })));
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUser({ id: user.id });
  };

  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const { data } = await supabase
        .from("community_chat")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: true })
        .limit(50);

      if (data) {
        setMessages(data.map((m: { id: string; user_id: string; message: string; created_at: string; profiles?: { full_name?: string } }) => ({
          id: m.id,
          user_id: m.user_id,
          message: m.message,
          created_at: m.created_at,
          full_name: m.profiles?.full_name || "Community Member",
        })));
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !user || isSending) return;
    setIsSending(true);
    try {
      await postCommunityChatAction(input);
      setInput("");
    } catch(err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-black">
      {/* Top Section: The Leaderboard */}
      <header className="px-6 pt-8 pb-4 space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold">The Elite Circle</p>
            <h1 className="text-2xl font-bold tracking-tight text-white">Top Champions</h1>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Week 12</p>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {leaderboard.map((item, idx) => (
            <div 
              key={item.user_id}
              className={cn(
                "shrink-0 w-32 rounded-xl p-4 border transition-all duration-500",
                idx === 0 
                  ? "bg-gradient-to-br from-[#D4A373]/20 to-black border-[#D4A373]/40 shadow-[0_0_20px_rgba(212,163,115,0.1)]" 
                  : "bg-card-dark border-white/5"
              )}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={cn(
                  "size-12 rounded-full flex items-center justify-center border-2",
                  idx === 0 ? "border-[#D4A373] bg-[#D4A373]/10" : "border-white/10 bg-white/5"
                )}>
                  <span className="text-lg font-black italic">
                    {idx === 0 ? "🏆" : idx + 1}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white uppercase tracking-tighter truncate w-24">
                    {item.full_name}
                  </p>
                  <p className={cn(
                    "text-[9px] font-bold uppercase tracking-[0.1em]",
                    idx === 0 ? "text-[#D4A373]" : "text-emerald-400"
                  )}>
                    {item.points.toLocaleString()} PTS
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px] text-orange-400">local_fire_department</span>
                  <span className="text-[9px] font-bold text-slate-500">{item.streak}D STREAK</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Bottom Section: Safe Space Chat */}
      <div className="flex-1 flex flex-col min-h-0 bg-[#0A0A0A] rounded-t-[32px] border-t border-white/5">
        <header className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">The Safe Space</h2>
          </div>
          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">24 Active Syncing</p>
        </header>

        <main
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 space-y-6 no-scrollbar pb-6"
        >
          {isLoadingMessages ? (
            <div className="space-y-4 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="size-8 rounded-full bg-white/10 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2 w-16 bg-white/10 rounded" />
                    <div className="h-8 bg-white/5 rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <span className="material-symbols-outlined text-5xl text-primary/40">forum</span>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-400">No messages yet</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-600">Be the first to inspire the collective</p>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={cn("flex gap-3", msg.user_id === user?.id && "flex-row-reverse")}>
                <div className="size-8 rounded-full bg-card-dark border border-white/10 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-primary">{msg.full_name[0]}</span>
                </div>
                <div className={cn(
                  "flex flex-col gap-1 max-w-[75%]",
                  msg.user_id === user?.id && "items-end"
                )}>
                  <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold px-1">
                    {msg.full_name.split(" ")[0]}
                  </span>
                  <div className={cn(
                    "p-3 rounded-2xl text-sm",
                    msg.user_id === user?.id 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-white/5 border border-white/10 text-slate-200 rounded-tl-none"
                  )}>
                    {msg.message}
                  </div>
                </div>
              </div>
            ))
          )}
        </main>

        <div className="p-4 bg-black/50 backdrop-blur-md border-t border-white/5">
          <div className="relative flex items-center bg-card-dark rounded-xl border border-white/10 p-1">
            <input 
              className="flex-1 bg-transparent border-none focus:ring-0 text-xs py-3 px-4 text-white placeholder:text-slate-600" 
              placeholder="Motivate the collective..." 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={isSending || !input.trim()}
              aria-label="Send message"
              className="bg-primary text-white size-10 rounded-lg flex items-center justify-center active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">{isSending ? "hourglass_empty" : "send"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
