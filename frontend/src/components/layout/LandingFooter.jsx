import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const LandingFooter = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl p-1 bg-emerald-700 flex items-center justify-center shadow">
                <img src="/logo.png" alt="PlantNest Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-black text-white">PlantNest</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Master-nurtured organic plants, rare succulents, flowering flora, and eco-friendly planters delivered fresh to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">Quick Links</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#services" className="hover:text-white transition">Nursery Services</a></li>
              <li><a href="#products-preview" className="hover:text-white transition">Product Collections</a></li>
              <li><a href="#about" className="hover:text-white transition">About Our Botanical Sanctuary</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact Botanists</a></li>
            </ul>
          </div>

          {/* Customer Auth */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">Account Access</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link to="/login" className="hover:text-white transition">Member Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Register Account</Link></li>
              <li><Link to="/admin/login" className="hover:text-white transition">Nursery Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">Get in Touch</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-emerald-400" /> +91 96520 77964</p>
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-emerald-400" /> surendrachennamalli177@gmail.com</p>
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> Gorripudi, Kakinada, East Godavari, Andhra Pradesh - 533004</p>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} PlantNest Botanical Nursery. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] font-medium">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>30-Day Guarantee</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default LandingFooter;
