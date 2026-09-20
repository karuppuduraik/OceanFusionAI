import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
  showClose = true,
}) {
  // Close on Esc key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full ${maxWidth} bg-white dark:bg-ocean-dark border border-ocean-sky/40 dark:border-ocean-teal/30 rounded-3xl shadow-2xl overflow-hidden z-10 my-8`}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between px-6 py-5 border-b border-ocean-sky/20 dark:border-ocean-borderDark bg-ocean-sky/10 dark:bg-ocean-deep/50">
                <div>
                  {title && <h3 className="text-xl font-bold font-heading text-ocean-navy dark:text-ocean-surface">{title}</h3>}
                  {subtitle && <p className="text-xs text-slate-500 dark:text-ocean-sky/80 mt-0.5">{subtitle}</p>}
                </div>
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:text-ocean-sky/70 dark:hover:text-white hover:bg-ocean-teal/10 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
