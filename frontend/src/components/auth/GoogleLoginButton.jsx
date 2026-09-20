import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import GoogleClientIdModal from './GoogleClientIdModal';

// Official Google 'G' Icon
export const GoogleLogoIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export default function GoogleLoginButton({
  label = 'Sign in with Google',
  onSuccess,
  onError,
  disabled = false,
  className = ''
}) {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tokenClientRef = useRef(null);

  const getEffectiveClientId = () => {
    const envId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (envId && !envId.includes('your-google-client-id') && envId.trim() !== '') {
      return envId.trim();
    }
    const localId = localStorage.getItem('oceanfusion_google_client_id');
    if (localId && localId.trim() !== '') {
      return localId.trim();
    }
    return null;
  };

  const triggerRealGooglePopup = (clientId) => {
    if (!window.google?.accounts?.oauth2) {
      onError?.('Google Identity Services library is still loading. Please try again in a moment.');
      return;
    }

    setIsLoading(true);

    try {
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setIsLoading(false);
            onError?.(tokenResponse.error_description || 'Google sign-in was cancelled or failed.');
            return;
          }

          try {
            // Fetch real user info from Google
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`
              }
            });

            if (!userInfoRes.ok) {
              throw new Error('Failed to retrieve user profile from Google');
            }

            const profile = await userInfoRes.json();
            // profile: { sub, name, email, picture, ... }
            onSuccess?.({
              name: profile.name,
              email: profile.email,
              avatar: profile.picture,
              id: profile.sub
            });
          } catch (fetchErr) {
            onError?.(fetchErr.message || 'Failed to fetch Google profile information.');
          } finally {
            setIsLoading(false);
          }
        },
        error_callback: (nonOAuthError) => {
          setIsLoading(false);
          onError?.(nonOAuthError?.message || 'Google OAuth authentication failed.');
        }
      });

      // Launch official Google OAuth account selector popup!
      tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      setIsLoading(false);
      onError?.(err.message || 'Failed to launch Google sign-in.');
    }
  };

  const handleClick = () => {
    if (disabled || isLoading) return;

    const clientId = getEffectiveClientId();
    if (clientId) {
      triggerRealGooglePopup(clientId);
    } else {
      // Need Google OAuth Client ID to connect real accounts
      setIsConfigModalOpen(true);
    }
  };

  const handleSaveClientId = (savedId) => {
    setIsConfigModalOpen(false);
    triggerRealGooglePopup(savedId);
  };

  return (
    <>
      <motion.button
        type="button"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 font-medium rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-ocean-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          <GoogleLogoIcon className="w-5 h-5 flex-shrink-0" />
        )}
        <span className="text-sm font-semibold">
          {isLoading ? 'Connecting to Google...' : label}
        </span>
      </motion.button>

      {/* Real Google Client ID Configuration Modal (only shown if not yet configured) */}
      <GoogleClientIdModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={handleSaveClientId}
      />
    </>
  );
}
