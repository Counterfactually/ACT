import { useGameLogic } from './hooks/useGameLogic.js'
import Board from './components/Board.jsx'
import HUD from './components/HUD.jsx'
import LevelComplete from './components/LevelComplete.jsx'
import GameComplete from './components/GameComplete.jsx'

function formatTime(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const LEVEL_LABELS = ['Level 1\n3×3', 'Level 2\n3×4', 'Level 3\n4×4', 'Level 4\n4×5', 'Level 5\n5×5']

function StartScreen({ onStart, bestTimes }) {
  const hasAny = Object.keys(bestTimes).length > 0
  return (
    <div className="start-screen">
      <div className="start-screen__inner">
        <div className="start-screen__flowers" aria-hidden="true">
          🌸 🌺 🌻 🌹 💐 🌸 🌺
        </div>
        <h1 className="start-screen__title">🌈 Easter Flip! 🌈</h1>
        <p className="start-screen__sub">Find the matching pairs!</p>
        <div className="start-screen__preview" aria-hidden="true">
          🦄 🧚 🐰 🥚 🌈 🐣 🌸
        </div>
        <button className="btn btn--primary btn--big" onClick={onStart}>
          🌸 Play! 🌸
        </button>
        <div className="start-screen__hint">
          Tap two cards to find their match!
        </div>

        {hasAny && (
          <div className="best-times">
            <div className="best-times__title">🏆 Your Best Times</div>
            <div className="best-times__grid">
              {[0,1,2,3,4].map((i) => (
                <div key={i} className={`best-times__cell ${bestTimes[i] !== undefined ? 'best-times__cell--done' : ''}`}>
                  <span className="best-times__lvl">Lv {i + 1}</span>
                  <span className="best-times__time">
                    {bestTimes[i] !== undefined ? formatTime(bestTimes[i]) : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const {
    level,
    cards,
    flipped,
    matched,
    justMatched,
    moves,
    seconds,
    gamePhase,
    levelStats,
    bestTimes,
    hintsLeft,
    hinting,
    handleCardClick,
    useHint,
    startGame,
    nextLevel,
    restartGame,
  } = useGameLogic()

  const isPeeking = gamePhase === 'peeking'

  return (
    <div className="app">
      {/* Decorative background flowers */}
      <div className="bg-flowers" aria-hidden="true">
        {['🌸','🌺','🌼','🌸','💐','🌸','🌺','🌼','🌸','💐'].map((f, i) => (
          <span key={i} className="bg-flower" style={{ '--i': i }}>
            {f}
          </span>
        ))}
      </div>

      {gamePhase === 'start' && <StartScreen onStart={startGame} bestTimes={bestTimes} />}

      {(gamePhase === 'peeking' || gamePhase === 'playing' || gamePhase === 'levelComplete') && (
        <div className="game-container">
          {isPeeking && (
            <div className="peek-banner" role="status" aria-live="polite">
              👀 Remember the cards!
            </div>
          )}
          <HUD
            level={level}
            moves={moves}
            seconds={seconds}
            matched={matched}
            bestTime={bestTimes[level]}
            hintsLeft={hintsLeft}
            onHint={useHint}
            isPeeking={isPeeking}
            hinting={hinting}
          />
          <Board
            level={level}
            cards={cards}
            flipped={flipped}
            matched={matched}
            justMatched={justMatched}
            isPeeking={isPeeking}
            isHinting={hinting}
            onCardClick={handleCardClick}
          />
        </div>
      )}

      {gamePhase === 'levelComplete' && (
        <LevelComplete
          level={level}
          stats={levelStats}
          onNext={nextLevel}
        />
      )}

      {gamePhase === 'gameWon' && (
        <GameComplete onRestart={restartGame} />
      )}
    </div>
  )
}
