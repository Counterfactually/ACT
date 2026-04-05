import UnicornSVG from './UnicornSVG.jsx'

export default function Card({ card, isFlipped, isMatched, onClick }) {
  const isDeco = card.type === 'deco'
  const isUnicorn = card.type === 'unicorn'
  const faceUp = isFlipped || isMatched || isDeco

  return (
    <div
      className={[
        'card',
        faceUp ? 'card--flipped' : '',
        isMatched ? 'card--matched' : '',
        isDeco ? 'card--deco' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={isDeco || isMatched ? undefined : onClick}
      role={isDeco || isMatched ? 'img' : 'button'}
      aria-label={faceUp ? card.label : 'Hidden card'}
      tabIndex={isDeco || isMatched ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isDeco && !isMatched) onClick()
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
    </div>
  )
}
