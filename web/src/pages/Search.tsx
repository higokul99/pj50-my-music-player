import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Play, Music, Heart, ListPlus } from 'lucide-react';
import api from '../services/api';
import { usePlayer } from '../context/PlayerContext';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { playSong, currentSong, isPlaying, toggleFavorite, showAddToPlaylist } = usePlayer();

  const fetchExplorerSongs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/explorer');
      setResults(response.data.data);
    } catch (error) {
      console.error('Failed to fetch explorer songs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplorerSongs();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) {
      fetchExplorerSongs();
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.get(`/search?q=${query}`);
      setResults(response.data.data);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, songId: number) => {
    e.stopPropagation();
    await toggleFavorite(songId);
    // Refresh to show favorite status
    if (query) {
      const response = await api.get(`/search?q=${query}`);
      setResults(response.data.data);
    } else {
      fetchExplorerSongs();
    }
  };

  return (
    <div style={{ animation: 'fadeIn 1s ease' }}>
      <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Explore
      </p>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '600px' }}>
          <SearchIcon style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
          <input 
            type="text" 
            placeholder="Search artists, albums, or songs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '16px 16px 16px 48px', 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid var(--border-subtle)', 
              borderRadius: '2px', 
              color: 'white', 
              fontSize: '1.1rem',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
          />
        </div>
        <button type="submit" className="btn-glass-3d blue" style={{ padding: '0 32px' }}>
          {loading ? '...' : 'Search'}
        </button>
      </form>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          {query ? `Search results for "${query}"` : 'Trending Now'}
        </h2>
      </div>

      <div className="songs-list-container">
        {results.map((song, index) => (
          <div 
            key={song.id} 
            className={`song-list-item glass-card ${currentSong?.id === song.id ? 'active' : ''}`}
            onClick={() => playSong(song, results)}
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
              <p className="song-artist-mini">{song.artist?.name || 'Unknown Artist'} • {song.album?.title || 'Single'}</p>
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
                className={`action-icon-btn ${song.is_favorite ? 'favorited' : ''}`}
              >
                <Heart size={20} fill={song.is_favorite ? 'var(--neon-pink)' : 'none'} />
              </button>
            </div>
          </div>
        ))}
        {results.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            <Music size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
            <p>No songs found. Try a different search term.</p>
          </div>
        )}
      </div>

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

export default Search;
