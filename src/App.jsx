import { useGameLogic } from './hooks/useGameLogic.js'
import Board from './components/Board.jsx'
import HUD from './components/HUD.jsx'
import LevelComplete from './components/LevelComplete.jsx'
import GameComplete from './components/GameComplete.jsx'

function StartScreen({ onStart }) {
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
    moves,
    seconds,
    gamePhase,
    levelStats,
    bestTimes,
    handleCardClick,
    startGame,
    nextLevel,
    restartGame,
  } = useGameLogic()

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

      {gamePhase === 'start' && <StartScreen onStart={startGame} />}

      {(gamePhase === 'playing' || gamePhase === 'levelComplete') && (
        <div className="game-container">
          <HUD
            level={level}
            moves={moves}
            seconds={seconds}
            matched={matched}
            bestTime={bestTimes[level]}
          />
          <Board
            level={level}
            cards={cards}
            flipped={flipped}
            matched={matched}
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
