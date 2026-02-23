'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowRight, ArrowLeft, CheckCircle, FileText, DollarSign, Building, User } from 'lucide-react'
import SignaturePad from '@/components/ui/SignaturePad'

// Tipos para el formulario 5472
type Form5472Data = {
    // Año fiscal
    taxYear: string

    // ========== PART I: Reporting Corporation ==========
    // 1a - Name, address, and identifying number of reporting corporation
    llcName: string
    llcAddress: string
    llcCity: string
    llcState: string
    llcZip: string
    llcEin: string

    // 1b - Employer identification number (if different from 1a)
    llcEinAlternate?: string

    // 1d - Country of incorporation or organization
    llcCountryOfIncorporation: string // Default: "United States"

    // 1e - Country(ies) under whose laws the reporting corporation files an income tax return as a resident
    llcTaxResidenceCountries: string // Default: "United States"

    // 1f - Principal business activity code number
    llcActivityCode: string // Default: "454110"

    // 1g - Principal business activity
    llcActivityDescription: string // Default: "E-Commerce Retail"

    // 1h - Date of organization
    formationDate: string

    // 1j - Check if the reporting corporation is a foreign-owned U.S. DE
    isForeignOwnedDE: boolean // Default: true

    // 1k - If 1j is checked, enter the name of the sole owner
    soleOwnerName: string

    // 1L - If 1j is checked, enter the EIN or reference ID number of the sole owner
    soleOwnerEin?: string
    soleOwnerReferenceId?: string

    // 1m - If 1j is checked, check if the sole owner is a direct owner
    isDirectOwner: boolean // Default: true

    // 1n - If 1j is checked, check if the sole owner is a U.S. person
    isOwnerUSPerson: boolean // Default: false

    // 1o - If 1j is checked, check if the sole owner is a foreign person
    isOwnerForeignPerson: boolean // Default: true

    // 2 - Total assets at end of the year
    totalAssets: number // Default: 0

    // 3 - Did the reporting corporation have any related party transactions?
    hasRelatedPartyTransactions: boolean // Default: true

    // ========== PART II: 25% Foreign Shareholder ==========
    // 4a - Name and address of 25% foreign shareholder
    ownerName: string
    ownerAddress: string
    ownerCity: string
    ownerCountry: string

    // 4b(3) - Reference ID number
    ownerTaxId: string
    ownerReferenceIdType: string // 'Foreign Tax ID' | 'ITIN'

    // 4c - Principal country(ies) where business is conducted
    ownerBusinessCountries: string

    // 4d - Country(ies) under whose laws the 25% foreign shareholder files an income tax return as a resident
    ownerTaxResidenceCountries: string

    // 4e - Direct or indirect
    ownershipType: 'Direct' | 'Indirect' // Default: 'Direct'

    // ========== PART III: Related Party ==========
    // 8a - Name and address of related party
    relatedPartyName?: string
    relatedPartyAddress?: string
    relatedPartyCity?: string
    relatedPartyCountry?: string

    // 8b(3) - Reference ID number
    relatedPartyTaxId?: string
    relatedPartyReferenceIdType?: string

    // 8c - Principal country(ies) where business is conducted
    relatedPartyBusinessCountries?: string

    // 8d - Country(ies) under whose laws the related party files an income tax return as a resident
    relatedPartyTaxResidenceCountries?: string

    // 8e - Relationship
    relatedPartyRelationship?: string // e.g., "25% Foreign Shareholder"

    // 8f - Direct or indirect
    relatedPartyOwnershipType?: 'Direct' | 'Indirect'

    // 8g - Check if the related party is a U.S. person
    isRelatedPartyUSPerson?: boolean

    // ========== PART IV: Monetary Transactions ==========
    capitalContributionCash: number
    capitalContributionProperty: number
    capitalDistributionCash: number
    capitalDistributionProperty: number

    // ========== PART V: Additional Information ==========
    formationCost: number
    hasTradeOrBusiness: boolean // Default: false
    isDisregardedEntity: boolean // Default: true

    // ========== PART VII: Additional Questions ==========
    // 37 - Did the reporting corporation make payments of interest to the related party?
    paidInterestToRelatedParty: boolean // Default: false

    // 39 - Did the reporting corporation make payments of rents to the related party?
    paidRentsToRelatedParty: boolean // Default: false

    // 40a - Did the reporting corporation make payments of royalties to the related party?
    paidRoyaltiesToRelatedParty: boolean // Default: false

    // 41a - Did the reporting corporation have any cost sharing arrangements?
    hasCostSharingArrangements: boolean // Default: false

    // 42a - Did the reporting corporation make payments for services to the related party?
    paidServicesToRelatedParty: boolean // Default: false

    // 42b - Did the reporting corporation receive payments for services from the related party?
    receivedServicesFromRelatedParty: boolean // Default: false

    // 43a - Did the reporting corporation have any other transactions with the related party?
    hasOtherTransactions: boolean // Default: false

    // ========== PART VIII: Base Erosion Payments ==========
    // 45 - Is the reporting corporation a base erosion taxpayer?
    isBaseErosionTaxpayer: boolean // Default: false

    // ========== Firma y Declaración ==========
    signerName: string
    signerTitle: string
    signatureDate: string
    signatureDataUrl: string | null
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

        // PART I: Reporting Corporation
        llcName: '',
        llcAddress: '',
        llcCity: '',
        llcState: '',
        llcZip: '',
        llcEin: '',
        llcEinAlternate: '',
        llcCountryOfIncorporation: 'United States',
        llcTaxResidenceCountries: '', // Vacío - puede variar según el caso
        llcActivityCode: '454110',
        llcActivityDescription: 'E-Commerce Retail',
        formationDate: '',
        isForeignOwnedDE: true,
        soleOwnerName: '',
        soleOwnerEin: '',
        soleOwnerReferenceId: '',
        isDirectOwner: true,
        isOwnerUSPerson: false,
        isOwnerForeignPerson: true,
        totalAssets: 0,
        hasRelatedPartyTransactions: true,

        // PART II: 25% Foreign Shareholder
        ownerName: '',
        ownerAddress: '',
        ownerCity: '',
        ownerCountry: '',
        ownerTaxId: '',
        ownerReferenceIdType: 'Foreign Tax ID',
        ownerBusinessCountries: '',
        ownerTaxResidenceCountries: '',
        ownershipType: 'Direct',

        // PART III: Related Party (optional, usually same as owner for single-member LLCs)
        relatedPartyName: '',
        relatedPartyAddress: '',
        relatedPartyCity: '',
        relatedPartyCountry: '',
        relatedPartyTaxId: '',
        relatedPartyReferenceIdType: '',
        relatedPartyBusinessCountries: '',
        relatedPartyTaxResidenceCountries: '',
        relatedPartyRelationship: '25% Foreign Shareholder',
        relatedPartyOwnershipType: 'Direct',
        isRelatedPartyUSPerson: false,

        // PART IV: Monetary Transactions
        capitalContributionCash: 0,
        capitalContributionProperty: 0,
        capitalDistributionCash: 0,
        capitalDistributionProperty: 0,

        // PART V: Additional Information
        formationCost: 0,
        hasTradeOrBusiness: false,
        isDisregardedEntity: true,

        // PART VII: Additional Questions
        paidInterestToRelatedParty: false,
        paidRentsToRelatedParty: false,
        paidRoyaltiesToRelatedParty: false,
        hasCostSharingArrangements: false,
        paidServicesToRelatedParty: false,
        receivedServicesFromRelatedParty: false,
        hasOtherTransactions: false,

        // PART VIII: Base Erosion Payments
        isBaseErosionTaxpayer: false,

        // Signature
        signerName: '',
        signerTitle: 'sole member',
        signatureDate: new Date().toISOString().split('T')[0],
        signatureDataUrl: null
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }))
    }

    // Validación de campos requeridos por paso
    const validateStep = (step: number): string | null => {
        if (step === 1) {
            if (!formData.llcName.trim()) return 'El Nombre Legal de la LLC es obligatorio.'
            if (!formData.llcEin.trim()) return 'El EIN (Employer ID) es obligatorio.'
            if (!formData.llcAddress.trim()) return 'La Dirección de la LLC es obligatoria.'
            if (!formData.llcCity.trim()) return 'La Ciudad de la LLC es obligatoria.'
            if (!formData.llcState) return 'El Estado de la LLC es obligatorio.'
            if (!formData.llcZip.trim()) return 'El Código Postal (ZIP) es obligatorio.'
            if (!formData.formationDate) return 'La Fecha de Formación es obligatoria.'
            if (!formData.llcActivityCode.trim()) return 'El Código de Actividad (NAICS) es obligatorio.'
            if (!formData.llcActivityDescription.trim()) return 'La Descripción de Actividad Principal es obligatoria.'
        }
        if (step === 2) {
            if (!formData.ownerName.trim()) return 'El Nombre Completo del Dueño es obligatorio.'
            if (!formData.ownerAddress.trim()) return 'La Dirección del Dueño es obligatoria.'
            if (!formData.ownerCity.trim()) return 'La Ciudad del Dueño es obligatoria.'
            if (!formData.ownerCountry.trim()) return 'El País de Residencia del Dueño es obligatorio.'
            if (!formData.ownerTaxId.trim()) return 'El Número de Identificación Fiscal del Dueño es obligatorio.'
            if (!formData.ownerTaxResidenceCountries.trim()) return 'El País de Residencia Fiscal del Dueño es obligatorio.'
        }
        // Paso 3 (Transacciones): todas las cantidades son opcionales — se admite 0
        if (step === 4) {
            if (!formData.signatureDataUrl && !formData.signerName.trim()) return 'La firma es obligatoria.'
            if (!formData.signerTitle.trim()) return 'El Cargo/Título es obligatorio.'
            if (!formData.signatureDate) return 'La Fecha de firma es obligatoria.'
        }
        return null
    }

    const handleNext = () => {
        const error = validateStep(currentStep)
        if (error) {
            alert(error)
            return
        }
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

                                {/* Campos adicionales Part I */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="llcActivityCode" className="block text-sm font-medium text-slate-700">Código de Actividad (NAICS)</label>
                                    <input
                                        type="text"
                                        name="llcActivityCode"
                                        id="llcActivityCode"
                                        value={formData.llcActivityCode}
                                        onChange={handleChange}
                                        placeholder="454110"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Código NAICS de tu actividad principal</p>
                                </div>

                                <div className="sm:col-span-6">
                                    <label htmlFor="llcActivityDescription" className="block text-sm font-medium text-slate-700">Descripción de Actividad Principal</label>
                                    <input
                                        type="text"
                                        name="llcActivityDescription"
                                        id="llcActivityDescription"
                                        value={formData.llcActivityDescription}
                                        onChange={handleChange}
                                        placeholder="E-Commerce Retail"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="llcCountryOfIncorporation" className="block text-sm font-medium text-slate-700">País de Incorporación</label>
                                    <input
                                        type="text"
                                        name="llcCountryOfIncorporation"
                                        id="llcCountryOfIncorporation"
                                        value={formData.llcCountryOfIncorporation}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                                        readOnly
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="llcTaxResidenceCountries" className="block text-sm font-medium text-slate-700">País(es) de Residencia Fiscal</label>
                                    <input
                                        type="text"
                                        name="llcTaxResidenceCountries"
                                        id="llcTaxResidenceCountries"
                                        value={formData.llcTaxResidenceCountries}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="totalAssets" className="block text-sm font-medium text-slate-700">Total de Activos al Final del Año ($)</label>
                                    <input
                                        type="number"
                                        name="totalAssets"
                                        id="totalAssets"
                                        value={formData.totalAssets}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Valor total de los activos de la LLC</p>
                                </div>

                                <div className="sm:col-span-3">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">¿Tuvo transacciones con partes relacionadas?</label>
                                    <div className="flex gap-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="hasRelatedPartyTransactions"
                                                value="true"
                                                checked={formData.hasRelatedPartyTransactions === true}
                                                onChange={(e) => setFormData(prev => ({ ...prev, hasRelatedPartyTransactions: true }))}
                                                className="form-radio h-4 w-4 text-blue-600"
                                            />
                                            <span className="ml-2">Sí</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="hasRelatedPartyTransactions"
                                                value="false"
                                                checked={formData.hasRelatedPartyTransactions === false}
                                                onChange={(e) => setFormData(prev => ({ ...prev, hasRelatedPartyTransactions: false }))}
                                                className="form-radio h-4 w-4 text-blue-600"
                                            />
                                            <span className="ml-2">No</span>
                                        </label>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">Normalmente "Sí" si eres el único dueño</p>
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

                                {/* Campos adicionales Part II */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="ownerBusinessCountries" className="block text-sm font-medium text-slate-700">País(es) donde conduce negocios</label>
                                    <input
                                        type="text"
                                        name="ownerBusinessCountries"
                                        id="ownerBusinessCountries"
                                        value={formData.ownerBusinessCountries}
                                        onChange={handleChange}
                                        placeholder="Ej: Spain, United States"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">País(es) donde realizas tu actividad comercial</p>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="ownerTaxResidenceCountries" className="block text-sm font-medium text-slate-700">País(es) de Residencia Fiscal del Dueño</label>
                                    <input
                                        type="text"
                                        name="ownerTaxResidenceCountries"
                                        id="ownerTaxResidenceCountries"
                                        value={formData.ownerTaxResidenceCountries}
                                        onChange={handleChange}
                                        placeholder="Ej: Spain"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">País donde presentas tu declaración de impuestos</p>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="ownershipType" className="block text-sm font-medium text-slate-700">Tipo de Propiedad</label>
                                    <select
                                        name="ownershipType"
                                        id="ownershipType"
                                        value={formData.ownershipType}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                                    >
                                        <option value="Direct">Direct (Directa)</option>
                                        <option value="Indirect">Indirect (Indirecta)</option>
                                    </select>
                                    <p className="mt-1 text-xs text-gray-500">Normalmente "Direct" si eres el dueño directo</p>
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

                            {/* Part VII: Additional Questions */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <FileText className="text-blue-600" size={18} />
                                    Preguntas Adicionales (Part VII)
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Para la mayoría de LLCs pasivas (sin actividad comercial en USA), todas las respuestas son "No".
                                </p>

                                <div className="space-y-4">
                                    {/* Question 37 */}
                                    <div className="flex items-start justify-between border-b pb-3">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-slate-700">
                                                ¿Pagó intereses a partes relacionadas?
                                            </label>
                                            <p className="text-xs text-gray-500 mt-1">Question 37: Interest payments</p>
                                        </div>
                                        <div className="flex gap-3 ml-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="paidInterestToRelatedParty"
                                                    checked={formData.paidInterestToRelatedParty === true}
                                                    onChange={() => setFormData(prev => ({ ...prev, paidInterestToRelatedParty: true }))}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-sm">Sí</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="paidInterestToRelatedParty"
                                                    checked={formData.paidInterestToRelatedParty === false}
                                                    onChange={() => setFormData(prev => ({ ...prev, paidInterestToRelatedParty: false }))}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-sm">No</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Question 39 */}
                                    <div className="flex items-start justify-between border-b pb-3">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-slate-700">
                                                ¿Pagó rentas/alquileres a partes relacionadas?
                                            </label>
                                            <p className="text-xs text-gray-500 mt-1">Question 39: Rent payments</p>
                                        </div>
                                        <div className="flex gap-3 ml-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="paidRentsToRelatedParty"
                                                    checked={formData.paidRentsToRelatedParty === true}
                                                    onChange={() => setFormData(prev => ({ ...prev, paidRentsToRelatedParty: true }))}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-sm">Sí</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="paidRentsToRelatedParty"
                                                    checked={formData.paidRentsToRelatedParty === false}
                                                    onChange={() => setFormData(prev => ({ ...prev, paidRentsToRelatedParty: false }))}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-sm">No</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Question 40a */}
                                    <div className="flex items-start justify-between border-b pb-3">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-slate-700">
                                                ¿Pagó regalías (royalties) a partes relacionadas?
                                            </label>
                                            <p className="text-xs text-gray-500 mt-1">Question 40a: Royalty payments</p>
                                        </div>
                                        <div className="flex gap-3 ml-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="paidRoyaltiesToRelatedParty"
                                                    checked={formData.paidRoyaltiesToRelatedParty === true}
                                                    onChange={() => setFormData(prev => ({ ...prev, paidRoyaltiesToRelatedParty: true }))}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-sm">Sí</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="paidRoyaltiesToRelatedParty"
                                                    checked={formData.paidRoyaltiesToRelatedParty === false}
                                                    onChange={() => setFormData(prev => ({ ...prev, paidRoyaltiesToRelatedParty: false }))}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-sm">No</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Question 41a */}
                                    <div className="flex items-start justify-between border-b pb-3">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-slate-700">
                                                ¿Tuvo acuerdos de reparto de costos (cost sharing)?
                                            </label>
                                            <p className="text-xs text-gray-500 mt-1">Question 41a: Cost sharing arrangements</p>
                                        </div>
                                        <div className="flex gap-3 ml-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="hasCostSharingArrangements"
                                                    checked={formData.hasCostSharingArrangements === true}
                                                    onChange={() => setFormData(prev => ({ ...prev, hasCostSharingArrangements: true }))}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-sm">Sí</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="hasCostSharingArrangements"
                                                    checked={formData.hasCostSharingArrangements === false}
                                                    onChange={() => setFormData(prev => ({ ...prev, hasCostSharingArrangements: false }))}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-sm">No</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Question 42a */}
                                    <div className="flex items-start justify-between border-b pb-3">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-slate-700">
                                                ¿Pagó por servicios a partes relacionadas?
                                            </label>
                                            <p className="text-xs text-gray-500 mt-1">Question 42a: Payments for services</p>
                                        </div>
                                        <div className="flex gap-3 ml-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="paidServicesToRelatedParty"
                                                    checked={formData.paidServicesToRelatedParty === true}
                                                    onChange={() => setFormData(prev => ({ ...prev, paidServicesToRelatedParty: true }))}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-sm">Sí</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="paidServicesToRelatedParty"
                                                    checked={formData.paidServicesToRelatedParty === false}
                                                    onChange={() => setFormData(prev => ({ ...prev, paidServicesToRelatedParty: false }))}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-sm">No</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Question 42b */}
                                    <div className="flex items-start justify-between border-b pb-3">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-slate-700">
                                                ¿Recibió pagos por servicios de partes relacionadas?
                                            </label>
                                            <p className="text-xs text-gray-500 mt-1">Question 42b: Receipts for services</p>
                                        </div>
                                        <div className="flex gap-3 ml-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="receivedServicesFromRelatedParty"
                                                    checked={formData.receivedServicesFromRelatedParty === true}
                                                    onChange={() => setFormData(prev => ({ ...prev, receivedServicesFromRelatedParty: true }))}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-sm">Sí</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="receivedServicesFromRelatedParty"
                                                    checked={formData.receivedServicesFromRelatedParty === false}
                                                    onChange={() => setFormData(prev => ({ ...prev, receivedServicesFromRelatedParty: false }))}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-sm">No</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Question 43a */}
                                    <div className="flex items-start justify-between border-b pb-3">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-slate-700">
                                                ¿Tuvo otras transacciones con partes relacionadas?
                                            </label>
                                            <p className="text-xs text-gray-500 mt-1">Question 43a: Other transactions</p>
                                        </div>
                                        <div className="flex gap-3 ml-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="hasOtherTransactions"
                                                    checked={formData.hasOtherTransactions === true}
                                                    onChange={() => setFormData(prev => ({ ...prev, hasOtherTransactions: true }))}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-sm">Sí</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="hasOtherTransactions"
                                                    checked={formData.hasOtherTransactions === false}
                                                    onChange={() => setFormData(prev => ({ ...prev, hasOtherTransactions: false }))}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-sm">No</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Question 45 - Part VIII */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-slate-700">
                                                ¿Es la LLC un contribuyente de erosión de base (base erosion taxpayer)?
                                            </label>
                                            <p className="text-xs text-gray-500 mt-1">Question 45 (Part VIII): Base erosion taxpayer</p>
                                        </div>
                                        <div className="flex gap-3 ml-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="isBaseErosionTaxpayer"
                                                    checked={formData.isBaseErosionTaxpayer === true}
                                                    onChange={() => setFormData(prev => ({ ...prev, isBaseErosionTaxpayer: true }))}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-sm">Sí</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="isBaseErosionTaxpayer"
                                                    checked={formData.isBaseErosionTaxpayer === false}
                                                    onChange={() => setFormData(prev => ({ ...prev, isBaseErosionTaxpayer: false }))}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-sm">No</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
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
                                            <option value="sole member">sole member</option>
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
