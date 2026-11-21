// Level data for Twin Peeks: three scenes, eight differences each.
// Coordinates are in panel space (600 x 460). A difference has one centre
// (x, y) on both panels, except a "moved" difference, which also carries
// the right-panel centre (x2, y2) — the marker is drawn at each side's own
// position. r is the click tolerance radius around the centre.

export const PANEL_W = 600;
export const PANEL_H = 460;

export const LEVELS = [
  {
    id: 'park',
    name: 'Maple Park Morning',
    scene: 'park',
    time: 150,
    blurb: 'A sunny morning in Maple Park. Find 8 changes hiding in plain sight.',
    differences: [
      { id: 'sun-face', label: 'the sun lost its sunglasses', kind: 'shape', x: 90, y: 70, r: 42 },
      { id: 'cloud-gone', label: 'a cloud drifted away', kind: 'missing', x: 500, y: 92, r: 44 },
      { id: 'apple-colour', label: 'the apples changed colour', kind: 'colour', x: 112, y: 214, r: 36 },
      { id: 'bench-cushion', label: 'the bench lost its cushion', kind: 'missing', x: 305, y: 332, r: 38 },
      { id: 'flower-colour', label: 'a flower changed colour', kind: 'colour', x: 520, y: 402, r: 22 },
      { id: 'extra-bird', label: 'an extra bird appeared', kind: 'extra', x: 352, y: 92, r: 26 },
      { id: 'kite-moved', label: 'the kite moved', kind: 'moved', x: 482, y: 142, x2: 428, y2: 196, r: 38 },
      { id: 'duck-gone', label: 'the duck swam away', kind: 'missing', x: 432, y: 378, r: 30 },
    ],
  },
  {
    id: 'reef',
    name: 'Coral Reef Dive',
    scene: 'reef',
    time: 140,
    blurb: 'Down on the reef the fish are hiding eight secrets. Look closely.',
    differences: [
      { id: 'fish-colour', label: 'a fish changed colour', kind: 'colour', x: 200, y: 150, r: 30 },
      { id: 'starfish-gone', label: 'the starfish vanished', kind: 'missing', x: 150, y: 412, r: 26 },
      { id: 'extra-shell', label: 'an extra shell appeared', kind: 'extra', x: 382, y: 420, r: 24 },
      { id: 'coral-branch', label: 'the coral lost a branch', kind: 'missing', x: 92, y: 330, r: 38 },
      { id: 'extra-bubble', label: 'an extra bubble rose up', kind: 'extra', x: 302, y: 100, r: 22 },
      { id: 'turtle-moved', label: 'the turtle swam away', kind: 'moved', x: 300, y: 182, x2: 362, y2: 224, r: 38 },
      { id: 'chest-open', label: 'the treasure chest opened', kind: 'shape', x: 520, y: 396, r: 36 },
      { id: 'seaweed-short', label: 'the seaweed shrank', kind: 'size', x: 422, y: 314, r: 32 },
    ],
  },
  {
    id: 'market',
    name: 'Night Market Lights',
    scene: 'market',
    time: 120,
    blurb: 'The night market glows — but eight details are not the same twice.',
    differences: [
      { id: 'lantern-colour', label: 'a lantern changed colour', kind: 'colour', x: 450, y: 172, r: 26 },
      { id: 'sign-shape', label: 'the stall sign changed shape', kind: 'shape', x: 450, y: 252, r: 28 },
      { id: 'extra-lantern', label: 'an extra lantern appeared', kind: 'extra', x: 300, y: 152, r: 24 },
      { id: 'moon-shape', label: 'the moon changed shape', kind: 'shape', x: 520, y: 62, r: 34 },
      { id: 'flag-colour', label: 'a bunting flag changed colour', kind: 'colour', x: 250, y: 152, r: 20 },
      { id: 'awning-stripes', label: 'the awning lost a stripe', kind: 'missing', x: 150, y: 282, r: 34 },
      { id: 'cat-gone', label: 'the stall cat wandered off', kind: 'missing', x: 150, y: 238, r: 26 },
      { id: 'bulb-out', label: 'a string-light bulb went out', kind: 'missing', x: 214, y: 108, r: 20 },
    ],
  },
];

// Centre of a difference on one side's panel. Moved differences sit at
// (x, y) on the left panel and (x2, y2) on the right panel.
export function diffPos(diff, side) {
  if (side === 'B' && diff.x2 !== undefined) return { x: diff.x2, y: diff.y2 };
  return { x: diff.x, y: diff.y };
}

// Star thresholds for the final win screen, on total score.
export const STAR_THRESHOLDS = { three: 4200, two: 3000 };

export function starsForScore(score) {
  if (score >= STAR_THRESHOLDS.three) return 3;
  if (score >= STAR_THRESHOLDS.two) return 2;
  return 1;
}
