import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { plantService, getBackendUrl } from '../../services/api';
import { ChevronLeft, ChevronRight, Sparkles, Tag, ArrowRight, Sun, ShieldCheck } from 'lucide-react';

const FALLBACK_PLANTS = [
  {
    _id: 'fb-1',
    name: 'Fiddle Leaf Fig Tree',
    category: 'Indoor Trees',
    price: 1499,
    finalPrice: 1299,
    discount: 13,
    sunlight: 'Bright Indirect Light',
    images: ['https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1000&auto=format&fit=crop'],
    description: 'Stunning architectural indoor tree with large, glossy, fiddle-shaped leaves.'
  },
  {
    _id: 'fb-2',
    name: 'Japanese Ficus Bonsai Tree',
    category: 'Bonsai Collection',
    price: 2499,
    finalPrice: 1999,
    discount: 20,
    sunlight: 'Indirect Sunlight',
    images: ['https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1000&auto=format&fit=crop'],
    description: 'Hand-sculpted miniature bonsai with twisting trunk and delicate lush canopy.'
  },
  {
    _id: 'fb-3',
    name: 'Monstera Deliciosa',
    category: 'Tropical Flora',
    price: 999,
    finalPrice: 799,
    discount: 20,
    sunlight: 'Partial Shade',
    images: ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=1000&auto=format&fit=crop'],
    description: 'Iconic split-leaf tropical plant that purifies air and elevates modern interior spaces.'
  },
  {
    _id: 'fb-4',
    name: 'Mediterranean Olive Tree',
    category: 'Exotic Trees',
    price: 3299,
    finalPrice: 2899,
    discount: 12,
    sunlight: 'Full Sunlight',
    images: ['https://images.unsplash.com/photo-1509423350716-97f9360b4e09?q=80&w=1000&auto=format&fit=crop'],
    description: 'Silvery-green foliage bringing timeless Mediterranean luxury to your patio.'
  }
];

const PlantCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch real plants from API, fallback to fallback array
  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const res = await plantService.getPlants({ limit: 20 });
        if (isMounted && res && res.success && Array.isArray(res.plants) && res.plants.length > 0) {
          // Filter plants with valid image URLs
          const validPlants = res.plants.filter((p) => {
            const hasImg = p.images && p.images.length > 0 && Boolean(p.images[0]);
            return hasImg && (p.stock === undefined || p.stock > 0);
          });

          if (validPlants.length > 0) {
            setSlides(validPlants);
          } else {
            setSlides(FALLBACK_PLANTS);
          }
        } else {
          if (isMounted) setSlides(FALLBACK_PLANTS);
        }
      } catch (err) {
        console.warn('Carousel API load warning:', err.message);
        if (isMounted) setSlides(FALLBACK_PLANTS);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCatalog();
    return () => { isMounted = false; };
  }, []);

  // Auto-slide effect every 3.5 seconds when not hovered
  useEffect(() => {
    if (slides.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [slides.length, isHovered]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[currentIndex] || slides[0] || FALLBACK_PLANTS[0];

  const getImageUrl = (item) => {
    if (!item) return FALLBACK_PLANTS[0].images[0];
    const rawUrl = (item.images && item.images[0]) || item.image || item.avatar || '';
    if (!rawUrl) return FALLBACK_PLANTS[0].images[0];
    if (rawUrl.startsWith('http') || rawUrl.startsWith('//') || rawUrl.startsWith('data:')) {
      return rawUrl;
    }
    return `${getBackendUrl()}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
  };

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Aspect Container */}
      <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] w-full overflow-hidden">
        
        {/* Slide Images Container */}
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          const imgUrl = getImageUrl(slide);

          return (
            <div
              key={slide._id || idx}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
                isActive
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-105 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image */}
              <img
                src={imgUrl}
                alt={slide.name}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_PLANTS[0].images[0];
                }}
              />

              {/* Gradient Dark Overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20" />

              {/* Slide Content Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 z-20 flex flex-col justify-end text-white space-y-3">
                
                {/* Category & Badge */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/90 text-white shadow-md backdrop-blur-md">
                    🌿 {slide.category || 'Nursery Specimen'}
                  </span>
                  {slide.sunlight && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-amber-300 border border-slate-700/80 backdrop-blur-md flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      {slide.sunlight}
                    </span>
                  )}
                  {slide.discount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-500 text-white shadow-sm flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Save {slide.discount}%
                    </span>
                  )}
                </div>

                {/* Plant Name & Description */}
                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-md">
                    {slide.name}
                  </h3>
                  {slide.description && (
                    <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-xl mt-1 font-medium text-shadow">
                      {slide.description}
                    </p>
                  )}
                </div>

                {/* Price & Action Button */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/15">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                      ₹{slide.finalPrice || slide.price}
                    </span>
                    {slide.discount > 0 && (
                      <span className="text-sm font-semibold text-slate-400 line-through font-mono">
                        ₹{slide.price}
                      </span>
                    )}
                  </div>

                  <Link
                    to="/login"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/40 flex items-center gap-2 transition transform hover:scale-105 active:scale-95"
                  >
                    <span>Order Now</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </Link>
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* Manual Control Arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/60 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 transition opacity-80 hover:opacity-100 hover:scale-110 shadow-lg cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/60 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 transition opacity-80 hover:opacity-100 hover:scale-110 shadow-lg cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Navigation Indicators / Dots */}
      {slides.length > 1 && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 h-2 bg-emerald-400 shadow-md'
                  : 'w-2 h-2 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}

      {/* Pause on Hover Indicator */}
      {isHovered && (
        <div className="absolute top-4 left-4 z-30 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold border border-amber-400/30 flex items-center gap-1 animate-pulse">
          <Sparkles className="w-3 h-3 text-amber-400" /> Auto-Slide Paused (Hovered)
        </div>
      )}
    </div>
  );
};

export default PlantCarousel;
