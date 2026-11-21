// Panel renderer: draws the two scene panels, found-difference markers,
// hint pulses, wrong-click crosses and the VS badge between the panels.

import { PANEL_H, PANEL_W, diffPos } from './levels.js';

export const CANVAS_W = 1280;
export const CANVAS_H = 500;
export const LEFT_X = 30;
export const RIGHT_X = 650;
export const PANEL_Y = 20;

// A transient visual effect (pop ring, wrong cross, hint pulse).
export function makeEffects() {
  return {
    pops: [], // { diffId, startedAt }
    wrongs: [], // { x, y, side, startedAt }
    hint: null, // { diffId, startedAt }
    shakeUntil: 0,
    shakeSide: null,
  };
}

export function addPop(effects, diffId, now) {
  effects.pops.push({ diffId, startedAt: now });
}

export function addWrong(effects, x, y, side, now) {
  effects.wrongs.push({ x, y, side, startedAt: now });
  effects.shakeUntil = now + 220;
  effects.shakeSide = side;
}

export function startHint(effects, diffId, now) {
  effects.hint = { diffId, startedAt: now };
}

// Where a difference's marker ring is drawn on one side's panel.
function markerCentre(diff, side) {
  const p = diffPos(diff, side);
  return { x: (side === 'A' ? LEFT_X : RIGHT_X) + p.x, y: PANEL_Y + p.y };
}

function drawPanelFrame(ctx, x, label) {
  // Border and badge only — the scene underneath must stay visible, so
  // this never paints a fill over the panel.
  ctx.save();
  ctx.strokeStyle = '#33415e';
  ctx.lineWidth = 3;
  ctx.strokeRect(x, PANEL_Y, PANEL_W, PANEL_H);
  // Panel badge, top-left corner.
  ctx.fillStyle = 'rgba(14,20,36,0.85)';
  ctx.beginPath();
  ctx.roundRect(x + 10, PANEL_Y + 10, 92, 30, 8);
  ctx.fill();
  ctx.fillStyle = '#ffd93b';
  ctx.font = 'bold 16px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + 22, PANEL_Y + 26);
  ctx.restore();
}

function drawMarkerRing(ctx, cx, cy, r, progress) {
  // A satisfying mark: a ring that pops in, then settles, with a tick.
  const scale = progress < 1 ? 1.35 - 0.35 * progress : 1;
  const rr = r * scale;
  ctx.save();
  // Soft halo so the ring reads on busy art.
  ctx.fillStyle = 'rgba(255,71,87,0.18)';
  ctx.beginPath();
  ctx.arc(cx, cy, rr + 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#ff4757';
  ctx.beginPath();
  ctx.arc(cx, cy, rr, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, rr + 4, 0, Math.PI * 2);
  ctx.stroke();
  // Tick inside the ring.
  ctx.strokeStyle = '#ff4757';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.45, cy);
  ctx.lineTo(cx - r * 0.12, cy + r * 0.32);
  ctx.lineTo(cx + r * 0.5, cy - r * 0.34);
  ctx.stroke();
  ctx.restore();
}

function drawHintPulse(ctx, cx, cy, r, elapsed) {
  // A dashed ring that breathes around one unfound difference.
  const pulse = 1 + 0.12 * Math.sin(elapsed / 160);
  const rr = (r + 8) * pulse;
  ctx.save();
  ctx.setLineDash([10, 7]);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#ffd93b';
  ctx.beginPath();
  ctx.arc(cx, cy, rr, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#ffd93b';
  ctx.font = 'bold 15px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('LOOK HERE', cx, cy - rr - 6);
  ctx.restore();
}

function drawWrongCross(ctx, x, y, elapsed) {
  const alpha = elapsed < 350 ? 1 : 1 - (elapsed - 350) / 200;
  const size = 16 + Math.min(elapsed / 12, 8);
  ctx.save();
  ctx.globalAlpha = Math.max(alpha, 0);
  ctx.strokeStyle = '#ff4757';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - size, y - size);
  ctx.lineTo(x + size, y + size);
  ctx.moveTo(x + size, y - size);
  ctx.lineTo(x - size, y + size);
  ctx.stroke();
  ctx.restore();
}

export function renderGame(ctx, sceneDraw, level, foundIds, effects, now, dimmed) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#0e1424';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  const shakeA = effects.shakeSide === 'A' && now < effects.shakeUntil;
  const shakeB = effects.shakeSide === 'B' && now < effects.shakeUntil;
  const shakeX = now < effects.shakeUntil ? Math.sin(now / 18) * 4 : 0;

  for (const side of ['A', 'B']) {
    const px = side === 'A' ? LEFT_X : RIGHT_X;
    const shaking = side === 'A' ? shakeA : shakeB;
    ctx.save();
    ctx.beginPath();
    ctx.rect(px, PANEL_Y, PANEL_W, PANEL_H);
    ctx.clip();
    if (shaking) ctx.translate(shakeX, 0);
    ctx.translate(px, PANEL_Y);
    sceneDraw(ctx, side);
    ctx.restore();
    drawPanelFrame(ctx, px, side === 'A' ? 'PICTURE A' : 'PICTURE B');
  }

  // VS badge between the panels.
  ctx.save();
  ctx.fillStyle = '#ffd93b';
  ctx.beginPath();
  ctx.arc(640, PANEL_Y + PANEL_H / 2, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3a2b00';
  ctx.font = '900 17px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VS', 640, PANEL_Y + PANEL_H / 2 + 1);
  ctx.restore();

  // Found markers on both panels.
  for (const diff of level.differences) {
    if (!foundIds.has(diff.id)) continue;
    const pop = effects.pops.find((p) => p.diffId === diff.id);
    const progress = pop ? Math.min((now - pop.startedAt) / 220, 1) : 1;
    for (const side of ['A', 'B']) {
      const c = markerCentre(diff, side);
      drawMarkerRing(ctx, c.x, c.y, diff.r + 4, progress);
    }
  }

  // Hint pulse on both panels (1.6 seconds).
  if (effects.hint) {
    const elapsed = now - effects.hint.startedAt;
    if (elapsed < 1600) {
      const diff = level.differences.find((d) => d.id === effects.hint.diffId);
      if (diff) {
        for (const side of ['A', 'B']) {
          const c = markerCentre(diff, side);
          drawHintPulse(ctx, c.x, c.y, diff.r, elapsed);
        }
      }
    } else {
      effects.hint = null;
    }
  }

  // Wrong-click crosses, fading out.
  effects.wrongs = effects.wrongs.filter((w) => now - w.startedAt < 550);
  for (const w of effects.wrongs) {
    const px = w.side === 'A' ? LEFT_X : RIGHT_X;
    drawWrongCross(ctx, px + w.x, PANEL_Y + w.y, now - w.startedAt);
  }

  // Dim the board behind overlay screens.
  if (dimmed) {
    ctx.fillStyle = 'rgba(10,14,28,0.45)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }
}
