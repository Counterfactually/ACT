// Card pool — every entry appears as a matching pair on the board.
// Cards with type:'unicorn' render UnicornSVG instead of an emoji.
export const CARD_POOL = [
  { id: 'unicorn',    emoji: null,  label: 'Unicorn',    type: 'unicorn' },
  { id: 'rainbow',   emoji: '🌈',  label: 'Rainbow' },
  { id: 'fairy',     emoji: '🧚',  label: 'Fairy' },
  { id: 'mermaid',   emoji: '🧜',  label: 'Mermaid' },
  { id: 'bunny',     emoji: '🐰',  label: 'Bunny' },
  { id: 'rabbit',    emoji: '🐇',  label: 'Rabbit' },
  { id: 'dog',       emoji: '🐕',  label: 'Dog' },
  { id: 'puppy',     emoji: '🐶',  label: 'Puppy' },
  { id: 'poodle',    emoji: '🐩',  label: 'Poodle' },
  { id: 'goat',      emoji: '🐐',  label: 'Goat' },
  { id: 'chicken',   emoji: '🐔',  label: 'Chicken' },
  { id: 'chick',     emoji: '🐣',  label: 'Chick' },
  { id: 'iowa',      emoji: '🌽',  label: 'Iowa Corn' },
  { id: 'boy',       emoji: '👦',  label: 'Boy' },
  { id: 'girl',      emoji: '👧',  label: 'Girl' },
  { id: 'woman',     emoji: '👩',  label: 'Woman' },
  { id: 'house',     emoji: '🏠',  label: 'House' },
  { id: 'castle',    emoji: '🏰',  label: 'Castle' },
  { id: 'school',    emoji: '🏫',  label: 'School' },
  { id: 'flower1',   emoji: '🌸',  label: 'Cherry Blossom' },
  { id: 'flower2',   emoji: '🌺',  label: 'Hibiscus' },
  { id: 'flower3',   emoji: '🌻',  label: 'Sunflower' },
  { id: 'flower4',   emoji: '🌹',  label: 'Rose' },
  { id: 'egg',       emoji: '🥚',  label: 'Easter Egg' },
  { id: 'butterfly', emoji: '🦋',  label: 'Butterfly' },
  { id: 'basket',    emoji: '🧺',  label: 'Easter Basket' },
]

// Grid dimensions and pair counts per level
export const LEVELS = [
  { cols: 3, rows: 3, pairs: 4,  deco: true  }, // level 1 — 9 slots, center deco
  { cols: 4, rows: 3, pairs: 6,  deco: false }, // level 2 — 12 slots
  { cols: 4, rows: 4, pairs: 8,  deco: false }, // level 3 — 16 slots
  { cols: 5, rows: 4, pairs: 10, deco: false }, // level 4 — 20 slots
  { cols: 5, rows: 5, pairs: 12, deco: true  }, // level 5 — 25 slots, center deco
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Build the card array for a given level index (0-based).
 * Returns an array of card objects each with a unique instanceId.
 */
export function buildLevel(levelIndex) {
  const { cols, rows, pairs, deco } = LEVELS[levelIndex]
  const totalSlots = cols * rows
  const centerIndex = Math.floor(totalSlots / 2)

  // Pick `pairs` cards from the pool (always include unicorn on first pick)
  const pool = shuffle(CARD_POOL).slice(0, pairs)

  // Create two copies of each card (the pair)
  const paired = shuffle(
    pool.flatMap((card) => [
      { ...card, instanceId: `${card.id}-a` },
      { ...card, instanceId: `${card.id}-b` },
    ])
  )

  if (!deco) return paired

  // Insert decorative center card
  const decoCard = {
    id: 'deco',
    instanceId: 'deco-center',
    emoji: levelIndex === 4 ? '🧺' : '🌸',
    label: levelIndex === 4 ? 'Easter Basket' : 'Flower',
    type: 'deco',
  }

  const cards = [...paired]
  cards.splice(centerIndex, 0, decoCard)
  return cards
}
