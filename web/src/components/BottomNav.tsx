import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, Library, Settings, Download } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();

  const navStyle = (path: string): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    textDecoration: 'none',
    color: location.pathname === path ? 'var(--neon-purple)' : 'var(--text-secondary)',
    fontSize: '0.6rem',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    transition: 'color 0.3s',
    flex: 1,
    minWidth: 0,
    textAlign: 'center'
  });

  return (
    <nav className="bottom-nav">
      <Link to="/" style={navStyle('/')}>
        <Home size={18} />
        <span>Discover</span>
      </Link>
      <Link to="/search" style={navStyle('/search')}>
        <Compass size={18} />
        <span>Explore</span>
      </Link>
      <Link to="/favorites" style={navStyle('/favorites')}>
        <Heart size={18} fill={location.pathname === '/favorites' ? 'var(--neon-pink)' : 'none'} />
        <span>Likes</span>
      </Link>
      <Link to="/playlists" style={navStyle('/playlists')}>
        <Library size={18} />
        <span>Playlists</span>
      </Link>
      <Link to="/downloads" style={navStyle('/downloads')}>
        <Download size={18} />
        <span>Offline</span>
      </Link>
      <Link to="/admin/upload" style={navStyle('/admin/upload')}>
        <Settings size={18} />
        <span>Manage</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
