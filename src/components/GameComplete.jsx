export default function GameComplete({ onRestart }) {
  return (
    <div className="overlay overlay--victory" role="dialog" aria-modal="true" aria-label="You won!">
      <div className="overlay__box game-complete">
        <div className="confetti-shower" aria-hidden="true">
          {['🌸','🌈','🥚','🦄','🧚','🌺','✨','🐣','💐','🌸','🌈','🥚','🦋','🌻','🐰'].map((e, i) => (
            <span key={i} className="confetti-piece" style={{ '--delay': `${(i * 0.18).toFixed(2)}s`, '--x': `${(i * 6.5) % 100}%` }}>
              {e}
            </span>
          ))}
        </div>
        <h1 className="victory__title">🎉 You Won! 🎉</h1>
        <p className="victory__sub">You matched ALL the cards!</p>
        <p className="victory__sub">You're a SUPERSTAR! ⭐🦄⭐</p>
        <div className="victory__icons" aria-hidden="true">
          🌈 🦄 🧚 🌸 🥚 🐰 🌈
        </div>
        <button className="btn btn--primary btn--big" onClick={onRestart}>
          🔄 Play Again!
        </button>
      </div>
    </div>
  )
}
