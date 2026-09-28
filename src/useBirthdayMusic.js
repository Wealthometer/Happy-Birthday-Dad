import { useCallback, useEffect, useRef, useState } from 'react'

// A gentle music-box "Happy Birthday" made with the Web Audio API,
// so the site needs no audio file. (The melody is public domain.)
// If `src` is given, an mp3 is looped instead.

const F = {
  C3: 130.81, F3: 174.61, G3: 196.0,
  G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33,
  E5: 659.25, F5: 698.46, G5: 783.99,
}

// [note, startBeat, lengthInBeats]
const MELODY = [
  ['G4', 0, 0.75], ['G4', 0.75, 0.25], ['A4', 1, 1], ['G4', 2, 1], ['C5', 3, 1], ['B4', 4, 2],
  ['G4', 6, 0.75], ['G4', 6.75, 0.25], ['A4', 7, 1], ['G4', 8, 1], ['D5', 9, 1], ['C5', 10, 2],
  ['G4', 12, 0.75], ['G4', 12.75, 0.25], ['G5', 13, 1], ['E5', 14, 1], ['C5', 15, 1], ['B4', 16, 1], ['A4', 17, 2],
  ['F5', 19, 0.75], ['F5', 19.75, 0.25], ['E5', 20, 1], ['C5', 21, 1], ['D5', 22, 1], ['C5', 23, 3],
]
const BASS = [
  ['C3', 1, 3], ['G3', 4, 3], ['G3', 7, 3], ['C3', 10, 3],
  ['C3', 13, 3], ['F3', 16, 3], ['C3', 20, 2], ['G3', 22, 1], ['C3', 23, 3],
]
const EVENTS = [
  ...MELODY.map(([n, t, d]) => ({ f: F[n], t, d, bass: false })),
  ...BASS.map(([n, t, d]) => ({ f: F[n], t, d, bass: true })),
].sort((a, b) => a.t - b.t)

const BPM = 88
const BEAT = 60 / BPM
const LOOP_BEATS = 29 // 26 beats of song + a short breath

function pluck(ctx, out, freq, time, dur, bass) {
  const g = ctx.createGain()
  const peak = bass ? 0.16 : 0.22
  const tail = Math.max(dur * BEAT * 1.6, 1.2)
  g.gain.setValueAtTime(0.0001, time)
  g.gain.exponentialRampToValueAtTime(peak, time + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, time + tail)
  g.connect(out)

  const partials = bass ? [[1, 'sine', 1]] : [[1, 'sine', 1], [2, 'triangle', 0.18], [4, 'sine', 0.05]]
  partials.forEach(([mult, type, amp]) => {
    const o = ctx.createOscillator()
    const og = ctx.createGain()
    o.type = type
    o.frequency.setValueAtTime(freq * mult, time)
    og.gain.value = amp
    o.connect(og).connect(g)
    o.start(time)
    o.stop(time + tail + 0.05)
  })
}

export function useBirthdayMusic(src) {
  const [playing, setPlaying] = useState(false)
  const ctxRef = useRef(null)
  const audioRef = useRef(null)
  const timerRef = useRef(null)
  const cursor = useRef({ loopStart: 0, index: 0 })

  const buildGraph = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const master = ctx.createGain()
    master.gain.value = 0.55
    // Soft echo for a little room ambience
    const delay = ctx.createDelay()
    delay.delayTime.value = 0.28
    const fb = ctx.createGain()
    fb.gain.value = 0.28
    const wet = ctx.createGain()
    wet.gain.value = 0.35
    master.connect(ctx.destination)
    master.connect(delay)
    delay.connect(fb).connect(delay)
    delay.connect(wet).connect(ctx.destination)
    ctxRef.current = { ctx, out: master }
    cursor.current = { loopStart: ctx.currentTime + 0.15, index: 0 }

    timerRef.current = setInterval(() => {
      const { ctx, out } = ctxRef.current
      const c = cursor.current
      const horizon = ctx.currentTime + 0.4
      while (true) {
        if (c.index >= EVENTS.length) {
          c.loopStart += LOOP_BEATS * BEAT
          c.index = 0
        }
        const ev = EVENTS[c.index]
        const at = c.loopStart + ev.t * BEAT
        if (at > horizon) break
        if (at >= ctx.currentTime - 0.05) pluck(ctx, out, ev.f, at, ev.d, ev.bass)
        c.index++
      }
    }, 60)
  }

  const play = useCallback(async () => {
    try {
      if (src) {
        if (!audioRef.current) {
          audioRef.current = new Audio(src)
          audioRef.current.loop = true
          audioRef.current.volume = 0.6
        }
        await audioRef.current.play()
      } else {
        if (!ctxRef.current) buildGraph()
        await ctxRef.current.ctx.resume()
      }
      setPlaying(true)
    } catch (e) {
      console.warn('Music could not start:', e)
      setPlaying(false)
    }
  }, [src])

  const pause = useCallback(async () => {
    if (src) audioRef.current?.pause()
    else await ctxRef.current?.ctx.suspend()
    setPlaying(false)
  }, [src])

  const toggle = useCallback(() => (playing ? pause() : play()), [playing, play, pause])

  useEffect(() => () => {
    clearInterval(timerRef.current)
    ctxRef.current?.ctx.close()
    audioRef.current?.pause()
  }, [])

  return { playing, play, pause, toggle }
}
