import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronUp, ShieldCheck, Mail, Calendar, Sparkles, Phone, Clock, User, Building, MessageSquare, Check } from 'lucide-react';

import { PageType } from './types';
import Header from './components/Header';
import Footer from './components/Footer';

// Page Views
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Industries from './pages/Industries';
import CaseStudies from './pages/CaseStudies';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Admin from './pages/Admin';
import { supabase } from './lib/supabase';

export default function App() {
  const [page, setPage] = useState<PageType>('home');
  const [activeServiceId, setActiveServiceId] = useState<string>('insurance-ops');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [showDiagnosticPanel, setShowDiagnosticPanel] = useState(false);

  // Slide-in modal form tab & fields
  const [panelTab, setPanelTab] = useState<'diagnostic' | 'callback'>('diagnostic');
  
  // Diagnostic form state
  const [diagName, setDiagName] = useState('');
  const [diagEmail, setDiagEmail] = useState('');
  const [diagPhone, setDiagPhone] = useState('');
  const [diagCompany, setDiagCompany] = useState('');
  const [diagNotes, setDiagNotes] = useState('');
  const [diagSubmitted, setDiagSubmitted] = useState(false);

  // Callback form state
  const [cbName, setCbName] = useState('');
  const [cbPhone, setCbPhone] = useState('');
  const [cbTime, setCbTime] = useState('Morning (9 AM - 12 PM EST)');
  const [cbSubmitted, setCbSubmitted] = useState(false);

  // Submit to diagnostic_requests
  const handleDiagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (diagName.trim() && diagEmail.trim()) {
      try {
        const { error } = await supabase
          .from('diagnostic_requests')
          .insert([{
            name: diagName.trim(),
            email: diagEmail.trim(),
            phone: diagPhone.trim(),
            company: diagCompany.trim(),
            notes: diagNotes.trim()
          }]);
        if (error) throw error;
        setDiagSubmitted(true);
        // Reset after success
        setTimeout(() => {
          setDiagSubmitted(false);
          setShowDiagnosticPanel(false);
          setDiagName('');
          setDiagEmail('');
          setDiagPhone('');
          setDiagCompany('');
          setDiagNotes('');
        }, 3000);
      } catch (err) {
        console.error('Error requesting diagnostic:', err);
      }
    }
  };

  // Submit to callback_requests
  const handleCbSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cbName.trim() && cbPhone.trim()) {
      try {
        const { error } = await supabase
          .from('callback_requests')
          .insert([{
            name: cbName.trim(),
            phone: cbPhone.trim(),
            preferred_time: cbTime
          }]);
        if (error) throw error;
        setCbSubmitted(true);
        // Reset after success
        setTimeout(() => {
          setCbSubmitted(false);
          setShowDiagnosticPanel(false);
          setCbName('');
          setCbPhone('');
        }, 3000);
      } catch (err) {
        console.error('Error requesting callback:', err);
      }
    }
  };

  // Sync hash to state for seamless SPA navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const parts = hash.split('/');
        const pagePart = parts[0] as PageType;
        const validPages: PageType[] = [
          'home',
          'about',
          'services',
          'industries',
          'case-studies',
          'blog',
          'contact',
          'careers',
          'privacy',
          'terms',
          'admin'
        ];
        if (validPages.includes(pagePart)) {
          setPage(pagePart);
          if (pagePart === 'services' && parts[1]) {
            setActiveServiceId(parts[1]);
          }
        }
      } else {
        setPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // initial check
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Monitor scroll height for "Scroll to Top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Exit intent popup (triggered when cursor leaves top of screen, once per session)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 20 && !sessionStorage.getItem('exitIntentTriggered')) {
        setShowExitIntent(true);
        sessionStorage.setItem('exitIntentTriggered', 'true');
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const setCurrentPage = (newPage: PageType) => {
    setPage(newPage);
    if (newPage === 'services') {
      window.location.hash = `services/${activeServiceId}`;
    } else {
      window.location.hash = newPage;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToService = (serviceId: string) => {
    setActiveServiceId(serviceId);
    setPage('services');
    window.location.hash = `services/${serviceId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActivePage = () => {
    switch (page) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} onNavigateToService={handleNavigateToService} />;
      case 'about':
        return <About setCurrentPage={setCurrentPage} />;
      case 'services':
        return (
          <Services
            setCurrentPage={setCurrentPage}
            activeServiceId={activeServiceId}
            setActiveServiceId={setActiveServiceId}
          />
        );
      case 'industries':
        return <Industries setCurrentPage={setCurrentPage} />;
      case 'case-studies':
        return <CaseStudies setCurrentPage={setCurrentPage} />;
      case 'blog':
        return <Blog setCurrentPage={setCurrentPage} />;
      case 'contact':
        return <Contact setCurrentPage={setCurrentPage} />;
      case 'careers':
        return <Careers setCurrentPage={setCurrentPage} />;
      case 'privacy':
        return <Privacy setCurrentPage={setCurrentPage} />;
      case 'terms':
        return <Terms setCurrentPage={setCurrentPage} />;
      case 'admin':
        return <Admin setCurrentPage={setCurrentPage} />;
      default:
        return <Home setCurrentPage={setCurrentPage} onNavigateToService={handleNavigateToService} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFF]">
      {/* Premium Glass Header */}
      <Header
        currentPage={page}
        setCurrentPage={setCurrentPage}
        onNavigateToService={handleNavigateToService}
      />

      {/* Main Transition Page Stage */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {renderActivePage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Corporate Footer */}
      <Footer setCurrentPage={setCurrentPage} />

      {/* CONVERSION OPTIMIZATION: Sticky floating callout (bottom right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* Floating WhatsApp Chat Button */}
        <a
          href="https://wa.me/919618424749?text=Hello%20Going%20Technologies%20Team%2C%0A%0AI%20would%20like%20to%20learn%20more%20about%20your%20operational%20support%20and%20business%20process%20outsourcing%20services.%0A%0APlease%20contact%20me."
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto cursor-pointer p-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center group relative border border-emerald-400/20 shadow-emerald-500/10"
          title="Chat with us on WhatsApp"
        >
          <MessageSquare className="w-5.5 h-5.5" />
          <span className="absolute right-full mr-3 bg-white text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Chat on WhatsApp (+91)
          </span>
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-emerald-500 animate-ping" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-emerald-500" />
        </a>

        {/* Scroll To Top (If scrolled) */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="pointer-events-auto cursor-pointer p-3 bg-white border border-[#DCE7FF] hover:border-[#2F6DFF] text-[#081B8C] hover:text-[#2F6DFF] rounded-full shadow-lg transition-all"
            title="Scroll back to top"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}

      </div>

      {/* CONVERSION OPTIMIZATION: Exit Intent Popup Modal */}
      <AnimatePresence>
        {showExitIntent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full border border-gray-100 shadow-2xl relative space-y-6 text-center"
            >
              {/* Close triggers */}
              <button
                onClick={() => setShowExitIntent(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-sm cursor-pointer"
              >
                ✕
              </button>

              <div className="w-12 h-12 bg-[#DCE7FF]/40 text-[#081B8C] rounded-full flex items-center justify-center mx-auto border border-[#DCE7FF]">
                <ShieldCheck className="w-6 h-6 text-[#2F6DFF]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-display text-[#081B8C]">Wait! Before You Leave...</h3>
                <p className="text-gray-500 text-xs leading-relaxed max-w-sm mx-auto">
                  Download our exclusive operational handbook: <strong>"The MGA & Agency Scale Playbook: Reclaiming Underwriter Capacity Overnight."</strong> Free immediate delivery.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowExitIntent(false);
                    setCurrentPage('contact');
                  }}
                  className="cursor-pointer w-full text-center bg-[#081B8C] hover:bg-[#2F6DFF] text-white text-xs font-bold py-3 rounded-xl transition-colors"
                >
                  Request Copy & Free Diagnostic
                </button>
                <button
                  onClick={() => setShowExitIntent(false)}
                  className="cursor-pointer text-gray-400 hover:text-gray-600 text-[11px] font-semibold"
                >
                  No thanks, let me close this
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
