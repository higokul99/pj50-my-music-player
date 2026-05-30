import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminUpload: React.FC = () => {
  const [artists, setArtists] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);

  // Forms state
  const [artistName, setArtistName] = useState('');
  
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumArtistId, setAlbumArtistId] = useState('');

  const [songTitle, setSongTitle] = useState('');
  const [songArtistId, setSongArtistId] = useState('');
  const [songAlbumId, setSongAlbumId] = useState('');
  const [songFile, setSongFile] = useState<File | null>(null);

  const fetchArtists = async () => {
    try {
      const res = await api.get('/artists');
      setArtists(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAlbums = async () => {
    try {
      const res = await api.get('/albums');
      setAlbums(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchArtists();
    fetchAlbums();
  }, []);

  const handleCreateArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/artists', { name: artistName });
      setArtistName('');
      fetchArtists();
      alert('Artist Created!');
    } catch (e) {
      console.error(e);
      alert('Error creating artist');
    }
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/albums', { title: albumTitle, artist_id: albumArtistId });
      setAlbumTitle('');
      setAlbumArtistId('');
      fetchAlbums();
      alert('Album Created!');
    } catch (e) {
      console.error(e);
      alert('Error creating album');
    }
  };

  const handleUploadSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songFile || !songArtistId) return;

    const formData = new FormData();
    formData.append('title', songTitle);
    formData.append('artist_id', songArtistId);
    if (songAlbumId) formData.append('album_id', songAlbumId);
    formData.append('song_file', songFile);

    try {
      await api.post('/songs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSongTitle('');
      setSongFile(null);
      alert('Song Uploaded Successfully!');
    } catch (e) {
      console.error(e);
      alert('Error uploading song');
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.5)', 
    border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'white', outline: 'none',
    marginBottom: '1rem'
  };

  return (
    <div style={{ animation: 'fadeIn 1s ease' }}>
      <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.9rem', marginBottom: '2rem' }}>
        System Configuration
      </p>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Library Management</h2>

      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
        
        {/* Create Artist */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--neon-purple)' }}>Add Artist</h3>
          <form onSubmit={handleCreateArtist}>
            <input 
              style={inputStyle} type="text" placeholder="Artist Name" 
              value={artistName} onChange={(e) => setArtistName(e.target.value)} required 
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Artist</button>
          </form>
        </div>

        {/* Create Album */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--neon-blue)' }}>Add Album</h3>
          <form onSubmit={handleCreateAlbum}>
            <input 
              style={inputStyle} type="text" placeholder="Album Title" 
              value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} required 
            />
            <select style={inputStyle} value={albumArtistId} onChange={(e) => setAlbumArtistId(e.target.value)} required>
              <option value="" disabled>Select Artist</option>
              {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', background: 'var(--neon-blue)' }}>Create Album</button>
          </form>
        </div>

        {/* Upload Song */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--neon-pink)' }}>Upload Audio</h3>
          <form onSubmit={handleUploadSong}>
            <input 
              style={inputStyle} type="text" placeholder="Track Title" 
              value={songTitle} onChange={(e) => setSongTitle(e.target.value)} required 
            />
            <select style={inputStyle} value={songArtistId} onChange={(e) => setSongArtistId(e.target.value)} required>
              <option value="" disabled>Select Artist</option>
              {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <select style={inputStyle} value={songAlbumId} onChange={(e) => setSongAlbumId(e.target.value)}>
              <option value="">No Album (Single)</option>
              {albums.filter(al => al.artist_id == songArtistId).map(al => <option key={al.id} value={al.id}>{al.title}</option>)}
            </select>
            
            <input 
              type="file" accept="audio/*"
              onChange={(e) => setSongFile(e.target.files ? e.target.files[0] : null)}
              style={inputStyle} required
            />
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', background: 'var(--neon-pink)' }}>Upload Track</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;
