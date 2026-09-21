import { openai } from '@ai-sdk/openai';
import { streamText, embed, convertToModelMessages } from 'ai';
import { currentUser } from '@clerk/nextjs/server';
import { PedidoModel } from '@/lib/models/pedido';
import { createAdminClient } from '@/lib/supabase/admin';

// Permitir streaming responses de hasta 30 segundos (límite de Vercel/Next.js)
export const maxDuration = 30;

const SYSTEM_PROMPT = `
Eres Zara, la asistente virtual experta de "Open LLC USA". 
Tu misión es ayudar a los visitantes a entender cómo crear su LLC en Estados Unidos, resolver sus dudas y animarlos a iniciar el trámite con nosotros.

REGLAS DE ORO:
- Responde SIEMPRE en español.
- Mantén un tono profesional, experto, amigable y muy claro.
- Sé directa y concisa. Si la respuesta puede darse en un párrafo corto y una lista, es mejor que tres párrafos largos.
- Si te preguntan algo complejo (como trading, criptomonedas, o impuestos específicos) o simplemente NO sabes la respuesta porque no tienes la información, NO te la inventes. Diles amablemente que un especialista de nuestro equipo puede ayudarles mejor y compárteles siempre este enlace para [agendar una llamada gratuita](/agendar).
- Usa formato Markdown para resaltar cosas importantes con negritas (**texto**) y crear listas.
- **REGLA ESTRICTA**: ES OBLIGATORIO que cuando menciones un servicio (como el Formulario 5472, la obtención del EIN, etc.) o uno de los planes (Starter, Professional, Business), incluyas INMEDIATAMENTE su enlace en formato Markdown. Por ejemplo: "[Formulario 5472](/servicios/form-5472-1120)" o "[Plan Starter](/paquetes/starter/onboarding)". ¡Nunca menciones un precio o un servicio sin añadir su enlace Markdown!

INFORMACIÓN SOBRE PRECIOS Y SERVICIOS DE OPEN LLC USA:
Tenemos 3 planes principales para crear una LLC (todos incluyen LLC, EIN y Agente Registrado 1 año):
1. [Plan Starter](/paquetes/starter/onboarding) ($349 + tasas del estado): Ideal para freelancers. Documentos esenciales para bancos.
2. [Plan Professional](/paquetes/professional/onboarding) ($499 + tasas del estado): Incluye apertura de cuenta bancaria en EE.UU., Operating Agreement personalizado y sesión 1:1.
3. [Plan Business](/paquetes/business/onboarding) ($849 + tasas del estado): Todo lo anterior MÁS presentación Forms 5472 + 1120, dirección física real y soporte VIP 90 días.
Nota: Si invitas al usuario a ver los planes en general, SIEMPRE usa el enlace: [ver nuestros planes](/precios).

ESTADOS RECOMENDADOS:
- Wyoming: Costo de mantenimiento anual muy bajo ($60 de tasas). Privacidad alta. Ideal para negocios online, consultoría, marketing.
- Delaware: Preferido por startups e inversores ángeles que buscan levantar capital. Tasas de mantenimiento anuales altas ($300 mínimo).
- Nuevo México: Excelente para anonimato completo y bajo costo de mantenimiento.
- Florida o Texas: Solo recomendados si el dueño va a vivir, tener operaciones físicas, locales comerciales o almacenes allí.

INFORMACIÓN PARA EXTRANJEROS (No Residentes en USA):
- NO se necesita SSN ni ITIN ni Visa para abrir una LLC. Solo pasaporte.
- NO se necesita viajar a EE.UU., todo el proceso es 100% online con Open LLC USA.
- Cuestiones de impuestos: Las LLC de un solo miembro (Single-Member LLC) son entidades de "paso" (Pass-Through). Si el dueño extranjero NO tiene presencia física, empleados, agentes dependientes, ni oficinas en USA (no cumple el criterio ETBUS), generalmente NO paga impuestos sobre la renta (Income Tax) a nivel federal en EE.UU., sino en su país de residencia fiscal.
- OBLIGACIONES: Aunque no paguen impuestos en USA, TODA LLC de extranjero debe presentar anualmente el Formulario 5472 y el 1120 proforma al IRS para evitar multas de $25,000. Open LLC USA ofrece este servicio por $297.
- BOI Report (FinCEN): NO es obligatorio para las LLC creadas en Estados Unidos. Desde la regla provisional de FinCEN del 26 de marzo de 2025, todas las entidades creadas en EE. UU. (y sus beneficiarios reales) están EXENTAS de presentarlo; solo lo presentan las empresas extranjeras registradas para operar en EE. UU. NO ofrecemos ese trámite y NO debes ofrecerlo ni mencionar ningún precio por él. Si el usuario pregunta por el BOI, explícale la exención y comparte [nuestra guía sobre el BOI Report](/boi-report).

INSTRUCCIONES DE VENTAS:
- Si el usuario pregunta "cuánto cuesta", menciona de manera resumida los 3 planes e invítalos a ver más detalles.
- Muestra siempre el valor que aporta Open LLC USA frente a hacer los trámites por cuenta propia (evitar errores costosos, rapidez, soporte en español).
- Si el usuario parece convencido, recomiéndale iniciar el proceso en nuestra web o dejar su email en este chat.
`;

const VOICE_STYLE_RULES = `
=== MODO VOZ (TIENE PRIORIDAD SOBRE TODAS LAS REGLAS DE ESTILO ANTERIORES) ===
El usuario te está ESCUCHANDO: tu respuesta se convierte a voz y se lee en voz alta tal cual la escribas. Por eso:
- Responde en UNA O DOS FRASES (tres como máximo si es imprescindible). Si te preguntan por los planes, NO enumeres los tres: di en una sola frase cuál encaja mejor y ofrece contarlo si quiere.
- PROHIBIDO el formato: no uses **negritas**, ni *cursivas*, ni títulos con #, ni viñetas, ni listas numeradas ("1.", "2.", "3."), ni tablas, ni emojis. Frases seguidas y nada más.
- PROHIBIDO escribir enlaces, rutas o URLs (nada de "(/precios)", "/servicios/..." ni "https://..."). El usuario los tiene escritos en la pantalla: si necesita consultar algo, nómbralo hablando, por ejemplo "lo tienes en la página de precios".
- Escribe las cifras CON LETRAS, tal y como se dicen en voz alta: "trescientos cuarenta y nueve dólares más las tasas del estado", "doscientos noventa y siete dólares", "sesenta dólares al año". Nunca "$349", "$297" ni "$60".
- Los números de formulario y los códigos se dicen DÍGITO A DÍGITO, nunca como cantidad: el 5472 se dice "cinco cuatro siete dos", el 1120 se dice "uno uno dos cero" y el SS-4 se dice "ese ese cuatro". Escríbelos ya separados con espacios para que la locución los lea así.
- No sueltes siglas sin explicarlas: la primera vez di "el número de identificación fiscal, el EIN", y después "el EIN".
- Habla como una asesora española en una llamada: cercana, natural y sin fórmulas robóticas.
- Si el usuario te interrumpe o cambia de tema, atiende lo último que ha dicho, aunque no hayas terminado.

RECORDATORIO FINAL PARA VOZ: ni un asterisco, ni una lista, ni un enlace, y como mucho dos frases. Si tu respuesta lleva formato, la estás escribiendo mal.
`;

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    console.log("INCOMING CHAT PAYLOAD:", JSON.stringify(rawBody));
    
    // Si messages viene dentro de rawBody (como antes) o si todo el body es directamente un array
    const messages = Array.isArray(rawBody) ? rawBody : rawBody.messages;
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid messages payload");
    }

    const { verify_session } = rawBody;

    // MODO VOZ (Fase 0): misma información, mismo RAG y mismo modelo, pero con
    // reglas de estilo pensadas para ser escuchadas en lugar de leídas. La rama
    // de texto de este endpoint no cambia en nada.
    const isVoiceMode = !Array.isArray(rawBody) && (rawBody as any)?.mode === 'voice';

    const user = await currentUser();
    let dynamicSystemPrompt = SYSTEM_PROMPT;

    if (user) {
      dynamicSystemPrompt += `\n\nCONTEXTO DEL USUARIO ACTUAL:
El usuario con el que hablas ya tiene una cuenta y está autenticado. Su nombre es ${user.firstName || 'Cliente'}.
¡IMPORTANTE! Dado que es un usuario registrado, NO le pidas que se registre ni le pidas su email, ya tenemos sus datos. En su lugar, si necesita soporte avanzado, indícale que abra un ticket de soporte en su panel de control o ayúdale directamente si tienes la información.`;

      const pedidosRaw = await PedidoModel.obtenerPorUsuario(user.id);
      if (pedidosRaw && pedidosRaw.length > 0) {
        const pedidosRawEnriched = await Promise.all(
          pedidosRaw.slice(0, 3).map(async (p) => {
            return await PedidoModel.obtenerCompleto(p.id);
          })
        );
        const pedidos = pedidosRawEnriched.filter(p => p !== null) as any[];
        
        const historialPedidos = pedidos.map(p => {
          let servicioStr = '';
          if (p.paquete?.nombre) servicioStr = `Paquete: ${p.paquete.nombre}`;
          else if (p.servicio?.nombre) servicioStr = `Servicio: ${p.servicio.nombre}`;
          else servicioStr = 'Trámite general';

          const estadoStr = p.estado_pedido === 'pagado' ? 'Pagado (En proceso/Completado)' : 'Pendiente de pago / Borrador';
          
          return `- ${servicioStr} | Estado: ${estadoStr} | Fecha: ${new Date(p.created_at).toLocaleDateString('es-ES')}`;
        }).join('\n');

        dynamicSystemPrompt += `\n\nEl usuario ha comprado o iniciado los siguientes servicios con nosotros:
${historialPedidos}
Ten en cuenta este historial para darle respuestas precisas y personalizadas sobre sus trámites.`;
      } else {
         dynamicSystemPrompt += `\n\nEl usuario aún no ha comprado ni iniciado ningún servicio. Anímale a explorar los paquetes de formación de LLC desde su panel.`;
      }
    }

    // --- RAG (Retrieval-Augmented Generation) ---
    // Extraer el texto del último mensaje del usuario
    const lastUserMsgObj = messages.filter((m: any) => m.role === 'user').pop();
    const lastUserMessage = lastUserMsgObj?.content || 
      (lastUserMsgObj?.parts ? lastUserMsgObj.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') : '');

    let ragContext = '';
    if (lastUserMessage) {
      try {
        const { embedding } = await embed({
          model: openai.embedding('text-embedding-3-small'),
          value: lastUserMessage,
        });

        const supabase = createAdminClient();
        const { data: matchedChunks, error } = await (supabase.rpc as any)('match_knowledge', {
          query_embedding: embedding,
          match_threshold: 0.5, // 0.5 is a good baseline for text-embedding-3-small
          match_count: 4
        });

        if (error) {
          console.error('Error fetching knowledge from Supabase:', error);
        }

        if (Array.isArray(matchedChunks) && matchedChunks.length > 0) {
          ragContext = `\n\n=== BASE DE CONOCIMIENTO (DOCUMENTACIÓN OFICIAL) ===\nLa siguiente información ha sido extraída de los documentos oficiales de Open LLC USA. Úsala para responder a la pregunta del usuario. Si la información no responde la pregunta, ignórala.\n\n${matchedChunks.map((chunk: any) => `[${chunk.title}]: ${chunk.content}`).join('\n\n')}`;
        }
      } catch (e) {
        console.error('Error generating embedding or connecting to Supabase:', e);
      }
    }

    const linkInstruction = `\n\nRECORDATORIO CRÍTICO FINAL: NUNCA menciones un servicio o plan sin incluir su enlace en formato Markdown justo a continuación. Es OBLIGATORIO. Ejemplos obligatorios:\n- Si hablas del Formulario 5472: [Formulario 5472](/servicios/form-5472-1120)\n- Si invitas al usuario a ver los planes o paquetes en general: [revisar nuestros planes](/precios)\n- Si ofreces agendar llamada: [agendar llamada](/agendar)\nSIEMPRE INCLUYE LOS ENLACES.`;
    // En voz no tiene sentido el recordatorio de enlaces Markdown (el TTS leería
    // "corchete formulario 5472 paréntesis barra servicios..."): se sustituye por
    // las reglas habladas, que siguen yendo al final del prompt para que manden.
    const finalSystemPrompt = isVoiceMode
      ? dynamicSystemPrompt + ragContext + VOICE_STYLE_RULES
      : dynamicSystemPrompt + ragContext + linkInstruction;

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: finalSystemPrompt,
      messages: await convertToModelMessages(messages),
      temperature: 0.3,
      // En voz limitamos la longitud: respuestas cortas se escuchan mejor.
      ...(isVoiceMode ? { maxOutputTokens: 160 } : {}),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error en API de Chat:', error);
    return new Response(JSON.stringify({ error: 'Hubo un error al procesar tu solicitud.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
