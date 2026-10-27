export function Rating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span aria-label={`${value.toFixed(1)} de ${max}`} className="text-amber-400">
      {"★".repeat(Math.round(value))}
      <span className="text-zinc-600">{"★".repeat(max - Math.round(value))}</span>
    </span>
  );
}
