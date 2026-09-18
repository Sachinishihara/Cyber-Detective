// STRIDE is a fixed taxonomy so it's fine to just hardcode it here
const STRIDE_CATEGORIES = [
  'Spoofing',
  'Tampering',
  'Repudiation',
  'Information Disclosure',
  'Denial of Service',
  'Elevation of Privilege',
]

// six buttons for picking a STRIDE category. disabled=true switches it
// into review mode where it just shows what was right/wrong instead
function StrideSelector({ selectedCategory, onSelectCategory, disabled = false, correctCategory }) {
  function getButtonClassName(category) {
    if (disabled) {
      const isCorrectAnswer = category === correctCategory
      const isWrongPick = category === selectedCategory && category !== correctCategory
      if (isCorrectAnswer) {
        return 'text-sm font-medium px-3 py-2 rounded border bg-emerald-500 text-slate-900 border-emerald-300 cursor-default'
      }
      if (isWrongPick) {
        return 'text-sm font-medium px-3 py-2 rounded border bg-rose-500 text-slate-900 border-rose-300 cursor-default'
      }
      return 'text-sm font-medium px-3 py-2 rounded border bg-slate-800 text-slate-500 border-slate-700 cursor-default'
    }

    const isSelected = selectedCategory === category
    return isSelected
      ? 'text-sm font-medium px-3 py-2 rounded border bg-amber-400 text-slate-900 border-amber-300'
      : 'text-sm font-medium px-3 py-2 rounded border bg-slate-800 text-slate-100 border-slate-600 hover:border-amber-400'
  }

  return (
    <div>
      <p className="text-sm text-slate-400 mb-2">
        {disabled ? 'STRIDE classification:' : 'Classify this threat using STRIDE:'}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {STRIDE_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            disabled={disabled}
            onClick={() => onSelectCategory(category)}
            className={getButtonClassName(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

export default StrideSelector
