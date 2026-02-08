'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    User, Building2, ShieldEllipsis, FileCheck,
    ArrowRight, ArrowLeft, CheckCircle2, Upload,
    Info, ShieldCheck, Mail, MapPin, Globe, CreditCard, Loader2
} from 'lucide-react'

type Props = {
    pedidoId: string
    nombreUsuario: string
}

export default function OnboardingWizard({ pedidoId, nombreUsuario }: Props) {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)

    // Estado para todos los datos del checklist
    const [formData, setFormData] = useState({
        // Miembro
        member_nombre_completo: '',
        member_fecha_nacimiento: '',
        member_nacionalidad: '',
        member_residencia_pais: '',
        member_direccion: '',
        member_tax_id_tipo: 'foreign', // ssn, itin, foreign
        member_tax_id_valor: '',

        // Empresa
        empresa_designador: 'LLC',
        empresa_proposito: 'Any lawful business',
        empresa_tipo_gestion: 'Member-Managed',
        empresa_sitio_web: '',

        // IRS
        irs_responsible_party: '',
        irs_actividad_principal: '',
        irs_fecha_inicio: new Date().toISOString().split('T')[0],
    })

    const [idFile, setIdFile] = useState<File | null>(null)
    const [uploadingId, setUploadingId] = useState(false)
    const [idUploaded, setIdUploaded] = useState(false)

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const validateStep = () => {
        if (step === 1) {
            if (!formData.member_nombre_completo.trim() ||
                !formData.member_fecha_nacimiento ||
                !formData.member_nacionalidad.trim() ||
                !formData.member_direccion.trim()) {
                alert('Por favor, completa todos los campos del propietario.')
                return false
            }
        }
        if (step === 2) {
            if (!formData.empresa_proposito.trim()) {
                alert('Por favor, indica el propósito de la empresa.')
                return false
            }
        }
        return true
    }

    const handleNext = () => {
        if (validateStep()) {
            setStep(step + 1)
        }
    }
    const handleBack = () => setStep(step - 1)

    const handleUploadId = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIdFile(file)
        setUploadingId(true)

        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch(`/api/pedidos/${pedidoId}/upload-id`, {
                method: 'POST',
                body: formData
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
        if (!idUploaded && step === 4) {
            alert('Por favor, adjunta tu documento de identidad antes de finalizar.')
            return
        }
        setLoading(true)
        try {
            const res = await fetch(`/api/pedidos/${pedidoId}/onboarding`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
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

    const steps = [
        { id: 1, label: 'Propietario', icon: User },
        { id: 2, label: 'Empresa', icon: Building2 },
        { id: 3, label: 'Gestión y Tax', icon: ShieldEllipsis },
        { id: 4, label: 'Documentación', icon: FileCheck },
    ]

    return (
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">

            {/* HEADER DEL WIZARD */}
            <div className="bg-slate-900 p-6 md:p-12 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full mb-4 border border-blue-500/30">
                        CONFIGURACIÓN LEGAL NECESARIA
                    </span>
                    <h2 className="text-2xl md:text-4xl font-black mb-2">¡Hola, {nombreUsuario}! 🎉</h2>
                    <p className="text-slate-400 text-base md:text-lg max-w-xl">
                        Tu pago ha sido confirmado. Ahora solo necesitamos completar los detalles legales para constituir tu empresa hoy mismo.
                    </p>
                </div>

                {/* Adorno visual */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
                <div className="absolute right-10 bottom-10 opacity-10">
                    <Building2 size={80} className="md:size-[120px]" />
                </div>
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

                {/* PASO 1: DATOS PERSONALES */}
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Información del Propietario</h3>
                            <p className="text-slate-500">Estos datos deben coincidir exactamente con tu pasaporte.</p>
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

                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
                            <Info className="text-blue-600 flex-shrink-0" size={20} />
                            <p className="text-sm text-blue-700 leading-relaxed">
                                Toda la información se trata de forma confidencial y se utiliza exclusivamente para el registro ante las autoridades de Estados Unidos.
                            </p>
                        </div>
                    </div>
                )}

                {/* PASO 2: DATOS DE LA EMPRESA */}
                {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Detalles de la LLC</h3>
                            <p className="text-slate-500">Configura la identidad legal de tu nueva entidad.</p>
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
                                <p className="text-[10px] text-slate-400 ml-2 uppercase font-bold tracking-widest mt-1">Sufijo después del nombre de tu empresa</p>
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
                )}

                {/* PASO 3: GESTIÓN Y FISCALIDAD */}
                {step === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Estructura y Gestión</h3>
                            <p className="text-slate-500">Define quién toma las decisiones y los detalles fiscales federales.</p>
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
                )}

                {/* PASO 4: DOCUMENTACIÓN Y CIERRE */}
                {step === 4 && (
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
                                <span className="text-slate-500 font-medium">Identificación Fiscal</span>
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
                                        : 'Adjunta tu pasaporte en formato PDF o Imagen (JPG/PNG).'}
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
                    </div>
                )}

                {/* BOTONES DE NAVEGACIÓN */}
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

                    {step < 4 ? (
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
                            disabled={loading}
                            className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95"
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
