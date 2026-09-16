import React, { useState } from 'react';
import { AlertCircle, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../../lib/store';
import { BrandLogo } from '../common/BrandLogo';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, loginWithGoogle, authLoading } = useStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Google auth error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in was cancelled. Please try again.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        // Ignored
      } else {
        setErrorMsg(err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#121215] border border-[#222226] rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden text-center">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center justify-center mb-6">
          <BrandLogo size={44} showText={false} />
          <h2 className="text-xl font-bold tracking-tight text-[#FAFAFA] mt-4">
            Welcome to OpenCompete
          </h2>
          <p className="text-xs text-[#71717A] mt-1.5 max-w-xs mx-auto">
            High-performance academic collaboration communities & verified group discussions.
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 flex items-center gap-2.5 text-xs text-rose-300 animate-in fade-in text-left">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span className="leading-tight">{errorMsg}</span>
          </div>
        )}

        {/* Sole Authentication Provider: Google OAuth */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleLoading || authLoading}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs flex items-center justify-center gap-3 transition-all shadow-lg active:scale-[0.99] disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : (
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Security & Feature Badges */}
          <div className="pt-4 border-t border-[#222226] flex items-center justify-center gap-4 text-[11px] text-[#71717A] font-mono">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Single Sign-On</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
