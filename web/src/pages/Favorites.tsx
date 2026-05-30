import React, { useEffect, useState } from 'react';
import { Heart, Music, Play, ListPlus } from 'lucide-react';
import api from '../services/api';
import { usePlayer } from '../context/PlayerContext';

const Favorites: React.FC = () => {
  const [favoriteSongs, setFavoriteSongs] = useState<any[]>([]);
  const { playSong, currentSong, isPlaying, toggleFavorite, showAddToPlaylist } = usePlayer();

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      setFavoriteSongs(response.data.data);
    } catch (error) {
      console.error('Failed to fetch favorites', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (e: React.MouseEvent, songId: number) => {
    e.stopPropagation();
    await toggleFavorite(songId);
    // Refresh the list after toggling
    fetchFavorites();
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Your Collection
      </p>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Heart fill="var(--neon-pink)" color="var(--neon-pink)" size={32} />
        Favorite Songs
      </h2>

      {favoriteSongs.length === 0 ? (
        <div style={{ 
          height: '40vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '12px',
          border: '1px dashed rgba(255,255,255,0.1)'
        }}>
          <Heart size={48} opacity={0.2} style={{ marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>You haven't added any favorites yet.</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Start exploring to find music you love!</p>
        </div>
      ) : (
        <div className="songs-list-container">
          {favoriteSongs.map((song, index) => (
            <div 
              key={song.id} 
              className={`song-list-item glass-card ${currentSong?.id === song.id ? 'active' : ''}`}
              onClick={() => playSong(song, favoriteSongs)}
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
                  onClick={(e) => { e.stopPropagation(); showAddToPlaylist(song.id); }}
                  className="action-icon-btn"
                >
                  <ListPlus size={20} />
                </button>
                <button
                  onClick={(e) => handleToggleFavorite(e, song.id)}
                  className="action-icon-btn favorited"
                >
                  <Heart size={20} fill="var(--neon-pink)" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .songs-list-container {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          padding-bottom: 2rem;
        }

        .song-list-item {
          display: flex;
          align-items: center;
          padding: 0.6rem 1rem !important;
          gap: 1.2rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
        }

        .song-list-item:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(5px);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .song-list-item.active {
          background: rgba(0, 243, 255, 0.05);
          border-color: var(--neon-blue);
          box-shadow: 0 0 15px rgba(0, 243, 255, 0.1);
        }

        .song-prefix {
          width: 24px;
          display: flex;
          justify-content: center;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
        }

        .song-artwork-mini {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .song-artwork-mini img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .song-details-mini {
          flex: 1;
          min-width: 0;
        }

        .song-title-mini {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .song-artist-mini {
          font-size: 0.8rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .song-actions-mini {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .action-icon-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-icon-btn:hover {
          color: white;
          background: rgba(255,255,255,0.1);
          transform: scale(1.1);
        }

        .action-icon-btn.favorited {
          color: var(--neon-pink);
          filter: drop-shadow(0 0 5px var(--neon-pink));
        }

        .mini-visualizer-bars {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 16px;
        }

        .mini-visualizer-bars span {
          width: 3px;
          background: var(--neon-blue);
          animation: bounce 0.6s ease infinite alternate;
          box-shadow: 0 0 5px var(--neon-blue);
        }

        .mini-visualizer-bars span:nth-child(2) { animation-delay: 0.15s; }
        .mini-visualizer-bars span:nth-child(3) { animation-delay: 0.3s; }

        @keyframes bounce {
          from { height: 4px; }
          to { height: 100%; }
        }

        @media (max-width: 480px) {
          .song-list-item {
            gap: 1rem;
            padding: 0.6rem 0.8rem !important;
          }
          .song-prefix { display: none; }
          .song-artwork-mini { width: 44px; height: 44px; }
          .song-title-mini { font-size: 0.95rem; }
          .song-actions-mini { gap: 0.5rem; }
        }
      `}</style>
    </div>
  );
};

export default Favorites;
