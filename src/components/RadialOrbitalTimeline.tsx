import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PhoneCall,
  ClipboardList,
  ShieldCheck,
  BookOpen,
  Rocket,
  CheckCircle2,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface TimelineNode {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  desc: string;
  deliverables: string[];
}

const TIMELINE_NODES: TimelineNode[] = [
  {
    id: 1,
    title: "Discovery Call",
    subtitle: "Strategic Alignment",
    icon: PhoneCall,
    desc: "A focused initial briefing to align on operational SLA parameters, identify domestic administrative bottlenecks, and establish your pilot program goals.",
    deliverables: ["Domestic overhead assessment", "SLA throughput mapping", "SOP feasibility preview"]
  },
  {
    id: 2,
    title: "Requirements Analysis",
    subtitle: "Workflow Engineering",
    icon: ClipboardList,
    desc: "A meticulous deep dive where our systems engineers audit your current AMS (Applied Epic, AMS360, EZLynx, etc.) and translate tribal knowledge into structured operational playbooks.",
    deliverables: ["Standard Operating Procedures (SOP)", "Quality assurance checklists", "Throughput quota definition"]
  },
  {
    id: 3,
    title: "Secure Onboarding",
    subtitle: "SOC 2 Type II Infrastructure",
    icon: ShieldCheck,
    desc: "Provisioning of zero-trust audited virtual desktops (VDI). Copy-paste and external storage are completely disabled, guaranteeing complete data sovereignty.",
    deliverables: ["Sandboxed Virtual Desktops", "Credential lock integration", "Session recording validation"]
  },
  {
    id: 4,
    title: "Knowledge Transfer",
    subtitle: "Specialist Team Training",
    icon: BookOpen,
    desc: "College-educated, carrier-aligned specialists undergo training on your specific underwriting criteria, certificate workflows, or renewal checklists.",
    deliverables: ["Carrier-licensed curriculum", "SOP mock run tests", "SLA benchmark dry runs"]
  },
  {
    id: 5,
    title: "Pilot Team Launch",
    subtitle: "SLA Validation Phase",
    icon: Rocket,
    desc: "A dedicated cohort processes real agency submissions in a closely monitored staging phase. We measure cycle speeds and review error-deviation margins in real-time.",
    deliverables: ["Live processing logs", "Real-time accuracy auditing", "SOP refinement loops"]
  },
  {
    id: 6,
    title: "Operations Go Live",
    subtitle: "Production Scale-Up",
    icon: CheckCircle2,
    desc: "We scale up to full production speed. Daily processing queues run continuously under the oversight of Six Sigma-trained QA supervisors.",
    deliverables: ["Dedicated team assignment", "Overnight backlog clearance", "Daily throughput reporting"]
  },
  {
    id: 7,
    title: "Continuous Optimization",
    subtitle: "Lean Six Sigma Efficiency",
    icon: TrendingUp,
    desc: "Proactive bottleneck analysis. We regularly integrate custom scripts, optical character parsing, and operational improvements to reduce average cycle times.",
    deliverables: ["Quarterly operational audits", "Bottleneck mitigation reports", "Data-accuracy certification"]
  }
];

export default function RadialOrbitalTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Calculate coordinates for nodes around a circle on desktop
  const getNodeCoordinates = (index: number, total: number, radius: number) => {
    // Start from top (-90 degrees) and rotate clockwise
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  const activeNode = TIMELINE_NODES[activeIndex];
  const ActiveIcon = activeNode.icon;

  return (
    <div className="w-full bg-white border border-[#DCE7FF]/80 rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-xs">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#2F6DFF]/3 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-[#081B8C]/4 blur-[120px] rounded-full pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Orbital Animation (Desktop) / Carousel Selector (Mobile) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px] relative">
          
          {/* DESKTOP ONLY: Radial Orbital Circle Layout */}
          <div className="hidden md:flex relative w-[360px] h-[360px] items-center justify-center">
            
            {/* Inner Ring Glow */}
            <div className="absolute w-[180px] h-[180px] rounded-full border border-[#2F6DFF]/10 bg-gradient-to-br from-[#F8FAFF] to-white flex items-center justify-center shadow-inner">
              <div className="absolute inset-2 rounded-full bg-[#081B8C]/5 animate-pulse" />
              <div className="text-center p-4 z-10">
                <span className="text-[10px] font-bold text-[#2F6DFF] tracking-widest uppercase block mb-1">
                  Step {activeNode.id} of 7
                </span>
                <span className="text-xs font-bold text-[#081B8C] uppercase tracking-wider block">
                  Delivery Orbit
                </span>
              </div>
            </div>

            {/* Orbit Circle Path */}
            <svg className="absolute w-full h-full pointer-events-none" viewBox="0 0 360 360">
              <circle
                cx="180"
                cy="180"
                r="120"
                fill="none"
                stroke="#DCE7FF"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="opacity-70"
              />
              {/* Rotating outer ring */}
              <motion.circle
                cx="180"
                cy="180"
                r="135"
                fill="none"
                stroke="url(#blue-gradient)"
                strokeWidth="1.5"
                strokeDasharray="10 40"
                animate={{ rotate: 360 }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              />
              <defs>
                <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2F6DFF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#081B8C" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>

            {/* Nodes Render */}
            {TIMELINE_NODES.map((node, idx) => {
              const { x, y } = getNodeCoordinates(idx, TIMELINE_NODES.length, 120);
              const NodeIcon = node.icon;
              const isActive = idx === activeIndex;

              return (
                <button
                  key={node.id}
                  onClick={() => setActiveIndex(idx)}
                  className="absolute cursor-pointer focus:outline-none group z-20"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    left: 'calc(50% - 22px)',
                    top: 'calc(50% - 22px)',
                  }}
                >
                  {/* Glowing connector ring when active */}
                  {isActive && (
                    <motion.div
                      layoutId="activeOrbitGlow"
                      className="absolute -inset-2.5 rounded-full bg-[#2F6DFF]/15 border border-[#2F6DFF]/30 blur-xs"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Circle body */}
                  <div
                    className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300 relative ${
                      isActive
                        ? 'bg-[#081B8C] border-[#081B8C] text-white shadow-lg scale-110'
                        : 'bg-white border-[#DCE7FF] text-[#081B8C] hover:border-[#2F6DFF] hover:bg-[#F8FAFF]'
                    }`}
                  >
                    <NodeIcon className="w-4 h-4" />
                    
                    {/* Tiny Step Number Badge */}
                    <span className={`absolute -top-1.5 -right-1.5 text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs border ${
                      isActive 
                        ? 'bg-[#2F6DFF] border-[#2F6DFF] text-white' 
                        : 'bg-white border-[#DCE7FF] text-gray-500'
                    }`}>
                      {node.id}
                    </span>
                  </div>

                  {/* Node Label Tooltip on Hover */}
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-md z-30">
                    {node.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* MOBILE & TABLET VIEW: Simple Slider Nodes Selector */}
          <div className="flex md:hidden flex-wrap justify-center gap-2 max-w-md">
            {TIMELINE_NODES.map((node, idx) => {
              const NodeIcon = node.icon;
              const isActive = idx === activeIndex;

              return (
                <button
                  key={node.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#081B8C] border-[#081B8C] text-white shadow-md'
                      : 'bg-white border-[#DCE7FF] text-[#081B8C] hover:bg-[#F8FAFF]'
                  }`}
                >
                  <NodeIcon className="w-3.5 h-3.5" />
                  <span>{node.id}. {node.title}</span>
                </button>
              );
            })}
          </div>

          {/* Connecting Line Flow Visualizer */}
          <div className="hidden md:flex mt-8 gap-1 items-center bg-[#F8FAFF] border border-[#DCE7FF]/50 rounded-full px-4 py-1.5 text-xs text-[#081B8C] font-semibold">
            <span>Discovery</span>
            <span className="text-gray-300">&rarr;</span>
            <span className={activeIndex >= 1 ? "text-[#2F6DFF]" : "text-gray-300"}>Analysis</span>
            <span className="text-gray-300">&rarr;</span>
            <span className={activeIndex >= 2 ? "text-[#2F6DFF]" : "text-gray-300"}>Onboarding</span>
            <span className="text-gray-300">&rarr;</span>
            <span className={activeIndex >= 4 ? "text-[#2F6DFF]" : "text-gray-300"}>Pilot</span>
            <span className="text-gray-300">&rarr;</span>
            <span className={activeIndex >= 5 ? "text-[#2F6DFF]" : "text-gray-300"}>Live</span>
          </div>

        </div>

        {/* Right Column: Display Active Step Details */}
        <div className="lg:col-span-6 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#F8FAFF] border border-[#DCE7FF]/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs relative"
            >
              {/* Subtle top-right watermark or icon */}
              <div className="absolute top-6 right-6 p-3 bg-white border border-[#DCE7FF]/40 rounded-xl text-[#2F6DFF] shadow-xs">
                <ActiveIcon className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-[#2F6DFF] uppercase tracking-widest block font-mono">
                  Phase 0{activeNode.id} — Operational Node
                </span>
                <h3 className="text-2xl font-bold text-[#081B8C] font-display">
                  {activeNode.title}
                </h3>
                <p className="text-sm text-gray-500 font-semibold italic">
                  {activeNode.subtitle}
                </p>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-5">
                {activeNode.desc}
              </p>

              <div className="space-y-3">
                <span className="text-[10px] font-bold text-[#081B8C] uppercase tracking-wider block">
                  Core Deliverables & Audits
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeNode.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-[#DCE7FF]/40 rounded-xl px-4 py-3 flex items-center gap-2 text-xs text-gray-700 shadow-xs hover:border-[#2F6DFF]/30 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#2F6DFF] shrink-0" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Quick Info Bar */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex gap-3.5 items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed font-medium">
              Every phase is bound by our strict <strong className="font-bold">SOC 2 Type II data security control matrix</strong>. Specialized agents operate within sandbox-isolated Virtual Desktop Infrastructures (VDI).
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-2">
            <button
              disabled={activeIndex === 0}
              onClick={() => setActiveIndex(prev => prev - 1)}
              className="px-4 py-2 rounded-lg border border-[#DCE7FF] text-xs font-bold text-[#081B8C] hover:bg-[#F8FAFF] disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer select-none transition-all"
            >
              &larr; Previous Phase
            </button>
            <button
              disabled={activeIndex === TIMELINE_NODES.length - 1}
              onClick={() => setActiveIndex(prev => prev + 1)}
              className="px-5 py-2 rounded-lg bg-[#081B8C] text-xs font-bold text-white hover:bg-[#2F6DFF] disabled:opacity-40 disabled:hover:bg-[#081B8C] cursor-pointer select-none transition-all"
            >
              Next Phase &rarr;
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
