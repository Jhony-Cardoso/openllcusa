import React from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, AlertCircle, Info, DollarSign, ExternalLink } from 'lucide-react'

export const metadata = {
    title: 'Gu├¡a de Transacciones Formulario 5472 - Open LLC USA',
    description: 'Gu├¡a completa sobre c├│mo identificar y registrar transacciones reportables (Part V) para tu Formulario 5472 seg├║n la normativa del IRS.',
}

export default function GuiaTransaccionesPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b border-slate-200 py-6 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 flex items-center gap-4">
                    <Link
                        href="/servicios/form-5472-1120/onboarding"
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
                        title="Volver al formulario"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 leading-tight">Gu├¡a de Transacciones Reportables</h1>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Formularios 5472 y 1120</p>
                    </div>
                </div>
            </header>

            <main className="flex-1 py-12">
                <article className="max-w-4xl mx-auto px-6 space-y-12">
                    
                    {/* Secci├│n 1: Introducci├│n */}
                    <section className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                                <Info size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">┬┐Qu├® busca el IRS con esto?</h2>
                        </div>
                        <div className="space-y-4 text-slate-700 leading-relaxed text-lg">
                            <p>
                                El Formulario 5472 no es para pagar impuestos directamente. Su objetivo principal es <strong>reportar informaci├│n de transparencia</strong> sobre el movimiento de capitales y bienes.
                            </p>
                            <p>
                                El IRS necesita saber exactamente c├│mo interact├║as financieramente t├║ (como propietario extranjero) con tu empresa en USA (la LLC). Espec├¡ficamente, quieren observar cualquier transferencia de valor que cruce la frontera entre t├║ como individuo y tu LLC.
                            </p>
                        </div>
                    </section>

                    {/* Secci├│n 2: Transacciones Reportables */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black text-slate-900 px-4">┬┐Cu├íles son las 'Transacciones Reportables'?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            
                            {/* Option A: Contribuciones */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-blue-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50 transition-transform group-hover:scale-110"></div>
                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-xl font-black uppercase text-xs tracking-widest mb-6 border border-blue-200">
                                        Entradas de dinero <ArrowLeft size={14} className="rotate-[135deg]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">Contribuciones de Capital</h3>
                                    <p className="text-slate-600 mb-6">Cualquier aporte de dinero o bienes que has metido de tu propio bolsillo (o desde otra empresa tuya extranjera) a la cuenta bancaria de la LLC en USA.</p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                                            <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span>Transferencias bancarias / Wire desde tu banco personal al de la LLC.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                                            <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span>Gastos de constituci├│n de la LLC pagados con tu tarjeta personal.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                                            <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span>Bienes, equipos o software que has cedido a tu LLC.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Option B: Distribuciones */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-emerald-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0 opacity-50 transition-transform group-hover:scale-110"></div>
                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl font-black uppercase text-xs tracking-widest mb-6 border border-emerald-200">
                                        Salidas de dinero <ArrowLeft size={14} className="rotate-[-45deg]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">Distribuciones</h3>
                                    <p className="text-slate-600 mb-6">Cualquier retiro o pago que la LLC te ha hecho a ti directamente, extrayendo beneficios o dinero del banco de USA hacia cuentas tuyas en el extranjero.</p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                                            <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span>Retiros / Transferencias de beneficios a tu cuenta personal fuera de USA.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                                            <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span>Pagos usando la tarjeta d├®bito de la LLC para gastos estrictamente personales (ropa personal, comida fuera del horario laboral, etc).</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Secci├│n 3: Lo que NO se reporta */}
                    <section className="bg-amber-50 rounded-3xl p-8 lg:p-12 shadow-inner border border-amber-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 flex-shrink-0">
                                <AlertCircle size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">Lo que NO debes registrar</h2>
                        </div>
                        <p className="text-amber-900 mb-6 font-medium">Las siguientes transacciones corresponden al giro normal de caja de la LLC con clientes/proveedores, y <strong>NO SE REPORTAN en este apartado de transacciones del 5472</strong>.</p>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="bg-white/60 rounded-xl p-4 font-bold text-sm text-amber-800 border-l-4 border-amber-400">
                                ÔØî Ingresos o cobros de honorarios recibidos de tus clientes reales (Stripe, facturas, etc.).
                            </div>
                            <div className="bg-white/60 rounded-xl p-4 font-bold text-sm text-amber-800 border-l-4 border-amber-400">
                                ÔØî Pagos a terceros y proveedores externos (pago de servidores web, suscripciones, freelancers de Upwork).
                            </div>
                        </div>
                    </section>
                    
                    {/* Bot├│n final */}
                    <div className="flex flex-col items-center justify-center p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-xl text-center">
                        <DollarSign size={40} className="text-blue-400 mb-4" />
                        <h2 className="text-2xl font-black mb-4">┬┐Ya las tienes identificadas?</h2>
                        <p className="text-slate-300 font-medium max-w-xl mx-auto mb-8">
                            Vuelve a la pesta├▒a anterior y empieza a a├▒adir fila por fila. Si has agrupado muchas transferencias a tu banco en el a├▒o (por ejemplo, 10 transferencias a Espa├▒a), trata de agruparlas por mes o a├▒├ídelas todas por separado para mayor precisi├│n.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link 
                                href="/servicios/form-5472-1120/onboarding"
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-lg hover:-translate-y-1"
                            >
                                Volver al Formulario
                            </Link>
                            <Link 
                                href="/contacto"
                                className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black rounded-2xl transition-all border border-slate-700"
                            >
                                A├║n tengo dudas (Contacto)
                            </Link>
                        </div>
                    </div>
                </article>
            </main>
        </div>
    )
}
