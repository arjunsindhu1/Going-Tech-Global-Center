import { supabase } from '../lib/supabase';
import { logDetailedError, getActualReason } from './errorLogger';

export interface DownloadResult {
  success?: boolean;
  error?: string;
}

// Blocked email domains
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

// Parse simple browser and device from User Agent
function parseUserAgent(userAgent: string = '') {
  let browser = 'Unknown Browser';
  let device = 'Desktop';
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('chrome') && !ua.includes('chromium')) browser = 'Chrome';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edge') || ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipad')) {
    if (ua.includes('ipad') || ua.includes('tablet')) {
      device = 'Tablet';
    } else {
      device = 'Mobile';
    }
  }
  return { browser, device };
}

// Client-side IP and geolocation telemetry lookup with fallback
async function getTelemetryData() {
  let ip_address = 'Unknown';
  let country = 'Unknown';
  let city = 'Unknown';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      ip_address = data.ip || 'Unknown';
      country = data.country_name || data.country || 'Unknown';
      city = data.city || 'Unknown';
    }
  } catch (err) {
    console.warn('[Telemetry] Standard ipapi fetch failed or timed out:', err);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        ip_address = data.ip || 'Unknown';
      }
    } catch (e2) {
      // Fail silently
    }
  }
  return { ip_address, country, city };
}

export async function downloadProposal(
  email: string,
  source: string,
  pageUrl: string
): Promise<DownloadResult> {
  const trimmedEmail = email.trim();
  
  if (!trimmedEmail) {
    return { error: 'Email address is required.' };
  }

  if (!isCorporateEmail(trimmedEmail)) {
    return { error: 'Please use your company email address to download this proposal.' };
  }

  const parts = trimmedEmail.split('@');
  const companyDomain = parts[parts.length - 1].toLowerCase();
  const fileName = 'Going Technologies Insurance operations proposal.pdf';
  const emailClean = trimmedEmail.toLowerCase();
  
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const { browser, device } = parseUserAgent(userAgent);
  
  // Fetch telemetry in parallel with checking database
  const telemetryPromise = getTelemetryData();
  
  try {
    // Check if email already exists in proposal_downloads
    const { data: existingData, error: fetchError } = await supabase
      .from('proposal_downloads')
      .select('id, download_count')
      .eq('email', emailClean)
      .maybeSingle();

    if (fetchError) {
      console.error('[ERROR] Supabase fetch error:', fetchError);
      logDetailedError({
        url: 'Supabase Query proposal_downloads',
        errorMessage: fetchError.message,
        errorCode: fetchError.code,
        supabaseError: fetchError,
        functionName: 'downloadProposal -> check existing'
      });
      return { error: 'Database connection failed. Please try again later.' };
    }

    const { ip_address, country, city } = await telemetryPromise;

    if (existingData) {
      // Duplicate lead: Update count & last_downloaded_at
      const newCount = (existingData.download_count || 1) + 1;
      const { error: updateError } = await supabase
        .from('proposal_downloads')
        .update({
          download_count: newCount,
          last_downloaded_at: new Date().toISOString(),
          ip_address,
          country,
          city,
          browser,
          device,
          user_agent: userAgent,
          source: source || 'Exit Popup',
          page_url: pageUrl || ''
        })
        .eq('id', existingData.id);

      if (updateError) {
        console.error('[ERROR] Supabase update error:', updateError);
        logDetailedError({
          url: 'Supabase Update proposal_downloads',
          errorMessage: updateError.message,
          errorCode: updateError.code,
          supabaseError: updateError,
          functionName: 'downloadProposal -> update existing'
        });
        return { error: 'Database update failed. Please try again later.' };
      }
    } else {
      // New lead: Insert a brand new record
      const { error: insertError } = await supabase
        .from('proposal_downloads')
        .insert([{
          email: emailClean,
          company_domain: companyDomain,
          source: source || 'Exit Popup',
          page_url: pageUrl || '',
          downloaded_file: fileName,
          ip_address,
          country,
          city,
          browser,
          device,
          user_agent: userAgent,
          download_count: 1,
          last_downloaded_at: new Date().toISOString(),
          download_time: new Date().toISOString()
        }]);

      if (insertError) {
        console.error('[ERROR] Supabase insert error:', insertError);
        logDetailedError({
          url: 'Supabase Insert proposal_downloads',
          errorMessage: insertError.message,
          errorCode: insertError.code,
          supabaseError: insertError,
          functionName: 'downloadProposal -> insert new'
        });
        return { error: 'Database record insertion failed. Please try again later.' };
      }
    }

    // Generate Public URL from Supabase Storage
    console.log('[DEBUG] Generating public URL from bucket "goingtechnologies" for file:', fileName);
    const { data: publicUrlData } = supabase.storage
      .from('goingtechnologies')
      .getPublicUrl(fileName);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      return { error: 'Failed to construct secure download link. Please contact support.' };
    }

    const publicUrl = publicUrlData.publicUrl;
    console.log('[DEBUG] Public URL generated successfully:', publicUrl);

    // Initiate download from the public URL
    const fileRetrievalStart = performance.now();
    let fileRes: Response;
    try {
      fileRes = await fetch(publicUrl);
    } catch (fileFetchErr: any) {
      const reason = getActualReason(fileFetchErr, publicUrl);
      logDetailedError({
        url: publicUrl,
        errorMessage: fileFetchErr.message || 'Fetch failed',
        errorCode: fileFetchErr.code || fileFetchErr.name,
        stack: fileFetchErr.stack,
        functionName: 'downloadProposal -> fetch public file'
      });
      return { error: reason };
    }

    if (!fileRes.ok) {
      let fileResBody = '';
      try {
        fileResBody = await fileRes.text();
      } catch (readErr) {
        console.error('Failed to read file response body:', readErr);
      }
      const errorMsg = fileResBody || `HTTP ${fileRes.status} ${fileRes.statusText}`;
      const reason = getActualReason(new Error(errorMsg), publicUrl, fileRes.status, fileResBody);
      logDetailedError({
        url: publicUrl,
        status: fileRes.status,
        responseBody: fileResBody,
        errorMessage: errorMsg,
        errorCode: `HTTP_${fileRes.status}`,
        functionName: 'downloadProposal -> response check'
      });
      return { error: reason };
    }

    const blob = await fileRes.blob();
    const fileRetrievalTime = performance.now() - fileRetrievalStart;
    console.log(`[DEBUG] PDF file fetched in ${fileRetrievalTime.toFixed(1)}ms`);

    // Download the PDF file using blob
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', 'Going Technologies Insurance Operations Proposal.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    return { success: true };
  } catch (err: any) {
    console.error('Core download flow exception:', err);
    logDetailedError({
      url: 'Core Client-side Proposal Download Flow',
      errorMessage: err.message || 'Unknown exception',
      errorCode: err.name || 'EXCEPTION',
      stack: err.stack,
      functionName: 'downloadProposal -> outer try-catch'
    });
    return { error: getActualReason(err, 'Local client flow') };
  }
}
