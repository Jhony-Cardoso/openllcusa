import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allCountries } from '@/components/CountrySelector/countries';
import { ArrowLeft, CheckCircle2, Globe, Shield, Zap } from 'lucide-react';
import Flag from '@/components/Flag';

// Generar rutas estáticas para todos los países definidos para un build más rápido
export function generateStaticParams() {
  return allCountries.map((country) => ({
    country: country.code,
  }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const resolvedParams = await params;
  const countryCode = resolvedParams.country;
  const country = allCountries.find(c => c.code === countryCode);
  
  if (!country) return { title: 'País no encontrado' };

  return {
    title: `Cómo abrir una LLC desde ${country.name} | Open LLC USA`,
    description: `Guía definitiva para emprendedores en ${country.name}. Descubre cómo abrir tu LLC en Estados Unidos sin viajar y sin SSN.`,
  };
}

export default async function CountryGuidePage({ params }) {
  const resolvedParams = await params;
  const countryCode = resolvedParams.country;
  const country = allCountries.find(c => c.code === countryCode);

  if (!country) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-slate-50 to-blue-50 border-b border-slate-200 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-8">
            <ArrowLeft className="mr-2" size={16} /> Volver al inicio
          </Link>
          
          <div className="flex justify-center mb-6">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
               <Flag countryCode={country.code} size="xl" className="w-20 h-20" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Abre tu LLC en EE.UU. desde <span className="text-blue-600">{country.name}</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            La guía completa para que emprendedores residentes en {country.name} internacionalicen 
            su negocio, cobren en dólares y accedan al sistema financiero global en menos de 10 días.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="prose prose-lg prose-slate max-w-none prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-headings:font-bold">
          <h2>El puente entre {country.name} y el mercado global</h2>
          <p>
            Miles de emprendedores, freelancers y dueños de e-commerce en {country.name} están abriendo 
            sus empresas en Estados Unidos. ¿El motivo? Acceder a una divisa fuerte, procesar pagos a nivel mundial 
            mediante Stripe o PayPal, y blindar su patrimonio operando bajo el marco legal del motor económico más grande del mundo.
          </p>
          <p>
            Con <strong>Open LLC USA</strong>, el proceso se ha simplificado al máximo. No necesitas tener visa, viajar 
            a Estados Unidos ni contar con un Número de Seguro Social (SSN).
          </p>

          <div className="grid md:grid-cols-3 gap-6 my-12 not-prose">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600 mb-4">
                <Globe size={28} />
              </div>
              <h3 className="font-bold mb-2">100% Online</h3>
              <p className="text-sm text-slate-600">Todo el trámite se realiza de forma remota sin salir de {country.name}.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mb-4">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="font-bold mb-2">Cuenta en Dólares</h3>
              <p className="text-sm text-slate-600">Accede a bancos fintech norteamericanos sin mínimos ni fricción.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="bg-amber-100 p-3 rounded-full text-amber-600 mb-4">
                <Shield size={28} />
              </div>
              <h3 className="font-bold mb-2">Eficiencia Fiscal</h3>
              <p className="text-sm text-slate-600">Estructura amigable para fundadores que residen y tributan en {country.name}.</p>
            </div>
          </div>

          <h2>Requisitos para residentes de {country.name}</h2>
          <p>Para iniciar tu registro estatal hoy mismo, solo necesitas tener a la mano:</p>
          <ul>
            <li>Un pasaporte válido o documento de identidad oficial de {country.name}.</li>
            <li>El nombre que deseas para tu nueva empresa (ej. <em>TuMarca LLC</em>).</li>
            <li>Información básica de contacto (email y número de teléfono).</li>
          </ul>

          <h2>Pasos del Servicio</h2>
          <ol>
            <li><strong>Elige tu Estado:</strong> Wyoming, Delaware o New Mexico son los más populares para no residentes por su fuerte privacidad y bajos costos.</li>
            <li><strong>Firma de Artículos:</strong> Nosotros nos encargamos de tramitar el registro ante el Estado en tiempo récord.</li>
            <li><strong>Obtención del EIN:</strong> Gestionamos tu Número de Identificación de Empleador ante el IRS sin necesidad de SSN o ITIN.</li>
            <li><strong>Apertura Bancaria:</strong> Te entregamos toda la documentación en orden para que inicies tu onboarding digital con bancos como Mercury o Relay.</li>
          </ol>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-slate-900 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -tralslate-y-1/4 translate-x-1/4 opacity-10 blur-3xl">
            <div className="w-64 h-64 bg-blue-500 rounded-full"></div>
          </div>
          <h3 className="text-3xl font-extrabold text-white mb-4 relative z-10">Internacionaliza tu negocio hoy</h3>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto relative z-10 text-lg">
            Empieza tu LLC ahora mismo y deja que nuestro equipo de expertos se encargue del papeleo en EE. UU.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link 
              href="/precios" 
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2"
            >
              <Zap size={20} fill="currentColor" />
              Ver Planes y Precios
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
