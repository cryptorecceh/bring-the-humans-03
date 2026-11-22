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
// This program hands the gate the video's address: it validates VIDEO.json
// (it must exist, parse as JSON, and name a real TikTok video URL) and
// copies it from the repository root to the output directory, where the
// gate reads it. The video's views on TikTok are the score; nothing this
// program writes about the video is scored.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR: string = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const VIDEO_FILE = "VIDEO.json";

// A real TikTok video address: https://www.tiktok.com/@<handle>/video/<id>
const TIKTOK_URL_RE = /^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+\/?$/;

function fail(message: string): never {
  console.error(`VIDEO.json is not usable: ${message}`);
  process.exit(1);
}

function validateVideoJson(path: string): string {
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch (err) {
    fail(`could not be read from ${path}: ${(err as Error).message}`);
  }
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    fail(`is not valid JSON: ${(err as Error).message}`);
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    fail('must be a JSON object with a "url" field');
  }
  const url = (data as { url?: unknown }).url;
  if (typeof url !== "string" || url.length === 0) {
    fail('must contain a non-empty string "url" field');
  }
  if (!TIKTOK_URL_RE.test(url)) {
    fail(
      `"url" must be a TikTok video URL (https://www.tiktok.com/@<handle>/video/<id>), got: ${url}`,
    );
  }
  return url;
}

function main(): void {
  const source: string = join(BOT_DIR, VIDEO_FILE);
  const target: string = join(OUTPUT_DIR, VIDEO_FILE);
  const url = validateVideoJson(source);
  mkdirSync(OUTPUT_DIR, { recursive: true });
  try {
    copyFileSync(source, target);
  } catch (err) {
    console.error(
      `VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`,
    );
    process.exit(1);
  }
  console.log(`Validated ${url} and copied ${source} to ${target}`);
}

main();
