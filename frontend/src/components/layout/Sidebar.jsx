import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiMap,
  FiCpu,
  FiBarChart2,
  FiAlertTriangle,
  FiActivity,
  FiX,
  FiSettings,
  FiLogOut,
  FiUser
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const defaultFallback = user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}&backgroundColor=0284c7`;

  const [avatar, setAvatar] = React.useState(() => {
    return localStorage.getItem(`oceanfusion_avatar_${user?.id}`) || user?.avatar || defaultFallback;
  });

  React.useEffect(() => {
    const updated = localStorage.getItem(`oceanfusion_avatar_${user?.id}`) || user?.avatar;
    if (updated) setAvatar(updated);

    const handleStorage = () => {
      const stored = localStorage.getItem(`oceanfusion_avatar_${user?.id}`) || user?.avatar;
      if (stored) setAvatar(stored);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user?.id, user?.avatar]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: t('dashboard'), icon: FiGrid },
    { path: '/map', label: t('oceanMap'), icon: FiMap },
    { path: '/analytics', label: t('analytics'), icon: FiBarChart2 },
    { path: '/alerts', label: t('alerts'), icon: FiAlertTriangle },
  ];

  const userAvatar = avatar || user?.avatar || defaultFallback;

  return (
    <aside className="w-64 bg-ocean-sidebar flex flex-col h-full text-white flex-shrink-0 shadow-sidebar-shadow">
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ocean-secondary flex items-center justify-center text-white shadow-md font-bold flex-shrink-0">
            <FiActivity className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div className="min-w-0">
            <h1 className="font-heading font-extrabold text-base tracking-tight text-white leading-tight truncate">
              OceanFusion<span className="text-ocean-accent">.AI</span>
            </h1>
            <p className="text-[10px] text-sky-200 uppercase tracking-widest font-semibold mt-0.5 truncate">
              Ocean State Estimation
            </p>
          </div>
        </div>
        
        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-sky-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <span className="text-[10px] uppercase font-bold tracking-wider text-sky-300 px-3 block mb-2">
          Navigation Menu
        </span>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-ocean-primary to-ocean-secondary text-white font-bold shadow-md shadow-ocean-primary/35 border border-sky-300/30'
                    : 'text-sky-100/90 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* Profile Link */}
        <NavLink
          to="/profile"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-ocean-primary to-ocean-secondary text-white font-bold shadow-md shadow-ocean-primary/35 border border-sky-300/30'
                : 'text-sky-100/90 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          <FiUser className="w-5 h-5 flex-shrink-0" />
          <span>{t('profile')}</span>
        </NavLink>

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <>
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-300 px-3 block mt-6 mb-2">
              System Admin
            </span>
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold shadow-md shadow-rose-600/35 border border-rose-400/30'
                    : 'text-rose-200/90 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <FiSettings className="w-5 h-5 flex-shrink-0" />
              <span>{t('adminPanel')}</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* User Profile & Status */}
      <div className="p-4 border-t border-white/10">
        <div
          onClick={() => {
            navigate('/profile');
            if (onClose) onClose();
          }}
          className="flex items-center justify-between mb-3 px-2 cursor-pointer group hover:bg-white/5 p-2 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={avatar}
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover border border-white/20 group-hover:border-white transition-colors"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate group-hover:text-ocean-accent transition-colors">{user?.name}</p>
              <p className="text-[10px] text-sky-200 uppercase tracking-widest truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
            className="p-2 rounded-lg text-rose-300 hover:bg-rose-500/20 transition-colors ml-1"
            title={t('signOut')}
          >
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
        
        <div className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/10 text-xs text-sky-100 space-y-1 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-ocean-success animate-ping flex-shrink-0" />
            <span className="font-semibold text-white">{t('systemOperational')}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
