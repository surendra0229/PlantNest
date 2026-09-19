import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { plantService } from '../services/api';
import PlantCard from '../components/plants/PlantCard';
import {
  ArrowRight,
  Sparkles,
  ChevronRight,
  Search,
  RotateCcw,
  X,
  AlertTriangle,
  ArrowUpDown,
  Leaf
} from 'lucide-react';

const CIRCULAR_CATEGORIES = [
  { id: 'all', name: 'All Plants', query: 'All', icon: '🪴' },
  { id: 'indoor', name: 'Indoor Plants', query: 'Indoor Plants', icon: '🌿' },
  { id: 'outdoor', name: 'Outdoor Plants', query: 'Outdoor Plants', icon: '☀️' },
  { id: 'flowering', name: 'Flowering', query: 'Flowering Plants', icon: '🌸' },
  { id: 'succulents', name: 'Succulents', query: 'Succulents & Cacti', icon: '🌵' },
  { id: 'bonsai', name: 'Bonsai Trees', query: 'Bonsai & Trees', icon: '🌳' },
  { id: 'herbs', name: 'Fresh Herbs', query: 'Herbs & Spices', icon: '🍃' },
  { id: 'pots', name: 'Planters & Pots', query: 'Pots & Planters', icon: '🏺' }
];

const UserDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Active filter state synced with URL search parameters
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    sort: searchParams.get('sort') || 'newest',
  });

  const { toast } = useToast();
  const { checkUserAuth } = useAuth();

  // Handle Google OAuth login success notification & sync user profile
  useEffect(() => {
    if (searchParams.get('oauth') === 'success') {
      toast.success('Successfully authenticated via Google! Welcome to PlantNest.');
      checkUserAuth();
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('oauth');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, checkUserAuth]);

  // Keep filters in sync when URL search parameters change
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || 'All',
      sort: searchParams.get('sort') || 'newest',
    });
  }, [searchParams]);

  // Fetch Database Products matching search, filters, sorting & pagination
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setApiError(null);

      const res = await plantService.getPlants({
        search: filters.search,
        category: filters.category,
        sort: filters.sort,
        page,
        limit: 24,
      });

      if (res.success) {
        setPlants(res.plants || []);
        setTotal(res.total || 0);
        setPages(res.pages || 1);
      } else {
        setApiError('Failed to retrieve plants from database.');
      }
    } catch (err) {
      console.error('Error loading plants from database:', err);
      setApiError(err.message || 'Unable to connect to plant database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, page]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPage(1);

    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((k) => {
      if (newFilters[k] && newFilters[k] !== 'All') {
        params.set(k, newFilters[k]);
      }
    });
    setSearchParams(params);
  };

  const handleBannerClick = (categoryQuery) => {
    handleFilterChange('category', categoryQuery);
    setTimeout(() => {
      const feed = document.getElementById('main-product-feed');
      if (feed) feed.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      search: '',
      category: 'All',
      sort: 'newest',
    };
    setFilters(defaultFilters);
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="space-y-10 pb-16 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* 1. Hero Banner Grid System */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Hero Card */}
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-2xl min-h-[340px] sm:min-h-[380px] flex flex-col justify-between p-8 sm:p-10 text-white bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 border border-emerald-800/60 group">
            
            <div className="relative z-10 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-slate-950 shadow">
                <Leaf className="w-3.5 h-3.5" />
                PlantNest Sanctuary
              </span>
            </div>

            <div className="relative z-10 space-y-4 max-w-md my-4">
              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                INDOOR <br />
                <span className="text-emerald-400">JUNGLE</span>
              </h1>
              <p className="text-sm sm:text-base text-emerald-100/90 font-medium leading-relaxed">
                Turn your home into a lush green paradise with our nursery-fresh indoor foliage.
              </p>
              
              <button
                onClick={() => handleBannerClick('Indoor Plants')}
                className="inline-flex px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-xl items-center gap-2 transition transform hover:-translate-y-0.5 cursor-pointer border border-emerald-500/40"
              >
                Shop Indoor Jungle <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative z-10 flex items-center gap-3 text-xs font-bold text-emerald-300">
              <span className="flex items-center gap-1">✨ 100% Organic Soil</span>
              <span>•</span>
              <span className="flex items-center gap-1">🚚 Free Express Delivery</span>
            </div>
          </div>

          {/* Right Column Banners */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            
            <div className="relative rounded-3xl overflow-hidden shadow-lg h-44 sm:h-48 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-slate-800 p-6 flex flex-col justify-between text-white group">
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  Essential Plant Care
                </span>
                <h3 className="text-xl font-black text-white">
                  Planting Materials
                </h3>
              </div>

              <div className="relative z-10">
                <button
                  onClick={() => handleBannerClick('Herbs & Spices')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  SHOP NOW <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="relative rounded-3xl overflow-hidden shadow-md h-36 bg-gradient-to-br from-emerald-950 to-teal-900 p-5 flex flex-col justify-between text-white border border-emerald-800 group">
                <div className="relative z-10">
                  <p className="text-[9px] font-black uppercase tracking-wider text-amber-400">Decorate Living Spaces</p>
                  <h4 className="text-sm font-black text-white mt-0.5">Trending Planters</h4>
                </div>
                <div className="relative z-10">
                  <button
                    onClick={() => handleBannerClick('Pots & Planters')}
                    className="px-3 py-1.5 rounded-lg bg-white text-emerald-950 hover:bg-slate-100 font-extrabold text-[11px] shadow transition cursor-pointer"
                  >
                    BUY NOW
                  </button>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-md h-36 bg-gradient-to-br from-teal-950 to-emerald-900 p-5 flex flex-col justify-between text-white border border-teal-800 group">
                <div className="relative z-10">
                  <p className="text-[9px] font-black uppercase tracking-wider text-teal-300">Soil & Accents</p>
                  <h4 className="text-sm font-black text-white mt-0.5">Garden Pebbles</h4>
                </div>
                <div className="relative z-10">
                  <button
                    onClick={() => handleBannerClick('Succulents & Cacti')}
                    className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-[11px] shadow transition cursor-pointer"
                  >
                    SHOP NOW
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>



      {/* 3. Main Dashboard Products Feed (Full Width Clean Grid - No Filter Sidebar) */}
      <section id="main-product-feed" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Controls & Active Search Indicator */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Nursery Product Feed</h2>
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              {total} {total === 1 ? 'Plant' : 'Plants'} Available
            </span>

            {/* Active Category Tag */}
            {filters.category && filters.category !== 'All' && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-extrabold">
                Category: {filters.category}
              </span>
            )}

            {/* Active Search Pill */}
            {filters.search && (
              <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/50 text-amber-900 dark:text-amber-200 px-3 py-1 rounded-full text-xs font-extrabold">
                <Search className="w-3.5 h-3.5 text-amber-600" />
                <span>Search: "{filters.search}"</span>
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="hover:text-rose-600 ml-1 cursor-pointer"
                  title="Clear Search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            
            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl py-2 px-3 focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>

            {/* Reset Filters Button */}
            {(filters.search || filters.category !== 'All') && (
              <button
                onClick={handleResetFilters}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Reset All Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}

          </div>

        </div>

        {/* Full-Width Product Grid (Clean 4 Columns) */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="h-80 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-4 animate-pulse">
                  <div className="w-full h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                </div>
              ))}
            </div>
          ) : apiError ? (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 p-8 rounded-3xl text-center space-y-4">
              <AlertTriangle className="w-10 h-10 text-rose-600 dark:text-rose-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Database Connection Failure</h3>
              <p className="text-xs text-rose-700 dark:text-rose-300 max-w-md mx-auto font-medium">
                {apiError}
              </p>
              <button
                onClick={fetchProducts}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow transition cursor-pointer"
              >
                Retry Database Connection
              </button>
            </div>
          ) : plants.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
              <span className="text-4xl">🪴</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">No Plants Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto font-semibold">
                {filters.search
                  ? `No nursery plants matched your search term "${filters.search}".`
                  : 'No plants matched your active category filter.'}
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow transition cursor-pointer"
              >
                Clear All Filters & View Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {plants.map((plant) => (
                <PlantCard key={plant._id} plant={plant} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-8 border-t border-slate-200 dark:border-slate-800 mt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 disabled:opacity-40 transition cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                Page {page} of {pages}
              </span>
              <button
                disabled={page >= pages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 disabled:opacity-40 transition cursor-pointer"
              >
                Next
              </button>
            </div>
          )}

        </div>

      </section>

    </div>
  );
};

export default UserDashboard;
