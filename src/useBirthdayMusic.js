import { useCallback, useEffect, useRef, useState } from 'react'

// A small orchestral "Happy Birthday" made with the Web Audio API,
// so the site needs no audio file. (The melody is public domain.)
// Violins carry the tune, a string section holds the chords, cellos and
// basses walk underneath, horns join for the second half, and timpani
// mark the big moments, all inside a synthetic concert-hall reverb.
// If `src` is given, an mp3 is looped instead.

const NOTE_INDEX = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
// 'C4', 'Bb3', 'F#2' -> Hz
const hz = (name) => {
  const [, letter, accidental, octave] = name.match(/^([A-G])(b|#)?(\d)$/)
  const semis = NOTE_INDEX[letter] + (accidental === '#' ? 1 : accidental === 'b' ? -1 : 0)
  const midi = (Number(octave) + 1) * 12 + semis
  return 440 * Math.pow(2, (midi - 69) / 12)
}

// [note, startBeat, lengthInBeats]
const MELODY = [
  ['G4', 0, 0.75], ['G4', 0.75, 0.25], ['A4', 1, 1], ['G4', 2, 1], ['C5', 3, 1], ['B4', 4, 2],
  ['G4', 6, 0.75], ['G4', 6.75, 0.25], ['A4', 7, 1], ['G4', 8, 1], ['D5', 9, 1], ['C5', 10, 2],
  ['G4', 12, 0.75], ['G4', 12.75, 0.25], ['G5', 13, 1], ['E5', 14, 1], ['C5', 15, 1], ['B4', 16, 1], ['A4', 17, 2],
  ['F5', 19, 0.75], ['F5', 19.75, 0.25], ['E5', 20, 1], ['C5', 21, 1], ['D5', 22, 1], ['C5', 23, 3],
]
// [chord tones, startBeat, lengthInBeats]
const CHORDS = [
  [['E3', 'G3', 'C4'], 1, 3], [['D3', 'F3', 'B3'], 4, 6], [['E3', 'G3', 'C4'], 10, 3],
  [['E3', 'Bb3', 'C4'], 13, 3], [['F3', 'A3', 'C4'], 16, 4], [['E3', 'G3', 'C4'], 20, 2],
  [['D3', 'F3', 'B3'], 22, 1], [['E3', 'G3', 'C4'], 23, 3],
]
const BASS = [
  ['C3', 1, 3], ['G2', 4, 3], ['G2', 7, 3], ['C3', 10, 3],
  ['C3', 13, 3], ['F2', 16, 3], ['C3', 20, 2], ['G2', 22, 1], ['C3', 23, 3],
]
// [note, startBeat, strength]
const TIMPANI = [
  ['C2', 1, 1], ['G2', 7, 0.55], ['C2', 13, 0.85], ['G2', 22, 0.7], ['G2', 22.5, 0.5], ['C2', 23, 1],
]

const EVENTS = [
  ...MELODY.map(([n, t, d]) => ({ kind: 'violin', f: hz(n), t, d })),
  // Horns double the tune an octave down once the song starts to build.
  ...MELODY.filter(([, t]) => t >= 12).map(([n, t, d]) => ({ kind: 'horn', f: hz(n) / 2, t, d })),
  ...CHORDS.flatMap(([notes, t, d]) => notes.map((n) => ({ kind: 'strings', f: hz(n), t, d }))),
  ...BASS.map(([n, t, d]) => ({ kind: 'cello', f: hz(n), t, d })),
  ...BASS.map(([n, t, d]) => ({ kind: 'contrabass', f: hz(n) / 2, t, d })),
  ...TIMPANI.map(([n, t, s]) => ({ kind: 'timpani', f: hz(n), t, d: 0, s })),
].sort((a, b) => a.t - b.t)

const BPM = 80
const BEAT = 60 / BPM
const LOOP_BEATS = 30 // 26 beats of song + room for the hall to ring

// waves: [oscillator type, detune in cents, level]
const INSTRUMENTS = {
  violin: { waves: [['sawtooth', -7, 0.5], ['sawtooth', 7, 0.5], ['triangle', 0, 0.4]], cutoff: 3200, attack: 0.09, release: 0.4, peak: 0.075, vibrato: 11 },
  horn: { waves: [['sawtooth', 0, 0.5], ['triangle', 3, 0.7]], cutoff: 1100, attack: 0.12, release: 0.45, peak: 0.06, vibrato: 4 },
  strings: { waves: [['sawtooth', -11, 0.5], ['sawtooth', 9, 0.5]], cutoff: 1500, attack: 0.4, release: 0.9, peak: 0.03, vibrato: 6 },
  cello: { waves: [['sawtooth', -5, 0.5], ['sawtooth', 5, 0.5]], cutoff: 900, attack: 0.15, release: 0.7, peak: 0.06, vibrato: 7 },
  contrabass: { waves: [['sawtooth', 0, 0.4], ['sine', 0, 0.8]], cutoff: 450, attack: 0.18, release: 0.7, peak: 0.07, vibrato: 0 },
}

function bowed(ctx, out, freq, time, dur, inst) {
  const { waves, cutoff, attack, release, peak, vibrato } = inst
  const hold = time + Math.max(dur * BEAT, attack + 0.05)
  const end = hold + release

  const g = ctx.createGain()
  g.gain.setValueAtTime(0, time)
  g.gain.linearRampToValueAtTime(peak, time + attack)
  g.gain.setValueAtTime(peak, hold)
  g.gain.linearRampToValueAtTime(0, end)

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.Q.value = 0.8
  // The bow "bites" into the note, then mellows.
  filter.frequency.setValueAtTime(cutoff * 0.6, time)
  filter.frequency.linearRampToValueAtTime(cutoff, time + attack)
  filter.frequency.linearRampToValueAtTime(cutoff * 0.8, hold)
  filter.connect(g).connect(out)

  let depth = null
  if (vibrato) {
    // Vibrato fades in after the note speaks, like a real player.
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 5 + Math.random() * 0.8
    depth = ctx.createGain()
    depth.gain.setValueAtTime(0, time)
    depth.gain.linearRampToValueAtTime(vibrato, time + attack + 0.25)
    lfo.connect(depth)
    lfo.start(time)
    lfo.stop(end + 0.05)
  }

  waves.forEach(([type, cents, amp]) => {
    const o = ctx.createOscillator()
    const og = ctx.createGain()
    o.type = type
    o.frequency.setValueAtTime(freq, time)
    o.detune.value = cents
    if (depth) depth.connect(o.detune)
    og.gain.value = amp
    o.connect(og).connect(filter)
    o.start(time)
    o.stop(end + 0.05)
  })
}

function timpani(ctx, out, noise, freq, time, strength) {
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, time)
  g.gain.exponentialRampToValueAtTime(0.38 * strength, time + 0.006)
  g.gain.exponentialRampToValueAtTime(0.0001, time + 2.2)
  g.connect(out)

  // Drum head: a pitch that settles quickly, plus a quieter overtone.
  const partials = [[1, 1], [1.5, 0.35]]
  partials.forEach(([mult, amp]) => {
    const o = ctx.createOscillator()
    const og = ctx.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(freq * mult * 1.25, time)
    o.frequency.exponentialRampToValueAtTime(freq * mult, time + 0.06)
    og.gain.value = amp
    o.connect(og).connect(g)
    o.start(time)
    o.stop(time + 2.3)
  })

  // Mallet thump
  const n = ctx.createBufferSource()
  n.buffer = noise
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 500
  const ng = ctx.createGain()
  ng.gain.setValueAtTime(0.25 * strength, time)
  ng.gain.exponentialRampToValueAtTime(0.0001, time + 0.15)
  n.connect(lp).connect(ng).connect(out)
  n.start(time)
  n.stop(time + 0.2)
}

// A decaying burst of stereo noise makes a convincing concert-hall reverb.
function hallImpulse(ctx, seconds = 3.2) {
  const len = Math.floor(ctx.sampleRate * seconds)
  const buf = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2)
  }
  return buf
}

function noiseBuffer(ctx) {
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.2), ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buf
}

function playEvent(rig, ev, at) {
  const { ctx, out, noise } = rig
  if (ev.kind === 'timpani') timpani(ctx, out, noise, ev.f, at, ev.s)
  else bowed(ctx, out, ev.f, at, ev.d, INSTRUMENTS[ev.kind])
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
    master.gain.value = 0.7
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -18
    comp.ratio.value = 3
    comp.connect(ctx.destination)

    // Concert-hall ambience
    const reverb = ctx.createConvolver()
    reverb.buffer = hallImpulse(ctx)
    const dry = ctx.createGain()
    dry.gain.value = 0.75
    const wet = ctx.createGain()
    wet.gain.value = 0.55
    master.connect(dry).connect(comp)
    master.connect(reverb).connect(wet).connect(comp)

    ctxRef.current = { ctx, out: master, noise: noiseBuffer(ctx) }
    cursor.current = { loopStart: ctx.currentTime + 0.15, index: 0 }

    timerRef.current = setInterval(() => {
      const rig = ctxRef.current
      const { ctx } = rig
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
        if (at >= ctx.currentTime - 0.05) playEvent(rig, ev, at)
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
