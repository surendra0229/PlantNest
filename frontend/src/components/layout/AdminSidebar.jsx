import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Sprout,
  ShoppingBag,
  Users,
  Brain,
  LogOut,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const { admin, logoutAdmin } = useAuth();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isHovered;

  const navItems = [
    { path: '/admin/dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard },
    { path: '/admin/plants', label: 'Plant Catalog', icon: Sprout },
    { path: '/admin/orders', label: 'Customer Orders', icon: ShoppingBag },
    { path: '/admin/users', label: 'Registered Users', icon: Users },
    { path: '/admin/knowledge', label: 'Chatbot Knowledge', icon: Brain },
  ];

  const renderNavContent = (expanded) => (
    <>
      {/* Top Banner Header when Expanded */}
      {expanded ? (
        <div className="p-3.5 bg-emerald-600 dark:bg-emerald-700 text-white flex items-center justify-between shrink-0 rounded-tr-2xl shadow-md">
          <div className="flex items-center gap-2.5 font-black text-sm uppercase tracking-wider">
            <Menu className="w-5 h-5 text-amber-300" />
            <span>Admin Menu</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest text-emerald-100">
            PlantNest
          </span>
        </div>
      ) : null}

      {/* Admin Profile Info Badge */}
      {expanded ? (
        <div className="mx-2 my-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-600 text-white font-extrabold shadow-sm shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-slate-900 dark:text-white truncate">{admin?.name || 'Administrator'}</p>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold uppercase tracking-wider">Super Admin</p>
          </div>
        </div>
      ) : null}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 space-y-1.5 no-scrollbar px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <div key={item.path} className="relative group/tooltip">
              <Link
                to={item.path}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={`w-full flex items-center gap-3.5 p-2.5 rounded-2xl transition duration-200 text-left cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 dark:bg-emerald-600 text-white font-black shadow-md'
                    : 'text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800/80 hover:text-emerald-700 dark:hover:text-emerald-400'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 group-hover/tooltip:bg-emerald-700 group-hover/tooltip:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {expanded && (
                  <div className="flex-1 min-w-0 pr-1">
                    <p className={`text-xs uppercase tracking-wider truncate ${isActive ? 'font-black text-white' : 'font-extrabold text-slate-800 dark:text-slate-200'}`}>
                      {item.label}
                    </p>
                  </div>
                )}

                {expanded && (
                  <ChevronRight className={`w-4 h-4 shrink-0 transition ${isActive ? 'text-white' : 'text-slate-400 group-hover/tooltip:text-emerald-600 dark:group-hover/tooltip:text-emerald-400'}`} />
                )}
              </Link>

              {/* Collapsed Tooltip on Hover */}
              {!expanded && (
                <div className="absolute left-16 top-1/2 -translate-y-1/2 z-50 bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xl border border-slate-700 whitespace-nowrap pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Controls */}
      <div className="p-2 space-y-2 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <div className="relative group/tooltip">
          <Link
            to="/dashboard"
            target="_blank"
            rel="noreferrer"
            className={`w-full flex items-center gap-3.5 p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-emerald-300 text-xs font-extrabold hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-700 transition cursor-pointer ${
              expanded ? 'justify-between px-3.5' : 'justify-center'
            }`}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-emerald-600 dark:text-amber-300">
              <ExternalLink className="w-4 h-4" />
            </div>
            {expanded && <span className="truncate">View User Store</span>}
          </Link>
          {!expanded && (
            <div className="absolute left-16 top-1/2 -translate-y-1/2 z-50 bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xl border border-slate-700 whitespace-nowrap pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150">
              View User Store
            </div>
          )}
        </div>

        <div className="relative group/tooltip">
          <button
            onClick={logoutAdmin}
            className={`w-full flex items-center gap-3.5 p-2.5 rounded-2xl text-xs font-extrabold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 transition cursor-pointer ${
              expanded ? 'justify-start px-3.5' : 'justify-center'
            }`}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
              <LogOut className="w-4 h-4" />
            </div>
            {expanded && <span>Sign Out Admin</span>}
          </button>
          {!expanded && (
            <div className="absolute left-16 top-1/2 -translate-y-1/2 z-50 bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xl border border-slate-700 whitespace-nowrap pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150">
              Sign Out Admin
            </div>
          )}
        </div>
      </div>

      {/* Footer Sync Badge */}
      {expanded && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[10px] text-emerald-800 dark:text-emerald-400 font-black flex items-center gap-2 rounded-br-2xl shrink-0">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>PlantNest Nursery Admin Sync</span>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* 1. Desktop Fixed Icon Sidebar with Hover Expansion */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden md:flex fixed left-0 top-[65px] bottom-0 z-50 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-72 rounded-tr-3xl rounded-br-3xl' : 'w-16'
        }`}
      >
        {renderNavContent(isExpanded)}
      </aside>

      {/* 2. Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen && setMobileOpen(false)}
          />
          <div className="relative flex-1 max-w-xs w-full h-full z-10 bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-r border-slate-200 dark:border-slate-800">
            <div className="p-4 bg-emerald-700 dark:bg-slate-800 text-white flex justify-between items-center">
              <div className="flex items-center gap-2 font-black text-sm">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <span>Admin Navigation</span>
              </div>
              <button
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className="text-white hover:text-amber-300 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderNavContent(true)}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
