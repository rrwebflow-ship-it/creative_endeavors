export default function ExerciseCard({ name, sets, reps, type }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[#2A2A2A] hover:bg-[#222220] transition-colors">
      <div className="min-w-0">
        <p className="font-[family-name:var(--font-body)] text-[#F0EDE6] text-base">{name}</p>
        <p className="font-[family-name:var(--font-body)] text-[#888780] text-xs uppercase mt-0.5">{type}</p>
      </div>
      <div className="flex-shrink-0 ml-4 bg-[#252520] border border-[#2A2A2A] px-3 py-1.5 font-[family-name:var(--font-body)] text-[#F0EDE6] text-sm whitespace-nowrap">
        {sets} × {reps}
      </div>
    </div>
  );
}
