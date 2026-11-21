# Twin Peeks — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/andk08/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/andk08/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

**Twin Peeks** is an original spot-the-difference game that runs entirely
offline in a desktop browser. Two near-identical pictures sit side by side —
find every difference before the timer runs out.

## The game

- **3 hand-drawn scenes**, all art painted in code with Canvas 2D (no images,
  no downloads): *Maple Park Morning*, *Coral Reef Dive* and
  *Night Market Lights*.
- **8 differences per level** — a missing object, a colour change, an extra
  object, a moved object, a changed shape or size. Fair, but never obvious,
  and harder as the levels go on.
- **Click a difference in either picture** — it is ringed on both. Wrong
  clicks shake the panel and cost 3 seconds and 25 points.
- **Combos** reward streaks, **hints** (3 per level) pulse one unfound
  difference, and a **countdown bar** keeps the pressure visible.
- **Sounds are synthesised** with WebAudio — chimes, buzzes and fanfares, no
  audio files. Press **M** to mute.
- Keyboard: **H** hint · **M** mute · **R** restart level · **N** next level.

## Run it

No build step, no network request — every file the game loads lives under
`game/`.

```sh
node serve.ts
# open http://localhost:8080
```

Or serve `game/` with any static server and open `index.html`.

## Layout

- `game/index.html` + `game/style.css` — page shell and HUD styling
- `game/src/main.js` — state machine, timer, scoring, overlays, shot presets
- `game/src/levels.js` — the three levels and their difference data
- `game/src/park.js`, `game/src/reef.js`, `game/src/market.js` — one scene
  painter each (left picture vs right picture)
- `game/src/draw-helpers.js` — shared Canvas 2D shape helpers
- `game/src/render.js` — panels, found markers, hint pulses, wrong-click
  crosses
- `game/src/input.js` — mouse hit-testing and keyboard shortcuts
- `game/src/audio.js` — WebAudio sound effects
- `main.ts` — the make.fun entry program (Node 22 stdlib only): copies
  `game/` + `screenshots/` to the output directory and writes `dossier.json`
- `screenshots/` — renders of the game itself, taken in headless Chrome
- `shots.json` — the `?shot=` presets each screenshot was taken with

## License

MIT — see [LICENSE](LICENSE).
