'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowRight, ArrowLeft, CheckCircle, FileText, DollarSign, Building, User } from 'lucide-react'
import SignaturePad from '@/components/ui/SignaturePad'

// Tipos para el formulario 5472
type Form5472Data = {
    // Año fiscal
    taxYear: string

    // Parte I: Reporte de la Corporación (LLC)
    llcName: string
    llcEin: string
    llcAddress: string
    llcCity: string
    llcState: string
    llcZip: string
    formationDate: string

    // Parte II: Accionista Extranjero (Dueño)
    ownerName: string
    ownerAddress: string
    ownerCity: string
    ownerCountry: string
    ownerTaxId: string // DNI/NIF/Passport o ITIN
    ownerReferenceIdType: string // 'Foreign Tax ID' | 'ITIN'

    // Parte IV: Transacciones Monetarias
    capitalContributionCash: number
    capitalContributionProperty: number
    capitalDistributionCash: number
    capitalDistributionProperty: number

    // Parte V: Costos de Formación
    formationCost: number

    // Parte VI: Declaraciones Juradas (Supporting Statements)
    hasTradeOrBusiness: boolean // Default: false
    isDisregardedEntity: boolean // Default: true

    // Firma y Declaración
    signerName: string // Nombre del firmante
    signerTitle: string // Cargo (ej: Member, Manager, President)
    signatureDate: string // Fecha de firma
    signatureDataUrl: string | null // Imagen de la firma en base64
}

const steps = [
    { id: 1, title: 'Datos de la LLC', icon: Building, description: 'Información de tu empresa en USA' },
    { id: 2, title: 'Datos del Dueño', icon: User, description: 'Información del socio extranjero' },
    { id: 3, title: 'Transacciones', icon: DollarSign, description: 'Movimientos de capital y dinero' },
    { id: 4, title: 'Revisión', icon: FileText, description: 'Confirma la información' }
]

export default function Form5472OnboardingPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)

    const currentYear = new Date().getFullYear()
    const [formData, setFormData] = useState<Form5472Data>({
        taxYear: String(currentYear - 1),
        llcName: '',
        llcEin: '',
        llcAddress: '',
        llcCity: '',
        llcState: '',
        llcZip: '',
        formationDate: '',
        ownerName: '',
        ownerAddress: '',
        ownerCity: '',
        ownerCountry: '',
        ownerTaxId: '',
        ownerReferenceIdType: 'Foreign Tax ID',
        capitalContributionCash: 0,
        capitalContributionProperty: 0,
        capitalDistributionCash: 0,
        capitalDistributionProperty: 0,
        formationCost: 0,
        hasTradeOrBusiness: false,
        isDisregardedEntity: true,
        signerName: '',
        signerTitle: 'Member',
        signatureDate: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
        signatureDataUrl: null
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }))
    }

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(prev => prev + 1)
            window.scrollTo(0, 0)
        } else {
            handleSubmit()
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1)
            window.scrollTo(0, 0)
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            console.log('Iniciando proceso de pago fiscal...', formData)

            const res = await fetch('/api/orders/tax-filing/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taxData: formData })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Error al procesar el pedido')
            }

            if (data.url) {
                // Redirigir a Stripe
                window.location.href = data.url
            } else {
                throw new Error('No se recibió URL de pago')
            }

        } catch (error: any) {
            console.error('Error:', error)
            alert(error.message || 'Hubo un error al procesar su solicitud. Por favor intente nuevamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-900">Formulario 5472 + 1120</h1>
                    <p className="mt-2 text-slate-600">Declaración Anual para LLCs de Propiedad Extranjera</p>
                </div>

                {/* Progress Bar */}
                <nav aria-label="Progress" className="mb-12">
                    <ol role="list" className="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200 lg:bg-white">
                        {steps.map((step, stepIdx) => (
                            <li key={step.id} className="relative overflow-hidden lg:flex-1">
                                <div className={`border-b-4 ${step.id <= currentStep ? 'border-blue-600' : 'border-gray-200'} py-2 px-4 text-center lg:border-b-0 lg:border-t-4`}>
                                    <span
                                        className={`text-xs font-bold uppercase tracking-wide ${step.id <= currentStep ? 'text-blue-600' : 'text-gray-500'
                                            }`}
                                    >
                                        Paso {step.id}
                                    </span>
                                    <span className="text-sm font-medium text-gray-900 block">{step.title}</span>
                                </div>
                            </li>
                        ))}
                    </ol>
                </nav>

                {/* Form Content */}
                <div className="bg-white shadow rounded-lg p-8">

                    {/* Paso 1: Datos LLC */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-slate-900 border-b pb-2 flex items-center gap-2">
                                <Building className="text-blue-600" size={20} /> Datos de la LLC
                            </h2>

                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-2">
                                    <label htmlFor="taxYear" className="block text-sm font-medium text-slate-700">Año Fiscal a Declarar</label>
                                    <select
                                        name="taxYear"
                                        id="taxYear"
                                        value={formData.taxYear}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                                    >
                                        <option value={String(currentYear - 1)}>{currentYear - 1}</option>
                                        <option value={String(currentYear - 2)}>{currentYear - 2}</option>
                                        <option value={String(currentYear - 3)}>{currentYear - 3}</option>
                                    </select>
                                    <p className="mt-1 text-xs text-gray-500">Normalmente se declara el año anterior.</p>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="llcName" className="block text-sm font-medium text-slate-700">Nombre Legal de la LLC</label>
                                    <input
                                        type="text"
                                        name="llcName"
                                        id="llcName"
                                        value={formData.llcName}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                                        required
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="llcEin" className="block text-sm font-medium text-slate-700">EIN (Employer ID)</label>
                                    <input
                                        type="text"
                                        name="llcEin"
                                        id="llcEin"
                                        placeholder="XX-XXXXXXX"
                                        value={formData.llcEin}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                                        required
                                    />
                                </div>

                                <div className="sm:col-span-6">
                                    <label htmlFor="llcAddress" className="block text-sm font-medium text-slate-700">Dirección Física en USA (o Principal)</label>
                                    <input
                                        type="text"
                                        name="llcAddress"
                                        id="llcAddress"
                                        value={formData.llcAddress}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                                        required
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="llcCity" className="block text-sm font-medium text-slate-700">Ciudad</label>
                                    <input type="text" name="llcCity" value={formData.llcCity} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="llcState" className="block text-sm font-medium text-slate-700">Estado</label>
                                    <select name="llcState" value={formData.llcState} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border">
                                        <option value="">Selecciona...</option>
                                        <option value="WY">Wyoming</option>
                                        <option value="DE">Delaware</option>
                                        <option value="NM">New Mexico</option>
                                        <option value="FL">Florida</option>
                                        {/* Más estados... */}
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="llcZip" className="block text-sm font-medium text-slate-700">Código Postal (ZIP)</label>
                                    <input type="text" name="llcZip" value={formData.llcZip} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border" />
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="formationDate" className="block text-sm font-medium text-slate-700">Fecha de Formación</label>
                                    <input type="date" name="formationDate" value={formData.formationDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Paso 2: Datos Dueño */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-slate-900 border-b pb-2 flex items-center gap-2">
                                <User className="text-blue-600" size={20} /> Datos del Dueño (Extranjero)
                            </h2>

                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-6">
                                    <label htmlFor="ownerName" className="block text-sm font-medium text-slate-700">Nombre Completo del Dueño</label>
                                    <input
                                        type="text"
                                        name="ownerName"
                                        id="ownerName"
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                                    />
                                </div>

                                <div className="sm:col-span-6">
                                    <label htmlFor="ownerAddress" className="block text-sm font-medium text-slate-700">Dirección Residencial</label>
                                    <input
                                        type="text"
                                        name="ownerAddress"
                                        value={formData.ownerAddress}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="ownerCity" className="block text-sm font-medium text-slate-700">Ciudad</label>
                                    <input
                                        type="text"
                                        name="ownerCity"
                                        id="ownerCity"
                                        placeholder="Ej: Madrid, Buenos Aires, etc."
                                        value={formData.ownerCity}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="ownerCountry" className="block text-sm font-medium text-slate-700">País de Residencia</label>
                                    <input type="text" name="ownerCountry" value={formData.ownerCountry} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border" />
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="ownerReferenceIdType" className="block text-sm font-medium text-slate-700">Tipo de Identificación Fiscal</label>
                                    <select
                                        name="ownerReferenceIdType"
                                        id="ownerReferenceIdType"
                                        value={formData.ownerReferenceIdType}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                                    >
                                        <option value="Foreign Tax ID">Foreign Tax ID (DNI/NIF/Pasaporte)</option>
                                        <option value="ITIN">ITIN (USA)</option>
                                    </select>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Selecciona &quot;Foreign Tax ID&quot; si usas tu DNI, NIF o Pasaporte. Selecciona &quot;ITIN&quot; si tienes número de contribuyente individual (ITIN) emitido por el IRS.
                                    </p>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="ownerTaxId" className="block text-sm font-medium text-slate-700">
                                        {formData.ownerReferenceIdType === 'ITIN' ? 'Número ITIN' : 'Número de Identificación Fiscal'}
                                    </label>
                                    <input
                                        type="text"
                                        name="ownerTaxId"
                                        value={formData.ownerTaxId}
                                        onChange={handleChange}
                                        placeholder={formData.ownerReferenceIdType === 'ITIN' ? '9XX-XX-XXXX' : 'Ej: 12345678X'}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        {formData.ownerReferenceIdType === 'ITIN'
                                            ? 'Tu número ITIN otorgado por el IRS.'
                                            : 'Número de identificación fiscal de tu país (DNI, NIF, Pasaporte, etc.).'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Paso 3: Transacciones */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-slate-900 border-b pb-2 flex items-center gap-2">
                                <DollarSign className="text-blue-600" size={20} /> Transacciones Reportables
                            </h2>

                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-700">
                                            Debes declarar cualquier movimiento de capital (dinero o bienes) entre tú y la LLC durante el año fiscal.
                                            Si solo abriste la cuenta bancaria y no operaste, pon la cantidad depositada como "Capital Contribution".
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700">Aportación de Capital (Dinero)</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                name="capitalContributionCash"
                                                value={formData.capitalContributionCash}
                                                onChange={handleChange}
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-3 border"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700">Distribución de Capital (Retiros)</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                name="capitalDistributionCash"
                                                value={formData.capitalDistributionCash}
                                                onChange={handleChange}
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-3 border"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700">Costos de Formación (Primer año)</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                name="formationCost"
                                                value={formData.formationCost}
                                                onChange={handleChange}
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-3 border"
                                                placeholder="0.00"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">Gastos pagados para crear la LLC (Estado, Agente, Servicios).</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Paso 4: Revisión */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-slate-900 border-b pb-2 flex items-center gap-2">
                                <FileText className="text-blue-600" size={20} /> Revisión Final
                            </h2>

                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <dl className="divide-y divide-gray-200">
                                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-blue-50">
                                        <dt className="text-sm font-medium text-blue-700">Año Fiscal</dt>
                                        <dd className="mt-1 text-sm font-bold text-blue-900 sm:mt-0 sm:col-span-2">{formData.taxYear}</dd>
                                    </div>
                                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">LLC</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formData.llcName} ({formData.llcEin})</dd>
                                    </div>
                                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                                        <dt className="text-sm font-medium text-gray-500">Dirección LLC</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formData.llcAddress}, {formData.llcCity}, {formData.llcState} {formData.llcZip}</dd>
                                    </div>
                                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Fecha Formación</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formData.formationDate}</dd>
                                    </div>
                                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                                        <dt className="text-sm font-medium text-gray-500">Dueño</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formData.ownerName} — {formData.ownerCity}, {formData.ownerCountry}</dd>
                                    </div>
                                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">ID Fiscal</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formData.ownerTaxId} ({formData.ownerReferenceIdType})</dd>
                                    </div>
                                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                                        <dt className="text-sm font-medium text-gray-500">Aportación Capital</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${formData.capitalContributionCash.toFixed(2)}</dd>
                                    </div>
                                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Distribución Capital</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${formData.capitalDistributionCash.toFixed(2)}</dd>
                                    </div>
                                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                                        <dt className="text-sm font-medium text-gray-500">Costo Formación</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${formData.formationCost.toFixed(2)}</dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Sección de Firma */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <FileText className="text-blue-600" size={18} />
                                    Firma y Declaración
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Esta información aparecerá en la sección de firma del formulario 1120.
                                </p>

                                {/* Canvas de Firma */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Firma <span className="text-red-500">*</span>
                                    </label>
                                    <SignaturePad
                                        onChange={(dataUrl) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                signatureDataUrl: dataUrl,
                                                signerName: dataUrl ? 'Firmado' : '' // Marcador para validación
                                            }))
                                        }}
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Dibuja tu firma usando el ratón o el dedo</p>
                                </div>

                                {/* Campos de Cargo y Fecha */}
                                <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-3">
                                    <div className="sm:col-span-2">
                                        <label htmlFor="signerTitle" className="block text-sm font-medium text-slate-700">
                                            Cargo/Título <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="signerTitle"
                                            id="signerTitle"
                                            value={formData.signerTitle}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                                        >
                                            <option value="Member">Member</option>
                                            <option value="Manager">Manager</option>
                                            <option value="President">President</option>
                                            <option value="CEO">CEO</option>
                                            <option value="Treasurer">Treasurer</option>
                                        </select>
                                        <p className="mt-1 text-xs text-gray-500">Tu cargo en la LLC</p>
                                    </div>

                                    <div className="sm:col-span-1">
                                        <label htmlFor="signatureDate" className="block text-sm font-medium text-slate-700">
                                            Fecha <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="signatureDate"
                                            id="signatureDate"
                                            value={formData.signatureDate}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className="flex items-start p-4 bg-yellow-50 rounded-md">
                                <div className="flex-shrink-0">
                                    <CheckCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Confirmación Legal</h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>
                                            Declaro bajo pena de perjurio que la información proporcionada es verdadera y completa.
                                            Entiendo que Open LLC USA preparará los formularios basándose en estos datos, pero la responsabilidad final de la presentación recae sobre mí.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Botones de Navegación */}
                    <div className="mt-10 flex justify-between pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={currentStep === 1 || loading}
                            className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${currentStep === 1 ? 'opacity-50 cursor-not-allowed hidden' : ''}`}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Atrás
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={loading}
                            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    Procesando...
                                </>
                            ) : currentStep === steps.length ? (
                                <>
                                    Confirmar y Pagar
                                    <CheckCircle className="ml-2 h-4 w-4" />
                                </>
                            ) : (
                                <>
                                    Siguiente
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div >
        </div >
    )
}
