import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calculator, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { saveLocalLead, generateFallbackId } from '../utils/localLeadsFallback';
import { broadcastChange } from '../utils/realtimeHelper';

interface BusinessToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
  toolName: string;
}

export default function BusinessToolsModal({ isOpen, onClose, onUnlock, toolName }: BusinessToolsModalProps) {
  const [agencyName, setAgencyName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [sector, setSector] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setAgencyName('');
      setBusinessEmail('');
      setSector('');
      setIsSubmitting(false);
      setIsSuccess(false);
      setErrorMsg(null);
    }
  }, [isOpen]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!agencyName.trim() || !businessEmail.trim() || !sector) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (!validateEmail(businessEmail)) {
      setErrorMsg('Please provide a valid business email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const leadData = {
      id: generateFallbackId(),
      agency_name: agencyName.trim(),
      company_email: businessEmail.trim(),
      business_email: businessEmail.trim(),
      sector: sector,
      business_sector: sector,
      tool_name: toolName,
      status: 'New Lead',
      source: 'Business Tools',
      created_at: new Date().toISOString()
    };

    // Save locally first
    saveLocalLead('business_tool_leads', leadData);

    // Broadcast the new lead in real-time
    broadcastChange('business_tool_leads', 'INSERT', leadData);

    try {
      // Save lead to Supabase in business_tool_leads
      const { business_email, business_sector, ...supabaseLeadData } = leadData;
      const { error } = await supabase
        .from('business_tool_leads')
        .insert([supabaseLeadData]);

      if (error) {
        console.warn('Supabase business_tool_leads insert warning:', error.message);
      }

      setIsSuccess(true);
      
      // Store in localStorage with 30-day timestamp
      localStorage.setItem('businessToolsLeadSubmitted', 'true');
      localStorage.setItem('businessToolsLeadSubmittedTime', Date.now().toString());
      // Store in sessionStorage as well
      sessionStorage.setItem('gt_business_tools_unlocked', 'true');

      // Short timeout to let the user see success, then close and unlock
      setTimeout(() => {
        onUnlock();
        onClose();
      }, 1200);

    } catch (err: any) {
      console.warn('Business Tool Lead Capture database bypass:', err);
      // Fallback unlock to ensure good UX if DB is temporarily unreachable
      setIsSuccess(true);
      localStorage.setItem('businessToolsLeadSubmitted', 'true');
      localStorage.setItem('businessToolsLeadSubmittedTime', Date.now().toString());
      sessionStorage.setItem('gt_business_tools_unlocked', 'true');
      setTimeout(() => {
        onUnlock();
        onClose();
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with premium blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Modal Box with Glassmorphic visual accents */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#DCE7FF] overflow-hidden z-10 flex flex-col"
          >
            {/* Header with deep branding color */}
            <div className="bg-[#081B8C] text-white p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-xl rounded-full pointer-events-none" />
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2.5 bg-[#2F6DFF] text-white rounded-xl shadow-lg">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-display tracking-tight">Unlock Free Business Tools</h3>
                  <p className="text-blue-200 text-xs mt-0.5 font-sans">Please provide a few business details to continue.</p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {isSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="inline-flex items-center justify-center p-3 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-500 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-[#081B8C] font-display">Tools Unlocked!</h4>
                  <p className="text-gray-500 text-xs max-w-xs mx-auto">
                    Loading your professional calculator and diagnostic reports now...
                  </p>
                </div>
              ) : (
                <>
                  {errorMsg && (
                    <div className="bg-red-50 border border-red-100 text-red-700 text-xs p-3.5 rounded-xl flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Agency / Company Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Agency / Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Acme Insurance Agency"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF] transition-colors"
                    />
                  </div>

                  {/* Business Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Business Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="principal@company.com"
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF] transition-colors"
                    />
                  </div>

                  {/* Business Sector Dropdown */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Business Sector *</label>
                    <select
                      required
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF] transition-colors text-gray-700"
                    >
                      <option value="">Select a Sector</option>
                      <option value="Property & Casualty Insurance">Property & Casualty Insurance</option>
                      <option value="Health Insurance">Health Insurance</option>
                      <option value="Life Insurance">Life Insurance</option>
                      <option value="Medicare">Medicare</option>
                      <option value="Insurance Brokerage">Insurance Brokerage</option>
                      <option value="MGA">MGA</option>
                      <option value="Insurance Carrier">Insurance Carrier</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-[#081B8C] hover:bg-[#2F6DFF] disabled:opacity-50 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#081B8C]/10 transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Unlocking Tools...</span>
                        </>
                      ) : (
                        <>
                          <span>Unlock Business Tools</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
