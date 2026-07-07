import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Activity, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { PageType } from '../types';
import ROICalculator from '../components/ROICalculator';
import OperationsHealthCheck from '../components/OperationsHealthCheck';
import BusinessToolsModal from '../components/BusinessToolsModal';

interface BusinessToolsProps {
  setCurrentPage: (page: PageType) => void;
}

export default function BusinessTools({ setCurrentPage }: BusinessToolsProps) {
  const [activeTool, setActiveTool] = useState<'roi' | 'health'>('roi');
  const [isUnlocked, setIsUnlocked] = useState(() => {
    const submitted = localStorage.getItem('businessToolsLeadSubmitted') === 'true';
    const submittedTime = localStorage.getItem('businessToolsLeadSubmittedTime');
    if (submitted && submittedTime) {
      const time = parseInt(submittedTime, 10);
      if (!isNaN(time)) {
        const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
        if (Date.now() - time <= THIRTY_DAYS_MS) {
          return true;
        }
      }
    }
    return sessionStorage.getItem('gt_business_tools_unlocked') === 'true';
  });
  const [isModalOpen, setIsModalOpen] = useState(!isUnlocked);

  const handleTabChange = (tool: 'roi' | 'health') => {
    setActiveTool(tool);
    if (!isUnlocked) {
      setIsModalOpen(true);
    }
  };

  const getToolName = () => {
    return activeTool === 'roi' ? 'ROI Savings Calculator' : 'Operations Health Check';
  };

  const renderLockedPlaceholder = (toolDesc: string) => {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-slate-50 border border-dashed border-[#DCE7FF] rounded-2xl space-y-6 relative overflow-hidden">
        <div className="p-4 bg-amber-50 text-amber-600 rounded-full border border-amber-100 shadow-sm animate-bounce">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-xl font-bold font-display text-[#081B8C]">Unlock Free Business Tools</h3>
          <p className="text-gray-500 text-xs sm:text-sm">
            {toolDesc} Please provide a few business details to unlock complete access.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3.5 bg-[#081B8C] hover:bg-[#2F6DFF] text-white rounded-xl font-bold text-sm cursor-pointer shadow-lg transition-colors flex items-center gap-2"
        >
          <Lock className="w-4 h-4" />
          <span>Unlock Tools Now</span>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-[#F8FAFF] min-h-screen">
      {/* Hero Header */}
      <section className="relative py-20 overflow-hidden bg-[#081B8C] text-white">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2F6DFF]/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-200 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full select-none">
            ⚡ Operations Toolkit
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight leading-tight">
            Agency Growth & Operations Resource Center
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Empower your enterprise with interactive diagnostics. Model your actual payroll savings or benchmark your workflows to discover systematic margin leakage.
          </p>
        </div>
      </section>

      {/* Selector Tabs */}
      <section className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white border border-[#DCE7FF] rounded-2xl p-2 shadow-xl flex gap-2">
          <button
            onClick={() => handleTabChange('roi')}
            className={`flex-1 py-4 px-6 rounded-xl font-bold font-display text-sm flex items-center justify-center gap-3 transition-all cursor-pointer ${
              activeTool === 'roi'
                ? 'bg-[#081B8C] text-white shadow-lg shadow-[#081B8C]/15'
                : 'bg-transparent text-gray-500 hover:text-[#081B8C] hover:bg-slate-50'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span>ROI Savings Calculator</span>
          </button>
          
          <button
            onClick={() => handleTabChange('health')}
            className={`flex-1 py-4 px-6 rounded-xl font-bold font-display text-sm flex items-center justify-center gap-3 transition-all cursor-pointer ${
              activeTool === 'health'
                ? 'bg-[#081B8C] text-white shadow-lg shadow-[#081B8C]/15'
                : 'bg-transparent text-gray-500 hover:text-[#081B8C] hover:bg-slate-50'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span>Operations Health Check</span>
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatePresence mode="wait">
          {activeTool === 'roi' ? (
            <motion.div
              key="roi"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              <div className="bg-white border border-[#DCE7FF]/80 rounded-3xl p-8 lg:p-12 shadow-sm space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Tool 01 // Financial Impact</span>
                    <h2 className="text-2xl font-bold text-[#081B8C] font-display">Interactive ROI Savings Calculator</h2>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      Model custom salary scales, staffing volume, and processing times to compute exact monthly and yearly overhead reductions.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2 bg-[#F8FAFF] border border-[#DCE7FF] px-4 py-2 rounded-xl text-xs font-mono text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Carrier-Grade Calculation</span>
                  </div>
                </div>

                {isUnlocked ? (
                  <ROICalculator setCurrentPage={setCurrentPage} />
                ) : (
                  renderLockedPlaceholder("This professional savings calculator computes precise, audited staffing cost models based on actual payroll parameters.")
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="health"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              <div className="bg-white border border-[#DCE7FF]/80 rounded-3xl p-8 lg:p-12 shadow-sm space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Tool 02 // Structural Audit</span>
                    <h2 className="text-2xl font-bold text-[#081B8C] font-display">Operations Health Check Assessment</h2>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      Answer a brief diagnostic questionnaire to evaluate your workflows, flag system leakages, and receive a customized operational recommendations score.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2 bg-[#F8FAFF] border border-[#DCE7FF] px-4 py-2 rounded-xl text-xs font-mono text-gray-500">
                    <Activity className="w-4 h-4 text-[#2F6DFF]" />
                    <span>Real-time Operational Score</span>
                  </div>
                </div>

                {isUnlocked ? (
                  <OperationsHealthCheck setCurrentPage={setCurrentPage} />
                ) : (
                  renderLockedPlaceholder("This interactive audit identifies systematic AMS processing leakages, compliance bottlenecks, and provides a customized operational score.")
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Strategic Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-[#081B8C] rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2F6DFF]/15 blur-2xl rounded-full" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold font-display">Ready for a Customized Technical Consultation?</h3>
            <p className="text-white/80 text-xs leading-relaxed">
              Our Lean Six Sigma process engineers are ready to review your assessment scorecard, model your exact AMS workflow steps, and draft a pilot contract for your review.
            </p>
            <button
              onClick={() => {
                setCurrentPage('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer inline-flex items-center gap-2 bg-white text-[#081B8C] hover:bg-[#F8FAFF] px-6 py-3 rounded-full font-bold text-sm transition-colors"
            >
              <span>Schedule Strategic Overview</span>
              <ArrowRight className="w-4 h-4 text-[#081B8C]" />
            </button>
          </div>
        </div>
      </section>

      {/* Premium Lead Gate Modal */}
      <BusinessToolsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUnlock={() => setIsUnlocked(true)}
        toolName={getToolName()}
      />
    </div>
  );
}
