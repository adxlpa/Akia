import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const AdminLoginGate: React.FC = () => {
  const {
    loginAdmin,
    isLockedOut,
    lockoutRemainingSeconds,
    failedAttempts,
    setActiveView,
  } = useStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Please provide both username and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await loginAdmin(username, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setErrorMessage('A system security error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  const attemptsRemaining = Math.max(0, 5 - failedAttempts);

  return (
    <div className="min-h-screen bg-[#F5F4F2] flex flex-col justify-center items-center px-4 py-12 pt-28">
      {/* Background Micro Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundSize: '48px 48px',
          backgroundImage:
            'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
        }}
      />

      <div className="relative w-full max-w-md bg-white border border-[#E5E5E5] shadow-xl p-8 sm:p-10">
        {/* Brand & Security Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img
              src="/images/logo.png"
              alt="AKIA Seal"
              className="w-16 h-16 object-contain rounded-full border border-[#004080]/20 shadow-sm"
            />
          </div>
          <h1 className="text-2xl font-serif tracking-widest text-[#8B261D] uppercase">AKIA</h1>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#5e5e5e] mt-1 font-mono">
            Staff & Administrative Gateway
          </p>
          <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-[#2e7d32] font-mono bg-emerald-50 py-1 px-3 border border-emerald-200">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            <span>Authorized Personnel Access</span>
          </div>
        </div>

        {/* Lockout Warning Box */}
        {isLockedOut ? (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-[13px] rounded-none">
            <div className="flex items-center gap-2 font-semibold uppercase tracking-wider text-[11px] text-red-900 mb-1">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>Security Lockdown Triggered</span>
            </div>
            <p className="leading-relaxed">
              Too many consecutive failed login attempts detected. Access is temporarily suspended to protect against unauthorized entry.
            </p>
            <div className="mt-3 pt-2 border-t border-red-200 flex items-center justify-between text-[12px] font-mono font-medium">
              <span>Unlocks in:</span>
              <span className="text-red-900 text-sm font-bold bg-white px-2 py-0.5 border border-red-300">
                {Math.floor(lockoutRemainingSeconds / 60)}:
                {(lockoutRemainingSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        ) : errorMessage ? (
          <div className="mb-6 p-3.5 bg-amber-50 border border-amber-300 text-amber-900 text-[13px] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0 mt-0.5">
              warning
            </span>
            <div className="flex-1">
              <p>{errorMessage}</p>
              {attemptsRemaining > 0 && attemptsRemaining < 5 && (
                <p className="text-[11px] font-mono mt-1 text-amber-800">
                  {attemptsRemaining} attempt{attemptsRemaining === 1 ? '' : 's'} remaining before 5-minute lockout.
                </p>
              )}
            </div>
          </div>
        ) : null}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1a1c1c] mb-1.5 font-mono">
              Admin Identifier / Username
            </label>
            <div className="relative">
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLockedOut || isLoading}
                placeholder="e.g. admin"
                className="w-full h-11 px-3.5 pl-10 border border-[#E5E5E5] text-[14px] text-black bg-white focus:border-black focus:outline-none transition-colors disabled:bg-neutral-100 disabled:cursor-not-allowed"
                required
              />
              <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-[#747878] pointer-events-none">
                person
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1a1c1c] font-mono">
                Security Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="text-[11px] text-[#5e5e5e] hover:text-black uppercase tracking-wider"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLockedOut || isLoading}
                placeholder="••••••••••••"
                className="w-full h-11 px-3.5 pl-10 pr-10 border border-[#E5E5E5] text-[14px] text-black bg-white focus:border-black focus:outline-none transition-colors disabled:bg-neutral-100 disabled:cursor-not-allowed"
                required
              />
              <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-[#747878] pointer-events-none">
                lock
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLockedOut || isLoading}
            className="w-full h-12 bg-black hover:bg-neutral-800 text-white font-medium text-[12px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:bg-neutral-300 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">key</span>
                <span>Sign In to Admin</span>
              </>
            )}
          </button>
        </form>

        {/* Security Feature Highlights */}
        <div className="mt-8 pt-6 border-t border-[#E5E5E5] space-y-2 text-[11px] text-[#5e5e5e] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Account lockout protection (5 attempts maximum)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Automatic logout after 30 minutes of inactivity</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Administrative sessions are securely logged</span>
          </div>
        </div>

        {/* Security Shield Notice */}
        <div className="mt-4 p-3 bg-[#F9F9F9] border border-[#E5E5E5] text-[11px] text-[#5e5e5e] text-center font-mono">
          <span>Protected Staff Area • Access Restricted to Authorized Personnel</span>
        </div>


        {/* Return Button */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setActiveView('home')}
            className="text-[12px] uppercase tracking-wider text-[#5e5e5e] hover:text-black transition-colors inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Return to AKIA Storefront</span>
          </button>
        </div>
      </div>
    </div>
  );
};
