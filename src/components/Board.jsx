import Card from './Card.jsx'
import { LEVELS } from '../utils/cards.js'

export default function Board({ level, cards, flipped, matched, justMatched, isPeeking, isHinting, onCardClick }) {
  const { cols } = LEVELS[level]

  return (
    <div className="board" style={{ '--cols': cols }}>
      {cards.map((card) => (
        <Card
          key={card.instanceId}
          card={card}
          isFlipped={flipped.includes(card.instanceId)}
          isMatched={matched.includes(card.instanceId)}
          isJustMatched={justMatched.includes(card.instanceId)}
          isPeeking={isPeeking}
          isHinting={isHinting && !matched.includes(card.instanceId) && card.type !== 'deco'}
          onClick={() => onCardClick(card.instanceId)}
        />
      ))}
    </div>
  )
}
