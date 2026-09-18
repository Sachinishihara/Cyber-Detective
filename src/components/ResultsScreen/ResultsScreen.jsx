// shows up once every threat has been investigated - just reads back
// the results from progress, doesn't do any grading itself
function ResultsScreen({ scenario, progress, score, onRestart }) {
  const totalThreats = scenario.threats.length
  const correctCount = scenario.threats.filter(
    (threat) => progress[threat.targetElementId]?.correct
  ).length
  const maxScore = scenario.threats.reduce((sum, threat) => sum + threat.points, 0)

  return (
    <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center px-4 py-8 z-50">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold text-amber-400">Investigation Complete</h2>
        <p className="text-slate-400 text-sm mt-1">{scenario.title}</p>

        <div className="mt-5 flex justify-center gap-8">
          <div>
            <p className="text-3xl font-bold text-slate-100">
              {score}
              <span className="text-base font-normal text-slate-500">/{maxScore}</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">Score</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-100">
              {correctCount}
              <span className="text-base font-normal text-slate-500">/{totalThreats}</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">Correctly classified</p>
          </div>
        </div>

        <div className="mt-6 text-left">
          <p className="text-sm font-medium text-slate-300 mb-2">Category breakdown</p>
          <ul className="flex flex-col gap-1.5">
            {scenario.threats.map((threat) => {
              const record = progress[threat.targetElementId]
              const isCorrect = Boolean(record?.correct)
              return (
                <li
                  key={threat.id}
                  className="flex items-center justify-between text-sm px-3 py-2 rounded bg-slate-800 border border-slate-700"
                >
                  <span className="text-slate-200">{threat.correctStrideCategory}</span>
                  <span className={isCorrect ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                    {isCorrect ? '\u2713 Correct' : '\u2715 Incorrect'}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="mt-6 w-full px-4 py-2 rounded bg-amber-400 text-slate-900 text-sm font-semibold hover:bg-amber-300"
        >
          Play again
        </button>
      </div>
    </div>
  )
}

export default ResultsScreen
