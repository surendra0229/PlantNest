import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import {
  Menu,
  X,
  Leaf,
  Flower2,
  TreeDeciduous,
  Sun,
  Sprout,
  Package,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const CATEGORY_ITEMS = [
  { id: 'all', name: 'PLANTS', categoryQuery: 'All', icon: Leaf, desc: 'Browse entire botanical catalog' },
  { id: 'indoor', name: 'INDOOR PLANTS', categoryQuery: 'Indoor Plants', icon: Sprout, desc: 'Air-purifying foliage for home & office' },
  { id: 'outdoor', name: 'OUTDOOR PLANTS', categoryQuery: 'Outdoor Plants', icon: TreeDeciduous, desc: 'Resilient patio shrubs & garden greenery' },
  { id: 'flowering', name: 'FLOWERING PLANTS', categoryQuery: 'Flowering Plants', icon: Flower2, desc: 'Fragrant colorful blossoms & orchids' },
  { id: 'succulents', name: 'SUCCULENTS & CACTI', categoryQuery: 'Succulents & Cacti', icon: Sun, desc: 'Drought-tolerant architectural desk plants' },
  { id: 'bonsai', name: 'BONSAI & TREES', categoryQuery: 'Bonsai & Trees', icon: TreeDeciduous, desc: 'Miniature trained living art pieces' },
  { id: 'herbs', name: 'HERBS & SPICES', categoryQuery: 'Herbs & Spices', icon: Sprout, desc: 'Fresh kitchen garden herbs & basil' },
  { id: 'planters', name: 'POTS & PLANTERS', categoryQuery: 'Pots & Planters', icon: Package, desc: 'Ceramic, terracotta & eco planters' },
  { id: 'care', name: 'PLANT CARE & SOIL', categoryQuery: 'Plant Care', icon: Sparkles, desc: 'Fertilizers, potting mixes & care kits' },
];

const SidebarNav = () => {
  const { isExpanded, setIsHovered, mobileOpen, setMobileOpen } = useSidebar();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeCategory = searchParams.get('category') || 'All';

  const handleSelectCategory = (categoryQuery) => {
    const params = new URLSearchParams(searchParams);
    if (categoryQuery === 'All') {
      params.delete('category');
    } else {
      params.set('category', categoryQuery);
    }
    setSearchParams(params);
    navigate(`/dashboard?${params.toString()}`);
    setMobileOpen(false);

    // Smooth scroll to main feed if available
    const feed = document.getElementById('main-product-feed');
    if (feed) feed.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. Desktop Fixed Left Vertical Icon Sidebar (PlantsHub Style overlay) */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden md:flex fixed left-0 top-[65px] bottom-0 z-50 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-72 rounded-tr-3xl rounded-br-3xl' : 'w-16'
        }`}
      >
        {/* Expanded Top Menu Header Banner (PlantsHub Pic 3 Pill Style) */}
        {isExpanded ? (
          <div className="p-3.5 bg-emerald-600 dark:bg-emerald-700 text-white flex items-center justify-between shrink-0 rounded-tr-2xl shadow-md">
            <div className="flex items-center gap-2.5 font-black text-sm uppercase tracking-wider">
              <Menu className="w-5 h-5 text-amber-300" />
              <span>Menu</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest text-emerald-100">
              PlantNest
            </span>
          </div>
        ) : null}

        {/* Vertical Icon Options */}
        <div className="flex-1 overflow-y-auto py-3 space-y-1.5 no-scrollbar px-2">
          {CATEGORY_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.categoryQuery || (item.categoryQuery === 'All' && activeCategory === 'All');

            return (
              <div key={item.id} className="relative group/tooltip">
                <button
                  onClick={() => handleSelectCategory(item.categoryQuery)}
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

                  {isExpanded && (
                    <div className="flex-1 min-w-0 pr-1">
                      <p className={`text-xs uppercase tracking-wider truncate ${isActive ? 'font-black text-white' : 'font-extrabold text-slate-800 dark:text-slate-200'}`}>
                        {item.name}
                      </p>
                    </div>
                  )}

                  {isExpanded && (
                    <ChevronRight className={`w-4 h-4 shrink-0 transition ${isActive ? 'text-white' : 'text-slate-400 group-hover/tooltip:text-emerald-600 dark:group-hover/tooltip:text-emerald-400'}`} />
                  )}
                </button>

                {/* Collapsed Tooltip on Hover */}
                {!isExpanded && (
                  <div className="absolute left-16 top-1/2 -translate-y-1/2 z-50 bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xl border border-slate-700 whitespace-nowrap pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150">
                    {item.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Nursery Stock Badge */}
        {isExpanded && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[10px] text-emerald-800 dark:text-emerald-400 font-black flex items-center gap-2 rounded-br-2xl">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Nursery Stock Live Sync</span>
          </div>
        )}
      </aside>

      {/* 2. Mobile Floating 3-Line Category Menu Trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-6 left-4 z-40 p-3.5 rounded-full bg-emerald-700 dark:bg-emerald-600 text-white shadow-2xl border-2 border-white dark:border-slate-800 flex items-center justify-center cursor-pointer"
        title="Open Nursery Categories"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* 3. Mobile Slide-Out Category Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex">
          <div className="w-72 max-w-[85vw] bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-r border-slate-200 dark:border-slate-800">
            <div className="p-4 bg-emerald-700 dark:bg-slate-800 text-white flex justify-between items-center">
              <div className="flex items-center gap-2 font-black text-sm">
                <Leaf className="w-5 h-5 text-amber-300" />
                <span>Nursery Categories</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-white hover:text-amber-300 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {CATEGORY_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeCategory === item.categoryQuery;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectCategory(item.categoryQuery)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition cursor-pointer ${
                      isActive
                        ? 'bg-emerald-700 text-white font-black shadow'
                        : 'text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold">{item.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
};

export default SidebarNav;
