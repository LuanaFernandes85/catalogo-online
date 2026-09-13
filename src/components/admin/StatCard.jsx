export default function StatCard({ label, value, icon: Icon, tone = 'brand' }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600',
    clay: 'bg-clay-400/15 text-clay-600',
  }
  return (
    <div className="rounded-xl2 bg-white p-5 shadow-card">
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon size={22} />
        </div>
        <div>
          <p className="text-2xl font-bold text-ink-950">{value}</p>
          <p className="text-sm text-ink-700/70">{label}</p>
        </div>
      </div>
    </div>
  )
}
