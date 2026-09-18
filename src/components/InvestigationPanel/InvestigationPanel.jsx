import StrideSelector from '../StrideSelector/StrideSelector.jsx'

// panel under the diagram. "stage" (from App.jsx) controls what shows:
// no-threat / candidates / classify / reviewed
function InvestigationPanel({
  selectedElement,
  threat,
  stage,
  selectedCandidateId,
  onSelectCandidate,
  onSubmitCandidate,
  selectedStrideCategory,
  onSelectStrideCategory,
  onSubmitClassification,
  progressForSelected,
}) {
  if (!selectedElement) {
    return (
      <p className="text-slate-500 text-sm">
        Click a component or a numbered data flow above to begin investigating it.
      </p>
    )
  }

  const isReviewing = stage === 'reviewed'
  // when reviewing, use what was actually saved, not whatever is in local state
  const displayedCandidateId = isReviewing ? progressForSelected?.candidateId : selectedCandidateId
  const displayedStrideCategory = isReviewing
    ? progressForSelected?.strideCategory
    : selectedStrideCategory

  return (
    <div>
      <h3 className="font-semibold text-amber-400">
        {selectedElement.name || selectedElement.label}
      </h3>
      <p className="text-slate-300 text-sm mt-1">{selectedElement.description}</p>

      {stage === 'no-threat' && (
        <p className="text-slate-500 text-sm mt-3 italic">
          Nothing suspicious is being tracked at this point for this exercise.
          Try investigating a different part of the architecture.
        </p>
      )}

      {threat && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-sm font-medium text-slate-200 mb-2">{threat.prompt}</p>

          {stage === 'candidates' && (
            <>
              <div className="flex flex-col gap-2">
                {threat.candidates.map((candidate) => {
                  const isChosen = selectedCandidateId === candidate.id
                  return (
                    <button
                      key={candidate.id}
                      type="button"
                      onClick={() => onSelectCandidate(candidate.id)}
                      className={
                        isChosen
                          ? 'text-left text-sm px-3 py-2 rounded border bg-amber-400 text-slate-900 border-amber-300'
                          : 'text-left text-sm px-3 py-2 rounded border bg-slate-800 text-slate-200 border-slate-600 hover:border-amber-400'
                      }
                    >
                      {candidate.text}
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={onSubmitCandidate}
                disabled={!selectedCandidateId}
                className={
                  selectedCandidateId
                    ? 'mt-3 px-4 py-2 rounded bg-amber-400 text-slate-900 text-sm font-semibold hover:bg-amber-300'
                    : 'mt-3 px-4 py-2 rounded bg-slate-700 text-slate-400 text-sm font-semibold cursor-not-allowed'
                }
              >
                Submit finding
              </button>
            </>
          )}

          {(stage === 'classify' || isReviewing) && (
            <>
              <div className="mb-3">
                <p className="text-sm text-slate-400">
                  Your finding:{' '}
                  <span className="text-slate-200">
                    {threat.candidates.find((c) => c.id === displayedCandidateId)?.text}
                  </span>
                </p>
                {isReviewing && (
                  <p
                    className={
                      threat.candidates.find((c) => c.id === displayedCandidateId)?.isCorrect
                        ? 'text-xs text-emerald-400 mt-1'
                        : 'text-xs text-rose-400 mt-1'
                    }
                  >
                    {threat.candidates.find((c) => c.id === displayedCandidateId)?.isCorrect
                      ? '✓ This was the security-relevant finding for this element.'
                      : '✕ This was not the security-relevant finding for this element.'}
                  </p>
                )}
              </div>

              <StrideSelector
                selectedCategory={displayedStrideCategory}
                onSelectCategory={onSelectStrideCategory}
                disabled={isReviewing}
                correctCategory={isReviewing ? threat.correctStrideCategory : undefined}
              />

              {stage === 'classify' && (
                <button
                  type="button"
                  onClick={onSubmitClassification}
                  disabled={!selectedStrideCategory}
                  className={
                    selectedStrideCategory
                      ? 'mt-3 px-4 py-2 rounded bg-amber-400 text-slate-900 text-sm font-semibold hover:bg-amber-300'
                      : 'mt-3 px-4 py-2 rounded bg-slate-700 text-slate-400 text-sm font-semibold cursor-not-allowed'
                  }
                >
                  Submit classification
                </button>
              )}

              {isReviewing && progressForSelected && (
                <div
                  className={
                    progressForSelected.correct
                      ? 'mt-4 p-3 rounded border bg-emerald-500/10 border-emerald-500/40'
                      : 'mt-4 p-3 rounded border bg-rose-500/10 border-rose-500/40'
                  }
                >
                  <p
                    className={
                      progressForSelected.correct
                        ? 'text-sm font-semibold text-emerald-400'
                        : 'text-sm font-semibold text-rose-400'
                    }
                  >
                    {progressForSelected.correct
                      ? `Correct! +${progressForSelected.pointsAwarded} points`
                      : `Not quite -- +0 points`}
                  </p>
                  <p className="text-sm text-slate-300 mt-2">{threat.explanation}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default InvestigationPanel
