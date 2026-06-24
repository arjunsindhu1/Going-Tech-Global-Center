import { PageType } from '../types';

interface TermsProps {
  setCurrentPage: (page: PageType) => void;
}

export default function Terms({ setCurrentPage }: TermsProps) {
  return (
    <div className="bg-[#F8FAFF] font-sans text-[#111827] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white border border-[#DCE7FF] rounded-2xl p-8 lg:p-12 shadow-xs space-y-8">
        
        <div className="border-b border-gray-100 pb-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Governance Agreement</span>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#081B8C] tracking-tight">
            Corporate Terms & Conditions
          </h1>
          <p className="text-xs text-gray-400 font-mono">Effective Date: June 24, 2026 // Operational Service Level Terms</p>
        </div>

        <div className="space-y-6 text-gray-600 leading-relaxed text-sm">
          <p>
            Welcome to Going Technologies Global Center. By browsing this website, scheduling strategy assessments, or contracting our specialized operations teams, your organization agrees to the following institutional terms and conditions.
          </p>

          <h2 className="text-lg font-bold text-[#081B8C] font-display mt-6">1. Standard Operating Procedures (SOPs) & Service SLAs</h2>
          <p>
            All pilot and steady-state team operations are governed by custom written Standard Operating Procedure (SOP) playbooks co-signed by Going Technologies and the client. Guaranteed throughput speeds (such as certificate of insurance issuances under 15 minutes or submission indexing under 2 hours) represent contract-backed Service Level Agreements (SLAs).
          </p>

          <h2 className="text-lg font-bold text-[#081B8C] font-display mt-6">2. Zero-Trust Access Authorization</h2>
          <p>
            Clients are solely responsible for provisioning secure, restricted-role logins to their Agency Management Systems (AMS), comparative raters, and databases. Going Technologies requires multi-factor authentication (MFA) to be configured for all team accounts, accessing terminals solely via our monitored physical clean-rooms.
          </p>

          <h2 className="text-lg font-bold text-[#081B8C] font-display mt-6">3. Limitation of Liability and Quality Audits</h2>
          <p>
            While Going Technologies maintains an industry-leading 99.98% data input accuracy standard under Six Sigma monitoring, clients remain the ultimate signing and binding authority. All rate comparisons, binder structures, and policy checksheets must undergo final domestic review before official binding occurs.
          </p>

          <h2 className="text-lg font-bold text-[#081B8C] font-display mt-6">4. Jurisdiction & Governing Law</h2>
          <p>
            These terms, website bookings, and strategic consultations are governed and interpreted in accordance with the laws of India. Any dispute or arbitration shall be conducted inside the jurisdiction of Visakhapatnam, Andhra Pradesh, India.
          </p>
        </div>

        <div className="border-t border-gray-100 pt-8 text-center">
          <button
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer bg-[#081B8C] hover:bg-[#2F6DFF] text-white text-xs font-bold px-6 py-3 rounded-full"
          >
            Return to Home
          </button>
        </div>

      </div>
    </div>
  );
}
