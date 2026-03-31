import { createClient } from './lib/supabase/server'

async function test() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('servicios').select('*')
  console.log(JSON.stringify(data, null, 2))
}

test()
