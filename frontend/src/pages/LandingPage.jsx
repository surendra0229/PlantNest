import React from 'react';
import { Link } from 'react-router-dom';
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
  CheckCircle2
} from 'lucide-react';

const CATEGORY_PREVIEWS = [
  { name: 'Indoor Plants', icon: '🌿', count: 'Nursery Fresh' },
  { name: 'Outdoor & Balcony', icon: '☀️', count: 'Sun-Loving Flora' },
  { name: 'Succulents & Cacti', icon: '🌵', count: 'Low Maintenance' },
  { name: 'Flowering Plants', icon: '🌸', count: 'Vibrant Blooms' },
];

const LandingPage = () => {
  return (
    <div className="space-y-24 pb-16 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">

      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:py-24 bg-gradient-to-b from-emerald-50/60 dark:from-emerald-950/20 via-slate-50 dark:via-slate-950 to-slate-50 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>100% Organic Nursery & Botanical Sanctuary</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                Bring Fresh <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">Living Nature</span> Into Your Space.
              </h1>

              <p className="text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Discover master-nurtured indoor plants, rare succulents, flowering greenery, and hand-crafted bonsai trees. Delivered fresh to your home with guaranteed plant care support.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-3 transition transform hover:-translate-y-0.5"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In to Explore Dashboard
                </Link>

                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-emerald-700 font-bold text-sm flex items-center justify-center gap-2 transition hover:border-emerald-600 shadow-sm"
                >
                  <UserPlus className="w-4 h-4 text-emerald-600" />
                  Register Account
                </Link>
              </div>

              {/* Counter stats */}
              <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                <div>
                  <p className="text-3xl font-black text-slate-900">100%</p>
                  <p className="text-xs text-emerald-700 font-extrabold">Organically Nurtured</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900">99.8%</p>
                  <p className="text-xs text-emerald-700 font-extrabold">Safe Transit Rate</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900">24/7</p>
                  <p className="text-xs text-emerald-700 font-extrabold">AI Botanist Care</p>
                </div>
              </div>

            </div>

            {/* Hero Image Showcase */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-950 to-teal-950 p-8 border border-emerald-500/40 shadow-2xl animate-float flex flex-col justify-between text-white">
                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                      🌿 PlantNest Botanical Sanctuary
                    </span>
                    <h3 className="text-2xl font-black text-white pt-2">
                      Live Plant E-Commerce & AI Assistant
                    </h3>
                  </div>

                  <div className="text-center py-6 text-7xl">
                    🪴
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-900/80 border border-emerald-700 text-xs space-y-1">
                    <p className="font-extrabold text-emerald-300">Live Inventory Stream</p>
                    <p className="text-emerald-100/80 text-[11px]">Real-time database catalog directly from master nurseries across India.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Services Section */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700">Our Services</span>
          <h2 className="text-3xl font-black text-slate-900">Why Plant Enthusiasts Choose PlantNest</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            We deliver living botanical art pieces nurtured for your office, balcony, and home sanctuary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl space-y-3 border border-slate-200 hover:border-emerald-500 transition shadow-sm hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">100% Organic Cultivation</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Cultivated organically by botanical experts using nutrient-rich organic soil and natural sunlight.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl space-y-3 border border-slate-200 hover:border-emerald-500 transition shadow-sm hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Safe Express Transit</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Custom shock-absorbing eco-boxes ensure your plants arrive fresh, hydrated, and ready to thrive.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl space-y-3 border border-slate-200 hover:border-emerald-500 transition shadow-sm hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">24/7 AI Botanist Support</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Ask our real-time MongoDB RAG Chatbot for personalized watering schedules, light guidance, and soil tips.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl space-y-3 border border-slate-200 hover:border-emerald-500 transition shadow-sm hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">30-Day Health Guarantee</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              If your plant struggles within 30 days of arrival, our plant experts provide instant replacement guidance.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Products Preview Section */}
      <section id="products-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700">Curated Collections</span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">Explore Nursery Categories</h2>
          </div>
          <Link to="/login" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 mt-4 md:mt-0 transition">
            Sign In to Access Catalog <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_PREVIEWS.map((cat, idx) => (
            <div key={idx} className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition shadow-sm hover:shadow-xl p-6 flex flex-col justify-between space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-3xl font-bold border border-emerald-300 dark:border-emerald-700">
                {cat.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{cat.name}</h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">{cat.count}</p>
              </div>
              <Link
                to="/login"
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-700 hover:text-white text-slate-700 dark:text-slate-200 font-extrabold text-xs flex items-center justify-center gap-1 transition"
              >
                View Collection <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4. About Us Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                About PlantNest Nursery
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                Nurturing Life & Green Sanctuaries Since 2020.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                PlantNest was founded by passionate horticulturalists dedicated to making green living simple, accessible, and rewarding. Every plant in our nursery is organically nurtured in mineral-rich soil before shipping safely to your home.
              </p>
              <div className="pt-2 flex gap-3">
                <Link
                  to="/register"
                  className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> Join Community
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <p className="text-3xl font-black text-slate-900">50k+</p>
                <p className="text-xs text-emerald-700 font-bold">Plants Shipped</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <p className="text-3xl font-black text-slate-900">4.9 ★</p>
                <p className="text-xs text-emerald-700 font-bold">Customer Rating</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <p className="text-3xl font-black text-slate-900">100%</p>
                <p className="text-xs text-emerald-700 font-bold">Organic Grown</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <p className="text-3xl font-black text-slate-900">24/7</p>
                <p className="text-xs text-emerald-700 font-bold">AI Botanist Care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact Section */}
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
