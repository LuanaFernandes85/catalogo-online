
export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="relative">
      <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        <button
          type="button"
          onClick={() => onChange('all')}
          className={`focus-ring shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
            active === 'all'
              ? 'border-ink-950 bg-ink-950 text-white shadow-sm'
              : 'border-ink-950/10 bg-white text-ink-700 hover:border-ink-950/20 hover:bg-ink-950/5'
          }`}
        >
          Todos
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className={`focus-ring shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
              active === category.id
                ? 'border-ink-950 bg-ink-950 text-white shadow-sm'
                : 'border-ink-950/10 bg-white text-ink-700 hover:border-ink-950/20 hover:bg-ink-950/5'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}