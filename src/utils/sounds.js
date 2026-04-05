// Web Audio API — synthesized sounds, no audio files needed.
let ctx = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

function playTone(freq, startTime, duration, type = 'sine', gain = 0.3) {
  const ac = getCtx()
  const osc = ac.createOscillator()
  const gainNode = ac.createGain()
  osc.connect(gainNode)
  gainNode.connect(ac.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, startTime)
  gainNode.gain.setValueAtTime(gain, startTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

export function playFlip() {
  const ac = getCtx()
  const t = ac.currentTime
  playTone(600, t, 0.08, 'triangle', 0.15)
}

export function playMatch() {
  const ac = getCtx()
  const t = ac.currentTime
  // C4 → E4 → G4 → C5 ascending arpeggio
  const notes = [261.63, 329.63, 392.0, 523.25]
  notes.forEach((freq, i) => playTone(freq, t + i * 0.1, 0.18, 'sine', 0.3))
}

export function playMiss() {
  const ac = getCtx()
  const t = ac.currentTime
  playTone(330, t, 0.1, 'sine', 0.2)
  playTone(220, t + 0.1, 0.2, 'sine', 0.2)
}

export function playFanfare() {
  const ac = getCtx()
  const t = ac.currentTime
  // Happy 8-note melody
  const melody = [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 523.25, 659.25]
  melody.forEach((freq, i) => playTone(freq, t + i * 0.12, 0.2, 'sine', 0.3))
}

export function playVictory() {
  const ac = getCtx()
  const t = ac.currentTime
  // Big celebratory sequence
  const melody = [
    523.25, 659.25, 783.99, 1046.5,
    783.99, 1046.5, 1318.5, 1046.5,
    783.99, 1046.5,
  ]
  melody.forEach((freq, i) => {
    playTone(freq, t + i * 0.13, 0.22, 'sine', 0.35)
    // Add harmony a third below
    playTone(freq * 0.794, t + i * 0.13, 0.22, 'sine', 0.15)
  })
}
