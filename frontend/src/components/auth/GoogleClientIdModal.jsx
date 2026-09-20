import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiKey, FiExternalLink, FiCheckCircle } from 'react-icons/fi';
import { GoogleLogoIcon } from './GoogleLoginButton';

export default function GoogleClientIdModal({ isOpen, onClose, onSave }) {
  const [clientIdInput, setClientIdInput] = useState(
    localStorage.getItem('oceanfusion_google_client_id') || ''
  );
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanId = clientIdInput.trim();
    if (!cleanId) {
      setError('Please paste your Google OAuth Client ID.');
      return;
    }
    if (!cleanId.includes('.apps.googleusercontent.com') && cleanId.length < 20) {
      setError('Google Client IDs usually end with .apps.googleusercontent.com');
      return;
    }

    localStorage.setItem('oceanfusion_google_client_id', cleanId);
    onSave(cleanId);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative"
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-xs">
                <GoogleLogoIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Connect Real Google Account
                </h3>
                <p className="text-xs text-slate-500">
                  Enter your Google Cloud OAuth 2.0 Web Client ID
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800 space-y-1.5">
              <div className="font-semibold flex items-center gap-1.5">
                <FiCheckCircle className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>To show your real Google account:</span>
              </div>
              <p className="text-sky-700 leading-relaxed">
                Google requires an OAuth Client ID from Google Cloud Console so it can open the real Google authentication popup with your personal Google account.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Google OAuth Client ID
              </label>
              <div className="relative">
                <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={clientIdInput}
                  onChange={(e) => {
                    setClientIdInput(e.target.value);
                    setError('');
                  }}
                  placeholder="xxxx-xxxx.apps.googleusercontent.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-ocean-primary focus:ring-2 focus:ring-ocean-primary/20 text-xs font-mono"
                />
              </div>
            </div>

            {/* Quick Guide */}
            <div className="pt-2 text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-600">Don't have a Client ID yet?</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-500 text-[11px] leading-relaxed">
                <li>
                  Open{' '}
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    className="text-ocean-primary hover:underline font-medium inline-flex items-center gap-0.5"
                  >
                    Google Cloud Console <FiExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Create an <strong>OAuth 2.0 Web Client</strong></li>
                <li>Add Authorized JavaScript origin: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">http://localhost:3000</code></li>
                <li>Paste the generated Client ID above.</li>
              </ol>
            </div>

            {/* Actions */}
            <div className="pt-3 flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 text-xs font-semibold text-white bg-ocean-primary hover:bg-ocean-secondary rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <FiKey className="w-3.5 h-3.5" />
                Save & Sign In With Google
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
