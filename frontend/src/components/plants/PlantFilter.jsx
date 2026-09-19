import React from 'react';
import { RotateCcw, Filter } from 'lucide-react';

const PlantFilter = ({ filters, categories, onFilterChange, onReset }) => {
  const plantTypes = ['Indoor', 'Outdoor', 'Flowering', 'Succulent', 'Bonsai', 'Herb'];
  const sunlightOptions = ['Low Light', 'Indirect Sunlight', 'Full Sun', 'Partial Shade'];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Filter Products
        </h3>
        <button
          onClick={onReset}
          className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold rounded-xl p-2.5 focus:outline-none focus:border-emerald-600"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id || cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Plant Type Selection */}
      <div className="space-y-2">
        <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
          Plant Type
        </label>
        <div className="space-y-2 pt-1">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="radio"
              name="plantType"
              checked={filters.plantType === 'All'}
              onChange={() => onFilterChange('plantType', 'All')}
              className="accent-emerald-600 cursor-pointer"
            />
            All Types
          </label>
          {plantTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="radio"
                name="plantType"
                checked={filters.plantType === type}
                onChange={() => onFilterChange('plantType', type)}
                className="accent-emerald-600 cursor-pointer"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* Sunlight Requirement */}
      <div className="space-y-2">
        <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
          Sunlight Need
        </label>
        <select
          value={filters.sunlight}
          onChange={(e) => onFilterChange('sunlight', e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold rounded-xl p-2.5 focus:outline-none focus:border-emerald-600"
        >
          <option value="All">Any Sunlight</option>
          {sunlightOptions.map((sun) => (
            <option key={sun} value={sun}>
              {sun}
            </option>
          ))}
        </select>
      </div>

      {/* Max Price Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
          <span className="uppercase text-[11px] tracking-wider text-slate-500 dark:text-slate-400">Max Price</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">${filters.maxPrice}</span>
        </div>
        <input
          type="range"
          min="10"
          max="200"
          step="5"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange('maxPrice', e.target.value)}
          className="w-full accent-emerald-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
          <span>$10</span>
          <span>$200+</span>
        </div>
      </div>

      {/* In-Stock Only Toggle */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">In-Stock Only</span>
          <input
            type="checkbox"
            checked={filters.inStock === 'true'}
            onChange={(e) => onFilterChange('inStock', e.target.checked ? 'true' : 'false')}
            className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
          />
        </label>
      </div>

    </div>
  );
};

export default PlantFilter;
