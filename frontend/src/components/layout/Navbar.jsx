import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useSidebar } from '../../context/SidebarContext';
import { plantService } from '../../services/api';
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  Menu,
  X,
  LogOut,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Phone,
  Sun,
  Moon
} from 'lucide-react';

const Navbar = () => {
  const { user, admin, logoutUser } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme, isDark } = useTheme();
  const { isExpanded, isHovered, isPinned, setIsHovered, togglePinned, setMobileOpen: setSidebarMobileOpen } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User Profile Menu State (Supports Hover & Click Pinning)
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userMenuHovered, setUserMenuHovered] = useState(false);

  // More Menu State (Supports Hover & Click Pinning)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [moreMenuHovered, setMoreMenuHovered] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchContainerRef = useRef(null);
  const userMenuRef = useRef(null);
  const moreMenuRef = useRef(null);

  const isUserMenuVisible = userMenuOpen || userMenuHovered;
  const isMoreMenuVisible = moreMenuOpen || moreMenuHovered;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        plantService.getPlants({ search: searchQuery.trim(), limit: 5 })
          .then((res) => {
            if (res.success) {
              setSearchSuggestions(res.plants || []);
              setShowSuggestions(true);
            }
          })
          .catch((err) => console.error('Error fetching suggestions:', err))
          .finally(() => setIsSearching(false));
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Global click outside listener to dismiss menus
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
        setUserMenuHovered(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setMoreMenuOpen(false);
        setMoreMenuHovered(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/dashboard?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectSuggestion = (plantId) => {
    setShowSuggestions(false);
    setSearchQuery('');
    navigate(`/plant/${plantId}`);
  };

  const closeAllMenus = () => {
    setUserMenuOpen(false);
    setUserMenuHovered(false);
    setMoreMenuOpen(false);
    setMoreMenuHovered(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#044e36] dark:bg-slate-900 border-b border-emerald-800/60 dark:border-slate-800 text-white shadow-lg transition-colors duration-200">
      
      {/* Single Clean Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left Brand & 3-Line Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* 3-Line Menu Hamburger Trigger inside Header */}
            {user && (
              <button
                onClick={togglePinned}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition shadow cursor-pointer shrink-0 ${
                  isPinned || isExpanded
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-glow-emerald'
                    : 'bg-emerald-800/80 dark:bg-slate-800 border-emerald-600 dark:border-slate-700 text-white hover:bg-emerald-700 dark:hover:bg-slate-700'
                }`}
                title="Toggle Nursery Categories Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {/* Brand Logo */}
            <Link to="/dashboard" onClick={closeAllMenus} className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl p-1 bg-white flex items-center justify-center shadow-md group-hover:scale-105 transition duration-300">
                <img
                  src="/logo.png"
                  alt="PlantNest Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  PlantNest
                </span>
                <span className="text-[9px] uppercase tracking-widest text-emerald-300 dark:text-emerald-400 font-bold hidden sm:inline-block">
                  Botanical Dashboard
                </span>
              </div>
            </Link>

          </div>

          {/* Search Bar */}
          <div ref={searchContainerRef} className="flex-1 max-w-xl mx-1 sm:mx-4 relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search Plants, Seeds, Care Kits, Pots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchSuggestions.length > 0) setShowSuggestions(true); }}
                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 text-xs sm:text-sm font-semibold rounded-xl py-2.5 pl-3.5 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-400 border border-transparent dark:border-slate-700 shadow-md transition"
              />
              <button
                type="submit"
                className="absolute right-1.5 p-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white transition shadow cursor-pointer"
                title="Search Products"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Autocomplete Dropdown */}
            {showSuggestions && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden z-50">
                <div className="p-2.5 border-b border-slate-100 dark:border-slate-700 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex justify-between items-center px-4 bg-slate-50 dark:bg-slate-900/60">
                  <span>Product Suggestions</span>
                  {isSearching && <span className="animate-pulse">Searching...</span>}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                  {searchSuggestions.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleSelectSuggestion(item._id)}
                      className="w-full text-left p-3 hover:bg-emerald-50 dark:hover:bg-slate-700/60 flex items-center gap-3 transition group cursor-pointer"
                    >
                      {item.images?.[0] && (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-600"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {item.category} • <strong className="text-emerald-700 dark:text-emerald-400">₹{item.finalPrice || item.price}</strong>
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-emerald-800/80 dark:bg-slate-800 border border-emerald-600 dark:border-slate-700 hover:bg-emerald-700 dark:hover:bg-slate-700 text-amber-300 transition shadow flex items-center justify-center cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-amber-200" />}
            </button>

            {/* User Profile Dropdown (Hover + Click Pinning) */}
            {user ? (
              <div
                ref={userMenuRef}
                onMouseEnter={() => setUserMenuHovered(true)}
                onMouseLeave={() => setUserMenuHovered(false)}
                className="relative"
              >
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className={`flex items-center gap-2 p-1.5 px-3 rounded-xl border transition shadow cursor-pointer ${
                    isUserMenuVisible
                      ? 'bg-emerald-700 dark:bg-slate-700 border-amber-400 text-white'
                      : 'bg-emerald-800/80 dark:bg-slate-800 border-emerald-600 dark:border-slate-700 hover:bg-emerald-700 dark:hover:bg-slate-700 text-white'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-white dark:bg-emerald-700 text-emerald-800 dark:text-white font-extrabold flex items-center justify-center text-xs shadow overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name ? user.name.charAt(0).toUpperCase() : 'U'
                    )}
                  </div>
                  <span className="hidden md:inline text-xs font-extrabold max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-amber-300 transition-transform duration-200 ${isUserMenuVisible ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuVisible && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xl py-2 z-50 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-1 duration-150">
                    <Link
                      to="/profile"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-700 transition"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      My Profile & Addresses
                    </Link>
                    <Link
                      to="/orders"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-700 transition"
                    >
                      <PackageCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      My Orders & Tracking
                    </Link>
                    <button
                      onClick={() => {
                        closeAllMenus();
                        logoutUser();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition border-t border-slate-100 dark:border-slate-700 mt-1 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            {/* "More" Dropdown (Hover + Click Pinning) */}
            <div
              ref={moreMenuRef}
              onMouseEnter={() => setMoreMenuHovered(true)}
              onMouseLeave={() => setMoreMenuHovered(false)}
              className="relative hidden md:block"
            >
              <button
                onClick={() => setMoreMenuOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isMoreMenuVisible
                    ? 'bg-emerald-700 dark:bg-slate-800 text-white'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-800/80 dark:hover:bg-slate-800'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 text-amber-300 transition-transform duration-200 ${isMoreMenuVisible ? 'rotate-180' : ''}`} />
              </button>

              {isMoreMenuVisible && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xl py-2 z-50 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link
                    to="/services"
                    onClick={closeAllMenus}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-700 transition"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    PlantNest Services
                  </Link>
                  <Link
                    to="/contact"
                    onClick={closeAllMenus}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-700 transition"
                  >
                    <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Contact & Helpdesk
                  </Link>
                  {admin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition border-t border-slate-100 dark:border-slate-700 mt-1"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      Admin Portal
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link
              to="/cart"
              onClick={closeAllMenus}
              className="relative p-2.5 rounded-xl bg-emerald-800/80 dark:bg-slate-800 border border-emerald-600 dark:border-slate-700 hover:bg-emerald-700 dark:hover:bg-slate-700 text-white transition shadow flex items-center gap-2 cursor-pointer"
              title="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <span className="hidden sm:inline text-xs font-black">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-amber-400 text-slate-900 font-black text-[11px] rounded-full flex items-center justify-center border-2 border-emerald-900 shadow">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setSidebarMobileOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2.5 rounded-xl bg-emerald-800/80 dark:bg-slate-800 border border-emerald-600 dark:border-slate-700 text-white transition cursor-pointer"
              title="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-800/80 dark:border-slate-800 bg-[#033b28] dark:bg-slate-900 px-4 py-4 space-y-3">
          <Link
            to="/dashboard"
            onClick={closeAllMenus}
            className="block px-3 py-2 rounded-xl text-xs font-bold text-white hover:bg-emerald-800 dark:hover:bg-slate-800"
          >
            Dashboard & Plant Feed
          </Link>
          <Link
            to="/services"
            onClick={closeAllMenus}
            className="block px-3 py-2 rounded-xl text-xs font-bold text-white hover:bg-emerald-800 dark:hover:bg-slate-800"
          >
            Services & Nursery Help
          </Link>
          <Link
            to="/contact"
            onClick={closeAllMenus}
            className="block px-3 py-2 rounded-xl text-xs font-bold text-white hover:bg-emerald-800 dark:hover:bg-slate-800"
          >
            Contact Botanists
          </Link>
          <Link
            to="/orders"
            onClick={closeAllMenus}
            className="block px-3 py-2 rounded-xl text-xs font-bold text-white hover:bg-emerald-800 dark:hover:bg-slate-800"
          >
            My Orders & Tracking
          </Link>
          <Link
            to="/profile"
            onClick={closeAllMenus}
            className="block px-3 py-2 rounded-xl text-xs font-bold text-white hover:bg-emerald-800 dark:hover:bg-slate-800"
          >
            My Profile & Addresses
          </Link>
          {admin && (
            <Link
              to="/admin/dashboard"
              onClick={closeAllMenus}
              className="block px-3 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/40 border border-amber-500/30"
            >
              Admin Portal
            </Link>
          )}
        </div>
      )}

    </header>
  );
};

export default Navbar;
