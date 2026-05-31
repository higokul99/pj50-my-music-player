import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search as SearchIcon, Music, Heart, ListPlus, Loader2, Download, CheckCircle, PlusCircle, Globe, User } from 'lucide-react';
import api from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'my' | 'global'>('global');
  const { playSong, currentSong, isPlaying, toggleFavorite, showAddToPlaylist, downloadSong, isDownloaded } = usePlayer();
  const { user: currentUser } = useAuth();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchSongs = async (pageNum: number) => {
    setLoading(true);
    try {
      const endpoint = mode === 'my' ? '/songs' : '/explorer';
      const response = await api.get(`${endpoint}?page=${pageNum}${query ? `&q=${query}` : ''}`);
      
      const responseData = response.data.data;
      const newData = responseData.data;
      const meta = responseData.meta;
      
      setResults(prev => {
        const combined = pageNum === 1 ? newData : [...prev, ...newData];
        return Array.from(new Map(combined.map((item: any) => [item.id, item])).values());
      });
      setHasMore(meta.current_page < meta.last_page);
    } catch (error) {
      console.error('Failed to fetch songs', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs(page);
  }, [page, mode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setResults([]);
    setPage(1);
    setHasMore(true);
    fetchSongs(1);
  };

  const handleToggleFavorite = async (e: React.MouseEvent, songId: number) => {
    e.stopPropagation();
    await toggleFavorite(songId);
    setResults(prev => prev.map(song => 
      song.id === songId ? { ...song, is_favorite: !song.is_favorite } : song
    ));
  };

  const handleAddToCollection = async (e: React.MouseEvent, songId: number) => {
    e.stopPropagation();
    try {
      await api.post(`/songs/${songId}/clone`);
      alert('Song added to your collection!');
      // Update local state to show it's now yours
      setResults(prev => prev.map(song => 
        song.id === songId ? { ...song, user_id: currentUser?.id } : song
      ));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add to collection');
    }
  };

  return (
    <div style={{ animation: 'fadeIn 1s ease' }}>
      <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Explorer
      </p>

      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
        <button 
          onClick={() => { setMode('global'); setPage(1); setResults([]); }}
          className={`btn-glass-3d ${mode === 'global' ? 'blue' : ''}`}
          style={{ flex: 1, textTransform: 'none', letterSpacing: 'normal' }}
        >
          <Globe size={18} />
          Global Music
        </button>
        <button 
          onClick={() => { setMode('my'); setPage(1); setResults([]); }}
          className={`btn-glass-3d ${mode === 'my' ? 'purple' : ''}`}
          style={{ flex: 1, textTransform: 'none', letterSpacing: 'normal' }}
        >
          <User size={18} />
          My Songs
        </button>
      </div>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '600px' }}>
          <SearchIcon style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
          <input 
            type="text" 
            placeholder={`Search ${mode === 'my' ? 'my songs' : 'global music'} by name, artist, or album...`}
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
        <button type="submit" className={`btn-glass-3d ${mode === 'my' ? 'purple' : 'blue'}`} style={{ padding: '0 32px' }}>
          {loading && page === 1 ? '...' : 'Search'}
        </button>
      </form>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          {query ? `Results for "${query}" in ${mode === 'my' ? 'My Songs' : 'Global'}` : mode === 'my' ? 'My Library' : 'Trending Worldwide'}
        </h2>
      </div>

      <div className="songs-list-container">
        {results.map((song, index) => {
          const isMine = song.user_id === currentUser?.id || (song.user_id === null && mode === 'my');
          
          return (
            <div 
              key={`${song.id}-${index}`} 
              ref={index === results.length - 1 ? lastElementRef : null}
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
                {mode === 'global' && !isMine && (
                  <button
                    onClick={(e) => handleAddToCollection(e, song.id)}
                    className="action-icon-btn"
                    title="Add to my collection"
                    style={{ color: 'var(--neon-gold)' }}
                  >
                    <PlusCircle size={20} />
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); downloadSong(song); }}
                  className={`action-icon-btn ${isDownloaded(song.id) ? 'downloaded' : ''}`}
                  title={isDownloaded(song.id) ? "Downloaded" : "Download for offline"}
                  disabled={isDownloaded(song.id)}
                >
                  {isDownloaded(song.id) ? <CheckCircle size={20} color="var(--neon-blue)" /> : <Download size={20} />}
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
          );
        })}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Loader2 className="animate-spin" size={32} color={mode === 'my' ? 'var(--neon-purple)' : 'var(--neon-blue)'} />
          </div>
        )}
        {results.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            <Music size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
            <p>No songs found. Try a different search term or switch mode.</p>
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
