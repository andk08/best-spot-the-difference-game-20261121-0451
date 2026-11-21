// Twin Peeks — game controller: state machine, timer, scoring, HUD,
// overlays and the ?shot= presets used for screenshots.
// Screens: title → playing → levelComplete → (next level | win) / gameOver.

import { LEVELS, starsForScore } from './levels.js';
import { drawPark } from './park.js';
import { drawReef } from './reef.js';
import { drawMarket } from './market.js';
import { addPop, addWrong, makeEffects, renderGame, startHint } from './render.js';
import { bindInput, hitDifference } from './input.js';
import {
  ensureAudio, isMuted, playFound, playHint, playLevelClear, playTick,
  playWin, playWrong, setMuted,
} from './audio.js';

const SCENES = { park: drawPark, reef: drawReef, market: drawMarket };

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayBody = document.getElementById('overlay-body');
const overlayPrimary = document.getElementById('overlay-primary');
const overlaySecondary = document.getElementById('overlay-secondary');
const overlayHint = document.getElementById('overlay-hint');
const toast = document.getElementById('toast');
const statusLine = document.getElementById('status');

const el = {
  levelName: document.getElementById('level-name'),
  timerFill: document.getElementById('timer-fill'),
  timerText: document.getElementById('timer-text'),
  foundCount: document.getElementById('found-count'),
  score: document.getElementById('score'),
  combo: document.getElementById('combo'),
  hintBtn: document.getElementById('hint-btn'),
  hintsLeft: document.getElementById('hints-left'),
  muteBtn: document.getElementById('mute-btn'),
  restartBtn: document.getElementById('restart-btn'),
};

const state = {
  screen: 'title',
  levelIndex: 0,
  found: new Set(),
  score: 0,
  combo: 0,
  bestCombo: 0,
  hintsLeft: 3,
  timeLeft: LEVELS[0].time,
  lastTickSecond: -1,
  frozen: false,
  totalFound: 0,
};

const effects = makeEffects();
let toastTimer = null;

function currentLevel() {
  return LEVELS[state.levelIndex];
}

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function updateHud() {
  const level = currentLevel();
  el.levelName.textContent = `Level ${state.levelIndex + 1} · ${level.name}`;
  el.timerText.textContent = formatTime(state.timeLeft);
  const frac = Math.max(0, state.timeLeft / level.time);
  el.timerFill.style.width = `${frac * 100}%`;
  el.timerFill.classList.toggle('low', state.timeLeft <= 10 && state.screen === 'playing');
  el.foundCount.textContent = `${state.found.size} of ${level.differences.length}`;
  el.score.textContent = String(state.score);
  el.combo.textContent = `×${Math.max(1, state.combo)}`;
  el.hintsLeft.textContent = String(state.hintsLeft);
  el.hintBtn.disabled = state.hintsLeft <= 0 || state.screen !== 'playing';
  el.muteBtn.textContent = isMuted() ? '🔇' : '🔊';
}

function showToast(text, bad) {
  toast.textContent = text;
  toast.classList.toggle('bad', Boolean(bad));
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 1400);
}

function announce(text) {
  statusLine.textContent = text;
}

function showOverlay(title, bodyHtml, primaryLabel, onPrimary, secondaryLabel, onSecondary, hint) {
  overlayTitle.textContent = title;
  overlayBody.innerHTML = bodyHtml;
  overlayPrimary.textContent = primaryLabel;
  overlayPrimary.onclick = () => { ensureAudio(); onPrimary(); };
  if (secondaryLabel) {
    overlaySecondary.textContent = secondaryLabel;
    overlaySecondary.onclick = () => { ensureAudio(); onSecondary(); };
    overlaySecondary.classList.remove('hidden');
  } else {
    overlaySecondary.classList.add('hidden');
  }
  overlayHint.textContent = hint || '';
  overlay.classList.remove('hidden');
  overlayPrimary.focus();
}

function hideOverlay() {
  overlay.classList.add('hidden');
}

function showTitleScreen() {
  state.screen = 'title';
  state.levelIndex = 0;
  state.score = 0;
  state.totalFound = 0;
  // startLevel resets the level and flips the screen to 'playing'; the
  // title screen owns the screen until the player presses Start.
  startLevel(0, true);
  state.screen = 'title';
  const list = LEVELS.map((l, i) => `<li><b>Level ${i + 1} — ${l.name}</b> · 8 differences · ${formatTime(l.time)}</li>`).join('');
  showOverlay(
    'TWIN PEEKS',
    `<p>Two pictures, side by side — almost the same. Find every difference
     before the timer runs out. Click a difference in <b>either</b> picture;
     it is marked on both.</p>
     <ul>${list}</ul>
     <p>Wrong clicks cost 3 seconds and 25 points. Streaks build your combo.
     Hints are limited — spend them well.</p>`,
    '▶ Start playing',
    () => { hideOverlay(); state.screen = 'playing'; updateHud(); },
    null, null,
    'H hint · M mute · R restart · N next level',
  );
  updateHud();
}

function startLevel(index, keepScore) {
  state.levelIndex = index;
  const level = LEVELS[index];
  state.found = new Set();
  state.combo = 0;
  state.hintsLeft = 3;
  state.timeLeft = level.time;
  state.lastTickSecond = -1;
  if (!keepScore) state.score = 0;
  effects.pops.length = 0;
  effects.wrongs.length = 0;
  effects.hint = null;
  hideOverlay();
  state.screen = 'playing';
  announce(`Level ${index + 1}: ${level.name}. Find ${level.differences.length} differences.`);
  updateHud();
}

function showLevelComplete() {
  state.screen = 'levelComplete';
  const level = currentLevel();
  const bonus = Math.ceil(state.timeLeft) * 5;
  state.score += bonus;
  playLevelClear();
  const last = state.levelIndex === LEVELS.length - 1;
  showOverlay(
    'LEVEL COMPLETE!',
    `<p>You found all ${level.differences.length} differences in
     <b>${level.name}</b>.</p>
     <span class="big-score">Time bonus +${bonus}</span>
     <p>Score so far: <b>${state.score}</b></p>`,
    last ? 'See your results ▶' : 'Next level ▶',
    () => { if (last) showWinScreen(); else startLevel(state.levelIndex + 1, true); },
    'Replay level',
    () => startLevel(state.levelIndex, true),
    'Press N for the next level',
  );
  updateHud();
}

function showWinScreen() {
  state.screen = 'win';
  const stars = starsForScore(state.score);
  playWin();
  showOverlay(
    'YOU FOUND THEM ALL!',
    `<div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
     <span class="big-score">${state.score} points</span>
     <p>All ${state.totalFound} differences across 3 scenes — sharp eyes!
     Best combo: <b>×${Math.max(1, state.bestCombo)}</b></p>`,
    '↻ Play again',
    () => { state.score = 0; state.totalFound = 0; startLevel(0, true); },
    null, null,
    'Thanks for playing Twin Peeks',
  );
  updateHud();
}

function showGameOver() {
  state.screen = 'gameOver';
  const level = currentLevel();
  showOverlay(
    "TIME'S UP!",
    `<p>The clock ran out on <b>${level.name}</b> with
     ${state.found.size} of ${level.differences.length} differences found.</p>
     <p>Score kept: <b>${state.score}</b> — give it another go!</p>`,
    '↻ Retry level',
    () => startLevel(state.levelIndex, true),
    'Back to title',
    () => showTitleScreen(),
    'Wrong clicks cost 3 seconds — aim carefully',
  );
  updateHud();
}

function onPanelClick(panelClick) {
  ensureAudio();
  if (state.screen !== 'playing') return;
  const level = currentLevel();
  const diff = hitDifference(panelClick, level.differences, state.found);
  const now = performance.now();
  if (diff) {
    state.found.add(diff.id);
    state.totalFound += 1;
    state.combo += 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    const points = 100 + (state.combo - 1) * 15;
    state.score += points;
    addPop(effects, diff.id, now);
    playFound(state.combo);
    showToast(`+${points} — ${diff.label}!`);
    announce(`Found: ${diff.label}. ${state.found.size} of ${level.differences.length}.`);
    if (state.found.size === level.differences.length) showLevelComplete();
  } else {
    state.combo = 0;
    state.score = Math.max(0, state.score - 25);
    state.timeLeft = Math.max(0, state.timeLeft - 3);
    addWrong(effects, panelClick.x, panelClick.y, panelClick.side, now);
    playWrong();
    showToast('−3s · −25 — not a difference', true);
    announce('Not a difference. Three seconds lost.');
  }
  updateHud();
}

function onHint() {
  ensureAudio();
  if (state.screen !== 'playing' || state.hintsLeft <= 0) return;
  const level = currentLevel();
  const remaining = level.differences.filter((d) => !state.found.has(d.id));
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  startHint(effects, pick.id, performance.now());
  playHint();
  showToast('Hint: look for the pulsing ring');
  updateHud();
}

function onMute() {
  ensureAudio();
  setMuted(!isMuted());
  updateHud();
}

function onRestart() {
  ensureAudio();
  if (state.screen === 'playing' || state.screen === 'gameOver') {
    startLevel(state.levelIndex, true);
  }
}

function onNext() {
  if (state.screen === 'levelComplete') {
    if (state.levelIndex === LEVELS.length - 1) showWinScreen();
    else startLevel(state.levelIndex + 1, true);
  }
}

function onStart() {
  ensureAudio();
  if (state.screen === 'title') {
    hideOverlay();
    state.screen = 'playing';
    updateHud();
  } else if (state.screen === 'levelComplete') {
    onNext();
  }
}

bindInput(canvas, {
  onPanelClick,
  onHint,
  onMute,
  onRestart,
  onNext,
  onStart,
});
el.hintBtn.addEventListener('click', onHint);
el.muteBtn.addEventListener('click', onMute);
el.restartBtn.addEventListener('click', onRestart);

// ---- Screenshot presets (?shot=...) — deterministic states for the shots.
// The timer is frozen in shot mode so every render is identical.
function applyShotPreset(shot) {
  // The timer is frozen only for the mid-play / win presets, so every
  // screenshot render is identical. 'start' leaves the game live.
  if (shot === 'play') {
    state.frozen = true;
    startLevel(0, true);
    state.found = new Set(LEVELS[0].differences.slice(0, 3).map((d) => d.id));
    state.score = 345;
    state.combo = 3;
    state.bestCombo = 3;
    state.timeLeft = 92;
    state.totalFound = 3;
    for (const d of LEVELS[0].differences.slice(0, 3)) addPop(effects, d.id, 0);
  } else if (shot === 'level2') {
    state.frozen = true;
    startLevel(1, true);
    state.found = new Set(LEVELS[1].differences.slice(0, 2).map((d) => d.id));
    state.score = 215;
    state.combo = 2;
    state.bestCombo = 2;
    state.timeLeft = 108;
    state.totalFound = 2;
    for (const d of LEVELS[1].differences.slice(0, 2)) addPop(effects, d.id, 0);
  } else if (shot === 'win') {
    state.levelIndex = 2;
    state.found = new Set(LEVELS[2].differences.map((d) => d.id));
    state.score = 4870;
    state.bestCombo = 7;
    state.totalFound = 24;
    state.timeLeft = LEVELS[2].time;
    for (const d of LEVELS[2].differences) addPop(effects, d.id, 0);
    showWinScreen();
  }
  updateHud();
}

// ---- Main loop ----
let lastNow = performance.now();
function frame(now) {
  const dt = Math.min((now - lastNow) / 1000, 0.1);
  lastNow = now;
  if (state.screen === 'playing' && !state.frozen) {
    state.timeLeft -= dt;
    if (state.timeLeft <= 10) {
      const whole = Math.ceil(state.timeLeft);
      if (whole !== state.lastTickSecond && whole > 0) {
        state.lastTickSecond = whole;
        playTick();
      }
    }
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      updateHud();
      showGameOver();
    } else {
      updateHud();
    }
  }
  const level = currentLevel();
  renderGame(ctx, SCENES[level.scene], level, state.found, effects, now, state.screen !== 'playing');
  requestAnimationFrame(frame);
}

// ---- Boot ----
const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
showTitleScreen();
if (shot) applyShotPreset(shot);
updateHud();
requestAnimationFrame(frame);

// Small handle for automated play-testing (not part of the game UI).
window.__twinPeeks = {
  getState: () => ({
    screen: state.screen,
    levelIndex: state.levelIndex,
    found: [...state.found],
    score: state.score,
    combo: state.combo,
    hintsLeft: state.hintsLeft,
    timeLeft: state.timeLeft,
  }),
  levels: LEVELS,
};
