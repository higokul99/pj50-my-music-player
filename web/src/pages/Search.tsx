import React, { useState } from 'react';
import { Search as SearchIcon, Play } from 'lucide-react';
import api from '../services/api';
import { usePlayer } from '../context/PlayerContext';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { playSong } = usePlayer();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
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

  return (
    <div style={{ animation: 'fadeIn 1s ease' }}>
      <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Discover
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
        <button type="submit" className="btn btn-primary" style={{ padding: '0 32px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {loading ? '...' : 'Search'}
        </button>
      </form>

      <div>
        {results.map((song) => (
          <div key={song.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 48, height: 48, background: '#1a1a1a', borderRadius: 2 }} />
              <div>
                <p style={{ fontWeight: 500 }}>{song.title}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{song.artist?.name} • {song.album?.title || 'Single'}</p>
              </div>
            </div>
            <button className="btn-play" onClick={() => playSong(song)} style={{ width: 40, height: 40 }}>
              <Play fill="currentColor" size={16} style={{ marginLeft: 3 }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
