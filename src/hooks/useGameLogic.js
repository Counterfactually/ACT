import { useState, useEffect, useRef, useCallback } from 'react'
import { buildLevel, LEVELS } from '../utils/cards.js'
import { playFlip, playMatch, playMiss, playFanfare, playVictory } from '../utils/sounds.js'

// gamePhase: 'start' | 'playing' | 'levelComplete' | 'gameWon'

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
  const [level, setLevel] = useState(0)          // 0-indexed
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])     // instanceIds of face-up (unmatched) cards
  const [matched, setMatched] = useState([])     // instanceIds of matched cards
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [gamePhase, setGamePhase] = useState('start')
  const [levelStats, setLevelStats] = useState(null)  // { moves, seconds, isNewRecord, bestTime }
  const [bestTimes, setBestTimes] = useState(loadBestTimes)

  const checking = useRef(false)   // block clicks while evaluating a pair
  const timerRef = useRef(null)

  // --- Timer ---
  useEffect(() => {
    if (gamePhase === 'playing') {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [gamePhase])

  // --- Start / restart level ---
  const startLevel = useCallback((levelIndex) => {
    checking.current = false
    setLevel(levelIndex)
    setCards(buildLevel(levelIndex))
    setFlipped([])
    setMatched([])
    setMoves(0)
    setSeconds(0)
    setGamePhase('playing')
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
          setFlipped([])
          checking.current = false

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
    [gamePhase, checking, matched, flipped, cards, level, moves, seconds]
  )

  return {
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
  }
}
