import UnicornSVG from './UnicornSVG.jsx'

const SPARKLES = ['✨','⭐','🌟','💫','✨','🌟']

export default function Card({ card, isFlipped, isMatched, isJustMatched, isPeeking, isHinting, onClick }) {
  const isDeco = card.type === 'deco'
  const isUnicorn = card.type === 'unicorn'
  const faceUp = isFlipped || isMatched || isDeco || isPeeking || isHinting
  const clickable = !isDeco && !isMatched && !isPeeking && !isHinting

  return (
    <div
      className={[
        'card',
        faceUp ? 'card--flipped' : '',
        isMatched ? 'card--matched' : '',
        isJustMatched ? 'card--just-matched' : '',
        isDeco ? 'card--deco' : '',
        isPeeking ? 'card--peeking' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : 'img'}
      aria-label={faceUp ? card.label : 'Hidden card'}
      tabIndex={clickable ? 0 : -1}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && clickable) onClick()
      }}
    >
      <div className="card__inner">
        {/* Back face */}
        <div className="card__back" aria-hidden="true">
          <span className="card__back-flower">🌸</span>
        </div>

        {/* Front face */}
        <div className="card__front">
          {isUnicorn ? (
            <UnicornSVG size={64} />
          ) : (
            <span className="card__emoji" role="img" aria-label={card.label}>
              {card.emoji}
            </span>
          )}
          <span className="card__label">{card.label}</span>
        </div>
      </div>

      {/* Sparkle burst on match */}
      {isJustMatched && (
        <div className="card__sparkles" aria-hidden="true">
          {SPARKLES.map((s, i) => (
            <span key={i} className="sparkle" style={{ '--i': i }}>
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
