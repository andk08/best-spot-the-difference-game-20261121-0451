// Scene painter: "Maple Park Morning" (level 1).
// drawPark(ctx, side) paints one 600x460 panel. side 'A' is the original,
// side 'B' carries the eight deliberate differences listed in levels.js.

import { blob, circle, cloud, disc, ellipse, poly, roundRectPath } from './draw-helpers.js';

function drawSun(ctx, side) {
  // Sun rays.
  ctx.strokeStyle = '#f5b301';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * i) / 4;
    ctx.beginPath();
    ctx.moveTo(90 + Math.cos(a) * 46, 70 + Math.sin(a) * 46);
    ctx.lineTo(90 + Math.cos(a) * 58, 70 + Math.sin(a) * 58);
    ctx.stroke();
  }
  disc(ctx, 90, 70, 38, '#ffd93b');
  if (side === 'A') {
    // Difference 1: the sun wears sunglasses on the left panel only.
    ctx.fillStyle = '#1b1b2a';
    ellipse(ctx, 76, 66, 11, 8);
    ctx.fill();
    ellipse(ctx, 104, 66, 11, 8);
    ctx.fill();
    ctx.strokeStyle = '#1b1b2a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(87, 66);
    ctx.lineTo(93, 66);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(90, 84, 7, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }
}

function drawTree(ctx, side) {
  // Trunk and three-lobed canopy.
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(102, 250, 18, 78);
  ctx.fillStyle = '#4e9b47';
  circle(ctx, 112, 210, 52);
  ctx.fill();
  circle(ctx, 70, 232, 36);
  ctx.fill();
  circle(ctx, 154, 232, 36);
  ctx.fill();
  // Difference 3: red apples on A, green apples on B.
  const apple = side === 'A' ? '#e63946' : '#7ec850';
  disc(ctx, 88, 196, 7, apple);
  disc(ctx, 128, 222, 7, apple);
  disc(ctx, 148, 196, 7, apple);
}

function drawBench(ctx, side) {
  // Wooden bench: legs, seat slats and backrest.
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(268, 318, 74, 10);
  ctx.fillRect(268, 334, 74, 10);
  ctx.fillRect(272, 344, 8, 26);
  ctx.fillRect(330, 344, 8, 26);
  ctx.fillRect(268, 300, 8, 44);
  ctx.fillRect(334, 300, 8, 44);
  if (side === 'A') {
    // Difference 4: a red cushion sits on the bench on A only.
    ctx.fillStyle = '#e63946';
    roundRectPath(ctx, 274, 322, 62, 10, 5);
    ctx.fill();
  }
}

function drawPond(ctx, side) {
  blob(ctx, 432, 382, 92, 30, '#5aa9e6');
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(400, 380, 34, 8, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(462, 392, 26, 6, 0, 0, Math.PI * 2);
  ctx.stroke();
  if (side === 'A') {
    // Difference 8: a duck paddles on the pond on A only.
    ctx.fillStyle = '#ffffff';
    ellipse(ctx, 432, 378, 16, 10);
    ctx.fill();
    circle(ctx, 445, 368, 7);
    ctx.fill();
    ctx.fillStyle = '#f5a623';
    poly(ctx, [[451, 368], [459, 370], [451, 372]], '#f5a623');
    ctx.fillStyle = '#1b1b2a';
    circle(ctx, 447, 366, 1.6);
    ctx.fill();
  }
}

function drawFlowers(ctx, side) {
  // A row of small five-petal flowers along the bottom.
  const spots = [
    [40, 420, '#e63946'], [80, 436, '#ff8fab'], [520, 402, null],
    [560, 430, '#ff8fab'], [240, 428, '#e63946'], [350, 440, '#ffd93b'],
  ];
  for (const [x, y, colour] of spots) {
    // Difference 5: the flower at (520, 402) is purple on A, pink on B.
    const petal = colour === null ? (side === 'A' ? '#9b5de5' : '#ff8fab') : colour;
    ctx.fillStyle = petal;
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      circle(ctx, x + Math.cos(a) * 6, y + Math.sin(a) * 6, 4.5);
      ctx.fill();
    }
    disc(ctx, x, y, 3.5, '#ffd93b');
  }
}

function drawKite(ctx, side) {
  // Difference 7: the kite flies high on A, lower and left on B.
  const kx = side === 'A' ? 482 : 428;
  const ky = side === 'A' ? 142 : 196;
  ctx.strokeStyle = '#5a4632';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(kx, ky + 22);
  ctx.quadraticCurveTo(kx - 30, ky + 80, kx - 70, ky + 150);
  ctx.stroke();
  poly(ctx, [[kx, ky - 22], [kx + 20, ky], [kx, ky + 22], [kx - 20, ky]], '#e63946');
  poly(ctx, [[kx, ky - 22], [kx + 20, ky], [kx, ky + 22]], '#ffd93b');
  ctx.fillStyle = '#2fbf71';
  disc(ctx, kx - 14, ky + 52, 4, '#2fbf71');
  disc(ctx, kx - 38, ky + 96, 4, '#2fbf71');
}

function drawBird(ctx, x, y) {
  ctx.strokeStyle = '#2b2b3a';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 10, y);
  ctx.quadraticCurveTo(x - 3, y - 8, x, y);
  ctx.quadraticCurveTo(x + 3, y - 8, x + 10, y);
  ctx.stroke();
}

export function drawPark(ctx, side) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#6ec1f5');
  sky.addColorStop(1, '#d6f2fd');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 300);

  // Grassy ground with two rolling hills.
  ctx.fillStyle = '#7ec850';
  ctx.fillRect(0, 300, 600, 160);
  blob(ctx, 120, 330, 190, 46, '#6db844');
  blob(ctx, 480, 340, 200, 50, '#6db844');

  drawSun(ctx, side);

  // Clouds — difference 2: the cloud at (500, 92) exists on A only.
  cloud(ctx, 205, 62, 1);
  cloud(ctx, 380, 46, 0.8);
  if (side === 'A') cloud(ctx, 500, 92, 0.9);

  // Birds — difference 6: an extra bird at (352, 92) on B only.
  drawBird(ctx, 250, 112);
  drawBird(ctx, 452, 72);
  if (side === 'B') drawBird(ctx, 352, 92);

  drawTree(ctx, side);
  drawKite(ctx, side);

  // Winding path from the bottom edge up to the bench.
  ctx.fillStyle = '#e8d29a';
  ctx.beginPath();
  ctx.moveTo(270, 460);
  ctx.quadraticCurveTo(300, 400, 305, 350);
  ctx.quadraticCurveTo(308, 330, 330, 330);
  ctx.lineTo(330, 350);
  ctx.quadraticCurveTo(322, 400, 330, 460);
  ctx.closePath();
  ctx.fill();

  drawBench(ctx, side);
  drawPond(ctx, side);

  // Picnic blanket with a checked pattern, bottom left.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(150, 392, 90, 52);
  ctx.fillStyle = '#e63946';
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 6; c++) {
      if ((r + c) % 2 === 0) ctx.fillRect(150 + c * 15, 392 + r * 13, 15, 13);
    }
  }
  // A basket on the blanket.
  ctx.fillStyle = '#b07a3f';
  roundRectPath(ctx, 178, 408, 34, 22, 4);
  ctx.fill();
  ctx.strokeStyle = '#7a4a21';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(195, 408, 12, Math.PI, 0);
  ctx.stroke();

  drawFlowers(ctx, side);

  // Butterfly near the flowers.
  ctx.fillStyle = '#9b5de5';
  ellipse(ctx, 368, 420, 7, 10);
  ctx.fill();
  ellipse(ctx, 382, 420, 7, 10);
  ctx.fill();
  ctx.fillStyle = '#2b2b3a';
  ctx.fillRect(374, 412, 2, 18);

  // A distant second tree for depth.
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(556, 292, 10, 34);
  ctx.fillStyle = '#5da244';
  circle(ctx, 561, 282, 24);
  ctx.fill();
  circle(ctx, 544, 292, 16);
  ctx.fill();
  circle(ctx, 578, 292, 16);
  ctx.fill();
}
