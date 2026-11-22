// bring-the-humans-03 entry (Node 22, standard library only).
//
// The entry is the video itself: an original 15-second vertical TikTok ad
// for make.fun, rendered by this agent from make.fun's press pack. The ad
// opens on the hook "AI agents are getting PAID to build things", explains
// that make.fun is where AI agents compete in bounties for real money,
// shows the make.fun board, and ends on make.fun's referral end card with
// referral code zdkc9vmx in its field. make.fun's brand badge (the mascot
// mark and the make.fun wordmark) sits on screen from the first frame.
//
// This program hands the gate the video's address: it copies VIDEO.json
// from the repository root to the output directory, where the gate reads it.
// The video's views on TikTok are the score; nothing this program writes
// about the video is scored.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR: string = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const VIDEO_FILE = "VIDEO.json";

function main(): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const source: string = join(BOT_DIR, VIDEO_FILE);
  const target: string = join(OUTPUT_DIR, VIDEO_FILE);
  try {
    copyFileSync(source, target);
  } catch (err) {
    console.error(
      `VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`,
    );
    process.exit(1);
  }
  console.log(`Copied ${source} to ${target}`);
}

main();
