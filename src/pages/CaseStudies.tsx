import { useState, useEffect } from 'react';
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

export default function CaseStudies({ setCurrentPage }: CaseStudiesProps) {
  const [activeStudy, setActiveStudy] = useState<string | null>('mga-transformation');

  return (
    <div className="bg-[#F8FAFF] font-sans text-[#111827] min-h-screen">
      
      {/* Case Study Header */}
      <section className="bg-white border-b border-[#DCE7FF]/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Operational Excellence</span>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#081B8C] tracking-tight">
            Enterprise Case Studies
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
            Examine verified results showing how Going Technologies partners with US insurance firms and startups to drive premium volume, save hours of manual labor, and minimize software-overhead.
          </p>
        </div>
      </section>

      {/* Main Studies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {CASE_STUDIES.map((study) => {
            const isSelected = activeStudy === study.id;
            return (
              <div
                key={study.id}
                onClick={() => setActiveStudy(isSelected ? null : study.id)}
                className={`bg-white border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 relative ${
                  isSelected
                    ? 'border-[#2F6DFF] ring-2 ring-[#2F6DFF]/15 shadow-xl'
                    : 'border-[#DCE7FF] hover:border-[#2F6DFF]/50 hover:shadow-md'
                }`}
              >
                {/* Metric Header strip */}
                <div className="bg-[#F8FAFF] border-b border-[#DCE7FF]/60 px-6 py-4 flex justify-between items-center">
                  <span className="text-[10px] font-extrabold uppercase text-[#2F6DFF] tracking-wider bg-[#DCE7FF]/30 px-2.5 py-1 rounded">
                    {study.industry}
                  </span>
                  <span className="font-mono text-[9px] text-gray-400 font-bold uppercase">CASE_ID: {study.id.slice(0, 5).toUpperCase()}</span>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-base font-bold text-[#081B8C] font-display hover:text-[#2F6DFF] transition-colors leading-snug">
                    {study.title}
                  </h3>
                  <div className="flex justify-between items-baseline pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">PRIMARY METRIC</p>
                      <p className="text-xl font-extrabold text-[#081B8C] mt-0.5">
                        <MetricCounter value={study.metricValue} />
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-400">{study.metricLabel}</span>
                  </div>
                </div>

                {/* footer trigger button */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#081B8C] bg-white hover:bg-gray-50 transition-colors">
                  <span>{isSelected ? 'Collapse Operational Blueprint' : 'Examine Complete Transformation'}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isSelected ? 'rotate-180 text-[#2F6DFF]' : ''}`} />
                </div>
              </div>
            );
          })}

        </div>

        {/* Detailed Expansions panel (Rendered below cards based on selection) */}
        <div className="mt-12">
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
      </div>

    </div>
  );
}
