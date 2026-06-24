import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Users,
  Shield,
  Search,
  BookOpen,
  Briefcase,
  ChevronRight,
  Building,
  DollarSign,
  Award,
  Layers,
  FileText,
  FileCheck,
  ClipboardCheck,
  Quote,
  Sparkles,
  Star
} from 'lucide-react';
import { PageType } from '../types';
import { SERVICES_DATA, CASE_STUDIES, BLOG_POSTS } from '../data';

function AnimatedCounter({ value, duration = 1500 }: { value: string; duration?: number }) {
  const numericStr = value.replace(/[^0-9.]/g, '');
  const prefix = value.match(/^[^0-9.]+/)?.[0] || '';
  const suffix = value.match(/[^0-9.%+xKMGTa-zA-Z\s]+$/)?.[0] || value.slice(prefix.length + numericStr.length);
  const numericValue = parseFloat(numericStr);

  if (isNaN(numericValue)) {
    return <span>{value}</span>;
  }

  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
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
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [numericValue, duration, hasAnimated]);

  const isDecimal = numericStr.includes('.');
  const formattedCount = isDecimal ? count.toFixed(1) : Math.floor(count);

  return (
    <span ref={ref}>
      {prefix}
      {formattedCount}
      {suffix}
    </span>
  );
}

const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: 'Michael Anderson',
    role: 'Operations Director',
    company: 'Regional Insurance Agency',
    quote: 'Going Technologies helped us streamline several operational workflows and significantly improved turnaround times across our support processes.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    color: 'from-[#2F6DFF]/10 to-[#2F6DFF]/5',
    borderColor: 'hover:border-[#2F6DFF]/30',
    tagColor: 'text-[#2F6DFF] bg-[#2F6DFF]/5'
  },
  {
    id: 2,
    name: 'Jennifer Roberts',
    role: 'Agency Principal',
    company: 'Independent Brokerage',
    quote: 'The team quickly adapted to our requirements and provided dependable operational support that allowed our staff to focus on growth.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    color: 'from-[#A93DFF]/10 to-[#A93DFF]/5',
    borderColor: 'hover:border-[#A93DFF]/30',
    tagColor: 'text-[#A93DFF] bg-[#A93DFF]/5'
  },
  {
    id: 3,
    name: 'Daniel Cooper',
    role: 'Business Operations Manager',
    company: 'Medicare Services Organization',
    quote: 'The level of professionalism and consistency delivered by Going Technologies exceeded our expectations.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    color: 'from-emerald-500/10 to-emerald-500/5',
    borderColor: 'hover:border-emerald-500/30',
    tagColor: 'text-emerald-500 bg-emerald-500/5'
  },
  {
    id: 4,
    name: 'Sarah Mitchell',
    role: 'Process Improvement Lead',
    company: 'Enterprise Services Firm',
    quote: 'Their structured operational approach helped us eliminate bottlenecks and improve workflow visibility.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    color: 'from-amber-500/10 to-amber-500/5',
    borderColor: 'hover:border-amber-500/30',
    tagColor: 'text-amber-500 bg-amber-500/5'
  },
  {
    id: 5,
    name: 'Kevin Turner',
    role: 'Operations Executive',
    company: 'Insurance Technology Partner',
    quote: 'Reliable execution, strong communication, and a focus on operational excellence made Going Technologies a valuable extension of our team.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    color: 'from-blue-500/10 to-blue-500/5',
    borderColor: 'hover:border-blue-500/30',
    tagColor: 'text-blue-500 bg-blue-500/5'
  },
  {
    id: 6,
    name: 'Lisa Morgan',
    role: 'Client Services Manager',
    company: 'Business Solutions Group',
    quote: 'Their ability to scale support operations while maintaining quality has been impressive.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    color: 'from-pink-500/10 to-pink-500/5',
    borderColor: 'hover:border-pink-500/30',
    tagColor: 'text-pink-500 bg-pink-500/5'
  }
];

interface HomeProps {
  setCurrentPage: (page: PageType) => void;
  onNavigateToService: (serviceId: string) => void;
}

export default function Home({ setCurrentPage, onNavigateToService }: HomeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<number>(0);
  const [employeeScale, setEmployeeScale] = useState<number>(25);
  const [isHovered1, setIsHovered1] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);

  // Canvas interactive network particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = canvas.parentElement?.clientHeight || 500;
    };
    window.addEventListener('resize', handleResize);

    const nodes: { x: number; y: number; vx: number; vy: number; radius: number; glow: boolean }[] = [];
    const nodeCount = 45;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.5 + 1.5,
        glow: Math.random() > 0.8
      });
    }

    // Interactive mouse tracking
    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background glowing radial grid
      ctx.strokeStyle = 'rgba(220, 231, 255, 0.25)';
      ctx.lineWidth = 1;
      const gridSpacing = 60;
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw connections
      ctx.lineWidth = 1;
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.15;
            ctx.strokeStyle = `rgba(47, 109, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw mouse gravity pull and dynamic interactive lines
      for (let i = 0; i < nodeCount; i++) {
        const mouseDist = Math.hypot(nodes[i].x - mouse.x, nodes[i].y - mouse.y);
        if (mouseDist < 160) {
          const alpha = (1 - mouseDist / 160) * 0.4;
          ctx.strokeStyle = `rgba(169, 61, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();

          // Push slightly away or pull based on mouse
          const angle = Math.atan2(nodes[i].y - mouse.y, nodes[i].x - mouse.x);
          nodes[i].x += Math.cos(angle) * 0.2;
          nodes[i].y += Math.sin(angle) * 0.2;
        }

        // Draw node
        const node = nodes[i];
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        if (node.glow) {
          ctx.fillStyle = '#A93DFF';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#A93DFF';
        } else {
          ctx.fillStyle = '#2F6DFF';
          ctx.shadowBlur = 0;
        }
        ctx.fill();

        // Update positions
        node.x += node.vx;
        node.y += node.vy;

        // Bounce boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      }
      ctx.shadowBlur = 0; // reset
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const whatWeDoCards = [
    {
      id: 'insurance-ops',
      title: 'Insurance Operations',
      desc: 'Expert processing of ACORD applications, underwriting indexing, certificates, and broker comparative submissions.',
      icon: <TrendingUp className="w-6 h-6 text-[#081B8C]" />
    },
    {
      id: 'bpo',
      title: 'Business Process Outsourcing',
      desc: 'High-caliber offshore CSR and operational team extensions scaled to handle heavy transactional volume under US oversight.',
      icon: <Users className="w-6 h-6 text-[#2F6DFF]" />
    },
    {
      id: 'digital-transform',
      title: 'Digital Transformation',
      desc: 'Replacing brittle systems and unstandardized spreadsheets with modern, enterprise-ready cloud portal architectures.',
      icon: <Briefcase className="w-6 h-6 text-[#A93DFF]" />
    },
    {
      id: 'ai-automation',
      title: 'AI & Automation',
      desc: 'Intelligent document extraction models, cognitive RPA pipelines, and Human-in-the-Loop validation engines.',
      icon: <CheckCircle2 className="w-6 h-6 text-[#4AB7FF]" />
    },
    {
      id: 'consulting',
      title: 'Operational Consulting',
      desc: 'Root-cause process audits, Six Sigma benchmarking, and workflow redesign to squeeze waste out of high-volume pipelines.',
      icon: <Award className="w-6 h-6 text-[#081B8C]" />
    },
    {
      id: 'back-office',
      title: 'Enterprise Support',
      desc: 'Precision bookkeeping reconciliation, database management, and active transaction audit-trails on client core systems.',
      icon: <Shield className="w-6 h-6 text-[#2F6DFF]" />
    }
  ];

  const industries = [
    { name: 'Property & Casualty (P&C)', desc: 'Commercial submissions & certificate queues' },
    { name: 'Medicare Operations', desc: 'CMS marketing compliance & SOA indexing' },
    { name: 'InsurTech Companies', desc: 'Human-in-the-loop validation for digital systems' },
    { name: 'MGAs & Wholesalers', desc: 'Pre-underwriting screening & quote preparation' },
    { name: 'Insurance Agencies', desc: 'Liberating producers from CSR administrative chores' },
    { name: 'Life & Health Carriers', desc: 'Attending Physician Records (APS) indexing' }
  ];

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

  const valuePillars = [
    { metric: '60%', title: 'Reduced Operating Costs', desc: 'Slash payroll burdens by delegating clerical roles to high-caliber offshore teams.' },
    { metric: '4.5 Hrs', title: 'Improved Efficiency', desc: 'Reclaim prime hours daily for licensed domestic agents to focus on client acquisition.' },
    { metric: '10 Mins', title: 'Scale Faster', desc: 'Deliver rapid certificates of insurance and endorsements to defeat standard market wait times.' },
    { metric: '100%', title: 'Dedicated Specialization', desc: 'Our teams work exclusively on your systems under daily Operations Supervisor oversight.' },
    { metric: 'Six Sigma', title: 'Deep Industry Expertise', desc: 'Operational procedures mapped, optimized, and controlled by Lean-certified process engineers.' },
    { metric: 'SOC 2', title: 'US-Focused Delivery', desc: 'Strict security handshakes, HIPAA compliant channels, and seamless daytime US shift overlaps.' }
  ];

  return (
    <div className="bg-[#F8FAFF] font-sans text-[#111827]">
      
      {/* SECTION 1: HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-12 pb-24">
        {/* Interactive Canvas Background */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[50%] opacity-80 z-0">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
        </div>
        
        {/* Background gradient washes */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2F6DFF]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#A93DFF]/5 blur-[120px] rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-8">
              {/* Trust Tag */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="inline-flex items-center gap-2 bg-[#DCE7FF]/60 border border-[#DCE7FF] px-4 py-1.5 rounded-full"
              >
                <span className="w-2 h-2 rounded-full bg-[#2F6DFF] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#081B8C]">
                  US Enterprise Operations Partner
                </span>
              </motion.div>

              {/* Title Stack */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight leading-none text-[#081B8C]">
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                  className="block"
                >
                  Scale Operations.
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-[#2F6DFF] to-[#A93DFF]"
                >
                  Reduce Costs.
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
                  className="block"
                >
                  Accelerate Growth.
                </motion.span>
              </h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
                className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl"
              >
                Going Technologies helps insurance organizations and mid-market enterprises streamline operations, eliminate administrative bottlenecks, and unlock rapid scalable growth.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
                className="flex flex-col sm:flex-row items-center gap-4 pt-2"
              >
                <button
                  onClick={() => {
                    setCurrentPage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto text-center cursor-pointer bg-[#081B8C] hover:bg-[#2F6DFF] text-white px-8 py-4 rounded-full font-bold text-base transition-all duration-300 shadow-lg shadow-[#081B8C]/15 flex items-center justify-center gap-2 group"
                >
                  <span>Book Strategy Call</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto text-center cursor-pointer bg-white border border-[#DCE7FF] hover:border-[#2F6DFF] text-[#081B8C] px-8 py-4 rounded-full font-bold text-base transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
                >
                  Explore Services
                </button>
              </motion.div>

              {/* Direct Security Assurance */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.85 }}
                className="flex items-center gap-6 pt-4 text-xs text-gray-500 font-medium"
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2F6DFF]" />
                  <span>SOC 2 Type II Secure</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2F6DFF]" />
                  <span>HIPAA Aligned</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2F6DFF]" />
                  <span>US-Based Leadership</span>
                </div>
              </motion.div>
            </div>

            {/* Hero Right Interactive Display (Desktop only) */}
            <div className="hidden lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white border border-[#DCE7FF] rounded-2xl shadow-xl p-6 relative overflow-hidden"
              >
                {/* Glowing decorative dot */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#4AB7FF]/10 blur-2xl rounded-full" />
                
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="font-mono text-[10px] text-gray-400">GOING_TECH_FLOW // ON</span>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#F8FAFF] p-4 rounded-xl border border-[#DCE7FF]/60">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Intake Queue Status</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-[#081B8C]">0 New Backlogs</span>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Cleared</span>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFF] p-4 rounded-xl border border-[#DCE7FF]/60 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Certificate Processing SLA</p>
                      <p className="text-base font-bold text-gray-800 mt-0.5">Average 8.4 Mins</p>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  </div>

                  <div className="bg-[#F8FAFF] p-4 rounded-xl border border-[#DCE7FF]/60">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Data Integrity Loop</p>
                    <div className="w-full bg-gray-100 h-2 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#2F6DFF] h-full w-[99.98%]" />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mt-1">
                      <span>Accuracy Level</span>
                      <span className="font-bold text-[#081B8C]">99.98%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: OPERATIONAL CAPABILITIES */}
      <section className="bg-white border-y border-[#DCE7FF] py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Our Deliverables</h2>
            <h2 className="text-3xl font-bold font-display text-[#081B8C] tracking-tight">
              Operational Capabilities
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
              Highly specialized carrier-grade teams integrated natively inside your agency management systems under strict SLA guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Renewal Processing',
                desc: 'Optimize submission speeds by preparing pre-renewal questionnaires, loss runs, and ACORD records overnight.',
                icon: <Clock className="w-5 h-5 text-[#2F6DFF]" />
              },
              {
                title: 'Policy Administration',
                desc: 'Comprehensive carrier binder checking, policy checking audits, endorsement updates, and database indexing.',
                icon: <FileText className="w-5 h-5 text-[#A93DFF]" />
              },
              {
                title: 'COI Management',
                desc: 'Rapid certificate issuance and holder compliance tracking to hit carrier standards under tight client timelines.',
                icon: <FileCheck className="w-5 h-5 text-[#2F6DFF]" />
              },
              {
                title: 'Back Office Operations',
                desc: 'Sub-ledger ledger reconciliation, policy invoice indexing, direct-bill audits, and database cleanup.',
                icon: <ClipboardCheck className="w-5 h-5 text-[#081B8C]" />
              },
              {
                title: 'Medicare Support',
                desc: 'Complete CMS marketing guidelines compliance support, Scope of Appointment (SOA) archiving, and file scrubbing.',
                icon: <Shield className="w-5 h-5 text-emerald-600" />
              },
              {
                title: 'Data Processing',
                desc: 'Structural data extraction, advanced electronic scanning indexation, and dual-check verification procedures.',
                icon: <Layers className="w-5 h-5 text-[#4AB7FF]" />
              },
              {
                title: 'Business Process Outsourcing',
                desc: 'Dedicated team pods working exclusively on your systems under strict operational governance.',
                icon: <Users className="w-5 h-5 text-[#2F6DFF]" />
              },
              {
                title: 'Insurance Operations',
                desc: 'SOP compliance coverage for surplus lines filings, comparative broker quoting, and wholesale carrier indexing.',
                icon: <TrendingUp className="w-5 h-5 text-[#A93DFF]" />
              }
            ].map((cap, idx) => (
              <div
                key={idx}
                className="bg-[#F8FAFF] border border-[#DCE7FF]/50 hover:border-[#2F6DFF] rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="p-2.5 bg-white border border-[#DCE7FF]/40 rounded-xl w-fit group-hover:bg-[#DCE7FF]/20 transition-colors shadow-xs">
                    {cap.icon}
                  </div>
                  <h3 className="text-sm font-bold text-[#081B8C] font-display group-hover:text-[#2F6DFF] transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-gray-500 text-[11px] sm:text-xs leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: WHAT WE DO */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Core Capabilities</h2>
          <p className="text-3xl sm:text-4xl font-bold font-display text-[#081B8C] tracking-tight">
            Comprehensive Operational Services for High-Growth Enterprises
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            We operate behind the scenes, integrating directly into your technology stack to manage high-volume, complex pipelines with perfect execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whatWeDoCards.map((card) => (
            <div
              key={card.id}
              onClick={() => onNavigateToService(card.id)}
              className="bg-white border border-[#DCE7FF] rounded-2xl p-8 hover:shadow-xl hover:border-[#2F6DFF] hover:translate-y-[-4px] transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="p-3 bg-[#F8FAFF] rounded-xl w-fit group-hover:bg-[#DCE7FF]/40 transition-colors">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-[#081B8C] group-hover:text-[#2F6DFF] transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
              <div className="pt-6 flex items-center text-xs font-bold text-[#081B8C] group-hover:text-[#2F6DFF] gap-1 mt-4">
                <span>View Full Core Blueprint</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: INDUSTRIES WE SERVE */}
      <section className="bg-white border-y border-[#DCE7FF] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Market Footprint</h2>
            <p className="text-3xl sm:text-4xl font-bold font-display text-[#081B8C] tracking-tight">
              Sectors We Support Daily
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              Our specialists are native to your terminology, carrying deep structural expertise across core US insurance lines and financial operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCurrentPage('industries');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-[#F8FAFF] border border-[#DCE7FF]/60 rounded-xl p-6 hover:bg-white hover:border-[#2F6DFF] hover:shadow-md transition-all duration-200 cursor-pointer group flex justify-between items-center"
              >
                <div>
                  <h4 className="font-bold text-[#081B8C] group-hover:text-[#2F6DFF] transition-colors">{ind.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{ind.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#2F6DFF] transition-colors" />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => {
                setCurrentPage('industries');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#081B8C] hover:text-[#2F6DFF] group cursor-pointer"
            >
              <span>Explore All 10 Industry Verticals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: OPERATIONAL CHALLENGES (Pain Point Solver Board) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <p className="text-gray-600 text-base leading-relaxed italic bg-gray-50 p-5 rounded-xl border-l-4 border-red-400">
                "{challenges[activeChallenge].symptom}"
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold px-3 py-1 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>The Going Technologies Cure</span>
              </div>
              <p className="text-gray-600 text-base leading-relaxed">
                {challenges[activeChallenge].cure}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5.5: INTERACTIVE OPERATIONS COMPARISON ENGINE */}
      <section className="bg-slate-950 text-white py-24 relative overflow-hidden">
        {/* Background ambient accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#2F6DFF]">
              GT Interactive Scale Model
            </h2>
            <p className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              Compare Your Operations (Before vs. After)
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Adjust the slider below to model your current local back-office headcount and dynamically calculate the direct cost reductions and reclaimed capacity of Going Technologies' global centers.
            </p>
          </div>

          {/* Interactive Calculator Slider */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 space-y-8 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono block">
                    Interactive Input Headcount
                  </span>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-2xl font-bold font-display">Current Admin FTEs:</h3>
                    <span className="text-4xl font-extrabold text-blue-500 font-mono">
                      {employeeScale}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={employeeScale}
                    onChange={(e) => setEmployeeScale(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>5 FTEs</span>
                    <span>50 FTEs</span>
                    <span>100 FTEs</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Based on average US commercial line CSR, compliance auditor, and policy-check payroll structures ($55,000/year fully loaded).
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Cost savings card */}
                <div className="bg-slate-950 border border-slate-800/80 p-6 rounded-2xl space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                    Annual Back-Office Payroll Cost
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-[11px] text-red-400 font-mono line-through">
                      ${(employeeScale * 55000).toLocaleString()} / Yr (Before)
                    </p>
                    <p className="text-2xl font-extrabold text-emerald-400 font-mono">
                      ${(employeeScale * 22000).toLocaleString()} / Yr
                    </p>
                    <span className="text-[10px] font-bold text-emerald-500 font-mono uppercase bg-emerald-500/10 px-2 py-0.5 rounded inline-block mt-1">
                      Save ${(employeeScale * 33000).toLocaleString()} (60% Off)
                    </span>
                  </div>
                </div>

                {/* Capacity reclaimed card */}
                <div className="bg-slate-950 border border-slate-800/80 p-6 rounded-2xl space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                    Reclaimed Underwriter Capacity
                  </span>
                  <div className="space-y-1">
                    <p className="text-3xl font-extrabold text-blue-400 font-mono">
                      {(employeeScale * 4.5).toLocaleString()} Hrs
                    </p>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Every single business day, redirected directly to client satisfaction and active business premium generation.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Side-by-side Paradigm Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="bg-slate-900 border border-red-500/20 rounded-3xl p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-2xl rounded-full" />
              <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Standard Internal Back-Office Operations
                </h4>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Submissions Backlog Rate', detail: 'Builds up over 24-48 hours. Leads to lost market quote speed.' },
                  { title: 'Data Accuracy & Ingestions', detail: 'Averages 6-8% clerical error rates with manual copy-paste transfers.' },
                  { title: 'Information Security & Compliance', detail: 'Local desktops, physical notebooks, paper records inside standard cubicles.' },
                  { title: 'AMS Capacity Bottleneck', detail: 'Licensed producers locked into Applied Epic/Vertafore clerical fields 40% of their day.' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-xs font-bold text-red-400">{item.title}</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* The Going Technologies Way */}
            <div className="bg-slate-900 border border-blue-500/30 rounded-3xl p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full" />
              <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-50 animate-pulse" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Going Technologies Global Center Model
                </h4>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Submissions Backlog Rate', detail: 'Overnight clearing in under 12 hours. Hit broker targets instantly.' },
                  { title: 'Data Accuracy & Ingestions', detail: 'Industry-leading 99.98% accuracy monitored under strict Six Sigma controls.' },
                  { title: 'Information Security & Compliance', detail: 'SOC 2 Type II certified. Physical keycards, clean-room rules, full VDI lockdown.' },
                  { title: 'AMS Capacity Bottleneck', detail: 'Dedicated support pod reclaims 4.5 hours daily for domestic producers to hunt new deals.' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-xs font-bold text-blue-400">{item.title}</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6: WHY GOING TECHNOLOGIES */}
      <section className="bg-white border-t border-[#DCE7FF] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Performance Engineering</h2>
            <p className="text-3xl sm:text-4xl font-bold font-display text-[#081B8C] tracking-tight">
              Operational Outcomes That Drive Executive Value
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              We focus entirely on the hard numbers: reducing processing overhead, clearing transactional backlog, and optimizing resource capacity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valuePillars.map((pil, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-[#F8FAFF] border border-[#DCE7FF]/50 rounded-2xl p-8 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#2F6DFF]/30"
              >
                <div className="text-3xl font-extrabold text-[#081B8C] font-mono tracking-tight">{pil.metric}</div>
                <h4 className="text-base font-bold text-[#081B8C] mt-2 mb-1">{pil.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{pil.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: CASE STUDIES PREVIEW */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Client Success Stories</h2>
            <p className="text-3xl sm:text-4xl font-bold font-display text-[#081B8C] tracking-tight">
              Real Transformations, Verified Metrics
            </p>
          </div>
          <button
            onClick={() => {
              setCurrentPage('case-studies');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-sm font-bold text-[#081B8C] hover:text-[#2F6DFF] flex items-center gap-1 group cursor-pointer"
          >
            <span>View All Case Studies</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              onClick={() => {
                setCurrentPage('case-studies');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white border border-[#DCE7FF] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#2F6DFF] hover:translate-y-[-4px] transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-xs font-extrabold uppercase text-[#2F6DFF] tracking-wider bg-[#DCE7FF]/40 px-2.5 py-1 rounded">
                    {study.industry}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">CASE_ID: {study.id.slice(0, 5).toUpperCase()}</span>
                </div>
                <h3 className="text-lg font-bold text-[#081B8C] line-clamp-2">
                  {study.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                  {study.challenge}
                </p>
              </div>

              {/* Stat callout footer */}
              <div className="bg-[#F8FAFF] border-t border-[#DCE7FF] p-6 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Primary Outcome</p>
                  <p className="text-lg font-extrabold text-[#081B8C] mt-0.5">{study.metricValue}</p>
                </div>
                <span className="text-xs font-semibold text-gray-500">{study.metricLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8: THE COST OF OPERATIONAL INEFFICIENCY */}
      <section className="bg-white border-y border-[#DCE7FF] py-24 overflow-hidden relative">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#2F6DFF]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#A93DFF]/5 blur-[120px] rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Diagnostic Simulator</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#081B8C] tracking-tight">
              The Cost of Operational Inefficiency
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Every day your domestic licensed agents spend manually entering data, verifying policy checksheets, or processing certificate backlogs is premium growth lost to administrative overhead.
            </p>
          </div>

          {/* Interactive Calculator Slider Widget */}
          <div className="bg-[#F8FAFF] border border-[#DCE7FF] rounded-2xl p-6 sm:p-10 mb-16 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 space-y-6">
                <h4 className="text-lg font-bold text-[#081B8C] font-display">Operational Savings Estimator</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Adjust the slider below to select your current domestic administrative team scale. See how much budget and capacity you can reclaim through Going Technologies' optimized global center squads.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-700">
                    <span>Domestic Admins / CSRs:</span>
                    <span className="text-[#2F6DFF] font-mono font-bold text-lg">{employeeScale} Team Members</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={employeeScale}
                    onChange={(e) => setEmployeeScale(Number(e.target.value))}
                    className="w-full accent-[#2F6DFF] cursor-pointer h-1.5 bg-[#DCE7FF] rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono font-bold">
                    <span>5 STAFF</span>
                    <span>75 STAFF</span>
                    <span>150 STAFF</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white border border-[#DCE7FF] rounded-xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 relative overflow-hidden shadow-xs">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full" />
                
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Estimated Annual Cost Savings</span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono tracking-tight">
                    ${((employeeScale * 9500 * 12) - (employeeScale * 3800 * 12)).toLocaleString()}
                  </div>
                  <p className="text-[10px] text-gray-500">Based on standard $9,500 domestic payroll/burden vs. $3,800 optimized global seat.</p>
                </div>

                <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-gray-100 sm:pl-6 pt-4 sm:pt-0">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Reclaimed Underwriter Capacity</span>
                  <div className="text-3xl sm:text-4xl font-black text-[#2F6DFF] font-mono tracking-tight">
                    {(employeeScale * 4.5 * 240).toLocaleString()} Hrs
                  </div>
                  <p className="text-[10px] text-gray-500">Reclaimed daily (4.5 hrs/staff member) over a standard 240-day business calendar year.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Interactive Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            
            {/* LEFT CARD: Without Going Technologies */}
            <div className="bg-red-50/10 border border-red-200/60 rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group hover:border-red-400/60 hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                    Without Going Technologies
                  </span>
                  <span className="text-[10px] text-red-400 font-mono">friction_pipeline.log</span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#081B8C] font-display">Administrative Backlogs & Bottlenecks</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Local agencies and carrier branches fail to achieve double-digit growth because producers and underwriters are constrained by repetitive back-office tasks.
                  </p>
                </div>

                {/* Animated list elements */}
                <div className="space-y-4 border-t border-red-100/60 pt-6">
                  {[
                    { title: 'Backlogs Increase Daily', desc: 'Certificate requests, binder checking, and submission queues pile up during market surges, losing hot business.' },
                    { title: 'Drastically Higher Operating Costs', desc: 'Recruiting, payroll tax, and localized real-estate overheads inflate administrative cost per transacted policy.' },
                    { title: 'Slower Submissions Turnaround Time', desc: 'Brokers place risk with competitors who clear applications in hours, while manual data entries take 2-3 business days.' },
                    { title: 'Administrative Underwriter Overload', desc: 'Producers spend 40% of their day on indexing and clerical processing instead of closing premium contracts.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5 animate-pulse" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-800">{item.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stress metric graphic */}
              <div className="mt-8 pt-6 border-t border-red-100/60 flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase font-bold tracking-wider">Unresolved Backlogs</span>
                  <span className="text-2xl font-extrabold text-red-600 font-mono tracking-tight animate-pulse">Accumulating Daily</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-[10px] block uppercase font-bold tracking-wider">Operational Waste</span>
                  <span className="text-2xl font-extrabold text-red-600 font-mono tracking-tight">~40% Loss</span>
                </div>
              </div>
            </div>

            {/* RIGHT CARD: With Going Technologies */}
            <div className="bg-emerald-50/10 border border-emerald-200/60 rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-400/60 hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 blur-3xl rounded-full pointer-events-none" />

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                    With Going Technologies
                  </span>
                  <span className="text-[10px] text-emerald-500 font-mono font-bold">active_scale_pipeline // LIVE</span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#081B8C] font-display">A Streamlined High-Velocity Engine</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Secure virtual desktops paired with dedicated, carrier-trained delivery teams clear back-office transaction backlogs overnight, scaling your enterprise effortlessly.
                  </p>
                </div>

                {/* Optimized elements */}
                <div className="space-y-4 border-t border-emerald-100/60 pt-6">
                  {[
                    { title: 'Zero Morning Backlogs', desc: 'Our overnight operational squads index files, audit policies, and clear transactional queues before your US office opens.' },
                    { title: '60% Directly Reduced Processing Cost', desc: 'Convert fixed corporate administrative burdens into dynamic, cost-efficient, and fully-managed global seats.' },
                    { title: 'Rapid Turnaround Processing Velocity', desc: 'Submission entries, quote mappings, and urgent certificates of insurance are dispatched in less than 12 minutes.' },
                    { title: '100% Reclaimed Producer Focus', desc: 'Domestic underwriters and licensed producers spend all day building corporate accounts, driving major premium growth.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-800">{item.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success metrics */}
              <div className="mt-8 pt-6 border-t border-emerald-100/60 flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase font-bold tracking-wider">SLA Queue Backlog</span>
                  <span className="text-2xl font-extrabold text-emerald-600 font-mono tracking-tight">0 Queue (Cleared)</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-[10px] block uppercase font-bold tracking-wider">Premium Growth Rate</span>
                  <span className="text-2xl font-extrabold text-emerald-600 font-mono tracking-tight">+38% Bound Avg</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 9: LATEST INSIGHTS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Corporate Intelligence</h2>
          <p className="text-3xl sm:text-4xl font-bold font-display text-[#081B8C] tracking-tight">
            Latest Operational Thinking
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Gain executive insights on how artificial intelligence and secure global centers are reshaping legacy workflows across America.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => {
                setCurrentPage('blog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white border border-[#DCE7FF] rounded-xl overflow-hidden hover:shadow-lg hover:border-[#2F6DFF] transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <span className="text-[10px] font-extrabold uppercase text-[#2F6DFF] tracking-wider">
                  {post.category}
                </span>
                <h3 className="text-base font-bold text-[#081B8C] group-hover:text-[#2F6DFF] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
              <div className="p-6 pt-0 flex justify-between items-center text-[10px] text-gray-400 font-mono">
                <span>{post.publishDate}</span>
                <span className="text-[#081B8C] font-semibold flex items-center gap-0.5">
                  Read Article <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9.5: SUCCESS COUNTERS & PREMIUM B2B CLIENT TESTIMONIALS */}
      <section className="py-28 bg-gradient-to-b from-[#F8FAFF] via-white to-[#F8FAFF] relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#2F6DFF]/5 blur-[160px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* 1. Animated statistics row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-24">
            {[
              { label: 'Tasks Processed', value: '5000+', icon: FileCheck, color: 'text-[#2F6DFF]', bg: 'bg-[#2F6DFF]/5' },
              { label: 'Accuracy Focus', value: '98%', icon: TrendingUp, color: 'text-[#A93DFF]', bg: 'bg-[#A93DFF]/5' },
              { label: 'Operational Support', value: '24/7', icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
              { label: 'Businesses Supported', value: '100+', icon: Building, color: 'text-amber-500', bg: 'bg-amber-500/5' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                className="bg-white/70 backdrop-blur-md border border-[#DCE7FF]/80 rounded-2xl p-6 text-center shadow-xs flex flex-col items-center group hover:border-[#2F6DFF]/30 transition-all duration-300"
              >
                <div className={`p-3 rounded-xl mb-4 ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-3xl font-extrabold text-[#081B8C] font-mono tracking-tight mb-1">
                  <AnimatedCounter value={stat.value} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Title Stack */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#DCE7FF]/40 border border-[#DCE7FF]/80 px-3.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#2F6DFF] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F6DFF]">TRUSTED EXCELLENCE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#081B8C] tracking-tight leading-tight">
              Trusted By Teams Focused On Operational Excellence
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
              Organizations choose Going Technologies to streamline operations, reduce administrative workload, and improve business efficiency.
            </p>
          </div>

          {/* Testimonial Cards Layout - Slider on mobile, Continuous marquee slider on Desktop */}
          
          {/* Mobile Swiper View */}
          <div className="block md:hidden relative">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-none scroll-smooth">
              {TESTIMONIALS_DATA.map((card, idx) => (
                <div
                  key={idx}
                  className="min-w-[85vw] snap-center bg-white/45 backdrop-blur-lg border border-[#DCE7FF]/60 rounded-3xl p-8 shadow-md flex flex-col justify-between relative overflow-hidden h-[330px]"
                >
                  {/* Card glow corner effect */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} blur-xl rounded-full opacity-45`} />
                  
                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-0.5">
                        {[...Array(card.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#2F6DFF] text-[#2F6DFF]" />
                        ))}
                      </div>
                      <Quote className="w-7 h-7 text-[#2F6DFF]/15 shrink-0" />
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed italic">
                      "{card.quote}"
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-gray-100/60 flex items-center gap-4 relative z-10">
                    <div className="relative shrink-0">
                      <img
                        src={card.avatar}
                        alt={card.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                      />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${card.id % 2 === 0 ? 'bg-[#A93DFF]' : 'bg-[#2F6DFF]'}`} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#081B8C] font-display">{card.name}</h4>
                      <p className="text-[9px] text-gray-400 font-medium leading-none mt-1">
                        {card.role} <span className="text-[#2F6DFF]/70">•</span> {card.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Swipe indicator */}
            <div className="text-center text-[10px] text-gray-400 font-semibold flex items-center justify-center gap-1.5">
              <span>Swipe left or right to read more</span>
              <ArrowRight className="w-3 h-3 animate-bounce" />
            </div>
          </div>

          {/* Desktop Dual-Track Endless Scrolling Marquee */}
          <div className="hidden md:flex flex-col gap-8 relative py-4 overflow-hidden">
            
            {/* Ambient edge-fades to blend seamlessly */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F8FAFF] via-[#F8FAFF]/50 to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#F8FAFF] via-[#F8FAFF]/50 to-transparent z-20 pointer-events-none" />

            {/* Row 1 Ticker (Left scroll) */}
            <div 
              className="flex overflow-hidden w-full select-none"
              onMouseEnter={() => setIsHovered1(true)}
              onMouseLeave={() => setIsHovered1(false)}
            >
              <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  ease: "linear",
                  duration: isHovered1 ? 160 : 35,
                  repeat: Infinity,
                }}
                className="flex gap-6 w-max"
              >
                {[...TESTIMONIALS_DATA.slice(0, 3), ...TESTIMONIALS_DATA.slice(0, 3)].map((card, idx) => (
                  <div
                    key={`track1-${idx}`}
                    className="w-[380px] shrink-0 bg-white/45 backdrop-blur-md border border-[#DCE7FF]/70 rounded-3xl p-8 shadow-xs hover:shadow-xl hover:border-[#2F6DFF]/30 hover:bg-white/80 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
                  >
                    {/* Radial background blur glow */}
                    <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${card.color} blur-2xl rounded-full opacity-40 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-0.5">
                          {[...Array(card.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#2F6DFF] text-[#2F6DFF]" />
                          ))}
                        </div>
                        <Quote className="w-7 h-7 text-[#2F6DFF]/15 group-hover:text-[#2F6DFF]/30 group-hover:rotate-12 transition-all duration-300 shrink-0" />
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed italic">
                        "{card.quote}"
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-gray-100/60 flex items-center gap-4 relative z-10">
                      <div className="relative shrink-0">
                        <img
                          src={card.avatar}
                          alt={card.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${card.id % 2 === 0 ? 'bg-[#A93DFF]' : 'bg-[#2F6DFF]'}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#081B8C] font-display">{card.name}</h4>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                          {card.role} <span className="text-[#2F6DFF]/70">•</span> {card.company}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Row 2 Ticker (Right scroll) */}
            <div 
              className="flex overflow-hidden w-full select-none"
              onMouseEnter={() => setIsHovered2(true)}
              onMouseLeave={() => setIsHovered2(false)}
            >
              <motion.div
                animate={{ x: ["-50%", "0%"] }}
                transition={{
                  ease: "linear",
                  duration: isHovered2 ? 160 : 35,
                  repeat: Infinity,
                }}
                className="flex gap-6 w-max"
              >
                {[...TESTIMONIALS_DATA.slice(3, 6), ...TESTIMONIALS_DATA.slice(3, 6)].map((card, idx) => (
                  <div
                    key={`track2-${idx}`}
                    className="w-[380px] shrink-0 bg-white/45 backdrop-blur-md border border-[#DCE7FF]/70 rounded-3xl p-8 shadow-xs hover:shadow-xl hover:border-[#2F6DFF]/30 hover:bg-white/80 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
                  >
                    {/* Radial background blur glow */}
                    <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${card.color} blur-2xl rounded-full opacity-40 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-0.5">
                          {[...Array(card.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#2F6DFF] text-[#2F6DFF]" />
                          ))}
                        </div>
                        <Quote className="w-7 h-7 text-[#2F6DFF]/15 group-hover:text-[#2F6DFF]/30 group-hover:rotate-12 transition-all duration-300 shrink-0" />
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed italic">
                        "{card.quote}"
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-gray-100/60 flex items-center gap-4 relative z-10">
                      <div className="relative shrink-0">
                        <img
                          src={card.avatar}
                          alt={card.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${card.id % 2 === 0 ? 'bg-[#A93DFF]' : 'bg-[#2F6DFF]'}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#081B8C] font-display">{card.name}</h4>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                          {card.role} <span className="text-[#2F6DFF]/70">•</span> {card.company}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 10: FINAL STRATEGIC CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-linear-to-r from-[#081B8C] to-[#2F6DFF] rounded-3xl p-8 sm:p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* Decorative glows */}
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#A93DFF]/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-[#4AB7FF]/15 blur-[120px] rounded-full animate-pulse" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#4AB7FF]">Get Started Today</h2>
            <p className="text-3xl sm:text-5xl font-bold text-white font-display leading-tight">
              Ready To Eliminate Bottlenecks & Scale Your Operations?
            </p>
            <p className="text-white/80 text-base leading-relaxed max-w-2xl mx-auto">
              Schedule a private strategy call with our executive consulting partners. We will audit your current process pipeline and design a custom operational pilot roadmap.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  setCurrentPage('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto text-center cursor-pointer bg-white text-[#081B8C] hover:bg-[#F8FAFF] px-8 py-4 rounded-full font-bold text-base transition-colors flex items-center justify-center gap-2 group"
              >
                <span>Book A Free Strategy Session</span>
                <ArrowRight className="w-5 h-5 text-[#081B8C] group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => {
                  setCurrentPage('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto text-center cursor-pointer bg-transparent border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-base transition-colors"
              >
                Learn Our Methodology
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
