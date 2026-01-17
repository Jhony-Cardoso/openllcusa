'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { PedidoModel } from '@/lib/models/pedido'
import { AlertCircle, Loader2 } from 'lucide-react'

export default function EstadoPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const slug = (params?.slug as string) || ''
  const isEIN = slug === 'obtencion-ein'

  const pedidoIdFromUrl = searchParams.get('pedido')
  const { user, isLoaded: isUserLoaded } = useUser()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [pedidoId, setPedidoId] = useState<string | null>(pedidoIdFromUrl)

  // Campos EIN (LLC ya creada)
  const [llcLegalName, setLlcLegalName] = useState('')
  const [llcState, setLlcState] = useState('')
  const [llcFormationDate, setLlcFormationDate] = useState('')
  const [llcAddress1, setLlcAddress1] = useState('')
  const [llcAddress2, setLlcAddress2] = useState('')
  const [llcCity, setLlcCity] = useState('')
  const [llcRegion, setLlcRegion] = useState('')
  const [llcPostalCode, setLlcPostalCode] = useState('')
  const [llcCountry, setLlcCountry] = useState('United States')

  useEffect(() => {
    async function cargar() {
      try {
        if (!isUserLoaded) return

        if (!user) {
          router.push('/sign-in')
          return
        }

        if (!pedidoIdFromUrl) {
          setError('Falta el parámetro ?pedido= en la URL. Vuelve al paso anterior.')
          setLoading(false)
          return
        }

        const pedido = await PedidoModel.obtenerPorId(pedidoIdFromUrl)
        if (!pedido) {
          setError('Pedido no encontrado. Vuelve al paso anterior.')
          setLoading(false)
          return
        }

        if (pedido.user_id !== user.id) {
          setError('No tienes permisos para acceder a este pedido.')
          setLoading(false)
          return
        }

        setPedidoId(pedido.id)

        // Reutilizamos columnas existentes cuando sea posible
        // nombre_empresa -> nombre legal LLC
        if (pedido.nombre_empresa) setLlcLegalName(pedido.nombre_empresa)

        // descripcion_negocio: guardamos datos EIN como JSON para no tocar DB
        if (pedido.descripcion_negocio) {
          try {
            const obj = JSON.parse(pedido.descripcion_negocio)
            if (obj?.ein?.llc_state) setLlcState(obj.ein.llc_state)
            if (obj?.ein?.formation_date) setLlcFormationDate(obj.ein.formation_date)
            if (obj?.ein?.address1) setLlcAddress1(obj.ein.address1)
            if (obj?.ein?.address2) setLlcAddress2(obj.ein.address2)
            if (obj?.ein?.city) setLlcCity(obj.ein.city)
            if (obj?.ein?.region) setLlcRegion(obj.ein.region)
            if (obj?.ein?.postal_code) setLlcPostalCode(obj.ein.postal_code)
            if (obj?.ein?.country) setLlcCountry(obj.ein.country)
          } catch {
            // si no es JSON, no pasa nada
          }
        }
      } catch (e) {
        console.error(e)
        setError('Error al cargar los datos. Por favor, recarga la página.')
      } finally {
        setLoading(false)
      }
    }

    cargar()
  }, [isUserLoaded, user, pedidoIdFromUrl, router])

  const handleContinuar = async () => {
    setError('')

    if (!pedidoId) {
      setError('Error: No se encontró el pedido')
      return
    }

    if (!isEIN) {
      // Si llegas aquí en flujo LLC, mantén tu ruta actual
      router.push(`/servicios/${slug}/onboarding/datos-empresa?pedido=${pedidoId}`)
      return
    }

    // Validaciones EIN básicas
    if (!llcLegalName.trim()) {
      setError('Escribe el nombre legal de tu LLC.')
      return
    }
    if (!llcState.trim()) {
      setError('Indica el estado donde se constituyó tu LLC (por ejemplo: Wyoming).')
      return
    }
    if (!llcAddress1.trim() || !llcCity.trim() || !llcPostalCode.trim()) {
      setError('Completa la dirección postal (calle, ciudad y código postal).')
      return
    }

    setSaving(true)

    try {
      // Guardamos:
      // - nombre_empresa como nombre legal
      // - descripcion_negocio como JSON con datos EIN
      const payload = {
        nombre_empresa: llcLegalName,
        sector: 'EIN',
        descripcion_negocio: JSON.stringify({
          ein: {
            llc_state: llcState,
            formation_date: llcFormationDate,
            address1: llcAddress1,
            address2: llcAddress2,
            city: llcCity,
            region: llcRegion,
            postal_code: llcPostalCode,
            country: llcCountry,
          },
        }),
        num_socios: 1,
        ingresos_estimados: '',
        // email_empresa ya se guardó en el paso 1 (si lo hiciste como te pasé)
        email_empresa: '',
        telefono_empresa: '',
      }

      await PedidoModel.actualizarPaso(pedidoId, 3, payload)

      router.push(`/servicios/${slug}/onboarding/datos-empresa?pedido=${pedidoId}`)
    } catch (e) {
      console.error(e)
      setError('Error al guardar. Por favor, inténtalo de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-700">
        <Loader2 className="animate-spin" size={18} />
        Cargando…
      </div>
    )
  }

  if (error && !pedidoId) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
        <div className="flex items-center gap-2 font-semibold">
          <AlertCircle size={18} />
          {error}
        </div>
        <button onClick={() => router.back()} className="mt-6 text-sm text-gray-600 underline">
          ← Atrás
        </button>
      </div>
    )
  }

  // UI EIN
  if (isEIN) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Datos de tu LLC (ya creada)</h1>
        <p className="text-gray-600 mb-6">
          Estos datos se usan para preparar la solicitud del EIN. No estás creando una LLC nueva.
        </p>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 mb-4">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle size={18} />
              {error}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
          <div className="font-semibold text-gray-900 mb-2">Nombre legal</div>
          <input
            value={llcLegalName}
            onChange={(e) => setLlcLegalName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="Por ejemplo: ACME LLC"
          />
          <div className="text-sm text-gray-500 mt-2">
            Debe coincidir con el documento de constitución del estado.
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
          <div className="font-semibold text-gray-900 mb-2">Estado donde se constituyó</div>
          <input
            value={llcState}
            onChange={(e) => setLlcState(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="Por ejemplo: Wyoming, Delaware…"
          />

          <div className="font-semibold text-gray-900 mb-2 mt-5">Fecha de constitución (opcional)</div>
          <input
            value={llcFormationDate}
            onChange={(e) => setLlcFormationDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="YYYY-MM-DD"
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
          <div className="font-semibold text-gray-900 mb-3">Dirección postal de la LLC</div>

          <div className="grid grid-cols-1 gap-3">
            <input
              value={llcAddress1}
              onChange={(e) => setLlcAddress1(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Calle y número"
            />
            <input
              value={llcAddress2}
              onChange={(e) => setLlcAddress2(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Apartamento / Suite (opcional)"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                value={llcCity}
                onChange={(e) => setLlcCity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Ciudad"
              />
              <input
                value={llcRegion}
                onChange={(e) => setLlcRegion(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Estado/Región (opcional)"
              />
              <input
                value={llcPostalCode}
                onChange={(e) => setLlcPostalCode(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Código postal"
              />
            </div>

            <input
              value={llcCountry}
              onChange={(e) => setLlcCountry(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="País"
            />
          </div>
        </div>

        <button
          onClick={handleContinuar}
          disabled={saving}
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3"
        >
          {saving ? 'Guardando…' : 'Continuar →'}
        </button>
      </div>
    )
  }

  // UI original (LLC): para no romper, mantenemos un mensaje simple
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">Selecciona el estado para tu LLC</h1>
      <p className="text-gray-600 mb-6">
        Este paso corresponde al onboarding de creación de LLC.
      </p>
      <button
        onClick={() => router.push(`/servicios/${slug}/onboarding/datos-empresa?pedido=${pedidoIdFromUrl}`)}
        className="rounded-lg bg-blue-600 text-white px-4 py-2"
      >
        Continuar →
      </button>
    </div>
  )
}
