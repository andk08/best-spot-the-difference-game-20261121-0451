// Scene painter: "Coral Reef Dive" (level 2).
// drawReef(ctx, side) paints one 600x460 panel. side 'A' is the original,
// side 'B' carries the eight deliberate differences listed in levels.js.

import { bubble, circle, disc, ellipse, fish, poly, roundRectPath, starfish } from './draw-helpers.js';

function drawCorals(ctx, side) {
  // Pink branching coral, left. Difference 4: three branches on A, two on B.
  ctx.strokeStyle = '#ff6b9d';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(92, 380);
  ctx.lineTo(92, 320);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(92, 348);
  ctx.quadraticCurveTo(70, 330, 62, 306);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(92, 336);
  ctx.quadraticCurveTo(114, 318, 122, 296);
  ctx.stroke();
  if (side === 'A') {
    ctx.beginPath();
    ctx.moveTo(92, 360);
    ctx.quadraticCurveTo(112, 348, 118, 330);
    ctx.stroke();
  }
  disc(ctx, 92, 318, 7, '#ff6b9d');
  disc(ctx, 62, 304, 6, '#ff6b9d');
  disc(ctx, 122, 294, 6, '#ff6b9d');
  if (side === 'A') disc(ctx, 118, 328, 6, '#ff6b9d');

  // Orange tube coral, right.
  ctx.fillStyle = '#ff9f43';
  roundRectPath(ctx, 492, 330, 16, 52, 8);
  ctx.fill();
  roundRectPath(ctx, 514, 344, 14, 38, 7);
  ctx.fill();
  roundRectPath(ctx, 470, 350, 14, 32, 7);
  ctx.fill();
  disc(ctx, 500, 328, 8, '#ff7f2a');
  disc(ctx, 521, 342, 7, '#ff7f2a');
  disc(ctx, 477, 348, 7, '#ff7f2a');

  // Purple sea fan, centre.
  ctx.strokeStyle = '#9b5de5';
  ctx.lineWidth = 4;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(300, 382);
    ctx.quadraticCurveTo(300 + i * 16, 350, 300 + i * 26, 322);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(155,93,229,0.55)';
  ctx.beginPath();
  ctx.arc(300, 382, 58, Math.PI, 0);
  ctx.stroke();
}

function drawSeaweed(ctx, side) {
  // Three swaying blades. Difference 8: the blade at x=422 is tall on A,
  // short on B.
  const blades = [
    { x: 180, top: 296, colour: '#2fbf71' },
    { x: 250, top: 316, colour: '#37c978' },
    { x: 422, top: side === 'A' ? 292 : 336, colour: '#2fbf71' },
  ];
  for (const b of blades) {
    ctx.strokeStyle = b.colour;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(b.x, 384);
    ctx.quadraticCurveTo(b.x - 14, (384 + b.top) / 2, b.x + 6, b.top);
    ctx.stroke();
  }
}

function drawTurtle(ctx, side) {
  // Difference 6: the turtle swims at (300, 182) on A, (362, 224) on B.
  const tx = side === 'A' ? 300 : 362;
  const ty = side === 'A' ? 182 : 224;
  ctx.fillStyle = '#7ec850';
  ellipse(ctx, tx, ty, 34, 22);
  ctx.fill();
  ctx.fillStyle = '#5da244';
  ellipse(ctx, tx, ty - 4, 26, 14);
  ctx.fill();
  ctx.strokeStyle = '#4a7d33';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(tx, ty - 4, 16, 8, 0, 0, Math.PI * 2);
  ctx.stroke();
  circle(ctx, tx + 36, ty - 4, 9);
  ctx.fillStyle = '#7ec850';
  ctx.fill();
  ctx.fillStyle = '#1b1b2a';
  circle(ctx, tx + 39, ty - 6, 1.8);
  ctx.fill();
  // Flippers.
  ctx.fillStyle = '#6db844';
  ellipse(ctx, tx - 18, ty + 16, 14, 6);
  ctx.fill();
  ellipse(ctx, tx + 18, ty + 16, 14, 6);
  ctx.fill();
}

function drawChest(ctx, side) {
  // Difference 7: the chest is closed on A, open with gold spilling on B.
  ctx.fillStyle = '#8a5a2b';
  roundRectPath(ctx, 488, 380, 64, 34, 5);
  ctx.fill();
  ctx.fillStyle = '#c9973b';
  ctx.fillRect(516, 380, 8, 34);
  if (side === 'A') {
    ctx.fillStyle = '#8a5a2b';
    ctx.beginPath();
    ctx.arc(520, 380, 32, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#c9973b';
    ctx.beginPath();
    ctx.arc(520, 380, 32, Math.PI, 0);
    ctx.closePath();
    ctx.stroke();
    disc(ctx, 520, 380, 5, '#ffd93b');
  } else {
    ctx.fillStyle = '#6e451f';
    ctx.beginPath();
    ctx.moveTo(488, 380);
    ctx.lineTo(488, 352);
    ctx.lineTo(552, 352);
    ctx.lineTo(552, 380);
    ctx.closePath();
    ctx.fill();
    disc(ctx, 500, 372, 6, '#ffd93b');
    disc(ctx, 516, 366, 7, '#ffd93b');
    disc(ctx, 532, 372, 6, '#ffd93b');
    disc(ctx, 508, 356, 5, '#ffd93b');
    disc(ctx, 526, 354, 5, '#ffd93b');
  }
}

function drawSand(ctx, side) {
  ctx.fillStyle = '#e8d29a';
  ctx.beginPath();
  ctx.moveTo(0, 392);
  ctx.quadraticCurveTo(150, 372, 300, 390);
  ctx.quadraticCurveTo(450, 406, 600, 388);
  ctx.lineTo(600, 460);
  ctx.lineTo(0, 460);
  ctx.closePath();
  ctx.fill();
  // Difference 2: the starfish on the sand exists on A only.
  if (side === 'A') starfish(ctx, 150, 412, 1, '#ff8fab');
  // Difference 3: an extra shell at (382, 420) on B only.
  if (side === 'B') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(382, 420, 13, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#c9a0c9';
    ctx.lineWidth = 1.5;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(382, 420);
      ctx.lineTo(382 + i * 5, 408);
      ctx.stroke();
    }
  }
  // A small pebble trio for texture.
  disc(ctx, 60, 430, 6, '#cbb27f');
  disc(ctx, 260, 438, 5, '#cbb27f');
  disc(ctx, 560, 428, 6, '#cbb27f');
}

export function drawReef(ctx, side) {
  const water = ctx.createLinearGradient(0, 0, 0, 460);
  water.addColorStop(0, '#2f8fd0');
  water.addColorStop(0.55, '#1b6fb5');
  water.addColorStop(1, '#0a4d8c');
  ctx.fillStyle = water;
  ctx.fillRect(0, 0, 600, 460);

  // Sunlight shafts from the surface.
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  poly(ctx, [[90, 0], [150, 0], [90, 300], [30, 300]], 'rgba(255,255,255,0.10)');
  poly(ctx, [[330, 0], [370, 0], [330, 260], [290, 260]], 'rgba(255,255,255,0.08)');
  poly(ctx, [[500, 0], [530, 0], [500, 200], [470, 200]], 'rgba(255,255,255,0.08)');

  // Bubbles rising from the corals — difference 5: one extra bubble on B.
  bubble(ctx, 92, 288, 7);
  bubble(ctx, 104, 262, 5);
  bubble(ctx, 84, 240, 4);
  bubble(ctx, 500, 300, 6);
  bubble(ctx, 512, 272, 4);
  if (side === 'B') bubble(ctx, 302, 100, 6);
  bubble(ctx, 300, 130, 4);

  // Fish — difference 1: the fish at (200, 150) is orange on A, yellow on B.
  fish(ctx, 200, 150, 1, side === 'A' ? '#ff9f43' : '#ffd93b', false);
  fish(ctx, 350, 120, 0.85, '#ffd93b', true);
  fish(ctx, 450, 200, 0.9, '#7ec8f7', false);
  fish(ctx, 120, 224, 0.8, '#ff8fab', true);
  fish(ctx, 420, 90, 0.7, '#ff8fab', false);

  drawTurtle(ctx, side);
  drawCorals(ctx, side);
  drawSeaweed(ctx, side);
  drawSand(ctx, side);
  drawChest(ctx, side);

  // A shy clownfish peeking from behind the orange coral.
  fish(ctx, 540, 330, 0.55, '#ff7f2a', true);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(532, 326, 3, 8);
}
