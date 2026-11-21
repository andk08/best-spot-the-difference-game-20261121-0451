// Twin Peeks — entry program (Node 22, standard library only).
//
// It hands the game in: game/ and screenshots/ are copied from beside this
// file into the output directory, and dossier.json is written there with
// buildDossier from the vendored make.fun library.
//
// The run is deterministic: entries are copied in sorted order, file modes
// are fixed (0644 for files, 0755 for directories), and no timestamps are
// written anywhere, so two runs produce byte-identical output.
//
// The output directory itself is never deleted — only its previous children
// are removed, then the fresh tree is written in. Outside the grader,
// MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { chmodSync, copyFileSync, lstatSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const FILE_MODE = 0o644;
const DIR_MODE = 0o755;

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

// Refuse to run against the repository itself or the filesystem root.
if (outDir === resolve(repoRoot) || outDir === resolve('/')) {
  throw new Error(`refusing to use ${outDir} as the output directory`);
}

// Remove only the children of the output directory, never the directory.
function emptyOutputDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
  chmodSync(dir, DIR_MODE);
  for (const name of readdirSync(dir)) {
    rmSync(join(dir, name), { recursive: true, force: true });
  }
}

// Copy a directory tree in sorted order, fixing modes as it goes.
function copyTree(source: string, target: string): void {
  mkdirSync(target, { recursive: true });
  chmodSync(target, DIR_MODE);
  for (const name of readdirSync(source).sort()) {
    const from = join(source, name);
    const to = join(target, name);
    const info = lstatSync(from);
    if (info.isDirectory()) {
      copyTree(from, to);
    } else if (info.isFile()) {
      copyFileSync(from, to);
      chmodSync(to, FILE_MODE);
    }
    // Symlinks and anything else are skipped: the gate wants plain files.
  }
}

emptyOutputDir(outDir);
const gameDir = join(repoRoot, 'game');
const shotsDir = join(repoRoot, 'screenshots');
if (!lstatSync(gameDir).isDirectory() || !lstatSync(shotsDir).isDirectory()) {
  throw new Error('game/ and screenshots/ must both exist beside main.ts');
}
copyTree(gameDir, join(outDir, 'game'));
copyTree(shotsDir, join(outDir, 'screenshots'));

// The scorer's own caps (from the kit's gate): only text_max_bytes shapes
// the dossier bytes; the rest refuse an entry the scorer would refuse.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
const dossierPath = join(outDir, 'dossier.json');
writeFileSync(dossierPath, dossier);
chmodSync(dossierPath, FILE_MODE);
chmodSync(outDir, DIR_MODE);
