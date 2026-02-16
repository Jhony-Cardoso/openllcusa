import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft, Building2, User as UserIcon,
    MapPin, Globe, ShieldCheck, Mail, Phone,
    FileText, Calendar, ExternalLink, Activity,
    CheckCircle2, Clock, Info, Briefcase, CreditCard, Download
} from 'lucide-react'
import { PedidoModel } from '@/lib/models/pedido'
import { FacturaModel } from '@/lib/models/factura'
import AdminDocumentManager from '@/components/admin/AdminDocumentManager'
import AdminTaxFilingManager from '@/components/admin/AdminTaxFilingManager'

export default async function AdminPedidoDetallePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const { userId: adminId } = await auth()
    const userAdmin = await currentUser()

    if (!adminId) redirect('/sign-in')

    // Seguridad extra Admin
    const adminEmails = [process.env.ADMIN_EMAIL, 'josemanuelguerranunez5@gmail.com']
    const isAdmin = adminEmails.includes(userAdmin?.emailAddresses[0]?.emailAddress || '')

    if (!isAdmin) {
        redirect('/dashboard')
    }

    const pedido = await PedidoModel.obtenerCompleto(id, true)
    if (!pedido) redirect('/admin/pedidos')

    const factura = await FacturaModel.obtenerPorPedidoId(id)

    const metadata = pedido.metadata || {}
    const hasOnboarding = pedido.paso_actual >= 7

    // Detectar tipo de servicio
    const esTaxFiling = pedido.metadata?.tipo_servicio === 'tax_filing_5472' || !!(pedido as any).tax_data
    const esEIN = pedido.servicio?.slug === 'obtencion-ein' || pedido.paquete?.slug === 'ein-express'

    // DEBUG: Ver qué datos tenemos
    console.log('🔍 [Admin Page] Pedido completo:', pedido)
    console.log('🔍 [Admin Page] tax_data:', (pedido as any).tax_data)
    console.log('🔍 [Admin Page] esTaxFiling:', esTaxFiling)

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900">

            {/* NAVEGACIÓN */}
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/pedidos"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Volver al listado
                </Link>
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${pedido.estado_pedido === 'pagado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                        {pedido.estado_pedido}
                    </span>
                    <span className="text-slate-300">|</span>
                    <p className="text-sm font-bold text-slate-500">#{pedido.numero_pedido}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* COLUMNA IZQUIERDA: INFORMACIÓN LEGAL (DEL CHECKLIST) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* SECCIÓN MIRA: PROPIETARIO - Solo para LLC/EIN */}
                    {!esTaxFiling && (
                        <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm">
                                    <UserIcon className="text-blue-600" size={18} />
                                    Información del Member (Propietario)
                                </h2>
                                {!hasOnboarding && (
                                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-lg border border-amber-100">ONBOARDING PENDIENTE</span>
                                )}
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <InfoItem label="Nombre Completo" value={metadata.member_nombre_completo} icon={UserIcon} />
                                <InfoItem label="Fecha Nacimiento" value={metadata.member_fecha_nacimiento} icon={Calendar} />
                                <InfoItem label="Nacionalidad" value={metadata.member_nacionalidad} icon={Globe} />
                                <InfoItem label="País Residencia" value={metadata.member_residencia_pais} icon={MapPin} />
                                <InfoItem label="ID Fiscal Tipo" value={metadata.member_tax_id_tipo?.toUpperCase()} icon={ShieldCheck} />
                                <InfoItem label="ID Fiscal Valor" value={metadata.member_tax_id_valor || 'N/A'} icon={Activity} />
                                <div className="md:col-span-2">
                                    <InfoItem label="Dirección Personal Completa" value={metadata.member_direccion} icon={MapPin} />
                                </div>
                            </div>
                        </section>
                    )}

                    {/* SECCIÓN: DATOS LLC - Solo para LLC/EIN */}
                    {!esTaxFiling && (
                        <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden text-slate-900">
                            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm">
                                    <Building2 className="text-blue-600" size={18} />
                                    Configuración de la Entidad (LLC)
                                </h2>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <InfoItem label="Designador Legal" value={metadata.empresa_designador} icon={FileText} />
                                <InfoItem label="Tipo de Gestión" value={metadata.empresa_tipo_gestion} icon={ShieldCheck} />
                                <InfoItem label="Propósito Negocio" value={metadata.empresa_proposito} icon={Briefcase} />
                                <InfoItem label="Sitio Web" value={metadata.empresa_sitio_web || 'No proporcionado'} icon={Globe} />
                            </div>
                        </section>
                    )}

                    {/* SECCIÓN: DOCUMENTACIÓN ADJUNTA - Solo para LLC/EIN */}
                    {!esTaxFiling && (
                        <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden text-slate-900">
                            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm">
                                    <FileText className="text-blue-600" size={18} />
                                    Documentos del Cliente
                                </h2>
                            </div>
                            <div className="p-8 flex items-center gap-6">
                                <div className="flex-1 p-6 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center text-center">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                                        <FileText size={24} />
                                    </div>
                                    <p className="font-bold text-slate-800 mb-1">Copia Pasaporte</p>
                                    <p className="text-xs text-slate-400 mb-4">
                                        {metadata.documento_identidad_nombre || 'Se requiere copia legible en color.'}
                                    </p>
                                    {metadata.documento_identidad_path ? (
                                        <a
                                            href={`/api/admin/pedidos/${pedido.id}/ver-identidad`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                        >
                                            Ver Documento
                                        </a>
                                    ) : (
                                        <button disabled className="px-6 py-2 bg-slate-100 text-slate-400 rounded-xl text-xs font-black cursor-not-allowed">
                                            No Disponible
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                {/* COLUMNA DERECHA: ACCIONES Y ESTADO */}
                <div className="space-y-8">

                    {/* CARD ACCIONES */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                            <Activity className="text-blue-400" size={20} />
                            Gestión de Trámite
                        </h3>

                        {esTaxFiling ? (
                            <AdminTaxFilingManager
                                pedidoId={pedido.id}
                                numeroPedido={pedido.numero_pedido}
                                metadata={metadata}
                                taxData={(pedido as any).tax_data}
                            />
                        ) : (
                            <AdminDocumentManager
                                pedidoId={pedido.id}
                                numeroPedido={pedido.numero_pedido}
                                pasoActual={pedido.paso_actual}
                                metadata={metadata}
                            />
                        )}

                        <div className="mt-8 pt-8 border-t border-slate-800 text-slate-900">
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex gap-3">
                                <Info className="text-blue-400 shrink-0" size={18} />
                                <p className="text-xs text-blue-100 leading-relaxed font-medium">
                                    Al cambiar el estado, el cliente recibirá una notificación automática y el dashboard se actualizará en tiempo real.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CARD FACTURACIÓN */}
                    {factura && (
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                            <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2">
                                <FileText size={14} /> Facturación
                            </h3>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-sm font-black text-slate-800">#{factura.numero_factura}</p>
                                    <p className="text-xs text-slate-500 font-bold mt-1">${(factura as any).total}</p>
                                </div>
                                {(factura as any).pdf_path ? (
                                    <a
                                        href={`/api/facturas/${factura.id}/descargar`}
                                        target="_blank"
                                        className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-blue-600 shadow-sm hover:scale-110 transition-transform"
                                    >
                                        <Download size={18} />
                                    </a>
                                ) : (
                                    <span className="text-[10px] font-bold text-amber-500 uppercase">Sin PDF</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* CARD CLIENTE */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                        <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-6">Datos del Cliente</h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                                <UserIcon size={24} />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 leading-tight">Cliente Account</p>
                                <p className="text-xs text-slate-400 font-bold">{pedido.user_id?.substring(0, 15)}...</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Link href={`mailto:${pedido.user_id}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors font-bold">
                                <Mail size={16} className="text-slate-300" />
                                Contacto Directo
                            </Link>
                            <div className="flex items-center gap-3 text-sm text-slate-600 font-bold">
                                <CreditCard size={16} className="text-slate-300" />
                                Stripe Customer ID
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function InfoItem({ label, value, icon: Icon }: { label: string, value: any, icon: any }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                <Icon size={12} className="text-slate-300" />
                {label}
            </p>
            <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-800 break-words">
                {value || '---'}
            </div>
        </div>
    )
}
