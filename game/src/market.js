// Scene painter: "Night Market Lights" (level 3).
// drawMarket(ctx, side) paints one 600x460 panel. side 'A' is the original,
// side 'B' carries the eight deliberate differences listed in levels.js.

import { circle, disc, ellipse, lantern, poly, roundRectPath, star } from './draw-helpers.js';

function drawStars(ctx) {
  const spots = [[40, 40], [120, 26], [210, 48], [300, 30], [380, 44], [470, 26], [560, 110], [30, 130], [90, 90], [560, 40]];
  for (const [x, y] of spots) star(ctx, x, y, 3.5, 1.5, 4, 'rgba(255,255,255,0.85)');
}

function drawMoon(ctx, side) {
  // Difference 4: a full moon on A, a crescent on B.
  disc(ctx, 520, 62, 30, '#f5e6b8');
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  disc(ctx, 510, 54, 5, 'rgba(0,0,0,0.12)');
  disc(ctx, 530, 70, 4, 'rgba(0,0,0,0.12)');
  if (side === 'B') disc(ctx, 534, 52, 26, '#2b2a55');
}

function drawStringLights(ctx, side) {
  // Two sagging strings of warm bulbs across the top.
  const strings = [
    { from: [0, 60], to: [300, 96] },
    { from: [300, 96], to: [600, 58] },
  ];
  for (let si = 0; si < strings.length; si++) {
    const s = strings[si];
    ctx.strokeStyle = '#1b1b2a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s.from[0], s.from[1]);
    ctx.quadraticCurveTo((s.from[0] + s.to[0]) / 2, (s.from[1] + s.to[1]) / 2 + 34, s.to[0], s.to[1]);
    ctx.stroke();
    for (let i = 1; i < 7; i++) {
      const t = i / 7;
      const x = s.from[0] + (s.to[0] - s.from[0]) * t;
      const y = s.from[1] + (s.to[1] - s.from[1]) * t + 34 * 2 * t * (1 - t);
      // Difference 8: the fifth bulb of the first string (at about 214, 108)
      // is lit on A, dark on B.
      const isDeadBulb = si === 0 && i === 5;
      const lit = !(side === 'B' && isDeadBulb);
      disc(ctx, x, y + 8, 5, lit ? '#ffd93b' : '#3a3a4a');
      if (lit) {
        ctx.fillStyle = 'rgba(255,217,59,0.25)';
        circle(ctx, x, y + 8, 10);
        ctx.fill();
      }
    }
  }
}

function drawBunting(ctx, side) {
  // A row of triangle flags. Difference 5: the flag at x=250 is blue on A,
  // green on B.
  const colours = ['#e63946', '#ffd93b', '#2fbf71', '#7ec8f7', '#ff8fab'];
  ctx.strokeStyle = '#1b1b2a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 130);
  ctx.quadraticCurveTo(300, 168, 540, 128);
  ctx.stroke();
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const x = 60 + (540 - 60) * t;
    const y = 130 + (128 - 130) * t + 26 * 2 * t * (1 - t);
    let colour = colours[i % colours.length];
    if (Math.abs(x - 250) < 18) colour = side === 'A' ? '#7ec8f7' : '#2fbf71';
    poly(ctx, [[x - 13, y], [x + 13, y], [x, y + 22]], colour);
  }
}

function drawLeftStall(ctx, side) {
  // Food stall with a striped awning. Difference 6: five stripes on A,
  // four on B. Difference 7: a cat naps on the roof on A only.
  ctx.fillStyle = '#5a3a1e';
  ctx.fillRect(96, 300, 110, 100);
  ctx.fillStyle = '#3a2a18';
  ctx.fillRect(96, 300, 110, 8);
  // Awning.
  const stripes = side === 'A' ? 5 : 4;
  const awningW = 130;
  for (let i = 0; i < stripes; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#e63946' : '#ffffff';
    ctx.fillRect(86 + (awningW / stripes) * i, 272, awningW / stripes, 28);
  }
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(86, 272, 4, 30);
  ctx.fillRect(212, 272, 4, 30);
  // Counter goods: dumpling baskets and fruit.
  disc(ctx, 120, 322, 10, '#f5e6b8');
  disc(ctx, 146, 322, 10, '#f5e6b8');
  disc(ctx, 172, 322, 8, '#ff9f43');
  disc(ctx, 190, 322, 8, '#e63946');
  // Stall sign: a steaming bowl.
  ctx.fillStyle = '#ffd93b';
  roundRectPath(ctx, 118, 340, 66, 34, 6);
  ctx.fill();
  ctx.fillStyle = '#1b1b2a';
  ctx.fillRect(132, 352, 38, 4);
  ctx.fillRect(138, 360, 26, 4);
  // The cat on the roof.
  if (side === 'A') {
    ctx.fillStyle = '#2b2b3a';
    ellipse(ctx, 150, 240, 20, 11);
    ctx.fill();
    circle(ctx, 168, 232, 8);
    ctx.fill();
    poly(ctx, [[162, 226], [164, 216], [168, 224]], '#2b2b3a');
    poly(ctx, [[170, 224], [174, 216], [176, 226]], '#2b2b3a');
    ctx.strokeStyle = '#2b2b3a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(130, 238);
    ctx.quadraticCurveTo(118, 232, 122, 222);
    ctx.stroke();
  }
}

function drawRightStall(ctx, side) {
  // Lantern stall. Difference 2: a round sign on A, a square sign on B.
  ctx.fillStyle = '#4a2c4d';
  ctx.fillRect(396, 300, 130, 100);
  ctx.fillStyle = '#2c1a2e';
  ctx.fillRect(396, 300, 130, 8);
  // Awning, teal and cream.
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#2fbf71' : '#f5e6b8';
    ctx.fillRect(386 + 26 * i, 272, 26, 28);
  }
  // Hanging lanterns — difference 1: the middle lantern is red on A,
  // gold on B. Difference 3: an extra lantern at (300, 152) on B only.
  lantern(ctx, 380, 178, 16, '#e63946');
  lantern(ctx, 450, 172, 16, side === 'A' ? '#e63946' : '#ffd93b');
  lantern(ctx, 520, 188, 16, '#e63946');
  if (side === 'B') lantern(ctx, 300, 152, 13, '#e63946');
  // Stall sign.
  ctx.fillStyle = '#ffd93b';
  if (side === 'A') {
    circle(ctx, 450, 252, 22);
    ctx.fill();
  } else {
    roundRectPath(ctx, 428, 230, 44, 44, 6);
    ctx.fill();
  }
  ctx.fillStyle = '#1b1b2a';
  ctx.font = 'bold 20px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('灯', 450, 253);
  // Lanterns for sale on the counter.
  disc(ctx, 420, 330, 9, '#e63946');
  disc(ctx, 448, 330, 9, '#ffd93b');
  disc(ctx, 476, 330, 9, '#e63946');
  disc(ctx, 504, 330, 9, '#ff8fab');
}

export function drawMarket(ctx, side) {
  const dusk = ctx.createLinearGradient(0, 0, 0, 460);
  dusk.addColorStop(0, '#2b2a55');
  dusk.addColorStop(0.6, '#5a3a6e');
  dusk.addColorStop(1, '#7a4a8a');
  ctx.fillStyle = dusk;
  ctx.fillRect(0, 0, 600, 460);

  drawStars(ctx);
  drawMoon(ctx, side);
  drawStringLights(ctx, side);
  drawBunting(ctx, side);

  // Distant rooftops.
  ctx.fillStyle = '#241f3d';
  poly(ctx, [[0, 400], [0, 330], [70, 300], [140, 330], [140, 400]], '#241f3d');
  poly(ctx, [[460, 400], [460, 322], [540, 292], [600, 322], [600, 400]], '#241f3d');
  ctx.fillStyle = '#ffd93b';
  ctx.fillRect(30, 350, 12, 16);
  ctx.fillRect(90, 348, 12, 16);
  ctx.fillRect(500, 344, 12, 16);
  ctx.fillRect(556, 348, 12, 16);

  // Cobblestone ground.
  ctx.fillStyle = '#3a3348';
  ctx.fillRect(0, 400, 600, 60);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 1.5;
  for (let y = 412; y < 460; y += 14) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(600, y);
    ctx.stroke();
  }
  for (let x = 20; x < 600; x += 44) {
    ctx.beginPath();
    ctx.moveTo(x, 400);
    ctx.lineTo(x - 8, 460);
    ctx.stroke();
  }

  drawLeftStall(ctx, side);
  drawRightStall(ctx, side);

  // A shopper with a paper bag strolling between the stalls.
  ctx.fillStyle = '#2b2b3a';
  circle(ctx, 300, 330, 12);
  ctx.fill();
  roundRectPath(ctx, 286, 342, 28, 44, 10);
  ctx.fill();
  ctx.fillStyle = '#ffd93b';
  ctx.fillRect(292, 388, 6, 20);
  ctx.fillRect(304, 388, 6, 20);
  ctx.fillStyle = '#e63946';
  ctx.fillRect(316, 360, 14, 18);
}
