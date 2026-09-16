import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useStore } from '../../lib/store';
import { BrandLogo } from '../common/BrandLogo';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, loginWithEmail, registerWithEmail, authLoading } = useStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    if (isSignUp && password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setErrorMsg('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('An account with this email already exists.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Password is too weak. Please use at least 6 characters.');
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#121215] border border-[#222226] rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <BrandLogo size={36} showText={false} />
          <h2 className="text-lg font-bold tracking-tight text-[#FAFAFA] mt-3">
            {isSignUp ? 'Create your Academic Profile' : 'Sign in to OpenCompete'}
          </h2>
          <p className="text-xs text-[#71717A] mt-1">
            {isSignUp
              ? 'Join competitive study cohorts and track verified hours.'
              : 'Welcome back. Your focus squad is currently live.'}
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 flex items-center gap-2.5 text-xs text-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span className="leading-tight">{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase font-mono tracking-wider text-[#71717A] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-xl text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-mono tracking-wider text-[#71717A] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-xl text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-[11px] uppercase font-mono tracking-wider text-[#71717A] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B]" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-xl text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || authLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.99] transition-all shadow-lg disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle sign in / sign up */}
        <div className="mt-6 pt-4 border-t border-[#222226] text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg(null);
            }}
            className="text-xs text-[#71717A] hover:text-[#FAFAFA] transition-colors font-mono"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account yet? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
};
