// Enlace corto para compartir el asistente en redes sociales (openllcusa.com/chat).
// El widget global detecta esta ruta y se muestra a página completa, sin botón flotante
// (ver components/chat/ChatWidget.tsx y chat-widget.css). Se marca noindex para no
// competir con la home en buscadores.
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Habla con Zara · Asesoría gratis sobre tu LLC',
  description:
    'Pregunta lo que quieras sobre tu LLC en Estados Unidos: formularios, precios, plazos y obligaciones anuales. Respuesta al instante, sin cita previa.',
  robots: { index: false, follow: true },
}

export default function ChatPagina() {
  return (
    <main className="chat-pagina">
      <h1>Habla con Zara</h1>
      <p>Pregúntale lo que quieras sobre tu LLC: precios, plazos y obligaciones anuales.</p>
    </main>
  )
}
