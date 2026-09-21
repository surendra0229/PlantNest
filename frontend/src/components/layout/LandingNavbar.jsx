import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, UserPlus, LogIn } from 'lucide-react';

const LandingNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-emerald-500/20 shadow-lg shadow-emerald-950/5 transition-all text-slate-800 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl p-1 bg-gradient-to-tr from-emerald-600 via-teal-500 to-lime-500 flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition duration-300">
              <img
                src="/logo.png"
                alt="PlantNest Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-800 dark:from-white dark:via-emerald-300 dark:to-teal-300 bg-clip-text text-transparent">
                PlantNest
              </span>
              <span className="text-[9px] uppercase tracking-widest bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent font-black">
                Botanical Sanctuary
              </span>
            </div>
          </Link>

          {/* Desktop Links: Services, Products, About, Contact */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-extrabold text-slate-700 dark:text-slate-200">
            <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Home
            </Link>
            <a href="#services" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Services
            </a>
            <a href="#products-preview" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Products
            </a>
            <a href="#about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              About Us
            </a>
            <a href="#contact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Contact
            </a>
          </nav>

          {/* Desktop Auth Buttons: Login / Register */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl border border-emerald-500/30 dark:border-emerald-500/40 text-slate-800 dark:text-slate-100 font-extrabold text-xs hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition shadow-sm"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5 flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Register
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-6 space-y-4">
          <div className="flex flex-col space-y-3 font-bold text-sm text-slate-700 dark:text-slate-200">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
            <a href="#products-preview" onClick={() => setMobileMenuOpen(false)}>Products</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>About Us</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          </div>
          <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
