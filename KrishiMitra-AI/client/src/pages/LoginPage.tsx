import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sprout, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { signIn, enableDemoMode, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      toast.error(error.message);
    } else {
      toast.success('Signed in successfully! Welcome back.');
      navigate(from, { replace: true });
    }
  };

  const handleDemoSignIn = () => {
    enableDemoMode();
    toast.success('Logged in as Demo Farmer (Basavaraj Patil)!');
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-linear-to-b from-forest-50/50 via-cream-50 to-white">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Header & Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-forest-800 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-7 h-7 text-leaf-light" />
          </div>
          <h2 className="text-2xl font-extrabold text-forest-950">Farmer Sign In</h2>
          <p className="text-xs text-slate-500">Access your KrishiMitra AI farming intelligence</p>
        </div>

        {/* Supabase status badge */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center space-x-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="font-medium text-slate-700">
              {isConfigured ? 'Supabase Auth Online' : 'Supabase Setup Mode'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {isConfigured ? 'Live Database' : 'Pending Env Setup'}
          </span>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMsg}</div>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="farmer@krishimitra.in"
              autoComplete="email"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-forest-700 focus:border-transparent transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-forest-700 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-semibold text-sm shadow-md transition disabled:opacity-50"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In with Supabase</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access Button */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400 font-semibold">Or for instant testing</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDemoSignIn}
          className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl border-2 border-dashed border-forest-300 hover:border-forest-600 bg-forest-50/60 hover:bg-forest-50 text-forest-900 font-semibold text-xs transition"
        >
          <Sparkles className="w-4 h-4 text-leaf-dark" />
          <span>Launch with Demo Farmer Account (Instant)</span>
        </button>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          New to KrishiMitra AI?{' '}
          <Link to="/register" className="text-forest-800 font-bold hover:underline">
            Register for free
          </Link>
        </div>
      </div>
    </div>
  );
};
