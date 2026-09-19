import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AdminRoute = ({ children }) => {
  const { user, admin, loadingAdmin, loadingUser } = useAuth();
  const location = useLocation();

  if (loadingAdmin || loadingUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Authenticating admin portal access...</span>
      </div>
    );
  }

  // If authenticated as normal user but not admin -> redirect to user dashboard
  if (user && !admin) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated as admin -> redirect to admin login page
  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
