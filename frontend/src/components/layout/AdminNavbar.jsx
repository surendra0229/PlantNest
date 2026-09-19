import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  ShieldCheck,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

const AdminNavbar = ({ mobileOpen, setMobileOpen }) => {
  const { admin, logoutAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  // Map location path to title
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/admin/dashboard':
        return 'Analytics & Overview';
      case '/admin/plants':
        return 'Plant Catalog Inventory';
      case '/admin/orders':
        return 'Customer Orders Management';
      case '/admin/users':
        return 'Registered User Accounts';
      default:
        return 'Admin Portal';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Mobile Trigger & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white transition cursor-pointer"
              title="Toggle Admin Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl p-1 bg-white border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-md group-hover:scale-105 transition duration-300">
                <img
                  src="/logo.png"
                  alt="PlantNest Admin"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  PlantNest
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black uppercase tracking-wider shadow-sm">
                    Admin
                  </span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-extrabold hidden sm:inline-block">
                  {getPageTitle()}
                </span>
              </div>
            </Link>
          </div>

          {/* Right Controls: Live Store Link, Theme Toggle, Admin Profile */}
          <div className="flex items-center gap-3">
            
            {/* View Live Store */}
            <Link
              to="/dashboard"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-emerald-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-xs"
            >
              <span>View Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-amber-300" />
            </Link>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-300 transition shadow-xs flex items-center justify-center cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-amber-600" />}
            </button>

            {/* Admin Profile Pill */}
            {admin && (
              <div className="relative">
                <button
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white transition shadow-xs cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="hidden md:inline text-xs font-extrabold max-w-[100px] truncate">{admin.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-amber-300" />
                </button>

                {adminMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xl py-2 z-50 border border-slate-200 dark:border-slate-700">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-bold truncate">{admin.name}</p>
                      <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold uppercase">Super Admin</p>
                    </div>
                    <button
                      onClick={() => {
                        setAdminMenuOpen(false);
                        logoutAdmin();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out Admin
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
