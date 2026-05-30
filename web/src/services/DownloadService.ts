const CACHE_NAME = 'musiqsphere-audio-cache';
const DB_NAME = 'musiqsphere-db';
const STORE_NAME = 'songs';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const DownloadService = {
  /**
   * Downloads a song and stores it in the Cache API and metadata in IndexedDB
   */
  async downloadSong(song: any): Promise<boolean> {
    const streamUrl = `http://localhost:8000/api/songs/${song.id}/stream`;
    
    try {
      // 1. Cache the audio file
      const cache = await caches.open(CACHE_NAME);
      const response = await fetch(streamUrl);
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      await cache.put(streamUrl, response);

      // 2. Store metadata in IndexedDB
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      await store.put(song);
      
      return true;
    } catch (error) {
      console.error('Download failed:', error);
      return false;
    }
  },

  /**
   * Gets all downloaded songs from IndexedDB
   */
  async getAllDownloadedSongs(): Promise<any[]> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get downloaded songs:', error);
      return [];
    }
  },

  /**
   * Checks if a song is already in the cache
   */
  async isDownloaded(songId: number): Promise<boolean> {
    const streamUrl = `http://localhost:8000/api/songs/${songId}/stream`;
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(streamUrl);
    return !!response;
  },

  /**
   * Gets the cached blob URL if available
   */
  async getCachedUrl(songId: number): Promise<string | null> {
    const streamUrl = `http://localhost:8000/api/songs/${songId}/stream`;
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(streamUrl);
    
    if (response) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    
    return null;
  },

  /**
   * Removes a song from the cache and IndexedDB
   */
  async removeDownload(songId: number): Promise<boolean> {
    const streamUrl = `http://localhost:8000/api/songs/${songId}/stream`;
    
    try {
      // 1. Remove audio from cache
      const cache = await caches.open(CACHE_NAME);
      const cacheDeleted = await cache.delete(streamUrl);

      // 2. Remove metadata from IndexedDB
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      await store.delete(songId);
      
      return cacheDeleted;
    } catch (error) {
      console.error('Failed to remove download:', error);
      return false;
    }
  }
};
