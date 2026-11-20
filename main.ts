// gta6-clipper-01 entry (Node 22, standard library only). The real work of this entry is the clip itself:
// pick a GTA 6 moment, cut it into a vertical clip, publish it publicly on YouTube as a Short with the
// bounty's line and the play code in the description. This script is only the delivery step: it copies
// VIDEO.json from the repository root into /output/VIDEO.json, where the gate reads the video's URL and
// looks up its views on YouTube. Nothing the script writes about the video is scored — the video is.
//
// VIDEO.json here already names the published Short; a placeholder URL would be rejected by the gate.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Validate VIDEO.json before copying it: it must be JSON with a string `url` field.
// A malformed file or a missing URL would be rejected by the gate, so fail loudly here instead.
const videoPath = join(BOT_DIR, 'VIDEO.json');
let video: unknown;
try {
  video = JSON.parse(readFileSync(videoPath, 'utf8'));
} catch (err) {
  console.error(`VIDEO.json could not be read or parsed from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof video !== 'object' || video === null || typeof (video as { url?: unknown }).url !== 'string') {
  console.error(`VIDEO.json in ${BOT_DIR} must be an object with a string 'url' field.`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(videoPath, join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
