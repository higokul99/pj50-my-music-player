import React, { useEffect, useState } from 'react';
import { Download, Music, Play, Heart, ListPlus, Trash2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { DownloadService } from '../services/DownloadService';

const Downloads: React.FC = () => {
  const [downloadedSongs, setDownloadedSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { playSong, currentSong, isPlaying, toggleFavorite, showAddToPlaylist } = usePlayer();

  const fetchDownloadedSongs = async () => {
    setLoading(true);
    const songs = await DownloadService.getAllDownloadedSongs();
    // Sort alphabetically by title
    songs.sort((a, b) => a.title.localeCompare(b.title));
    setDownloadedSongs(songs);
    setLoading(false);
  };

  useEffect(() => {
    fetchDownloadedSongs();
  }, []);

  const handleRemoveDownload = async (e: React.MouseEvent, songId: number) => {
    e.stopPropagation();
    const success = await DownloadService.removeDownload(songId);
    if (success) {
      setDownloadedSongs(prev => prev.filter(s => s.id !== songId));
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, songId: number) => {
    e.stopPropagation();
    await toggleFavorite(songId);
    // Locally update the favorite status
    setDownloadedSongs(prev => prev.map(s => 
      s.id === songId ? { ...s, is_favorite: !s.is_favorite } : s
    ));
  };

  return (
    <div style={{ animation: 'fadeIn 1s ease' }}>
      <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Offline Library
      </p>

      <div className="dashboard-hero" style={{ background: 'linear-gradient(135deg, rgba(0, 243, 255, 0.1) 0%, rgba(157, 0, 255, 0.05) 100%)' }}>
        <div className="hero-welcome">
          <h1>My <span style={{ color: 'var(--neon-blue)' }}>Downloads</span></h1>
          <p>Listen to your favorite tracks anytime, anywhere, even without internet.</p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <Download size={20} className="stat-icon blue" />
              <div>
                <span className="stat-value">{downloadedSongs.length}</span>
                <span className="stat-label">Offline Tracks</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="library-section">
        <div className="section-header">
          <h2 className="section-title" style={{ borderColor: 'var(--neon-blue)' }}>
            Downloaded Songs
          </h2>
        </div>

        <div className="songs-list-container">
          {downloadedSongs.length > 0 ? (
            downloadedSongs.map((song, index) => (
              <div 
                key={song.id} 
                className={`song-list-item glass-card ${currentSong?.id === song.id ? 'active' : ''}`}
                onClick={() => playSong(song, downloadedSongs)}
              >
                <div className="song-prefix">
                  {currentSong?.id === song.id && isPlaying ? (
                    <div className="mini-visualizer-bars">
                      <span></span><span></span><span></span>
                    </div>
                  ) : (
                    <span className="index-number">{index + 1}</span>
                  )}
                </div>

                <div className="song-artwork-mini">
                  {song.cover_image ? (
                    <img src={`http://localhost:8000${song.cover_image}`} alt="" />
                  ) : (
                    <Music size={20} opacity={0.3} />
                  )}
                </div>

                <div className="song-details-mini">
                  <h3 className="song-title-mini">{song.title}</h3>
                  <p className="song-artist-mini">{song.artist?.name || 'Unknown Artist'}</p>
                </div>

                <div className="song-actions-mini">
                  <button
                    onClick={(e) => handleRemoveDownload(e, song.id)}
                    className="action-icon-btn"
                    title="Remove from downloads"
                  >
                    <Trash2 size={20} color="var(--text-secondary)" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); showAddToPlaylist(song.id); }}
                    className="action-icon-btn"
                  >
                    <ListPlus size={20} />
                  </button>
                  <button
                    onClick={(e) => handleToggleFavorite(e, song.id)}
                    className={`action-icon-btn ${song.is_favorite ? 'favorited' : ''}`}
                  >
                    <Heart size={20} fill={song.is_favorite ? 'var(--neon-pink)' : 'none'} />
                  </button>
                </div>
              </div>
            ))
          ) : !loading && (
            <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
              <Download size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
              <p>No offline songs yet. Click the download icon on any song to save it here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Downloads;
