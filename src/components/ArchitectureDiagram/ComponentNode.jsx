import { NODE_WIDTH, NODE_HEIGHT } from './layout.js'

// one clickable box on the diagram
function ComponentNode({ component, isSelected, onClick, investigated }) {
  const width = NODE_WIDTH
  const height = NODE_HEIGHT

  let boxClassName = 'fill-slate-800 stroke-slate-500 hover:fill-slate-700 hover:stroke-amber-400'
  if (isSelected) {
    boxClassName = 'fill-amber-400 stroke-amber-200'
  } else if (investigated === 'correct') {
    boxClassName = 'fill-slate-800 stroke-emerald-500 hover:stroke-amber-400'
  } else if (investigated === 'incorrect') {
    boxClassName = 'fill-slate-800 stroke-rose-500 hover:stroke-amber-400'
  }

  const badgeX = component.position.x + width - 4
  const badgeY = component.position.y - 4

  return (
    <g
      onClick={() => onClick(component.id)}
      className="cursor-pointer"
      role="button"
      aria-label={
        investigated
          ? `Review investigated element: ${component.name}`
          : `Investigate ${component.name}`
      }
    >
      <rect
        x={component.position.x}
        y={component.position.y}
        width={width}
        height={height}
        rx={4}
        className={boxClassName}
        strokeWidth={2}
      />
      <text
        x={component.position.x + width / 2}
        y={component.position.y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        className={
          isSelected
            ? 'fill-slate-900 text-sm font-semibold select-none'
            : 'fill-slate-100 text-sm font-semibold select-none'
        }
      >
        {component.name}
      </text>

      {investigated && (
        <g>
          <circle
            cx={badgeX}
            cy={badgeY}
            r={10}
            className={investigated === 'correct' ? 'fill-emerald-500' : 'fill-rose-500'}
            stroke="white"
            strokeWidth={1.5}
          />
          <text
            x={badgeX}
            y={badgeY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white text-xs font-bold select-none"
          >
            {investigated === 'correct' ? '\u2713' : '\u2715'}
          </text>
        </g>
      )}
    </g>
  )
}

export default ComponentNode
