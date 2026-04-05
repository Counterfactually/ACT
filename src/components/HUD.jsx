import { LEVELS } from '../utils/cards.js'

function formatTime(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function HUD({ level, moves, seconds, matched, bestTime, hintsLeft, onHint, isPeeking, hinting }) {
  const totalPairs = LEVELS[level].pairs
  const foundPairs = matched.length / 2
  const hintDisabled = hintsLeft <= 0 || isPeeking || hinting

  return (
    <div className="hud">
      <div className="hud__badge">🌈 Level {level + 1}</div>

      <div className="hud__stat">⏱ {formatTime(seconds)}</div>

      {bestTime !== undefined && (
        <div className="hud__stat hud__best">🏆 {formatTime(bestTime)}</div>
      )}

      <div className="hud__stat">👆 {moves} moves</div>

      <div className="hud__stat hud__pairs">
        🥚 {foundPairs} / {totalPairs} pairs
      </div>

      <button
        className={`btn btn--hint ${hintDisabled ? 'btn--hint-disabled' : ''}`}
        onClick={onHint}
        disabled={hintDisabled}
        title={hintsLeft <= 0 ? 'No hints left!' : `Peek at all cards (${hintsLeft} left)`}
        aria-label={`Hint — ${hintsLeft} remaining`}
      >
        💡 {hintsLeft}
      </button>
    </div>
  )
}
