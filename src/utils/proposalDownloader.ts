import { supabase } from '../lib/supabase';
import { logDetailedError } from './errorLogger';
import { saveLocalLead, generateFallbackId } from './localLeadsFallback';
import { broadcastChange } from './realtimeHelper';

export interface DownloadResult {
  success?: boolean;
  error?: string;
}

// Blocked personal/free email domains
const BLOCKED_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
  'live.com', 'icloud.com', 'me.com', 'msn.com', 'aol.com', 'proton.me', 
  'protonmail.com', 'gmx.com', 'mail.com', 'zoho.com', 'yandex.com', 
  'rediffmail.com', 'fastmail.com', 'qq.com', '163.com', '126.com', 
  'hey.com', 'tutanota.com'
]);

export function isCorporateEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  const parts = email.trim().split('@');
  if (parts.length < 2) return false;
  const domain = parts[parts.length - 1].toLowerCase();
  return !BLOCKED_DOMAINS.has(domain);
}

// Helper to compile a valid on-the-fly PDF in case of storage issues
function generateFallbackPdf(agencyName: string, sector: string): Blob {
  const pdfTemplate = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.27 841.89] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 400 >>
stream
BT
/F1 18 Tf
72 750 Td
(GOING TECHNOLOGIES INSURANCE OPERATIONS PROPOSAL) Tj
/F1 12 Tf
0 -30 Td
(Customized Operations & Staffing Model) Tj
/F2 10 Tf
0 -40 Td
(Prepared for: ${agencyName}) Tj
0 -20 Td
(Industry Sector: ${sector}) Tj
0 -25 Td
(Date: ${new Date().toLocaleDateString()}) Tj
0 -40 Td
(Going Technologies delivers premium, carrier-grade business process outsourcing) Tj
0 -15 Td
(and scalable staff augmentation services specifically optimized for the insurance) Tj
0 -15 Td
(market. Our Six Sigma operations centers streamline AMS data ingestion, policy) Tj
0 -15 Td
(auditing, customer service support, and back-office renewals.) Tj
0 -30 Td
(1. Financial Impact: Realize 50% to 70% immediate payroll overhead reductions.) Tj
0 -20 Td
(2. Operational Excellence: Round-the-clock coverage, SLA-backed performance.) Tj
0 -20 Td
(3. Robust Compliance: ISO/IEC 27001 data safety standards.) Tj
0 -50 Td
(Thank you for downloading our operations proposal. Our executives will reach) Tj
0 -15 Td
(out to you shortly with a bespoke pricing matrix.) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000302 00000 n
trailer
<< /Size 5 /Root 1 0 R >>
startxref
750
%%EOF`;
  return new Blob([pdfTemplate], { type: 'application/pdf' });
}

export async function downloadProposal(
  agencyName: string,
  companyEmail: string,
  sector: string,
  source: string,
  pageUrl: string
): Promise<DownloadResult> {
  const trimmedEmail = companyEmail.trim();
  const trimmedAgency = agencyName.trim();
  
  if (!trimmedAgency) {
    return { error: 'Agency / Company Name is required.' };
  }
  if (!trimmedEmail) {
    return { error: 'Business Email address is required.' };
  }
  if (!sector) {
    return { error: 'Business Sector selection is required.' };
  }

  if (!isCorporateEmail(trimmedEmail)) {
    return { error: 'Please use your company email address to download this proposal.' };
  }

  const proposalFileName = 'Going Technologies Insurance operations proposal.pdf';
  const emailClean = trimmedEmail.toLowerCase();
  
  const leadData = {
    id: generateFallbackId(),
    agency_name: trimmedAgency,
    company_email: emailClean,
    business_email: emailClean,
    sector: sector,
    business_sector: sector,
    proposal_name: proposalFileName,
    status: 'Downloaded',
    source: source || 'Website Proposal',
    created_at: new Date().toISOString()
  };

  // Save locally first for guaranteed resilience
  saveLocalLead('business_proposal_leads', leadData);
  
  // Broadcast change immediately for real-time sync across connected admin screens
  broadcastChange('business_proposal_leads', 'INSERT', leadData);

  try {
    // Save lead to business_proposal_leads
    const { business_email, business_sector, ...supabaseLeadData } = leadData;
    const { error: insertError } = await supabase
      .from('business_proposal_leads')
      .insert([supabaseLeadData]);

    if (insertError) {
      console.warn('Supabase business_proposal_leads insert warning:', insertError.message || insertError);
      // Avoid calling logDetailedError for PGRST205 / missing table errors
      const isMissingTable = insertError.code === 'PGRST205' || 
                             (insertError.message && insertError.message.includes('schema cache')) || 
                             (insertError.message && insertError.message.includes('relation') && insertError.message.includes('does not exist'));
      if (!isMissingTable) {
        logDetailedError({
          url: 'Supabase Insert business_proposal_leads',
          errorMessage: insertError.message,
          errorCode: insertError.code,
          supabaseError: insertError,
          functionName: 'downloadProposal -> insert'
        });
      }
    }

    // Try to retrieve the real template from storage bucket
    console.log('[DEBUG] Trying to fetch proposal from Supabase Storage...');
    const storageFileName = 'Going Technologies Insurance operations proposal.pdf';
    const { data: publicUrlData } = supabase.storage
      .from('goingtechnologies')
      .getPublicUrl(storageFileName);

    let blob: Blob | null = null;

    if (publicUrlData?.publicUrl) {
      try {
        const res = await fetch(publicUrlData.publicUrl);
        if (res.ok) {
          blob = await res.blob();
        }
      } catch (fetchErr) {
        console.warn('Could not fetch proposal from Supabase Storage, generating fallback PDF...', fetchErr);
      }
    }

    // If storage is unavailable, use our generated high-fidelity PDF
    if (!blob) {
      console.log('[DEBUG] Storage PDF not available. Creating tailored fallback PDF...');
      blob = generateFallbackPdf(trimmedAgency, sector);
    }

    // Trigger downloading
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', proposalFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    return { success: true };
  } catch (err: any) {
    console.error('Proposal download flow exception:', err);
    // Ultimate fallback download
    try {
      const blob = generateFallbackPdf(trimmedAgency, sector);
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', proposalFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      return { success: true };
    } catch (innerErr) {
      return { error: 'An unexpected error occurred during document assembly.' };
    }
  }
}
