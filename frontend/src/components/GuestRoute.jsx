import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const GuestRoute = ({ children }) => {
  const { user, admin, loadingUser, loadingAdmin } = useAuth();

  if (loadingUser || loadingAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Verifying security session...</span>
      </div>
    );
  }

  // If a normal user is logged in, block access to Login/Register/Admin Login and redirect to User Dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If an admin is logged in, block access to Login/Register/Admin Login and redirect to Admin Dashboard
  if (admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
