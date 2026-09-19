import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { plantService } from '../services/api';
import PlantCard from '../components/plants/PlantCard';
import {
  ArrowRight,
  Leaf,
  Sun,
  Droplets,
  ShieldCheck,
  Sparkles,
  Award,
  Users,
  ChevronRight,
  Lock,
  UserPlus,
  LogIn,
  Truck,
  Bot,
  Heart,
  CheckCircle2,
  Tag,
  Star,
  ChevronLeft,
  Flame,
  Clock,
  Zap
} from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    badge: 'BOTANICAL SANCTUARY',
    title: 'Nursery Fresh Indoor Plants & Flora',
    subtitle: 'Discover organically cultivated houseplants, succulents, and flowering greenery.',
    buttonText: 'Explore Nursery Catalog',
    bgGradient: 'from-emerald-950 via-emerald-900 to-teal-950',
    borderColor: 'border-emerald-500/40',
    icon: '🌿',
    discountText: 'FRESH ARRIVALS'
  },
  {
    id: 2,
    badge: 'HAND-CRAFTED PLANTERS & POTS',
    title: 'Ceramic & Eco-Friendly Planters',
    subtitle: 'Upgrade your balcony, living room, and garden aesthetics with custom pots.',
    buttonText: 'Shop Decorative Pots',
    bgGradient: 'from-teal-950 via-emerald-900 to-emerald-950',
    borderColor: 'border-teal-500/40',
    icon: '🏺',
    discountText: 'PREMIUM QUALITY'
  },
  {
    id: 3,
    badge: '24/7 AI BOTANIST SUPPORT',
    title: 'Expert Care Advice & Real-Time Stock',
    subtitle: 'Ask our MongoDB RAG chatbot for watering frequency and light recommendations.',
    buttonText: 'Try AI Botanist',
    bgGradient: 'from-emerald-900 via-green-950 to-emerald-950',
    borderColor: 'border-green-500/40',
    icon: '🤖',
    discountText: 'AI POWERED'
  }
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeSlide, setActiveSlide] = useState(0);
  const [featuredPlants, setFeaturedPlants] = useState([]);
  const [trendingPlants, setTrendingPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto-advance banner carousel every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [plantData, catData] = await Promise.all([
          plantService.getPlants({ limit: 12 }),
          plantService.getCategories()
        ]);
        if (plantData.success) {
          setFeaturedPlants(plantData.plants.slice(0, 4));
          setTrendingPlants(plantData.plants);
        }
        if (catData.success) {
          setCategories(catData.categories);
        }
      } catch (err) {
        console.error('Error fetching home plant data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExploreClick = (e, path = '/shop') => {
    if (e) e.preventDefault();
    if (user) {
      navigate(path);
    } else {
      navigate('/login', {
        state: {
          from: { pathname: path },
          message: 'Please log in or register to explore our complete plant catalog.'
        }
      });
    }
  };

  const currentSlideData = HERO_SLIDES[activeSlide];

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Flipkart-Inspired Hero Banner Showcase (Carousel + Side Offer Banners) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Main Hero Slider (Takes 2 Columns on desktop) */}
          <div className="lg:col-span-2 relative rounded-3xl overflow-hidden glass-card border border-emerald-500/40 shadow-2xl min-h-[380px] sm:min-h-[420px] flex flex-col justify-between p-6 sm:p-10 transition-all duration-700">
            <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.bgGradient} opacity-95`} />
            
            {/* Slide Top Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-amber-500 text-black shadow-glow-emerald flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-black" />
                {currentSlideData.badge}
              </span>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                {currentSlideData.discountText}
              </span>
            </div>

            {/* Slide Main Content */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center my-4">
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  {currentSlideData.title}
                </h1>
                <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                  {currentSlideData.subtitle}
                </p>
                <button
                  onClick={(e) => handleExploreClick(e)}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs shadow-glow-emerald flex items-center gap-2 transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  {currentSlideData.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Slide Icon Showcase */}
              <div className="relative aspect-square max-w-[200px] mx-auto rounded-3xl overflow-hidden border border-emerald-500/40 shadow-2xl bg-emerald-900/60 flex items-center justify-center text-7xl">
                <span>{currentSlideData.icon}</span>
              </div>
            </div>

            {/* Slide Navigation Dots */}
            <div className="relative z-10 flex items-center justify-center gap-2 pt-2">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeSlide === idx ? 'w-8 bg-emerald-400' : 'w-2 bg-emerald-800/80 hover:bg-emerald-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Side Offer Banners */}
          <div className="flex flex-col gap-6 justify-between">
            
            {/* Promo Card 1 */}
            <div className="glass-card p-6 rounded-3xl border border-teal-500/40 bg-gradient-to-br from-teal-950 via-emerald-900 to-emerald-950 flex items-center justify-between gap-4 shadow-xl hover:border-teal-400 transition">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-300">
                  Featured Category
                </span>
                <h3 className="font-extrabold text-white text-base leading-tight">
                  Ceramic & Terracotta Planters
                </h3>
                <p className="text-xs text-emerald-300 font-bold">Nursery Crafted</p>
                <button
                  onClick={(e) => handleExploreClick(e, '/shop?category=Pots%20%26%20Planters')}
                  className="text-[11px] font-bold text-teal-400 hover:text-white flex items-center gap-1 transition pt-1"
                >
                  Explore Planters <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-teal-500/30 bg-teal-900/80 flex items-center justify-center text-4xl">
                <span>🏺</span>
              </div>
            </div>

            {/* Promo Card 2 */}
            <div className="glass-card p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950 flex items-center justify-between gap-4 shadow-xl hover:border-emerald-400 transition">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
                  Popular Sanctuary Pack
                </span>
                <h3 className="font-extrabold text-white text-base leading-tight">
                  Air-Purifying Plants Collection
                </h3>
                <p className="text-xs text-amber-400 font-bold">Guaranteed Fresh Air</p>
                <button
                  onClick={(e) => handleExploreClick(e, '/shop?category=Air-Purifying%20Plants')}
                  className="text-[11px] font-bold text-emerald-400 hover:text-white flex items-center gap-1 transition pt-1"
                >
                  View Collection <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-emerald-500/30 bg-emerald-900/80 flex items-center justify-center text-4xl">
                <span>🌿</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. Flipkart-Style "Suggested For You" / "Recommended for You" Horizontal Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card bg-[#081711]/90 rounded-3xl p-6 border border-emerald-500/30 shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl sm:text-2xl font-black text-white">Suggested For You</h2>
              </div>
              <p className="text-xs text-emerald-300/80 mt-1">
                Hand-picked botanical recommendations based on popular indoor nursery choices.
              </p>
            </div>

            <button
              onClick={(e) => handleExploreClick(e)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs flex items-center gap-2 shadow-glow-emerald"
            >
              Explore Entire Catalog <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Product Cards Row */}
          {user ? (
            loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-80 rounded-2xl bg-emerald-950/50 animate-pulse border border-emerald-900/40" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredPlants.map((plant) => (
                  <PlantCard key={plant._id} plant={plant} />
                ))}
              </div>
            )
          ) : (
            /* Unauthenticated Visitor Lock Banner */
            <div className="p-8 text-center bg-emerald-950/60 rounded-2xl border border-emerald-500/30 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 text-emerald-300 flex items-center justify-center mx-auto border border-emerald-500/40">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Unlock Live Recommended Botanical Inventory</h3>
              <p className="text-xs text-emerald-200/80 max-w-md mx-auto">
                Please log in or create an account to view real-time plant stock, member prices, and discount deals.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={(e) => handleExploreClick(e)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Log In to View
                </button>
                <Link
                  to="/register"
                  className="px-6 py-2.5 rounded-xl glass-card text-emerald-300 text-xs font-bold"
                >
                  Register Account
                </Link>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 3. Flipkart-Style "Trending Plants & Best Sellers" Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-emerald-900/60 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Nursery Favorites</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Trending Plants & Best Sellers</h2>
            </div>
            <button
              onClick={(e) => handleExploreClick(e)}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-2 md:mt-0 transition"
            >
              View All Best Sellers <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {user ? (
            loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div key={n} className="h-80 rounded-2xl bg-emerald-950/50 animate-pulse border border-emerald-900/40" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingPlants.map((plant) => (
                  <PlantCard key={plant._id} plant={plant} />
                ))}
              </div>
            )
          ) : (
            <div className="glass-card p-10 rounded-3xl text-center space-y-4 border border-emerald-500/30 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950">
              <h3 className="text-xl font-extrabold text-white">Full Botanical Catalog Access</h3>
              <p className="text-xs text-emerald-200/80 max-w-lg mx-auto">
                Sign in or register with your credentials to explore our full selection of indoor plants, flowering species, succulents, and bonsai trees.
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={(e) => handleExploreClick(e)}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-xs shadow-glow-emerald"
                >
                  Sign In / Register
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. PlantNest Services & Products Explanation Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 lg:p-12 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950 via-emerald-900/80 to-emerald-950 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Botanical Quality Assurance
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Why Choose PlantNest Nursery?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
              We specialize in master-nurtured house plants, eco-friendly pots, organic care kits, and intelligent AI botanist assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-900 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">100% Organic Cultivation</h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                Nurtured with natural organic compost and chemical-free soil for healthy living environments.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-900 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Safe Climate Transit</h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                Custom engineered protective packaging ensures your plant arrives hydrated and thriving.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-900 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">24/7 AI Botanist Care</h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                Query our RAG chatbot for instant watering schedules, sunlight requirements, and soil advice.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-900 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">30-Day Plant Guarantee</h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                If your plant struggles within 30 days, get direct diagnosis and replacement support from experts.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Contact & Nursery Support Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 rounded-3xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">Need Customized Office or Home Landscaping?</h3>
            <p className="text-xs sm:text-sm text-emerald-200/80">
              Speak with our senior plant horticulturists for custom indoor styling and balcony design.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-glow-emerald shrink-0 transition"
          >
            Contact Plant Experts
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
