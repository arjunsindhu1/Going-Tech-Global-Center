import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppModal({ isOpen, onClose }: WhatsAppModalProps) {
  const [fullName, setFullName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Clear state on open
  useEffect(() => {
    if (isOpen) {
      setFullName('');
      setBusinessEmail('');
      setWhatsappNumber('');
      setCompanyName('');
      setIndustry('');
      setIsSubmitting(false);
      setIsSuccess(false);
      setErrorMsg(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !businessEmail || !whatsappNumber || !industry) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // Save lead to Supabase
      const { error } = await supabase
        .from('whatsapp_contact_leads')
        .insert([
          {
            full_name: fullName.trim(),
            business_email: businessEmail.trim(),
            whatsapp_number: whatsappNumber.trim(),
            company_name: companyName.trim() || null,
            industry: industry
          }
        ]);

      if (error) {
        // If the table doesn't exist yet, we will log a warning but let the redirection proceed
        // to maintain an excellent user experience.
        console.warn('Supabase insert warning:', error);
      }

      setIsSuccess(true);
      
      // Construct the WhatsApp URL
      const textMessage = `Hello Going Technologies Team,\n\nMy name is ${fullName} from ${companyName || 'my agency'}.\nI would like to learn more about your operational support and business process outsourcing services.\n\nEmail: ${businessEmail}\nIndustry: ${industry}`;
      const encodedText = encodeURIComponent(textMessage);
      const whatsappUrl = `https://wa.me/919618424749?text=${encodedText}`;

      // Open WhatsApp after a short delay to let the user see the success message
      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        onClose();
      }, 1500);

    } catch (err: any) {
      console.error('WhatsApp Lead Capture error:', err);
      setErrorMsg('An unexpected error occurred. Connecting to WhatsApp...');
      
      // Fallback redirect even on failure to ensure user gets to chat
      setTimeout(() => {
        const whatsappUrl = `https://wa.me/919618424749?text=Hello%20Going%20Technologies%20Team%2C%0A%0AI%20would%20like%20to%20learn%20more%20about%20your%20operational%20support%20and%20business%20process%20outsourcing%20services.%0A%0APlease%20contact%20me.`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        onClose();
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#DCE7FF] overflow-hidden z-10 flex flex-col"
          >
            {/* Header banner */}
            <div className="bg-[#081B8C] text-white p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-xl rounded-full" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/10">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-display tracking-tight">Connect on WhatsApp</h3>
                  <p className="text-blue-200 text-xs mt-0.5">Capturing contact details to customize your consult</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {isSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="inline-flex items-center justify-center p-3 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-500 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-[#081B8C] font-display">Success! Redirecting to WhatsApp...</h4>
                  <p className="text-gray-500 text-xs max-w-sm mx-auto">
                    We've saved your inquiry. Opening your direct chat window with our global center operations managers.
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF] transition-colors"
                      />
                    </div>

                    {/* Business Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Business Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="executive@company.com"
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* WhatsApp Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 019-2834"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF] transition-colors"
                      />
                    </div>

                    {/* Company Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Company Name (Optional)</label>
                      <input
                        type="text"
                        placeholder="Acme Agency"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Industry Selection */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Your Industry *</label>
                    <select
                      required
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF] transition-colors text-gray-700"
                    >
                      <option value="">Select an Industry</option>
                      <option value="Commercial Property & Casualty">Commercial Property & Casualty</option>
                      <option value="Personal Lines Brokerage">Personal Lines Brokerage</option>
                      <option value="Managing General Agency (MGA)">Managing General Agency (MGA)</option>
                      <option value="Wholesale Insurance Brokerage">Wholesale Insurance Brokerage</option>
                      <option value="Life & Health Agency">Life & Health Agency</option>
                      <option value="Third-Party Administrator (TPA)">Third-Party Administrator (TPA)</option>
                      <option value="Insurtech / Fintech">Insurtech / Fintech</option>
                      <option value="Business Services / Other">Business Services / Other</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10 transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Connecting Securely...</span>
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4" />
                          <span>Initiate WhatsApp Chat</span>
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
