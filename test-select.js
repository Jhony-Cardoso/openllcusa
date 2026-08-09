const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // usar service_role key para leer
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('chat_leads').select('*');
  
  if (error) {
    console.error('Select error:', error);
  } else {
    console.log('Current leads:', data);
  }
}
test();
