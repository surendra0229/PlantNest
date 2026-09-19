import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.registeredEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const { loginUser } = useAuth();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || '/dashboard';
  const notificationMessage = location.state?.message || (location.state?.from ? 'Please sign in or register to explore our plant catalog.' : null);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get('error');
    if (errorParam) {
      toast.error(decodeURIComponent(errorParam));
      navigate('/login', { replace: true });
    }
  }, [location.search, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser({ email, password });
      if (res.success) {
        toast.success('Logged in successfully! Welcome back to PlantNest.');
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info('Redirecting to Google Sign-In...');
    const backendUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
      : 'http://localhost:5000';
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error('Please enter your registered email address.');
      return;
    }
    toast.success(`Password reset instructions sent to ${forgotEmail}!`);
    setForgotPasswordOpen(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      <div className="w-full max-w-md space-y-6">
        
        {/* Top Header: Back to Home Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 font-bold text-xs shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Back to Home
          </Link>
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            PlantNest Sign In
          </span>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl p-1 bg-emerald-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition duration-300">
              <img src="/logo.png" alt="PlantNest Logo" className="w-full h-full object-contain" />
            </div>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Sign In to PlantNest</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Access your plant dashboard, order tracking, and care guides.
          </p>
        </div>

        {/* Dedicated Auth Card */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
          
          {notificationMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs text-center font-bold">
              ✨ {notificationMessage}
            </div>
          )}

          {/* 1. Email/Password Login Form — ALWAYS FIRST */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1">Email Address</label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-emerald-600 font-semibold"
                />
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-700 dark:text-slate-300 font-extrabold">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-bold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:border-emerald-600 font-semibold"
                />
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-xs font-semibold">
            <span className="flex-1 border-t border-slate-200 dark:border-slate-800"></span>
            <span className="uppercase text-[10px] font-bold">or continue with</span>
            <span className="flex-1 border-t border-slate-200 dark:border-slate-800"></span>
          </div>

          {/* 2. Google SSO Button — BELOW email/password form */}
          <button
            id="login-google-btn"
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 font-extrabold text-xs shadow-sm flex items-center justify-center gap-3 transition cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>

          {/* Register + Admin Links */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <p className="font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="font-extrabold text-emerald-700 dark:text-emerald-400 hover:underline">
                Register Here
              </Link>
            </p>
            <p className="pt-1 border-t border-slate-100 dark:border-slate-800">
              <Link to="/admin/login" className="text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center justify-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Nursery Admin Portal Login
              </Link>
            </p>
          </div>

        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 font-bold transition">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to PlantNest Landing Page
          </Link>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl text-slate-900 dark:text-white">
            <h3 className="text-base font-bold">Reset Password</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Enter your email address and we will send you password reset instructions.
            </p>
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-3 text-xs">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2.5 px-3 focus:outline-none focus:border-emerald-600 font-semibold"
              />
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-700 text-white font-bold"
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
