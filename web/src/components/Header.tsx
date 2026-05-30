import React from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const firstName = user.name.split(' ')[0];

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{firstName}'s Songs</h2>
      </div>
      <div className="topbar-right">
        <Link to="/profile" className="profile-icon-link" title="View Profile">
          <div className="avatar" style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}>
            <User size={20} />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
