'use client'

import { useEffect, useState } from 'react'

export default function DiagnosticoPage() {
    const [logs, setLogs] = useState<string[]>([])
    const [supabaseUrl, setSupabaseUrl] = useState('')
    const [resultado, setResultado] = useState<any>(null)

    const addLog = (msg: string) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])
    }

    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NO CONFIGURADO'
        setSupabaseUrl(url)
        addLog(`Supabase URL: ${url}`)
    }, [])

    const testConnection = async () => {
        setLogs([])
        setResultado(null)

        addLog('🔍 Iniciando prueba de conexión...')

        try {
            addLog('📡 Consultando API /api/servicios?slug=obtencion-ein...')
            const response = await fetch('/api/servicios?slug=obtencion-ein')

            if (!response.ok) {
                const error = await response.json()
                addLog(`❌ Error HTTP ${response.status}`)
                addLog(`Mensaje: ${error.error}`)
                addLog(`Detalles: ${error.details || 'N/A'}`)
                setResultado({ error })
                return
            }

            const data = await response.json()

            if (!data) {
                addLog('⚠️ No se encontró el servicio')
                setResultado({ data: null })
                return
            }

            addLog('✅ Servicio encontrado!')
            addLog(`ID: ${data.id}`)
            addLog(`Slug: ${data.slug}`)
            addLog(`Nombre: ${data.nombre}`)
            addLog(`Precio: $${data.precio}`)
            setResultado({ data })

        } catch (e) {
            addLog(`💥 Excepción: ${e instanceof Error ? e.message : 'Error desconocido'}`)
            addLog(`Tipo: ${e instanceof TypeError ? 'TypeError (posible Mixed Content)' : typeof e}`)
            setResultado({ exception: e })
        }
    }

    const testAllServicios = async () => {
        setLogs([])
        setResultado(null)

        addLog('🔍 Consultando TODOS los servicios...')

        try {
            addLog('📡 Consultando API /api/servicios...')
            const response = await fetch('/api/servicios')

            if (!response.ok) {
                const error = await response.json()
                addLog(`❌ Error HTTP ${response.status}`)
                addLog(`Mensaje: ${error.error}`)
                setResultado({ error })
                return
            }

            const data = await response.json()

            addLog(`✅ Encontrados ${data?.length || 0} servicios`)
            data?.forEach((s: any, i: number) => {
                addLog(`${i + 1}. ${s.nombre} (${s.slug}) - $${s.precio}`)
            })
            setResultado({ data })

        } catch (e) {
            addLog(`💥 Excepción: ${e instanceof Error ? e.message : 'Error desconocido'}`)
            addLog(`Tipo: ${e instanceof TypeError ? 'TypeError (posible Mixed Content)' : typeof e}`)
            setResultado({ exception: e })
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    🔧 Diagnóstico de Conexión
                </h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Configuración</h2>
                    <div className="space-y-2">
                        <div>
                            <strong>Supabase URL:</strong>
                            <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">
                                {supabaseUrl}
                            </code>
                        </div>
                        <div>
                            <strong>Protocolo:</strong>
                            <span className={`ml-2 px-2 py-1 rounded text-sm ${supabaseUrl.startsWith('https')
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {supabaseUrl.startsWith('https') ? 'HTTPS ✅' : 'HTTP ⚠️'}
                            </span>
                        </div>
                        <div>
                            <strong>Página actual:</strong>
                            <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">
                                {typeof window !== 'undefined' ? window.location.href : 'N/A'}
                            </code>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Pruebas</h2>
                    <div className="space-x-4">
                        <button
                            onClick={testConnection}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Probar servicio "obtencion-ein"
                        </button>
                        <button
                            onClick={testAllServicios}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                            Listar todos los servicios
                        </button>
                    </div>
                </div>

                {logs.length > 0 && (
                    <div className="bg-gray-900 rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-white">Logs</h2>
                        <div className="space-y-1 font-mono text-sm text-green-400">
                            {logs.map((log, i) => (
                                <div key={i}>{log}</div>
                            ))}
                        </div>
                    </div>
                )}

                {resultado && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Resultado (JSON)</h2>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                            {JSON.stringify(resultado, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    )
}
