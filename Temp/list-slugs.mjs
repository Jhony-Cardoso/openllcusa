import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL = 'http://89.117.53.55:8001'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzQzMjk3MDgsImV4cCI6MjA4OTY4OTcwOH0.wkmoDmM5QaTFAyGXDFgR8YeYvaNkI0pMMFtsZtNfkB8'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
async function run() {
  const { data } = await supabase.from('servicios').select('slug, nombre')
  console.log(data)
}
run()
