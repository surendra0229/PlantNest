import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Contact = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please complete all required fields.');
      return;
    }
    setSubmitted(true);
    toast.success('Thank you! Your message has been sent to our plant experts.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-slate-50 text-slate-800">

      {/* Header Banner */}
      <div className="bg-white p-8 lg:p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-xl">
        <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-200">
          PlantNest Helpdesk & Sanctuary Support
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900">
          Contact Our Botanical Experts
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed font-medium">
          Have questions about plant care, order tracking, bulk nursery purchases, or custom balcony styling? We are here to help!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Call Support</h3>
            <p className="text-xs text-slate-600 font-medium">+91 96520 77964</p>
            <p className="text-[11px] text-emerald-700 font-extrabold">Mon - Sat: 9:00 AM - 7:00 PM IST</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Email Support</h3>
            <p className="text-xs text-slate-600 font-medium">surendrachennamalli177@gmail.com</p>
            <p className="text-[11px] text-emerald-700 font-extrabold">Response within 24 hours</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Nursery Location</h3>
            <p className="text-xs text-slate-600 font-medium">
              PlantNest Botanical Nursery & Research Park,<br />
              Gorripudi, Kakinada, East Godavari, Andhra Pradesh - 533004
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Message Sent Successfully!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">
                Thank you for contacting PlantNest. One of our botanist specialists will get back to your email address shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition shadow"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-700" />
                Send Us a Message
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-extrabold block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl py-2.5 px-3 focus:outline-none focus:border-emerald-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-extrabold block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="Your Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl py-2.5 px-3 focus:outline-none focus:border-emerald-600 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-extrabold block mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Plant Care Inquiry / Bulk Order Inquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl py-2.5 px-3 focus:outline-none focus:border-emerald-600 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-700 font-extrabold block mb-1">Message *</label>
                <textarea
                  rows="5"
                  required
                  placeholder="Describe your plant inquiry or care question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl py-2.5 px-3 focus:outline-none focus:border-emerald-600 font-semibold"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition"
              >
                <Send className="w-4 h-4" />
                Submit Inquiry
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};

export default Contact;
