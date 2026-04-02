import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'http://89.117.53.55:8001'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzQzMjk3MDgsImV4cCI6MjA4OTY4OTcwOH0.wkmoDmM5QaTFAyGXDFgR8YeYvaNkI0pMMFtsZtNfkB8'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function run() {
  const { error } = await supabase
    .from('servicios')
    .update({ 
      slug: 'impuestos-federales',
      nombre: 'Impuestos Federales (Form 1120 + 5472)',
      descripcion: 'Cumple con tus obligaciones fiscales ante el IRS. Presentación profesional de los Formularios 1120 y 5472 para LLCs de no residentes.'
    })
    .eq('slug', 'form-5472')
  
  if (error) {
    console.error('Error insertando impuestos-federales:', error)
  } else {
    console.log('Impuestos Federales actualizado con exito.')
  }

  const { error: err2 } = await supabase
    .from('servicios')
    .upsert({
      id: 'd9b32e8b-b8da-43c3-9828-ea2c1beadeca',
      slug: 'compliance-basico',
      nombre: 'Compliance Básico',
      descripcion: 'Mantenimiento anual esencial para tu LLC: Renovación de Agente Registrado y presentación del Reporte Anual Estatal.',
      precio: 197.00,
      categoria: 'cumplimiento',
      requiere_llc: true,
      activo: true,
      tipo: 'individual'
    })

  if (err2) {
    console.error('Error insertando compliance-basico:', err2)
  } else {
    console.log('Compliance basico insertado con exito.')
  }
}
run()
