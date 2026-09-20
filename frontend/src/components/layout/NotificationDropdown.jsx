import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';
import { mockAlerts } from '../../data/mockAlerts';
import { FiAlertTriangle, FiCheck, FiArrowRight, FiBell } from 'react-icons/fi';
import Badge from '../common/Badge';

export default function NotificationDropdown({ isOpen, onClose }) {
  const dropdownRef = useRef(null);
  const { unreadCount, markAllAsRead } = useNotification();

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

  const recentAlerts = mockAlerts.slice(0, 4);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel-deep shadow-2xl border border-ocean-sky/40 dark:border-ocean-borderDark z-[9999] overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-ocean-sky/20 dark:border-ocean-borderDark bg-ocean-sky/10 dark:bg-ocean-deep/40">
            <div className="flex items-center gap-2">
              <FiBell className="w-4 h-4 text-ocean-teal" />
              <h4 className="text-sm font-bold text-ocean-navy dark:text-ocean-surface">Live Alert Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-ocean-teal hover:underline flex items-center gap-1"
              >
                <FiCheck className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-ocean-sky/10 dark:divide-ocean-borderDark/40">
            {recentAlerts.map((alert) => (
              <Link
                key={alert.id}
                to="/alerts"
                onClick={onClose}
                className="p-3.5 block hover:bg-ocean-teal/10 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex-shrink-0">
                    <Badge
                      variant={alert.severity === 'danger' ? 'danger' : alert.severity === 'warning' ? 'warning' : 'teal'}
                      size="sm"
                      dot
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-ocean-navy dark:text-ocean-surface leading-snug line-clamp-1">
                      {alert.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-ocean-sky/70 mt-0.5 line-clamp-2">
                      {alert.description}
                    </p>
                    <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400 dark:text-ocean-sky/50">
                      <span>{alert.region}</span>
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="p-3 border-t border-ocean-sky/20 dark:border-ocean-borderDark bg-ocean-sky/5 dark:bg-ocean-deep/50 text-center">
            <Link
              to="/alerts"
              onClick={onClose}
              className="text-xs font-semibold text-ocean-teal hover:underline flex items-center justify-center gap-1.5"
            >
              <span>View all emergency early warnings</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
