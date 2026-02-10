'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { PedidoModel } from '@/lib/models/pedido'
import { AlertCircle, Loader2, Check, Star, ChevronDown } from 'lucide-react'

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

  // Campos LLC (Creación nueva)
  const [estados, setEstados] = useState<any[]>([])
  const [selectedEstado, setSelectedEstado] = useState<string | null>(null)
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null)

  useEffect(() => {
    async function cargar() {
      try {
        if (!isUserLoaded) return

        if (!user) {
          router.push('/sign-in')
          return
        }

        let currentPedidoId = pedidoIdFromUrl

        // Si no hay ID en URL, buscar borrador vía API segura
        if (!currentPedidoId) {
          console.log('🔍 [ESTADO] No hay pedidoId en URL, buscando borrador...')

          const resServ = await fetch(`/api/servicios?slug=${slug}`)
          const infoServ = await resServ.json()
          const targetId = infoServ?.id

          if (targetId) {
            const tipo = infoServ?._tipo || 'servicio'
            const resBorrador = await fetch(`/api/pedidos/borrador?servicioId=${targetId}&tipo=${tipo}`)
            const dataBorrador = await resBorrador.json()

            if (dataBorrador?.pedido?.id) {
              currentPedidoId = dataBorrador.pedido.id
              setPedidoId(currentPedidoId)
              console.log('✅ [ESTADO] Borrador encontrado:', currentPedidoId)

              const newUrl = `${window.location.pathname}?pedido=${currentPedidoId}`
              window.history.replaceState({}, '', newUrl)
            }
          }
        }

        if (!currentPedidoId) {
          setError('No se encontró un pedido en curso. Por favor, vuelve al inicio del proceso.')
          setLoading(false)
          return
        }

        const pedido = await PedidoModel.obtenerPorId(currentPedidoId)
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
        if (pedido.estado_usa_id) setSelectedEstado(pedido.estado_usa_id)

        // Cargar estados disponibles vía API Proxy
        const responseEstados = await fetch('/api/estados')
        if (!responseEstados.ok) throw new Error('Error al cargar estados')
        const estadosData = await responseEstados.json()
        // Filtrar Texas según solicitud del cliente
        const estadosFiltrados = estadosData.filter((e: any) => e.nombre !== 'Texas')
        setEstados(estadosFiltrados)

        // Recuperar datos EIN si existen
        if (pedido.nombre_empresa) setLlcLegalName(pedido.nombre_empresa)

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
  }, [isUserLoaded, user, pedidoIdFromUrl, slug, router])

  const handleContinuar = async () => {
    setError('')

    // Obtener el ID actual (puede haber cambiado)
    const urlParams = new URLSearchParams(window.location.search)
    const currentId = urlParams.get('pedido') || pedidoId

    if (!currentId) {
      setError('Error: No se encontró el pedido')
      return
    }

    if (!isEIN) {
      if (!selectedEstado) {
        setError('Por favor, selecciona un estado para tu LLC.')
        return
      }
      setSaving(true)
      try {
        await PedidoModel.guardarEstado(currentId, selectedEstado)
        router.push(`/servicios/${slug}/onboarding/datos-empresa?pedido=${currentId}`)
      } catch (err) {
        setError('Error al guardar el estado.')
      } finally {
        setSaving(false)
      }
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
        email_empresa: '',
        telefono_empresa: '',
      }

      await PedidoModel.actualizarPaso(currentId, 3, payload)

      router.push(`/servicios/${slug}/onboarding/datos-empresa?pedido=${currentId}`)
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

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
        <div className="flex items-center gap-2 font-semibold">
          <AlertCircle size={18} />
          {error}
        </div>
        <button
          onClick={() => router.push(`/servicios/${slug}/onboarding`)}
          className="mt-6 text-sm text-gray-600 underline"
        >
          ← Reiniciar proceso
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

  // UI original (LLC): Selección de estados
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          ¿Dónde quieres constituir tu LLC?
        </h2>
        <p className="text-gray-600">
          Selecciona el estado donde se registrará tu LLC. Te recomendamos Wyoming
          por su bajo coste anual y máxima privacidad.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {estados.length === 0 && (
          <div className="p-10 text-center border-2 border-dashed rounded-xl text-gray-500">
            No se han encontrado estados disponibles en este momento.
            Por favor, contacta con soporte o inténtalo más tarde.
          </div>
        )}
        {estados.map((estado) => {
          const isSelected = selectedEstado === estado.id;
          const isExpanded = expandedInfo === estado.id;

          return (
            <div key={estado.id} className="border-2 rounded-xl overflow-hidden transition-all bg-white shadow-sm">
              <label
                className={`
                  block p-5 cursor-pointer transition-all
                  ${isSelected
                    ? 'border-blue-600 bg-blue-50/50'
                    : 'border-transparent hover:bg-gray-50'
                  }
                `}
              >
                <input
                  type="radio"
                  name="estado"
                  value={estado.id}
                  checked={isSelected}
                  onChange={(e) => setSelectedEstado(e.target.value)}
                  className="sr-only"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${isSelected
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                      }
                    `}>
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg text-gray-900">
                          {estado.nombre}
                        </span>
                        {estado.recomendado && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase rounded-full flex items-center gap-1">
                            <Star size={10} fill="currentColor" />
                            Recomendado
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Filing anual: <span className="font-semibold">${estado.filing_anual}</span>
                        {estado.filing_inicial && (
                          <> • Filing inicial: <span className="font-semibold">${estado.filing_inicial}</span></>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setExpandedInfo(isExpanded ? null : estado.id);
                    }}
                    className="ml-4 p-2 text-gray-400 hover:text-blue-600 transition rounded-lg hover:bg-white"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </label>

              {isExpanded && (
                <div className="px-5 pb-5 bg-white border-t border-gray-100">
                  <div className="pt-4">
                    {estado.descripcion && <p className="text-sm text-gray-700 mb-3">{estado.descripcion}</p>}
                    {estado.ventajas && (
                      <ul className="space-y-1">
                        {(estado.ventajas as string[]).map((ventaja, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <Check size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                            {ventaja}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-6 border-t">
        <button onClick={() => router.back()} className="px-6 py-3 text-gray-600 font-bold">
          ← Atrás
        </button>

        <button
          onClick={handleContinuar}
          disabled={!selectedEstado || saving}
          className={`px-10 py-4 rounded-xl font-black text-lg shadow-xl transition-all ${selectedEstado && !saving ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
        >
          {saving ? 'Guardando...' : 'Continuar →'}
        </button>
      </div>
    </div>
  )
}
