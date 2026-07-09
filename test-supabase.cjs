const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://exzhlhdjtvvjncphiofa.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_q6ROtjbX8jc-f3KiWYJDPw_6tR3HNZD';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
  try {
    const { data, error } = await supabase.from('blogs').select('slug').limit(5);
    if (error) {
      console.error('blogs query failed:', error.message, error);
    } else {
      console.log('blogs query succeeded! count:', data.length);
    }
  } catch (err) {
    console.error('blogs exception:', err.message);
  }
}

test();
