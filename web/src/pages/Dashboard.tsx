import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Play, Music, Heart, ListPlus, Library, Loader2, Download, CheckCircle, User, Shuffle, ArrowRightCircle, PlusSquare } from 'lucide-react';
import api from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const [songs, setSongs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Total statistics state
  const [totalSongs, setTotalSongs] = useState(0);
  const [totalArtists, setTotalArtists] = useState(0);
  const [totalAlbums, setTotalAlbums] = useState(0);

  const { playSong, playShuffled, currentSong, isPlaying, toggleFavorite, showAddToPlaylist, downloadSong, isDownloaded, isDownloading, playSongNext, addSongToQueue } = usePlayer();
  const { user } = useAuth();

  const handleShufflePlay = () => {
    if (songs.length === 0) return;
    playShuffled(songs);
  };
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastSongElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchStats = async () => {
    try {
      const [artistsRes, albumsRes] = await Promise.all([
        api.get('/artists'),
        api.get('/albums')
      ]);
      setTotalArtists(artistsRes.data.data?.length || 0);
      setTotalAlbums(albumsRes.data.data?.length || 0);
    } catch (e) {
      console.error('Failed to fetch stats', e);
    }
  };

  const fetchSongs = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/songs?page=${pageNum}`);
      
      // Safety check for response structure
      const responseData = response.data.data;
      if (!responseData || !responseData.data) {
        console.error('Unexpected response structure:', response.data);
        setHasMore(false);
        return;
      }

      const newData = responseData.data;
      const meta = responseData.meta;
      
      setSongs(prevSongs => {
        // If it's page 1, we might want to replace the whole list
        if (pageNum === 1) {
          return newData;
        }
        // Avoid duplicates
        const combined = [...prevSongs, ...newData];
        return Array.from(new Map(combined.map(item => [item.id, item])).values());
      });
      
      if (pageNum === 1) {
        setTotalSongs(meta?.total || newData.length);
      }
      setHasMore(meta.current_page < meta.last_page);
    } catch (error) {
      console.error('Failed to fetch songs', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchSongs(page);
  }, [page]);

  const handleToggleFavorite = async (e: React.MouseEvent, songId: number) => {
    e.stopPropagation();
    await toggleFavorite(songId);
    // Refresh only the updated song in the list to avoid full reload
    setSongs(prevSongs => prevSongs.map(song => 
      song.id === songId ? { ...song, is_favorite: !song.is_favorite } : song
    ));
  };

  const firstName = user?.name.split(' ')[0] || 'User';

  return (
    <div style={{ animation: 'fadeIn 1s ease' }}>
      <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Dashboard
      </p>

      {/* Better View Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-welcome">
          <h1>{firstName}'s <span style={{ color: 'var(--neon-purple)' }}>Songs</span></h1>
          <p>Your personal collection of music and memories.</p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-icon-wrapper purple">
                <Music size={24} />
              </div>
              <div>
                <span className="stat-value">{totalSongs}</span>
                <span className="stat-label">Tracks</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon-wrapper blue">
                <User size={24} />
              </div>
              <div>
                <span className="stat-value">{totalArtists}</span>
                <span className="stat-label">Artists</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon-wrapper pink">
                <Library size={24} />
              </div>
              <div>
                <span className="stat-value">{totalAlbums}</span>
                <span className="stat-label">Albums</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
            <button 
              className="btn-glass-3d purple"
              onClick={() => songs.length > 0 && playSong(songs[0], songs)}
              disabled={songs.length === 0}
              style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}
            >
              <Play fill="currentColor" size={18} />
              Play All
            </button>
            <button 
              className="btn-glass-3d blue"
              onClick={handleShufflePlay}
              disabled={songs.length === 0}
              style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}
            >
              <Shuffle size={18} />
              Shuffle
            </button>
          </div>
        </div>
      </div>

      {/* Grid of All Songs */}
      <div className="library-section">
        <div className="section-header">
          <h2 className="section-title">
            Your Library
          </h2>
        </div>
        
        <div className="songs-list-container">
          {songs.length > 0 ? (
            songs.map((song, index) => (
              <div 
                key={song.id} 
                ref={index === songs.length - 1 ? lastSongElementRef : null}
                className={`song-list-item glass-card ${currentSong?.id === song.id ? 'active' : ''}`}
                onClick={() => playSong(song, songs)}
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
                  onClick={(e) => { e.stopPropagation(); downloadSong(song); }}
                  className={`action-icon-btn ${isDownloaded(song.id) ? 'downloaded' : ''} ${isDownloading(song.id) ? 'downloading' : ''}`}
                  title={isDownloaded(song.id) ? "Downloaded" : isDownloading(song.id) ? "Downloading..." : "Download"}
                  disabled={isDownloaded(song.id) || isDownloading(song.id)}
                >
                    {isDownloaded(song.id) ? (
                      <CheckCircle size={20} color="var(--neon-blue)" />
                    ) : isDownloading(song.id) ? (
                      <Loader2 className="animate-spin" size={20} color="var(--neon-purple)" />
                    ) : (
                      <Download size={20} />
                    )}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); addSongToQueue(song); }}
                    className="action-icon-btn"
                    title="Add to Queue"
                  >
                    <PlusSquare size={20} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); playSongNext(song); }}
                    className="action-icon-btn"
                    title="Play Next"
                  >
                    <ArrowRightCircle size={20} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); showAddToPlaylist(song.id); }}
                    className="action-icon-btn"
                    title="Add to Playlist"
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
              <Music size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
              <p>No songs in your library yet. Start uploading or explore trending music!</p>
            </div>
          )}
        </div>
        
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Loader2 className="animate-spin" size={32} color="var(--neon-purple)" />
          </div>
        )}
      </div>

      <style>{`
        .library-section {
          margin-top: 4rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.5rem;
          border-left: 4px solid var(--neon-blue);
          padding-left: 1rem;
        }

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

        .full-width-visualizer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          gap: 2px;
          height: 30px;
          padding: 0 5px;
          background: linear-gradient(to top, rgba(0, 243, 255, 0.2), transparent);
          pointer-events: none;
        }
        .full-width-visualizer span {
          flex: 1;
          width: 3px;
          background: var(--neon-blue);
          animation: bounce 0.8s ease-in-out infinite alternate;
          box-shadow: 0 0 5px var(--neon-blue);
        }
        .hero-visualizer {
          height: 50px;
          background: linear-gradient(to top, rgba(157, 0, 255, 0.2), transparent);
          border-radius: 0 0 12px 12px;
        }
        .hero-visualizer span {
          background: var(--neon-purple);
          box-shadow: 0 0 8px var(--neon-purple);
        }
        @media (max-width: 768px) {
          .library-section {
            margin-top: 2rem;
          }
          .section-header {
            margin-bottom: 1rem;
          }
          .section-title {
            font-size: 1.2rem;
          }
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

export default Dashboard;
