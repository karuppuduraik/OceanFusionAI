import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';
import { FiCheckCircle, FiAlertTriangle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

export default function ToastContainer() {
  const { toasts, removeToast } = useNotification();

  const iconMap = {
    success: <FiCheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
    warning: <FiAlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
    danger: <FiAlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />,
    error: <FiAlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />,
    info: <FiInfo className="w-5 h-5 text-ocean-teal flex-shrink-0" />,
  };

  const borderMap = {
    success: 'border-emerald-500/40 bg-emerald-950/85',
    warning: 'border-amber-500/40 bg-amber-950/85',
    danger: 'border-rose-500/40 bg-rose-950/85',
    error: 'border-rose-500/40 bg-rose-950/85',
    info: 'border-ocean-teal/40 bg-ocean-dark/95',
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md text-white ${
              borderMap[toast.type] || borderMap.info
            }`}
          >
            <div className="mt-0.5">{iconMap[toast.type] || iconMap.info}</div>
            <div className="flex-1 min-w-0">
              {toast.title && <h5 className="text-sm font-semibold leading-tight text-white">{toast.title}</h5>}
              {toast.message && <p className="text-xs text-slate-200 mt-0.5 leading-normal">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
