interface AIInsightCardProps {
  phase: string;
  energyStatus: string;
  insight: string;
  isPeak?: boolean;
}

export function AIInsightCard({ phase, energyStatus, insight, isPeak }: AIInsightCardProps) {
  return (
    <section className="relative">
      <div className="absolute -inset-0.5 bg-primary/20 rounded-xl blur glow-emerald"></div>
      <div className="relative bg-card-dark border border-primary/40 p-6 rounded-xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">psychology</span>
              <span className="text-[11px] font-bold text-primary uppercase tracking-[0.2em]">AI Coach Insight</span>
            </div>
            <h3 className="text-xl font-semibold text-white">{phase}: {energyStatus}</h3>
          </div>
          {isPeak && (
            <span className="text-[10px] font-bold text-accent-mint bg-accent-mint/10 px-2 py-0.5 rounded uppercase tracking-tighter">
              Peak
            </span>
          )}
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">{insight}</p>
        <div className="pt-2 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-accent-mint animate-pulse"></div>
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">AI Coach Analyzing Vitals...</span>
        </div>
      </div>
    </section>
  );
}
