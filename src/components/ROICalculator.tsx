import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  FileCheck,
  Building2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Percent,
  Calculator,
  ShieldAlert,
  ArrowUpRight,
  Download
} from 'lucide-react';
import { PageType } from '../types';

interface ROICalculatorProps {
  setCurrentPage: (page: PageType) => void;
}

export default function ROICalculator({ setCurrentPage }: ROICalculatorProps) {
  // Inputs
  const [employeeCount, setEmployeeCount] = useState<number>(10);
  const [workloadHours, setWorkloadHours] = useState<number>(160);
  const [salary, setSalary] = useState<number>(4500);
  const [adminHours, setAdminHours] = useState<number>(40);
  const [insuranceRequests, setInsuranceRequests] = useState<number>(500);
  const [businessType, setBusinessType] = useState<string>('Property & Casualty');
  const [gtPackage, setGtPackage] = useState<number>(1600);

  // Calculations
  const overheadFactor = 1.20; // 20% estimated overhead
  const internalMonthlyCost = Math.round(employeeCount * salary * overheadFactor);
  const gtMonthlyCost = Math.round(employeeCount * gtPackage);
  
  const monthlySavings = Math.max(0, internalMonthlyCost - gtMonthlyCost);
  const annualSavings = monthlySavings * 12;
  const adminHoursSaved = employeeCount * adminHours;
  const productivityIncrease = Math.min(100, Math.round((adminHours / workloadHours) * 100));
  const roi = gtMonthlyCost > 0 ? Math.round((monthlySavings / gtMonthlyCost) * 100) : 0;

  const handleDownloadReport = () => {
    // Generate a simple print-optimized or text-based report and trigger download
    const reportText = `=====================================================
GOING TECHNOLOGIES GLOBAL OPERATIONS REPORT
PERSONALIZED ROI & OPERATIONAL SAVINGS ANALYSIS
=====================================================

Prepared For: Prospective Insurance Partner
Business Type: ${businessType}
Current Internal Team Scale: ${employeeCount} Operations FTEs
Average Monthly Salary: $${salary.toLocaleString()} USD
Overhead Factor: 20% Fully Loaded Burden

OPERATIONAL INPUTS:
-----------------------------------------------------
- Employees Handling Operations: ${employeeCount}
- Monthly Workload per Employee: ${workloadHours} Hours
- Avg. Salary per Employee: $${salary.toLocaleString()} / Mo
- Avg. Hours spent on Admin/Friction: ${adminHours} Hours
- Avg. Insurance Requests per Month: ${insuranceRequests}
- Target Global Center Seat Cost: $${gtPackage.toLocaleString()} / Mo

FINANCIAL IMPACT ANALYSIS:
-----------------------------------------------------
- Current Monthly Internal Cost: $${internalMonthlyCost.toLocaleString()} USD
- Optimized Global Center Cost:  $${gtMonthlyCost.toLocaleString()} USD
- Estimated Net Monthly Savings: $${monthlySavings.toLocaleString()} USD
- ESTIMATED NET ANNUAL SAVINGS: $${annualSavings.toLocaleString()} USD
- PROJECTED RETURN ON INVESTMENT: ${roi}% ROI

OPERATIONAL EFFICIENCY GAINS:
-----------------------------------------------------
- Reclaimed Administrative Capacity: ${adminHoursSaved.toLocaleString()} Hours/Month
- Direct Productivity Lift Estimate: ${productivityIncrease}%
- Estimated Request SLAs: overnight turnaround (< 12 Hours)

METRIC SUMMARY:
By transitioning standard repetitive workflows (policy checking, indexing,
COI processing, endorsements) from domestic licensed producers to Going
Technologies' SOC 2 compliant global centers, your agency reclaims up to 
${adminHours} hours per desk every single month to focus exclusively on client
generation and high-value binding operations.

=====================================================
© ${new Date().getFullYear()} Going Technologies Global. SOC 2 certified.
For a complete workflow assessment: admin@goingtechnologies.com
=====================================================`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Going_Technologies_ROI_Report_${businessType.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="roi-calculator-section" className="bg-slate-950 text-white rounded-3xl border border-slate-800 p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#2F6DFF] font-mono flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" /> Interactive ROI Modeling
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
              Configure Your Team Parameters
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Adjust the operational and cost sliders to reflect your current agency headcount, administrative overhead, and desired outsourced model.
            </p>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Business Type Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex justify-between">
              <span>Business Operations Model</span>
              <span className="text-[10px] text-slate-500 font-mono">SOP Mapping</span>
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="Property & Casualty">Property & Casualty Operations</option>
              <option value="Health Insurance">Health Insurance Broking</option>
              <option value="Life Insurance">Life Operations & Underwriting</option>
              <option value="Medicare Operations">Medicare Compliance & Intake</option>
              <option value="Custom">Custom Operations Pool</option>
            </select>
          </div>

          {/* Sliders */}
          <div className="space-y-5">
            {/* Employee Count */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" /> Team Scale (FTEs)
                </span>
                <span className="text-sm font-bold font-mono text-blue-400">{employeeCount} Staff</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>1 FTE</span>
                <span>50 FTEs</span>
                <span>100 FTEs</span>
              </div>
            </div>

            {/* Salary */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-slate-500" /> Avg. Monthly Salary
                </span>
                <span className="text-sm font-bold font-mono text-blue-400">${salary.toLocaleString()} / mo</span>
              </div>
              <input
                type="range"
                min="1000"
                max="12000"
                step="250"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>$1,000</span>
                <span>$6,500</span>
                <span>$12,000</span>
              </div>
            </div>

            {/* Admin Hours */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> Monthly Admin Hours/FTE
                </span>
                <span className="text-sm font-bold font-mono text-blue-400">{adminHours} Hours</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                value={adminHours}
                onChange={(e) => setAdminHours(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>5 Hrs</span>
                <span>60 Hrs</span>
                <span>120 Hrs</span>
              </div>
            </div>

            {/* Monthly Workload */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" /> Monthly Total Hours/FTE
                </span>
                <span className="text-sm font-bold font-mono text-blue-400">{workloadHours} Hours</span>
              </div>
              <input
                type="range"
                min="20"
                max="1000"
                step="10"
                value={workloadHours}
                onChange={(e) => setWorkloadHours(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>20 Hrs</span>
                <span>500 Hrs</span>
                <span>1000 Hrs</span>
              </div>
            </div>

            {/* Global Center Package / Seat */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-slate-500" /> GT Monthly Seat Rate
                </span>
                <span className="text-sm font-bold font-mono text-emerald-400">${gtPackage.toLocaleString()} / mo</span>
              </div>
              <input
                type="range"
                min="1300"
                max="2000"
                step="50"
                value={gtPackage}
                onChange={(e) => setGtPackage(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>$1,300</span>
                <span>$1,650</span>
                <span>$2,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Results & Comparison (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
          
          {/* Top Live Calculations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Monthly Savings */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 blur-xl rounded-full" />
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Estimated Monthly Savings
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1 tracking-tight">
                ${monthlySavings.toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                Direct payroll & overhead reduction
              </p>
            </div>

            {/* Annual Savings */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 blur-xl rounded-full" />
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Estimated Annual Savings
              </span>
              <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono mt-1 tracking-tight">
                ${annualSavings.toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                Reinvestable cash back-office margin
              </p>
            </div>

            {/* Return on Investment */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 blur-xl rounded-full" />
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Projected Return (ROI)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono mt-1 tracking-tight">
                {roi}%
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                Savings over outsourcing capital
              </p>
            </div>
            
            {/* Reclaimed Admin Hours */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Administrative Hours Saved
              </span>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1 tracking-tight">
                {adminHoursSaved.toLocaleString()} Hrs
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                Reclaimed monthly across operations
              </p>
            </div>

            {/* Productivity Increase */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Estimated Productivity Lift
              </span>
              <div className="text-2xl font-black text-cyan-400 font-mono mt-1 tracking-tight">
                +{productivityIncrease}%
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                Producers freed from clerical bottlenecks
              </p>
            </div>

            {/* Overhead Savings */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Eliminated Overhead Burden
              </span>
              <div className="text-2xl font-black text-red-400 font-mono mt-1 tracking-tight">
                $20% Fixed
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                Taxes, hardware, local office desks
              </p>
            </div>

          </div>

          {/* Cost Comparison Bar Chart (Premium Custom SVG representation) */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h4 className="text-xs uppercase font-bold font-mono tracking-widest text-slate-400">
              Monthly Cost Comparison Modeling
            </h4>

            <div className="space-y-4">
              {/* Internal cost bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Standard Domestic Operations Team (Fully Loaded)</span>
                  <span className="text-red-400 font-mono font-bold">${internalMonthlyCost.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-800 h-6 rounded-lg overflow-hidden relative">
                  <motion.div
                    className="bg-gradient-to-r from-red-500/80 to-red-600/80 h-full rounded-lg"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white uppercase tracking-wider">
                    Local Payroll + 20% Taxes & Burden
                  </span>
                </div>
              </div>

              {/* Going Technologies cost bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Going Technologies Dedicated Global Center Pod</span>
                  <span className="text-emerald-400 font-mono font-bold">${gtMonthlyCost.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-800 h-6 rounded-lg overflow-hidden relative">
                  <motion.div
                    className="bg-gradient-to-r from-emerald-500/80 to-emerald-600/80 h-full rounded-lg"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(10, Math.min(100, (gtMonthlyCost / internalMonthlyCost) * 100))}%` }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white uppercase tracking-wider">
                    Optimized Outsourcing Plan (-{Math.round((1 - (gtMonthlyCost / internalMonthlyCost)) * 100)}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 leading-normal flex gap-1.5 items-start">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
              <span>
                Standard formula: Internal cost includes localized base salaries scaled by 1.20 for payroll compliance, hardware leasing, and workspace rent. Going Technologies pricing translates as fully managed virtual seats under secure SOC 2 environments.
              </span>
            </div>
          </div>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={() => {
                setCurrentPage('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs p-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/10"
            >
              <span>Book Strategy Briefing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadReport}
              className="flex-1 cursor-pointer bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs p-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download ROI Report (.txt)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
