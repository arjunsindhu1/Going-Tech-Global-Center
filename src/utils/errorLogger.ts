export interface ErrorDetails {
  url: string;
  status?: number;
  responseBody?: string;
  errorCode?: string;
  errorMessage: string;
  stack?: string;
}

export function logDetailedError(details: ErrorDetails) {
  console.group('%c=== PRODUCTION DEPLOYMENT AUDIT ERROR REPORT ===', 'color: #EF4444; font-weight: bold;');
  console.log('%cRequest URL:', 'font-weight: bold;', details.url);
  console.log('%cHTTP Status:', 'font-weight: bold;', details.status !== undefined ? details.status : 'N/A');
  console.log('%cError Code:', 'font-weight: bold;', details.errorCode || 'N/A');
  console.log('%cError Message:', 'font-weight: bold;', details.errorMessage);
  if (details.responseBody) {
    console.log('%cResponse Body:', 'font-weight: bold;', details.responseBody);
  }
  if (details.stack) {
    console.log('%cStack Trace:', 'font-weight: bold;', details.stack);
  }
  console.groupEnd();
}

export function getActualReason(err: any, url: string, status?: number, body?: string): string {
  const errMsg = (err?.message || '').toLowerCase();
  const bodyLower = (body || '').toLowerCase();
  const urlLower = url.toLowerCase();

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
  // Typically, a failed fetch with no status is due to CORS or network offline
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
    return 'CORS blocked';
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
    bodyLower.includes('signature') && bodyLower.includes('fail')
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
    return `API endpoint not found (404): ${url}`;
  }

  if (status === 502 || status === 503 || status === 504) {
    return `Server Gateway/Connection error (${status})`;
  }

  return err?.message || body || 'Connection failed. Please try again later.';
}
