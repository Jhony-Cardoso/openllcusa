
import Link from 'next/link'
import { FileText, CheckCircle, ArrowRight } from 'lucide-react'

export default function Form5472LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-6">Formulario 5472 + 1120 para LLCs de Extranjeros</h1>
                    <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                        Cumple con tus obligaciones fiscales ante el IRS. Preparamos y presentamos tu declaración informativa anual de manera correcta y segura.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href="/servicios/form-5472-1120/onboarding"
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            Iniciar Trámite <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-4xl mx-auto py-16 px-4">
                <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">¿Qué incluye este servicio?</h2>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <FileText className="text-blue-600" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Formulario 5472 Completo</h3>
                        <p className="text-slate-600">
                            Reporte de transacciones con partes relacionadas extranjeras (tú como dueño). Requisito obligatorio para Single-Member LLCs de no residentes.
                        </p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <CheckCircle className="text-green-600" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Formulario 1120 Pro-Forma</h3>
                        <p className="text-slate-600">
                            Portada requerida del Corporate Income Tax Return con la leyenda "Foreign-Owned U.S. DE", correctamente llenada.
                        </p>
                    </div>
                </div>

                <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-yellow-800 mb-2">⚠️ Importante sobre Multas</h3>
                    <p className="text-yellow-700">
                        La multa mínima por no presentar el Formulario 5472 o hacerlo incorrectamente es de <strong>$25,000 USD</strong>. Asegúrate de cumplir a tiempo (usualmente antes del 15 de abril).
                    </p>
                </div>
            </div>
        </div>
    )
}
