const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const https = require('https');

const IMPORT_DIR = __dirname;
const LINKS_FILE = path.join(IMPORT_DIR, 'links.txt');
const PLAYLIST_DIR = path.join(IMPORT_DIR, 'playlist');
const BIN_DIR = path.join(IMPORT_DIR, 'bin');
const YTDLP_PATH = path.join(BIN_DIR, 'yt-dlp');

// Create directories if they don't exist
if (!fs.existsSync(PLAYLIST_DIR)) fs.mkdirSync(PLAYLIST_DIR, { recursive: true });
if (!fs.existsSync(BIN_DIR)) fs.mkdirSync(BIN_DIR, { recursive: true });

// Create links.txt if it doesn't exist
if (!fs.existsSync(LINKS_FILE)) {
  fs.writeFileSync(LINKS_FILE, `# Paste your YouTube video or playlist URLs here (one per line)
# Lines starting with # are ignored.
https://youtube.com/playlist?list=PL-Vr7Z_y18M7k9nuVyw3qsYU93XMCby1r&si=R-SRas9JBiOp7TzJ
`, 'utf8');
  console.log(`Created ${LINKS_FILE}. Please paste your YouTube URLs inside this file.`);
}

// Download yt-dlp binary if it doesn't exist
async function ensureYtdlp() {
  if (fs.existsSync(YTDLP_PATH)) {
    const stats = fs.statSync(YTDLP_PATH);
    if (stats.size > 0) {
      return YTDLP_PATH;
    }
    fs.unlinkSync(YTDLP_PATH);
  }

  console.log('Downloading standalone yt-dlp binary for macOS...');
  const url = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';

  try {
    execSync(`curl -L -o "${YTDLP_PATH}" "${url}"`);
    fs.chmodSync(YTDLP_PATH, '755'); // Make executable
    console.log('yt-dlp downloaded and configured successfully.');
    return YTDLP_PATH;
  } catch (err) {
    console.error('Failed to download yt-dlp via curl', err);
    throw err;
  }
}

function getUrls() {
  const content = fs.readFileSync(LINKS_FILE, 'utf8');
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));
}

async function downloadSong(url, ytdlpPath) {
  console.log(`\n--------------------------------------------`);
  console.log(`Processing: ${url}`);

  return new Promise((resolve) => {
    // Format selector: bestaudio of extension m4a (aac) to avoid transcoding dependencies (ffmpeg)
    const args = [
      '--no-check-certificate', // Bypass macOS Python SSL verification issues
      '-f', 'ba[ext=m4a]/ba', // Get best audio, prioritizing native m4a
      '-o', path.join(PLAYLIST_DIR, '%(title)s.%(ext)s'),
      url
    ];

    const child = spawn('python3', [ytdlpPath, ...args]);

    child.stdout.on('data', (data) => {
      process.stdout.write(data.toString());
    });

    child.stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`Successfully downloaded.`);
        resolve(true);
      } else {
        console.error(`Download failed with exit code: ${code}`);
        resolve(false);
      }
    });
  });
}

async function run() {
  try {
    const ytdlpPath = await ensureYtdlp();
    const urls = getUrls();

    if (urls.length === 0) {
      console.log('No URLs found in links.txt. Add some links and run the script again.');
      return;
    }

    console.log(`Found ${urls.length} URLs to download...`);
    for (const url of urls) {
      await downloadSong(url, ytdlpPath);
    }
    console.log('\nAll downloads complete! Files saved in: import/playlist/');
  } catch (error) {
    console.error('An error occurred during execution:', error);
  }
}

run();
