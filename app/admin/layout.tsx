import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
    BarChart3, Users, Package, FileText,
    Settings, LogOut, LayoutDashboard, Search
} from 'lucide-react'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId) redirect('/sign-in')

    // Verificación de Admin
    const adminEmails = [process.env.ADMIN_EMAIL, 'josemanuelguerranunez5@gmail.com']
    const isAdmin = adminEmails.includes(user?.emailAddresses[0]?.emailAddress || '')

    if (!isAdmin) {
        redirect('/dashboard')
    }

    const menuItems = [
        { label: 'Resumen', href: '/admin', icon: LayoutDashboard },
        { label: 'Pedidos', href: '/admin/pedidos', icon: Package },
        { label: 'Clientes', href: '/admin/clientes', icon: Users },
        { label: 'Documentos', href: '/admin/documentos', icon: FileText },
    ]

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* SIDEBAR ADMIN */}
            <aside className="w-72 bg-slate-900 text-white fixed h-full hidden lg:flex flex-col">
                <div className="p-8 border-b border-slate-800">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="text-white" size={24} />
                        </div>
                        <span className="font-black text-xl tracking-tight uppercase">Open LLC <span className="text-blue-500">Admin</span></span>
                    </Link>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-400 hover:text-white font-bold"
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-400 hover:text-white font-bold"
                    >
                        <LogOut size={20} />
                        Volver al Dashboard
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
                {/* HEADER ADMIN */}
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar pedidos, clientes, facturas..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-all text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">{user?.firstName} {user?.lastName}</p>
                            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Administrador</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                            <img src={user?.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* CONTAINER */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}

function ShieldCheck({ className, size }: { className?: string, size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
