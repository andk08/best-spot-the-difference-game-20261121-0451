// Input handling: mouse clicks on the two panels and keyboard shortcuts.
// Hit-testing is forgiving (a few pixels past the difference radius) and a
// moved difference accepts a click on either side's position.

import { LEFT_X, PANEL_Y, RIGHT_X } from './render.js';
import { PANEL_H, PANEL_W, diffPos } from './levels.js';

export const CLICK_TOLERANCE = 10;

// Convert a pointer event on the canvas to panel coordinates.
// Returns { side: 'A'|'B', x, y } in panel space, or null when the click
// falls outside both panels.
export function canvasClickToPanel(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const cx = (event.clientX - rect.left) * scaleX;
  const cy = (event.clientY - rect.top) * scaleY;
  if (cy < PANEL_Y || cy > PANEL_Y + PANEL_H) return null;
  if (cx >= LEFT_X && cx <= LEFT_X + PANEL_W) {
    return { side: 'A', x: cx - LEFT_X, y: cy - PANEL_Y };
  }
  if (cx >= RIGHT_X && cx <= RIGHT_X + PANEL_W) {
    return { side: 'B', x: cx - RIGHT_X, y: cy - PANEL_Y };
  }
  return null;
}

// Find the unfound difference under a panel click, if any. A moved
// difference is hit at either side's position; other differences share one
// centre on both panels.
export function hitDifference(panelClick, differences, foundIds) {
  for (const diff of differences) {
    if (foundIds.has(diff.id)) continue;
    const centres = [diffPos(diff, 'A')];
    if (diff.x2 !== undefined) centres.push(diffPos(diff, 'B'));
    for (const c of centres) {
      const dx = panelClick.x - c.x;
      const dy = panelClick.y - c.y;
      if (dx * dx + dy * dy <= (diff.r + CLICK_TOLERANCE) * (diff.r + CLICK_TOLERANCE)) {
        return diff;
      }
    }
  }
  return null;
}

// Wire the canvas click and the keyboard shortcuts. The callbacks object
// carries the game actions: onPanelClick(panelClick), onHint(), onMute(),
// onRestart(), onNext(), onStart(). Only the shortcuts relevant to the
// current screen fire; the game decides what each does.
export function bindInput(canvas, callbacks) {
  canvas.addEventListener('pointerdown', (event) => {
    // Only the primary button (or a touch) starts a guess.
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const panelClick = canvasClickToPanel(event, canvas);
    if (panelClick) callbacks.onPanelClick(panelClick);
  });

  document.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === 'h') callbacks.onHint();
    else if (key === 'm') callbacks.onMute();
    else if (key === 'r') callbacks.onRestart();
    else if (key === 'n') callbacks.onNext();
    else if (key === 'enter' || key === ' ') callbacks.onStart();
  });
}
