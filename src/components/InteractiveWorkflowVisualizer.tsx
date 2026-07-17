import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Activity,
  Sparkles,
  Layers,
  Award,
  Shield,
  Check,
  ArrowRight
} from 'lucide-react';

interface InteractiveWorkflowVisualizerProps {
  keyServices: string[];
  serviceName: string;
}

export default function InteractiveWorkflowVisualizer({ keyServices, serviceName }: InteractiveWorkflowVisualizerProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const stepMeta = [
    {
      label: "Secure Intake & Ingestion",
      cardTitle: "Secure Intake",
      cardSub: "Multi-channel raw file ingestion",
      icon: Layers,
      sla: "Within 15 Minutes",
      accuracy: "100% Ingested & Sorted",
      details: [
        "Instant multi-channel ingestion of raw broker emails, policy certs, and schedules.",
        "Secure document indexing and sorting within our firewalled system perimeter.",
        "Automatic entry creation in agency systems with complete audit logs."
      ]
    },
    {
      label: "Intelligent Triage",
      cardTitle: "Smart Triage",
      cardSub: "Rules-based priority dispatching",
      icon: Sparkles,
      sla: "Real-time dispatching",
      accuracy: "99.8% Triage Accuracy",
      details: [
        "Risk profiling of incoming accounts based on market eligibility guidelines.",
        "Direct routing of priority files to the designated expert support queue.",
        "Clearing non-actionable duplicates automatically to save underwriter bandwidth."
      ]
    },
    {
      label: "SOP Execution & Rating Prep",
      cardTitle: "SOP Execution",
      cardSub: "Loss history summaries & rating prep",
      icon: Activity,
      sla: "Average < 45 Mins",
      accuracy: "99.9% Compliance Score",
      details: [
        "Gathering loss histories and parsing hard-to-read carrier PDFs into neat summaries.",
        "Entering values across EZLynx, Applied Epic, or proprietary carrier rating systems.",
        "Compiling formal proposal drafts ready for direct underwriter evaluation."
      ]
    },
    {
      label: "Dual-Verification Quality Audit",
      cardTitle: "Quality Audit",
      cardSub: "Double-blind peer compliance review",
      icon: ShieldCheck,
      sla: "Immediate peer-review",
      accuracy: "99.98% Defect-Free Goal",
      details: [
        "A second certified operations manager checks every line against your custom checklist.",
        "Verification of limits, deductibles, effective dates, and policy wording correctness.",
        "Ensuring complete SOC 2 Type II and HIPAA data protection guidelines are followed."
      ]
    },
    {
      label: "Direct Secure System Sync",
      cardTitle: "Secure Sync",
      cardSub: "Encrypted system-of-record updates",
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
    <div className="space-y-16 py-8">
      {/* Container holding the workflow */}
      <div className="text-left space-y-4 max-w-3xl">
        <span className="text-[10px] font-bold text-[#2F6DFF] bg-[#2F6DFF]/6 px-3.5 py-1.5 rounded-full uppercase tracking-widest font-mono border border-[#2F6DFF]/10">
          Interactive Operational Pipeline
        </span>
        <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-[#081B8C] tracking-tight">
          SOP-Driven Operations Flow
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          How we process high-volume insurance transactions for <span className="font-extrabold text-[#2F6DFF]">{serviceName}</span> with military-grade precision. Click any card to preview full standard operating procedures.
        </p>
      </div>

      {/* Spacious Premium Timeline Layout */}
      <div className="relative">
        {/* Horizontal scroll support container with no scrollbar for desktop */}
        <div className="overflow-x-auto pb-8 pt-4 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-none snap-x snap-mandatory">
          <div className="flex flex-row justify-start lg:justify-between items-stretch gap-6 lg:gap-8 min-w-[1200px] lg:min-w-0 lg:w-full">
            {stepMeta.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              const isHovered = hoveredIdx === idx;

              return (
                <div
                  key={idx}
                  className="w-[240px] min-w-[240px] shrink-0 snap-center relative"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => setActiveStep(idx)}
                >
                  {/* Phase Card */}
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    animate={isActive ? {
                      borderColor: "rgba(47, 109, 255, 0.7)",
                      boxShadow: "0 20px 40px rgba(47, 109, 255, 0.12)",
                    } : {
                      borderColor: isHovered ? "rgba(47, 109, 255, 0.3)" : "rgba(220, 231, 255, 0.6)",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.01)",
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className={`text-left p-6 rounded-2xl border cursor-pointer flex flex-col justify-between h-[230px] relative overflow-hidden select-none bg-gradient-to-b transition-colors duration-300 ${
                      isActive
                        ? 'from-white to-[#2F6DFF]/3'
                        : 'from-white to-slate-50/50 hover:to-[#2F6DFF]/1'
                    }`}
                  >
                    {/* Glowing active indicator dot in corner */}
                    {isActive && (
                      <span className="absolute top-4 right-4 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2F6DFF] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2F6DFF]"></span>
                      </span>
                    )}

                    {/* Top Content */}
                    <div className="space-y-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#2F6DFF] text-white shadow-lg shadow-[#2F6DFF]/20 scale-110' 
                          : 'bg-[#2F6DFF]/5 text-[#2F6DFF]'
                      }`}>
                        <Icon className="w-5.5 h-5.5" />
                      </div>

                      {/* Header Info */}
                      <div>
                        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          Phase 0{idx + 1}
                        </span>
                        <h4 className="text-base font-extrabold text-[#081B8C] font-display uppercase tracking-wide leading-tight">
                          {step.cardTitle}
                        </h4>
                      </div>
                    </div>

                    {/* One short subtitle */}
                    <p className="text-gray-400 text-[11px] leading-snug font-medium mb-1">
                      {step.cardSub}
                    </p>

                    {/* Decorative Bottom Line Accent */}
                    {isActive && (
                      <motion.div 
                        layoutId="activeBorder"
                        className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#2F6DFF] via-[#A93DFF] to-emerald-400" 
                      />
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LONG ANIMATED CONNECTOR LINE (STRIPE / LINEAR STYLE) */}
        <div className="absolute left-10 right-10 top-[245px] h-[30px] pointer-events-none hidden lg:block z-0 overflow-visible">
          <svg className="w-full h-full overflow-visible">
            {/* Base grey background line */}
            <line
              x1="0%"
              y1="15"
              x2="100%"
              y2="15"
              stroke="#E2E8F0"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Glowing flowing connector gradient beam */}
            <motion.line
              x1="0%"
              y1="15"
              x2="100%"
              y2="15"
              stroke="url(#saasLaserGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="120, 240"
              animate={{ strokeDashoffset: [-720, 720] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Individual Connection Nodes Aligned Under Each Card */}
            {stepMeta.map((_, idx) => {
              const isActive = activeStep === idx;
              const isHovered = hoveredIdx === idx;
              // Predictable center positions based on 5 item flex layout:
              // 0 -> ~ 5.3% , 1 -> ~ 27.6%, 2 -> ~ 50%, 3 -> ~ 72.4%, 4 -> ~ 94.7%
              const positionX = `${5.3 + idx * 22.35}%`;

              return (
                <g key={idx}>
                  {/* Outer active shadow glow */}
                  {isActive && (
                    <circle
                      cx={positionX}
                      cy="15"
                      r="12"
                      fill="#2F6DFF"
                      opacity="0.15"
                      className="animate-pulse"
                    />
                  )}
                  {/* Outer ring */}
                  <circle
                    cx={positionX}
                    cy="15"
                    r={isActive ? 8 : isHovered ? 7 : 5}
                    fill="white"
                    stroke={isActive ? "#2F6DFF" : isHovered ? "#A93DFF" : "#CBD5E1"}
                    strokeWidth="3"
                    className="transition-all duration-300"
                  />
                  {/* Small inner dot */}
                  <circle
                    cx={positionX}
                    cy="15"
                    r="2.5"
                    fill={isActive ? "#2F6DFF" : "transparent"}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}

            {/* Flowing particles */}
            <motion.circle
              cx="0%"
              cy="15"
              r="4.5"
              fill="#2F6DFF"
              animate={{ cx: ["0%", "100%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              cx="0%"
              cy="15"
              r="4.5"
              fill="#A93DFF"
              animate={{ cx: ["0%", "100%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 2 }}
            />
            <motion.circle
              cx="0%"
              cy="15"
              r="4.5"
              fill="#10B981"
              animate={{ cx: ["0%", "100%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 4 }}
            />

            <defs>
              <linearGradient id="saasLaserGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2F6DFF" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#A93DFF" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Increased spacing between cards/workflow and the content panel */}
      <div className="pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white border border-[#DCE7FF] rounded-3xl p-8 lg:p-12 shadow-xl relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Left Column: Title & SLA Outcomes */}
            <div className="lg:col-span-5 space-y-8 flex flex-col justify-between text-left relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold text-[#2F6DFF] bg-[#2F6DFF]/6 border border-[#2F6DFF]/12 px-3 py-1 rounded-full uppercase tracking-wider">
                    SOP Focus Area
                  </span>
                  <span className="text-[9px] font-mono font-bold text-gray-400">
                    PHASE 0{activeStep + 1}
                  </span>
                </div>
                <h4 className="text-2xl lg:text-3xl font-extrabold text-[#081B8C] font-display">
                  {currentStepData.label}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Every step is fully documented under customized operating blueprints tailored to your organization’s risk profile, systems of record, and underwriting guidelines.
                </p>
              </div>

              {/* Dynamic Outcomes */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100/80">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono block">Delivery SLA</span>
                  <span className="text-sm font-extrabold text-[#081B8C] font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {currentStepData.sla}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono block">Accuracy Goal</span>
                  <span className="text-sm font-extrabold text-[#2F6DFF] font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2F6DFF] animate-pulse" />
                    {currentStepData.accuracy}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: SOP Checklists */}
            <div className="lg:col-span-7 space-y-6 text-left relative z-10">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono block">
                Blueprinted Standard Operating Procedures
              </span>

              <div className="space-y-4">
                {currentStepData.details.map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-slate-50/50 border border-[#DCE7FF]/30 rounded-xl p-5 flex items-start gap-4 hover:border-[#2F6DFF]/20 hover:bg-white transition-all group"
                  >
                    <div className="p-2 bg-[#2F6DFF]/8 text-[#2F6DFF] group-hover:bg-[#2F6DFF] group-hover:text-white rounded-lg shrink-0 transition-colors duration-300">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs text-gray-600 font-semibold leading-relaxed">
                      {detail}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100/80 flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  SOC 2 Type II & HIPAA Safeguards Active
                </span>
                <span className="uppercase font-extrabold text-gray-500">Verified Secure Pipeline</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* SLA operational guarantee footer banner */}
      <div className="bg-[#2F6DFF]/4 border border-[#2F6DFF]/12 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 text-xs text-[#081B8C] text-left relative z-10">
        <Zap className="w-5 h-5 text-[#2F6DFF] shrink-0 animate-bounce" />
        <p className="leading-relaxed">
          <strong>Enterprise Operational Guarantee:</strong> This SOP pipeline is executed by fully licensed, certified operations specialists operating under deep service level agreements (SLAs). We integrate transparent logging and strict verification loops directly within your core carrier systems.
        </p>
      </div>
    </div>
  );
}
