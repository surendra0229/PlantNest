import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, admin, loadingUser, loadingAdmin } = useAuth();
  const location = useLocation();

  if (loadingUser || loadingAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Verifying security session...</span>
      </div>
    );
  }

  // If logged in as admin accessing protected user route, allow admin or redirect to admin dashboard
  if (!user && admin) {
    return children;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
