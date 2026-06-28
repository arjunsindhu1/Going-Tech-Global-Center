import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronUp, ShieldCheck, Mail, Calendar, Sparkles, Phone, Clock, User, Building, MessageSquare, Check, Download, AlertCircle, Loader2 } from 'lucide-react';

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
import { logDetailedError, getActualReason } from './utils/errorLogger';

export default function App() {
  const [page, setPage] = useState<PageType>('home');
  const [activeServiceId, setActiveServiceId] = useState<string>('insurance-ops');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(true);
  const [hasDownloaded, setHasDownloaded] = useState(false);
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

  // Lead Magnet Popup states
  const [popupEmail, setPopupEmail] = useState('');
  const [popupError, setPopupError] = useState('');
  const [popupLoading, setPopupLoading] = useState(false);
  const [popupSuccess, setPopupSuccess] = useState(false);

  const BLOCKED_DOMAINS = [
    'gmail.com', 'googlemail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
    'live.com', 'icloud.com', 'me.com', 'msn.com', 'aol.com', 'proton.me', 
    'protonmail.com', 'gmx.com', 'mail.com', 'zoho.com', 'yandex.com', 
    'rediffmail.com', 'fastmail.com', 'qq.com', '163.com', '126.com', 
    'hey.com', 'tutanota.com'
  ];

  const handleDownloadProposal = async (emailToSubmit: string, source: string) => {
    const totalStart = performance.now();

    // 1. Email validation
    const emailValStart = performance.now();
    if (!emailToSubmit || !emailToSubmit.includes('@')) {
      return { error: 'Please enter a valid email address.' };
    }
    const emailValTime = performance.now() - emailValStart;

    // 2. Corporate Domain Check
    const domainCheckStart = performance.now();
    const domain = emailToSubmit.trim().split('@').pop()?.toLowerCase();
    const isCorp = domain && !BLOCKED_DOMAINS.includes(domain);
    const domainCheckTime = performance.now() - domainCheckStart;

    if (!isCorp) {
      return { error: 'Please use your company email address to download this proposal.' };
    }

    let response: Response | null = null;
    let responseBody = '';
    let parsedData: any = null;
    const requestUrl = new URL('/api/proposal/download', window.location.href).href;

    try {
      try {
        response = await fetch('/api/proposal/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailToSubmit.trim(),
            source: source,
            page_url: window.location.href
          })
        });
      } catch (fetchErr: any) {
        // Network error / CORS block
        const isDev = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');
        const reason = getActualReason(fetchErr, requestUrl);
        
        logDetailedError({
          url: requestUrl,
          errorMessage: fetchErr.message || 'Fetch failed',
          errorCode: fetchErr.code || fetchErr.name,
          stack: fetchErr.stack
        });

        return { error: isDev ? reason : 'Connection failed. Please try again later.' };
      }

      // Read response body as text first to preserve it
      try {
        responseBody = await response.text();
      } catch (readErr) {
        console.error('Failed to read response body:', readErr);
      }

      // Try parsing as JSON
      if (responseBody) {
        try {
          parsedData = JSON.parse(responseBody);
        } catch (jsonErr) {
          console.warn('Response is not valid JSON:', responseBody);
        }
      }

      if (!response.ok) {
        const isDev = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');
        const errorMsg = parsedData?.error || responseBody || `HTTP ${response.status} ${response.statusText}`;
        const reason = getActualReason(new Error(errorMsg), requestUrl, response.status, responseBody);

        logDetailedError({
          url: requestUrl,
          status: response.status,
          responseBody: responseBody,
          errorMessage: errorMsg,
          errorCode: `HTTP_${response.status}`
        });

        return { error: isDev ? reason : 'Connection failed. Please try again later.' };
      }

      // If response is OK, process the data
      const data = parsedData || {};
      const databaseTime = data.timings?.databaseTime || 0;
      const signedUrlGenTime = data.timings?.tokenGenTime || 0;

      // Automatically trigger secure download
      if (data.token) {
        const downloadUrl = `/api/proposal/file?token=${data.token}`;
        const fullDownloadUrl = new URL(downloadUrl, window.location.href).href;
        
        try {
          console.log('[DEBUG] Initiating secure PDF fetch from:', downloadUrl);
          // 5. File Retrieval
          const fileRetrievalStart = performance.now();
          
          let fileRes: Response;
          try {
            fileRes = await fetch(downloadUrl);
          } catch (fileFetchErr: any) {
            const isDev = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');
            const reason = getActualReason(fileFetchErr, fullDownloadUrl);

            logDetailedError({
              url: fullDownloadUrl,
              errorMessage: fileFetchErr.message || 'Fetch failed',
              errorCode: fileFetchErr.code || fileFetchErr.name,
              stack: fileFetchErr.stack
            });

            throw new Error(isDev ? reason : 'Connection failed. Please try again later.');
          }

          let fileResBody = '';
          if (!fileRes.ok) {
            try {
              fileResBody = await fileRes.text();
            } catch (readErr) {
              console.error('Failed to read file response body:', readErr);
            }

            const isDev = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');
            const errorMsg = fileResBody || `HTTP ${fileRes.status} ${fileRes.statusText}`;
            const reason = getActualReason(new Error(errorMsg), fullDownloadUrl, fileRes.status, fileResBody);

            logDetailedError({
              url: fullDownloadUrl,
              status: fileRes.status,
              responseBody: fileResBody,
              errorMessage: errorMsg,
              errorCode: `HTTP_${fileRes.status}`
            });

            throw new Error(isDev ? reason : 'Connection failed. Please try again later.');
          }
          
          const contentType = fileRes.headers.get('content-type') || '';
          const contentLengthStr = fileRes.headers.get('content-length') || '0';
          const contentLength = parseInt(contentLengthStr, 10);
          
          const blob = await fileRes.blob();
          const fileRetrievalTime = performance.now() - fileRetrievalStart;
          
          console.log('[DEBUG] Blob size:', blob.size);
          console.log('[DEBUG] Blob type:', blob.type);
          
          if (blob.size === 0) {
            throw new Error('Downloaded file size is 0 bytes.');
          }
          
          // Verify MIME type
          if (!contentType.toLowerCase().includes('application/pdf')) {
            throw new Error(`Invalid MIME type: expected application/pdf, but got "${contentType}"`);
          }
          
          // 6. Browser download start (signature check + trigger)
          const downloadStartTimer = performance.now();
          
          // Read first 10 bytes to verify %PDF- signature
          const arrayBuffer = await blob.slice(0, 10).arrayBuffer();
          const bytes = new Uint8Array(arrayBuffer);
          const hexString = Array.from(bytes).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
          const signature = new TextDecoder().decode(bytes);
          
          console.log('[DEBUG] First 10 bytes (Hex):', hexString);
          console.log('[DEBUG] First 10 bytes (Text):', signature);
          
          const isPdf = signature.startsWith('%PDF-');
          if (!isPdf) {
            console.error('[DEBUG] Signature mismatch! Not a valid PDF.');
            throw new Error(`The file does not begin with the PDF signature %PDF-. Instead, got: "${signature.replace(/[\r\n\t]/g, ' ')}"`);
          }
          
          console.log('[DEBUG] PDF signature verified successfully!');
          
          const localUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = localUrl;
          link.setAttribute('download', data.filename || 'Going Technologies Insurance operations proposal.pdf');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(localUrl), 100);
          
          const downloadStartedTime = performance.now() - downloadStartTimer;
          const totalTime = performance.now() - totalStart;

          // Print highly visible, clean, and exact timing reports in developer console
          console.log(`%c=== PROPOSAL DOWNLOAD PERFORMANCE TIMINGS ===`, 'color: #10B981; font-weight: bold; font-size: 11px;');
          console.log(`Email Validation: ${emailValTime.toFixed(1)}ms`);
          console.log(`Corporate Domain Check: ${domainCheckTime.toFixed(1)}ms`);
          console.log(`Database Insert: ${databaseTime.toFixed(1)}ms`);
          console.log(`Signed URL Generation: ${signedUrlGenTime.toFixed(1)}ms`);
          console.log(`File Retrieval: ${fileRetrievalTime.toFixed(1)}ms`);
          console.log(`Download Started: ${downloadStartedTime.toFixed(1)}ms`);
          console.log(`Total Time: ${totalTime.toFixed(1)}ms`);
          console.log(`==============================================`);
        } catch (downloadErr: any) {
          console.error('[ERROR] Secure PDF download failed:', downloadErr);
          return { error: downloadErr.message || 'Failed to download the proposal PDF.' };
        }
      }

      return { success: true };
    } catch (err: any) {
      console.error('Download request error:', err);
      const isDev = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');
      const reason = getActualReason(err, requestUrl);
      
      logDetailedError({
        url: requestUrl,
        errorMessage: err.message || 'Connection failed',
        errorCode: err.code || err.name,
        stack: err.stack
      });

      return { error: isDev ? reason : 'Connection failed. Please try again later.' };
    }
  };


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

  // Ensure exit intent popup starts as active on reload/refresh
  useEffect(() => {
    setShowExitIntent(true);
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
        return (
          <Contact
            setCurrentPage={setCurrentPage}
            onDownloadSuccess={() => {
              setHasDownloaded(true);
              setShowExitIntent(false);
            }}
          />
        );
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
        {showExitIntent && !hasDownloaded && (
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
                className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-sm cursor-pointer p-1 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ✕
              </button>

              <div className="w-12 h-12 bg-[#DCE7FF]/40 text-[#081B8C] rounded-full flex items-center justify-center mx-auto border border-[#DCE7FF]">
                <ShieldCheck className="w-6 h-6 text-[#2F6DFF]" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#2F6DFF] block">Wait! Before You Leave...</span>
                <h3 className="text-xl font-bold font-display text-[#081B8C] leading-snug">
                  Download Our Insurance Operations Proposal
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed max-w-sm mx-auto">
                  Explore how Going Technologies helps insurance agencies streamline operations across Property & Casualty, Health Insurance, Life Insurance, and Medicare through secure, scalable outsourcing solutions.
                </p>
              </div>

              {popupSuccess ? (
                <div className="py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 animate-bounce">
                    <Check className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-900 text-base">Download Started!</h4>
                    <p className="text-gray-500 text-xs">
                      Your proposal has been compiled and is downloading.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowExitIntent(false);
                      setPopupSuccess(false);
                      setPopupEmail('');
                    }}
                    className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-6 py-2.5 rounded-xl transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setPopupError('');
                    setPopupLoading(true);
                    const res = await handleDownloadProposal(popupEmail, 'Popup');
                    setPopupLoading(false);
                    if (res.error) {
                      setPopupError(res.error);
                    } else {
                      setPopupSuccess(true);
                      setHasDownloaded(true);
                      // Auto-close popup after 1.5 seconds
                      setTimeout(() => {
                        setShowExitIntent(false);
                        setPopupSuccess(false);
                        setPopupEmail('');
                      }, 1500);
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-gray-700 block">
                      Corporate Email Address
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={popupEmail}
                        onChange={(e) => {
                          setPopupEmail(e.target.value);
                          if (popupError) setPopupError('');
                        }}
                        placeholder="name@company.com"
                        className="w-full text-xs pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-[#2F6DFF] focus:bg-white focus:outline-hidden rounded-xl transition-all font-medium text-gray-900 placeholder-gray-400"
                      />
                    </div>
                    {popupError && (
                      <div className="flex items-start gap-1.5 mt-2 text-rose-600 text-[11px] leading-relaxed bg-rose-50/50 border border-rose-100 rounded-xl p-2.5">
                        <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-rose-500" />
                        <span>{popupError}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <button
                      type="submit"
                      disabled={popupLoading}
                      className="cursor-pointer w-full bg-gradient-to-r from-[#081B8C] to-[#2F6DFF] hover:opacity-95 text-white text-xs font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {popupLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying Domain...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Download Proposal</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-gray-400 font-semibold text-center leading-normal">
                      Only business email addresses are accepted.
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
