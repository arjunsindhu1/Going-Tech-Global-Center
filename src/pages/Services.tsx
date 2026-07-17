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
  ChevronRight,
  AlertTriangle,
  HelpCircle,
  Clock,
  Database,
  Compass,
  ArrowRightLeft,
  Settings,
  Workflow,
  Zap,
  Check
} from 'lucide-react';
import { PageType } from '../types';
import { SERVICES_DATA } from '../data';
import InteractiveWorkflowVisualizer from '../components/InteractiveWorkflowVisualizer';
import SoftwareMarquee from '../components/SoftwareMarquee';

interface ServicesProps {
  setCurrentPage: (page: PageType) => void;
  activeServiceId: string;
  setActiveServiceId: (id: string) => void;
}

const challenges = [
  {
    title: 'Renewal Backlogs',
    symptom: 'Wholesale brokers place business with competitors when rate indications take over 24 hours.',
    cure: 'Our overnight processing teams enter, quote, and map submissions before your underwriters open.'
  },
  {
    title: 'Policy Processing Delays',
    symptom: 'Carrier binder checking backlogs delay policy deliveries, creating compliance risks.',
    cure: 'Dual-check automated indexing guarantees policy checking is cleared within tight 12-hour windows.'
  },
  {
    title: 'Administrative Overload',
    symptom: 'Producers spend 40% of their workday filling fields rather than speaking to prospective clients.',
    cure: 'Dedicated virtual BPO assistants manage certificates, policy checksheets, and ledger updates.'
  },
  {
    title: 'Data Management Issues',
    symptom: 'Critical client data is fragmented across emails, spreadsheets, and disconnected systems.',
    cure: 'We build custom cloud middleware and databases that act as a centralized single source of truth.'
  },
  {
    title: 'Operational Inefficiencies',
    symptom: 'Manual processing costs expand line-by-line as transaction volume grows.',
    cure: 'We inject advanced OCR and LLM intelligence to automate 85% of standard administrative entries.'
  },
  {
    title: 'Compliance Complexity',
    symptom: 'Continuous audits and licensing checks consume high internal hours and risk regulatory fines.',
    cure: 'Operations are strictly managed within dedicated SOC 2 Type II and HIPAA secure environments.'
  }
];

// Rich custom workflow timeline mappings for each core service
const serviceWorkflows: Record<string, { title: string; desc: string; icon: any }[]> = {
  'pc-insurance': [
    { title: 'Submission Intake', desc: 'Overnight inbox triage, risk file keying, and AMS account setup.', icon: FileText },
    { title: 'Underwriting Support', desc: 'Sourcing loss histories, rating prep, and hazard score checks.', icon: Layers },
    { title: 'Policy Checking', desc: 'Matching post-bind policy checklists against carrier binders.', icon: Shield },
    { title: 'COI & Endorsements', desc: 'On-demand certificate issuance and simple contract updates.', icon: Clock },
    { title: 'Renewals Audit', desc: '90-day lead outreach to secure payrolls, vehicles, and active logs.', icon: TrendingUp }
  ],
  'life-insurance': [
    { title: 'Case Intake', desc: 'Standardizing submission sheets and starting secure medical files.', icon: FileText },
    { title: 'Proactive APS Chasing', desc: 'Active phone & portal clinics follow-up to acquire medical records.', icon: Users },
    { title: 'Clinical APS Indexing', desc: 'Organizing complex multi-page health papers chronologically by doctor.', icon: Layers },
    { title: 'Exam Coordination', desc: 'Scheduling medical assessments with agents and end-clients.', icon: Clock },
    { title: 'Underwriter Delivery', desc: 'Supplying complete, pre-vetted case dossiers to decision-makers.', icon: CheckCircle2 }
  ],
  'healthcare': [
    { title: 'Census Roster Sanitization', desc: 'Standardizing messy employer Excel census lists into unified tables.', icon: Layers },
    { title: 'Prior Authorization Run', desc: 'Evaluating care codes against carrier rules and filing authorizations.', icon: FileText },
    { title: 'Eligibility Check', desc: 'Validating real-time active coverage limits across central portals.', icon: Shield },
    { title: 'Claims pre-Screening', desc: 'Reviewing diagnostic codes and provider referrals for system routing.', icon: Server },
    { title: 'Enrollment Sync', desc: 'Syncing hundreds of daily members into active benefits files.', icon: CheckCircle2 }
  ],
  'medicare': [
    { title: 'SOA Verification', desc: 'Logging and scoring Scope of Appointment forms within 4 hours.', icon: FileText },
    { title: 'Formulary Mapping', desc: 'Confirming client prescriptions against active carrier networks.', icon: Layers },
    { title: 'AEP Seasonal Scaling', desc: 'Expanding processing capacity 3x overnight during key cycles.', icon: Clock },
    { title: 'Recorded Call Audits', desc: 'Scoring advisor recordings against strict CMS compliance scripts.', icon: Shield },
    { title: 'Zero-Defect Filing', desc: 'Delivering audit-secure enrollments into provider portals.', icon: CheckCircle2 }
  ],
  'ai-automation': [
    { title: 'Cognitive Task Discovery', desc: 'Analyzing processing queues to detect high-volume workflow fit.', icon: Cpu },
    { title: 'Model Pipeline Sync', desc: 'Tuning private, isolated enterprise LLMs on custom document schemas.', icon: Sparkles },
    { title: 'Human Verification', desc: 'Deploying our 24/7 validation experts for sub-90s edge audits.', icon: Users },
    { title: 'RPA Movement', desc: 'Software bots securely indexing extracted fields into active databases.', icon: Layers },
    { title: 'Continuous Tuning', desc: 'Updating models using corrected data loops to scale overall speed.', icon: TrendingUp }
  ]
};

// Custom brand-aligned colors for software system pills
const getPlatformStyle = (platName: string) => {
  const norm = platName.toLowerCase();
  if (norm.includes('epic')) return 'border-blue-200 bg-blue-50/40 text-blue-800 hover:border-blue-300';
  if (norm.includes('ams360')) return 'border-indigo-200 bg-indigo-50/40 text-indigo-800 hover:border-indigo-300';
  if (norm.includes('lynx')) return 'border-cyan-200 bg-cyan-50/40 text-cyan-800 hover:border-cyan-300';
  if (norm.includes('hawksoft')) return 'border-purple-200 bg-purple-50/40 text-purple-800 hover:border-purple-300';
  if (norm.includes('agencyzoom')) return 'border-pink-200 bg-pink-50/40 text-pink-800 hover:border-pink-300';
  if (norm.includes('salesforce')) return 'border-sky-200 bg-sky-50/40 text-sky-800 hover:border-sky-300';
  if (norm.includes('ipipeline')) return 'border-violet-200 bg-violet-50/40 text-violet-800 hover:border-violet-300';
  if (norm.includes('smartoffice')) return 'border-teal-200 bg-teal-50/40 text-teal-800 hover:border-teal-300';
  if (norm.includes('python')) return 'border-amber-200 bg-amber-50/40 text-amber-800 hover:border-amber-300';
  if (norm.includes('uipath')) return 'border-orange-200 bg-orange-50/40 text-orange-800 hover:border-orange-300';
  return 'border-gray-200 bg-gray-50/50 text-gray-700 hover:border-gray-300';
};

const DIVISION_SOFTWARE: Record<string, { name: string; icon: string }[]> = {
  'pc-insurance': [
    { name: 'Applied Epic', icon: '⚡' },
    { name: 'AMS360', icon: '⚙️' },
    { name: 'EZLynx', icon: '🔗' },
    { name: 'HawkSoft', icon: '🦅' },
    { name: 'QQCatalyst', icon: '📊' },
    { name: 'IVANS', icon: '📡' },
    { name: 'AgencyZoom', icon: '📈' },
    { name: 'NowCerts', icon: '📝' },
    { name: 'Sagitta', icon: '🏛' }
  ],
  'life-insurance': [
    { name: 'iPipeline', icon: '🧬' },
    { name: 'FireLight', icon: '🔥' },
    { name: 'Ebix', icon: '🌐' },
    { name: 'FAST', icon: '⚡' },
    { name: 'Nexus', icon: '🔌' },
    { name: 'SmartOffice', icon: '💼' }
  ],
  'healthcare': [
    { name: 'Epic', icon: '🏥' },
    { name: 'Cerner', icon: '🩺' },
    { name: 'Athenahealth', icon: '🦅' },
    { name: 'eClinicalWorks', icon: '💻' },
    { name: 'NextGen Healthcare', icon: '🧬' },
    { name: 'Veradigm', icon: '💎' },
    { name: 'Meditech', icon: '💾' },
    { name: 'Greenway Health', icon: '🌱' }
  ],
  'medicare': [
    { name: 'HealthEdge', icon: '🩺' },
    { name: 'MHK', icon: '🛡' },
    { name: 'GuidingCare', icon: '💚' },
    { name: 'TruCare', icon: '🤝' },
    { name: 'Altruista', icon: '🌐' }
  ],
  'ai-automation': [
    { name: 'OpenAI', icon: '🤖' },
    { name: 'Anthropic', icon: '🧠' },
    { name: 'Google Gemini', icon: '✨' },
    { name: 'Microsoft Copilot', icon: '🚀' },
    { name: 'n8n', icon: '🐙' },
    { name: 'Make', icon: '🧱' },
    { name: 'Zapier', icon: '⚡' },
    { name: 'UiPath', icon: '⚙️' }
  ]
};

export default function Services({ setCurrentPage, activeServiceId, setActiveServiceId }: ServicesProps) {
  const [activeTab, setActiveTab] = useState<string>(activeServiceId || 'property-casualty');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<number>(0);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [hoveredSopStep, setHoveredSopStep] = useState<number | null>(null);

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
    setActiveStageIndex(0);
    setHoveredSopStep(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentWorkflow = serviceWorkflows[activeService.id] || serviceWorkflows['pc-insurance'];

  return (
    <div className="bg-[#F8FAFF] font-sans text-[#111827] min-h-screen">
      
      {/* Service Header */}
      <section className="bg-white border-b border-[#DCE7FF]/60 py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#2F6DFF]/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#A93DFF]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF] bg-[#2F6DFF]/5 px-3.5 py-1.5 rounded-full border border-[#DCE7FF]">
            Enterprise Capabilities
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-[#081B8C] tracking-tight">
            Our 5 Core Specialized Services
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
            Toggle between our core divisions below to examine interactive operational blueprints, system support pipelines, metrics, and compliance guidelines.
          </p>
        </div>
      </section>

      {/* Main Interactive Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
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

          {/* Left Sidebar Menu: 5 Services (Desktop Only) */}
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
                className="space-y-32"
              >
                
                {/* Active Service Title Banner */}
                <div className="bg-white border border-[#DCE7FF] rounded-2xl p-10 lg:p-16 shadow-sm space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#2F6DFF]/5 blur-3xl rounded-full" />
                  <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#A93DFF]/5 blur-2xl rounded-full" />
                  
                  <div className="flex items-center gap-3 bg-[#F8FAFF] border border-[#DCE7FF]/40 px-3 py-1 rounded-md w-fit text-[11px] font-bold text-[#081B8C] uppercase tracking-wide relative z-10">
                    {getIcon(activeService.iconName)}
                    <span>Division // Active Overview</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#081B8C] tracking-tight relative z-10">
                    {activeService.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed border-l-4 border-[#2F6DFF] pl-4 relative z-10">
                    {activeService.shortDesc}
                  </p>
                </div>

                {/* Problem vs Solution Split Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Problem */}
                  <div className="bg-white border border-red-100 rounded-2xl p-10 lg:p-12 shadow-xs space-y-4 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 blur-xl rounded-full" />
                    <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider relative z-10">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>The Pain Point</span>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed relative z-10 font-medium">
                      {activeService.problem}
                    </p>
                  </div>

                  {/* Solution */}
                  <div className="bg-white border border-emerald-100 rounded-2xl p-10 lg:p-12 shadow-xs space-y-4 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 blur-xl rounded-full" />
                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider relative z-10">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>The Operational Response</span>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed relative z-10 font-medium">
                      {activeService.solution}
                    </p>
                  </div>
                </div>

                {/* REDESIGN 1: STORYTELLING INTERACTIVE PROCESS MAP */}
                <div className="bg-white border border-[#DCE7FF] rounded-3xl p-12 lg:p-16 shadow-sm space-y-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#2F6DFF]/3 blur-3xl rounded-full pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-100 pb-6">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#2F6DFF] uppercase tracking-widest font-mono">Interactive Map</span>
                      <h3 className="text-xl font-bold font-display text-[#081B8C]">
                        Standard Process Sequence
                      </h3>
                    </div>
                    <span className="text-[11px] bg-[#DCE7FF]/30 border border-[#DCE7FF]/50 text-[#081B8C] px-3 py-1 rounded-full font-bold">
                      Click stages on path to explore operations story
                    </span>
                  </div>

                  {/* SVG Map Track */}
                  <div className="relative py-4 select-none">
                    {/* SVG Progress Line */}
                    <div className="absolute top-1/2 left-0 w-full h-[3px] bg-gray-100 transform -translate-y-1/2 z-0 hidden md:block rounded-full">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-[#2F6DFF] to-[#A93DFF]"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(activeStageIndex / 4) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                      {currentWorkflow.map((flowStep, index) => {
                        const StepIcon = flowStep.icon;
                        const isSelected = activeStageIndex === index;
                        return (
                          <div
                            key={index}
                            onClick={() => setActiveStageIndex(index)}
                            className="cursor-pointer flex flex-col items-center text-center group"
                          >
                            {/* Glow node circle */}
                            <motion.div
                              animate={{
                                scale: isSelected ? 1.15 : 1,
                                boxShadow: isSelected ? '0 0 20px rgba(47, 109, 255, 0.4)' : 'none'
                              }}
                              className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 relative z-10 ${
                                isSelected
                                  ? 'bg-[#081B8C] border-[#2F6DFF] text-white'
                                  : 'bg-white border-[#DCE7FF] text-gray-400 group-hover:border-[#2F6DFF] group-hover:text-[#081B8C]'
                              }`}
                            >
                              <StepIcon className="w-5 h-5" />
                              <div className="absolute -top-2 -right-2 bg-slate-100 text-gray-500 font-mono text-[9px] w-5 h-5 rounded-full flex items-center justify-center border border-gray-200">
                                {index + 1}
                              </div>
                            </motion.div>
                            <span className={`text-[10px] font-bold tracking-wider mt-3 uppercase transition-colors ${
                              isSelected ? 'text-[#081B8C] font-extrabold' : 'text-gray-400 group-hover:text-[#081B8C]'
                            }`}>
                              {flowStep.title.split(' ')[0]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Step Showcase Storytelling Panel */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStageIndex}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="bg-slate-50/70 border border-[#DCE7FF]/60 rounded-2xl p-8 lg:p-10 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#2F6DFF]/5 blur-xl rounded-full" />
                      
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#2F6DFF] bg-[#2F6DFF]/5 border border-[#DCE7FF] px-2.5 py-1 rounded-md uppercase font-mono">
                            Stage 0{activeStageIndex + 1} // Standard Procedure
                          </span>
                        </div>
                        <h4 className="text-2xl font-extrabold text-[#081B8C] font-display">
                          {currentWorkflow[activeStageIndex].title}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {currentWorkflow[activeStageIndex].desc}
                        </p>
                      </div>

                      <div className="w-full md:w-[280px] bg-white border border-gray-100 rounded-xl p-5 shrink-0 space-y-4">
                        <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest block">Operations Delivery Detail</span>
                        <div className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-gray-500 leading-normal">Fully customized inside your CRM, AMS, or databases under strict supervision.</p>
                        </div>
                        <div className="flex items-start gap-2.5 border-t border-gray-100 pt-3">
                          <Shield className="w-4 h-4 text-[#2F6DFF] shrink-0 mt-0.5" />
                          <p className="text-[11px] text-gray-500 leading-normal">SOC 2 compliant channel with private VDI safeguards enabled.</p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* REDESIGN 2: KEY SERVICES PERFORMED (Interactive SaaS Workflow Visualizer) */}
                <InteractiveWorkflowVisualizer keyServices={activeService.keyServices} serviceName={activeService.title} />

                {/* REDESIGN 3: SUPPORTED SYSTEMS & SOFTWARE (Logo/Platform Pills with custom styles) */}
                <div className="bg-white border border-[#DCE7FF] rounded-3xl p-10 lg:p-12 shadow-sm space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />
                  
                  <div className="border-b border-gray-100 pb-4">
                    <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest font-mono">Systems Security</span>
                    <h3 className="text-xl font-bold font-display text-[#081B8C]">
                      Supported Software & Platforms
                    </h3>
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                    Our staff are certified specialists operating directly within your operations tools under strict zero-trust operational pipelines. Hover to highlight.
                  </p>

                  {/* Division Software Layout (Infinite Scrolling Marquee with generous whitespace) */}
                  <div className="pt-2">
                    <SoftwareMarquee items={DIVISION_SOFTWARE[activeService.id] || DIVISION_SOFTWARE['pc-insurance']} />
                  </div>
                </div>

                {/* Key Strategic Benefits - Modern Cards */}
                <div className="bg-white border border-[#DCE7FF] rounded-2xl p-10 lg:p-16 shadow-sm space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#2F6DFF]/5 blur-2xl rounded-full" />
                  <h3 className="text-lg font-bold font-display text-[#081B8C] border-b border-gray-100 pb-4">
                    Key Strategic Benefits
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {activeService.benefits.map((benefit, index) => (
                      <div key={index} className="bg-[#F8FAFF] border border-gray-100 rounded-xl p-5 flex gap-3.5 items-start hover:bg-white hover:border-[#2F6DFF]/30 transition-all shadow-xs">
                        <div className="p-1.5 bg-[#2F6DFF]/10 text-[#2F6DFF] rounded-lg mt-0.5 shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-xs text-gray-600 leading-relaxed font-semibold">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SLA Outcomes & Verification Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {activeService.results.map((res, index) => (
                    <div key={index} className="bg-white border border-[#DCE7FF] rounded-2xl p-8 shadow-xs relative overflow-hidden text-center group hover:border-[#2F6DFF] transition-all duration-300">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#2F6DFF]/5 blur-xl rounded-full" />
                      <div className="text-3.5xl font-extrabold text-[#081B8C] font-mono tracking-tight group-hover:text-[#2F6DFF] transition-colors">{res.metric}</div>
                      <h4 className="text-xs font-bold text-gray-900 mt-2 mb-1 truncate">{res.label}</h4>
                      <p className="text-gray-400 text-[10px] leading-relaxed line-clamp-2">{res.context}</p>
                    </div>
                  ))}
                </div>

                {/* Service Specific FAQ Section */}
                <div className="bg-white border border-[#DCE7FF] rounded-2xl p-10 lg:p-16 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                    <HelpCircle className="w-5 h-5 text-[#2F6DFF]" />
                    <h3 className="text-lg font-bold font-display text-[#081B8C]">
                      Compliance & Operations FAQ
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {activeService.faqs.map((faq, index) => {
                      const isOpen = expandedFaq === index;
                      return (
                        <div key={index} className="border border-[#DCE7FF]/60 rounded-xl overflow-hidden transition-colors duration-200">
                          <button
                            onClick={() => setExpandedFaq(isOpen ? null : index)}
                            className="w-full text-left px-5 py-4 bg-[#F8FAFF] hover:bg-[#DCE7FF]/20 text-xs font-bold text-[#081B8C] flex justify-between items-center transition-colors cursor-pointer"
                          >
                            <span>{faq.question}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
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

                {/* Private Briefing CTA - Updated with CTA requirements */}
                <div className="bg-linear-to-r from-[#081B8C] via-[#1E3A8A] to-[#0A2540] rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 relative overflow-hidden shadow-xl border border-blue-900/30">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#2F6DFF]/15 blur-3xl rounded-full" />
                  <h3 className="text-2xl font-bold font-display relative z-10">Ready to Launch a Pilot Team for {activeService.title}?</h3>
                  <p className="text-white/80 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed relative z-10">
                    Connect with our operations architects. We will provide full documentation checklists, customize your standard operating procedures, and align certified specialists in our SOC2 compliance center.
                  </p>
                  <div className="pt-2 relative z-10">
                    <button
                      onClick={() => {
                        setCurrentPage('contact');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="cursor-pointer inline-flex items-center gap-2 bg-white text-[#081B8C] hover:bg-[#F8FAFF] hover:shadow-lg px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-300"
                    >
                      <span>Talk to Our Team</span>
                      <ArrowRight className="w-4 h-4 text-[#081B8C]" />
                    </button>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* SECTION: OPERATIONAL CHALLENGES (Pain Point Solver Board) - Migrated from Homepage */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#DCE7FF]/60 mt-24">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Operational Pain Points</h2>
          <p className="text-3xl sm:text-4xl font-bold font-display text-[#081B8C] tracking-tight">
            Stop Letting Bottlenecks Halt Your Enterprise Growth
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Running high-volume transaction centers is highly volatile. Click below to see how our targeted operations teams convert systematic hurdles into structural wins.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Challenges selector sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            {challenges.map((chal, idx) => (
              <button
                key={idx}
                onClick={() => setActiveChallenge(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  activeChallenge === idx
                    ? 'bg-white border-[#2F6DFF] shadow-md font-bold text-[#081B8C]'
                    : 'bg-transparent border-[#DCE7FF]/40 hover:bg-white text-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-mono font-bold ${activeChallenge === idx ? 'text-[#2F6DFF]' : 'text-gray-400'}`}>
                    0{idx + 1}
                  </span>
                  <span className="text-sm font-semibold">{chal.title}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeChallenge === idx ? 'text-[#2F6DFF] translate-x-1' : 'text-gray-300'}`} />
              </button>
            ))}
          </div>

          {/* Interactive display board */}
          <div className="lg:col-span-8 bg-white border border-[#DCE7FF] rounded-2xl p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden shadow-lg">
            {/* Top graphic accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A93DFF]/5 blur-2xl rounded-full" />

            <div className="space-y-8 relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-3 py-1 rounded-md">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Critical Bottleneck Symptom</span>
              </div>
              <h3 className="text-2xl font-bold text-[#081B8C] font-display">
                {challenges[activeChallenge].title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed italic bg-gray-50 p-5 rounded-xl border-l-4 border-red-400">
                "{challenges[activeChallenge].symptom}"
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold px-3 py-1 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>The Going Technologies Cure</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {challenges[activeChallenge].cure}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky / Prominent Business Tools CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 mt-16">
        <div className="bg-gradient-to-r from-[#081B8C] to-[#0A2540] rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl border border-blue-900">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2F6DFF]/15 blur-2xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#A93DFF]/10 blur-3xl rounded-full" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Growth & Savings Diagnostics
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display">
              Not sure how much you could save?
            </h3>
            <p className="text-white/80 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Use our interactive calculators and assessment tools to model your agency's operations and discover hidden payroll efficiencies.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setCurrentPage('business-tools');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-[#2F6DFF] to-[#1E4DFF] text-white hover:from-[#1E4DFF] hover:to-[#002DFF] px-6 py-3 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
              >
                <span>Try our free Business Tools</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
