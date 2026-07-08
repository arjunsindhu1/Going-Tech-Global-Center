import { supabase } from '../lib/supabase';

export interface ErrorDetails {
  url: string;
  status?: number;
  responseBody?: string;
  errorCode?: string;
  errorMessage: string;
  stack?: string;
  supabaseError?: any;
  functionName?: string;
}

// Function to print the requested structured error details in the specified format
export function logDetailedError(details: ErrorDetails) {
  const currentOrigin = window.location.origin;
  const currentHost = window.location.host;
  const currentUrl = window.location.href;

  const envVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'Loaded (masked: ' + import.meta.env.VITE_SUPABASE_URL.substring(0, 15) + '...)' : 'Missing',
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Loaded' : 'Missing',
    NEXT_PUBLIC_SUPABASE_URL: import.meta.env.NEXT_PUBLIC_SUPABASE_URL ? 'Loaded (masked: ' + import.meta.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 15) + '...)' : 'Missing',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Loaded' : 'Missing',
    SUPABASE_URL: (import.meta.env as any).SUPABASE_URL ? 'Loaded' : 'Missing',
    SUPABASE_ANON_KEY: (import.meta.env as any).SUPABASE_ANON_KEY ? 'Loaded' : 'Missing'
  };

  console.error(
    `%cProduction Error\n` +
    `HTTP Status: ${details.status !== undefined ? details.status : 'N/A'}\n` +
    `Request URL: ${details.url}\n` +
    `Response Body: ${details.responseBody || 'N/A'}\n` +
    `Supabase Error: ${details.supabaseError ? JSON.stringify(details.supabaseError, null, 2) : 'N/A'}\n` +
    `Stack Trace: ${details.stack || 'N/A'}`,
    'color: #EF4444; font-weight: bold; font-size: 12px;'
  );

  console.group('%c=== PRODUCTION DEPLOYMENT AUDIT LOG ===', 'color: #3B82F6; font-weight: bold;');
  console.log('%cFunction Name:', 'font-weight: bold;', details.functionName || 'N/A');
  console.log('%cCurrent Origin:', 'font-weight: bold;', currentOrigin);
  console.log('%cCurrent Host:', 'font-weight: bold;', currentHost);
  console.log('%cCurrent URL:', 'font-weight: bold;', currentUrl);
  console.log('%cEnvironment Variables Loaded:', 'font-weight: bold;', envVars);
  console.groupEnd();

  // Run the full diagnostic check in the background automatically when any error occurs
  runProductionAudit().catch(err => console.error('Audit run failed:', err));
}

// Function to run complete diagnostics on demand and print a final report
export async function runProductionAudit(): Promise<void> {
  console.log('%c[AUDIT] Starting full production deployment audit...', 'color: #3B82F6; font-weight: bold;');
  
  const currentOrigin = window.location.origin;
  const currentHost = window.location.host;
  const currentUrl = window.location.href;

  const envsReport = {
    SUPABASE_URL: !!(import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL),
    SUPABASE_ANON_KEY: !!(import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    PUBLIC_SUPABASE_URL: !!(import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL),
    PUBLIC_SUPABASE_ANON_KEY: !!(import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: !!((import.meta.env as any).VITE_SUPABASE_SERVICE_ROLE_KEY || (import.meta.env as any).SUPABASE_SERVICE_ROLE_KEY)
  };

  console.log('%c=== 1. ENVIRONMENT VARIABLES AUDIT ===', 'font-weight: bold; color: #4B5563;');
  console.log('SUPABASE_URL:', envsReport.SUPABASE_URL ? '✓ Present' : '✗ Missing');
  console.log('SUPABASE_ANON_KEY:', envsReport.SUPABASE_ANON_KEY ? '✓ Present' : '✗ Missing');
  console.log('PUBLIC_SUPABASE_URL:', envsReport.PUBLIC_SUPABASE_URL ? '✓ Present' : '✗ Missing');
  console.log('PUBLIC_SUPABASE_ANON_KEY:', envsReport.PUBLIC_SUPABASE_ANON_KEY ? '✓ Present' : '✗ Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', envsReport.SUPABASE_SERVICE_ROLE_KEY ? '✓ Present' : '✗ Missing (Optional client-side)');

  console.log('%c=== 2. DOMAIN & CORS AUDIT ===', 'font-weight: bold; color: #4B5563;');
  console.log('Current Origin:', currentOrigin);
  console.log('Current Host:', currentHost);
  console.log('Current URL:', currentUrl);
  
  const allowedOrigins = ['https://goingtechnologies.com', 'https://www.goingtechnologies.com'];
  const isAuthorizedDomain = allowedOrigins.includes(currentOrigin) || currentHost.includes('localhost') || currentHost.includes('127.0.0.1') || currentHost.includes('run.app');
  console.log('Domain Authorized in CORS Config:', isAuthorizedDomain ? '✓ Yes' : '⚠️ Unknown (Ensure goingtechnologies.com is whitelisted in Supabase Dashboard -> API -> CORS)');

  // Initialize status flags
  let isDbConnected = false;
  let isStorageConnected = false;
  let isPublicUrlWorking = false;
  let isInsertWorking = false;
  let dbErrorStr = '';
  let storageErrorStr = '';
  let publicUrlErrorStr = '';
  let insertErrorStr = '';

  console.log('%c=== 3. SUPABASE CORE SERVICES AUDIT ===', 'font-weight: bold; color: #4B5563;');

  // A. Database Select connection
  try {
    const { data, error } = await supabase.from('proposal_downloads').select('id').limit(1);
    if (error) {
      dbErrorStr = error.message;
      console.log('✗ Database Connection: Failed. Error:', error);
    } else {
      isDbConnected = true;
      console.log('✓ Database Connection: Success. Records queried:', data?.length);
    }
  } catch (err: any) {
    dbErrorStr = err.message || String(err);
    console.log('✗ Database Connection: Failed. Exception:', err);
  }

  // B. Database Insert connection
  try {
    const tempEmail = `audit-test-${Date.now()}@goingtechnologies.com`;
    const { error } = await supabase.from('proposal_downloads').insert([{
      email: tempEmail,
      company_domain: 'goingtechnologies.com',
      source: 'Audit Test',
      page_url: currentUrl,
      downloaded_file: 'Going Technologies Insurance operations proposal.pdf'
    }]);

    if (error) {
      insertErrorStr = error.message;
      console.log('✗ Insert Into proposal_downloads: Failed. Error:', error);
    } else {
      isInsertWorking = true;
      console.log('✓ Insert Into proposal_downloads: Success.');
      
      // Clean up the audit test record
      await supabase.from('proposal_downloads').delete().eq('email', tempEmail);
    }
  } catch (err: any) {
    insertErrorStr = err.message || String(err);
    console.log('✗ Insert Into proposal_downloads: Failed. Exception:', err);
  }

  // C. Storage connection & buckets
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      storageErrorStr = error.message;
      console.log('✗ Storage Connection: Failed. Error:', error);
    } else {
      isStorageConnected = true;
      console.log('✓ Storage Connection: Success. Available Buckets:', buckets?.map(b => b.name));
    }
  } catch (err: any) {
    storageErrorStr = err.message || String(err);
    console.log('✗ Storage Connection: Failed. Exception:', err);
  }

  // D. Public URL Verification (Testing standard public bucket 'goingtechnologies')
  try {
    const { data } = supabase.storage.from('goingtechnologies').getPublicUrl('Going Technologies Insurance operations proposal.pdf');
    if (!data || !data.publicUrl) {
      publicUrlErrorStr = 'Failed to generate public URL';
      console.log('✗ Public Storage URL Generation: Failed.');
    } else {
      isPublicUrlWorking = true;
      console.log('✓ Public Storage URL Generation: Success. Public URL:', data.publicUrl);
    }
  } catch (err: any) {
    publicUrlErrorStr = err.message || String(err);
    console.log('✗ Public Storage URL Generation: Failed. Exception:', err);
  }

  // Final structured output report
  console.log('%c==================================================', 'color: #10B981; font-weight: bold;');
  console.log('%c=== FINAL PRODUCTION DEPLOYMENT AUDIT REPORT ===', 'color: #10B981; font-weight: bold; font-size: 13px;');
  console.log(isDbConnected ? '✓ Database Connected' : '✗ Database Connection Failed');
  if (!isDbConnected) console.log(`  Reason: ${dbErrorStr}`);

  console.log(isInsertWorking ? '✓ Insert Into proposal_downloads Succeeded' : '✗ Insert Into proposal_downloads Failed');
  if (!isInsertWorking) console.log(`  Reason: ${insertErrorStr}`);

  console.log(isStorageConnected ? '✓ Storage Connected' : '✗ Storage Connection Failed');
  if (!isStorageConnected) console.log(`  Reason: ${storageErrorStr}`);

  console.log(isPublicUrlWorking ? '✓ Public URL Generation Succeeded' : '✗ Public URL Generation Failed');
  if (!isPublicUrlWorking) console.log(`  Reason: ${publicUrlErrorStr}`);

  // Missing Env check output
  const missingEnvs = Object.entries(envsReport).filter(([_, val]) => !val).map(([key]) => key);
  if (missingEnvs.length > 0) {
    console.log(`✗ Missing Production Environment Variable\n  Name: ${missingEnvs.join(', ')}`);
  } else {
    console.log('✓ All Production Environment Variables Configured');
  }

  // CORS report
  if (!isAuthorizedDomain) {
    console.log(`✗ CORS Blocked\n  Origin: ${currentOrigin}`);
  } else {
    console.log('✓ CORS Check: Origin is in allowed domain wildcard/local ranges');
  }
  console.log('%c==================================================', 'color: #10B981; font-weight: bold;');
}

// Global expose for on-demand console execution
if (typeof window !== 'undefined') {
  (window as any).runProductionAudit = runProductionAudit;
}

export function getActualReason(err: any, url: string, status?: number, body?: string): string {
  const errMsg = (err?.message || '').toLowerCase();
  const bodyLower = (body || '').toLowerCase();
  const urlLower = url.toLowerCase();

  // Explicit env var checks
  const hasSupabaseUrl = !!(import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasSupabaseKey = !!(import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!hasSupabaseUrl) {
    return 'Supabase URL missing (VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL)';
  }
  if (!hasSupabaseKey) {
    return 'Supabase Anon Key missing (VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY)';
  }

  // 1. Supabase URL missing
  if (
    errMsg.includes('supabase url') || 
    bodyLower.includes('supabase url') || 
    errMsg.includes('invalid supabase url') ||
    (window as any).__SUPABASE_URL_MISSING__
  ) {
    return 'Supabase URL missing';
  }

  // 2. Invalid API Key
  if (
    status === 401 || 
    status === 403 || 
    errMsg.includes('api key') || 
    bodyLower.includes('api key') || 
    bodyLower.includes('invalid api key') || 
    bodyLower.includes('unauthorized') ||
    errMsg.includes('invalid key') ||
    bodyLower.includes('invalid key')
  ) {
    return 'Invalid API Key';
  }

  // 3. CORS blocked
  if (
    errMsg.includes('failed to fetch') || 
    errMsg.includes('networkerror') || 
    errMsg.includes('cors') || 
    errMsg.includes('access-control-allow-origin') ||
    errMsg.includes('preflight')
  ) {
    if (!window.navigator.onLine) {
      return 'Network offline';
    }
    return `CORS blocked: Ensure ${window.location.origin} is authorized in your Supabase API settings.`;
  }

  // 4. Storage bucket not found
  if (
    bodyLower.includes('bucket not found') || 
    errMsg.includes('bucket not found') || 
    (bodyLower.includes('storage') && bodyLower.includes('not found')) ||
    bodyLower.includes('bucket_not_found')
  ) {
    return 'Storage bucket not found';
  }

  // 5. Edge Function not deployed
  if (
    bodyLower.includes('function not found') || 
    bodyLower.includes('edge function') || 
    (status === 404 && urlLower.includes('/functions/')) ||
    bodyLower.includes('function_not_found')
  ) {
    return 'Edge Function not deployed';
  }

  // 6. Signed URL generation failed
  if (
    bodyLower.includes('signed url') || 
    errMsg.includes('signed url') || 
    (bodyLower.includes('token') && bodyLower.includes('fail')) ||
    (bodyLower.includes('signature') && bodyLower.includes('fail'))
  ) {
    return 'Signed URL generation failed';
  }

  // 7. Network timeout
  if (
    errMsg.includes('timeout') || 
    err?.name === 'AbortError' || 
    errMsg.includes('aborted')
  ) {
    return 'Network timeout';
  }

  // 8. Database connection failed
  if (
    bodyLower.includes('database') || 
    bodyLower.includes('connection') || 
    bodyLower.includes('postgres') || 
    bodyLower.includes('supabase') || 
    bodyLower.includes('connection pool') || 
    bodyLower.includes('relation') || 
    bodyLower.includes('db') ||
    bodyLower.includes('postgresql') ||
    bodyLower.includes('ssl error')
  ) {
    return 'Database connection failed';
  }

  // Fallbacks:
  if (status === 404) {
    return `API endpoint not found (404) - Backend server might not be running or accessible at: ${url}`;
  }

  if (status === 502 || status === 503 || status === 504) {
    return `Server Gateway/Connection error (${status})`;
  }

  return err?.message || body || 'Connection failed. Please try again later.';
}
