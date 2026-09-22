// Enlace corto para compartir el chatbot en redes sociales.
// Redirige al inicio con el parámetro que hace que el widget de Zara se abra solo
// (ver components/chat/ChatWidget.tsx). Se usa una redirección y no un rewrite para
// que /chat no compita con la home en buscadores.
import { redirect } from 'next/navigation'

export default function ChatCorto() {
  redirect('/?chat=1')
  return null
}
