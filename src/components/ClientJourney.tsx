import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PhoneCall,
  Activity,
  FileSearch,
  Users2,
  Gift,
  CheckCircle,
  TrendingUp,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface Step {
  number: string;
  title: string;
  shortDesc: string;
  icon: React.ComponentType<any>;
  details: string[];
  color: string;
  bg: string;
  border: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Book Discovery Call',
    shortDesc: 'Briefing with executive partners.',
    icon: PhoneCall,
    details: [
      '30-minute briefing session to align on corporate targets.',
      'Analyze your current domestic overhead, payroll margins, and bottlenecks.',
      'SOP framework review to inspect custom agency structures.'
    ],
    color: 'text-blue-500',
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/20'
  },
  {
    number: '02',
    title: 'Operations Assessment',
    shortDesc: 'Detailed diagnostic mapping.',
    icon: Activity,
    details: [
      'Comprehensive audit of your transaction volumes, cycle speeds, and errors.',
      'Identify critical friction points in certificate processing, billing, or renewals.',
      'Estimate potential monthly savings and reclaimed producer capacity.'
    ],
    color: 'text-purple-500',
    bg: 'bg-purple-500/5',
    border: 'border-purple-500/20'
  },
  {
    number: '03',
    title: 'Workflow Analysis',
    shortDesc: 'Legacy system procedures mapping.',
    icon: FileSearch,
    details: [
      'Map your exact AMS steps (Applied Epic, Vertafore, Ezlynx, etc.).',
      'Translate your standard operating procedures (SOPs) into clear training specs.',
      'Establish strict quality control parameters and SOC 2 compliance safeguards.'
    ],
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/5',
    border: 'border-cyan-500/20'
  },
  {
    number: '04',
    title: 'Dedicated Team Assignment',
    shortDesc: 'Certified specialist pod onboarding.',
    icon: Users2,
    details: [
      'Assign a dedicated squad of college-educated, carrier-trained specialists.',
      'Equip them with dedicated VDI virtual desktops locked under strict physical rules.',
      'Conduct intensive training directly matching your unique agency parameters.'
    ],
    color: 'text-amber-500',
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/20'
  },
  {
    number: '05',
    title: '15 Free Trial Hours',
    shortDesc: 'Zero-commitment live pilot.',
    icon: Gift,
    details: [
      'Process real submissions, policy checksheets, or certificates with zero cost.',
      'Verify execution accuracy, speed, and real-time portal updates.',
      'Test night-time overnight clearing before your local office opens.'
    ],
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/5',
    border: 'border-emerald-500/20'
  },
  {
    number: '06',
    title: 'Performance Review',
    shortDesc: 'SLA and accuracy auditing.',
    icon: CheckCircle,
    details: [
      'Analyze pilot results: SLA cycle times, accuracy rates, and capacity.',
      'Gather direct qualitative feedback from your domestic licensed producers.',
      'Refine SOP playbooks and workflow integrations for permanent scaling.'
    ],
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/5',
    border: 'border-indigo-500/20'
  },
  {
    number: '07',
    title: 'Scale Operations',
    shortDesc: 'Seamless capacity expansion.',
    icon: TrendingUp,
    details: [
      'Permanently scale your dedicated support pod as transaction volumes grow.',
      'Reclaim up to 4.5 hours daily for domestic producers to hunt active premium.',
      'Access 24/5 or 24/7 continuous operations with SOC 2 certified security.'
    ],
    color: 'text-rose-500',
    bg: 'bg-rose-500/5',
    border: 'border-rose-500/20'
  }
];

export default function ClientJourney() {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <div className="space-y-12">
      
      {/* 1. Horizontal Steps Timeline (Desktop View) */}
      <div className="hidden lg:block relative">
        {/* Continuous background connecting line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
        
        {/* Active connecting line fill */}
        <motion.div
          className="absolute top-1/2 left-4 h-0.5 bg-gradient-to-r from-blue-500 to-[#2F6DFF] -translate-y-1/2 z-0 origin-left"
          animate={{ width: `${(activeStep / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.4 }}
        />

        <div className="relative z-10 flex justify-between items-center">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < activeStep;
            const isActive = idx === activeStep;
            
            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className="group focus:outline-none flex flex-col items-center cursor-pointer"
                style={{ width: `${100 / STEPS.length}%` }}
              >
                {/* Node circle */}
                <motion.div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-slate-900 border-[#2F6DFF] text-white shadow-lg shadow-[#2F6DFF]/20 scale-110'
                      : isCompleted
                      ? 'bg-[#2F6DFF] border-[#2F6DFF] text-white'
                      : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-400 group-hover:text-slate-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Text titles */}
                <div className="text-center mt-3 px-2 space-y-1">
                  <span className={`text-[9px] font-bold font-mono tracking-widest block uppercase ${
                    isActive ? 'text-[#2F6DFF]' : 'text-slate-400'
                  }`}>
                    STEP {step.number}
                  </span>
                  <h4 className={`text-xs font-bold leading-tight line-clamp-1 ${
                    isActive ? 'text-[#081B8C]' : 'text-gray-700'
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 leading-snug line-clamp-1 max-w-[130px] mx-auto">
                    {step.shortDesc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Vertical Timeline (Mobile / Tablet View) */}
      <div className="block lg:hidden space-y-4">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeStep;
          
          return (
            <div
              key={step.number}
              className={`border rounded-2xl p-5 transition-all duration-300 ${
                isActive
                  ? 'bg-white border-[#2F6DFF] shadow-lg shadow-[#2F6DFF]/5'
                  : 'bg-white/60 border-[#DCE7FF]/60 hover:bg-white hover:border-[#2F6DFF]/40'
              }`}
            >
              <button
                onClick={() => setActiveStep(idx)}
                className="w-full flex items-center justify-between text-left focus:outline-none cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl border ${step.bg} ${step.color} ${step.border}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold font-mono tracking-widest text-[#2F6DFF] uppercase block">
                      STEP {step.number}
                    </span>
                    <h4 className="text-sm font-bold text-[#081B8C] font-display">
                      {step.title}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium">
                      {step.shortDesc}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                  isActive ? 'rotate-180 text-[#2F6DFF]' : ''
                }`} />
              </button>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-4 pt-4 border-t border-slate-100"
                  >
                    <ul className="space-y-2.5 list-none pl-0">
                      {step.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex gap-2.5 items-start text-xs text-gray-600 leading-relaxed">
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${step.color} bg-current`} />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 3. Detailed Step Display Area (Desktop Active View) */}
      <div className="hidden lg:block bg-white border border-[#DCE7FF]/60 rounded-3xl p-8 shadow-xs relative overflow-hidden min-h-[220px]">
        {/* Small corner shine */}
        <div className={`absolute top-0 right-0 w-32 h-32 ${STEPS[activeStep].bg} blur-2xl rounded-full opacity-60`} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10"
          >
            {/* Step summary & icon (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl border ${STEPS[activeStep].bg} ${STEPS[activeStep].color} ${STEPS[activeStep].border} shadow-sm`}>
                  {React.createElement(STEPS[activeStep].icon, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <span className="text-[10px] font-bold font-mono tracking-widest text-[#2F6DFF] uppercase block">
                    STAGE {STEPS[activeStep].number} OF 07
                  </span>
                  <h3 className="text-xl font-extrabold text-[#081B8C] font-display">
                    {STEPS[activeStep].title}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Our operations partners and college-educated specialist squads follow strict SOP compliance to guarantee a smooth transitions pipeline at this stage.
              </p>
            </div>

            {/* Step details bullets (7 cols) */}
            <div className="md:col-span-7 bg-[#F8FAFF] border border-[#DCE7FF]/30 p-6 rounded-2xl self-stretch flex flex-col justify-center">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 font-mono mb-3 block">
                Workflow Tasks & Checkpoints
              </span>
              <ul className="space-y-3 list-none pl-0">
                {STEPS[activeStep].details.map((detail, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${STEPS[activeStep].color} bg-current`} />
                    <span className="text-xs text-gray-700 leading-relaxed font-medium">
                      {detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
