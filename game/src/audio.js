// Sound effects, synthesised with WebAudio — no audio files, no network.
// Every effect is a short oscillator envelope, created lazily on the first
// user gesture so the AudioContext is allowed to start.

let audioCtx = null;
let muted = false;

// Keep the effects quiet enough to sit under a player's focus.
const MASTER_VOLUME = 0.9;

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = value;
  return muted;
}

// Must be called from a user gesture at least once; afterwards playTone
// works any time. Safe to call repeatedly.
export function ensureAudio() {
  if (!audioCtx) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTone(freq, startAt, duration, type, volume) {
  if (muted || !audioCtx || audioCtx.state !== 'running') return;
  const now = audioCtx.currentTime + startAt;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume * MASTER_VOLUME, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.05);
}

// A bright two-note chime when a difference is found; the pitch climbs
// with the combo so streaks feel rewarding.
export function playFound(combo) {
  const base = 660 + Math.min(combo, 8) * 40;
  playTone(base, 0, 0.16, 'sine', 0.22);
  playTone(base * 1.5, 0.09, 0.22, 'sine', 0.2);
}

// A dull buzz for a wrong click.
export function playWrong() {
  playTone(140, 0, 0.22, 'sawtooth', 0.12);
  playTone(110, 0.05, 0.2, 'sawtooth', 0.1);
}

// A soft blip when a hint is spent.
export function playHint() {
  playTone(880, 0, 0.1, 'triangle', 0.16);
  playTone(1174, 0.08, 0.14, 'triangle', 0.14);
}

// A rising arpeggio when a level is cleared.
export function playLevelClear() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => playTone(freq, i * 0.1, 0.24, 'triangle', 0.2));
}

// A short fanfare for the final win screen.
export function playWin() {
  const notes = [523, 659, 784, 1047, 784, 1047, 1319];
  notes.forEach((freq, i) => playTone(freq, i * 0.13, 0.3, 'triangle', 0.2));
}

// A quiet tick when the timer drops under ten seconds.
export function playTick() {
  playTone(1200, 0, 0.05, 'square', 0.06);
}
