"use client";

export function NutritionPreview() {
  return (
    <section className="bg-card-dark border border-white/5 p-6 rounded-xl flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer hover:bg-white/[0.02]">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-primary">restaurant</span>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Next Meal</p>
          <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors">Grilled Salmon & Quinoa</p>
        </div>
      </div>
      <button className="h-8 w-8 flex items-center justify-center rounded-md border border-white/10 text-slate-400 group-hover:text-white group-hover:border-white/30 transition-all">
        <span className="material-symbols-outlined text-lg">chevron_right</span>
      </button>
    </section>
  );
}
