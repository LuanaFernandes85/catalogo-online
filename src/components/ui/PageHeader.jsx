export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-950">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-700/70">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
