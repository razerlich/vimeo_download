import fs from "fs";
import { downloadVimeoPrivateVideo } from "./downloadVimeo.js";

// Usage:
//   Download a single video:
//     node index.js <vimeoUrlOrId> [outputFile] [refererDomain] [durationSeconds]
//
//   Download many videos at once:
//     - Put one URL or id per line in links.txt, then run:
//         node index.js
//     - Or pass several ids/urls directly:
//         node index.js 1234567890 1234567890 https://player.vimeo.com/video/123
//
//   When downloading many videos, outputFile/duration are ignored and each
//   file is auto-named after the video's title.

const LINKS_FILE = "links.txt";

// Turn a bare id ("1234567890") or any vimeo url into a full player url.
function normalizeVimeoUrl(input) {
  const value = input.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  // Pull the numeric id out of whatever was pasted, else assume it's an id.
  const id = value.match(/\d{6,}/)?.[0] || value;
  return `https://player.vimeo.com/video/${id}`;
}

// Read links.txt, ignoring blank lines and # comments.
function readLinksFile() {
  if (!fs.existsSync(LINKS_FILE)) return [];
  return fs
    .readFileSync(LINKS_FILE, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

const [, , vimeoUrl, outputFile, refererDomain, durationArg] = process.argv;
const extraArgs = process.argv.slice(2);

const domain = refererDomain || "https://player.vimeo.com/";

// Decide whether this is a single download or a batch.
// Batch when: no CLI url given (use links.txt), or more than one arg passed.
const isBatch = !vimeoUrl || extraArgs.length > 1;

if (isBatch) {
  const rawLinks = vimeoUrl ? extraArgs : readLinksFile();
  const urls = rawLinks.map(normalizeVimeoUrl).filter(Boolean);

  if (urls.length === 0) {
    console.error(
      `No links found. Add one URL/id per line to ${LINKS_FILE}, or pass them as arguments.`
    );
    process.exit(1);
  }

  console.log(`Found ${urls.length} video(s) to download.\n`);

  let succeeded = 0;
  for (let i = 0; i < urls.length; i++) {
    const pre = `[${i + 1}/${urls.length}] `;
    try {
      await downloadVimeoPrivateVideo(urls[i], domain, undefined, undefined, pre);
      succeeded++;
    } catch (error) {
      console.error(`${pre}Failed:`, error);
    }
  }

  console.log(`\nDone. ${succeeded}/${urls.length} downloaded.`);
} else {
  const url = normalizeVimeoUrl(vimeoUrl);
  const duration = durationArg ? parseInt(durationArg, 10) : undefined;
  // Leave outputFile undefined to auto-name the file after the video's title.
  await downloadVimeoPrivateVideo(url, domain, outputFile, duration);
}
