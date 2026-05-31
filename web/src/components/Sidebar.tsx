import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, Library, Settings, Download, LogIn, UserPlus, List } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Musiq<span style={{ color: 'var(--neon-purple)' }}>Sphere</span>
        </h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Menu</p>
        
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: location.pathname === '/' ? 'var(--text-primary)' : 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.3s' }}>
          <Home size={20} />
          Discover
        </Link>
        <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: location.pathname === '/search' ? 'var(--text-primary)' : 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.3s' }}>
          <Compass size={20} />
          Explore
        </Link>

        {user ? (
          <>
            <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2rem', marginBottom: '0.5rem' }}>Library</p>
            
            <Link to="/favorites" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: location.pathname === '/favorites' ? 'var(--text-primary)' : 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.3s' }}>
              <Heart size={20} fill={location.pathname === '/favorites' ? 'var(--neon-pink)' : 'none'} color={location.pathname === '/favorites' ? 'var(--neon-pink)' : 'currentColor'} />
              Favorites
            </Link>
            <Link to="/playlists" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: location.pathname === '/playlists' ? 'var(--text-primary)' : 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.3s' }}>
              <Library size={20} color={location.pathname === '/playlists' ? 'var(--neon-blue)' : 'currentColor'} />
              Playlists
            </Link>
            <Link to="/downloads" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: location.pathname === '/downloads' ? 'var(--text-primary)' : 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.3s' }}>
              <Download size={20} color={location.pathname === '/downloads' ? 'var(--neon-blue)' : 'currentColor'} />
              Downloads
            </Link>
            <Link to="/admin/upload" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: location.pathname === '/admin/upload' ? 'var(--neon-pink)' : 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.3s', marginTop: '1rem' }}>
              <Settings size={20} />
              Library Management
            </Link>
            <Link to="/admin/songs" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: location.pathname === '/admin/songs' ? 'var(--neon-pink)' : 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.3s' }}>
              <List size={20} />
              Manage Uploaded Songs
            </Link>
          </>
        ) : (
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Account</p>
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--neon-purple)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.3s' }}>
              <LogIn size={20} />
              Sign In
            </Link>
            <Link to="/register" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--neon-blue)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.3s' }}>
              <UserPlus size={20} />
              Create Account
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
