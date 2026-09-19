import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { plantService } from '../services/api';
import PlantCard from '../components/plants/PlantCard';
import PlantFilter from '../components/plants/PlantFilter';
import { Search, Loader2, ArrowUpDown, SlidersHorizontal, X } from 'lucide-react';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter state initialized from URL search params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    plantType: searchParams.get('plantType') || 'All',
    sunlight: searchParams.get('sunlight') || 'All',
    maxPrice: searchParams.get('maxPrice') || '200',
    inStock: searchParams.get('inStock') || 'false',
    sort: searchParams.get('sort') || 'newest',
  });

  // Fetch categories list once
  useEffect(() => {
    plantService.getCategories().then((res) => {
      if (res.success) setCategories(res.categories);
    });
  }, []);

  // Synchronize state when URL query params change
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || 'All',
      plantType: searchParams.get('plantType') || 'All',
      sunlight: searchParams.get('sunlight') || 'All',
      maxPrice: searchParams.get('maxPrice') || '200',
      inStock: searchParams.get('inStock') || 'false',
      sort: searchParams.get('sort') || 'newest',
    });
  }, [searchParams]);

  // Fetch plants whenever filters or page change
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        const data = await plantService.getPlants({
          search: filters.search,
          category: filters.category,
          plantType: filters.plantType,
          sunlight: filters.sunlight,
          maxPrice: filters.maxPrice < 200 ? filters.maxPrice : undefined,
          inStock: filters.inStock,
          sort: filters.sort,
          page,
          limit: 9,
        });

        if (data.success) {
          setPlants(data.plants);
          setTotal(data.total);
          setPages(data.pages);
        }
      } catch (err) {
        console.error('Error fetching catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, [filters, page]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPage(1);

    // Update URL params
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((k) => {
      if (newFilters[k] && newFilters[k] !== 'All' && newFilters[k] !== 'false') {
        params.set(k, newFilters[k]);
      }
    });
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      search: '',
      category: 'All',
      plantType: 'All',
      sunlight: 'All',
      maxPrice: '200',
      inStock: 'false',
      sort: 'newest',
    };
    setFilters(defaultFilters);
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-card p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950">
        <h1 className="text-3xl font-extrabold text-white">Botanical Plant Catalog</h1>
        <p className="text-xs sm:text-sm text-emerald-200/80 mt-2">
          Explore our wide selection of nursery-grown house plants, flowering flora, succulents, and trees.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block">
          <PlantFilter
            filters={filters}
            categories={categories}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Catalog Main Content */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar */}
          <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
              <span className="text-xs text-emerald-300 font-semibold">
                Showing <strong className="text-white">{total}</strong> plants
              </span>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3 py-1.5 rounded-lg bg-emerald-900/60 border border-emerald-700 text-xs text-emerald-300 flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ArrowUpDown className="w-4 h-4 text-emerald-400 shrink-0" />
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full sm:w-auto bg-emerald-950/80 border border-emerald-800 text-emerald-100 text-xs rounded-xl p-2 focus:outline-none focus:border-emerald-400"
              >
                <option value="newest">Sort by: Newest Arrivals</option>
                <option value="price-asc">Sort by: Price (Low to High)</option>
                <option value="price-desc">Sort by: Price (High to Low)</option>
                <option value="name-asc">Sort by: Name (A to Z)</option>
              </select>
            </div>

          </div>

          {/* Plant Grid */}
          {loading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            </div>
          ) : plants.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-2xl space-y-4">
              <p className="text-3xl">🌿</p>
              <h3 className="text-lg font-bold text-white">No plants matched your criteria</h3>
              <p className="text-xs text-emerald-300/70 max-w-sm mx-auto">
                Try loosening your category, price range, or sunlight filters to discover more items.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plants.map((plant) => (
                <PlantCard key={plant._id} plant={plant} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3.5 py-2 rounded-xl glass-card text-xs font-bold text-emerald-300 disabled:opacity-40 hover:text-white transition"
              >
                Previous
              </button>

              <span className="text-xs font-semibold text-emerald-200 px-3">
                Page {page} of {pages}
              </span>

              <button
                disabled={page >= pages}
                onClick={() => setPage(page + 1)}
                className="px-3.5 py-2 rounded-xl glass-card text-xs font-bold text-emerald-300 disabled:opacity-40 hover:text-white transition"
              >
                Next
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs bg-[#091510] h-full p-6 overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-emerald-800">
              <h3 className="font-bold text-white">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="text-emerald-400">
                <X className="w-6 h-6" />
              </button>
            </div>
            <PlantFilter
              filters={filters}
              categories={categories}
              onFilterChange={handleFilterChange}
              onReset={() => {
                handleResetFilters();
                setMobileFilterOpen(false);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default Shop;
