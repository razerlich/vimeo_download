
# 🎬 Vimeo Private Video Downloader using Node.js 🚀

Welcome to the **Vimeo Private Video Downloader**! This project uses Node.js, axios, cheerio, and FFmpeg to download private Vimeo videos — one at a time or in bulk. Think of this repo as your treasure map to video-saving glory! 🏴‍☠️💾

## 🛠️ Requirements

Before you start, make sure you have the following installed:

- **Node.js** (v16 or later) - [Download Node.js](https://nodejs.org/)
- **FFmpeg** - A powerful tool for video and audio processing.

### How to Check if FFmpeg is Installed:

1. Open your terminal/command prompt.
2. Type the following command:

```bash
ffmpeg -version
```

If FFmpeg is installed, you'll see version details. 🎉

### Installing FFmpeg (If Not Already Installed):

- **Windows**: Download from the [official FFmpeg site](https://ffmpeg.org/download.html), extract the files, and add the `bin` folder to your system’s PATH.
- **MacOS**: Use Homebrew to install:

```bash
brew install ffmpeg
```

- **Linux**: Run this command:

```bash
sudo apt update && sudo apt install ffmpeg
```

Once installed, run `ffmpeg -version` again to verify everything’s working. 🚀

---

## ⚙️ Setup the Project

1. Clone (or download) this repository and move into it:

```bash
git clone <repo-url> vimeo-downloader
cd vimeo-downloader
```

2. Install the dependencies:

```bash
npm install
```

That's it — all required packages (axios, cheerio, cli-progress, …) are listed in `package.json`. 🌌

---

## 🏃‍♂️ Running the Script

The entry point is `index.js`. You don't need to edit any source files — just pass the video URL or id on the command line.

### Download a single video

```bash
node index.js <vimeoUrlOrId> [outputFile] [refererDomain] [durationSeconds]
```

- `vimeoUrlOrId` — a full player URL (`https://player.vimeo.com/video/1234567890`) or just the numeric id (`1234567890`).
- `outputFile` *(optional)* — where to save the `.mp4`. If omitted, the file is auto-named after the video's title.
- `refererDomain` *(optional)* — the referer to send with the request. Defaults to `https://player.vimeo.com/`.
- `durationSeconds` *(optional)* — used to estimate download progress. Defaults to the video's reported duration.

Examples:

```bash
node index.js 1234567890
node index.js https://player.vimeo.com/video/1234567890 my-video.mp4
```

### Download many videos at once (batch mode)

You can grab a whole list in one run, either from a file or straight from the command line.

**Option A — `links.txt`:** Put one URL or id per line in `links.txt`, then run with no arguments:

```bash
node index.js
```

```text
# links.txt — one Vimeo video per line.
# Full player URL or just the id. Blank lines and # comments are ignored.
1234567890
https://player.vimeo.com/video/1234567890
```

**Option B — pass several directly:**

```bash
node index.js 1234567890 1234567890 https://player.vimeo.com/video/123
```

In batch mode each file is auto-named after the video's title, and `outputFile`/`duration` are ignored. Progress is prefixed with `[n/total]` so you can track the queue.

> 💡 You can also run `npm start` instead of `node index.js`.

### If a file already exists

When the target file already exists, the script asks what to do:

```
[r]eplace / [s]kip / [ra] replace all / [sa] skip all
```

Choose `ra` / `sa` to apply your answer to every remaining file in a batch without being asked again.

---

## 🧙‍♂️ How It Works

- **`index.js`** — the CLI: parses arguments, reads `links.txt`, normalizes ids into player URLs, and runs single or batch downloads.
- **`downloadVimeo.js`** — the engine:
  - `extractVimeoPlayerConfig` uses **axios** to fetch the player page and **cheerio** to parse out `window.playerConfig`, giving us the video title, duration, and HLS/DASH stream URLs.
  - `downloadHLSStream` spawns **FFmpeg** to pull the HLS stream and remux it into an `.mp4`, with a live **cli-progress** bar.
  - `downloadVimeoPrivateVideo` ties it together: it retries on transient security errors, auto-names the output from the title, and handles the overwrite prompt.

---

## 🛠️ Troubleshooting

- **FFmpeg Not Found?** Make sure FFmpeg is installed and added to your system's PATH (`ffmpeg -version`).
- **Video Not Downloading?** Check the URL/id and ensure the video is accessible. The script retries automatically on Vimeo security errors.
- **Permission Issues?** Run the terminal as an administrator (Windows) or use `sudo` on Linux/MacOS.

---

## 👥 Credits

- **Original author:** Sam Shubham — wrote the original downloader.
- **Modifications by:** Raz Erlich — forked the project and added CLI arguments, batch downloading (`links.txt` / multiple args), title-based auto-naming, and the overwrite prompt.

---

## 📜 License

This project is for educational purposes and intended for personal use only. Make sure you have permission to download the content. Always respect copyrights! ⚖️

---

## 🎉 Happy Downloading! 🎬💻

Feel free to modify the script to suit your needs and add more cool features. This tool is your first step into video downloading wizardry! ✨
