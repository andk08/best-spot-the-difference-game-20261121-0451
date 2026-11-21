// Shared Canvas 2D shape helpers used by every scene painter.
// Each helper only adds a path or a small filled shape; scenes own the colours.
// All coordinates are in the scene's own panel space (600 x 460).

export function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

export function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
}

export function disc(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  circle(ctx, x, y, r);
  ctx.fill();
}

export function blob(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ellipse(ctx, x, y, rx, ry);
  ctx.fill();
}

export function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

export function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

export function star(ctx, cx, cy, outer, inner, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / points - Math.PI / 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

// A soft three-lobed cloud, drawn at (x, y) with the given scale.
export function cloud(ctx, x, y, scale) {
  ctx.fillStyle = '#ffffff';
  circle(ctx, x, y, 20 * scale);
  ctx.fill();
  circle(ctx, x + 22 * scale, y + 4 * scale, 15 * scale);
  ctx.fill();
  circle(ctx, x - 22 * scale, y + 5 * scale, 14 * scale);
  ctx.fill();
  ctx.fillRect(x - 30 * scale, y, 60 * scale, 14 * scale);
}

// A small side-view fish. flip=true faces left.
export function fish(ctx, x, y, scale, body, flip) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flip ? -scale : scale, scale);
  ctx.fillStyle = body;
  ellipse(ctx, 0, 0, 22, 11);
  ctx.fill();
  poly(ctx, [[-18, 0], [-32, -10], [-32, 10]], body);
  ctx.fillStyle = '#ffffff';
  circle(ctx, 10, -3, 3.2);
  ctx.fill();
  ctx.fillStyle = '#1b1b2a';
  circle(ctx, 10.5, -3, 1.6);
  ctx.fill();
  ctx.restore();
}

// A rising bubble with a bright rim.
export function bubble(ctx, x, y, r) {
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = 1.6;
  circle(ctx, x, y, r);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  circle(ctx, x - r * 0.3, y - r * 0.3, r * 0.25);
  ctx.fill();
}

// A five-point starfish.
export function starfish(ctx, x, y, scale, fill) {
  star(ctx, x, y, 20 * scale, 8 * scale, 5, fill);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  circle(ctx, x - 5 * scale, y - 2 * scale, 1.6 * scale);
  ctx.fill();
  circle(ctx, x + 5 * scale, y - 2 * scale, 1.6 * scale);
  ctx.fill();
  circle(ctx, x, y + 4 * scale, 1.6 * scale);
  ctx.fill();
}

// A simple round paper lantern with a top cap and tassel.
export function lantern(ctx, x, y, r, body) {
  disc(ctx, x, y, r, body);
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 1.5;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.ellipse(x, y, r * 0.55, r * (0.9 - Math.abs(i) * 0.12), 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  rect(ctx, x - 6, y - r - 5, 12, 6, '#c9973b');
  ctx.fillStyle = '#c9973b';
  ctx.fillRect(x - 1.5, y + r + 1, 3, 12);
  disc(ctx, x, y + r + 15, 3.5, '#e63946');
}
