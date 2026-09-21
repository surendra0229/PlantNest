import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PlantCarousel from '../components/common/PlantCarousel';
import { plantService, getBackendUrl } from '../services/api';
import {
  ArrowRight,
  Leaf,
  Sun,
  Droplets,
  ShieldCheck,
  Sparkles,
  UserPlus,
  LogIn,
  Truck,
  Bot,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Star,
  Tag,
  Eye,
  Award,
  Zap,
  Sprout,
  Heart
} from 'lucide-react';

const CATEGORY_PREVIEWS = [
  {
    name: 'Indoor Plants',
    query: 'Indoor Plants',
    icon: '🌿',
    tag: 'Nursery Fresh',
    desc: 'Air-purifying foliage for home & office sanctuaries',
    bg: 'from-emerald-900/40 to-teal-950/60'
  },
  {
    name: 'Outdoor Plants',
    query: 'Outdoor Plants',
    icon: '☀️',
    tag: 'Sun-Loving Flora',
    desc: 'Resilient patio shrubs, palms & garden greenery',
    bg: 'from-amber-950/40 to-emerald-950/60'
  },
  {
    name: 'Succulents & Cacti',
    query: 'Succulents & Cacti',
    icon: '🌵',
    tag: 'Low Maintenance',
    desc: 'Drought-tolerant architectural desk plants',
    bg: 'from-teal-950/40 to-slate-900/60'
  },
  {
    name: 'Flowering Plants',
    query: 'Flowering Plants',
    icon: '🌸',
    tag: 'Vibrant Blooms',
    desc: 'Fragrant colorful blossoms, jasmines & orchids',
    bg: 'from-rose-950/40 to-emerald-950/60'
  },
];

const BOTANICAL_CARE_GUIDES = [
  {
    icon: Leaf,
    title: 'Air Purifying Champions',
    desc: 'Snake Plants, Monstera & Peace Lilies proven to filter indoor air toxins.',
    badge: '100% Clean Air'
  },
  {
    icon: Sun,
    title: 'Low Light Tolerant',
    desc: 'ZZ Plants & Pothos that flourish beautifully in indirect sunlight or dark corners.',
    badge: 'Easy Care'
  },
  {
    icon: ShieldCheck,
    title: 'Pet-Friendly Varieties',
    desc: 'Non-toxic indoor greenery safe for playful cats and dogs.',
    badge: 'Safe for Pets'
  },
  {
    icon: Droplets,
    title: 'Drought Resilient',
    desc: 'Succulents and Cacti requiring watering only once every 2-3 weeks.',
    badge: 'Minimal Water'
  }
];

const CUSTOMER_REVIEWS = [
  {
    id: 1,
    name: 'Ananya Sharma',
    city: 'Bengaluru',
    rating: 5,
    comment: 'The Monstera Deliciosa arrived in perfect eco-packaging! The leaves were so lush and green. Truly nursery fresh!',
    plant: 'Monstera Deliciosa'
  },
  {
    id: 2,
    name: 'Rajesh Verma',
    city: 'Mumbai',
    rating: 5,
    comment: 'PlantNest delivered my Fiddle Leaf Fig tree in 3 days. The 24/7 AI Botanist gave me exact watering tips. Highly recommend!',
    plant: 'Fiddle Leaf Fig'
  },
  {
    id: 3,
    name: 'Pooja Hegde',
    city: 'Hyderabad',
    rating: 5,
    comment: 'Super fast delivery and 100% organic soil quality. The succulents look gorgeous on my work desk!',
    plant: 'Succulent Trio'
  }
];

// In-memory cache for instant 0ms load on back navigation
let landingPlantsCache = null;

const LandingPage = () => {
  const [featuredPlants, setFeaturedPlants] = useState(() => landingPlantsCache || []);
  const [loadingPlants, setLoadingPlants] = useState(!landingPlantsCache);
  const navigate = useNavigate();

  // Fetch real database plants instantly
  useEffect(() => {
    let isMounted = true;
    if (landingPlantsCache) {
      setFeaturedPlants(landingPlantsCache);
      setLoadingPlants(false);
      return;
    }

    const fetchRealPlants = async () => {
      try {
        const res = await plantService.getPlants({ limit: 8 });
        if (isMounted && res && res.success && Array.isArray(res.plants)) {
          landingPlantsCache = res.plants;
          setFeaturedPlants(res.plants);
        }
      } catch (err) {
        console.warn('Landing page real plants fetch warning:', err.message);
      } finally {
        if (isMounted) setLoadingPlants(false);
      }
    };

    fetchRealPlants();
    return () => { isMounted = false; };
  }, []);

  const getImageUrl = (plant) => {
    if (!plant) return '';
    const rawUrl = plant.images?.[0] || plant.image || '';
    if (!rawUrl) return 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1000&auto=format&fit=crop';
    if (rawUrl.startsWith('http') || rawUrl.startsWith('//') || rawUrl.startsWith('data:')) {
      return rawUrl;
    }
    return `${getBackendUrl()}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-16 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">

      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-emerald-100/70 dark:from-emerald-950/30 via-slate-50 dark:via-slate-950 to-slate-50 dark:to-slate-950">
        
        {/* Glow accent spots */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-emerald-500/15 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-500/15 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left Hero Headline & Actions */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-300 text-xs font-black shadow-sm">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>100% Organic Nursery &amp; Botanical Sanctuary</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Bring Fresh <br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
                  Living Nature
                </span> Into Your Space.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Discover master-nurtured indoor plants, rare succulents, flowering greenery, and hand-crafted bonsai trees. Delivered fresh from our nursery with guaranteed plant care support.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black text-xs shadow-xl shadow-emerald-700/20 flex items-center justify-center gap-3 transition transform hover:-translate-y-0.5"
                >
                  <LogIn className="w-4 h-4" />
                  Explore Plant Dashboard
                </Link>

                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:text-emerald-700 dark:hover:text-emerald-400 font-extrabold text-xs flex items-center justify-center gap-2 transition hover:border-emerald-600 shadow-sm"
                >
                  <UserPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Register Account
                </Link>
              </div>

              {/* Counter Stats Grid */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xs text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">100%</p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold uppercase tracking-wider">Organic Soil</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xs text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">99.8%</p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold uppercase tracking-wider">Safe Transit</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xs text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">24/7</p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold uppercase tracking-wider">AI Botanist</p>
                </div>
              </div>

            </div>

            {/* Right Hero Showcase Carousel */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                <PlantCarousel initialPlants={featuredPlants} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. REAL DATABASE PLANTS SHOWCASE GRID */}
      <section id="featured-plants" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Live Nursery Catalog
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
              Featured Botanical Flora
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
              Organically nurtured plants ready for express delivery to your doorstep.
            </p>
          </div>

          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs hover:bg-emerald-200 dark:hover:bg-emerald-900 transition self-start md:self-auto"
          >
            <span>View Full Nursery Catalog ({featuredPlants.length > 0 ? `${featuredPlants.length}+ Plants` : 'Live Stock'})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Real Plant Grid Cards */}
        {loadingPlants && featuredPlants.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredPlants.map((plant) => {
              const price = plant.finalPrice || plant.price;
              const imgUrl = getImageUrl(plant);
              const ratingScore = plant.ratings?.average || 4.8;
              const ratingCount = plant.ratings?.count || 32;

              return (
                <div
                  key={plant._id}
                  className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden flex flex-col justify-between border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-400 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  <div>
                    {/* Plant Photo */}
                    <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800 p-3">
                      <img
                        src={imgUrl}
                        alt={plant.name}
                        className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Category Badge */}
                      <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-white/95 dark:bg-slate-900/90 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-sm backdrop-blur-md">
                        {plant.plantType || plant.category}
                      </span>

                      {/* Discount Badge */}
                      {plant.discount > 0 && (
                        <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500 text-slate-900 shadow-md flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {plant.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                        <span className="truncate uppercase tracking-wider">{plant.category}</span>
                        <div className="flex items-center gap-1 bg-emerald-700 dark:bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                          <span>{ratingScore}</span>
                          <Star className="w-3 h-3 fill-white text-white" />
                        </div>
                      </div>

                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        {plant.name}
                      </h3>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate max-w-[85px]">{plant.sunlight || 'Indirect Light'}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="truncate max-w-[85px]">{plant.water || 'Weekly'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Price & Action */}
                  <div className="p-5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-baseline justify-between">
                      {plant.discount > 0 ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-black text-slate-900 dark:text-white">₹{price}</span>
                          <span className="text-xs text-slate-400 line-through">₹{plant.price}</span>
                        </div>
                      ) : (
                        <span className="text-base font-black text-slate-900 dark:text-white">₹{price}</span>
                      )}
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <Truck className="w-3 h-3" /> Free Transit
                      </span>
                    </div>

                    <Link
                      to="/login"
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-white" />
                      <span>Sign In to Buy Now</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* 3. Curated Collections Section */}
      <section id="products-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Curated Botanical Collections
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
              Explore Nursery Categories
            </h2>
          </div>
          <Link to="/login" className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 transition">
            Sign In to Access Entire Catalog <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_PREVIEWS.map((cat, idx) => (
            <div
              key={idx}
              className={`group rounded-3xl p-6 border border-slate-200 dark:border-slate-800 bg-gradient-to-b ${cat.bg} hover:border-emerald-500 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden`}
            >
              <div className="space-y-3 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-3xl font-bold shadow-md border border-slate-200 dark:border-slate-700">
                  {cat.icon}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                    {cat.tag}
                  </span>
                  <h3 className="font-black text-white text-lg mt-2">{cat.name}</h3>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed mt-1">{cat.desc}</p>
                </div>
              </div>

              <div className="relative z-10">
                <Link
                  to="/login"
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-emerald-600 text-white font-extrabold text-xs backdrop-blur-md border border-white/20 flex items-center justify-center gap-1.5 transition shadow"
                >
                  Explore Collection <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Interactive Care & Sanctuary Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 p-8 lg:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              Why Plant Enthusiasts Choose PlantNest
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white pt-1">
              Botanical Care & Sanctuary Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              We deliver living botanical art pieces nurtured for your office, balcony, and home sanctuary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BOTANICAL_CARE_GUIDES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 transition hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-300 dark:border-emerald-700">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-600 text-white inline-block">
                    {item.badge}
                  </span>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{item.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Customer Testimonials & Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Verified Plant Lover Reviews
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Loved by 50,000+ Green Enthusiasts
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div key={rev.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-black text-xs text-slate-900 dark:text-white">{rev.name}</p>
                  <p className="text-[10px] text-slate-500 font-semibold">{rev.city} • Verified Buyer</p>
                </div>
                <span className="text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full">
                  {rev.plant}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Contact & Inquiry Section */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 p-8 lg:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Contact &amp; Support
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Have Plant Questions? Talk to Our Botanists</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Reach out for corporate plant styling, balcony consultation, or nursery order inquiries.
            </p>
            <div className="space-y-3 pt-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
              <a href="tel:+919652077964" className="flex items-center gap-2 hover:text-emerald-700 dark:hover:text-emerald-400 transition">
                <Phone className="w-4 h-4 text-emerald-700 dark:text-emerald-400" /> +91 96520 77964
              </a>
              <a href="mailto:surendrachennamalli177@gmail.com" className="flex items-center gap-2 hover:text-emerald-700 dark:hover:text-emerald-400 transition">
                <Mail className="w-4 h-4 text-emerald-700 dark:text-emerald-400" /> surendrachennamalli177@gmail.com
              </a>
              <a
                href="https://maps.google.com/?q=Bengaluru,Karnataka,India"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
              >
                <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400" /> Bengaluru, Karnataka — 560038
              </a>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Quick Inquiry</h3>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2.5 px-3 focus:outline-none focus:border-emerald-600 font-medium"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2.5 px-3 focus:outline-none focus:border-emerald-600 font-medium"
            />
            <textarea
              rows="3"
              placeholder="How can we help your plant journey?"
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2.5 px-3 focus:outline-none focus:border-emerald-600 font-medium"
            ></textarea>
            <Link
              to="/login"
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow flex items-center justify-center gap-2"
            >
              Sign In to Send Inquiry <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
