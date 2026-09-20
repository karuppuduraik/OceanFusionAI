import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { FiUser, FiSettings, FiLogOut, FiCheck, FiShield } from 'react-icons/fi';

export default function ProfileDropdown({ isOpen, onClose }) {
  const dropdownRef = useRef(null);
  const { user, logout, accounts, login } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleRoleSwitch = async (account) => {
    try {
      await login(account.email, account.password);
      addToast({
        title: 'Account Switched',
        message: `Active user changed to ${account.name}`,
        type: 'info',
        duration: 2500
      });
      onClose();
    } catch (e) {
      addToast({
        title: 'Switch Failed',
        message: 'Unable to switch to account.',
        type: 'error'
      });
    }
  };

  const handleLogout = () => {
    logout();
    addToast({
      title: 'Logged Out',
      message: 'You have been safely signed out.',
      type: 'info',
      duration: 2000
    });
    onClose();
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel-deep shadow-2xl border border-ocean-sky/40 dark:border-ocean-borderDark z-[9999] overflow-hidden"
        >
          {/* User Card */}
          <div className="p-4 border-b border-ocean-sky/20 dark:border-ocean-borderDark bg-ocean-sky/10 dark:bg-ocean-deep/50">
            <div className="flex items-center gap-3">
              <img
                src={localStorage.getItem(`oceanfusion_avatar_${user?.id}`) || user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}&backgroundColor=0284c7`}
                alt={user?.name || 'User'}
                className="w-11 h-11 rounded-xl object-cover border-2 border-ocean-teal shadow-md"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-ocean-navy dark:text-ocean-surface truncate">
                  {user?.name || 'Guest User'}
                </h4>
                <p className="text-xs text-ocean-teal font-medium truncate">{user?.role || 'Oceanographer'}</p>
                <p className="text-[11px] text-slate-400 dark:text-ocean-sky/60 truncate">{user?.organization || 'INCOIS Research'}</p>
              </div>
            </div>
          </div>

          {/* Account Switcher */}
          {accounts && accounts.length > 1 && (
            <div className="p-3 border-b border-ocean-sky/10 dark:border-ocean-borderDark/40">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-ocean-sky/60 px-2 mb-1.5">
                Switch Registered Account
              </span>
              <div className="space-y-1">
                {accounts.map((acc) => {
                  const isCurrent = user?.email === acc.email;
                  return (
                    <button
                      key={acc.email}
                      onClick={() => handleRoleSwitch(acc)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isCurrent
                          ? 'bg-ocean-teal/20 text-ocean-teal font-bold'
                          : 'text-slate-600 dark:text-ocean-sky hover:bg-ocean-teal/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FiShield className="w-3.5 h-3.5 text-ocean-teal flex-shrink-0" />
                        <span className="truncate">{acc.name}</span>
                      </div>
                      {isCurrent && <FiCheck className="w-3.5 h-3.5 text-ocean-teal flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="p-2 space-y-0.5">
            <Link
              to="/settings"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-ocean-sky hover:bg-ocean-teal/10 hover:text-ocean-teal transition-colors"
            >
              <FiSettings className="w-4 h-4 text-ocean-teal" />
              <span>System & Profile Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-500/10 transition-colors text-left"
            >
              <FiLogOut className="w-4 h-4 text-rose-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
