import React from 'react';
import { motion } from 'motion/react';

interface SoftwareItem {
  name: string;
  icon?: string;
}

interface SoftwareMarqueeProps {
  items: SoftwareItem[];
}

// Map of premium SVG brand marks for all platforms
const LOGO_SVGS: Record<string, React.ReactNode> = {
  // AI Automation
  'openai': (
    <svg className="w-5 h-5 text-[#10a37f]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.7 10.9c-.1-.7-.5-1.3-1.1-1.6l.8-1.4c.5-.9.4-2.1-.4-2.8-.8-.8-2-.9-2.8-.4l-1.4.8c-.3-.6-.9-1.1-1.6-1.2v-1.6c0-1.1-.9-2-2-2s-2 .9-2 2v1.6c-.7.1-1.3.5-1.6 1.1l-1.4-.8c-.9-.5-2.1-.4-2.8.4-.8.8-.9 2-.4 2.8l.8 1.4c-.6.3-1.1.9-1.2 1.6h-1.6c-1.1 0-2 .9-2 2s.9 2 2 2h1.6c.1.7.5 1.3 1.1 1.6l-.8 1.4c-.5.9-.4 2.1.4 2.8.8.8 2 .9 2.8.4l1.4-.8c.3.6.9 1.1 1.6 1.2v1.6c0 1.1.9 2 2 2s2-.9 2-2v-1.6c.7-.1 1.3-.5 1.6-1.1l1.4.8c.9.5 2.1.4 2.8-.4.8-.8.9-2 .4-2.8l-.8-1.4c.6-.3 1.1-.9 1.2-1.6h1.6c1.1 0 2-.9 2-2s-.9-2-2-2h-1.6zM12 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
    </svg>
  ),
  'anthropic': (
    <svg className="w-5 h-5 text-[#E0B892]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 4.5c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5v5h2.5c.28 0 .5.22.5.5v1c0 .28-.22.5-.5.5H13v3.5c0 .28-.22.5-.5.5h-1c-.28 0-.5-.22-.5-.5V14H8.5c-.28 0-.5-.22-.5-.5v-1c0-.28.22-.5.5-.5H11v-5z" />
    </svg>
  ),
  'claude': (
    <svg className="w-5 h-5 text-[#E0B892]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 4.5c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5v5h2.5c.28 0 .5.22.5.5v1c0 .28-.22.5-.5.5H13v3.5c0 .28-.22.5-.5.5h-1c-.28 0-.5-.22-.5-.5V14H8.5c-.28 0-.5-.22-.5-.5v-1c0-.28.22-.5.5-.5H11v-5z" />
    </svg>
  ),
  'google gemini': (
    <svg className="w-5 h-5 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-.3 2.8-2.2 4.7-5 5 2.8.3 4.7 2.2 5 5 .3-2.8 2.2-4.7 5-5-2.8-.3-4.7-2.2-5-5zm6.5 10c-.2 1.4-1.1 2.3-2.5 2.5 1.4.2 2.3 1.1 2.5 2.5.2-1.4 1.1-2.3 2.5-2.5-1.4-.2-2.3-1.1-2.5-2.5z" />
    </svg>
  ),
  'gemini': (
    <svg className="w-5 h-5 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-.3 2.8-2.2 4.7-5 5 2.8.3 4.7 2.2 5 5 .3-2.8 2.2-4.7 5-5-2.8-.3-4.7-2.2-5-5zm6.5 10c-.2 1.4-1.1 2.3-2.5 2.5 1.4.2 2.3 1.1 2.5 2.5.2-1.4 1.1-2.3 2.5-2.5-1.4-.2-2.3-1.1-2.5-2.5z" />
    </svg>
  ),
  'microsoft copilot': (
    <svg className="w-5 h-5 text-[#0078D4]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zm0 10L2 17l10 5 10-5-10-5z" />
    </svg>
  ),
  'zapier': (
    <svg className="w-5 h-5 text-[#FF4F00]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 11h-6V5l-7 8h6v6z" />
    </svg>
  ),
  'n8n': (
    <svg className="w-5 h-5 text-[#FF6D5A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  ),
  'uipath': (
    <svg className="w-5 h-5 text-[#FA4616]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h18v18H3V3zm12 5H9v8h6V8z" />
    </svg>
  ),
  'make': (
    <svg className="w-5 h-5 text-[#7B42FC]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  ),

  // Healthcare
  'epic': (
    <svg className="w-5 h-5 text-[#E02424]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  'cerner': (
    <svg className="w-5 h-5 text-[#006699]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M4.5 16.5c1.5-3 5.5-3 7 0s5.5 3 7 0M4.5 7.5c1.5-3 5.5-3 7 0s5.5 3 7 0" strokeLinecap="round" />
    </svg>
  ),
  'athenahealth': (
    <svg className="w-5 h-5 text-[#007A87]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 00-7.07 17.07 10 10 0 0014.14 0A10 10 0 0012 2zm0 15a5 5 0 110-10 5 5 0 010 10z" />
    </svg>
  ),
  'eclinicalworks': (
    <svg className="w-5 h-5 text-[#005A9C]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm2 14H10v-2h4v2zm1-5H9V9h6v2z" />
    </svg>
  ),
  'nextgen healthcare': (
    <svg className="w-5 h-5 text-[#00A896]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4h4v16H4zm12 0h4v16h-4zm-6 4h4v8h-4z" />
    </svg>
  ),
  'nextgen': (
    <svg className="w-5 h-5 text-[#00A896]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4h4v16H4zm12 0h4v16h-4zm-6 4h4v8h-4z" />
    </svg>
  ),
  'veradigm': (
    <svg className="w-5 h-5 text-[#4D23B3]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 12l10 10 10-10L12 2zm0 15a5 5 0 110-10 5 5 0 010 10z" />
    </svg>
  ),
  'meditech': (
    <svg className="w-5 h-5 text-[#003366]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 12h10M12 7v10" />
    </svg>
  ),
  'greenway health': (
    <svg className="w-5 h-5 text-[#2E7D32]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 14V8l4 4-4 4z" />
    </svg>
  ),

  // Property & Casualty (P&C)
  'applied epic': (
    <svg className="w-5 h-5 text-[#0E4F9F]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h18v18H3zM12 7l-5 5h10z" />
    </svg>
  ),
  'ams360': (
    <svg className="w-5 h-5 text-[#F58220]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  'ezlynx': (
    <svg className="w-5 h-5 text-[#009CDE]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 6h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2zM9 10v4h6v-4H9z" />
    </svg>
  ),
  'hawksoft': (
    <svg className="w-5 h-5 text-[#1B365D]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L3 9v11l9 2 9-2V9l-9-7zm0 15a3 3 0 110-6 3 3 0 010 6z" />
    </svg>
  ),
  'qqcatalyst': (
    <svg className="w-5 h-5 text-[#00A499]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2A10 10 0 1022 12 10 10 0 0012 2zm0 16a6 6 0 116-6 6 6 0 01-6 6z" />
    </svg>
  ),
  'ivans': (
    <svg className="w-5 h-5 text-[#005A9C]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 22h20L12 2zm0 11a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  ),
  'agencyzoom': (
    <svg className="w-5 h-5 text-[#FF2E93]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm3.5 11.5l-3.5-3.5-3.5 3.5" />
    </svg>
  ),
  'nowcerts': (
    <svg className="w-5 h-5 text-[#00A86B]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm3.7 7.3l-5 5a1 1 0 01-1.4 0l-2.5-2.5a1 1 0 111.4-1.4l1.8 1.8 4.3-4.3a1 1 0 111.4 1.4z" />
    </svg>
  ),
  'sagitta': (
    <svg className="w-5 h-5 text-[#0B3C5D]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 12h4v8h12v-8h4L12 2z" />
    </svg>
  ),

  // Life Insurance
  'ipipeline': (
    <svg className="w-5 h-5 text-[#5F259F]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 14h-2V8h2v8z" />
    </svg>
  ),
  'firelight': (
    <svg className="w-5 h-5 text-[#E65100]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c0 0-4 4.5-4 7.5a4 4 0 008 0c0-3-4-7.5-4-7.5z" />
    </svg>
  ),
  'ebix': (
    <svg className="w-5 h-5 text-[#D32F2F]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 3H3v18h18V3zM10 15H7v-2h3v2zm7-4H7V9h10v2z" />
    </svg>
  ),
  'fast': (
    <svg className="w-5 h-5 text-[#303F9F]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 11H6.8l3.6-3.6L9 6l-6 6 6 6 1.4-1.4-3.6-3.6H21v-2z" />
    </svg>
  ),
  'nexus': (
    <svg className="w-5 h-5 text-[#00897B]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 11H7v-2h6v2z" />
    </svg>
  ),
  'smartoffice': (
    <svg className="w-5 h-5 text-[#009688]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0-2-.9-2-2V6c0-1.1-.9-2-2-2zm-7 12H7v-2h5v2zm5-4H7V9h10v2z" />
    </svg>
  ),

  // Medicare
  'healthedge': (
    <svg className="w-5 h-5 text-[#1565C0]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v6c0 5.5 4.5 10 10 10s10-4.5 10-10V7l-10-5zm0 15a3 3 0 110-6 3 3 0 010 6z" />
    </svg>
  ),
  'mhk': (
    <svg className="w-5 h-5 text-[#2E7D32]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0-2-.9-2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z" />
    </svg>
  ),
  'guidingcare': (
    <svg className="w-5 h-5 text-[#00ACC1]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  'trucare': (
    <svg className="w-5 h-5 text-[#3949AB]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5c0-2.4 1.5-4.5 3.8-5.2.7-.2 1.4-.3 2.1-.3C10 3 11.2 3.8 12 4.8c.8-1 2-1.8 4.1-1.8.7 0 1.4.1 2.1.3 2.3.7 3.8 2.8 3.8 5.2 0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  'altruista': (
    <svg className="w-5 h-5 text-[#8E24AA]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 22h20L12 2zm0 15a3 3 0 110-6 3 3 0 010 6z" />
    </svg>
  )
};

// Custom generated high-quality monochrome brand logo creator
function getFallbackLogo(name: string) {
  const letters = name.slice(0, 2).toUpperCase();
  return (
    <div className="w-5 h-5 rounded-md bg-linear-to-br from-[#081B8C]/80 to-[#2F6DFF]/80 text-[10px] font-black text-white flex items-center justify-center tracking-tighter">
      {letters}
    </div>
  );
}

export default function SoftwareMarquee({ items }: SoftwareMarqueeProps) {
  // Triple the items to make the horizontal loop continuous and long enough for seamless infinite scroll
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden py-10 bg-slate-50/50 border border-[#DCE7FF]/40 rounded-3xl group/marquee">
      {/* Dynamic Keyframes injected safely */}
      <style>{`
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 35s linear infinite;
        }
        .group\\/marquee:hover .marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      {/* Premium edge fades (Stripe style) */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/70 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white via-white/70 to-transparent z-10 pointer-events-none" />

      {/* Sliding Marquee Track */}
      <div className="w-full overflow-hidden">
        <div className="marquee-track gap-8">
          {/* We render 2x duplicate size to guarantee perfect loop offset */}
          {[...duplicatedItems, ...duplicatedItems].map((plat, idx) => {
            const normName = plat.name.toLowerCase();
            const logoSvg = LOGO_SVGS[normName] || getFallbackLogo(plat.name);

            return (
              <div
                key={`${plat.name}-${idx}`}
                className="group relative inline-flex items-center gap-3.5 bg-white border border-[#DCE7FF]/40 px-6 py-4.5 rounded-2xl shadow-xs hover:shadow-lg hover:border-[#2F6DFF]/40 hover:scale-110 -hover:translate-y-1 transition-all duration-300 cursor-default select-none z-20 shrink-0"
              >
                {/* Custom Micro Tooltip (SaaS Stripe/Linear Style) */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-800 scale-95 group-hover:scale-100">
                  {plat.name}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2.5 h-2.5 bg-slate-900 rotate-45 border-r border-b border-slate-800" />
                </div>

                <div className="shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-115">
                  {logoSvg}
                </div>
                <span className="text-xs font-bold text-slate-700 tracking-tight transition-colors duration-300 group-hover:text-[#2F6DFF]">
                  {plat.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
