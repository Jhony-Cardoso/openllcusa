'use client'

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
  // ============================================
  // DATOS TEMPORALES PARA ESQUELETO VISUAL
  // (Se reemplazarán con lógica real)
  // ============================================
  const llcNombre = pedido?.metadata?.empresa_nombre || pedido?.nombre_empresa || 'Empresa Ejemplo LLC'
  const clienteNombre = 'Juan Pérez García' // TODO: obtener desde Clerk
  const pasoActual = pedido?.paso_actual ?? 4
  const totalPasos = 9
  const ultimaActualizacion = '12 de mayo de 2026' // TODO: formatear desde updated_at

  // Tipo de trámite
  let tipoTramite = 'Trámite General'
  if (esTaxFiling) tipoTramite = 'Tax Filing 5472 + 1120'
  else if (esEIN) tipoTramite = 'EIN Express'
  else if (esReporteAnual) tipoTramite = 'Reporte Anual Estatal'

  // Estado (simplificado)
  const estadoPedido = pedido?.estado_pedido || 'en_proceso'
  const estadoLabel = estadoPedido === 'pagado' ? 'En proceso' : estadoPedido

  // ============================================
  // ALERTAS (esqueleto - orden: documentos primero)
  // ============================================
  const alertas = [
    { tipo: 'documentos', texto: '2 Documentos faltantes', urgencia: 'urgente' as Urgencia },
    { tipo: 'tiempo', texto: '18 días en este paso', urgencia: 'media' as Urgencia },
  ]

  // Urgencia general de la tarjeta (la más alta de las alertas)
  const urgenciaGeneral: Urgencia = alertas.some(a => a.urgencia === 'urgente') ? 'urgente' : 'media'

  // ============================================
  // ACCIÓN RECOMENDADA (esqueleto)
  // ============================================
  const accionTexto = 'Revisar y aprobar el borrador'
  const esAccionCliente = true // TODO: lógica real
  const emailYaEnviado = true  // TODO: lógica real (primera vez vs reenvío)

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
              Paso {pasoActual}/{totalPasos} — Borrador generado, pendiente de revisión
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
            {alertas.map((alerta, index) => (
              <div 
                key={index}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColor(alerta.urgencia)}`}
              >
                {alerta.tipo === 'documentos' && <FileText size={13} />}
                {alerta.tipo === 'tiempo' && <Clock size={13} />}
                {alerta.texto}
              </div>
            ))}
            {alertas.length === 0 && (
              <div className="text-xs text-slate-400 font-medium">Sin alertas activas</div>
            )}
          </div>
        </div>

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
              
              {esAccionCliente && emailYaEnviado && (
                <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
                  <Mail size={13} />
                  Email de recordatorio enviado automáticamente
                </div>
              )}
            </div>

            <button
              onClick={() => {
                // TODO: Lógica real de acción / reenvío de email
                console.log('Botón de acción clickeado (esqueleto)')
              }}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-black transition-all active:scale-[0.985] ${getButtonColor()}`}
            >
              {esAccionCliente && emailYaEnviado ? 'Re-enviar email' : 'Revisar Borrador'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
