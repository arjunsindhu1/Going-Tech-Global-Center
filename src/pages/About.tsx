import { motion } from 'motion/react';
import { Shield, Eye, Target, Award, Users, ChevronRight, Compass, CheckCircle2, MapPin, TrendingUp, DollarSign } from 'lucide-react';
import { PageType } from '../types';

interface AboutProps {
  setCurrentPage: (page: PageType) => void;
}

export default function About({ setCurrentPage }: AboutProps) {
  const values = [
    {
      title: 'Data Privacy First',
      desc: 'All operations are strictly managed within audited virtual desktops. We maintain continuous SOC 2 Type II assurance with zero localized data storage.',
      icon: <Shield className="w-5 h-5 text-[#081B8C]" />
    },
    {
      title: 'Operational Excellence',
      desc: 'We leverage Lean Six Sigma control frameworks to monitor error-deviations, driving data-integrity scores to an industry-leading 99.98% accuracy.',
      icon: <Target className="w-5 h-5 text-[#2F6DFF]" />
    },
    {
      title: 'Dedicated Specialization',
      desc: 'No shared or generalist agents. Our team members undergo rigorous, carrier-specific training to act as direct, seamless extensions of your office.',
      icon: <Award className="w-5 h-5 text-[#A93DFF]" />
    },
    {
      title: 'Uncompromised Integrity',
      desc: 'Committed to absolute transparency in all metrics. Real-time dashboards provide full visibility into SLA cycle times and throughput logs.',
      icon: <Compass className="w-5 h-5 text-[#4AB7FF]" />
    }
  ];

  const milestones = [
    { year: '2021', title: 'Company Inception', desc: 'Going Technologies established in Visakhapatnam, India, focusing on operational consulting and workflow optimization.' },
    { year: '2022', title: 'Global Delivery Expansion', desc: 'Expanded our high-capacity Global Delivery Center in Visakhapatnam to support round-the-clock queue clearing.' },
    { year: '2023', title: 'SOC 2 Type II Certification', desc: 'Passed comprehensive independent audits validating our zero-trust VDI architecture and security controls.' },
    { year: '2024', title: 'InsurTech & BPO Expansion', desc: 'Introduced intelligent document extraction and API-driven Human-in-the-Loop validation services.' },
    { year: '2025', title: 'Strategic Scale Milestone', desc: 'Successfully supporting over 50 large-scale wholesale brokerages, managing $2B+ in annual premium operations.' },
    { year: '2026', title: 'Present Day Leader', desc: 'Empowering premium digital transformation, automated data parsing, and high-performance operations internationally.' }
  ];

  const choiceCards = [
    {
      title: 'Insurance Expertise',
      headline: 'Carrier-Grade Insurance Domain Specialization',
      stat: '15+ Years',
      statLabel: 'Avg Experience',
      desc: 'No generalist operators. Our teams are exclusively trained on commercial lines, surplus lines, certificate issuance, and compliance protocols standard across major US carriers.',
      icon: <Award className="w-5 h-5 text-[#081B8C]" />,
      color: 'from-[#081B8C]/10 to-[#2F6DFF]/5',
      badgeColor: 'text-[#081B8C] bg-[#DCE7FF]/40'
    },
    {
      title: 'Operational Excellence',
      headline: 'Rigorous SLA & Quality Governance',
      stat: '99.98%',
      statLabel: 'Data-Accuracy SLA',
      desc: 'Leverage Lean Six Sigma control frameworks to monitor and eliminate transaction bottlenecks. We track error deviations in real time to ensure near-flawless data ingestion.',
      icon: <Target className="w-5 h-5 text-[#081B8C]" />,
      color: 'from-[#081B8C]/10 to-[#A93DFF]/5',
      badgeColor: 'text-[#081B8C] bg-[#DCE7FF]/40'
    },
    {
      title: 'Scalable Delivery Teams',
      headline: 'Rapid Operations Scaling on Demand',
      stat: '24-Hour',
      statLabel: 'Clear Backlogs SLA',
      desc: 'Dynamically scale up processing teams during high-volume renewal quarters. Clear backlogs overnight, ensuring underwriters hit the ground running every morning.',
      icon: <TrendingUp className="w-5 h-5 text-[#2F6DFF]" />,
      color: 'from-[#2F6DFF]/10 to-[#4AB7FF]/5',
      badgeColor: 'text-[#2F6DFF] bg-[#2F6DFF]/10'
    },
    {
      title: 'Cost Optimization',
      headline: 'Transform Operational Cost Metrics',
      stat: '60%',
      statLabel: 'Direct Cost Reduction',
      desc: 'Minimize payroll tax, recruitment fees, and local overheads by transferring manual back-office tasks to our high-performance global delivery center under strict quality governance.',
      icon: <DollarSign className="w-5 h-5 text-[#2F6DFF]" />,
      color: 'from-[#2F6DFF]/10 to-[#081B8C]/5',
      badgeColor: 'text-[#2F6DFF] bg-[#2F6DFF]/10'
    },
    {
      title: 'US Market Focus',
      headline: '100% Alignment with US Business Hours',
      stat: '100%',
      statLabel: 'US Shift Overlap',
      desc: 'Our delivery teams work in perfect alignment with your standard US time zones. Dedicated leaders provide immediate, continuous native feedback and oversight.',
      icon: <Compass className="w-5 h-5 text-[#A93DFF]" />,
      color: 'from-[#A93DFF]/10 to-[#2F6DFF]/5',
      badgeColor: 'text-[#A93DFF] bg-[#A93DFF]/10'
    },
    {
      title: 'Process Driven Approach',
      headline: 'Strict AMS Integration & Security Rules',
      stat: '1-to-1',
      statLabel: 'Client-Exclusive Squads',
      desc: 'Dedicated units operate directly inside your instance of Applied Epic, Vertafore, or customized corporate portal, secured with physical keycards and clean-room VDI protocols.',
      icon: <Users className="w-5 h-5 text-[#4AB7FF]" />,
      color: 'from-[#4AB7FF]/10 to-[#081B8C]/5',
      badgeColor: 'text-[#4AB7FF] bg-[#4AB7FF]/10'
    }
  ];

  return (
    <div className="bg-[#F8FAFF] font-sans text-[#111827]">
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden border-b border-[#DCE7FF]/60 bg-white">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#2F6DFF]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-[#A93DFF]/5 blur-[120px] rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Corporate Story</span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-[#081B8C] tracking-tight leading-tight">
                Empowering Enterprises Through Intelligent Operations
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                Founded by a veteran team of insurance and technology specialists, Going Technologies Global Center was built to solve a critical market challenge: the high administrative burden holding back high-performing organizations.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
                By bridging the gap between cutting-edge automation tools and highly trained, dedicated global delivery teams, we help mid-market enterprises and leading insurance agencies eliminate backlogs, reduce operational costs, and scale faster.
              </p>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="border border-[#DCE7FF] bg-[#F8FAFF] p-8 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#4AB7FF]/10 blur-2xl rounded-full" />
                <h3 className="text-xl font-bold text-[#081B8C] font-display mb-4">Our Operations Paradigm</h3>
                <p className="text-gray-600 text-xs leading-relaxed mb-6">
                  "True operational transformation is not about replacing human talent with brittle software, nor is it about unmonitored generalist BPO. It is about pairing specialized, highly trained human squads with intelligent data pipelines."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#DCE7FF] rounded-full flex items-center justify-center font-bold text-[#081B8C] text-xs">
                    GT
                  </div>
                  <div>
                    <span className="font-bold text-[#081B8C] text-xs block">Going Tech Leadership Board</span>
                    <span className="text-[10px] text-gray-400">Global Delivery Center</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Mission */}
          <div className="bg-white border border-[#DCE7FF] rounded-2xl p-10 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2F6DFF]/5 blur-2xl rounded-full" />
            <div className="space-y-6">
              <div className="p-3 bg-[#F8FAFF] border border-[#DCE7FF]/40 rounded-xl w-fit">
                <Target className="w-6 h-6 text-[#081B8C]" />
              </div>
              <h2 className="text-2xl font-bold text-[#081B8C] font-display">Our Corporate Mission</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                To liberate organizations from operational bottlenecks, administrative backlogs, and clerical data-entry fatigue. We enable global insurance brokerages, carriers, and high-growth enterprises to focus on premium customer relationships by delivering highly secure, dedicated, and specialized operational solutions.
              </p>
            </div>
            <div className="pt-8 text-xs font-semibold text-[#2F6DFF] flex items-center gap-1.5 mt-6">
              <span>Frictionless Processing</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white border border-[#DCE7FF] rounded-2xl p-10 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A93DFF]/5 blur-2xl rounded-full" />
            <div className="space-y-6">
              <div className="p-3 bg-[#F8FAFF] border border-[#DCE7FF]/40 rounded-xl w-fit">
                <Eye className="w-6 h-6 text-[#A93DFF]" />
              </div>
              <h2 className="text-2xl font-bold text-[#081B8C] font-display">Our Vision</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                To stand as the absolute global gold standard for specialized insurance operations and enterprise back-office delivery. We envision a future where high-performing companies effortlessly scale transactions across continents, protected by bulletproof SOC2-certified security and driven by Lean Six Sigma operational systems.
              </p>
            </div>
            <div className="pt-8 text-xs font-semibold text-[#A93DFF] flex items-center gap-1.5 mt-6">
              <span>Intelligent Automation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Values */}
      <section className="bg-white border-y border-[#DCE7FF] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Governance & Ethics</h2>
            <p className="text-3xl sm:text-4xl font-bold font-display text-[#081B8C] tracking-tight">
              Our Core Institutional Values
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              Every specialized team, data-handling procedure, and client handshake is bound by our unwavering commitment to security and operational accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, idx) => (
              <div key={idx} className="bg-[#F8FAFF] border border-[#DCE7FF]/60 rounded-xl p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="p-2.5 bg-white border border-[#DCE7FF]/40 rounded-lg w-fit">
                    {v.icon}
                  </div>
                  <h4 className="font-bold text-[#081B8C]">{v.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Delivery Model Map Representation */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Strategic Footprint</span>
            <h2 className="text-3xl font-bold text-[#081B8C] tracking-tight font-display">
              Our Unified Operations Model
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Going Technologies utilizes a powerful, unified delivery strategy designed to maximize client security, communication ease, and around-the-clock transactional processing velocity.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-[#2F6DFF] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Corporate & Delivery Center</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5">Visakhapatnam, Andhra Pradesh, India. Serves clients in the United States and internationally, providing Insurance Operations, BPO, and Dedicated Support Teams.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-[#A93DFF] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Operations Delivery Hub</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5">High-speed, physical keycard-isolated facility hosting dedicated insurance indexers, certified CSR assistants, QA supervisors, and automated workflow engineers.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#DCE7FF] rounded-2xl p-8 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2F6DFF]/5 blur-3xl rounded-full" />
            <h3 className="text-lg font-bold text-[#081B8C] font-display pb-4 border-b border-gray-100 mb-6">Security & Delivery Audit</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'Zero-Trust VDI Access', desc: 'Copy-paste, local saving, printing, and email attachments are strictly disabled across client portals.' },
                { title: 'Clean-Room Protocols', desc: 'No mobile phones, recording devices, or paper notebooks permitted inside operational team rooms.' },
                { title: 'Redundant Power & Fiber', desc: 'Triple redundant fiber-optic pipelines and dual high-capacity corporate back-up power generators.' },
                { title: 'Full Session Recording', desc: 'Continuous screen recordings and network transaction trails available for client inspection.' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-xs font-bold text-[#081B8C]">{item.title}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Vertical Interactive Timeline */}
      <section className="bg-white border-t border-[#DCE7FF] py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Company Milestones</h2>
            <h3 className="text-3xl font-bold font-display text-[#081B8C]">Our Journey of Continuous Scale</h3>
          </div>

          <div className="relative border-l border-[#DCE7FF] pl-8 space-y-12 ml-4">
            {milestones.map((mil, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline node */}
                <div className="absolute left-[-41px] top-1.5 w-6 h-6 rounded-full bg-[#F8FAFF] border-2 border-[#2F6DFF] flex items-center justify-center group-hover:bg-[#2F6DFF] transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[#2F6DFF] group-hover:bg-white" />
                </div>
                
                <div className="space-y-2">
                  <span className="font-mono text-xs font-bold text-[#2F6DFF] bg-[#DCE7FF]/40 px-2 py-0.5 rounded">
                    {mil.year}
                  </span>
                  <h4 className="font-bold text-gray-900 group-hover:text-[#081B8C] transition-colors">{mil.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{mil.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Organizations Choose Going Technologies Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#DCE7FF]">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Our Edge</h2>
          <h3 className="text-3xl sm:text-4xl font-bold font-display text-[#081B8C] tracking-tight">
            Why Organizations Choose Going Technologies
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            We replace unmanaged generalist outsourcing and brittle, error-prone software bots with highly secure, carrier-aligned operational units managed under stringent Six Sigma controls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {choiceCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white border border-[#DCE7FF] rounded-2xl p-8 hover:shadow-xl hover:border-[#2F6DFF] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
            >
              {/* Subtle background color glow accent */}
              <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${card.color} opacity-40 blur-2xl rounded-full pointer-events-none transition-transform duration-500 group-hover:scale-125`} />

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-[#F8FAFF] rounded-xl w-fit group-hover:bg-[#DCE7FF]/40 transition-colors">
                    {card.icon}
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${card.badgeColor}`}>
                    {card.title}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-[#081B8C] group-hover:text-[#2F6DFF] transition-colors font-display">
                    {card.headline}
                  </h4>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>

              {/* Data Visualization / Stat element instead of human portrait */}
              <div className="mt-8 pt-6 border-t border-gray-100/60 relative z-10 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-bold tracking-wider">{card.statLabel}</span>
                  <span className="text-3xl font-extrabold text-[#081B8C] font-mono tracking-tight group-hover:text-[#2F6DFF] transition-colors">{card.stat}</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#2F6DFF] opacity-30 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-[#081B8C] rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2F6DFF]/15 blur-2xl rounded-full" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold font-display">Ready to Work with a Highly Secure Operational Partner?</h3>
            <p className="text-white/80 text-xs leading-relaxed">
              Schedule a technical overview call. Our team will present our SOC2 security frameworks, review SOP template playbooks, and outline pilot deployment structures.
            </p>
            <button
              onClick={() => {
                setCurrentPage('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer inline-flex items-center gap-2 bg-white text-[#081B8C] hover:bg-[#F8FAFF] px-6 py-3 rounded-full font-bold text-sm transition-colors"
            >
              <span>Connect with our Partners</span>
              <ChevronRight className="w-4 h-4 text-[#081B8C]" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
