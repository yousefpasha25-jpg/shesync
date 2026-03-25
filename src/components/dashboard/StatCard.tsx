
interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
}

export function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <div className="bg-card-dark border border-white/5 p-4 rounded-lg space-y-1 group hover:border-primary/30 transition-all cursor-pointer hover:bg-white/[0.02]">
      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest group-hover:text-primary transition-colors">{label}</p>
      <p className="text-lg font-bold text-white group-hover:scale-105 transition-transform origin-left">
        {value} {unit && <span className="text-[10px] text-slate-400 font-normal ml-1">{unit}</span>}
      </p>
    </div>
  );
}
