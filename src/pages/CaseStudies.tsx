import React, { useState, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Award,
  DollarSign,
  ChevronDown,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  ArrowUpRight
} from 'lucide-react';
import { PageType, CaseStudy } from '../types';
import { CASE_STUDIES } from '../data';

interface CaseStudiesProps {
  setCurrentPage: (page: PageType) => void;
}

function MetricCounter({ value, duration = 1200 }: { value: string; duration?: number }) {
  const numericStr = value.replace(/[^0-9.]/g, '');
  const prefix = value.match(/^[^0-9.]+/)?.[0] || '';
  const suffix = value.match(/[^0-9.%+xKMGTa-zA-Z\s]+$/)?.[0] || value.slice(prefix.length + numericStr.length);
  const numericValue = parseFloat(numericStr);

  if (isNaN(numericValue)) {
    return <span>{value}</span>;
  }

  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = numericValue;
    const totalMs = duration;
    const incrementTime = 16; // ~60fps
    const steps = totalMs / incrementTime;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [numericValue, duration]);

  const isDecimal = numericStr.includes('.');
  const formattedCount = isDecimal ? count.toFixed(1) : Math.floor(count);

  return (
    <span>
      {prefix}
      {formattedCount}
      {suffix}
    </span>
  );
}

function ThreeDStudyCard({
  study,
  isSelected,
  sIdx,
  onSelect,
  rotateVal,
  translateXVal,
  translateYVal,
  zIndexVal
}: {
  key?: string;
  study: CaseStudy;
  isSelected: boolean;
  sIdx: number;
  onSelect: () => void;
  rotateVal: number;
  translateXVal: number;
  translateYVal: number;
  zIndexVal: number;
}) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Smooth tilt effect
    const rotateXValue = ((centerY - y) / centerY) * 12;
    const rotateYValue = ((x - centerX) / centerX) * 12;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        zIndex: zIndexVal,
        perspective: 1200,
        transformStyle: "preserve-3d"
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: isSelected ? 1.05 : 0.92,
        rotate: isSelected ? 0 : rotateVal,
        x: isSelected ? 0 : translateXVal,
        y: isSelected ? -20 : translateYVal,
        rotateX: isSelected ? rotateX : 0,
        rotateY: isSelected ? rotateY : 0,
        filter: isSelected ? "blur(0px)" : "blur(1.5px)",
      }}
      whileHover={{
        scale: isSelected ? 1.08 : 0.96,
        filter: "blur(0px)",
        y: isSelected ? -28 : translateYVal - 8,
        transition: { type: "spring", stiffness: 300, damping: 18 }
      }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className={`absolute w-[360px] p-[1.5px] rounded-3xl cursor-pointer bg-gradient-to-br transition-all duration-300 shadow-xl ${
        isSelected
          ? 'from-[#2F6DFF] via-[#A93DFF] to-emerald-400 shadow-2xl shadow-[#2F6DFF]/20'
          : 'from-[#DCE7FF] via-slate-100 to-[#DCE7FF]/50 hover:from-[#2F6DFF] hover:to-[#A93DFF]'
      }`}
    >
      <div 
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
        className="bg-white rounded-[22px] p-6 h-[320px] flex flex-col justify-between relative overflow-hidden group"
      >
        {/* Glass reflections & glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-[#2F6DFF]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Card top bar */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-3 relative z-10">
          <span className="text-[9px] font-extrabold uppercase text-[#2F6DFF] tracking-widest bg-[#2F6DFF]/5 px-2.5 py-1 rounded-md border border-[#DCE7FF]/60">
            {study.industry}
          </span>
          <span className="font-mono text-[9px] text-gray-400 font-bold uppercase">
            ID: 0{sIdx + 1}
          </span>
        </div>

        {/* Client and Title */}
        <div className="space-y-2 relative z-10 text-left" style={{ transform: "translateZ(40px)" }}>
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest leading-none">
            {study.client}
          </p>
          <h3 className="text-base font-bold text-[#081B8C] font-display group-hover:text-[#2F6DFF] transition-colors leading-snug tracking-tight line-clamp-3">
            {study.title}
          </h3>
        </div>

        {/* Primary Outcome Metric Display */}
        <div className="bg-slate-50 border border-[#DCE7FF]/40 p-4 rounded-xl flex justify-between items-center relative overflow-hidden z-10" style={{ transform: "translateZ(20px)" }}>
          <div className="text-left">
            <p className="text-[8px] text-gray-400 uppercase font-bold tracking-wider">PRIMARY OUTCOME</p>
            <p className="text-xl font-extrabold text-[#081B8C] font-mono mt-0.5">
              <MetricCounter value={study.metricValue} />
            </p>
          </div>
          <span className="text-[9px] font-mono font-bold text-gray-500 bg-white border border-[#DCE7FF]/40 px-2 py-0.5 rounded-md">
            {study.metricLabel}
          </span>
        </div>

        {/* Trigger action bar */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#081B8C] relative z-10">
          <span>{isSelected ? 'Active Study Overview' : 'Click to View Blueprint'}</span>
          <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#2F6DFF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}

export default function CaseStudies({ setCurrentPage }: CaseStudiesProps) {
  const [activeStudy, setActiveStudy] = useState<string | null>('mga-transformation');

  return (
    <div className="bg-[#F8FAFF] font-sans text-[#111827] min-h-screen">
      
      {/* Premium Enterprise Hero Section */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden py-16 lg:py-24 bg-white border-b border-[#DCE7FF]/60">
        {/* Ambient decorative glow elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#2F6DFF]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#A93DFF]/5 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Subtly moving particles/grid overlay */}
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left side: Eyebrow, Heading, Description, CTA */}
            <div className="lg:col-span-6 space-y-8 text-left">
              <div className="inline-flex items-center gap-2 bg-[#DCE7FF]/50 border border-[#DCE7FF] px-3.5 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#2F6DFF] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#081B8C]">
                  Operational Excellence
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-[#081B8C] leading-none">
                Enterprise <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2F6DFF] to-[#A93DFF]">Case Studies</span>
              </h1>
              
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-xl">
                Examine verified results showing how Going Technologies partners with US insurance firms and startups to drive premium volume, save hours of manual labor, and minimize software-overhead.
              </p>

              {/* Lead Capture or Request CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    setCurrentPage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto text-center cursor-pointer bg-[#081B8C] hover:bg-[#2F6DFF] text-white px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 group"
                >
                  <span>Book Operational Audit</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto text-center cursor-pointer bg-white border border-[#DCE7FF] hover:border-[#2F6DFF] text-[#081B8C] px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 shadow-xs flex items-center justify-center gap-2"
                >
                  Request Case Reference Deck
                </button>
              </div>

              {/* Trust Footprint */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-gray-400 font-bold uppercase tracking-wider pt-2">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> SOC 2 Audited</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> HIPAA Compliant</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% SLA Attainment</span>
              </div>
            </div>

            {/* Right side: Interactive layered stack of case study cards & metrics */}
            <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[460px]">
              
              {/* Floating metrics display on desktop */}
              <div className="absolute top-0 right-4 z-40 bg-white/80 backdrop-blur-md border border-[#DCE7FF] px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2.5 hover:scale-105 transition-transform pointer-events-none hidden sm:flex">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">Max ROI Delivered</p>
                  <p className="text-sm font-extrabold text-[#081B8C] font-mono">+60% Savings</p>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 z-40 bg-white/80 backdrop-blur-md border border-[#DCE7FF] px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2.5 hover:scale-105 transition-transform pointer-events-none hidden sm:flex">
                <div className="p-2 bg-purple-50 rounded-xl text-[#A93DFF]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">Process Speedup</p>
                  <p className="text-sm font-extrabold text-[#081B8C] font-mono">&lt; 15 Mins SLA</p>
                </div>
              </div>

              {/* Overlapping Deck container (Desktop) */}
              <div className="w-full max-w-[500px] h-[360px] relative hidden sm:flex items-center justify-center">
                {CASE_STUDIES.map((study, sIdx) => {
                  const isSelected = activeStudy === study.id;
                  
                  // Configuration for the fanning / layered stacked layout
                  let rotateVal = 0;
                  let translateXVal = 0;
                  let translateYVal = 0;
                  let zIndexVal = 10;

                  // Let's make a beautiful 3-card stack that sits nicely on the right side of the hero
                  if (sIdx === 0) {
                    rotateVal = -6;
                    translateXVal = -60;
                    translateYVal = 10;
                    zIndexVal = isSelected ? 30 : 10;
                  } else if (sIdx === 1) {
                    rotateVal = 0;
                    translateXVal = 0;
                    translateYVal = -10;
                    zIndexVal = isSelected ? 30 : 20;
                  } else if (sIdx === 2) {
                    rotateVal = 6;
                    translateXVal = 60;
                    translateYVal = 10;
                    zIndexVal = isSelected ? 30 : 10;
                  }

                  return (
                    <ThreeDStudyCard
                      key={study.id}
                      study={study}
                      isSelected={isSelected}
                      sIdx={sIdx}
                      onSelect={() => setActiveStudy(study.id)}
                      rotateVal={rotateVal}
                      translateXVal={translateXVal}
                      translateYVal={translateYVal}
                      zIndexVal={zIndexVal}
                    />
                  );
                })}
              </div>

              {/* Mobile select-list for cards */}
              <div className="grid grid-cols-1 gap-4 w-full sm:hidden">
                {CASE_STUDIES.map((study, sIdx) => {
                  const isSelected = activeStudy === study.id;
                  return (
                    <button
                      key={study.id}
                      onClick={() => setActiveStudy(study.id)}
                      className={`p-4 rounded-2xl text-left border transition-all duration-300 flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#2F6DFF] shadow-md'
                          : 'bg-[#F8FAFF] border-gray-200 hover:bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold uppercase text-[#2F6DFF] tracking-wider bg-[#2F6DFF]/5 px-2 py-0.5 rounded">
                          {study.industry}
                        </span>
                        <h4 className="text-sm font-bold text-[#081B8C] leading-snug">{study.title}</h4>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isSelected ? 'rotate-180 text-[#2F6DFF]' : ''}`} />
                    </button>
                  );
                })}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Main Studies Deck - Premium 21st.dev "Display Cards" implementation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center">

        {/* Detailed Expansions panel (Rendered below cards based on selection) */}
        <div className="mt-4 w-full">
          <AnimatePresence mode="wait">
            {activeStudy && (
              <motion.div
                key={activeStudy}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-[#DCE7FF] rounded-2xl p-8 lg:p-12 shadow-sm space-y-10"
              >
                {/* Header overview */}
                {(() => {
                  const study = CASE_STUDIES.find((s) => s.id === activeStudy)!;
                  return (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-gray-100 items-baseline">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">PARTNER CLIENT</p>
                          <h4 className="text-lg font-bold text-[#081B8C] mt-0.5">{study.client}</h4>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">BUSINESS SECTOR</p>
                          <h4 className="text-lg font-bold text-gray-800 mt-0.5">{study.industry}</h4>
                        </div>
                        <div className="bg-[#F8FAFF] border border-[#DCE7FF] p-4 rounded-xl flex items-center justify-between w-full">
                          <div>
                            <p className="text-[10px] text-[#2F6DFF] uppercase font-bold tracking-wider">FINANCIAL ROI</p>
                            <h4 className="text-xl font-extrabold text-[#081B8C] mt-0.5">
                              <MetricCounter value={study.roi} />
                            </h4>
                          </div>
                          <TrendingUp className="w-6 h-6 text-[#2F6DFF]" />
                        </div>
                      </div>

                      {/* Challenge & Solution Side-by-side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-[#081B8C] uppercase tracking-wider border-b border-gray-100 pb-2">The Operational Challenge</h4>
                          <p className="text-gray-500 text-xs leading-relaxed">{study.challenge}</p>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-[#081B8C] uppercase tracking-wider border-b border-gray-100 pb-2">Our Strategic Response</h4>
                          <p className="text-gray-500 text-xs leading-relaxed">{study.solution}</p>
                        </div>
                      </div>

                      {/* Execution Phases (Numbered steps) */}
                      <div className="space-y-6">
                        <div className="flex justify-between items-baseline border-b border-gray-100 pb-2">
                          <h4 className="text-xs font-bold text-[#081B8C] uppercase tracking-wider">Implementation Phases</h4>
                          <span className="text-[10px] font-semibold text-gray-400 sm:hidden">Swipe left/right →</span>
                        </div>
                        <div className="flex overflow-x-auto pb-4 gap-6 snap-x scrollbar-thin scrollbar-thumb-gray-200">
                          {study.implementation.map((step, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: 20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: idx * 0.1 }}
                              className="bg-[#F8FAFF] border border-[#DCE7FF]/50 p-6 rounded-xl relative overflow-hidden min-w-[260px] sm:min-w-[280px] lg:flex-1 snap-align-start transition-all hover:border-[#2F6DFF]/30 hover:shadow-xs"
                            >
                              <span className="absolute top-2 right-4 text-4xl font-extrabold text-[#DCE7FF]/40 font-mono">0{idx + 1}</span>
                              <p className="text-xs text-gray-500 leading-relaxed font-medium relative z-10">{step}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Detailed Bullet Outcomes */}
                      <div className="space-y-6 bg-[#F8FAFF] border border-[#DCE7FF]/40 rounded-xl p-8">
                        <h4 className="text-xs font-bold text-[#081B8C] uppercase tracking-wider">Transformational Outcomes</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 list-none pl-0">
                          {study.results.map((res, idx) => (
                            <li key={idx} className="flex gap-2.5 items-start">
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-xs text-gray-600 leading-relaxed font-semibold">{res}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Brief Action Box */}
                      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-8 gap-4">
                        <div className="text-left space-y-1">
                          <p className="text-xs font-bold text-[#081B8C]">Could your agency benefit from a similar transformation?</p>
                          <p className="text-gray-400 text-[10px]">Onboarding takes as little as 14-21 days under direct US executive supervision.</p>
                        </div>
                        <button
                          onClick={() => {
                            setCurrentPage('contact');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="cursor-pointer bg-[#081B8C] hover:bg-[#2F6DFF] text-white font-bold text-xs px-6 py-3 rounded-full flex items-center gap-1.5 transition-colors shadow-md group"
                        >
                          <span>Request Case Reference Deck</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* NEW SECTION: Industry-Specific Portfolios */}
        <section className="mt-24 pt-16 border-t border-[#DCE7FF]/60 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Custom Alignments</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#081B8C] tracking-tight">
              Industry-Specific Portfolios & Blueprints
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
              We engineer custom, carrier-aligned operational models tailored to the exact regulatory and process constraints of your industry segment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Managing General Agents (MGAs)",
                metric: "99.98% Accuracy",
                metricLabel: "Policy Issuance SLA",
                desc: "Overnight policy indexing, binder checks, compliance audits, and seamless surplus lines filing.",
                icon: <ShieldCheck className="w-5 h-5 text-[#081B8C]" />,
                color: "from-[#081B8C]/5 to-[#2F6DFF]/5",
                badge: "Carrier-Grade"
              },
              {
                title: "Retail Insurance Agencies",
                metric: "82% Hours Saved",
                metricLabel: "Back-Office Delegation",
                desc: "Certificate of Insurance (COI) issuance, quote sheet updates, and multi-carrier renewal prep.",
                icon: <Building className="w-5 h-5 text-[#2F6DFF]" />,
                color: "from-[#2F6DFF]/5 to-[#4AB7FF]/5",
                badge: "Producer-Focus"
              },
              {
                title: "InsurTech Startups",
                metric: "60% Budget Reclaimed",
                metricLabel: "Operating Cost Saved",
                desc: "High-velocity Human-in-the-Loop data cleansing, OCR verification queues, and API sync audits.",
                icon: <TrendingUp className="w-5 h-5 text-[#A93DFF]" />,
                color: "from-[#A93DFF]/5 to-[#2F6DFF]/5",
                badge: "API-Driven"
              },
              {
                title: "Wholesale Brokerages",
                metric: "12-Min Dispatch",
                metricLabel: "Urgent COI Issuance",
                desc: "Clearing complex multi-layered surplus lines accounts and updating policy endorsements in real-time.",
                icon: <Award className="w-5 h-5 text-[#4AB7FF]" />,
                color: "from-[#4AB7FF]/5 to-[#081B8C]/5",
                badge: "High-Volume"
              }
            ].map((port, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#DCE7FF] rounded-2xl p-6 shadow-xs relative overflow-hidden group hover:border-[#2F6DFF] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Accent glow */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${port.color} opacity-40 blur-2xl rounded-full pointer-events-none`} />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-[#F8FAFF] rounded-xl w-fit group-hover:bg-[#DCE7FF]/40 transition-colors">
                      {port.icon}
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#2F6DFF] bg-[#DCE7FF]/40 px-2 py-0.5 rounded-full">
                      {port.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-[#081B8C] font-display">{port.title}</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{port.desc}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-end relative z-10">
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase font-bold tracking-wider">{port.metricLabel}</span>
                    <span className="text-base font-extrabold text-[#081B8C] font-mono tracking-tight">{port.metric}</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2F6DFF] opacity-30 group-hover:opacity-100 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}
