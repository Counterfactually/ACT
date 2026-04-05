import Card from './Card.jsx'
import { LEVELS } from '../utils/cards.js'

export default function Board({ level, cards, flipped, matched, onCardClick }) {
  const { cols } = LEVELS[level]

  return (
    <div
      className="board"
      style={{ '--cols': cols }}
    >
      {cards.map((card) => (
        <Card
          key={card.instanceId}
          card={card}
          isFlipped={flipped.includes(card.instanceId)}
          isMatched={matched.includes(card.instanceId)}
          onClick={() => onCardClick(card.instanceId)}
        />
      ))}
    </div>
  )
}
