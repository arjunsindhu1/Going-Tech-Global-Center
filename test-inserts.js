import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://exzhlhdjtvvjncphiofa.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_q6ROtjbX8jc-f3KiWYJDPw_6tR3HNZD';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testAll() {
  console.log('Testing Supabase Connection & Table inserts...\n');
  
  const tables = [
    {
      name: 'contact_leads',
      payload: {
        company_name: 'Going Tech Test Inc',
        company_type: 'Insurance Agency',
        premium_volume: '$5M - $20M AWP',
        bottlenecks: ['Renewal indicate backlogs'],
        client_name: 'Test Lead',
        client_email: 'test-lead@goingtechnologies.com',
        status: 'New'
      }
    },
    {
      name: 'consultation_requests',
      payload: {
        name: 'Test Consult',
        email: 'test-consult@goingtechnologies.com',
        phone: '123-456-7890',
        company: 'Going Tech Test Inc',
        service: 'Insurance Operations',
        notes: 'Test consultation request',
        date: 'Monday, June 29 at 10:30 AM EST'
      }
    },
    {
      name: 'diagnostic_requests',
      payload: {
        name: 'Test Diag',
        email: 'test-diag@goingtechnologies.com',
        phone: '123-456-7890',
        company: 'Going Tech Test Inc',
        notes: 'Test diagnostic request'
      }
    },
    {
      name: 'newsletter_subscribers',
      payload: {
        email: `test-newsletter-${Date.now()}@goingtechnologies.com`
      }
    },
    {
      name: 'callback_requests',
      payload: {
        name: 'Test Callback',
        phone: '123-456-7890',
        preferred_time: 'Morning (9 AM - 12 PM EST)'
      }
    }
  ];

  for (const table of tables) {
    try {
      console.log(`Inserting into table [${table.name}]...`);
      const { data, error } = await supabase
        .from(table.name)
        .insert([table.payload])
        .select();
        
      if (error) {
        console.error(`  ❌ FAILED: ${error.message} (${error.code || 'no code'})`);
      } else {
        console.log(`  ✅ SUCCESS: Inserted row ID:`, data?.[0]?.id || 'ok');
      }
    } catch (err) {
      console.error(`  💥 EXCEPTION:`, err.message || err);
    }
  }
}

testAll();
