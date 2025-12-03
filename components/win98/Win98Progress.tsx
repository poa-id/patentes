interface Win98ProgressProps {
  value: number;
  max?: number;
}

export function Win98Progress({ value, max = 100 }: Win98ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="win98-card p-1">
      <div className="h-5 bg-win98-light border border-win98-dark shadow-inner">
        <div
          className="h-full bg-blue-700"
          style={{ width: `${pct}%` }}
          aria-label="progress"
        />
      </div>
    </div>
  );
}
