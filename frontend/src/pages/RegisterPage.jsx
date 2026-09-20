import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiActivity, FiUser, FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const result = await register(name.trim(), email.trim(), password);
      if (result && result.success) {
        navigate('/dashboard');
      } else {
        setError(result?.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('[Register] Error:', err);
      setError(err?.message || 'Server connection error during registration.');
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
        setError(result?.error || 'Failed to sign up with Google');
      }
    } catch (err) {
      setError(err?.message || 'Google registration error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ocean-bg flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ocean-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-ocean-primary/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10"
      >
        <Card hover={false} className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-ocean-secondary flex items-center justify-center text-white shadow-md font-bold mb-3">
              <FiActivity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold font-heading text-ocean-text">Register</h1>
            <p className="text-xs text-slate-500 mt-1 text-center">
              Create a account for OceanFusion AI
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-sm text-ocean-danger">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-ocean-text block">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-ocean-border bg-ocean-bg focus:bg-ocean-card focus:outline-none focus:border-ocean-primary focus:ring-1 focus:ring-ocean-primary transition-all text-sm text-ocean-text"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

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
                  placeholder="Enter your email"
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
              className="w-full py-2.5 mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Register Account'}
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
            label="Sign up with Google"
            onSuccess={handleGoogleSuccess}
            onError={(err) => setError(err)}
          />

          <div className="mt-6 text-center text-sm text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-ocean-primary hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
