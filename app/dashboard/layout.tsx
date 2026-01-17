'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, FileText, CreditCard, Package, User, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    {
      name: 'Panel Principal',
      href: '/dashboard',
      icon: Home,
      current: pathname === '/dashboard',
    },
    {
      name: 'Documentos',
      href: '/dashboard/documentos',
      icon: FileText,
      current: pathname?.startsWith('/dashboard/documentos'),
    },
    {
      name: 'Facturación',
      href: '/dashboard/facturacion',
      icon: CreditCard,
      current: pathname?.startsWith('/dashboard/facturacion'),
    },
    {
      name: 'Pedidos',
      href: '/dashboard/pedidos',
      icon: Package,
      current: pathname?.startsWith('/dashboard/pedidos'),
    },
    {
      name: 'Perfil',
      href: '/dashboard/perfil',
      icon: User,
      current: pathname?.startsWith('/dashboard/perfil'),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col min-h-0 pt-20">
            {/* Título del Dashboard */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Mi Dashboard</h2>
              <p className="text-sm text-gray-600 mt-1">Gestiona tu LLC</p>
            </div>

            {/* Navegación */}
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-3 py-2 text-sm font-medium rounded-lg
                      transition-colors duration-150
                      \${
                        item.current
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon
                      className={`
                        mr-3 flex-shrink-0 h-5 w-5
                        \${item.current ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
                      `}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Footer del Sidebar */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                <p className="font-medium">Open LLC USA</p>
                <p className="mt-1">© 2025 Todos los derechos reservados</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-20 left-4 z-40">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-white p-2 rounded-lg shadow-md text-gray-700 hover:text-gray-900"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <div
              className="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-30"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar móvil */}
            <aside className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white z-40 transform transition-transform duration-300 ease-in-out">
              <div className="flex flex-col h-full pt-20">
                {/* Título */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Mi Dashboard</h2>
                  <p className="text-sm text-gray-600 mt-1">Gestiona tu LLC</p>
                </div>

                {/* Navegación */}
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          group flex items-center px-3 py-2 text-sm font-medium rounded-lg
                          transition-colors duration-150
                          \${
                            item.current
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        <Icon
                          className={`
                            mr-3 flex-shrink-0 h-5 w-5
                            \${item.current ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
                          `}
                        />
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    <p className="font-medium">Open LLC USA</p>
                    <p className="mt-1">© 2025 Todos los derechos reservados</p>
                  </div>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* Contenido principal */}
        <main className="flex-1 lg:pl-64">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}