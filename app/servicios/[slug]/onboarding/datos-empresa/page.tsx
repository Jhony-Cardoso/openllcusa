'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { PedidoModel } from '@/lib/models/pedido'
import { Loader2, AlertCircle } from 'lucide-react'

type ResponsibleForm = {
  rp_full_name: string
  rp_passport_country: string
  rp_passport_number: string
  rp_birth_date: string
  rp_address1: string
  rp_address2: string
  rp_city: string
  rp_region: string
  rp_postal_code: string
  rp_country: string
}

const RP_INITIAL: ResponsibleForm = {
  rp_full_name: '',
  rp_passport_country: '',
  rp_passport_number: '',
  rp_birth_date: '',
  rp_address1: '',
  rp_address2: '',
  rp_city: '',
  rp_region: '',
  rp_postal_code: '',
  rp_country: '',
}

export default function DatosEmpresaPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user, isLoaded: isUserLoaded } = useUser()

  const slug = (params?.slug as string) || ''
  const isEIN = slug === 'obtencion-ein'

  const [pedidoId, setPedidoId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [rp, setRp] = useState<ResponsibleForm>(RP_INITIAL)
  const [form, setForm] = useState({
    nombre_empresa: '',
    sector: '',
    descripcion_negocio: '',
    num_socios: 1,
    email_empresa: '',
    telefono_empresa: ''
  })

  useEffect(() => {
    async function cargarDatos() {
      try {
        if (!isUserLoaded) return

        if (!user) {
          router.push('/sign-in')
          return
        }

        let currentId = searchParams.get('pedido')

        if (!currentId && user) {
          const resServ = await fetch(`/api/servicios?slug=${slug}`)
          const infoServ = await resServ.json()
          const targetId = infoServ?.id
          if (targetId) {
            const borradores = await PedidoModel.obtenerPorUsuario(user.id)
            const miBorrador = borradores.find(p => p.estado_pedido === 'borrador' && (p.servicio_id === targetId || p.paquete_id === targetId))
            if (miBorrador) {
              currentId = miBorrador.id
              const newUrl = `${window.location.pathname}?pedido=${miBorrador.id}`
              window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl)
            }
          }
        }

        if (!currentId) {
          setError('No se ha encontrado el pedido. Vuelve al paso anterior.')
          setLoading(false)
          return
        }

        setPedidoId(currentId)

        const pedido = await PedidoModel.obtenerPorId(currentId)
        if (!pedido) {
          setError('No se ha encontrado el pedido en la base de datos.')
          setLoading(false)
          return
        }

        if (pedido.user_id !== user.id) {
          setError('No tienes permisos para acceder a este pedido.')
          setLoading(false)
          return
        }

        // Recuperar datos EIN guardados en descripcion_negocio (JSON)
        if (isEIN && pedido.descripcion_negocio) {
          try {
            const obj = JSON.parse(pedido.descripcion_negocio)
            const prev = obj?.ein?.responsible_party || null
            if (prev) {
              setRp((p) => ({ ...p, ...prev }))
            }
          } catch {
            // ignore
          }
        }

        // Si no hay rp_full_name, pre-rellenar con nombre del usuario si existe
        if (isEIN && !rp.rp_full_name) {
          const fullName =
            (user.fullName || '').trim() ||
            `${user.firstName || ''} ${user.lastName || ''}`.trim()
          if (fullName) {
            setRp((p) => ({ ...p, rp_full_name: fullName }))
          }
        }
      } catch (err) {
        console.error('Error cargando datos:', err)
        setError('Error al cargar los datos. Por favor, recarga la página.')
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserLoaded, user, searchParams, router, isEIN])

  const validar = (): string | null => {
    if (!isEIN) return null

    if (!rp.rp_full_name.trim()) return 'Escribe el nombre completo del Responsible Party.'
    if (!rp.rp_passport_country.trim()) return 'Indica el país del pasaporte.'
    if (!rp.rp_passport_number.trim()) return 'Indica el número de pasaporte.'
    if (!rp.rp_address1.trim() || !rp.rp_city.trim() || !rp.rp_postal_code.trim()) {
      return 'Completa la dirección del Responsible Party (calle, ciudad y código postal).'
    }
    if (!rp.rp_country.trim()) return 'Indica el país de residencia.'
    return null
  }

  const handleSaveAndNext = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!pedidoId) {
      setError('No se ha encontrado el pedido. Vuelve al paso anterior.')
      return
    }

    const err = validar()
    if (err) {
      setError(err)
      return
    }

    setSaving(true)
    try {
      const pedido = await PedidoModel.obtenerPorId(pedidoId)
      if (!pedido) {
        setError('Pedido no encontrado.')
        return
      }

      // Mezclar con lo que ya hubiera en descripcion_negocio
      let obj: any = {}
      if (pedido.descripcion_negocio) {
        try {
          obj = JSON.parse(pedido.descripcion_negocio)
        } catch {
          obj = {}
        }
      }

      obj.ein = obj.ein || {}
      obj.ein.responsible_party = { ...rp }

      await PedidoModel.actualizarPaso(pedidoId, 4, {
        descripcion_negocio: JSON.stringify(obj),
      })

      router.push(`/servicios/${slug}/onboarding/revision?pedido=${pedidoId}`)
    } catch (err) {
      console.error('Error guardando:', err)
      setError('Error al guardar los datos. Por favor, inténtalo de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'num_socios' ? Number(value) : value }));
  };

  const handleSaveLLC = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre_empresa.trim()) { setError('El nombre de la empresa es obligatorio.'); return; }

    setSaving(true);
    try {
      await PedidoModel.guardarDatosEmpresa(pedidoId!, form);
      router.push(`/servicios/${slug}/onboarding/revision?pedido=${pedidoId}`);
    } catch (err) {
      setError('Error al guardar los datos.');
    } finally {
      setSaving(false);
    }
  };

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

  // 1. UI de EIN (Responsible Party)
  if (isEIN) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Responsible Party</h1>
        <p className="text-gray-600 mb-6">
          Esta persona es el Responsible Party del EIN (normalmente el propietario o quien controla la LLC).
        </p>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 mb-4">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle size={18} />
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSaveAndNext} className="space-y-5">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="font-semibold text-gray-900 mb-2">Nombre completo</div>
            <input
              value={rp.rp_full_name}
              onChange={(e) => setRp((p) => ({ ...p, rp_full_name: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Nombre y apellidos"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div>
                <div className="font-semibold text-gray-900 mb-2">País del pasaporte</div>
                <input
                  value={rp.rp_passport_country}
                  onChange={(e) => setRp((p) => ({ ...p, rp_passport_country: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Por ejemplo: Spain"
                />
              </div>

              <div>
                <div className="font-semibold text-gray-900 mb-2">Número de pasaporte</div>
                <input
                  value={rp.rp_passport_number}
                  onChange={(e) => setRp((p) => ({ ...p, rp_passport_number: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Número"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="font-semibold text-gray-900 mb-2">Fecha de nacimiento (opcional)</div>
              <input
                value={rp.rp_birth_date}
                onChange={(e) => setRp((p) => ({ ...p, rp_birth_date: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="YYYY-MM-DD"
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="font-semibold text-gray-900 mb-3">Dirección de residencia</div>

            <input
              value={rp.rp_address1}
              onChange={(e) => setRp((p) => ({ ...p, rp_address1: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 mb-3"
              placeholder="Calle y número"
            />
            <input
              value={rp.rp_address2}
              onChange={(e) => setRp((p) => ({ ...p, rp_address2: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 mb-3"
              placeholder="Apartamento / Suite (opcional)"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                value={rp.rp_city}
                onChange={(e) => setRp((p) => ({ ...p, rp_city: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Ciudad"
              />
              <input
                value={rp.rp_region}
                onChange={(e) => setRp((p) => ({ ...p, rp_region: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Provincia/Región (opcional)"
              />
              <input
                value={rp.rp_postal_code}
                onChange={(e) => setRp((p) => ({ ...p, rp_postal_code: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Código postal"
              />
            </div>

            <div className="mt-3">
              <div className="font-semibold text-gray-900 mb-2">País</div>
              <input
                value={rp.rp_country}
                onChange={(e) => setRp((p) => ({ ...p, rp_country: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="País"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3"
          >
            {saving ? 'Guardando…' : 'Continuar →'}
          </button>
        </form>
      </div>
    )
  }

  // 2. UI de LLC (Datos de Empresa)
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Datos de tu empresa</h1>
      <p className="text-gray-600 mb-8">Información necesaria para la documentación legal.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-800 font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSaveLLC} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Nombre de la empresa</label>
          <input
            type="text" name="nombre_empresa" value={form.nombre_empresa} onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej: Tech Innovations LLC"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Sector</label>
            <select name="sector" value={form.sector} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl">
              <option value="">Seleccionar...</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Comercio">Comercio electrónico</option>
              <option value="Servicios">Servicios / Consultoría</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Socios</label>
            <input type="number" name="num_socios" value={form.num_socios} onChange={handleChange} min="1" className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Descripción de actividad</label>
          <textarea name="descripcion_negocio" value={form.descripcion_negocio} onChange={handleChange} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email contacto</label>
            <input type="email" name="email_empresa" value={form.email_empresa} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
            <input type="tel" name="telefono_empresa" value={form.telefono_empresa} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t font-bold">
          <button type="button" onClick={() => router.back()} className="text-gray-500">← Atrás</button>
          <button type="submit" disabled={saving} className="bg-blue-600 text-white px-10 py-4 rounded-xl text-lg shadow-xl hover:bg-blue-700">
            {saving ? 'Guardando...' : 'Continuar →'}
          </button>
        </div>
      </form>
    </div>
  )
}
