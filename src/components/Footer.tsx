import { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, ShieldCheck, ArrowUpRight, CheckCircle, Loader2, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { PageType } from '../types';
import { supabase } from '../lib/supabase';
import { broadcastChange } from '../utils/realtimeHelper';

interface FooterProps {
  setCurrentPage: (page: PageType) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitting(true);
      setErrorMsg(null);
      try {
        const payload = { email: email.trim() };
        const { error } = await supabase
          .from('newsletter_subscribers')
          .insert([payload]);
        
        if (error && error.code !== '23505') { // Let 23505 unique violation slide as success gracefully
          throw error;
        }
        
        // Broadcast addition
        broadcastChange('newsletter_subscribers', 'INSERT', payload);

        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 6000);
      } catch (err: any) {
        console.error('Error subscribing:', err);
        setErrorMsg(err?.message || 'Subscription failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleLinkClick = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-[#DCE7FF] pt-20 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-[#DCE7FF]">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-6">
             <img
              src="/GTGC Logo.png?v=3"
              alt="Going Technologies Global Center"
              className="h-[70px] w-auto max-w-[280px] object-contain cursor-pointer transition-opacity duration-300 hover:opacity-90"
              onClick={() => handleLinkClick('home')}
              referrerPolicy="no-referrer"
            />
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Going Technologies is an India-based delivery partner serving global organizations. We help insurance agencies and enterprises worldwide improve operational efficiency, reduce back-office friction, and achieve scale through dedicated support teams.
            </p>
            {/* Certifications badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 bg-[#F8FAFF] border border-[#DCE7FF] px-2.5 py-1 rounded text-xs font-semibold text-[#081B8C]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SOC 2 Type II Certified</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-[#F8FAFF] border border-[#DCE7FF] px-2.5 py-1 rounded text-xs font-semibold text-[#081B8C]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>HIPAA Compliant</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900">Corporate</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Home', id: 'home' as PageType },
                { name: 'About Story', id: 'about' as PageType },
                { name: 'Business Tools', id: 'business-tools' as PageType },
                { name: 'Case Studies', id: 'case-studies' as PageType },
                { name: 'Career Board', id: 'careers' as PageType },
                { name: 'Contact & Locations', id: 'contact' as PageType }
              ].map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link.id)}
                    className="text-gray-500 hover:text-[#081B8C] transition-colors cursor-pointer flex items-center gap-1 group"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Solutions Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900">Expertise</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Insurance Operations', page: 'services' as PageType },
                { name: 'Business Process BPO', page: 'services' as PageType },
                { name: 'Digital Modernization', page: 'services' as PageType },
                { name: 'AI & Automation Solutions', page: 'services' as PageType },
                { name: 'Strategic Advisory', page: 'services' as PageType }
              ].map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link.page)}
                    className="text-gray-500 hover:text-[#081B8C] transition-colors cursor-pointer text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900">Stay Updated</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              Subscribe to the Going Technologies Executive Digest for quarterly insights on operational scale, automation trends, and insurance efficiency reports.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="executive@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg py-2.5 pl-3 pr-10 text-xs focus:outline-none focus:border-[#2F6DFF]"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#081B8C] hover:bg-[#2F6DFF] disabled:opacity-50 text-white px-2.5 rounded transition-colors flex items-center justify-center cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              {subscribed && (
                <div className="flex flex-col gap-1 text-emerald-600 text-[10px] font-bold bg-emerald-50 border border-emerald-100 rounded-lg p-2 md:p-2.5 animate-pulse mt-2">
                  <div className="flex items-start gap-1">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>Thank you. Your request has been received successfully. Our team will contact you shortly.</span>
                  </div>
                </div>
              )}
              {errorMsg && (
                <p className="text-red-500 text-[10px] font-semibold mt-1">{errorMsg}</p>
              )}
            </form>
          </div>

        </div>

        {/* Minimalist, Elegant Address & Security Status Ribbon */}
        <div className="py-8 my-8 border-t border-b border-[#DCE7FF]/50 relative overflow-hidden group">
          {/* Subtle gradient glow & tiny dots background */}
          <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-gradient-to-tr from-[#2F6DFF]/5 to-transparent blur-2xl rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-1 text-left">
              <span className="text-[9px] font-bold text-[#2F6DFF] uppercase tracking-widest font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Secure Hub • Visakhapatnam Center
              </span>
              <p className="text-sm font-bold text-[#081B8C] font-display">
                Going Technologies Global Center
              </p>
              <p className="text-xs text-gray-400">
                Andhra Pradesh 530041, India
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="text-left">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono block">Direct Dial</span>
                <a href="tel:7063830888" className="text-sm font-bold text-gray-700 hover:text-[#2F6DFF] transition-colors font-mono">
                  706-383-0888
                </a>
              </div>
              <div className="text-left">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono block">Enterprise Intake</span>
                <a href="mailto:connect@goingtechnologies.com" className="text-sm font-bold text-gray-700 hover:text-[#2F6DFF] transition-colors font-mono">
                  connect@goingtechnologies.com
                </a>
              </div>
              <div className="bg-[#2F6DFF]/5 border border-[#2F6DFF]/15 px-3 py-1.5 rounded-xl flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2F6DFF]" />
                <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">HIPAA & SOC 2 AUDITED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclosures */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span>© {new Date().getFullYear()} Going Technologies Global Center. All rights reserved.</span>
            <span className="hidden md:inline text-gray-300">•</span>
            <span>All corporate client data operations are protected under HIPAA & SOC 2 frameworks.</span>
          </div>
          <div className="flex space-x-6">
            <button onClick={() => handleLinkClick('privacy')} className="hover:text-[#081B8C] transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => handleLinkClick('terms')} className="hover:text-[#081B8C] transition-colors cursor-pointer">
              Terms & Conditions
            </button>
            <button onClick={() => handleLinkClick('admin')} className="hover:text-[#081B8C] transition-colors font-semibold flex items-center gap-1 cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F6DFF]" />
              <span>Admin Portal</span>
            </button>
            <button onClick={() => handleLinkClick('client-admin')} className="hover:text-[#081B8C] transition-colors font-semibold flex items-center gap-1 cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Client Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
