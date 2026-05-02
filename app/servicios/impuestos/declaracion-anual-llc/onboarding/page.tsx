'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowRight, ArrowLeft, CheckCircle, FileText, DollarSign, Building, User, Plus, Trash2, Info, ExternalLink, HelpCircle, Upload } from 'lucide-react'
import SignaturePad from '@/components/ui/SignaturePad'

// Tipos para el formulario 5472
type Transaction = {
    id: string
    date: string              // 'YYYY-MM-DD'
    type: 'contribution' | 'distribution'
    concept: string           // Concepto breve
    amountUSD: number
    isMonetary: boolean       // false = no monetario (bienes, software...)
    paymentMethod: string     // Wire, ACH, Transfer...
    referenceId: string       // Referencia bancaria / TX ID
    description: string       // Descripción para el IRS (en inglés)
}

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
    llcAddressRoom?: string
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

    // Formación y costos
    formationCost: number
    hasTradeOrBusiness: boolean
    isDisregardedEntity: boolean

    // Transacciones desglosadas (reemplaza los campos simples de Part IV/V)
    transactions: Transaction[]

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
    assistedFilling: boolean
    bankStatements: string[]
    assistedFillingNotes: string
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
    const [isAutoFilling, setIsAutoFilling] = useState(true)
    const [statementFiles, setStatementFiles] = useState<File[]>([])

    useEffect(() => {
        async function fetchAutoFillData() {
            try {
                const res = await fetch('/api/user/llc-data')
                if (res.ok) {
                    const result = await res.json()
                    const { data } = result
                    if (data) {
                        setFormData(prev => ({
                            ...prev,
                            llcName: data.name || prev.llcName,
                            llcEin: data.ein || prev.llcEin,
                            llcState: data.state || prev.llcState,
                            formationDate: data.formationDate || prev.formationDate,
                            soleOwnerName: data.soleOwnerName || prev.soleOwnerName,
                            ownerName: data.soleOwnerName || prev.ownerName,
                            llcAddress: data.address || prev.llcAddress,
                            llcCity: data.city || prev.llcCity,
                            llcZip: data.zip || prev.llcZip,
                            signerName: data.soleOwnerName || prev.signerName,
                        }))
                    }
                }
            } catch (err) {
                console.error('Error auto-rellenando datos', err)
            } finally {
                setIsAutoFilling(false)
            }
        }
        fetchAutoFillData()
    }, [])

    const currentYear = new Date().getFullYear()
    const [formData, setFormData] = useState<Form5472Data>({
        taxYear: String(currentYear - 1),
        assistedFilling: false,
        bankStatements: [],
        assistedFillingNotes: '',

        // PART I: Reporting Corporation
        llcName: '',
        llcAddress: '',
        llcCity: '',
        llcState: '',
        llcZip: '',
        llcAddressRoom: '',
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

        // PART IV / V: Monetary Transactions + Formation
        capitalContributionCash: 0,
        capitalContributionProperty: 0,
        capitalDistributionCash: 0,
        capitalDistributionProperty: 0,
        formationCost: 0,
        hasTradeOrBusiness: false,
        isDisregardedEntity: true,

        // Transacciones desglosadas (lista vacía por defecto)
        transactions: [] as Transaction[],

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

    const handleEinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '') // Solo números
        if (value.length > 9) value = value.slice(0, 9)

        // Aplicar máscara XX-XXXXXXX
        if (value.length > 2) {
            value = value.slice(0, 2) + '-' + value.slice(2)
        }

        setFormData(prev => ({
            ...prev,
            llcEin: value
        }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const newFiles = Array.from(files)
        setStatementFiles(prev => [...prev, ...newFiles])

        // Mantener solo los nombres para la UI reactiva de formData
        const fileNames = newFiles.map(f => f.name)
        setFormData(prev => ({
            ...prev,
            bankStatements: [...prev.bankStatements, ...fileNames]
        }))
    }

    const removeStatement = (name: string) => {
        setStatementFiles(prev => prev.filter(f => f.name !== name))
        setFormData(prev => ({
            ...prev,
            bankStatements: prev.bankStatements.filter(f => f !== name)
        }))
    }

    // Validación de campos requeridos por paso
    const validateStep = (step: number): string | null => {
        if (step === 1) {
            if (!formData.llcName.trim()) return 'El Nombre Legal de la LLC es obligatorio.'
            if (!formData.llcEin.trim()) return 'El EIN (Employer ID) es obligatorio.'

            const einRegex = /^\d{2}-\d{7}$/
            if (!einRegex.test(formData.llcEin)) {
                return 'El EIN debe tener el formato XX-XXXXXXX (2 números, guion, 7 números).'
            }

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

    // ===== Manejo de transacciones =====
    const newEmptyTx = (): Transaction => ({
        id: Math.random().toString(36).slice(2),
        date: '',
        type: 'contribution',
        concept: '',
        amountUSD: 0,
        isMonetary: true,
        paymentMethod: 'Wire',
        referenceId: '',
        description: ''
    })

    const addTransaction = () =>
        setFormData(prev => ({ ...prev, transactions: [...prev.transactions, newEmptyTx()] }))

    const removeTransaction = (id: string) =>
        setFormData(prev => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== id) }))

    const updateTransaction = (id: string, field: keyof Transaction, value: any) =>
        setFormData(prev => ({
            ...prev,
            transactions: prev.transactions.map(t =>
                t.id === id ? { ...t, [field]: field === 'amountUSD' ? parseFloat(value) || 0 : value } : t
            )
        }))

    // Subtotales dinámicos
    const totalContribCash = formData.transactions.filter(t => t.type === 'contribution' && t.isMonetary).reduce((s, t) => s + t.amountUSD, 0)
    const totalContribNM = formData.transactions.filter(t => t.type === 'contribution' && !t.isMonetary).reduce((s, t) => s + t.amountUSD, 0)
    const totalDistribCash = formData.transactions.filter(t => t.type === 'distribution' && t.isMonetary).reduce((s, t) => s + t.amountUSD, 0)
    const totalDistribNM = formData.transactions.filter(t => t.type === 'distribution' && !t.isMonetary).reduce((s, t) => s + t.amountUSD, 0)
    const grandTotal = totalContribCash + totalContribNM + totalDistribCash + totalDistribNM

    const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1)
            window.scrollTo(0, 0)
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            // Mapeo de datos para TaxFormService (Estructura anidada requerida)
            const nestedData = {
                taxYear: formData.taxYear,
                llc: {
                    name: formData.llcName,
                    ein: formData.llcEin,
                    address: formData.llcAddress,
                    addressRoom: formData.llcAddressRoom,
                    city: formData.llcCity,
                    state: formData.llcState,
                    zip: formData.llcZip,
                    formationDate: formData.formationDate,
                    einAlternate: formData.llcEinAlternate,
                    countryOfIncorporation: formData.llcCountryOfIncorporation,
                    taxResidenceCountries: formData.llcTaxResidenceCountries,
                    activityCode: formData.llcActivityCode,
                    activityDescription: formData.llcActivityDescription,
                    isForeignOwnedDE: formData.isForeignOwnedDE,
                    soleOwnerName: formData.soleOwnerName,
                    soleOwnerEin: formData.soleOwnerEin,
                    soleOwnerReferenceId: formData.soleOwnerReferenceId,
                    isDirectOwner: formData.isDirectOwner,
                    isOwnerUSPerson: formData.isOwnerUSPerson,
                    isOwnerForeignPerson: formData.isOwnerForeignPerson,
                    totalAssets: formData.totalAssets,
                    hasRelatedPartyTransactions: formData.hasRelatedPartyTransactions,
                    isInitialReturn: false
                },
                owner: {
                    name: formData.ownerName,
                    address: formData.ownerAddress,
                    city: formData.ownerCity,
                    country: formData.ownerCountry,
                    taxId: formData.ownerTaxId,
                    referenceIdType: formData.ownerReferenceIdType,
                    businessCountries: formData.ownerBusinessCountries,
                    taxResidenceCountries: formData.ownerTaxResidenceCountries,
                    ownershipType: formData.ownershipType
                },
                relatedParty: {
                    name: formData.relatedPartyName || formData.ownerName,
                    address: formData.relatedPartyAddress || formData.ownerAddress,
                    city: formData.relatedPartyCity || formData.ownerCity,
                    country: formData.relatedPartyCountry || formData.ownerCountry,
                    taxId: formData.relatedPartyTaxId || formData.ownerTaxId,
                    referenceIdType: formData.relatedPartyReferenceIdType || formData.ownerReferenceIdType,
                    businessCountries: formData.relatedPartyBusinessCountries || formData.ownerBusinessCountries,
                    taxResidenceCountries: formData.relatedPartyTaxResidenceCountries || formData.ownerTaxResidenceCountries,
                    relationship: formData.relatedPartyRelationship || '25% Foreign Shareholder',
                    ownershipType: formData.relatedPartyOwnershipType || 'Direct',
                    isUSPerson: formData.isRelatedPartyUSPerson || false
                },
                financials: {
                    capitalContributionCash: totalContribCash,
                    capitalContributionProperty: totalContribNM,
                    capitalDistributionCash: totalDistribCash,
                    capitalDistributionProperty: totalDistribNM,
                    formationCost: formData.formationCost,
                    otherTransactions: 0,
                    transactions: formData.transactions.map(({ id, ...rest }) => rest)
                },
                additionalInfo: {
                    hasTradeOrBusiness: formData.hasTradeOrBusiness,
                    isDisregardedEntity: formData.isDisregardedEntity
                },
                additionalQuestions: {
                    importGoods: false,
                    documentWarehouse: false,
                    foreignParentCSA: false,
                    interestRoyaltyDeduction: false,
                    fdiiDeduction: false,
                    safeHavenInterest: false,
                    safeHavenOutsideRange: false,
                    coveredDebtInstrument: false
                },
                baseErosion: {
                    csaParticipant: false,
                    csaBefore2009: false,
                    stockBasedCompensation: false
                },
                signature: {
                    signerName: formData.signerName,
                    signerTitle: formData.signerTitle,
                    signatureDate: formData.signatureDate,
                    signatureDataUrl: formData.signatureDataUrl
                },
                // Nuevos campos de asistencia
                assistedFilling: formData.assistedFilling,
                assistedFillingNotes: formData.assistedFillingNotes,
                bankStatements: formData.bankStatements
            }

            console.log('Iniciando proceso de pago fiscal...', nestedData)

            const res = await fetch('/api/orders/tax-filing/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taxData: nestedData })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Error al procesar el pedido')
            }

            // Si hay archivos seleccionados, los subimos ahora que tenemos el pedidoId (data.pedidoId)
            const pedidoId = data.pedidoId
            if (pedidoId && statementFiles.length > 0) {
                console.log('Subiendo extractos bancarios para el pedido...', pedidoId)
                for (const file of statementFiles) {
                    const fileFormData = new FormData()
                    fileFormData.append('file', file)
                    fileFormData.append('pedidoId', pedidoId)

                    try {
                        await fetch('/api/orders/tax-filing/upload-bank-statements', {
                            method: 'POST',
                            body: fileFormData
                        })
                    } catch (err) {
                        console.error('Error subiendo uno de los archivos:', file.name, err)
                    }
                }
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
                                        onChange={handleEinChange}
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
                                    <label htmlFor="llcAddressRoom" className="block text-sm font-medium text-slate-700">Room or Suite nº</label>
                                    <input type="text" name="llcAddressRoom" id="llcAddressRoom" value={formData.llcAddressRoom} onChange={handleChange} placeholder="Suite 101" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="llcCity" className="block text-sm font-medium text-slate-700">Ciudad</label>
                                    <input type="text" name="llcCity" id="llcCity" value={formData.llcCity} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border" />
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
                                <DollarSign className="text-blue-600" size={20} /> Transacciones Reportables (Part V)
                            </h2>

                            {/* MODO ASISTENCIA EXPERTA */}
                            <div className={`p-6 rounded-2xl border-2 transition-all ${formData.assistedFilling ? 'border-amber-500 bg-amber-50 shadow-md' : 'border-slate-100 bg-white'}`}>
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${formData.assistedFilling ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                        <User size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-slate-900">¿Prefieres que nosotros rellenemos esto por ti?</h3>
                                                <p className="text-sm text-slate-600 mt-1 italic font-medium">Si tienes muchas transacciones o no estás seguro, marca esta opción.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, assistedFilling: !prev.assistedFilling }))}
                                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.assistedFilling ? 'bg-amber-600' : 'bg-gray-200'}`}
                                            >
                                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.assistedFilling ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </button>
                                        </div>

                                        {formData.assistedFilling && (
                                            <div className="mt-4 p-5 bg-white border border-amber-200 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="text-amber-600" size={18} />
                                                    <p className="text-sm text-amber-800 font-bold">ASISTENCIA PERSONALIZADA ACTIVADA</p>
                                                </div>

                                                <p className="text-xs text-amber-700 leading-relaxed font-medium">
                                                    Al elegir esta opción, puedes saltar este formulario de transacciones. Un experto de Open LLC USA revisará tu pedido y te contactará para solicitarte los datos o extractos necesarios para completar el informe <strong>Federal Supporting Statement</strong> por ti.
                                                </p>

                                                {/* Sección de Adjuntos */}
                                                <div className="pt-4 border-t border-amber-100">
                                                    <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                                        <Upload size={16} className="text-blue-600" /> Adjuntar extractos bancarios
                                                    </h4>

                                                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                                                        <input
                                                            type="file"
                                                            id="bank-upload"
                                                            className="hidden"
                                                            multiple
                                                            onChange={handleFileChange}
                                                        />
                                                        <label
                                                            htmlFor="bank-upload"
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-all text-xs font-bold uppercase tracking-wider"
                                                        >
                                                            <Plus size={14} /> Seleccionar archivos
                                                        </label>
                                                        <p className="mt-3 text-[11px] text-slate-500 leading-tight">
                                                            <strong>IMPORTANTE:</strong> El extracto debe abarcar el <strong>año calendario completo</strong> y de <strong>todas las cuentas bancarias</strong> que posea la LLC.
                                                        </p>
                                                    </div>

                                                    {formData.bankStatements.length > 0 && (
                                                        <div className="mt-3 space-y-2">
                                                            {formData.bankStatements.map((f, i) => (
                                                                <div key={i} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                                                                    <span className="text-xs font-medium text-blue-800 truncate">{f}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeStatement(f)}
                                                                        className="text-red-400 hover:text-red-600 p-1"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Notas adicionales */}
                                                <div className="pt-4 border-t border-amber-100">
                                                    <label className="block text-xs font-bold text-slate-800 mb-2">
                                                        Notas sobre aportaciones o reintegros:
                                                    </label>
                                                    <textarea
                                                        rows={3}
                                                        value={formData.assistedFillingNotes}
                                                        onChange={(e) => setFormData(p => ({ ...p, assistedFillingNotes: e.target.value }))}
                                                        placeholder="Ej: He realizado una transferencia de $5,000 el 15 de marzo como capital inicial..."
                                                        className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                                    />
                                                    <p className="mt-2 text-[10px] text-slate-500 italic">
                                                        Escribe aquí cualquier aclaración que ayude al asesor a identificar contribuciones o distribuciones en tus extractos.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {!formData.assistedFilling && (
                                <>
                                    {/* Aviso IRS */}
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-xl shadow-sm mt-4 mb-8">
                                        <div className="flex gap-3">
                                            <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div className="text-sm text-blue-900 space-y-3 font-medium">
                                                <p className="font-bold text-base mb-2">El IRS exige detalle por transacción — no basta con el total.</p>
                                                <p>
                                                    Registra cada contribución (dinero o bienes que entraron a la LLC desde ti) y cada distribución (retiros que salieron de la LLC hacia ti). Estos datos se trasladarán directamente al <strong>Federal Supporting Statement</strong> adjunto al Form 5472.
                                                </p>

                                                <div className="pt-3 border-t border-blue-200/60 mt-4">
                                                    <p className="font-bold mb-3">
                                                        Si no estás seguro o tienes dudas sobre cómo rellenar este formulario referente a las transacciones reportables, pulsa una de estas 2 opciones:
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <a
                                                            href="/servicios/form-5472-1120/guia-transacciones"
                                                            target="_blank"
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm font-semibold text-xs uppercase tracking-wider"
                                                        >
                                                            Saber más <ExternalLink size={14} />
                                                        </a>
                                                        <a
                                                            href="/contacto"
                                                            target="_blank"
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm font-semibold text-xs uppercase tracking-wider"
                                                        >
                                                            Contacto <ArrowRight size={14} />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tabla de transacciones */}
                                    <div className="space-y-4">
                                        {formData.transactions.length === 0 && (
                                            <p className="text-sm text-slate-500 italic text-center py-4 border border-dashed rounded-lg">
                                                Aún no has añadido transacciones. Haz clic en “Añadir transacción” para comenzar.
                                            </p>
                                        )}

                                        {formData.transactions.map((tx, idx) => (
                                            <div key={tx.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 relative">
                                                {/* Badge numeración + botón eliminar */}
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tx.type === 'contribution'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-green-100 text-green-700'
                                                        }`}>
                                                        #{idx + 1} — {tx.type === 'contribution' ? 'Contribución ↑' : 'Distribución ↓'}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTransaction(tx.id)}
                                                        className="text-red-400 hover:text-red-600 transition-colors"
                                                        title="Eliminar transacción"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-6">
                                                    {/* Fecha */}
                                                    <div className="sm:col-span-2">
                                                        <label className="block text-xs font-medium text-slate-600 mb-1">Fecha *</label>
                                                        <input
                                                            type="date"
                                                            value={tx.date}
                                                            onChange={e => updateTransaction(tx.id, 'date', e.target.value)}
                                                            className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                            required
                                                        />
                                                    </div>

                                                    {/* Tipo */}
                                                    <div className="sm:col-span-2">
                                                        <label className="block text-xs font-medium text-slate-600 mb-1">Tipo *</label>
                                                        <select
                                                            value={tx.type}
                                                            onChange={e => updateTransaction(tx.id, 'type', e.target.value)}
                                                            className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                            <option value="contribution">↑ Contribución (entró a la LLC)</option>
                                                            <option value="distribution">↓ Distribución (salió de la LLC)</option>
                                                        </select>
                                                    </div>

                                                    {/* Importe USD */}
                                                    <div className="sm:col-span-2">
                                                        <label className="block text-xs font-medium text-slate-600 mb-1">Importe USD *</label>
                                                        <div className="relative">
                                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={tx.amountUSD || ''}
                                                                onChange={e => updateTransaction(tx.id, 'amountUSD', e.target.value)}
                                                                className="w-full rounded-md border border-slate-300 pl-6 pr-2 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                                placeholder="0.00"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Concepto */}
                                                    <div className="sm:col-span-3">
                                                        <label className="block text-xs font-medium text-slate-600 mb-1">Naturaleza / Concepto *</label>
                                                        <input
                                                            type="text"
                                                            value={tx.concept}
                                                            onChange={e => updateTransaction(tx.id, 'concept', e.target.value)}
                                                            className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Ej: Initial capital contribution"
                                                        />
                                                    </div>

                                                    {/* Método de pago */}
                                                    <div className="sm:col-span-2">
                                                        <label className="block text-xs font-medium text-slate-600 mb-1">Método de pago</label>
                                                        <select
                                                            value={tx.paymentMethod}
                                                            onChange={e => updateTransaction(tx.id, 'paymentMethod', e.target.value)}
                                                            className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                            <option value="Wire">Wire</option>
                                                            <option value="ACH">ACH</option>
                                                            <option value="Transfer">Transfer</option>
                                                            <option value="Check">Check</option>
                                                            <option value="N/A">N/A (no monetario)</option>
                                                        </select>
                                                    </div>

                                                    {/* ¿Monetario? */}
                                                    <div className="sm:col-span-1">
                                                        <label className="block text-xs font-medium text-slate-600 mb-1">¿En efectivo?</label>
                                                        <select
                                                            value={tx.isMonetary ? 'yes' : 'no'}
                                                            onChange={e => updateTransaction(tx.id, 'isMonetary', e.target.value === 'yes')}
                                                            className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                            <option value="yes">✅ Sí</option>
                                                            <option value="no">📳 No (bienes)</option>
                                                        </select>
                                                    </div>

                                                    {/* Referencia bancaria */}
                                                    <div className="sm:col-span-3">
                                                        <label className="block text-xs font-medium text-slate-600 mb-1">Referencia bancaria / TX ID</label>
                                                        <input
                                                            type="text"
                                                            value={tx.referenceId}
                                                            onChange={e => updateTransaction(tx.id, 'referenceId', e.target.value)}
                                                            className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Ej: WIRE-2025-001"
                                                        />
                                                    </div>

                                                    {/* Descripción IRS */}
                                                    <div className="sm:col-span-6">
                                                        <label className="block text-xs font-medium text-slate-600 mb-1">
                                                            Descripción para el IRS <span className="text-slate-400">(en inglés, aparece en el Statement oficial)</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={tx.description}
                                                            onChange={e => updateTransaction(tx.id, 'description', e.target.value)}
                                                            className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Ej: Cash contribution from foreign owner to capitalize the LLC for business operations"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Botón añadir */}
                                        <button
                                            type="button"
                                            onClick={addTransaction}
                                            className="flex items-center gap-2 w-full justify-center border-2 border-dashed border-blue-300 rounded-xl py-3 text-blue-600 hover:border-blue-500 hover:bg-blue-50 transition-all text-sm font-medium"
                                        >
                                            <Plus size={16} /> Añadir transacción
                                        </button>
                                    </div>

                                    {/* Subtotales en vivo */}
                                    {formData.transactions.length > 0 && (
                                        <div className="bg-slate-900 rounded-xl p-5 text-white">
                                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Resumen de totales</p>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <p className="text-slate-400 text-xs">Contribuciones monetarias</p>
                                                    <p className="font-bold text-blue-300 text-lg">${fmt(totalContribCash)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-400 text-xs">Distribuciones monetarias</p>
                                                    <p className="font-bold text-green-300 text-lg">${fmt(totalDistribCash)}</p>
                                                </div>
                                                {totalContribNM > 0 && (
                                                    <div>
                                                        <p className="text-slate-400 text-xs">Contribs. no monetarias (FMV)</p>
                                                        <p className="font-bold text-orange-300 text-lg">${fmt(totalContribNM)}</p>
                                                    </div>
                                                )}
                                                {totalDistribNM > 0 && (
                                                    <div>
                                                        <p className="text-slate-400 text-xs">Distribs. no monetarias (FMV)</p>
                                                        <p className="font-bold text-orange-300 text-lg">${fmt(totalDistribNM)}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="border-t border-slate-700 mt-3 pt-3 flex justify-between">
                                                <p className="text-slate-400 text-xs font-semibold">TOTAL BRUTO (campo 1f del 5472)</p>
                                                <p className="font-bold text-white text-lg">${fmt(grandTotal)}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Costo de Formación */}
                                    <div className="border border-slate-200 rounded-xl p-4">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Costos de Formación de la LLC ($)</label>
                                        <p className="text-xs text-slate-500 mb-2">Gastos pagados para crear la LLC (registro de estado, agente registrado, servicios profesionales).</p>
                                        <div className="relative max-w-xs">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                            <input
                                                type="number"
                                                name="formationCost"
                                                value={formData.formationCost}
                                                onChange={handleChange}
                                                min="0"
                                                step="0.01"
                                                className="w-full rounded-md border border-slate-300 pl-7 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
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
                                        <dt className="text-sm font-medium text-gray-500">Contribuciones monetarias</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-bold text-blue-700">${fmt(totalContribCash)}</dd>
                                    </div>
                                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Distribuciones monetarias</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-bold text-green-700">${fmt(totalDistribCash)}</dd>
                                    </div>
                                    {totalContribNM > 0 && (
                                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                                            <dt className="text-sm font-medium text-gray-500">Contribs. no monetarias (FMV)</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-bold text-orange-600">${fmt(totalContribNM)}</dd>
                                        </div>
                                    )}
                                    {totalDistribNM > 0 && (
                                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Distribs. no monetarias (FMV)</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-bold text-orange-600">${fmt(totalDistribNM)}</dd>
                                        </div>
                                    )}
                                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                                        <dt className="text-sm font-medium text-gray-500">Costo Formación</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${formData.formationCost.toFixed(2)}</dd>
                                    </div>
                                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Nº de transacciones</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formData.transactions.length} transacción(es) registrada(s)</dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Paso 4: Mensaje de asistencia si aplica */}
                            {formData.assistedFilling && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-4 animate-in fade-in slide-in-from-top-4">
                                    <div className="flex gap-4">
                                        <div className="bg-amber-100 p-2 rounded-xl h-fit">
                                            <HelpCircle className="text-amber-600" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-amber-900 text-lg">Modo de Asistencia Experta</h4>
                                            <p className="text-sm text-amber-700 mt-1 leading-relaxed">
                                                Has seleccionado la opción de asistencia. Nuestro equipo se encargará de completar los detalles de las transacciones (Part V) y las preguntas adicionales (Part VII) basándose en la documentación que nos proporciones después.
                                            </p>
                                            <div className="mt-3 flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-widest">
                                                <CheckCircle size={14} /> Solo firma abajo para continuar
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!formData.assistedFilling && (
                                <>
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
                                </>
                            )}

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
            </div>
        </div>
    )
}
