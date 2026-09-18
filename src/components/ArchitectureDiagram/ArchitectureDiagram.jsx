import ComponentNode from './ComponentNode.jsx'
import FlowArrow from './FlowArrow.jsx'

// draws the whole architecture as one svg - components + flows between them
function ArchitectureDiagram({ scenario, selectedElementId, onSelectElement, investigatedMap = {} }) {
  const { components, flows } = scenario.architecture

  function findComponent(componentId) {
    return components.find((component) => component.id === componentId)
  }

  return (
    <svg
      viewBox="0 0 940 400"
      className="w-full h-auto bg-slate-900 rounded-lg border border-slate-700"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="4"
          orient="auto"
        >
          <polygon points="0 0, 8 4, 0 8" className="fill-slate-400" />
        </marker>
      </defs>

      {/* flows first so the boxes sit on top of the lines */}
      {flows.map((flow) => (
        <FlowArrow
          key={flow.id}
          flow={flow}
          fromComponent={findComponent(flow.from)}
          toComponent={findComponent(flow.to)}
          isSelected={selectedElementId === flow.id}
          onClick={onSelectElement}
          investigated={investigatedMap[flow.id]}
        />
      ))}

      {components.map((component) => (
        <ComponentNode
          key={component.id}
          component={component}
          isSelected={selectedElementId === component.id}
          onClick={onSelectElement}
          investigated={investigatedMap[component.id]}
        />
      ))}
    </svg>
  )
}

export default ArchitectureDiagram
