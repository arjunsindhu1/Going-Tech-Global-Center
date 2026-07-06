import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, ArrowUpRight, Award, ShieldCheck } from 'lucide-react';

interface Publication {
  name: string;
  logoText: string;
  headline: string;
  excerpt: string;
  link: string;
  badge: string;
  logoBg: string;
  borderColor: string;
}

const PUBLICATIONS: Publication[] = [
  {
    name: 'The Hindustan Wires',
    logoText: 'HW',
    headline: 'How AI and Secure Global Centers are Reshaping Legacy Insurance Workflows',
    excerpt: 'An in-depth corporate analysis on how Going Technologies partners with American insurance firms and MGAs to eliminate back-office data entry bottlenecks, audit compliance, and clear submissions overnight.',
    link: 'https://thehindustanwires.com/the-future-of-business-operations-how-ai-digital-transformation-and-business-process-outsourcing-are-reshaping-modern-enterprises/',
    badge: 'Operational Innovation',
    logoBg: 'bg-gradient-to-br from-orange-500 via-red-500 to-amber-500',
    borderColor: 'hover:border-orange-500/30'
  },
  {
    name: 'Dailyhunt',
    logoText: 'dh',
    headline: 'Going Technologies: Pioneering SOC 2 Compliance in Insurance BPO Services',
    excerpt: 'A featured examination of Going Technologies’ commitment to security, detailing how physical keycard lockdowns, clean-room parameters, and dedicated virtual desktop (VDI) structures provide pristine data security.',
    link: 'https://dhunt.in/14OZPV',
    badge: 'Enterprise Security',
    logoBg: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600',
    borderColor: 'hover:border-blue-500/30'
  }
];

export default function FeaturedIn() {
  return (
    <section className="py-20 relative overflow-hidden bg-[#FAFBFD]">
      {/* Background ambient mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2F6DFF]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Title Stack */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
            <Award className="w-3.5 h-3.5" /> Media & Corporate Coverage
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#081B8C] tracking-tight">
            Featured In Leading Publications
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Read what corporate publications are saying about our pioneering security parameters, SOC 2 Type II global compliance, and back-office acceleration.
          </p>
        </div>

        {/* Publication Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {PUBLICATIONS.map((pub, idx) => (
            <motion.div
              key={pub.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`bg-white/80 backdrop-blur-md border border-[#DCE7FF]/70 rounded-3xl p-8 shadow-xs flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:bg-white ${pub.borderColor} group relative overflow-hidden`}
            >
              {/* Radial gradient background accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full" />
              
              <div className="space-y-6">
                {/* Header: Logo & Badge */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${pub.logoBg} flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-md`}>
                      {pub.logoText}
                    </div>
                    <span className="font-extrabold text-sm text-slate-800 tracking-tight font-display">
                      {pub.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-md">
                    {pub.badge}
                  </span>
                </div>

                {/* Article Headline & Excerpt */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-[#081B8C] leading-snug group-hover:text-blue-600 transition-colors">
                    "{pub.headline}"
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                    {pub.excerpt}
                  </p>
                </div>
              </div>

              {/* Read button footer */}
              <div className="mt-8 pt-5 border-t border-gray-100/60 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified Press Release
                </span>
                
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#081B8C] hover:text-[#2F6DFF] transition-colors group/btn"
                >
                  <span>Read Article</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
