import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, LogOut, ArrowLeft, Calendar } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'var(--text-secondary)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          cursor: 'pointer',
          marginBottom: '2rem',
          fontSize: '0.9rem',
          padding: 0
        }}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid var(--neon-purple)', paddingLeft: '1rem' }}>
        User Profile
      </h2>

      <div className="profile-card glass-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-badge">
              MusiqSphere Member
            </p>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <Mail size={20} color="var(--neon-blue)" />
            <div>
              <p className="detail-label">Email Address</p>
              <p className="detail-value">{user.email}</p>
            </div>
          </div>
          
          <div className="detail-item">
            <Calendar size={20} color="var(--neon-pink)" />
            <div>
              <p className="detail-label">Member Since</p>
              <p className="detail-value">May 2026</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="btn-glass-3d pink logout-action"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>

      <style>{`
        .profile-card {
          max-width: 600px;
          padding: 3rem;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          background: var(--neon-purple);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 0 30px rgba(157, 0, 255, 0.3);
          flex-shrink: 0;
        }

        .profile-name {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .profile-badge {
          color: var(--neon-purple);
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          fontSize: 0.8rem;
        }

        .profile-details {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255,255,255,0.02);
          border-radius: 8px;
        }

        .detail-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 2px;
        }

        .detail-value {
          color: var(--text-primary);
          font-weight: 500;
        }

        .logout-action {
          width: 100%;
          justify-content: center;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .profile-card {
            padding: 2rem 1.5rem;
          }
          .profile-header {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
            margin-bottom: 2rem;
          }
          .profile-avatar {
            width: 80px;
            height: 80px;
          }
          .profile-name {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
