import { PageType } from '../types';

interface PrivacyProps {
  setCurrentPage: (page: PageType) => void;
}

export default function Privacy({ setCurrentPage }: PrivacyProps) {
  return (
    <div className="bg-[#F8FAFF] font-sans text-[#111827] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white border border-[#DCE7FF] rounded-2xl p-8 lg:p-12 shadow-xs space-y-8">
        
        <div className="border-b border-gray-100 pb-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Regulatory Compliance</span>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#081B8C] tracking-tight">
            Corporate Privacy Policy
          </h1>
          <p className="text-xs text-gray-400 font-mono">Last Updated: June 24, 2026 // SOC 2 Type II Audited</p>
        </div>

        <div className="space-y-6 text-gray-600 leading-relaxed text-sm">
          <p>
            Going Technologies Global Center ("Going Tech", "we", "us", or "our") is committed to protecting the privacy, confidentiality, and security of all organizational and individual consumer data entrusted to our operations. We operate in strict compliance with the American Institute of Certified Public Accountants (AICPA) SOC 2 Type II security principles and the Health Insurance Portability and Accountability Act (HIPAA) standards.
          </p>

          <h2 className="text-lg font-bold text-[#081B8C] font-display mt-6">1. Scope of Operations and Data Collection</h2>
          <p>
            We do not collect or store client policyholder personal records natively on our localized storage devices or physical facilities. Our specialized teams access client Agency Management Systems (AMS), Customer Relationship Management (CRM) portals, and core business databases solely via secure, audited Virtual Desktop Interfaces (VDIs) or secure Citirx terminal sessions configured by our clients.
          </p>

          <h2 className="text-lg font-bold text-[#081B8C] font-display mt-6">2. Zero-Trust Security & Operational Architecture</h2>
          <p>
            To eliminate data leakage, we enforce strict Clean-Room protocols within our physical Global Delivery Center:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Citrix / VDI Separation:</strong> Direct remote connections with clipboard copy-paste, local file downloads, and remote file printing entirely disabled.</li>
            <li><strong>Physical Cleanliness:</strong> No mobile communication devices, smartwatches, personal notebooks, or writing utensils are permitted inside active operator rooms.</li>
            <li><strong>Continuous Monitoring:</strong> Comprehensive screen recordings, keyboard stroke tracking, and localized network traffic analysis are actively logged.</li>
          </ul>

          <h2 className="text-lg font-bold text-[#081B8C] font-display mt-6">3. Compliance and Regulatory Standards</h2>
          <p>
            We coordinate with US-based organizations representing diverse demographic ranges. As such, our administrative pipelines are engineered to support State-specific Carrier guidelines, CMS Marketing Compliance rules, and state-level Property & Casualty licensing guidelines.
          </p>

          <h2 className="text-lg font-bold text-[#081B8C] font-display mt-6">4. Contact Governance</h2>
          <p>
            For privacy audits, compliance verification, or general questions about our SOC 2 Type II control binders, please contact our corporate privacy department at <a href="mailto:connect@goingtechnologies.com" className="text-[#2F6DFF] font-bold hover:underline">connect@goingtechnologies.com</a>.
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
