import os
import subprocess
import sys

IMPORT_DIR = os.path.dirname(os.path.abspath(__file__))
LINKS_FILE = os.path.join(IMPORT_DIR, 'links.txt')
PLAYLIST_DIR = os.path.join(IMPORT_DIR, 'playlist')
BIN_DIR = os.path.join(IMPORT_DIR, 'bin')
YTDLP_PATH = os.path.join(BIN_DIR, 'yt-dlp')

def get_urls():
    if not os.path.exists(LINKS_FILE):
        print(f"Links file not found at {LINKS_FILE}")
        return []
    
    urls = []
    with open(LINKS_FILE, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                urls.append(line)
    return urls

def download_song(url):
    print("\n" + "-"*44)
    print(f"Processing: {url}")
    
    # Arguments identical to the node script:
    # -f ba[ext=m4a]/ba -o playlist/%(title)s.%(ext)s
    output_template = os.path.join(PLAYLIST_DIR, '%(title)s.%(ext)s')
    cmd = [
        sys.executable,
        YTDLP_PATH,
        '--no-check-certificate',
        '-f', 'ba[ext=m4a]/ba',
        '-o', output_template,
        url
    ]
    
    try:
        # Run and stream stdout/stderr to the console
        result = subprocess.run(cmd, check=True)
        if result.returncode == 0:
            print("Successfully downloaded.")
            return True
    except subprocess.CalledProcessError as e:
        print(f"Download failed with exit code: {e.returncode}")
        return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False

def main():
    if not os.path.exists(PLAYLIST_DIR):
        os.makedirs(PLAYLIST_DIR, exist_ok=True)
        
    urls = get_urls()
    if not urls:
        print("No URLs found in links.txt. Add some links and run the script again.")
        return
        
    print(f"Found {len(urls)} URLs to download...")
    success_count = 0
    for url in urls:
        if download_song(url):
            success_count += 1
            
    print(f"\nAll downloads complete! {success_count}/{len(urls)} songs downloaded.")
    print(f"Files saved in: {PLAYLIST_DIR}")

if __name__ == '__main__':
    main()
