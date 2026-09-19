import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, Home } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { loginAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in admin credentials.');
      return;
    }

    try {
      setLoading(true);
      const res = await loginAdmin({ email, password });
      if (res.success) {
        toast.success('Admin authenticated successfully.');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Admin authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      <div className="w-full max-w-md space-y-6">
        
        {/* Top Header: Back to Home Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 font-bold text-xs shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Back to Home
          </Link>

          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
            Nursery Admin Portal
          </span>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-700 dark:bg-emerald-600 p-2 mx-auto flex items-center justify-center text-white shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Admin Portal Sign In</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Authorized PlantNest Nursery Administrators Only
          </p>
        </div>

        {/* Admin Auth Card */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
          
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1">Admin Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter admin email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 font-semibold"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 font-semibold"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-700 dark:bg-emerald-600 hover:bg-emerald-800 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating Admin...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Authorize Admin Session
                </>
              )}
            </button>
          </form>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 font-medium text-center">
            ....Protected by Plant Nest....
          </div>

        </div>

        {/* Bottom Back to Home Link */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 font-bold transition">
            <Home className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Return to PlantNest Landing Page
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
