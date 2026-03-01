'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    User, Building2, ShieldEllipsis, FileCheck,
    ArrowRight, ArrowLeft, CheckCircle2, Upload,
    Info, ShieldCheck, Mail, MapPin, Globe, CreditCard, Loader2,
    PenTool, FileText, AlertTriangle, Check
} from 'lucide-react'
import SignaturePad from '@/components/ui/SignaturePad' // Assuming this path is correct

// ... (imports anteriores se mantienen igual, solo cambia el componente)

type Props = {
    pedidoId: string
    nombreUsuario: string
    esEIN?: boolean
}

export default function OnboardingWizard({ pedidoId, nombreUsuario, esEIN = false }: Props) {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [termsAccepted, setTermsAccepted] = useState(false) // Nuevo estado para el checkbox legal

    // Estado para todos los datos del checklist
    const [formData, setFormData] = useState({
        // Miembro / Responsable
        member_nombre_completo: '',
        member_fecha_nacimiento: '',
        member_nacionalidad: '',
        member_residencia_pais: '',
        member_direccion: '',
        member_tax_id_tipo: 'foreign', // ssn, itin, foreign
        member_tax_id_valor: '',

        // Empresa (LLC Formation)
        empresa_designador: 'LLC',
        empresa_proposito: 'Any lawful business',
        empresa_tipo_gestion: 'Member-Managed',
        empresa_sitio_web: '',

        // SS-4 / EIN Específico
        ss4_legal_name: '', // Línea 1
        ss4_trade_name: '', // Línea 2
        ss4_tipo_entidad: 'LLC', // Línea 9a
        ss4_razon_solicitud: 'Started new business', // Línea 10
        ss4_fecha_inicio: new Date().toISOString().split('T')[0], // Línea 11
        ss4_cierre_fiscal: 'December', // Línea 12
        ss4_empleados_previstos: '0', // Línea 13
        ss4_actividad_principal: '', // Línea 16
        ss4_principal_producto: '', // Línea 18
        ss4_city_state_zip: '', // Línea 4b
        ss4_county: '', // Línea 6
        firma_digital: '', // Nuevo campo para la firma
    })

    const [idFile, setIdFile] = useState<File | null>(null)
    const [uploadingId, setUploadingId] = useState(false)
    const [idUploaded, setIdUploaded] = useState(false)

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // LISTA DE MESES PARA CIERRE FISCAL
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Función para validar campos antes de avanzar
    const validateStep = (currentStep: number) => {
        // VALIDACIÓN COMÚN: PASO 1 (Responsable)
        if (currentStep === 1) {
            // En EIN el nombre es obligatorio. La dirección se pide en el paso 2.
            if (!formData.member_nombre_completo.trim()) {
                alert('Por favor, indica el nombre completo del responsable.')
                return false
            }

            // En LLC (no EIN), la dirección personal SÍ es obligatoria en el paso 1
            if (!esEIN && !formData.member_direccion.trim()) {
                alert('Por favor, indica tu dirección personal completa.')
                return false
            }

            if (!esEIN && (!formData.member_fecha_nacimiento || !formData.member_nacionalidad.trim())) {
                alert('Por favor, completa fecha de nacimiento y nacionalidad.')
                return false
            }
        }

        if (esEIN) {
            // VALIDACIÓN EIN ESPECÍFICA
            if (currentStep === 2) { // Datos de la Entidad (SS-4)
                if (!formData.ss4_legal_name.trim()) {
                    alert('El nombre legal de la entidad es obligatorio (Línea 1 del SS-4).')
                    return false
                }
                if (!formData.ss4_tipo_entidad.trim()) {
                    alert('El tipo de entidad es obligatorio (Línea 9a del SS-4).')
                    return false
                }
                // Validar dirección de la LLC (Líneas 4a, 4b y 6)
                if (!formData.member_direccion.trim() || !formData.ss4_city_state_zip.trim() || !formData.ss4_county.trim()) {
                    alert('Por favor, completa todos los campos de la dirección de la LLC (Calle, Ciudad/Estado/ZIP y Condado).')
                    return false
                }
            }
            if (currentStep === 3) { // Detalles del Negocio (SS-4)
                if (!formData.ss4_razon_solicitud.trim()) {
                    alert('La razón de la solicitud es obligatoria (Línea 10 del SS-4).')
                    return false
                }
                if (!formData.ss4_fecha_inicio.trim()) {
                    alert('La fecha de inicio del negocio es obligatoria (Línea 11 del SS-4).')
                    return false
                }
                if (!formData.ss4_cierre_fiscal.trim()) {
                    alert('El mes de cierre fiscal es obligatorio (Línea 12 del SS-4).')
                    return false
                }
                if (!formData.ss4_actividad_principal.trim() || !formData.ss4_principal_producto.trim()) {
                    alert('Por favor, describe la actividad y productos del negocio.')
                    return false
                }
            }
            if (currentStep === 4) { // Firma Digital
                if (!formData.firma_digital || formData.firma_digital.length < 100) { // Check for a reasonable length of base64 string
                    alert('Por favor, proporciona tu firma digital.')
                    return false
                }
            }
        } else {
            // VALIDACIÓN LLC FORMATION (Original)
            if (currentStep === 2) {
                if (!formData.empresa_proposito.trim()) {
                    alert('Por favor, indica el propósito de la empresa.')
                    return false
                }
            }
        }
        return true
    }

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(step + 1)
        }
    }
    const handleBack = () => setStep(step - 1)

    const handleUploadId = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIdFile(file)
        setUploadingId(true)

        const formDataUpload = new FormData()
        formDataUpload.append('file', file)

        try {
            const res = await fetch(`/api/pedidos/${pedidoId}/upload-id`, {
                method: 'POST',
                body: formDataUpload
            })

            if (res.ok) {
                setIdUploaded(true)
            } else {
                alert('Error al subir el documento. Por favor, intenta de nuevo.')
                setIdFile(null)
            }
        } catch (err) {
            console.error(err)
            alert('Error de conexión al subir el archivo.')
        } finally {
            setUploadingId(false)
        }
    }

    const handleSubmit = async () => {
        // The document upload is now the last step for both flows, which is step 5 for EIN and step 4 for LLC
        const finalStepForDocUpload = esEIN ? 5 : 4;

        if (!idUploaded && step === finalStepForDocUpload) {
            alert('Por favor, adjunta tu documento de identidad antes de finalizar.')
            return
        }
        setLoading(true)
        try {
            // If esEIN, we send the firma_digital as well
            const payload = esEIN ? { ...formData, esEIN, firma_digital: formData.firma_digital } : { ...formData, esEIN };

            const res = await fetch(`/api/pedidos/${pedidoId}/onboarding`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload) // Enviamos flag esEIN y firma si aplica
            })

            if (res.ok) {
                router.refresh()
            } else {
                alert('Hubo un error al guardar los datos. Por favor, reintenta.')
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // DEFINICIÓN DE PASOS SEGÚN TIPO
    const steps = esEIN ? [
        { id: 1, label: 'Responsable', icon: User },
        { id: 2, label: 'Entidad SS-4', icon: Building2 },
        { id: 3, label: 'Negocio SS-4', icon: FileText },
        { id: 4, label: 'Firma', icon: PenTool },
        { id: 5, label: 'Documentos', icon: FileCheck },
    ] : [
        { id: 1, label: 'Propietario', icon: User },
        { id: 2, label: 'Empresa', icon: Building2 },
        { id: 3, label: 'Gestión y Tax', icon: ShieldEllipsis },
        { id: 4, label: 'Documentación', icon: FileCheck },
    ]

    // RENDERIZADO DE PASOS PARA EIN
    const renderStepEIN = (currentStep: number) => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                Parte Responsable (Responsible Party)
                            </h3>
                            <p className="text-slate-500">
                                Indica quién será el responsable ante el IRS (Línea 7a del SS-4). Solo necesitamos su nombre e identificación.
                            </p>
                        </div>

                        {/* SUGERENCIA IDIOMA */}
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                                <Globe className="text-amber-600" size={20} />
                            </div>
                            <div className="text-sm text-amber-900 leading-relaxed font-medium">
                                <p className="font-bold mb-1">💡 Sugerencia importante:</p>
                                <p>Todos los datos deben escribirse en <strong>INGLÉS</strong> (excepto tu nombre y dirección personal). Si no dominas el idioma, te sugerimos usar <a href="https://translate.google.com" target="_blank" className="underline hover:text-amber-700">Google Translate</a> para las descripciones de negocio.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-900">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    Nombre Completo (Línea 7a) <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Tal y como figura en el pasaporte"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                        value={formData.member_nombre_completo}
                                        onChange={(e) => updateField('member_nombre_completo', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-6 md:col-span-2 mt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1 font-bold">Identificación Fiscal (Línea 7b)</label>
                                    <select
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-800"
                                        value={formData.member_tax_id_tipo}
                                        onChange={(e) => updateField('member_tax_id_tipo', e.target.value)}
                                    >
                                        <option value="foreign">No tengo (Soy extranjero)</option>
                                        <option value="ssn">Sí, tengo SSN (Social Security Number)</option>
                                        <option value="itin">Sí, tengo ITIN (Individual Taxpayer ID)</option>
                                        <option value="ein">La entidad responsable ya tiene un EIN</option>
                                    </select>
                                </div>

                                {formData.member_tax_id_tipo !== 'foreign' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1 font-bold">Número Fiscal (Línea 7b)</label>
                                        <input
                                            type="text"
                                            placeholder={formData.member_tax_id_tipo === 'ssn' ? 'XXX-XX-XXXX' : '9XX-XX-XXXX'}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                            value={formData.member_tax_id_valor}
                                            onChange={(e) => updateField('member_tax_id_valor', e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                Datos de la Entidad (SS-4)
                            </h3>
                            <p className="text-slate-500">
                                Información legal de tu LLC para el SS-4.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-900">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    Nombre Legal de la Entidad (Línea 1) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Mi Empresa LLC"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                    value={formData.ss4_legal_name}
                                    onChange={(e) => updateField('ss4_legal_name', e.target.value)}
                                />
                                <p className="text-xs text-slate-400 ml-2 font-bold uppercase tracking-wider">Exactamente como aparece en los documentos de constitución.</p>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    Nombre Comercial (Trade Name / DBA) (Línea 2)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Opcional - Solo si usas un nombre diferente"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                    value={formData.ss4_trade_name}
                                    onChange={(e) => updateField('ss4_trade_name', e.target.value)}
                                />
                            </div>

                            {/* DIRECCIÓN DE LA LLC */}
                            <div className="space-y-2 md:col-span-2 border-t pt-6 mt-2">
                                <label className="text-sm font-black text-blue-600 uppercase tracking-widest ml-1 mb-2 block">
                                    Dirección de la LLC en Estados Unidos
                                </label>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">
                                            Dirección Postal (Calle y Número) (Línea 4a) <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                                            <textarea
                                                placeholder="Dirección física o de agente registrado"
                                                rows={2}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                                value={formData.member_direccion}
                                                onChange={(e) => updateField('member_direccion', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">
                                                Ciudad, Estado y Código Postal (Línea 4b) <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Cheyenne, WY 82001"
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                                value={formData.ss4_city_state_zip}
                                                onChange={(e) => updateField('ss4_city_state_zip', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">
                                                Condado / Provincia (Línea 6) <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Laramie"
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                                value={formData.ss4_county}
                                                onChange={(e) => updateField('ss4_county', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2 border-t pt-6">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    Tipo de Entidad (Línea 9a) <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-800"
                                    value={formData.ss4_tipo_entidad}
                                    onChange={(e) => updateField('ss4_tipo_entidad', e.target.value)}
                                >
                                    <option value="LLC">Limited Liability Company (LLC)</option>
                                    <option value="Sole Proprietor">Sole Proprietor (Unipersonal)</option>
                                    <option value="Partnership">Partnership (Sociedad)</option>
                                    <option value="Corporation">Corporation (Inc, Corp)</option>
                                    <option value="Other">Otro / Extranjero</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                Detalles del Negocio
                            </h3>
                            <p className="text-slate-500">
                                Información sobre la actividad y fechas para el IRS.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-900">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Razón de la solicitud (Línea 10)</label>
                                <select
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-800"
                                    value={formData.ss4_razon_solicitud}
                                    onChange={(e) => updateField('ss4_razon_solicitud', e.target.value)}
                                >
                                    <option value="Started new business">Started new business (Nuevo Negocio)</option>
                                    <option value="Hired employees">Hired employees (Contratación de empleados)</option>
                                    <option value="Banking purpose">Banking purpose (Para abrir cuenta bancaria)</option>
                                    <option value="Changed type of organization">Changed type of organization (Cambio de tipo)</option>
                                    <option value="Purchased going business">Purchased going business (Compra de negocio)</option>
                                    <option value="Created a trust">Created a trust (Fideicomiso)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Fecha de inicio del negocio (Línea 11)</label>
                                <input
                                    type="date"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                    value={formData.ss4_fecha_inicio}
                                    onChange={(e) => updateField('ss4_fecha_inicio', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Mes de cierre fiscal (Línea 12)</label>
                                <select
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                    value={formData.ss4_cierre_fiscal}
                                    onChange={(e) => updateField('ss4_cierre_fiscal', e.target.value)}
                                >
                                    {meses.map(mes => (
                                        <option key={mes} value={mes}>{mes}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Empleados previstos (Próximos 12 meses)</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                    value={formData.ss4_empleados_previstos}
                                    onChange={(e) => updateField('ss4_empleados_previstos', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Actividad Principal (Línea 16)</label>
                                <input
                                    type="text"
                                    placeholder="Ej: E-commerce, Consultoría de Software..."
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                    value={formData.ss4_actividad_principal}
                                    onChange={(e) => updateField('ss4_actividad_principal', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Producto/Servicio Principal (Línea 17)</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Venta de ropa online, Servicios de marketing..."
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                    value={formData.ss4_principal_producto}
                                    onChange={(e) => updateField('ss4_principal_producto', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                            <div className="flex items-start gap-3">
                                <div className="p-1 bg-blue-100 rounded-full shrink-0">
                                    <PenTool size={16} className="text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Autorización de Tercero Designado</h4>
                                    <p className="leading-relaxed">
                                        Al firmar este documento, autorizo a <strong>Open LLC USA</strong> a recibir el Número de Identificación de Empleador (EIN) de mi entidad.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border rounded-xl p-5 shadow-sm">
                            <label className="block text-sm font-medium text-slate-700 mb-3 ml-1">
                                Firma del Solicitante (Ratón o Pantalla Táctil)
                            </label>
                            <SignaturePad
                                onChange={(signature) => updateField('firma_digital', signature || '')}
                            />
                            <p className="text-center text-xs text-slate-400 mt-4 font-medium uppercase tracking-widest">
                                Haz el dibujo de tu firma dentro del recuadro
                            </p>
                        </div>
                    </div>
                )
            case 5:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-2">¡Todo listo para revisar!</h3>
                            <p className="text-slate-500 text-lg">Revisa que la información sea correcta antes de enviarla.</p>
                        </div>

                        <div className="bg-slate-50 rounded-3xl border border-slate-100 p-8 space-y-4 text-slate-900">
                            <div className="flex justify-between items-center py-3 border-b border-slate-200/50">
                                <span className="text-slate-500 font-medium font-bold">Responsable</span>
                                <span className="font-bold">{formData.member_nombre_completo}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-200/50">
                                <span className="text-slate-500 font-medium font-bold">Entidad Legal</span>
                                <span className="font-bold">{formData.ss4_legal_name}</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-slate-500 font-medium font-bold">Identificación Fiscal</span>
                                <span className="font-bold uppercase">{formData.member_tax_id_tipo}</span>
                            </div>
                            <div className="border-t pt-4">
                                <span className="block text-slate-500 mb-2 font-bold">Firma Digital Registrada</span>
                                {formData.firma_digital ? (
                                    <img src={formData.firma_digital} alt="Firma" className="h-16 border rounded bg-white p-1" />
                                ) : (
                                    <p className="text-red-500 text-xs font-bold uppercase">Falta firma</p>
                                )}
                            </div>
                        </div>

                        <div className={`rounded-[2rem] p-6 md:p-8 text-white flex flex-col md:flex-row items-center gap-6 transition-all ${idUploaded ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${idUploaded ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                                {uploadingId ? <Loader2 size={32} className="animate-spin" /> : idUploaded ? <CheckCircle2 size={32} /> : <Upload size={32} />}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h4 className="text-xl font-bold mb-1">{idUploaded ? 'Documento Adjuntado' : 'Carga de Identificación'}</h4>
                                <p className="text-blue-100 text-sm">
                                    {idUploaded ? `Archivo cargado correctamente` : 'Adjunta el pasaporte del responsable en formato PDF o Imagen.'}
                                </p>
                            </div>
                            <div className="relative w-full md:w-auto">
                                <input
                                    type="file"
                                    id="id-upload"
                                    className="hidden"
                                    onChange={handleUploadId}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    disabled={uploadingId || idUploaded}
                                />
                                <label
                                    htmlFor="id-upload"
                                    className={`block text-center px-6 py-3 bg-white font-black rounded-xl transition-colors whitespace-nowrap cursor-pointer ${uploadingId || idUploaded ? 'opacity-50 cursor-default text-slate-400' : 'text-blue-600 hover:bg-blue-50'}`}
                                >
                                    {uploadingId ? 'Subiendo...' : idUploaded ? '¡Listo!' : 'Adjuntar Documento'}
                                </label>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                            <label className="flex items-start gap-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="mt-1"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                />
                                <div className="flex-1 text-slate-600 text-xs leading-relaxed text-justify">
                                    <p className="font-bold text-slate-900 mb-1">Declaración de Veracidad y Autorización</p>
                                    Declaro bajo pena de perjurio que la información proporcionada es verdadera, correcta y completa. Autorizo a <strong>Open LLC USA</strong> a completar y firmar el Formulario SS-4 en mi nombre.
                                </div>
                            </label>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    // RENDERIZADO DE PASOS PARA LLC (Original)
    const renderStepLLC = (currentStep: number) => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                Información del Propietario
                            </h3>
                            <p className="text-slate-500">
                                Estos datos deben coincidir exactamente con tu pasaporte.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-900">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    Nombre Completo <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Tal y como figura en el pasaporte"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                        value={formData.member_nombre_completo}
                                        onChange={(e) => updateField('member_nombre_completo', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    Fecha de Nacimiento <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                    value={formData.member_fecha_nacimiento}
                                    onChange={(e) => updateField('member_fecha_nacimiento', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    Nacionalidad <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Ej: España, México..."
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                        value={formData.member_nacionalidad}
                                        onChange={(e) => updateField('member_nacionalidad', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2 text-slate-900">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    Dirección Personal Completa <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                                    <textarea
                                        placeholder="Calle, ciudad, código postal y país (No puede ser un PO Box)"
                                        rows={3}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                        value={formData.member_direccion}
                                        onChange={(e) => updateField('member_direccion', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                Detalles de la LLC
                            </h3>
                            <p className="text-slate-500">
                                Configura la identidad legal de tu nueva entidad.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-900">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Designador Legal</label>
                                <select
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-800"
                                    value={formData.empresa_designador}
                                    onChange={(e) => updateField('empresa_designador', e.target.value)}
                                >
                                    <option value="LLC">LLC</option>
                                    <option value="L.L.C.">L.L.C.</option>
                                    <option value="Limited Liability Company">Limited Liability Company</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    Propósito de la Empresa <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Any lawful business (Genérico)"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                    value={formData.empresa_proposito}
                                    onChange={(e) => updateField('empresa_proposito', e.target.value)}
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Sitio Web (Opcional)</label>
                                <input
                                    type="url"
                                    placeholder="https://tuweb.com"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                    value={formData.empresa_sitio_web}
                                    onChange={(e) => updateField('empresa_sitio_web', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                Estructura y Gestión
                            </h3>
                            <p className="text-slate-500">
                                Define quién toma las decisiones y los detalles fiscales.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-900">
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-700 ml-1">Tipo de Gestión</label>
                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => updateField('empresa_tipo_gestion', 'Member-Managed')}
                                        className={`p-4 border-2 rounded-2xl text-left transition-all ${formData.empresa_tipo_gestion === 'Member-Managed'
                                            ? 'border-blue-600 bg-blue-50 shadow-sm'
                                            : 'border-slate-100 bg-white hover:border-blue-200'
                                            }`}
                                    >
                                        <p className="font-bold text-slate-900">Member-Managed</p>
                                        <p className="text-xs text-slate-500 mt-1">El propietario gestiona directamente la empresa.</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateField('empresa_tipo_gestion', 'Manager-Managed')}
                                        className={`p-4 border-2 rounded-2xl text-left transition-all ${formData.empresa_tipo_gestion === 'Manager-Managed'
                                            ? 'border-blue-600 bg-blue-50 shadow-sm'
                                            : 'border-slate-100 bg-white hover:border-blue-200'
                                            }`}
                                    >
                                        <p className="font-bold text-slate-900">Manager-Managed</p>
                                        <p className="text-xs text-slate-500 mt-1">Se designa a un gerente para la administración.</p>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">¿Posees SSN o ITIN?</label>
                                    <select
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-800"
                                        value={formData.member_tax_id_tipo}
                                        onChange={(e) => updateField('member_tax_id_tipo', e.target.value)}
                                    >
                                        <option value="foreign">No tengo (Soy extranjero)</option>
                                        <option value="ssn">Sí, tengo SSN</option>
                                        <option value="itin">Sí, tengo ITIN</option>
                                    </select>
                                </div>

                                {formData.member_tax_id_tipo !== 'foreign' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Número Fiscal</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                            value={formData.member_tax_id_valor}
                                            onChange={(e) => updateField('member_tax_id_valor', e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileCheck size={40} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-2">¡Todo listo para revisar!</h3>
                            <p className="text-slate-500 text-lg">Revisa que la información sea correcta antes de enviarla a nuestros expertos.</p>
                        </div>

                        <div className="bg-slate-50 rounded-3xl border border-slate-100 p-8 space-y-4 text-slate-900">
                            <div className="flex justify-between items-center py-3 border-b border-slate-200/50">
                                <span className="text-slate-500 font-medium">Propietario</span>
                                <span className="font-bold">{formData.member_nombre_completo}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-200/50">
                                <span className="text-slate-500 font-medium">Designador</span>
                                <span className="font-bold">{formData.empresa_designador}</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-slate-500 font-medium">Identificación Fiscal Responsable</span>
                                <span className="font-bold uppercase">{formData.member_tax_id_tipo}</span>
                            </div>
                        </div>

                        <div className={`rounded-[2rem] p-6 md:p-8 text-white flex flex-col md:flex-row items-center gap-6 transition-all ${idUploaded ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${idUploaded ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                                {uploadingId ? <Loader2 size={32} className="animate-spin" /> : idUploaded ? <CheckCircle2 size={32} /> : <Upload size={32} />}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h4 className="text-xl font-bold mb-1">{idUploaded ? 'Documento Adjuntado' : 'Carga de Identificación'}</h4>
                                <p className="text-blue-100 text-sm">
                                    {idUploaded
                                        ? `Archivo: ${idFile?.name}`
                                        : 'Adjunta el pasaporte del responsable en formato PDF o Imagen.'}
                                </p>
                            </div>
                            <div className="relative w-full md:w-auto">
                                <input
                                    type="file"
                                    id="id-upload"
                                    className="hidden"
                                    onChange={handleUploadId}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    disabled={uploadingId || idUploaded}
                                />
                                <label
                                    htmlFor="id-upload"
                                    className={`block text-center px-6 py-3 bg-white font-black rounded-xl transition-colors whitespace-nowrap cursor-pointer ${uploadingId || idUploaded ? 'opacity-50 cursor-default text-slate-400' : 'text-blue-600 hover:bg-blue-50'
                                        }`}
                                >
                                    {uploadingId ? 'Subiendo...' : idUploaded ? '¡Listo!' : 'Adjuntar Documento'}
                                </label>
                            </div>
                        </div>

                        {/* DECLARACIÓN LEGAL LLC */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 transition-all hover:border-slate-300">
                            <label className="flex items-start gap-4 cursor-pointer group">
                                <div className="relative flex items-center mt-1">
                                    <input
                                        type="checkbox"
                                        className="peer sr-only"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                    />
                                    <div className="w-6 h-6 border-2 border-slate-300 rounded md:rounded-lg peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                        <Check size={14} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-900 text-sm mb-1">Confirmación de Autoridad y Veracidad</p>
                                    <p className="text-xs text-slate-500 leading-relaxed text-justify">
                                        Certifico que tengo la autoridad legal para presentar este documento y que la información proporcionada es verdadera y correcta. Entiendo que la presentación de documentos falsos ante una oficina estatal es un delito. Autorizo a <strong>Open LLC USA</strong> a presentar los Artículos de Organización en mi nombre.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    const totalSteps = steps.length

    return (
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">

            {/* HEADER DEL WIZARD */}
            <div className={`p-6 md:p-12 text-white relative overflow-hidden ${esEIN ? 'bg-indigo-900' : 'bg-slate-900'}`}>
                <div className="relative z-10">
                    <span className="inline-block px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-full mb-4 border border-white/20">
                        {esEIN ? 'SOLICITUD DE EIN ANTE EL IRS' : 'CONFIGURACIÓN LEGAL NECESARIA'}
                    </span>
                    <h2 className="text-2xl md:text-4xl font-black mb-2">¡Hola, {nombreUsuario}! 🎉</h2>
                    <p className="text-white/70 text-base md:text-lg max-w-xl">
                        {esEIN
                            ? 'Necesitamos algunos datos específicos para tramitar tu número EIN ante el IRS de forma rápida y segura.'
                            : 'Tu pago ha sido confirmado. Ahora solo necesitamos completar los detalles legales para constituir tu empresa hoy mismo.'
                        }
                    </p>
                </div>

                {/* Adorno visual */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            {/* STEPPER */}
            <div className="px-4 py-6 md:px-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center overflow-x-auto no-scrollbar gap-4">
                {steps.map((s, idx) => {
                    const Icon = s.icon
                    const isActive = step === s.id
                    const isPast = step > s.id
                    return (
                        <div key={s.id} className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' :
                                isPast ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                                }`}>
                                {isPast ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                            </div>
                            <span className={`text-xs md:text-sm font-bold whitespace-nowrap ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                                {s.label}
                            </span>
                            {idx !== steps.length - 1 && (
                                <div className="w-4 md:w-8 h-px bg-slate-200 mx-1 md:mx-2 hidden sm:block"></div>
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="p-6 md:p-12">
                {esEIN ? renderStepEIN(step) : renderStepLLC(step)}

                <div className="mt-12 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-8 text-slate-900">
                    {step > 1 ? (
                        <button
                            onClick={handleBack}
                            disabled={loading}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-slate-600 font-bold hover:text-slate-900 transition-all active:scale-95"
                        >
                            <ArrowLeft size={18} />
                            Atrás
                        </button>
                    ) : (
                        <div className="hidden sm:block" />
                    )}

                    {step < totalSteps ? (
                        <button
                            onClick={handleNext}
                            className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95"
                        >
                            Continuar
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !termsAccepted}
                            className={`w-full sm:w-auto group flex items-center justify-center gap-3 px-12 py-5 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 ${loading || !termsAccepted
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
                                }`}
                        >
                            {loading ? 'Guardando...' : 'Confirmar y Enviar'}
                            <CheckCircle2 size={20} />
                        </button>
                    )}
                </div>
            </div>


            {/* FOOTER DE SEGURIDAD */}
            <div className="bg-slate-50 px-6 py-6 md:py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
                <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Encriptación AES-256
                </div>
                <div className="hidden sm:block w-px h-4 bg-slate-200" />
                <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Globe size={14} className="text-blue-500" />
                    Cumplimiento Internacional
                </div>
            </div>
        </div>
    )
}
