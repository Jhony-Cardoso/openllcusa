import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, ShieldCheck, ArrowLeft, ExternalLink, Camera, BadgeCheck } from 'lucide-react'

export default async function PerfilPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  // Obtener información del usuario desde Clerk
  const client = await clerkClient()
  const user = await client.users.getUser(userId)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

      {/* Navegación de vuelta */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors font-medium text-sm group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Volver al Panel
      </Link>

      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Mi Perfil</h1>
          <p className="text-slate-500 text-lg">Gestiona tu información personal y la seguridad de tu cuenta.</p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold border border-blue-100">
          <BadgeCheck size={18} />
          Cuenta Verificada
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* COLUMNA IZQUIERDA: Avatar e Info rápida */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-slate-400" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm">
                <Camera size={14} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-slate-500 mb-6">{user.emailAddresses[0]?.emailAddress}</p>

            <div className="pt-6 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Miembro desde</p>
              <p className="text-sm font-bold text-slate-700">
                {new Date(user.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-slate-200">
              <ShieldCheck size={20} className="text-slate-200" />
              Seguridad
            </h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Tus datos están protegidos mediante encriptación bancaria y autenticación segura.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                SSL de 256 bits
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Cumplimiento GDPR
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Datos del perfil */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Datos Personales
              </h3>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nombre</label>
                  <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-medium">
                    {user.firstName || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Apellidos</label>
                  <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-medium">
                    {user.lastName || '-'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Principal</label>
                <div className="flex items-center gap-3 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-medium">
                  <Mail size={16} className="text-slate-400" />
                  {user.emailAddresses[0]?.emailAddress}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-center md:text-left">
                    <h4 className="font-bold text-blue-900 text-sm mb-1">¿Quieres actualizar tu información?</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Utilizamos Clerk para gestionar tu identidad de forma segura. Pulsa el botón para editar tu perfil, cambiar tu contraseña o habilitar 2FA.
                    </p>
                  </div>
                  {/* El UserButton de Clerk suele estar en el Header, pero podemos proporcionar un enlace al Dashboard de Clerk si lo configuraste, o simplemente recordarles usar el botón del header */}
                  <div className="text-blue-600 font-bold text-sm flex items-center gap-1 flex-shrink-0">
                    Usa el botón del menú superior <ArrowLeft size={14} className="rotate-135" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sección adicional: Preferencias (Placeholder) */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex items-center justify-between group cursor-not-allowed opacity-60">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Preferencias de Comunicación</h4>
                <p className="text-sm text-slate-500">Configura qué correos y avisos quieres recibir.</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Próximamente</span>
          </section>
        </div>
      </div>
    </div>
  )
}
