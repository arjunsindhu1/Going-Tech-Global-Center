import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Activity,
  ChevronRight,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';

interface InteractiveWorkflowVisualizerProps {
  keyServices: string[];
  serviceName: string;
}

export default function InteractiveWorkflowVisualizer({ keyServices, serviceName }: InteractiveWorkflowVisualizerProps) {
  const [activeStep, setActiveStep] = useState<number>(0);

  // Define steps with illustrative icons and details
  const stepMeta = [
    {
      label: "Secure Intake & Ingestion",
      short: "Secure receipt and queueing of incoming broker submissions, emails, and attachments.",
      icon: Layers,
      sla: "Within 15 Minutes",
      accuracy: "100% Sorted",
      details: [
        "Instant multi-channel ingestion of raw broker emails, policy certs, and schedules.",
        "Secure document indexing and sorting within our firewalled system perimeter.",
        "Automatic entry creation in agency systems with complete audit logs."
      ]
    },
    {
      label: "Intelligent Triage",
      short: "Automated routing and priority analysis matching specific underwriting rules.",
      icon: Sparkles,
      sla: "Real-time routing",
      accuracy: "99.8% Perfect Triaged",
      details: [
        "Risk profiling of incoming accounts based on market eligibility guidelines.",
        "Direct routing of priority files to the designated expert support queue.",
        "Clearing non-actionable duplicates automatically to save underwriter bandwidth."
      ]
    },
    {
      label: "SOP Execution & Rating Prep",
      short: "Deep operational checklist completion: loss runs, rating, and quote preparation.",
      icon: Activity,
      sla: "Average < 45 Mins",
      accuracy: "99.9% Compliance",
      details: [
        "Gathering loss histories and parsing hard-to-read carrier PDFs into neat summaries.",
        "Entering values across EZLynx, Applied Epic, or proprietary carrier rating systems.",
        "Compiling formal proposal drafts ready for direct underwriter evaluation."
      ]
    },
    {
      label: "Dual-Verification Quality Audit",
      short: "Peer-reviewed compliance check to guarantee complete zero-defect deliverables.",
      icon: ShieldCheck,
      sla: "Immediate peer-review",
      accuracy: "99.98% Verification",
      details: [
        "A second certified operations manager checks every line against your custom checklist.",
        "Verification of limits, deductibles, effective dates, and policy wording correctness.",
        "Ensuring complete SOC 2 Type II and HIPAA data protection guidelines are followed."
      ]
    },
    {
      label: "Direct Secure System Sync",
      short: "Clean data delivery and status update directly back inside your core platforms.",
      icon: Award,
      sla: "Instant delivery",
      accuracy: "Fully Synchronized",
      details: [
        "Direct sync back to Applied Epic, AMS360, Salesforce, or client custom portals.",
        "Real-time team notification via secure portal or integrated messaging.",
        "Full archival of operations sheets with complete transparency and compliance records."
      ]
    }
  ];

  const currentStepData = stepMeta[activeStep] || stepMeta[0];

  return (
    <div className="bg-slate-50/40 border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden space-y-12">
      {/* Cinematic Ambient Background Lighting */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#2F6DFF]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-[#A93DFF]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Title block */}
      <div className="text-left space-y-2 relative z-10">
        <span className="text-[10px] font-bold text-[#2F6DFF] bg-[#2F6DFF]/8 px-3.5 py-1 rounded-full uppercase tracking-widest font-mono">
          Interactive Operational Pipeline
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-[#081B8C] tracking-tight">
          SOP-Driven Operations Flow
        </h3>
        <p className="text-gray-500 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Explore how we process high-volume insurance transactions for <span className="font-extrabold text-[#2F6DFF]">{serviceName}</span>. Click any phase below to visualize the real-time movement and active compliance loops.
        </p>
      </div>

      {/* CONNECTED FLOATING NODES FLOW */}
      <div className="relative z-10 py-4">
        {/* Animated Connecting SVG Path behind nodes */}
        <div className="absolute top-[48px] left-0 w-full h-[6px] pointer-events-none hidden lg:block z-0">
          <svg className="w-full h-full" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="laserGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2F6DFF" />
                <stop offset="50%" stopColor="#A93DFF" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
            {/* Base glowing track */}
            <path
              d="M 50 3 Q 300 15 600 3 T 1150 3"
              fill="none"
              stroke="#DCE7FF"
              strokeWidth="2.5"
            />
            {/* Glowing flowing gradient laser */}
            <motion.path
              d="M 50 3 Q 300 15 600 3 T 1150 3"
              fill="none"
              stroke="url(#laserGradient)"
              strokeWidth="3"
              strokeDasharray="80, 200"
              animate={{ strokeDashoffset: [-400, 400] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>

        {/* 5 Connected Node Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
          {stepMeta.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;

            return (
              <motion.button
                key={idx}
                onClick={() => setActiveStep(idx)}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`text-left p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-[160px] relative overflow-hidden ${
                  isActive
                    ? 'bg-white border-[#2F6DFF] shadow-lg shadow-[#2F6DFF]/5'
                    : 'bg-white/80 backdrop-blur-md border-[#DCE7FF]/70 hover:border-[#2F6DFF]/50 hover:bg-white'
                }`}
              >
                {/* Active Indicator Micro Grid Accent */}
                {isActive && (
                  <div className="absolute inset-x-0 bottom-0 h-[3.5px] bg-gradient-to-r from-[#2F6DFF] via-[#A93DFF] to-[#10B981]" />
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-[#2F6DFF] text-white shadow-md shadow-[#2F6DFF]/10' 
                        : 'bg-slate-100 text-gray-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-gray-400">
                      Phase 0{idx + 1}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#081B8C] font-display uppercase tracking-wider leading-snug">
                    {step.label}
                  </h4>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold font-mono">
                  <Clock className="w-3 h-3 text-[#2F6DFF]" />
                  <span>{step.sla}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* MORPHING CARD DETAILS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-[#DCE7FF]/80 rounded-2xl p-6 sm:p-10 shadow-lg relative overflow-hidden"
        >
          {/* Subtle elegant card grid background */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          {/* Left: Phase Abstract & SLA highlights */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between text-left relative z-10">
            <div className="space-y-3">
              <span className="text-[9px] font-bold text-[#2F6DFF] bg-[#2F6DFF]/6 px-3 py-0.5 rounded-full uppercase tracking-wider font-mono">
                Active Process Focus
              </span>
              <h4 className="text-xl font-extrabold text-[#081B8C] font-display">
                {currentStepData.label}
              </h4>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                {currentStepData.short}
              </p>
            </div>

            {/* Quick Metrics (Pure Luxury SaaS Presentation) */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono block">Delivery Window</span>
                <span className="text-sm font-extrabold text-[#081B8C] font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {currentStepData.sla}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono block">Quality Standard</span>
                <span className="text-sm font-extrabold text-[#2F6DFF] font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F6DFF] animate-pulse" />
                  {currentStepData.accuracy}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Operational Directives / SOP Step list */}
          <div className="lg:col-span-7 space-y-5 text-left relative z-10">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono block">
              Directives & Standard Operating Procedures
            </span>

            <div className="space-y-3.5">
              {currentStepData.details.map((detail, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-slate-50 border border-[#DCE7FF]/40 rounded-xl p-4 flex items-start gap-3.5 hover:border-[#2F6DFF]/30 transition-all group"
                >
                  <div className="p-1.5 bg-[#2F6DFF]/8 text-[#2F6DFF] group-hover:bg-[#2F6DFF] group-hover:text-white rounded-lg mt-0.5 shrink-0 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium leading-relaxed">
                    {detail}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] font-mono text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                HIPAA compliant processing
              </span>
              <span className="uppercase font-bold text-gray-500">Secure Audit Completed</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Floating Info Banner */}
      <div className="bg-[#2F6DFF]/5 border border-[#2F6DFF]/15 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3.5 text-xs text-[#081B8C] text-left relative z-10">
        <Zap className="w-5 h-5 text-[#2F6DFF] shrink-0 animate-bounce" />
        <p className="leading-relaxed">
          <strong>Certified Operational Rigor:</strong> Unlike standard off-the-shelf software tools, our digital pipeline is completely fully-managed by certified insurance experts who execute standard workflows directly inside your Applied Epic, AMS360, or agency systems.
        </p>
      </div>
    </div>
  );
}
