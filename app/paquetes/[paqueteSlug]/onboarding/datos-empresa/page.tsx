'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Loader2, AlertCircle } from 'lucide-react'

type DatosEmpresaForm = {
  nombre_empresa: string
  sector: string
  descripcion_negocio: string
  num_socios: number
  ingresos_estimados: string
  email_empresa: string
  codigo_pais: string
  telefono_empresa: string
}

// Opciones de sectores
const SECTORES = [
  { value: '', label: 'Selecciona un sector' },
  { value: 'tecnologia', label: 'Tecnología y Software' },
  { value: 'ecommerce', label: 'E-commerce y Retail Online' },
  { value: 'marketing', label: 'Marketing y Publicidad Digital' },
  { value: 'consultoria', label: 'Consultoría y Servicios Profesionales' },
  { value: 'educacion', label: 'Educación y Formación Online' },
  { value: 'contenido', label: 'Creación de Contenido y Medios' },
  { value: 'diseno', label: 'Diseño y Creatividad' },
  { value: 'salud', label: 'Salud y Bienestar' },
  { value: 'finanzas', label: 'Finanzas e Inversiones' },
  { value: 'inmobiliario', label: 'Inmobiliario' },
  { value: 'otro', label: 'Otro' },
]

// Códigos de país con banderas
const CODIGOS_PAIS = [
  { code: '+34', country: 'ES', flag: '🇪🇸', name: 'España' },
  { code: '+1', country: 'US', flag: '🇺🇸', name: 'Estados Unidos' },
  { code: '+52', country: 'MX', flag: '🇲🇽', name: 'México' },
  { code: '+54', country: 'AR', flag: '🇦🇷', name: 'Argentina' },
  { code: '+56', country: 'CL', flag: '🇨🇱', name: 'Chile' },
  { code: '+57', country: 'CO', flag: '🇨🇴', name: 'Colombia' },
  { code: '+51', country: 'PE', flag: '🇵🇪', name: 'Perú' },
  { code: '+58', country: 'VE', flag: '🇻🇪', name: 'Venezuela' },
  { code: '+593', country: 'EC', flag: '🇪🇨', name: 'Ecuador' },
  { code: '+55', country: 'BR', flag: '🇧🇷', name: 'Brasil' },
]

const INICIAL: DatosEmpresaForm = {
  nombre_empresa: '',
  sector: '',
  descripcion_negocio: '',
  num_socios: 1,
  ingresos_estimados: '',
  email_empresa: '',
  codigo_pais: '+34', // España por defecto
  telefono_empresa: '',
}

export default function DatosEmpresaPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user, isLoaded: isUserLoaded } = useUser()

  const paqueteSlug = (params?.paqueteSlug as string) || ''
  const pedidoId = searchParams.get('pedido')

  const [form, setForm] = useState<DatosEmpresaForm>(INICIAL)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        if (!isUserLoaded) return

        if (!user) {
          router.push('/sign-in')
          return
        }

        let currentPedidoId = pedidoId

        // Si no hay ID en URL, buscar borrador vía API segura
        if (!currentPedidoId) {
          console.log('🔍 [PAQUETE DATOS-EMPRESA] No hay pedidoId en URL, buscando borrador...')

          const resPaquete = await fetch(`/api/paquetes?slug=${paqueteSlug}`)
          const infoPaquete = await resPaquete.json()
          const targetId = infoPaquete?.id

          if (targetId) {
            const resBorrador = await fetch(`/api/pedidos/borrador?paqueteId=${targetId}&tipo=paquete`)
            const dataBorrador = await resBorrador.json()

            if (dataBorrador?.pedido?.id) {
              currentPedidoId = dataBorrador.pedido.id
              console.log('✅ [PAQUETE DATOS-EMPRESA] Borrador encontrado:', currentPedidoId)

              const newUrl = `${window.location.pathname}?pedido=${currentPedidoId}`
              window.history.replaceState({}, '', newUrl)
            }
          }
        }

        if (!currentPedidoId) {
          console.log('❌ No hay pedidoId en la URL')
          setError('No se ha encontrado el pedido. Vuelve al paso anterior.')
          setLoading(false)
          return
        }

        // Usar API segura para obtener pedido
        console.log('🔍 Buscando pedido en datos-empresa:', currentPedidoId)
        const resPedido = await fetch(`/api/pedidos/obtener?id=${currentPedidoId}`)
        const dataPedido = await resPedido.json()

        if (!resPedido.ok || !dataPedido.pedido) {
          console.error('❌ Pedido no encontrado:', dataPedido)
          setError('No se ha encontrado el pedido en la base de datos.')
          setLoading(false)
          return
        }

        const pedido = dataPedido.pedido
        console.log('📦 Pedido obtenido:', pedido)

        setForm({
          nombre_empresa: pedido.nombre_empresa || '',
          sector: pedido.sector || '',
          descripcion_negocio: pedido.descripcion_negocio || '',
          num_socios: pedido.num_socios || 1,
          ingresos_estimados: pedido.ingresos_estimados || '',
          email_empresa: pedido.email_empresa || user.emailAddresses?.[0]?.emailAddress || '',
          codigo_pais: pedido.codigo_pais || '+34',
          telefono_empresa: pedido.telefono_empresa || '',
        })
      } catch (e) {
        console.error('❌ Error en cargar() datos-empresa:', e)
        setError('Error al cargar los datos. Por favor, recarga la página.')
      } finally {
        setLoading(false)
      }
    }

    cargar()
  }, [isUserLoaded, user, pedidoId, router])

  const handleBack = () => {
    router.push(`/paquetes/${paqueteSlug}/onboarding/estado?pedido=${pedidoId ?? ''}`)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'num_socios' ? Number(value) || 0 : value,
    }))
  }

  const validar = (): string | null => {
    if (!form.nombre_empresa.trim()) return 'El nombre de la empresa es obligatorio.'
    if (!form.sector.trim()) return 'Debes seleccionar un sector.'
    if (!form.descripcion_negocio.trim()) return 'La descripción del negocio es obligatoria.'
    if (!form.ingresos_estimados.trim()) return 'Los ingresos estimados son obligatorios.'
    if (!form.email_empresa.trim()) return 'El email de la empresa es obligatorio.'
    if (!form.telefono_empresa.trim()) return 'El teléfono de la empresa es obligatorio.'
    if (form.num_socios <= 0) return 'El número de socios debe ser al menos 1.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const msg = validar()
    if (msg) {
      setError(msg)
      return
    }

    if (!pedidoId) {
      setError('No se ha encontrado el pedido. Vuelve al paso anterior.')
      return
    }

    setSaving(true)
    try {
      // Usar API segura para actualizar
      const res = await fetch('/api/pedidos/actualizar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedidoId,
          paso: 3,
          datos: {
            ...form,
            estado_pedido: 'datos_completos'
          }
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error('Error guardando datos empresa:', errorData)
        setError('Error al guardar los datos de la empresa. Inténtalo de nuevo.')
        return
      }

      router.push(`/paquetes/${paqueteSlug}/onboarding/revision?pedido=${pedidoId}`)
    } catch (e) {
      console.error(e)
      setError('Error al guardar los datos. Por favor, inténtalo de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Cargando datos de tu empresa…</span>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <button type="button" onClick={handleBack} className="text-sm text-gray-600 underline">
          ← Atrás
        </button>
        <div className="text-sm text-gray-500">Paso 3 de 5</div>
      </div>

      <h1 className="text-3xl font-bold mb-2">Datos de tu empresa</h1>

      {error && (
        <div className="border border-red-200 bg-red-50 rounded-lg p-4 mb-6 flex gap-2 items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div className="text-red-800">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre de la empresa <span className="text-red-500">*</span>
          </label>
          <input
            name="nombre_empresa"
            value={form.nombre_empresa}
            onChange={handleChange}
            required
            placeholder="Ej: Mi Empresa LLC"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Sector <span className="text-red-500">*</span>
          </label>
          <select
            name="sector"
            value={form.sector}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {SECTORES.map((sector) => (
              <option key={sector.value} value={sector.value}>
                {sector.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Descripción del negocio <span className="text-red-500">*</span>
          </label>
          <textarea
            name="descripcion_negocio"
            value={form.descripcion_negocio}
            onChange={handleChange}
            required
            placeholder="Describe brevemente a qué se dedica tu empresa..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Número de socios <span className="text-red-500">*</span>
          </label>
          <input
            name="num_socios"
            type="number"
            min={1}
            value={form.num_socios}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Ingresos estimados anuales <span className="text-red-500">*</span>
          </label>
          <select
            name="ingresos_estimados"
            value={form.ingresos_estimados}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecciona un rango</option>
            <option value="0-10k">$0 - $10,000</option>
            <option value="10k-50k">$10,000 - $50,000</option>
            <option value="50k-100k">$50,000 - $100,000</option>
            <option value="100k-250k">$100,000 - $250,000</option>
            <option value="250k-500k">$250,000 - $500,000</option>
            <option value="500k+">Más de $500,000</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email de contacto <span className="text-red-500">*</span>
          </label>
          <input
            name="email_empresa"
            type="email"
            value={form.email_empresa}
            onChange={handleChange}
            required
            placeholder="contacto@miempresa.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Teléfono <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <select
              name="codigo_pais"
              value={form.codigo_pais}
              onChange={handleChange}
              required
              className="w-32 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CODIGOS_PAIS.map((pais) => (
                <option key={pais.country} value={pais.code}>
                  {pais.flag} {pais.code}
                </option>
              ))}
            </select>
            <input
              name="telefono_empresa"
              type="tel"
              value={form.telefono_empresa}
              onChange={handleChange}
              required
              placeholder="612345678"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Sin espacios ni guiones</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        >
          {saving ? 'Guardando…' : 'Continuar a revisión →'}
        </button>
      </form>
    </div>
  )
}
