import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ClipboardCheck,
  ChevronRight,
  TrendingUp,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Building,
  HeartCrack,
  Star,
  Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { isCorporateEmail } from '../utils/proposalDownloader';

interface OperationsHealthCheckProps {
  setCurrentPage: (page: string) => void;
}

const CHALLENGES_OPTIONS = [
  'Claims', 'Renewals', 'Endorsements', 'Billing', 'COI', 'Document Processing', 'Quality Control', 'Backlogs'
];

export default function OperationsHealthCheck({ setCurrentPage }: OperationsHealthCheckProps) {
  // Wizard state
  const [step, setStep] = useState<number>(1); // 1: Questions, 2: Results

  // Form Fields
  const [requests, setRequests] = useState<number>(500);
  const [turnaround, setTurnaround] = useState<string>('24-48 hours');
  const [teamSize, setTeamSize] = useState<number>(10);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [satisfaction, setSatisfaction] = useState<number>(7);

  // Result States
  const [score, setScore] = useState<number>(0);
  const [performanceLevel, setPerformanceLevel] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Database / Email States
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleChallenge = (challenge: string) => {
    setSelectedChallenges(prev =>
      prev.includes(challenge)
        ? prev.filter(item => item !== challenge)
        : [...prev, challenge]
    );
  };

  const calculateResults = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dynamic score calculation
    let calculatedScore = 100;

    // Deductions for turnaround
    if (turnaround === '12-24 hours') calculatedScore -= 10;
    else if (turnaround === '24-48 hours') calculatedScore -= 22;
    else if (turnaround === '48+ hours') calculatedScore -= 35;

    // Deductions for challenges
    calculatedScore -= selectedChallenges.length * 5;

    // Deductions for satisfaction
    if (satisfaction >= 9) calculatedScore -= 0;
    else if (satisfaction >= 7) calculatedScore -= 10;
    else if (satisfaction >= 5) calculatedScore -= 22;
    else calculatedScore -= 35;

    // Clamp score
    calculatedScore = Math.max(12, Math.min(98, calculatedScore));

    // Performance Level
    let level = 'Needs Improvement';
    if (calculatedScore >= 85) level = 'Excellent';
    else if (calculatedScore >= 60) level = 'Good';

    // Generate custom recommendations
    const recs: string[] = [];
    if (selectedChallenges.includes('Backlogs') || selectedChallenges.includes('COI') || selectedChallenges.includes('Document Processing')) {
      recs.push('Reduce manual certificate and index processing by transitioning repetitive queues to dedicated overnight global center squads.');
    }
    if (turnaround === '24-48 hours' || turnaround === '48+ hours') {
      recs.push('Accelerate broker SLA metrics to sub-12 hours by deploying synchronized overnight clearing teams.');
    }
    if (satisfaction < 8) {
      recs.push('Perform a detailed diagnostic workflow SOP analysis to optimize legacy Applied Epic, Vertafore, or Ezlynx steps.');
    }
    if (selectedChallenges.includes('Quality Control')) {
      recs.push('Establish structured Six Sigma checks paired with SOC 2 physical clean-room safeguards to guarantee 99.98% accuracy.');
    }
    if (recs.length === 0) {
      recs.push('Introduce dedicated operations specialists to free up domestic licensed producers to focus 100% on active premium growth.');
    }

    setScore(calculatedScore);
    setPerformanceLevel(level);
    setRecommendations(recs);
    setStep(2);
    setIsSaved(false);
    setErrorMsg(null);
  };

  const saveResults = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Corporate email is required to submit results.');
      return;
    }
    if (!isCorporateEmail(email)) {
      setErrorMsg('Please use a corporate email address (personal providers are restricted).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase
        .from('assessment_results')
        .insert([{
          email: email.trim().toLowerCase(),
          score,
          performance_level: performanceLevel,
          answers: {
            requests,
            turnaround,
            teamSize,
            challenges: selectedChallenges,
            satisfaction
          },
          recommendations
        }]);

      if (error) {
        console.error('Error saving assessment result:', error);
        throw error;
      }

      setIsSaved(true);
    } catch (err: any) {
      console.error('Exception saving assessment results:', err);
      setErrorMsg(err.message || 'Database connection failed. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAssessment = () => {
    setRequests(500);
    setTurnaround('24-48 hours');
    setTeamSize(10);
    setSelectedChallenges([]);
    setSatisfaction(7);
    setEmail('');
    setStep(1);
    setIsSaved(false);
    setErrorMsg(null);
  };

  return (
    <div id="health-check-section" className="bg-white border border-[#DCE7FF] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#2F6DFF]/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#A93DFF]/5 blur-3xl rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === 1 ? (
          /* STEP 1: ASSESSMENT QUESTIONS */
          <motion.div
            key="questions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF] font-mono flex items-center justify-center sm:justify-start gap-1">
                <ClipboardCheck className="w-4 h-4" /> Operational Diagnostic
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-[#081B8C]">
                Insurance Operations Health Assessment
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Take this 60-second operational health check to identify friction in your processing pipelines and receive customized acceleration recommendations.
              </p>
            </div>

            <form onSubmit={calculateResults} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* Left Form Panel */}
                <div className="space-y-6">
                  
                  {/* Q1: Monthly Requests */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline text-xs font-semibold">
                      <span className="text-gray-700">1. Monthly Insurance Requests processed:</span>
                      <span className="text-[#2F6DFF] font-mono font-bold">{requests.toLocaleString()} / Mo</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="5000"
                      step="50"
                      value={requests}
                      onChange={(e) => setRequests(Number(e.target.value))}
                      className="w-full h-1.5 accent-[#2F6DFF] bg-gray-100 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-gray-400">
                      <span>50 requests</span>
                      <span>2,500</span>
                      <span>5,000+ requests</span>
                    </div>
                  </div>

                  {/* Q2: Turnaround Time */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700 block">
                      2. Average turnaround time for endorsements or COIs:
                    </label>
                    <select
                      value={turnaround}
                      onChange={(e) => setTurnaround(e.target.value)}
                      className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl p-3 text-xs focus:outline-none focus:border-[#2F6DFF] transition-colors"
                    >
                      <option value="< 12 hours">Under 12 hours (Clear Queue)</option>
                      <option value="12-24 hours">12 to 24 hours (Standard queue)</option>
                      <option value="24-48 hours">24 to 48 hours (Backlog building)</option>
                      <option value="48+ hours">Over 48 hours (Severe backlog bottleneck)</option>
                    </select>
                  </div>

                  {/* Q3: Team Size */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline text-xs font-semibold">
                      <span className="text-gray-700">3. Current operations team size (FTEs):</span>
                      <span className="text-[#2F6DFF] font-mono font-bold">{teamSize} Employees</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={teamSize}
                      onChange={(e) => setTeamSize(Number(e.target.value))}
                      className="w-full h-1.5 accent-[#2F6DFF] bg-gray-100 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-gray-400">
                      <span>1 staff</span>
                      <span>50 staff</span>
                      <span>100+ staff</span>
                    </div>
                  </div>

                </div>

                {/* Right Form Panel */}
                <div className="space-y-6">
                  
                  {/* Q4: Biggest Challenges (Multi-select Grid) */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700 block">
                      4. What are your primary operational bottleneck areas? (Select all):
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CHALLENGES_OPTIONS.map(opt => {
                        const isChecked = selectedChallenges.includes(opt);
                        return (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => toggleChallenge(opt)}
                            className={`p-2.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer text-left flex items-center justify-between ${
                              isChecked
                                ? 'bg-blue-50 border-[#2F6DFF] text-[#2F6DFF]'
                                : 'bg-white border-[#DCE7FF] text-gray-600 hover:bg-slate-50'
                            }`}
                          >
                            <span>{opt}</span>
                            {isChecked && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Q5: Satisfaction Rating */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline text-xs font-semibold">
                      <span className="text-gray-700">5. Overall back-office processing satisfaction:</span>
                      <span className="text-[#2F6DFF] font-mono font-bold">{satisfaction} / 10</span>
                    </div>
                    <div className="flex justify-between gap-1.5">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                        const isSelected = satisfaction >= num;
                        return (
                          <button
                            type="button"
                            key={num}
                            onClick={() => setSatisfaction(num)}
                            className={`flex-1 h-9 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                              satisfaction === num
                                ? 'bg-[#2F6DFF] border-[#2F6DFF] text-white shadow-md shadow-blue-500/10'
                                : isSelected
                                ? 'bg-blue-50/50 border-blue-200 text-[#2F6DFF]'
                                : 'bg-white border-[#DCE7FF] text-gray-400 hover:bg-slate-50'
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>

              {/* Action row */}
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  className="cursor-pointer bg-[#081B8C] hover:bg-[#2F6DFF] text-white font-bold text-xs px-8 py-3.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-md group"
                >
                  <span>Analyze Operational Health</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* STEP 2: RESULTS PRESENTATION */
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* Health check header summary */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-gray-100 pb-6">
              
              {/* Radial score circle (4 cols) */}
              <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 rounded-full border-8 border-gray-100 flex flex-col items-center justify-center relative overflow-hidden bg-[#F8FAFF]">
                  {/* Decorative color arc */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="52"
                      className="stroke-[#2F6DFF] fill-none"
                      strokeWidth="8"
                      strokeDasharray="326"
                      strokeDashoffset={326 - (326 * score) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-3xl font-black text-[#081B8C] font-mono tracking-tight">{score}</span>
                  <span className="text-[9px] uppercase font-bold text-gray-400 font-mono tracking-wider">Health Score</span>
                </div>
              </div>

              {/* Status and summary (8 cols) */}
              <div className="md:col-span-8 space-y-3 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase font-mono">
                  <Star className="w-3.5 h-3.5 fill-current" /> Diagnosis: {performanceLevel}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#081B8C] font-display">
                  Your Operations Score is {score}/100
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  Based on a monthly request load of <strong>{requests.toLocaleString()} tasks</strong> with an average turnaround of <strong>{turnaround}</strong>, your back-office capacity features visible friction points.
                </p>
              </div>

            </div>

            {/* Custom recommendations list */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-widest text-slate-400 font-mono flex items-center gap-1">
                <Info className="w-4 h-4 text-[#2F6DFF]" /> Custom Acceleration Recommendations
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-[#F8FAFF] border border-[#DCE7FF]/40 rounded-2xl p-5 flex gap-3.5 items-start">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2F6DFF] flex items-center justify-center shrink-0 border border-blue-100">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-gray-800">Recommendation 0{idx + 1}</h5>
                      <p className="text-gray-500 text-xs leading-relaxed">{rec}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save/Email Results Form Container */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-2xl rounded-full" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                <div className="lg:col-span-6 space-y-2">
                  <h4 className="text-sm font-bold flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-blue-400" /> Save & Email Diagnostic Report
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Provide your corporate email address to receive your detailed PDF operational blueprint diagnostic directly to your inbox.
                  </p>
                </div>

                <div className="lg:col-span-6">
                  {isSaved ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-3 items-center text-xs text-emerald-400">
                      <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                      <div>
                        <h5 className="font-bold">Results Successfully Saved!</h5>
                        <p className="text-slate-400 text-[10px] mt-0.5">Your diagnostic report has been saved to Supabase securely.</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={saveResults} className="space-y-3">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="email"
                          required
                          placeholder="yourname@agency.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="cursor-pointer bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-1 transition-colors shrink-0"
                        >
                          {isSubmitting ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <span>Email Results</span>
                          )}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {errorMsg && (
                        <p className="text-[10px] text-red-400 flex items-center gap-1 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" /> {errorMsg}
                        </p>
                      )}
                      
                      <p className="text-slate-500 text-[9px] leading-normal flex gap-1.5 items-start">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Corporate email compliance applies. Your inbox credentials will not be shared or marketed under SOC 2 rules.</span>
                      </p>
                    </form>
                  )}
                </div>

              </div>
            </div>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-6 gap-4">
              <button
                onClick={resetAssessment}
                className="cursor-pointer text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1.5 py-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Operational Assessment</span>
              </button>

              <button
                onClick={() => {
                  setCurrentPage('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer bg-[#081B8C] hover:bg-[#2F6DFF] text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-1.5 transition-colors shadow-md"
              >
                <span>Book Free Consultation</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
