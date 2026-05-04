export function Badge({
  config,
  value,
}: {
  config: Record<string, { label: string; badge: string }>
  value: string
}) {
  const entry = config[value]
  if (!entry) return null
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${entry.badge}`}
    >
      {entry.label}
    </span>
  )
}
