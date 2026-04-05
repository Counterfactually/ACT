import { LEVELS } from '../utils/cards.js'

function formatTime(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const LEVEL_MSGS = [
  "Yay! You did it! 🌸",
  "Wonderful! Keep going! 🌺",
  "Amazing work! You're a star! ⭐",
  "WOW! You're SO good at this! 🦋",
  "Almost there — one more! 🥚",
]

export default function LevelComplete({ level, stats, onNext }) {
  const isLastLevel = level >= LEVELS.length - 1
  const msg = LEVEL_MSGS[level] || "Great job! 🎉"
  const isNewRecord = stats?.isNewRecord
  const bestTime = stats?.bestTime

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Level complete">
      <div className="overlay__box level-complete">
        <div className="overlay__confetti" aria-hidden="true">
          🌸 🌈 🥚 🌺 ✨ 🌸 🌈 🥚
        </div>
        <h2 className="overlay__title">{msg}</h2>
        <p className="overlay__sub">Level {level + 1} complete!</p>

        {isNewRecord && (
          <div className="new-record" role="status" aria-live="polite">
            🏆 NEW BEST TIME! 🏆
          </div>
        )}

        <div className="overlay__stats">
          <span>⏱ {formatTime(stats?.seconds ?? 0)}</span>
          <span>👆 {stats?.moves ?? 0} moves</span>
        </div>

        {bestTime !== undefined && (
          <div className="overlay__best">
            🥇 Best time: {formatTime(bestTime)}
          </div>
        )}

        <button className="btn btn--primary" onClick={onNext}>
          {isLastLevel ? '🎉 Finish!' : '➡️ Next Level!'}
        </button>
      </div>
    </div>
  )
}
