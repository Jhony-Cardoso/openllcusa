import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'http://89.117.53.55:8001'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzQzMjk3MDgsImV4cCI6MjA4OTY4OTcwOH0.wkmoDmM5QaTFAyGXDFgR8YeYvaNkI0pMMFtsZtNfkB8'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function run() {
  const { error } = await supabase.from('servicios').upsert({
    id: 'b5e468be-eb01-443b-a5d4-42b7e1ce8e13',
    slug: 'reporte-anual',
    nombre: 'Reporte Anual Estatal',
    descripcion: 'Paga y presenta el Annual Report obligatorio de tu estado con nuestra gestión incluida.',
    precio: 97.00,
    categoria: 'cumplimiento',
    requiere_llc: true,
    activo: true,
    tipo: 'individual'
  })
  
  if (error) {
    console.error('Error insertando reporte-anual:', error)
  } else {
    console.log('Reporte Anual añadido a Supabase con exito.')
  }
}

run()
