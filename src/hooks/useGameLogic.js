import { useState, useEffect, useRef, useCallback } from 'react'
import { buildLevel, LEVELS } from '../utils/cards.js'
import { playFlip, playMatch, playMiss, playFanfare, playVictory } from '../utils/sounds.js'

// gamePhase: 'start' | 'peeking' | 'playing' | 'levelComplete' | 'gameWon'
const PEEK_DURATION = 2000  // ms all cards are shown at level start
const HINT_DURATION = 1500  // ms all cards revealed for a hint
const HINTS_PER_LEVEL = 3

function loadBestTimes() {
  try {
    return JSON.parse(localStorage.getItem('easterFlipBestTimes') || '{}')
  } catch {
    return {}
  }
}

function saveBestTime(levelIndex, seconds) {
  const best = loadBestTimes()
  best[levelIndex] = seconds
  localStorage.setItem('easterFlipBestTimes', JSON.stringify(best))
}

export function useGameLogic() {
  const [level, setLevel] = useState(0)
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])       // currently face-up (unmatched)
  const [matched, setMatched] = useState([])       // permanently matched
  const [justMatched, setJustMatched] = useState([]) // last matched pair (for sparkle)
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [gamePhase, setGamePhase] = useState('start')
  const [levelStats, setLevelStats] = useState(null)
  const [bestTimes, setBestTimes] = useState(loadBestTimes)
  const [hintsLeft, setHintsLeft] = useState(HINTS_PER_LEVEL)
  const [hinting, setHinting] = useState(false)    // hint reveal active

  const checking = useRef(false)
  const timerRef = useRef(null)

  // Timer only runs during active play
  useEffect(() => {
    if (gamePhase === 'playing' && !hinting) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [gamePhase, hinting])

  // --- Start / restart level ---
  const startLevel = useCallback((levelIndex) => {
    checking.current = false
    const built = buildLevel(levelIndex)
    setLevel(levelIndex)
    setCards(built)
    setFlipped([])
    setMatched([])
    setJustMatched([])
    setMoves(0)
    setSeconds(0)
    setHintsLeft(HINTS_PER_LEVEL)
    setHinting(false)

    // Peek phase — show all cards briefly, then start playing
    setGamePhase('peeking')
    setTimeout(() => setGamePhase('playing'), PEEK_DURATION)
  }, [])

  const startGame = useCallback(() => startLevel(0), [startLevel])

  const nextLevel = useCallback(() => {
    const nextIdx = level + 1
    if (nextIdx >= LEVELS.length) {
      setGamePhase('gameWon')
      playVictory()
    } else {
      startLevel(nextIdx)
    }
  }, [level, startLevel])

  const restartGame = useCallback(() => startLevel(0), [startLevel])

  // --- Hint ---
  const useHint = useCallback(() => {
    if (hinting || hintsLeft <= 0 || gamePhase !== 'playing') return
    checking.current = true
    setHinting(true)
    setHintsLeft((h) => h - 1)
    setTimeout(() => {
      setHinting(false)
      checking.current = false
    }, HINT_DURATION)
  }, [hinting, hintsLeft, gamePhase])

  // --- Card click handler ---
  const handleCardClick = useCallback(
    (instanceId) => {
      if (gamePhase !== 'playing') return
      if (checking.current) return
      if (matched.includes(instanceId)) return
      if (flipped.includes(instanceId)) return
      if (flipped.length >= 2) return

      playFlip()
      const newFlipped = [...flipped, instanceId]
      setFlipped(newFlipped)

      if (newFlipped.length === 2) {
        setMoves((m) => m + 1)
        checking.current = true

        const [idA, idB] = newFlipped
        const cardA = cards.find((c) => c.instanceId === idA)
        const cardB = cards.find((c) => c.instanceId === idB)

        if (cardA.id === cardB.id) {
          // Match!
          playMatch()
          const newMatched = [...matched, idA, idB]
          setMatched(newMatched)
          setJustMatched([idA, idB])
          setFlipped([])
          checking.current = false

          // Clear sparkle after animation
          setTimeout(() => setJustMatched([]), 700)

          // Check if all pairs matched
          const totalPairs = LEVELS[level].pairs
          if (newMatched.length === totalPairs * 2) {
            setTimeout(() => {
              const finishSeconds = seconds
              const prevBest = loadBestTimes()[level]
              const isNewRecord = prevBest === undefined || finishSeconds < prevBest
              if (isNewRecord) {
                saveBestTime(level, finishSeconds)
                setBestTimes((bt) => ({ ...bt, [level]: finishSeconds }))
              }
              setLevelStats({
                moves: moves + 1,
                seconds: finishSeconds,
                isNewRecord,
                bestTime: isNewRecord ? finishSeconds : prevBest,
              })
              setGamePhase('levelComplete')
              playFanfare()
            }, 600)
          }
        } else {
          // No match — flip back after 1 second
          playMiss()
          setTimeout(() => {
            setFlipped([])
            checking.current = false
          }, 1000)
        }
      }
    },
    [gamePhase, matched, flipped, cards, level, moves, seconds]
  )

  return {
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
  }
}

