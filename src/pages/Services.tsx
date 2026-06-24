import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Briefcase,
  Cpu,
  Sparkles,
  Layers,
  Users,
  Shield,
  Server,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { PageType, ServiceDetail } from '../types';
import { SERVICES_DATA } from '../data';

interface ServicesProps {
  setCurrentPage: (page: PageType) => void;
  activeServiceId: string;
  setActiveServiceId: (id: string) => void;
}

export default function Services({ setCurrentPage, activeServiceId, setActiveServiceId }: ServicesProps) {
  const [activeTab, setActiveTab] = useState<string>(activeServiceId || 'insurance-ops');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    if (activeServiceId) {
      setActiveTab(activeServiceId);
    }
  }, [activeServiceId]);

  const activeService = SERVICES_DATA.find((s) => s.id === activeTab) || SERVICES_DATA[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText className="w-5 h-5" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'Shield':
        return <Shield className="w-5 h-5" />;
      case 'Server':
        return <Server className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setActiveServiceId(id);
    setExpandedFaq(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#F8FAFF] font-sans text-[#111827] min-h-screen">
      
      {/* Service Header */}
      <section className="bg-white border-b border-[#DCE7FF]/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Enterprise Capabilities</span>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#081B8C] tracking-tight">
            Our 8 Core Specialized Services
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
            Toggle between our core divisions below to examine operational blueprints, onboarding processes, metrics, and service compliance guidelines.
          </p>
        </div>
      </section>

      {/* Main Interactive Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Mobile Select Dropdown (Mobile/Tablet Only) */}
          <div className="block lg:hidden w-full bg-white border border-[#DCE7FF] rounded-2xl p-4 shadow-sm mb-2">
            <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
              Select Operations Division
            </label>
            <div className="relative">
              <select
                value={activeTab}
                onChange={(e) => handleTabChange(e.target.value)}
                className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl p-3.5 text-xs font-bold text-[#081B8C] focus:outline-none focus:border-[#2F6DFF] appearance-none cursor-pointer pr-10"
              >
                {SERVICES_DATA.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#081B8C]">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Left Sidebar Menu: 8 Services (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-4 bg-white border border-[#DCE7FF] rounded-2xl p-4 shadow-sm space-y-1.5 lg:sticky lg:top-24">
            <div className="px-3 pb-3 mb-2 border-b border-gray-100 text-[10px] uppercase font-bold tracking-widest text-gray-400">
              Operations Divisions
            </div>
            {SERVICES_DATA.map((service) => {
              const isSelected = activeTab === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => handleTabChange(service.id)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl text-xs font-semibold flex items-center gap-3.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#081B8C] text-white shadow-md font-bold'
                      : 'bg-transparent text-gray-600 hover:bg-[#F8FAFF] hover:text-[#081B8C]'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {getIcon(service.iconName)}
                  </div>
                  <div className="flex-1">
                    <span className="block truncate">{service.title}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Workspace: Service Detail Display */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="space-y-8"
              >
                
                {/* Active Service Title Banner */}
            <div className="bg-white border border-[#DCE7FF] rounded-2xl p-8 lg:p-12 shadow-sm space-y-6 relative overflow-hidden">
              {/* Top gradient blur */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2F6DFF]/5 blur-2xl rounded-full" />
              
              <div className="flex items-center gap-3 bg-[#F8FAFF] border border-[#DCE7FF]/40 px-3 py-1 rounded-md w-fit text-[11px] font-bold text-[#081B8C] uppercase tracking-wide">
                {getIcon(activeService.iconName)}
                <span>Division // Active Overview</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#081B8C] tracking-tight">
                {activeService.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed border-l-4 border-[#2F6DFF] pl-4">
                {activeService.shortDesc}
              </p>
            </div>

            {/* Problem vs Solution Split Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem */}
              <div className="bg-white border border-red-100 rounded-2xl p-8 shadow-xs space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>The Pain Point</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {activeService.problem}
                </p>
              </div>

              {/* Solution */}
              <div className="bg-white border border-emerald-100 rounded-2xl p-8 shadow-xs space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>The Operational Response</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {activeService.solution}
                </p>
              </div>
            </div>

            {/* Benefits Cards */}
            <div className="bg-white border border-[#DCE7FF] rounded-2xl p-8 lg:p-12 shadow-sm space-y-6">
              <h3 className="text-base font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
                Key Strategic Benefits
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {activeService.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <CheckCircle2 className="w-4 h-4 text-[#2F6DFF] shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-600 leading-relaxed font-semibold">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Process Milestones */}
            <div className="bg-white border border-[#DCE7FF] rounded-2xl p-8 lg:p-12 shadow-sm space-y-8">
              <h3 className="text-base font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
                Onboarding & Delivery Process
              </h3>
              <div className="relative border-l border-[#DCE7FF] pl-6 space-y-8 ml-2">
                {activeService.process.map((step, index) => (
                  <div key={index} className="relative">
                    {/* step bubble */}
                    <div className="absolute left-[-35px] top-0 w-6 h-6 rounded-full bg-[#F8FAFF] border border-[#2F6DFF] flex items-center justify-center font-mono text-[10px] text-[#081B8C] font-bold">
                      {step.step}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[#081B8C] uppercase tracking-wide">{step.title}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SLA Outcomes & Verification Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {activeService.results.map((res, index) => (
                <div key={index} className="bg-white border border-[#DCE7FF] rounded-2xl p-6 shadow-xs relative overflow-hidden text-center">
                  <div className="text-3xl font-extrabold text-[#081B8C] font-mono tracking-tight">{res.metric}</div>
                  <h4 className="text-xs font-bold text-gray-900 mt-2 mb-1 truncate">{res.label}</h4>
                  <p className="text-gray-400 text-[10px] leading-relaxed line-clamp-2">{res.context}</p>
                </div>
              ))}
            </div>

            {/* Service Specific FAQ Section */}
            <div className="bg-white border border-[#DCE7FF] rounded-2xl p-8 lg:p-12 shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <HelpCircle className="w-5 h-5 text-[#2F6DFF]" />
                <h3 className="text-base font-bold uppercase tracking-wider text-gray-900">
                  Compliance & Operations FAQ
                </h3>
              </div>

              <div className="space-y-3">
                {activeService.faqs.map((faq, index) => {
                  const isOpen = expandedFaq === index;
                  return (
                    <div key={index} className="border border-[#DCE7FF]/60 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(isOpen ? null : index)}
                        className="w-full text-left px-5 py-4 bg-[#F8FAFF] hover:bg-[#DCE7FF]/20 text-xs font-bold text-[#081B8C] flex justify-between items-center transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white px-5 py-4 border-t border-gray-100 text-xs text-gray-500 leading-relaxed"
                          >
                            {faq.answer}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Private Briefing CTA */}
            <div className="bg-linear-to-r from-[#081B8C] to-[#2F6DFF] rounded-3xl p-8 text-center text-white space-y-6">
              <h3 className="text-xl font-bold font-display">Ready to Launch a Pilot Team for {activeService.title}?</h3>
              <p className="text-white/80 text-xs max-w-xl mx-auto leading-relaxed">
                Connect with our advisory consultants. We will provide detailed case parameters, set up custom workflow scopes, and align certified operators in our SOC2-compliant delivery center.
              </p>
              <button
                onClick={() => {
                  setCurrentPage('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer inline-flex items-center gap-1.5 bg-white text-[#081B8C] hover:bg-[#F8FAFF] px-6 py-3 rounded-full font-bold text-xs transition-colors"
              >
                <span>Draft Custom Service Contract</span>
                <ArrowRight className="w-4 h-4 text-[#081B8C]" />
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
