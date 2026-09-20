import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiActivity, FiMail, FiLock, FiAlertCircle, FiKey } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email.trim(), password);
      if (result && result.success) {
        navigate('/dashboard');
      } else {
        setError(result?.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      console.error('[Login] Error:', err);
      setError(err?.message || 'Unable to connect to authentication server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (googleUserData) => {
    setError('');
    setIsLoading(true);
    try {
      const result = await loginWithGoogle(googleUserData);
      if (result && result.success) {
        navigate('/dashboard');
      } else {
        setError(result?.error || 'Failed to sign in with Google');
      }
    } catch (err) {
      setError(err?.message || 'Google sign in error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen bg-ocean-bg flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ocean-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-ocean-primary/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10"
      >
        <Card hover={false} className="p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-ocean-secondary flex items-center justify-center text-white shadow-md font-bold mb-4">
              <FiActivity className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-ocean-text">OceanFusion AI</h1>
            <p className="text-sm text-slate-500 mt-1 text-center">
              Multi-Modal Deep Learning Platform for Real-Time Ocean State Estimation
            </p>
          </div>

          {/* Demo account quick fill */}
          <div className="mb-5 p-3 rounded-xl bg-ocean-card/60 border border-ocean-border/80 flex flex-col gap-1.5 text-xs text-slate-500">
            <div className="flex items-center justify-between font-semibold text-ocean-text">
              <span className="flex items-center gap-1.5">
                <FiKey className="w-3.5 h-3.5 text-ocean-primary" /> Admin Demo Account
              </span>
              <button
                type="button"
                onClick={() => handleFillDemo('karuppuduraikece@gmail.com', 'admin')}
                className="text-[11px] font-bold text-ocean-primary hover:underline"
              >
                Auto-fill
              </button>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>karuppuduraikece@gmail.com</span>
              <span className="font-mono">pass: admin</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 flex items-center gap-2 text-sm text-ocean-danger">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-ocean-text block">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-ocean-border bg-ocean-bg focus:bg-ocean-card focus:outline-none focus:border-ocean-primary focus:ring-1 focus:ring-ocean-primary transition-all text-sm text-ocean-text"
                  placeholder="karuppuduraikece@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-ocean-text block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-ocean-border bg-ocean-bg focus:bg-ocean-card focus:outline-none focus:border-ocean-primary focus:ring-1 focus:ring-ocean-primary transition-all text-sm text-ocean-text"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-2.5 mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ocean-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-ocean-card px-3 text-slate-400 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google OAuth Button */}
          <GoogleLoginButton
            label="Sign in with Google"
            onSuccess={handleGoogleSuccess}
            onError={(err) => setError(err)}
          />

          <div className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-ocean-primary hover:underline">
              Register
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
