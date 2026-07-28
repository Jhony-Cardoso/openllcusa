'use client'

import { useState } from 'react'
import { Clock, AlertTriangle, FileText, Mail, ArrowRight } from 'lucide-react'

// TODO: Definir tipo real cuando conectemos datos
interface ResumenEjecutivoProps {
  pedido: any
  esTaxFiling?: boolean
  esEIN?: boolean
  esReporteAnual?: boolean
}

type Urgencia = 'urgente' | 'media' | 'normal' | 'baja'

export default function ResumenEjecutivo({
  pedido,
  esTaxFiling = false,
  esEIN = false,
  esReporteAnual = false,
}: ResumenEjecutivoProps) {
  const [showDocDetails, setShowDocDetails] = useState(false)
  const [accionRealizada, setAccionRealizada] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [ultimaNotif, setUltimaNotif] = useState<string | null>(null)
  // ============================================
  // DATOS REALES DEL PEDIDO
  // ============================================
  const llcNombre = pedido?.metadata?.empresa_nombre || pedido?.nombre_empresa || '—'
  const metadata = (pedido?.metadata ?? {}) as Record<string, any>
  const clienteNombre = metadata.cliente_email || metadata.email || (pedido?.user_id ? 'Cliente registrado' : '—')
  const pasoActual = pedido?.paso_actual ?? 0
  const totalPasos = 9

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '—'
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch {
      return '—'
    }
  }

  const ultimaActualizacion = formatDate(pedido?.updated_at)

  // Tipo de trámite
  let tipoTramite = 'Trámite General'
  if (esTaxFiling) tipoTramite = 'Tax Filing 5472 + 1120'
  else if (esEIN) tipoTramite = 'EIN Express'
  else if (esReporteAnual) tipoTramite = 'Reporte Anual Estatal'

  // Estado (simplificado)
  const estadoPedido = pedido?.estado_pedido || 'en_proceso'
  const estadoLabel = estadoPedido === 'pagado' ? 'En proceso' : estadoPedido

  // ============================================
  // DESCRIPCIÓN DEL PASO (según tipo de servicio)
  // ============================================
  const getPasoDescripcion = (paso: number): string => {
    if (esTaxFiling) {
      const taxPasos: Record<number, string> = {
        1: 'Datos recibidos',
        2: 'Pago verificado',
        3: 'Documentos en preparación',
        4: 'Borrador generado - pendiente de revisión',
        5: 'Borrador en revisión por el cliente',
        6: 'Documentos adicionales requeridos',
        7: 'Aprobado para envío al IRS',
        8: 'Enviado al IRS - esperando confirmación',
        9: 'Completado',
      }
      return taxPasos[paso] || 'En proceso'
    }

    if (esEIN) {
      const einPasos: Record<number, string> = {
        1: 'Solicitud recibida',
        2: 'Pago confirmado',
        3: 'Datos en revisión',
        4: 'Preparando documentación',
        5: 'Borrador SS-4 en preparación',
        6: 'Borrador listo para revisión',
        7: 'Autorización firmada',
        8: 'Enviado al IRS - esperando Carta EIN',
        9: 'EIN entregado',
      }
      return einPasos[paso] || 'En proceso'
    }

    if (esReporteAnual) {
      const reportePasos: Record<number, string> = {
        1: 'Solicitud recibida',
        2: 'Pago verificado',
        3: 'Datos del estado recopilados',
        4: 'Preparando Reporte Anual',
        5: 'En revisión interna',
        6: 'Pendiente de presentación estatal',
        7: 'Presentado ante el estado',
        8: 'En espera de confirmación oficial',
        9: 'Reporte completado',
      }
      return reportePasos[paso] || 'En proceso'
    }

    // Caso por defecto (Paquetes LLC normales / servicios sueltos)
    const defaultPasos: Record<number, string> = {
      1: 'Información recibida',
      2: 'Pago verificado',
      3: 'Datos de empresa guardados',
      4: 'Configuración en curso',
      5: 'Documentación en revisión',
      6: 'Onboarding en progreso',
      7: 'Configuración legal completada',
      8: 'Presentación gubernamental en curso',
      9: 'Documentación entregada',
    }
    return defaultPasos[paso] || 'En proceso'
  }

  const pasoDescripcion = getPasoDescripcion(pasoActual)

  // ============================================
  // LÓGICA DE ALERTAS (empezando a ser real)
  // ============================================

  // 1. Documentos faltantes (prioridad alta)
  const getDocumentosFaltantes = (): { cantidad: number; lista: string[] } => {
    const lista: string[] = []

    // Documento de identidad (común a la mayoría)
    if (!metadata.documento_identidad_path && pasoActual >= 3) {
      lista.push('Documento de identidad (pasaporte/DNI)')
    }

    // === TAX FILING ===
    if (esTaxFiling) {
      // Extractos bancarios (ahora en metadata.taxData.bankStatements o legacy tax_data)
      const taxData = (pedido as any)?.metadata?.taxData || (pedido as any)?.tax_data || {}
      const bankStatements = taxData.bankStatements || []
      if (bankStatements.length === 0 && pasoActual >= 3) {
        lista.push('Extractos bancarios')
      }

      // Borrador principal Form 5472 + 1120
      if (!metadata.documents?.form_5472_url && pasoActual >= 4) {
        lista.push('Borrador Form 5472 + 1120')
      }
    }

    // === REPORTE ANUAL ===
    if (esReporteAnual) {
      if (!metadata.documento_identidad_path && pasoActual >= 5) {
        lista.push('Documento de identidad (si corresponde)')
      }
    }

    return { cantidad: lista.length, lista }
  }

  const docsFaltantes = getDocumentosFaltantes()

  // 2. Calcular días desde la última actualización (tiempo en el paso actual)
  const calcularDiasEnPaso = (): number => {
    if (!pedido?.updated_at) return 0
    const lastUpdate = new Date(pedido.updated_at)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - lastUpdate.getTime())
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  }

  const diasEnPaso = calcularDiasEnPaso()

  // Umbrales (según lo acordado)
  const getUrgenciaTiempo = (dias: number, esEin: boolean, paso: number): Urgencia => {
    // Para EIN solo aplicamos umbrales largos en el último paso (paso 8)
    if (esEin && paso !== 8) return 'baja'

    if (esEin) {
      if (dias >= 45) return 'urgente'
      if (dias >= 15) return 'media'
    } else {
      if (dias >= 30) return 'urgente'
      if (dias >= 10) return 'media'
    }
    return 'baja'
  }

  const urgenciaTiempo = getUrgenciaTiempo(diasEnPaso, esEIN, pasoActual)

  // Construir alertas (documentos primero, luego tiempo)
  const alertas: Array<{ tipo: string; texto: string; urgencia: Urgencia }> = []

  // Alerta de documentos faltantes (siempre primero si existe)
  if (docsFaltantes.cantidad > 0) {
    const textoDocs = docsFaltantes.cantidad === 1 
      ? `1 Documento faltante: ${docsFaltantes.lista[0]}`
      : `${docsFaltantes.cantidad} Documentos faltantes`
    alertas.push({ 
      tipo: 'documentos', 
      texto: textoDocs, 
      urgencia: 'urgente' 
    })
  }

  // Alerta de tiempo (si aplica)
  if (diasEnPaso >= 10) {
    const textoTiempo = `${diasEnPaso} días en este paso`
    alertas.push({ tipo: 'tiempo', texto: textoTiempo, urgencia: urgenciaTiempo })
  }

  // Urgencia general de la tarjeta (la más alta de las alertas)
  const urgenciaGeneral: Urgencia = alertas.some(a => a.urgencia === 'urgente') 
    ? 'urgente' 
    : alertas.some(a => a.urgencia === 'media') 
      ? 'media' 
      : 'baja'

  // ============================================
  // DATOS DINÁMICOS DEL METADATA (ya extraído arriba)
  // ============================================

  // Flags y fechas útiles para mostrar en la tarjeta
  const taxHasFormularios = !!metadata.documents?.form_5472_url
  const taxFormAprobado = metadata.documents?.form_5472_approved === true
  const taxFormAprobadoAt = metadata.documents?.form_5472_approved_at

  const einHasBorrador = !!metadata.borrador_ss4_path
  const einAprobado = metadata.borrador_ss4_approved === true
  const einAprobadoAt = metadata.borrador_ss4_approved_at

  const tieneCartaEIN = !!metadata.carta_ein_path

  // ============================================
  // ACCIÓN RECOMENDADA (usando campos reales de metadata)
  // ============================================
  const getAccionRecomendada = (): { texto: string; esAccionCliente: boolean } => {
    const paso = pasoActual

    if (esTaxFiling) {
      const borradorEnviado = !!metadata.borrador_enviado_at

      if (paso <= 3) return { texto: 'Completar datos fiscales del cliente', esAccionCliente: true }

      if (paso === 4) {
        if (!taxHasFormularios) return { texto: 'Preparar borrador de formularios', esAccionCliente: false }
        if (taxHasFormularios && !taxFormAprobado) return { texto: 'Esperando aprobación del cliente', esAccionCliente: true }
        if (taxFormAprobado && !borradorEnviado) return { texto: 'Enviar formularios al IRS', esAccionCliente: false }
        return { texto: 'Enviado al IRS - en espera de confirmación', esAccionCliente: false }
      }

      if (paso === 5) return { texto: 'Recordar al cliente que apruebe el borrador', esAccionCliente: true }
      if (paso === 6) return { texto: 'Solicitar documentos adicionales al cliente', esAccionCliente: true }
      if (paso === 7) return { texto: 'Enviar al IRS', esAccionCliente: false }
      if (paso === 8) return { texto: 'Verificar acuse de recibo del IRS', esAccionCliente: false }
      return { texto: 'Trámite completado', esAccionCliente: false }
    }

    if (esEIN) {
      if (paso <= 6) return { texto: 'Completar datos para SS-4', esAccionCliente: true }

      if (paso === 7) {
        if (!einHasBorrador) return { texto: 'Generar borrador SS-4', esAccionCliente: false }
        if (einHasBorrador && !einAprobado) return { texto: 'Esperando aprobación del cliente', esAccionCliente: true }
        return { texto: 'Enviar SS-4 al IRS', esAccionCliente: false }
      }

      if (paso === 8) {
        if (tieneCartaEIN) return { texto: 'Revisar / Confirmar Carta EIN', esAccionCliente: false }
        return { texto: 'Esperando Carta EIN del IRS', esAccionCliente: false }
      }

      return { texto: 'EIN entregado', esAccionCliente: false }
    }

    if (esReporteAnual) {
      if (paso <= 4) return { texto: 'Completar información del estado', esAccionCliente: true }
      if (paso === 5 || paso === 6) return { texto: 'Preparar y presentar Reporte Anual', esAccionCliente: false }
      if (paso === 7) return { texto: 'Confirmar presentación ante el estado', esAccionCliente: false }
      if (paso === 8) return { texto: 'Verificar confirmación oficial', esAccionCliente: false }
      return { texto: 'Reporte completado', esAccionCliente: false }
    }

    // Caso por defecto (Paquetes / Servicios sueltos LLC)
    if (paso < 7) {
      const tieneDocumentos = !!metadata.documento_identidad_path
      if (!tieneDocumentos && paso >= 3) {
        return { texto: 'Solicitar documento de identidad', esAccionCliente: true }
      }
      return { texto: 'Completar onboarding / Configuración Legal', esAccionCliente: true }
    }
    if (paso === 7) return { texto: 'Iniciar presentación gubernamental', esAccionCliente: false }
    if (paso === 8) return { texto: 'Verificar presentación ante el estado', esAccionCliente: false }
    return { texto: 'Trámite finalizado', esAccionCliente: false }
  }

  const { texto: accionTexto, esAccionCliente } = getAccionRecomendada()
  const emailYaEnviado = !!metadata.email_recordatorio_enviado || !!metadata.email_confirmacion_enviado

  // Historial ligero desde metadata (implementación de step_history)
  const stepHistory: any[] = Array.isArray(metadata.step_history) ? metadata.step_history : []

  const getButtonColor = () => {
    if (emailYaEnviado && esAccionCliente) {
      return 'bg-slate-400 hover:bg-slate-500 text-white' // Gris neutro para re-enviar
    }
    if (urgenciaGeneral === 'urgente') return 'bg-red-600 hover:bg-red-700 text-white'
    if (urgenciaGeneral === 'media') return 'bg-amber-500 hover:bg-amber-600 text-white'
    return 'bg-emerald-600 hover:bg-emerald-700 text-white'
  }

  const getCardBorder = () => {
    if (urgenciaGeneral === 'urgente') return 'border-red-300'
    if (urgenciaGeneral === 'media') return 'border-amber-300'
    return 'border-slate-200'
  }

  const getBadgeColor = (urgencia: Urgencia) => {
    if (urgencia === 'urgente') return 'bg-red-100 text-red-700 border-red-200'
    if (urgencia === 'media') return 'bg-amber-100 text-amber-700 border-amber-200'
    return 'bg-slate-100 text-slate-600 border-slate-200'
  }

  // Handler real para notificar al cliente
  const handleAccion = async () => {
    if (!pedido?.id) return
    setEnviando(true)
    try {
      const res = await fetch(`/api/admin/pedidos/${pedido.id}/notificar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: accionTexto }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setAccionRealizada(true)
        setUltimaNotif(data.mensajeEnviado || accionTexto)
        console.log('[ResumenEjecutivo] Notificación enviada:', data)
        setTimeout(() => setAccionRealizada(false), 3500)
      } else {
        alert('No se pudo enviar la notificación: ' + (data?.error || 'Error desconocido'))
      }
    } catch (e) {
      console.error('Error enviando notificación:', e)
      alert('Error de red al enviar la notificación')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div 
      className={`bg-white rounded-[2.5rem] border-2 ${getCardBorder()} shadow-lg shadow-slate-200/50 overflow-hidden`}
    >
      {/* HEADER */}
      <div className="px-8 pt-6 pb-4 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-blue-100 text-blue-700 border border-blue-200">
            {tipoTramite}
          </span>
          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
            estadoPedido === 'pagado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {estadoLabel}
          </span>
        </div>
        <div className="text-xs font-bold text-slate-400">
          #{pedido?.numero_pedido || 'PED-XXXX'}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* IDENTIFICACIÓN */}
        <div>
          <div className="font-black text-xl text-slate-900">{llcNombre}</div>
          <div className="text-slate-600 mt-0.5">{clienteNombre}</div>
        </div>

        {/* FASE ACTUAL */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              FASE ACTUAL
            </div>
            <div className="font-bold text-lg text-slate-900">
              Paso {pasoActual}/{totalPasos} — {pasoDescripcion}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Última actualización</div>
            <div className="font-bold text-slate-700 flex items-center gap-1.5 justify-end">
              <Clock size={14} /> {ultimaActualizacion}
            </div>
          </div>
        </div>

        {/* ALERTAS ACTIVAS */}
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            ALERTAS ACTIVAS
          </div>
          <div className="flex flex-wrap gap-2">
            {alertas.map((alerta, index) => {
              const isDocAlert = alerta.tipo === 'documentos'
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (isDocAlert) {
                      setShowDocDetails(!showDocDetails)
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                    getBadgeColor(alerta.urgencia)
                  } ${isDocAlert ? 'hover:opacity-80 cursor-pointer' : ''}`}
                  disabled={!isDocAlert}
                >
                  {alerta.tipo === 'documentos' && <FileText size={13} />}
                  {alerta.tipo === 'tiempo' && <Clock size={13} />}
                  {alerta.texto}
                  {isDocAlert && <span className="ml-1 text-[10px] opacity-70">▼</span>}
                </button>
              )
            })}
            {alertas.length === 0 && (
              <div className="text-xs text-slate-400 font-medium">Sin alertas activas</div>
            )}
          </div>

          {/* Detalle de documentos faltantes (al hacer clic) */}
          {showDocDetails && docsFaltantes.cantidad > 0 && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm">
              <div className="font-bold text-red-700 mb-1 text-xs uppercase tracking-widest">
                Documentos que faltan:
              </div>
              <ul className="list-disc pl-5 text-red-800 text-xs space-y-0.5">
                {docsFaltantes.lista.map((doc, i) => (
                  <li key={i}>{doc}</li>
                ))}
              </ul>
              <div className="text-[10px] text-red-600 mt-2">
                Puedes subirlos en la sección de Documentos más abajo.
              </div>
            </div>
           )}
         </div>

         {/* HISTORIAL RECIENTE (step_history desde metadata) */}
         {stepHistory.length > 0 && (
           <div className="pt-1">
             <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
               HISTORIAL RECIENTE
             </div>
             <div className="text-xs text-slate-600 space-y-0.5 pl-1">
               {stepHistory.slice(-3).reverse().map((h: any, i: number) => (
                 <div key={i} className="flex justify-between">
                   <span>
                     Paso {h.paso} — {h.tipo === 'notificacion_cliente' ? 'Notificado al cliente' : (h.descripcion || h.tipo)}
                   </span>
                   <span className="text-slate-400 font-mono text-[10px]">{formatDate(h.fecha)}</span>
                 </div>
               ))}
             </div>
             {ultimaNotif && (
               <div className="text-[10px] text-emerald-600 mt-1 pl-1">Última: {ultimaNotif}</div>
             )}
           </div>
         )}

         {/* PRÓXIMA ACCIÓN RECOMENDADA */}
         <div className="pt-2 border-t border-slate-100">
           <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
             PRÓXIMA ACCIÓN RECOMENDADA
           </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <div className="font-bold text-slate-800 text-[15px]">
                {accionTexto}
              </div>

              {/* Fecha de aprobación del cliente (solo cuando es relevante mostrarla) */}
              {esTaxFiling && taxFormAprobado && taxFormAprobadoAt && 
               accionTexto !== 'Esperando aprobación del cliente' && (
                <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
                  ✅ Aprobado por el cliente el {formatDate(taxFormAprobadoAt)}
                </div>
              )}

              {esEIN && einAprobado && einAprobadoAt && 
               accionTexto !== 'Esperando aprobación del cliente' && (
                <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
                  ✅ Aprobado por el cliente el {formatDate(einAprobadoAt)}
                </div>
              )}
              
              {esAccionCliente && emailYaEnviado && (
                <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
                  <Mail size={13} />
                  Email de recordatorio enviado automáticamente
                </div>
              )}
            </div>

            <button
              onClick={handleAccion}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-black transition-all active:scale-[0.985] ${getButtonColor()}`}
              disabled={enviando || accionRealizada}
            >
              {enviando ? 'Enviando…' : accionRealizada ? '✓ Enviado' : (esAccionCliente && emailYaEnviado ? 'Re-enviar email' : (esAccionCliente ? 'Notificar al cliente' : 'Gestionar'))}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
