import React, { useState } from 'react';
import { X, Lock, Mail, User, AlertCircle } from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onLogin,
  onRegister,
  isLoading = false,
  error = null,
  clearError
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clientValidation, setClientValidation] = useState('');

  if (!isOpen) return null;

  const handleTabChange = (newMode) => {
    setMode(newMode);
    setClientValidation('');
    if (clearError) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClientValidation('');

    if (!email || !password) {
      setClientValidation('Please fill in all required fields.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setClientValidation('Please enter your full name.');
      return;
    }

    if (password.length < 6) {
      setClientValidation('Password must be at least 6 characters.');
      return;
    }

    try {
      if (mode === 'login') {
        await onLogin({ email, password });
      } else {
        await onRegister({ name, email, password });
      }
      onClose();
    } catch {
      // Error handled by AuthContext
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />

        <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 sm:p-8 text-left shadow-2xl transition-all border border-brand-cream-border">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-brand-muted hover:text-brand-charcoal rounded-full hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Heading */}
          <div className="text-center mb-6">
            <span className="font-serif text-2xl font-bold tracking-tight text-brand-green">
              sofra<span className="text-brand-terracotta">.</span>
            </span>
            <h3 className="font-serif text-2xl font-bold text-brand-charcoal mt-2">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h3>
            <p className="text-xs text-brand-muted mt-1">
              {mode === 'login' 
                ? 'Sign in to access your orders and fast checkout' 
                : 'Join us to place orders and enjoy seamless checkout'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl bg-brand-cream-card p-1 mb-6 border border-brand-cream-border">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-brand-green shadow-sm'
                  : 'text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('register')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-brand-green shadow-sm'
                  : 'text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              Register
            </button>
          </div>

          {/* Errors */}
          {(error || clientValidation) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{clientValidation || error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-brand-charcoal uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-cream-border focus:outline-none focus:ring-2 focus:ring-brand-green/30 text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-brand-charcoal uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-cream-border focus:outline-none focus:ring-2 focus:ring-brand-green/30 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-charcoal uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-cream-border focus:outline-none focus:ring-2 focus:ring-brand-green/30 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-brand-green hover:bg-brand-green-light text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-md shadow-brand-green/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : (
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-xs text-brand-muted">
              {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
              <button
                type="button"
                onClick={() => handleTabChange(mode === 'login' ? 'register' : 'login')}
                className="text-brand-terracotta font-semibold hover:underline"
              >
                {mode === 'login' ? 'Register now' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
