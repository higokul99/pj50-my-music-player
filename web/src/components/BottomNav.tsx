import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, Library, Settings } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();

  const navStyle = (path: string): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    textDecoration: 'none',
    color: location.pathname === path ? 'var(--neon-purple)' : 'var(--text-secondary)',
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    transition: 'color 0.3s',
    padding: '0 1rem',
  });

  return (
    <nav className="bottom-nav">
      <Link to="/" style={navStyle('/')}>
        <Home size={20} />
        Discover
      </Link>
      <Link to="/search" style={navStyle('/search')}>
        <Compass size={20} />
        Explore
      </Link>
      <Link to="#" style={navStyle('/favorites')}>
        <Heart size={20} />
        Favorites
      </Link>
      <Link to="#" style={navStyle('/playlists')}>
        <Library size={20} />
        Library
      </Link>
      <Link to="/admin/upload" style={navStyle('/admin/upload')}>
        <Settings size={20} />
        Manage
      </Link>
    </nav>
  );
};

export default BottomNav;
