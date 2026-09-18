import { useEffect, useState } from 'react'
import ArchitectureDiagram from './components/ArchitectureDiagram/ArchitectureDiagram.jsx'
import InvestigationPanel from './components/InvestigationPanel/InvestigationPanel.jsx'
import ResultsScreen from './components/ResultsScreen/ResultsScreen.jsx'
import scenario from './data/scenarios/scenario-online-banking.json'

const STORAGE_KEY = 'cyberDetective_progress'

// grab saved progress from localStorage if there is any for this scenario
function loadInitialProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const saved = JSON.parse(raw)
    if (!saved || saved.scenarioId !== scenario.id || typeof saved.progress !== 'object') {
      return {}
    }
    return saved.progress
  } catch {
    return {}
  }
}

function App() {
  const [selectedElementId, setSelectedElementId] = useState(null)
  const [selectedCandidateId, setSelectedCandidateId] = useState(null)
  const [candidateSubmitted, setCandidateSubmitted] = useState(false)
  const [selectedStrideCategory, setSelectedStrideCategory] = useState(null)
  const [progress, setProgress] = useState(loadInitialProgress)

  // save progress every time it changes so refreshing doesn't reset everything
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ scenarioId: scenario.id, progress })
      )
    } catch {
      // if localStorage is unavailable (private mode etc) just skip saving
    }
  }, [progress])

  const selectedElement = findElementById(scenario, selectedElementId)
  const threat = findThreatForElement(scenario, selectedElementId)
  const progressForSelected = selectedElementId ? progress[selectedElementId] : null

  const totalThreats = scenario.threats.length
  const threatsFound = Object.keys(progress).length
  const score = Object.values(progress).reduce((sum, p) => sum + p.pointsAwarded, 0)
  const allInvestigated = threatsFound === totalThreats

  const investigatedMap = Object.fromEntries(
    Object.entries(progress).map(([elementId, record]) => [
      elementId,
      record.correct ? 'correct' : 'incorrect',
    ])
  )

  function getStage() {
    if (!threat) return 'no-threat'
    if (progressForSelected) return 'reviewed'
    if (!candidateSubmitted) return 'candidates'
    return 'classify'
  }

  function handleSelectElement(elementId) {
    setSelectedElementId(elementId)
    setSelectedCandidateId(null)
    setCandidateSubmitted(false)
    setSelectedStrideCategory(null)
  }

  function handleSubmitClassification() {
    if (!threat || !selectedStrideCategory || !selectedElementId) return

    setProgress((prev) => {
      // don't let this fire twice for the same element (double click etc)
      if (prev[selectedElementId]) return prev

      const candidate = threat.candidates.find((c) => c.id === selectedCandidateId)
      const isCorrect =
        Boolean(candidate?.isCorrect) && selectedStrideCategory === threat.correctStrideCategory

      return {
        ...prev,
        [selectedElementId]: {
          candidateId: selectedCandidateId,
          strideCategory: selectedStrideCategory,
          correct: isCorrect,
          pointsAwarded: isCorrect ? threat.points : 0,
        },
      }
    })
  }

  function handleReset() {
    setProgress({})
    setSelectedElementId(null)
    setSelectedCandidateId(null)
    setCandidateSubmitted(false)
    setSelectedStrideCategory(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-amber-400">Cyber Detective</h1>
            <p className="text-slate-400 text-sm mt-1">
              STRIDE-based threat modeling trainer
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm bg-slate-900 border border-slate-700 rounded-lg px-4 py-2">
              <span className="text-slate-300">
                Score: <span className="font-semibold text-amber-400">{score}</span>
              </span>
              <span className="text-slate-300">
                Threats found:{' '}
                <span className="font-semibold text-amber-400">
                  {threatsFound}/{totalThreats}
                </span>
              </span>
              <span className="text-slate-300 capitalize">
                Difficulty: <span className="font-semibold text-slate-100">{scenario.difficulty}</span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="text-sm px-3 py-2 rounded border border-slate-600 text-slate-300 hover:border-amber-400 hover:text-amber-400 whitespace-nowrap"
            >
              Restart
            </button>
          </div>
        </header>

        <section className="mb-4">
          <h2 className="text-lg font-semibold">{scenario.title}</h2>
          <p className="text-slate-400 text-sm">{scenario.description}</p>
        </section>

        <ArchitectureDiagram
          scenario={scenario}
          selectedElementId={selectedElementId}
          onSelectElement={handleSelectElement}
          investigatedMap={investigatedMap}
        />

        <section className="mt-4 p-4 bg-slate-900 border border-slate-700 rounded-lg min-h-[96px]">
          <InvestigationPanel
            selectedElement={selectedElement}
            threat={threat}
            stage={getStage()}
            selectedCandidateId={selectedCandidateId}
            onSelectCandidate={setSelectedCandidateId}
            onSubmitCandidate={() => setCandidateSubmitted(true)}
            selectedStrideCategory={selectedStrideCategory}
            onSelectStrideCategory={setSelectedStrideCategory}
            onSubmitClassification={handleSubmitClassification}
            progressForSelected={progressForSelected}
          />
        </section>
      </div>

      {allInvestigated && (
        <ResultsScreen scenario={scenario} progress={progress} score={score} onRestart={handleReset} />
      )}
    </div>
  )
}

function findElementById(scenario, elementId) {
  if (!elementId) return null
  const { components, flows } = scenario.architecture
  return (
    components.find((component) => component.id === elementId) ||
    flows.find((flow) => flow.id === elementId)
  )
}

function findThreatForElement(scenario, elementId) {
  if (!elementId) return null
  return scenario.threats.find((threat) => threat.targetElementId === elementId)
}

export default App
