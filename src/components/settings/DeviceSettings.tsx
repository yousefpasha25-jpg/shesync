"use client";

import Link from "next/link";

interface DeviceProps {
  name: string;
  status: string;
  isConnected: boolean;
  icon: string;
}

function DeviceItem({ name, status, isConnected, icon }: DeviceProps) {
  return (
    <div className={cn("flex items-center justify-between bg-card-dark p-4 rounded-lg border border-white/5", !isConnected && "opacity-80")}>
      <div className="flex items-center gap-4">
        <div className={cn("flex items-center justify-center rounded-lg bg-white/5 size-12", isConnected ? "text-slate-300" : "text-slate-500")}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="flex flex-col">
          <p className={cn("text-sm font-semibold tracking-tight", isConnected ? "text-slate-100" : "text-slate-300")}>{name}</p>
          <p className={cn("text-[10px] font-bold tracking-widest uppercase mt-0.5", isConnected ? "text-primary" : "text-slate-500")}>
            {status}
          </p>
        </div>
      </div>
      {isConnected ? (
        <label className="relative flex h-[24px] w-[44px] cursor-pointer items-center rounded-full bg-slate-800 p-1 transition-colors has-[:checked]:bg-primary">
          <input checked className="sr-only peer" type="checkbox" readOnly />
          <div className="size-4 rounded-full bg-slate-100 transition-transform peer-checked:translate-x-5"></div>
        </label>
      ) : (
        <button className="text-[10px] font-bold tracking-widest-lg uppercase text-primary bg-primary/10 px-3 py-1.5 rounded border border-primary/20 hover:bg-primary/20 transition-colors">
          Connect
        </button>
      )}
    </div>
  );
}

export function DeviceSettings() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
      {/* Glassmorphic Header */}
      <header className="sticky top-0 z-50 glass flex items-center p-4 justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-900 dark:text-slate-100 hover:opacity-70 transition-opacity">
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </Link>
          <h2 className="text-slate-900 dark:text-slate-100 text-sm font-bold tracking-widest-lg uppercase">Connected Devices</h2>
        </div>
        <div className="flex items-center">
          <span className="text-[10px] font-bold tracking-widest text-accent-gold border border-accent-gold/30 px-2 py-0.5 rounded uppercase">SheSync Elite</span>
        </div>
      </header>

      <main className="flex-1 pb-32">
        {/* Active Sync Status Card */}
        <div className="p-4 pt-6">
          <div className="rounded-lg bg-card-dark p-5 border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-primary glow-emerald animate-pulse"></div>
                <span className="text-[10px] font-semibold text-primary tracking-widest-lg uppercase">System Live</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-slate-400 text-[10px] font-medium tracking-widest uppercase">Cloud Connectivity</p>
              <h3 className="text-slate-100 text-xl font-bold tracking-tight">Active Sync</h3>
              <p className="text-slate-500 text-xs font-normal mt-1">Last data packet received 2 minutes ago</p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-slate-100 text-xs font-bold tracking-widest-lg uppercase hover:bg-primary/90 transition-all w-full sm:w-auto">
                Force Sync Now
              </button>
            </div>
          </div>
        </div>

        {/* Wearables Section */}
        <div className="px-4 py-4">
          <h3 className="text-slate-400 text-[10px] font-bold tracking-widest-lg uppercase mb-4 px-1">Wearables & Bio-sensors</h3>
          <div className="flex flex-col gap-3">
            <DeviceItem name="Oura Ring Gen 3" status="Connected" isConnected={true} icon="fingerprint" />
            <DeviceItem name="Whoop 4.0" status="Connected" isConnected={true} icon="pulse_alert" />
            <DeviceItem name="Apple Watch Ultra" status="Not Connected" isConnected={false} icon="watch" />
          </div>
        </div>

        {/* Health Platforms Section */}
        <div className="px-4 py-4">
          <h3 className="text-slate-400 text-[10px] font-bold tracking-widest-lg uppercase mb-4 px-1">Health Ecosystem</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between bg-card-dark p-4 rounded-lg border border-white/5">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center rounded-lg bg-white/5 size-12 text-slate-300">
                  <span className="material-symbols-outlined">favorite</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-slate-100 text-sm font-semibold tracking-tight">Apple Health</p>
                  <p className="text-primary text-[10px] font-bold tracking-widest uppercase mt-0.5">Sync Active</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-600 text-sm">chevron_right</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
