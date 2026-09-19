import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-12 mt-20 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-3 rounded-lg bg-emerald-900/60 text-emerald-400 shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Nursery Fresh</h4>
              <p className="text-xs text-slate-400 mt-1">Hand-picked healthy plants nurtured by master botanists.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-3 rounded-lg bg-emerald-900/60 text-emerald-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Eco Express Delivery</h4>
              <p className="text-xs text-slate-400 mt-1">Free delivery on orders over $50 with eco-protective packaging.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-3 rounded-lg bg-emerald-900/60 text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">30-Day Plant Guarantee</h4>
              <p className="text-xs text-slate-400 mt-1">Free replacement or refund if your plant does not thrive.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-3 rounded-lg bg-emerald-900/60 text-emerald-400 shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">AI Plant Care Assistant</h4>
              <p className="text-xs text-slate-400 mt-1">Instant database-grounded care advice from our RAG chatbot.</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl p-1 bg-emerald-700 flex items-center justify-center shadow">
                <img src="/logo.png" alt="PlantNest Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-black text-white">PlantNest</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              PlantNest is your premier online botanical sanctuary. We bring fresh, vibrant house plants, outdoor foliage, succulents, and bonsai trees straight from our nursery to your home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link to="/dashboard" className="hover:text-white transition">User Dashboard</Link></li>
              <li><Link to="/shop" className="hover:text-white transition">Shop All Plants</Link></li>
              <li><Link to="/shop?category=Indoor+Plants" className="hover:text-white transition">Indoor Plants</Link></li>
              <li><Link to="/shop?category=Succulents" className="hover:text-white transition">Succulents & Cacti</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link to="/orders" className="hover:text-white transition">Track Your Order</Link></li>
              <li><Link to="/profile" className="hover:text-white transition">My Account & Addresses</Link></li>
              <li><Link to="/cart" className="hover:text-white transition">Shopping Cart</Link></li>
              <li><Link to="/admin/login" className="hover:text-white transition text-emerald-400">Admin Portal Login</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Nursery Location</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              📍 Green Sanctuary Road, Indiranagar, Bangalore - 560038<br />
              📞 Support: +1 (800) 555-PLANT<br />
              ✉️ Email: care@plantnest.com
            </p>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PlantNest Nursery Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 font-medium">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for plant lovers everywhere.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
