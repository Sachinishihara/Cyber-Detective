import { NODE_WIDTH, NODE_HEIGHT } from './layout.js'

// draws a line between two components for one data flow, with a numbered
// circle in the middle and a check/x badge once it's been investigated
function FlowArrow({ flow, fromComponent, toComponent, isSelected, onClick, investigated }) {
  const startX = fromComponent.position.x + NODE_WIDTH
  const startY = fromComponent.position.y + NODE_HEIGHT / 2
  const endX = toComponent.position.x
  const endY = toComponent.position.y + NODE_HEIGHT / 2

  const midX = (startX + endX) / 2
  const midY = (startY + endY) / 2

  // flow-4 overlaps flow-3 (same two components) so nudge it down a bit
  const verticalOffset = flow.id === 'flow-4-dbwrite' ? 30 : 0

  let lineClassName = isSelected ? 'stroke-amber-400' : 'stroke-slate-400'
  if (!isSelected && investigated === 'correct') lineClassName = 'stroke-emerald-500'
  if (!isSelected && investigated === 'incorrect') lineClassName = 'stroke-rose-500'

  let circleClassName = isSelected ? 'fill-amber-400' : 'fill-slate-600'
  if (!isSelected && investigated === 'correct') circleClassName = 'fill-emerald-600'
  if (!isSelected && investigated === 'incorrect') circleClassName = 'fill-rose-600'

  const badgeX = midX + 18
  const badgeY = midY - 18 + verticalOffset

  return (
    <g
      onClick={() => onClick(flow.id)}
      className="cursor-pointer"
      role="button"
      aria-label={
        investigated ? `Review investigated flow: ${flow.label}` : `Investigate flow: ${flow.label}`
      }
    >
      {/* invisible thick line so it's easier to click than the thin visible one */}
      <line
        x1={startX}
        y1={startY + verticalOffset}
        x2={endX}
        y2={endY + verticalOffset}
        stroke="transparent"
        strokeWidth={20}
      />
      <line
        x1={startX}
        y1={startY + verticalOffset}
        x2={endX}
        y2={endY + verticalOffset}
        className={lineClassName}
        strokeWidth={isSelected ? 3 : 2}
        markerEnd="url(#arrowhead)"
      />
      <circle cx={midX} cy={midY + verticalOffset} r={12} className={circleClassName} />
      <text
        x={midX}
        y={midY + verticalOffset}
        textAnchor="middle"
        dominantBaseline="middle"
        className={
          isSelected
            ? 'fill-slate-900 text-xs font-bold select-none'
            : 'fill-slate-100 text-xs font-bold select-none'
        }
      >
        {flow.order}
      </text>

      {investigated && (
        <g>
          <circle
            cx={badgeX}
            cy={badgeY}
            r={9}
            className={investigated === 'correct' ? 'fill-emerald-500' : 'fill-rose-500'}
            stroke="white"
            strokeWidth={1.5}
          />
          <text
            x={badgeX}
            y={badgeY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white text-[10px] font-bold select-none"
          >
            {investigated === 'correct' ? '\u2713' : '\u2715'}
          </text>
        </g>
      )}
    </g>
  )
}

export default FlowArrow
