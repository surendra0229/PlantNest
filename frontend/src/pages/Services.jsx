import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Truck, Bot, ShieldCheck, Building2, Trees, CheckCircle2, ArrowRight } from 'lucide-react';

const Services = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 bg-slate-50 text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white p-8 lg:p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-xl">
        <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-200">
          Botanical Excellence & Care
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900">
          PlantNest Nursery Services
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
          From residential indoor plant styling to commercial landscape maintenance and 24/7 AI Botanist support, we ensure your green companions thrive.
        </p>
      </div>

      {/* Grid of Core Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Service 1 */}
        <div className="bg-white p-8 rounded-3xl space-y-4 border border-slate-200 hover:border-emerald-500 transition duration-300 shadow-sm hover:shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Leaf className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-900">100% Organic Nursery Cultivation</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            All our flora are grown organically in nutrient-dense compost without harmful chemical pesticides, ensuring pet-friendly, healthy house plants.
          </p>
          <ul className="space-y-2 text-xs text-emerald-800 font-bold pt-2">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Organic Soil Blends</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Natural Pest Management</li>
          </ul>
        </div>

        {/* Service 2 */}
        <div className="bg-white p-8 rounded-3xl space-y-4 border border-slate-200 hover:border-emerald-500 transition duration-300 shadow-sm hover:shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Truck className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Safe Climate Packaging & Transit</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Custom engineered eco-boxes stabilize soil moisture and root structures during transit, ensuring zero damage delivery to your doorstep.
          </p>
          <ul className="space-y-2 text-xs text-emerald-800 font-bold pt-2">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Shock-Absorbing Eco-Boxes</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Live Tracking Updates</li>
          </ul>
        </div>

        {/* Service 3 */}
        <div className="bg-white p-8 rounded-3xl space-y-4 border border-slate-200 hover:border-emerald-500 transition duration-300 shadow-sm hover:shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Bot className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-900">24/7 AI Botanist Care Assistant</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Query our real-time MongoDB RAG chatbot widget anytime for watering frequency, sunlight levels, repotting advice, and soil tips.
          </p>
          <ul className="space-y-2 text-xs text-emerald-800 font-bold pt-2">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant Inventory Guidance</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Custom Care Schedules</li>
          </ul>
        </div>

        {/* Service 4 */}
        <div className="bg-white p-8 rounded-3xl space-y-4 border border-slate-200 hover:border-emerald-500 transition duration-300 shadow-sm hover:shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Corporate & Office Landscaping</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Transform workspace air quality and aesthetics with customized corporate air-purifying plant installations and monthly nursery care.
          </p>
          <ul className="space-y-2 text-xs text-emerald-800 font-bold pt-2">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Air-Purifying Plant Layouts</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Scheduled Botanical Care</li>
          </ul>
        </div>

        {/* Service 5 */}
        <div className="bg-white p-8 rounded-3xl space-y-4 border border-slate-200 hover:border-emerald-500 transition duration-300 shadow-sm hover:shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Trees className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Balcony & Garden Consultation</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Our expert horticulturalists assist in choosing flowering plants, succulents, and bonsai suitable for your balcony's sunlight exposure.
          </p>
          <ul className="space-y-2 text-xs text-emerald-800 font-bold pt-2">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sunlight & Space Analysis</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Custom Planter Matching</li>
          </ul>
        </div>

        {/* Service 6 */}
        <div className="bg-white p-8 rounded-3xl space-y-4 border border-slate-200 hover:border-emerald-500 transition duration-300 shadow-sm hover:shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-900">30-Day Guaranteed Health Support</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Every plant comes with a 30-day health guarantee. If your plant shows signs of stress, our botanists diagnose and send replacement soil or guidance.
          </p>
          <ul className="space-y-2 text-xs text-emerald-800 font-bold pt-2">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Expert Botanical Diagnosis</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Guaranteed Replacement Support</li>
          </ul>
        </div>

      </div>

      {/* CTA Banner */}
      <div className="bg-white p-8 lg:p-12 rounded-3xl border border-slate-200 text-center space-y-6 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Ready to Greenify Your Living Space?</h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-medium">
          Explore our nursery catalog or contact our botanist support team for custom recommendations.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/shop"
            className="px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md flex items-center gap-2"
          >
            Explore Plant Shop <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Services;
