import { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, ShieldCheck, ArrowUpRight, CheckCircle, Loader2 } from 'lucide-react';
import { PageType } from '../types';
import { supabase } from '../lib/supabase';

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
        const { error } = await supabase
          .from('newsletter_subscribers')
          .insert([{ email: email.trim() }]);
        
        if (error && error.code !== '23505') { // Let 23505 unique violation slide as success gracefully
          throw error;
        }
        
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
              src="/logo-footer.png"
              alt="Going Technologies Global Center"
              className="h-[80px] w-auto object-contain cursor-pointer transition-opacity duration-300 hover:opacity-90 [image-rendering:auto]"
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
                { name: 'Our Focus Industries', page: 'industries' as PageType },
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

        {/* Global Offices Strip */}
        <div className="grid grid-cols-1 gap-8 py-10 text-xs text-gray-400 border-b border-[#DCE7FF]/60">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#2F6DFF] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-600">Going Technologies Global Center</p>
              <p className="mt-0.5">Visakhapatnam, Andhra Pradesh 530041, India</p>
              <p className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-[11px]">
                <span>Phone: 706-383-0888</span>
                <span>Email: <a href="mailto:connect@goingtechnologies.com" className="text-[#2F6DFF] hover:underline">connect@goingtechnologies.com</a></span>
              </p>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
