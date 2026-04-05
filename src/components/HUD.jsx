import { LEVELS } from '../utils/cards.js'

function formatTime(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function HUD({ level, moves, seconds, matched }) {
  const totalPairs = LEVELS[level].pairs
  const foundPairs = matched.length / 2

  return (
    <div className="hud">
      <div className="hud__badge">
        🌈 Level {level + 1}
      </div>
      <div className="hud__stat">
        ⏱ {formatTime(seconds)}
      </div>
      <div className="hud__stat">
        👆 {moves} moves
      </div>
      <div className="hud__stat hud__pairs">
        🥚 {foundPairs} / {totalPairs} pairs
      </div>
    </div>
  )
}
