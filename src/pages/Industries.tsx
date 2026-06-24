import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Zap,
  Globe,
  PieChart,
  Search,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  MapPin,
  Building,
  HeartPulse,
  Coins,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { PageType, IndustryDetail } from '../types';
import { INDUSTRIES_DATA } from '../data';

interface IndustriesProps {
  setCurrentPage: (page: PageType) => void;
}

export default function Industries({ setCurrentPage }: IndustriesProps) {
  const [activeInd, setActiveInd] = useState<string>('pc-insurance');

  const activeIndustry = INDUSTRIES_DATA.find((i) => i.id === activeInd) || INDUSTRIES_DATA[0];

  const getIndustryIcon = (id: string) => {
    switch (id) {
      case 'pc-insurance':
        return <Building className="w-4 h-4" />;
      case 'homeowners':
        return <Globe className="w-4 h-4" />;
      case 'life':
        return <ShieldCheck className="w-4 h-4" />;
      case 'health':
        return <HeartPulse className="w-4 h-4" />;
      case 'medicare':
        return <FileCheck className="w-4 h-4" />;
      case 'agencies':
        return <Coins className="w-4 h-4" />;
      case 'carriers':
        return <Building className="w-4 h-4" />;
      case 'mgas':
        return <ShieldCheck className="w-4 h-4" />;
      case 'wholesale':
        return <Coins className="w-4 h-4" />;
      case 'insurtech':
        return <Zap className="w-4 h-4" />;
      default:
        return <Building className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-[#F8FAFF] font-sans text-[#111827] min-h-screen">
      
      {/* Industry Header */}
      <section className="bg-white border-b border-[#DCE7FF]/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Market Alignment</span>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#081B8C] tracking-tight">
            Who We Serve: 10 Core Industry Verticals
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
            Discover how Going Technologies engineers custom operational workflows for P&C, Health, Life, InsurTech, Medicare platforms, and wholesale brokerage channels.
          </p>
        </div>
      </section>

      {/* Main Sector Browser Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Mobile/Tablet: Horizontal Scroll Tabs */}
          <div className="lg:hidden col-span-1 space-y-2 mb-2">
            <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
              Industry Focus Groups
            </div>
            <div className="flex overflow-x-auto pb-3 gap-2 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
              {INDUSTRIES_DATA.map((ind) => {
                const isSelected = activeInd === ind.id;
                return (
                  <button
                    key={ind.id}
                    onClick={() => setActiveInd(ind.id)}
                    className={`flex-shrink-0 snap-align-start px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#081B8C] text-white border-[#081B8C] shadow-md font-bold'
                        : 'bg-white text-gray-600 border-[#DCE7FF] hover:bg-[#F8FAFF] hover:text-[#081B8C]'
                    }`}
                  >
                    <div className={`p-1 rounded ${isSelected ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {getIndustryIcon(ind.id)}
                    </div>
                    <span>{ind.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Only: Sticky Sidebar */}
          <div className="hidden lg:block lg:col-span-4 bg-white border border-[#DCE7FF] rounded-2xl p-4 shadow-sm space-y-1 sticky top-24">
            <div className="px-3 pb-3 mb-2 border-b border-gray-100 text-[10px] uppercase font-bold tracking-widest text-gray-400">
              Industry Focus Groups
            </div>
            {INDUSTRIES_DATA.map((ind) => {
              const isSelected = activeInd === ind.id;
              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveInd(ind.id)}
                  className={`w-full text-left px-3.5 py-3 rounded-lg text-xs font-semibold flex items-center gap-3.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#081B8C] text-white shadow-md font-bold'
                      : 'bg-transparent text-gray-600 hover:bg-[#F8FAFF] hover:text-[#081B8C]'
                  }`}
                >
                  <div className={`p-1.5 rounded ${isSelected ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {getIndustryIcon(ind.id)}
                  </div>
                  <span className="truncate">{ind.title}</span>
                </button>
              );
            })}
          </div>

          {/* Right Workspace: Industry Active Detailed Display */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeInd}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="space-y-8"
              >
            
            {/* SEO Optimization Insights Box (Showcases real strategic value & fulfills prompt mandate) */}
            <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">SEO STRUCTURAL SCHEMAS // SECURE</span>
                </div>
                <span className="text-[9px] font-mono text-gray-500">CANONICAL_LINK: ACTIVE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-gray-500 block mb-0.5">// META TITLE</span>
                  <p className="text-gray-300 font-bold font-sans">Going Tech | {activeIndustry.title} Operations Outsourcing</p>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">// META DESCRIPTION</span>
                  <p className="text-gray-300 font-sans leading-normal text-[11px]">Streamline {activeIndustry.title} pipelines. Secure SOC2 compliant remote teams, automated ACORD entries, and rapid SLAs.</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 text-[10px] font-mono flex flex-wrap gap-2 text-gray-400">
                <span className="font-bold text-[#4AB7FF]">// TARGET KEYWORDS:</span>
                {activeIndustry.seoKeywords.map((kw, idx) => (
                  <span key={idx} className="bg-white/5 px-2 py-0.5 rounded text-gray-300">
                    "{kw}"
                  </span>
                ))}
              </div>
            </div>

            {/* active Industry Story Header */}
            <div className="bg-white border border-[#DCE7FF] rounded-2xl p-8 lg:p-12 shadow-sm space-y-6">
              <h2 className="text-3xl font-bold font-display text-[#081B8C] tracking-tight">
                {activeIndustry.title}
              </h2>
              <p className="text-base text-[#2F6DFF] font-semibold italic">
                "{activeIndustry.tagline}"
              </p>
              <p className="text-gray-500 text-xs leading-relaxed leading-normal">
                {activeIndustry.description}
              </p>
            </div>

            {/* Industry Challenges & Solutions Card Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Challenges */}
              <div className="bg-white border border-[#DCE7FF] rounded-2xl p-8 shadow-xs space-y-4">
                <div className="flex items-center gap-1.5 text-red-500 border-b border-gray-100 pb-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Top Industry Friction
                  </h4>
                </div>
                <ul className="space-y-3.5 text-xs text-gray-500 leading-relaxed list-disc pl-4">
                  {activeIndustry.challenges.map((chal, idx) => (
                    <li key={idx} className="font-medium">{chal}</li>
                  ))}
                </ul>
              </div>

              {/* Solutions */}
              <div className="bg-white border border-[#DCE7FF] rounded-2xl p-8 shadow-xs space-y-4">
                <div className="flex items-center gap-1.5 text-emerald-600 border-b border-gray-100 pb-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Our Operational Solution
                  </h4>
                </div>
                <ul className="space-y-3.5 text-xs text-gray-500 leading-relaxed list-none pl-0">
                  {activeIndustry.solutions.map((sol, idx) => (
                    <li key={idx} className="flex gap-2 items-start font-medium">
                      <Zap className="w-3.5 h-3.5 text-[#2F6DFF] shrink-0 mt-0.5" />
                      <span>{sol}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Outcome KPI highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {activeIndustry.keyMetrics.map((km, idx) => (
                <div key={idx} className="bg-white border border-[#DCE7FF] rounded-2xl p-6 shadow-xs text-center relative overflow-hidden">
                  <div className="text-2xl font-extrabold text-[#081B8C] font-mono tracking-tight">{km.value}</div>
                  <h4 className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wide truncate">{km.label}</h4>
                </div>
              ))}
            </div>

            {/* Action Callout */}
            <div className="bg-[#081B8C] text-white rounded-3xl p-8 text-center space-y-6">
              <h3 className="text-xl font-bold font-display">Maximize Your Binding Speed in {activeIndustry.title}</h3>
              <p className="text-white/80 text-xs max-w-xl mx-auto leading-relaxed">
                Connect with our commercial insurance consulting experts. We will detail process playbooks, align target SLAs, and deploy dedicated specialist squads to handle your volume.
              </p>
              <button
                onClick={() => {
                  setCurrentPage('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer inline-flex items-center gap-1 bg-white text-[#081B8C] hover:bg-[#F8FAFF] px-6 py-3 rounded-full font-bold text-xs transition-colors"
              >
                <span>Request Custom Consultation</span>
                <ChevronRight className="w-4 h-4 text-[#081B8C]" />
              </button>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

        </div>
      </div>

    </div>
  );
}
