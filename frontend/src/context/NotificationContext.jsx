import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('oceanfusion_sound') !== 'false';
  });

  const addToast = ({ title, message, type = 'info', duration = 4000 }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, title, message, type, timestamp: new Date() };
    
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('oceanfusion_sound', String(next));
      return next;
    });
  };

  return (
    <NotificationContext.Provider value={{
      toasts,
      unreadCount,
      soundEnabled,
      addToast,
      removeToast,
      clearAllToasts,
      markAllAsRead,
      setUnreadCount,
      toggleSound
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
