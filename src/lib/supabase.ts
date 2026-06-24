import { createClient } from '@supabase/supabase-js';

// Environment variables with fallback defaults for seamless out-of-the-box operation.
// In production or custom deployment, these are configured client-side or mapped via Vite env variables.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://exzhlhdjtvvjncphiofa.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_q6ROtjbX8jc-f3KiWYJDPw_6tR3HNZD';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
