import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Terminal, 
  FileText, 
  Calculator, 
  Activity, 
  Download, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  Lock,
  CheckCircle2,
  X,
  FileCheck2,
  LockKeyhole
} from 'lucide-react';

interface SearchItem {
  id: string;
  title: string;
  category: 'Tools' | 'SOPs' | 'Compliance' | 'Platforms';
  desc: string;
  badge: string;
  badgeColor: string;
  actionType: 'tab' | 'document';
  target: string;
  documentContent?: string;
}

interface ActionSearchBarProps {
  onSelectTab: (tool: 'roi' | 'health') => void;
  isUnlocked: boolean;
  onOpenLeadModal: () => void;
}

export default function ActionSearchBar({ onSelectTab, isUnlocked, onOpenLeadModal }: ActionSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState<SearchItem | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferProgress, setTransferProgress] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const searchItems: SearchItem[] = [
    {
      id: 'roi-calc',
      title: 'ROI Staffing Cost Savings Calculator',
      category: 'Tools',
      desc: 'Model salary scales & compute exact yearly overhead reductions.',
      badge: 'Interactive',
      badgeColor: 'bg-blue-50 text-blue-600 border-blue-200',
      actionType: 'tab',
      target: 'roi'
    },
    {
      id: 'health-check',
      title: 'Operations Health Check Assessment',
      category: 'Tools',
      desc: 'Brief diagnostic questionnaire to evaluate systematically.',
      badge: 'Scorecard',
      badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      actionType: 'tab',
      target: 'health'
    },
    {
      id: 'acord-sop',
      title: 'ACORD 25 Certificate Processing Standard Operating Procedure',
      category: 'SOPs',
      desc: 'Step-by-step domestic verification checklist for rapid overnight COI dispatch.',
      badge: 'SOP Guide',
      badgeColor: 'bg-amber-50 text-amber-600 border-amber-200',
      actionType: 'document',
      target: 'acord-sop',
      documentContent: '### ACORD 25 Certificate dispatch SOP\n1. Receive Certificate requests via automated broker channels.\n2. Access agency database under direct supervisor-level credentials.\n3. Validate policy limits, effective periods, and exclusion riders.\n4. Draft certificate copy matching target requirements precisely.\n5. Audit ACORD limits via dual-validation quality controllers before distribution.'
    },
    {
      id: 'epic-vdi',
      title: 'Applied Epic Zero-Trust secure VDI setup manual',
      category: 'Compliance',
      desc: 'Technical infrastructure security guidelines under direct US supervision.',
      badge: 'Technical PDF',
      badgeColor: 'bg-cyan-50 text-cyan-600 border-cyan-200',
      actionType: 'document',
      target: 'epic-vdi',
      documentContent: '### Zero-Trust VDI Pipeline configuration\n1. Remote desk operating under restricted VM partitions.\n2. Clipboard, printer sharing, and secondary storage channels strictly disabled.\n3. Multi-Factor Authentication mapped to physical tokens.\n4. Real-time active screen recording and behavior biometric logs enabled.'
    },
    {
      id: 'ams-comms',
      title: 'AMS360 commission reconciliation templates',
      category: 'SOPs',
      desc: 'Standard mapping schema to audit and reconcile monthly carrier accounts.',
      badge: 'SOP Sheet',
      badgeColor: 'bg-purple-50 text-purple-600 border-purple-200',
      actionType: 'document',
      target: 'ams-comms',
      documentContent: '### AMS360 Commission Reconciliation Blueprint\n1. Import direct-bill ledger statement sheets.\n2. Reconcile broker splits using matching commission rules.\n3. Flag premium discrepancies exceeding 1.5% margins.\n4. Autopopulate variance audits for carrier billing dispute.'
    },
    {
      id: 'soc2-audit',
      title: 'SOC 2 Type II Compliance Framework Portfolio',
      category: 'Compliance',
      desc: 'Audit scopes, Non-Public Personal Information protocols, and storage logs.',
      badge: 'SOC 2 Portfolio',
      badgeColor: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      actionType: 'document',
      target: 'soc2-audit',
      documentContent: '### SOC 2 Type II System Security Policies\n- **In-Transit Data Security**: TLS 1.3 enforced across all processing tunnels.\n- **Data At Rest**: AES-256 cloud encryption with secure hardware HSM keys.\n- **Access Control**: Role-Based access limited strictly to certified on-duty operators.'
    }
  ];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredItems = searchItems.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase()) ||
    item.desc.toLowerCase().includes(query.toLowerCase())
  );

  const handleItemSelect = (item: SearchItem) => {
    setIsOpen(false);
    setQuery('');
    
    if (item.actionType === 'tab') {
      if (!isUnlocked) {
        onOpenLeadModal();
      } else {
        onSelectTab(item.target as 'roi' | 'health');
        // Scroll smoothly to selector section
        const element = document.getElementById('business-tools-selector');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    } else {
      // Document content
      if (!isUnlocked) {
        onOpenLeadModal();
      } else {
        // Trigger high-fidelity download animation first!
        setSelectedDoc(item);
        setIsTransferring(true);
        setTransferProgress(0);
      }
    }
  };

  // Simulated Vercel-style file transfer animation
  useEffect(() => {
    if (isTransferring) {
      const interval = setInterval(() => {
        setTransferProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsTransferring(false);
            }, 800);
            return 100;
          }
          return prev + 12;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isTransferring]);

  return (
    <div className="relative w-full max-w-3xl mx-auto" ref={dropdownRef}>
      {/* Search Bar Input Container */}
      <div className="relative z-30 p-[1.5px] rounded-2xl bg-gradient-to-r from-[#DCE7FF]/80 via-[#2F6DFF]/10 to-[#A93DFF]/20 shadow-lg focus-within:from-[#2F6DFF] focus-within:via-[#A93DFF] focus-within:to-cyan-400 transition-all duration-300">
        <div className="bg-white/95 backdrop-blur-md rounded-[15px] flex items-center px-4 py-3.5 gap-3.5 relative">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search operational tools, ACORD SOPs, SOC2 compliance policies..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIdx(0);
            }}
            onFocus={() => setIsOpen(true)}
            className="w-full bg-transparent border-none text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none"
          />
          
          {/* Action tags count */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex bg-slate-50 border border-gray-100 text-[10px] font-mono text-gray-400 px-2 py-0.5 rounded-lg select-none">
              6 files index
            </span>
            <span className="bg-[#2F6DFF]/10 border border-[#2F6DFF]/25 text-[9px] font-mono font-bold text-[#2F6DFF] px-2 py-0.5 rounded-md">
              ⌘K
            </span>
          </div>
        </div>
      </div>

      {/* Live Dropdown Results (inspired by kokonutd command bar) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 mt-3 z-30 bg-white/98 backdrop-blur-2xl border border-[#DCE7FF] rounded-2xl shadow-2xl p-3 overflow-hidden max-h-[350px] overflow-y-auto"
          >
            {filteredItems.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2 py-1 border-b border-gray-50">
                  <span className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest">
                    Available Enterprise Assets
                  </span>
                  <span className="text-[9px] font-mono text-gray-400">
                    ESC to close
                  </span>
                </div>

                <div className="space-y-1">
                  {filteredItems.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemSelect(item)}
                      onMouseEnter={() => setSelectedIdx(idx)}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-4 cursor-pointer ${
                        selectedIdx === idx 
                          ? 'bg-[#2F6DFF]/5 text-gray-900 border-l-4 border-[#2F6DFF]' 
                          : 'bg-transparent text-gray-600 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold leading-none ${selectedIdx === idx ? 'text-[#2F6DFF]' : 'text-gray-800'}`}>
                            {item.title}
                          </span>
                          <span className={`text-[8px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded border shrink-0 ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 truncate leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5">
                        {!isUnlocked ? (
                          <Lock className="w-3.5 h-3.5 text-amber-500 opacity-60" />
                        ) : item.actionType === 'tab' ? (
                          <ArrowRight className="w-3.5 h-3.5 text-[#2F6DFF]" />
                        ) : (
                          <Download className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400 gap-2">
                <Terminal className="w-6 h-6 animate-pulse text-gray-300" />
                <p className="text-xs">No matching files found. Search SOP, ROI or SOC2.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulated Document Viewer Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 bg-[#081B8C]/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-[#DCE7FF] max-w-lg w-full overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="bg-[#081B8C] text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-cyan-300 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold font-display leading-tight">{selectedDoc.title}</h4>
                    <p className="text-[10px] text-slate-300 mt-0.5 font-mono">Secure Enterprise Vault Transfer</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="p-1 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Loader body */}
              {isTransferring ? (
                <div className="p-10 text-center space-y-6">
                  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#2F6DFF] animate-spin" />
                    <Download className="w-8 h-8 text-[#2F6DFF] animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-700">Downloading Vault Assets...</p>
                    <div className="w-full max-w-xs mx-auto bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#2F6DFF] to-[#A93DFF] h-full transition-all duration-100" style={{ width: `${transferProgress}%` }} />
                    </div>
                    <p className="text-[10px] font-mono text-gray-400">{transferProgress}% SECURE CHANNEL SYNC</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-5">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4 max-h-[250px] overflow-y-auto">
                    <div className="flex items-center gap-2 border-b border-gray-200 pb-2.5">
                      <FileCheck2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">DOCUMENT CONTENT VERIFIED</span>
                    </div>
                    <div className="text-xs text-gray-600 font-medium whitespace-pre-line leading-relaxed">
                      {selectedDoc.documentContent}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                    <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Ready for integration</span>
                    </div>
                    <button
                      onClick={() => setSelectedDoc(null)}
                      className="px-5 py-2.5 bg-[#081B8C] hover:bg-[#2F6DFF] text-white rounded-xl font-bold text-xs cursor-pointer shadow-sm"
                    >
                      Dismiss View
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
