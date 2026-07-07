import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { saveLocalLead, generateFallbackId } from '../utils/localLeadsFallback';
import { broadcastChange } from '../utils/realtimeHelper';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppModal({ isOpen, onClose }: WhatsAppModalProps) {
  const [fullName, setFullName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Clear state on open
  useEffect(() => {
    if (isOpen) {
      setFullName('');
      setBusinessEmail('');
      setIsSubmitting(false);
      setIsSuccess(false);
      setErrorMsg(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !businessEmail.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const leadData = {
      id: generateFallbackId(),
      full_name: fullName.trim(),
      email: businessEmail.trim(),
      status: 'New Lead',
      source: 'WhatsApp',
      created_at: new Date().toISOString()
    };

    // Save locally first so it is immediately recorded regardless of database table existence
    saveLocalLead('whatsapp_contact_leads', leadData);

    // Broadcast the new lead in real-time
    broadcastChange('whatsapp_contact_leads', 'INSERT', leadData);

    try {
      // Save lead to Supabase
      const { error } = await supabase
        .from('whatsapp_contact_leads')
        .insert([leadData]);

      if (error) {
        console.warn('Supabase whatsapp_contact_leads insert warning:', error.message);
      }

      setIsSuccess(true);
      
      // Construct the WhatsApp URL
      const textMessage = `Hello Going Technologies Team,\n\nMy name is ${fullName.trim()}.\nI would like to learn more about your operational support and business process outsourcing services.\n\nEmail: ${businessEmail.trim()}`;
      const encodedText = encodeURIComponent(textMessage);
      const whatsappUrl = `https://wa.me/919618424749?text=${encodedText}`;

      // Open WhatsApp after a short delay to let the user see the success message
      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        onClose();
      }, 1200);

    } catch (err: any) {
      console.warn('WhatsApp Lead Capture database bypass:', err);
      // Fallback redirect even on failure to ensure user gets to chat
      setIsSuccess(true);
      setTimeout(() => {
        const whatsappUrl = `https://wa.me/919618424749?text=Hello%20Going%20Technologies%20Team%2C%0A%0AI%20would%20like%20to%20learn%20more%20about%20your%20operational%20support%20and%20business%20process%20outsourcing%20services.%0A%0APlease%20contact%20me.`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
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
          {/* Backdrop with elegant blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Modal Box with Glassmorphism Border */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-10 flex flex-col"
          >
            {/* Header banner */}
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
                <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/10">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-display tracking-tight">Start Your Free Consultation</h3>
                  <p className="text-blue-200 text-xs mt-0.5">Please provide your details before chatting with our team.</p>
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
                    We're launching your direct chat window with our global center operations managers.
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

                  <div className="space-y-4">
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
