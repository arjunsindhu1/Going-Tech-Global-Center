import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Users,
  Loader2,
  Download,
  AlertCircle
} from 'lucide-react';
import { PageType } from '../types';
import { OFFICE_LOCATIONS } from '../data';
import { supabase } from '../lib/supabase';
import { logDetailedError, getActualReason } from '../utils/errorLogger';
import { downloadProposal } from '../utils/proposalDownloader';

interface ContactProps {
  setCurrentPage: (page: PageType) => void;
  onDownloadSuccess?: () => void;
}

export default function Contact({ setCurrentPage, onDownloadSuccess }: ContactProps) {
  // Lead Form multi-step state
  const [formStep, setFormStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [companyType, setCompanyType] = useState('Insurance Agency');
  const [premiumVolume, setPremiumVolume] = useState('$5M - $20M');
  const [selectedBottlenecks, setSelectedBottlenecks] = useState<string[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Mock Calendly scheduling state
  const [selectedDay, setSelectedDay] = useState<string | null>('Monday, June 29');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>('10:00 AM EST');
  const [meetingScheduled, setMeetingScheduled] = useState(false);

  // Consultation booking fields
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingCompany, setBookingCompany] = useState('');
  const [bookingService, setBookingService] = useState('Insurance Operations');
  const [bookingNotes, setBookingNotes] = useState('');

  // Callback form fields
  const [cbName, setCbName] = useState('');
  const [cbPhone, setCbPhone] = useState('');
  const [cbTime, setCbTime] = useState('Morning (9 AM - 12 PM EST)');
  const [cbSubmitted, setCbSubmitted] = useState(false);

  // Diagnostic form fields
  const [diagName, setDiagName] = useState('');
  const [diagEmail, setDiagEmail] = useState('');
  const [diagPhone, setDiagPhone] = useState('');
  const [diagCompany, setDiagCompany] = useState('');
  const [diagNotes, setDiagNotes] = useState('');
  const [diagSubmitted, setDiagSubmitted] = useState(false);

  // Submission loading states
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [isSubmittingMeeting, setIsSubmittingMeeting] = useState(false);
  const [isSubmittingCb, setIsSubmittingCb] = useState(false);
  const [isSubmittingDiag, setIsSubmittingDiag] = useState(false);

  // Submission error states
  const [leadError, setLeadError] = useState<string | null>(null);
  const [meetingError, setMeetingError] = useState<string | null>(null);
  const [cbError, setCbError] = useState<string | null>(null);
  const [diagError, setDiagError] = useState<string | null>(null);

  // Proposal Download Lead Magnet states
  const [downloadEmail, setDownloadEmail] = useState('');
  const [downloadError, setDownloadError] = useState('');
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadProposal = async (e: FormEvent) => {
    e.preventDefault();
    setDownloadError('');
    setDownloadLoading(true);

    const res = await downloadProposal(downloadEmail, 'Contact Page', window.location.href);
    setDownloadLoading(false);

    if (res.error) {
      setDownloadError(res.error);
    } else {
      setDownloadSuccess(true);
      onDownloadSuccess?.();
      
      // Reset after success
      setTimeout(() => {
        setDownloadSuccess(false);
        setDownloadEmail('');
      }, 5000);
    }
  };

  const availableDays = [
    'Monday, June 29',
    'Tuesday, June 30',
    'Wednesday, July 1',
    'Thursday, July 2',
    'Friday, July 3'
  ];

  const timeSlots = [
    '9:00 AM EST',
    '10:30 AM EST',
    '1:00 PM EST',
    '2:30 PM EST',
    '4:00 PM EST'
  ];

  const bottlenecksOptions = [
    'Renewal indicate backlogs',
    'Certificate of Insurance delays',
    'Underwriter clerical data entry',
    'High domestic support CSR payroll',
    'Spreadsheet clutter & legacy portals',
    'Regulatory & multi-state compliance'
  ];

  const handleToggleBottleneck = (option: string) => {
    if (selectedBottlenecks.includes(option)) {
      setSelectedBottlenecks(selectedBottlenecks.filter((b) => b !== option));
    } else {
      setSelectedBottlenecks([...selectedBottlenecks, option]);
    }
  };

  const handleLeadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmittingLead(true);
    setLeadError(null);
    try {
      const { error } = await supabase
        .from('contact_leads')
        .insert([{
          company_name: companyName,
          company_type: companyType,
          premium_volume: premiumVolume,
          bottlenecks: selectedBottlenecks,
          client_name: clientName,
          client_email: clientEmail,
          status: 'New'
        }]);

      if (error) throw error;

      // Automatically prefill the booking form fields with matching values for the customer's convenience!
      setBookingName(clientName);
      setBookingEmail(clientEmail);
      setBookingPhone(clientPhone);
      setBookingCompany(companyName);

      setFormSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting lead:', err);
      setLeadError(err?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleMeetingSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmittingMeeting(true);
    setMeetingError(null);
    try {
      const { error } = await supabase
        .from('consultation_requests')
        .insert([{
          name: bookingName || clientName || 'Anonymous',
          email: bookingEmail || clientEmail || 'no-email@company.com',
          phone: bookingPhone || clientPhone || '',
          company: bookingCompany || companyName || '',
          service: bookingService,
          notes: bookingNotes,
          date: `${selectedDay} at ${selectedTimeSlot}`
        }]);

      if (error) throw error;
      setMeetingScheduled(true);
    } catch (err: any) {
      console.error('Error scheduling consultation:', err);
      setMeetingError(err?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmittingMeeting(false);
    }
  };

  const handleCallbackSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!cbName.trim() || !cbPhone.trim()) return;
    setIsSubmittingCb(true);
    setCbError(null);
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
    } catch (err: any) {
      console.error('Error requesting callback:', err);
      setCbError(err?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmittingCb(false);
    }
  };

  const handleDiagnosticSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!diagName.trim() || !diagEmail.trim()) return;
    setIsSubmittingDiag(true);
    setDiagError(null);
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
    } catch (err: any) {
      console.error('Error submitting diagnostic request:', err);
      setDiagError(err?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmittingDiag(false);
    }
  };

  return (
    <div className="bg-[#F8FAFF] font-sans text-[#111827] min-h-screen">
      
      {/* Contact Header */}
      <section className="bg-white border-b border-[#DCE7FF]/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Strategic Handshake</span>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#081B8C] tracking-tight">
            Book an Advisory Assessment
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
            Eliminate operational backlogs today. Complete our secure multi-step assessment questionnaire or schedule a direct Zoom slot on our executive calendar.
          </p>
        </div>
      </section>

      {/* Main Grid: Form, Map & Scheduler */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Row 1: Lead form & map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Multi-Step Lead Intake Form */}
          <div className="lg:col-span-7 bg-white border border-[#DCE7FF] rounded-2xl p-8 lg:p-12 shadow-sm space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2F6DFF] animate-pulse" />
                <span className="text-xs uppercase tracking-wider font-bold text-[#081B8C]">
                  Step {formStep} of 3 // Assessment
                </span>
              </div>
              <div className="flex gap-1.5">
                <div className={`w-6 h-1.5 rounded-full ${formStep >= 1 ? 'bg-[#081B8C]' : 'bg-gray-100'}`} />
                <div className={`w-6 h-1.5 rounded-full ${formStep >= 2 ? 'bg-[#081B8C]' : 'bg-gray-100'}`} />
                <div className={`w-6 h-1.5 rounded-full ${formStep >= 3 ? 'bg-[#081B8C]' : 'bg-gray-100'}`} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <form onSubmit={handleLeadSubmit} className="space-y-6">
                  
                  {/* STEP 1: Enterprise Profile */}
                  {formStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-[#081B8C] font-display">Tell us about your organization</h3>
                        <p className="text-gray-400 text-xs">This matches our team templates to your operating profile.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700 uppercase">Enterprise / Agency Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Summit Specialty Brokers"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase">Organization Profile</label>
                            <select
                              value={companyType}
                              onChange={(e) => setCompanyType(e.target.value)}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            >
                              <option>Insurance Agency</option>
                              <option>Insurance Carrier</option>
                              <option>MGA / Wholesaler</option>
                              <option>InsurTech Startup</option>
                              <option>Mid-Market Enterprise</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase">Annual Written Premium (AWP)</label>
                            <select
                              value={premiumVolume}
                              onChange={(e) => setPremiumVolume(e.target.value)}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            >
                              <option>Under $5M AWP</option>
                              <option>$5M - $20M AWP</option>
                              <option>$20M - $100M AWP</option>
                              <option>$100M+ AWP (Enterprise)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          disabled={!companyName.trim()}
                          onClick={() => setFormStep(2)}
                          className="cursor-pointer bg-[#081B8C] hover:bg-[#2F6DFF] disabled:opacity-40 text-white text-xs font-bold px-6 py-3 rounded-full flex items-center gap-1.5"
                        >
                          <span>Proceed to Diagnostics</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Diagnostics */}
                  {formStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-[#081B8C] font-display">Isolate your key bottlenecks</h3>
                        <p className="text-gray-400 text-xs">Select all constraints currently gating your capacity.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {bottlenecksOptions.map((opt) => {
                          const isSelected = selectedBottlenecks.includes(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleToggleBottleneck(opt)}
                              className={`text-left p-3.5 border rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-[#081B8C]/10 border-[#081B8C] text-[#081B8C]'
                                  : 'bg-[#F8FAFF] border-[#DCE7FF]/60 text-gray-600 hover:bg-white hover:border-[#2F6DFF]'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#081B8C] border-transparent text-white' : 'border-gray-300 bg-white'}`}>
                                {isSelected && <span className="text-[10px]">✓</span>}
                              </div>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-4 flex justify-between items-center">
                        <button
                          type="button"
                          onClick={() => setFormStep(1)}
                          className="cursor-pointer text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back</span>
                        </button>
                        <button
                          type="button"
                          disabled={selectedBottlenecks.length === 0}
                          onClick={() => setFormStep(3)}
                          className="cursor-pointer bg-[#081B8C] hover:bg-[#2F6DFF] disabled:opacity-40 text-white text-xs font-bold px-6 py-3 rounded-full flex items-center gap-1.5"
                        >
                          <span>Proceed to Contact Info</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Contact details */}
                  {formStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-[#081B8C] font-display">Who should we send the analysis to?</h3>
                        <p className="text-gray-400 text-xs">Our enterprise consultants will review your diagnostics overnight.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700 uppercase">Your Professional Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Arthur McCandless"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700 uppercase">Corporate Email</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. arthur@summit specialty.com"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700 uppercase">Phone Number</label>
                          <input
                            type="tel"
                            placeholder="e.g. +1 (713) 555-0199"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF]"
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex flex-col items-stretch gap-3">
                        <div className="flex justify-between items-center">
                          <button
                            type="button"
                            onClick={() => setFormStep(2)}
                            className="cursor-pointer text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back</span>
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmittingLead || !clientName.trim() || !clientEmail.trim()}
                            className="cursor-pointer bg-[#081B8C] hover:bg-[#2F6DFF] disabled:opacity-40 text-white text-xs font-bold px-8 py-3.5 rounded-full flex items-center gap-1.5 shadow-md"
                          >
                            {isSubmittingLead ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Submitting...</span>
                              </>
                            ) : (
                              <>
                                <span>Submit Assessment Request</span>
                                <CheckCircle className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                        {leadError && (
                          <p className="text-red-500 text-xs font-semibold text-right">{leadError}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-[#081B8C] font-display">Assessment Submitted</h3>
                    <p className="text-emerald-600 text-xs font-bold bg-emerald-50 border border-emerald-100 rounded-lg p-3 max-w-md mx-auto">
                      Thank you. Your request has been received successfully. Our team will contact you shortly.
                    </p>
                    <p className="text-gray-500 text-xs max-w-md mx-auto pt-2">
                      Thank you, {clientName}. Our executive consultants are evaluating the diagnostic mapping for <strong>{companyName}</strong>. You will receive a secure custom process blueprint in your inbox shortly.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl max-w-md mx-auto border border-gray-100 text-left text-xs text-gray-400 space-y-1">
                    <p className="font-bold text-gray-600">Diagnostics Captured:</p>
                    <p>• Premium Volume: {premiumVolume}</p>
                    <p>• Profile Class: {companyType}</p>
                    <p>• Isolated Bottlenecks: {selectedBottlenecks.length} categories logged.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive World Map Graphic representation */}
          <div className="lg:col-span-5 bg-white border border-[#DCE7FF] rounded-2xl p-8 shadow-sm flex flex-col justify-between items-stretch">
            <div className="space-y-4">
              <span className="text-[10px] bg-[#DCE7FF]/40 text-[#081B8C] font-bold px-2.5 py-1 rounded">
                Global Operations Connectivity
              </span>
              <h3 className="text-lg font-bold text-[#081B8C] font-display">Global Delivery Map</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Our India-based delivery center sits directly on double redundant fiber-pipelines, serving global organizations via high-security SOC2-compliant encrypted channels.
              </p>
            </div>

            {/* Interactive Google Maps Embed */}
            <div className="my-6 h-[320px] w-full relative rounded-xl overflow-hidden border border-[#DCE7FF] shadow-inner">
              <iframe
                title="Going Technologies Global Center Location - Visakhapatnam"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.6725890832326!2d83.33642397500139!3d17.71295988323565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39433fa6fbf8c5%3A0xe98d5c48b704fb3b!2sVisakhapatnam%2C%20Andhra%20Pradesh%20530041!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Direct Support links */}
            <div className="border-t border-gray-100 pt-6 space-y-3.5 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#2F6DFF]" />
                <span>706-383-0888</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#2F6DFF]" />
                <span>connect@goingtechnologies.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                <a
                  href="https://wa.me/919618424749?text=Hello%20Going%20Technologies%20Team%2C%0A%0AI%20would%20like%20to%20learn%20more%20about%20your%20operational%20support%20and%20business%20process%20outsourcing%20services.%0A%0APlease%20contact%20me."
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Chat directly via WhatsApp</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: Live Meeting Scheduler (Calendly Representation) */}
        <div className="bg-white border border-[#DCE7FF] rounded-3xl p-8 lg:p-12 shadow-sm space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Schedule Consultation</h2>
            <h3 className="text-2xl font-bold font-display text-[#081B8C]">Direct Executive Booking Calendar</h3>
            <p className="text-gray-400 text-xs">Lock in a 30-minute private Zoom briefing with our operations partners.</p>
          </div>

          <AnimatePresence mode="wait">
            {!meetingScheduled ? (
              <form onSubmit={handleMeetingSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* 1. Day & Time Selector */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b border-gray-100 pb-2">
                      1. Select a Day
                    </h4>
                    <div className="space-y-2">
                      {availableDays.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSelectedDay(day)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer ${
                            selectedDay === day
                              ? 'bg-[#081B8C] text-white border-transparent shadow-md'
                              : 'bg-[#F8FAFF] border-gray-100 hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <span className="font-sans">{day}</span>
                          <ChevronRight className="w-4 h-4 opacity-50" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b border-gray-100 pb-2">
                      2. Select a Time (EST)
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center cursor-pointer ${
                            selectedTimeSlot === slot
                              ? 'bg-[#2F6DFF] text-white border-transparent shadow-md'
                              : 'bg-[#F8FAFF] border-gray-100 hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5 mr-1.5 opacity-60" />
                          <span>{slot}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Contact Details & Service */}
                <div className="lg:col-span-4 space-y-4 bg-white p-5 rounded-2xl border border-[#DCE7FF]/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b border-gray-100 pb-2">
                    3. Booking Information
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Arthur McCandless"
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Corporate Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="arthur@summit.com"
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Phone</label>
                        <input
                          type="tel"
                          placeholder="+1 713-555"
                          value={bookingPhone}
                          onChange={(e) => setBookingPhone(e.target.value)}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Company</label>
                        <input
                          type="text"
                          placeholder="Summit Specialty"
                          value={bookingCompany}
                          onChange={(e) => setBookingCompany(e.target.value)}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Interested Service</label>
                      <select
                        value={bookingService}
                        onChange={(e) => setBookingService(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      >
                        <option>Insurance Operations</option>
                        <option>Business Process BPO</option>
                        <option>Digital Modernization</option>
                        <option>AI & Automation Solutions</option>
                        <option>Strategic Advisory</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Brief Notes</label>
                      <textarea
                        rows={2}
                        placeholder="Key operational challenges..."
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF] resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Confirm Information & Submit */}
                <div className="lg:col-span-3 space-y-6 bg-[#F8FAFF] p-6 rounded-2xl border border-[#DCE7FF]/60 flex flex-col justify-between self-stretch">
                  <div className="space-y-4 text-xs">
                    <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-2 uppercase tracking-wider">4. Schedule Check</h4>
                    
                    <div className="space-y-2.5">
                      <div>
                        <span className="text-gray-400 block text-[10px]">SELECTED DATE</span>
                        <p className="font-semibold text-gray-700">{selectedDay || 'None selected'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">TIME INDICATOR</span>
                        <p className="font-semibold text-gray-700">{selectedTimeSlot || 'None selected'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">CONTACT CONFIRMED</span>
                        <p className="font-semibold text-gray-700">{bookingName ? `${bookingName}` : 'Enter info...'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-6">
                    <button
                      type="submit"
                      disabled={isSubmittingMeeting || !selectedDay || !selectedTimeSlot || !bookingName.trim() || !bookingEmail.trim()}
                      className="cursor-pointer w-full text-center bg-[#081B8C] hover:bg-[#2F6DFF] disabled:opacity-40 text-white text-xs font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      {isSubmittingMeeting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Secure Slot</span>
                          <CheckCircle className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    {meetingError && (
                      <p className="text-red-500 text-[11px] font-semibold text-center">{meetingError}</p>
                    )}
                  </div>
                </div>

              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#081B8C] font-display">Meeting Successfully Scheduled!</h3>
                <p className="text-emerald-600 text-xs font-bold bg-emerald-50 border border-emerald-100 rounded-lg p-3 max-w-sm mx-auto">
                  Thank you. Your request has been received successfully. Our team will contact you shortly.
                </p>
                <p className="text-gray-500 text-xs max-w-sm mx-auto pt-2">
                  A calendar invite and private Zoom coordinates have been locked for <strong>{selectedDay} at {selectedTimeSlot}</strong>. Check your email for details.
                </p>
                <button
                  onClick={() => setMeetingScheduled(false)}
                  className="text-xs font-bold text-[#2F6DFF] hover:underline cursor-pointer"
                >
                  Reschedule Meeting
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Row 3: Instant Callback & Deep Process Diagnostic Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Form 5: Hotline Callback Form */}
          <div className="bg-white border border-[#DCE7FF] rounded-3xl p-8 lg:p-10 shadow-sm flex flex-col justify-between">
            <div className="space-y-4 mb-6">
              <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded text-xs font-bold text-amber-700">
                <Phone className="w-3.5 h-3.5" />
                <span>Priority Hotline callback</span>
              </div>
              <h3 className="text-xl font-bold font-display text-[#081B8C]">Request a Quick Phone Callback</h3>
              <p className="text-gray-400 text-xs">Enter your details and an executive operations expert will call you back directly.</p>
            </div>

            <AnimatePresence mode="wait">
              {!cbSubmitted ? (
                <form onSubmit={handleCallbackSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Contact Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={cbName}
                      onChange={(e) => setCbName(e.target.value)}
                      className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Direct Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 706-383-0888"
                      value={cbPhone}
                      onChange={(e) => setCbPhone(e.target.value)}
                      className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Preferred Callback Time</label>
                    <select
                      value={cbTime}
                      onChange={(e) => setCbTime(e.target.value)}
                      className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF] cursor-pointer"
                    >
                      <option>Morning (9 AM - 12 PM EST)</option>
                      <option>Afternoon (12 PM - 4 PM EST)</option>
                      <option>Evening (4 PM - 7 PM EST)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingCb || !cbName.trim() || !cbPhone.trim()}
                    className="cursor-pointer w-full text-center bg-[#081B8C] hover:bg-[#2F6DFF] disabled:opacity-40 text-white text-xs font-bold py-3.5 px-4 rounded-xl transition-colors mt-6 flex items-center justify-center gap-1.5"
                  >
                    {isSubmittingCb ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Request Hotline Callback</span>
                        <Phone className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  {cbError && (
                    <p className="text-red-500 text-xs font-semibold text-center mt-2">{cbError}</p>
                  )}
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#081B8C] font-display">Callback Request Logged!</h3>
                  <p className="text-emerald-600 text-xs font-bold bg-emerald-50 border border-emerald-100 rounded-lg p-3 max-w-sm mx-auto">
                    Thank you. Your request has been received successfully. Our team will contact you shortly.
                  </p>
                  <p className="text-gray-500 text-xs max-w-sm mx-auto leading-relaxed pt-2">
                    We have successfully queued your call. A partner manager will contact you on <strong>{cbPhone}</strong> during your preferred slot of <strong>{cbTime}</strong>.
                  </p>
                  <button
                    onClick={() => setCbSubmitted(false)}
                    className="text-xs font-bold text-[#2F6DFF] hover:underline cursor-pointer"
                  >
                    Submit Another Callback
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form 6: Diagnostic Form */}
          <div className="bg-white border border-[#DCE7FF] rounded-3xl p-8 lg:p-10 shadow-sm flex flex-col justify-between">
            <div className="space-y-4 mb-6">
              <div className="inline-flex items-center gap-1.5 bg-[#DCE7FF]/40 px-2.5 py-1 rounded text-xs font-bold text-[#081B8C]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2F6DFF]" />
                <span>Process Audit Diagnostic</span>
              </div>
              <h3 className="text-xl font-bold font-display text-[#081B8C]">Request a Process Diagnostic</h3>
              <p className="text-gray-400 text-xs">Unlock a deep workflow audit of your insurance agency operations by our senior tech specialists.</p>
            </div>

            <AnimatePresence mode="wait">
              {!diagSubmitted ? (
                <form onSubmit={handleDiagnosticSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Professional Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Arthur McCandless"
                        value={diagName}
                        onChange={(e) => setDiagName(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Corporate Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. arthur@summit.com"
                        value={diagEmail}
                        onChange={(e) => setDiagEmail(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Contact Phone</label>
                      <input
                        type="tel"
                        placeholder="e.g. 706-383-0888"
                        value={diagPhone}
                        onChange={(e) => setDiagPhone(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Company Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Summit Brokerage"
                        value={diagCompany}
                        onChange={(e) => setDiagCompany(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Operational Bottlenecks / Notes</label>
                    <textarea
                      rows={2}
                      placeholder="Detail any specific software or backlog issues..."
                      value={diagNotes}
                      onChange={(e) => setDiagNotes(e.target.value)}
                      className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingDiag || !diagName.trim() || !diagEmail.trim()}
                    className="cursor-pointer w-full text-center bg-[#081B8C] hover:bg-[#2F6DFF] disabled:opacity-40 text-white text-xs font-bold py-3.5 px-4 rounded-xl transition-colors mt-6 flex items-center justify-center gap-1.5"
                  >
                    {isSubmittingDiag ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Request Custom Diagnostic</span>
                        <ShieldCheck className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  {diagError && (
                    <p className="text-red-500 text-xs font-semibold text-center mt-2">{diagError}</p>
                  )}
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#081B8C] font-display">Diagnostic Request Submitted!</h3>
                  <p className="text-emerald-600 text-xs font-bold bg-emerald-50 border border-emerald-100 rounded-lg p-3 max-w-sm mx-auto">
                    Thank you. Your request has been received successfully. Our team will contact you shortly.
                  </p>
                  <p className="text-gray-500 text-xs max-w-sm mx-auto leading-relaxed pt-2">
                    Thank you, <strong>{diagName}</strong>. Our senior solutions architect is preparing an initial analysis brief. We will reach out to you via <strong>{diagEmail}</strong> shortly.
                  </p>
                  <button
                    onClick={() => setDiagSubmitted(false)}
                    className="text-xs font-bold text-[#2F6DFF] hover:underline cursor-pointer"
                  >
                    Submit Another Diagnostic
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* PREMIUM PROPOSAL DOWNLOAD LEAD MAGNET SECTION */}
        <div className="my-16">
          <div className="bg-gradient-to-br from-[#081B8C]/5 via-white to-[#2F6DFF]/5 border border-[#DCE7FF]/80 rounded-3xl p-8 md:p-12 shadow-xs relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#2F6DFF]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#081B8C]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-[#DCE7FF]/40 px-3 py-1.5 rounded-full text-[11px] font-bold text-[#081B8C] tracking-wide shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#2F6DFF]" />
                <span>⭐ Premium Gated Operations Guide</span>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-bold font-display text-[#081B8C] tracking-tight">
                  Download Our Insurance Operations Proposal
                </h2>
                <p className="text-gray-500 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
                  Access our complete Insurance Operations Proposal to learn how Going Technologies helps agencies reduce operational costs, improve efficiency, and scale with experienced insurance professionals.
                </p>
              </div>

              <div className="max-w-md mx-auto">
                {downloadSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/80 backdrop-blur-md border border-[#DCE7FF] rounded-2xl p-8 space-y-4 shadow-sm"
                  >
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                      <CheckCircle className="w-6 h-6 animate-bounce" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900 text-sm">Download Initialized!</h4>
                      <p className="text-gray-500 text-[11px] leading-normal">
                        Your secure download has started automatically. If it didn't begin, please check your browser downloads.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={handleDownloadProposal}
                    className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-6 md:p-8 space-y-4 shadow-xs"
                  >
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Corporate Email Address
                      </label>
                      <div className="relative rounded-xl shadow-xs">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={downloadEmail}
                          onChange={(e) => {
                            setDownloadEmail(e.target.value);
                            if (downloadError) setDownloadError('');
                          }}
                          placeholder="name@company.com"
                          className="w-full text-xs pl-10 pr-4 py-3.5 bg-gray-50/80 border border-[#DCE7FF] hover:border-gray-300 focus:border-[#2F6DFF] focus:bg-white focus:outline-hidden rounded-xl transition-all font-medium text-gray-900 placeholder-gray-400"
                        />
                      </div>
                      {downloadError && (
                        <div className="flex items-start gap-2 mt-2 text-rose-600 text-[11px] leading-relaxed bg-rose-50/50 border border-rose-100 rounded-xl p-3">
                          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-rose-500" />
                          <span>{downloadError}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <button
                        type="submit"
                        disabled={downloadLoading}
                        className="cursor-pointer w-full bg-gradient-to-r from-[#081B8C] to-[#2F6DFF] hover:opacity-95 text-white text-xs font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {downloadLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 animate-bounce" />
                            <span>Download Now</span>
                          </>
                        )}
                      </button>
                      <p className="text-[10px] text-gray-400 font-semibold text-center leading-normal">
                        🔒 Secure download. Only business domains are accepted.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Global Locations grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {OFFICE_LOCATIONS.map((loc, idx) => (
            <div key={idx} className="bg-white border border-[#DCE7FF] rounded-2xl p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#2F6DFF]" />
                <h4 className="text-lg font-bold text-[#081B8C] font-display">{loc.city}</h4>
              </div>
              <p className="text-[#2F6DFF] text-xs font-semibold">{loc.role}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{loc.address}</p>
              <div className="pt-3 border-t border-gray-100 text-xs text-gray-400 space-y-1">
                <p>Phone: {loc.phone}</p>
                <p>Email: {loc.email}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
