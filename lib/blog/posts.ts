// app/lib/blog/posts.ts

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string; // formato ISO: '2024-11-14'
  readTime: string;
  category: string;
  tags: string[];
  image?: string;
  schema?: Record<string, any>; // Para SEO
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'llc-usa-desde-argentina',
    title: 'Cómo Crear una LLC en USA desde Argentina: Guía Completa 2026',
    excerpt:
      'Guía completa para crear una LLC en Estados Unidos desde Argentina: estados recomendados, costos, pasos legales, impuestos en EE.UU. y obligaciones ante AFIP.',
    author: 'Open LLC USA',
    date: '2025-11-14',
    readTime: '12 min',
    category: 'Guías',
    tags: ['LLC', 'Argentina', 'Fiscalidad Internacional', 'EIN', 'Wyoming'],
    image: '/blog/llc-argentina.jpg',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id':
          'https://openllcusa.com/blog/llc-usa-desde-argentina',
      },
      headline:
        'Cómo Crear una LLC en USA desde Argentina: Guía Completa 2024',
      description:
        'Guía paso a paso para crear una LLC en Estados Unidos desde Argentina: estados recomendados, costos, impuestos y obligaciones ante AFIP.',
      image: ['https://openllcusa.com/blog/llc-argentina.jpg'],
      author: {
        '@type': 'Organization',
        name: 'Open LLC USA',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Open LLC USA',
        logo: {
          '@type': 'ImageObject',
          url: 'https://openllcusa.com/logo.png',
        },
      },
      datePublished: '2024-11-14',
      dateModified: '2024-11-14',
    },
    content: `
## Introducción: ¿por qué crear una LLC en USA desde Argentina?

Registrar una LLC en Estados Unidos es una opción frecuente para emprendedores argentinos que buscan cobrar en dólares, acceder a clientes internacionales y simplificar procesos de cobro con plataformas como Stripe o bancos digitales.

Si estás cansado de pelear con las restricciones para cobrar del exterior o te preocupa la inflación, una LLC en Estados Unidos puede ser una forma de ordenar tu negocio y cobrar en dólares con más tranquilidad.

Lo mejor: **no hace falta viajar**. Sin embargo, hay obligaciones fiscales y administrativas que conviene conocer desde el principio.

## ¿Qué es una LLC y por qué puede convenirte?

### Ventajas principales

- Responsabilidad limitada: separa patrimonio personal del negocio.
- Flexibilidad operativa y fiscal.
- Acceso más fácil a medios de cobro internacionales.

### Limitaciones y consideraciones

No te exime automáticamente de obligaciones fiscales en Argentina. Además, necesitarás un agente registrado y deberás presentar ciertos formularios ante el IRS en algunos casos.

## Mejores estados para registrar una LLC siendo argentino

Elegir el estado depende de tu negocio y prioridades (costos, privacidad, facilidades fiscales).

### Wyoming

**Ventajas:**

- Sin impuesto estatal sobre la renta.
- Privacidad: los socios no aparecen en registros públicos.
- Bajo costo de mantenimiento (alrededor de $60 anuales).

**Ideal para:** Negocios de e-commerce, servicios digitales, consultorías.

### Delaware

**Ventajas:**

- Sistema legal favorable a empresas.
- Reconocimiento internacional.
- Ideal si planeas inversores o crecimiento rápido.

**Contras:**

- Costos más altos que Wyoming.

### Nuevo México

**Ventajas:**

- Sin reporte anual obligatorio.
- Buena privacidad.
- Trámites sencillos.

**Nota:** Menos conocido que Wyoming o Delaware, pero muy válido para ciertos casos.

## Paso a paso: cómo abrir tu LLC desde Argentina

### 1. Elegir el estado y el nombre

- Consulta disponibilidad de nombres en el sitio oficial del estado.
- Asegúrate de que nadie esté usando ese nombre.

### 2. Contratar un agente registrado

Es obligatorio. El agente recibe notificaciones legales y oficiales. Puedes contratar servicios como:

- Northwest Registered Agent
- Incfile
- ZenBusiness

**Costo promedio:** Entre $100 y $300 anuales.

### 3. Presentar el Artículo de Organización (Articles of Organization)

Es el documento oficial que registra tu LLC ante el estado. Puedes hacerlo online.

**Costo:** Entre $50 y $500 según el estado.

### 4. Obtener el EIN (Employer Identification Number)

El EIN es como un CUIT/CUIL en Argentina. Lo emite el IRS (Internal Revenue Service).

**¿Cómo obtenerlo?**

- Online (si tienes SSN) o por correo/fax.
- Es gratuito.

**Para qué lo necesitas:**

- Abrir cuentas bancarias.
- Recibir pagos de plataformas como Stripe.
- Presentar impuestos.

### 5. Abrir una cuenta bancaria en EE.UU.

Opciones populares para no residentes:

- Mercury
- Wise (antes TransferWise)
- Payoneer

**Requisitos comunes:**

- Pasaporte.
- Comprobante de LLC.
- EIN.

### 6. Mantener la LLC en regla

- Presentar informes anuales (en algunos estados).
- Renovar el agente registrado.
- Declarar impuestos (aunque no generes ingresos).

## Obligaciones fiscales en Argentina

> ⚠️ Importante: Tener una LLC en EE.UU. **no te exime** de obligaciones fiscales en Argentina si eres residente fiscal argentino.
>
> La idea no es asustarte, sino que sepas desde el principio qué implica para que puedas decidir con información completa.

### ¿Qué debes considerar?

- **AFIP:** Declara ingresos del exterior.
- **Bienes Personales:** La LLC puede ser considerada un bien en el exterior.
- **Impuesto a las Ganancias:** Si percibes dividendos.

**Recomendación:** Consulta con un contador especializado en fiscalidad internacional.

## Costos aproximados

A modo de resumen, estos son los costos aproximados del primer año:

| Concepto                  | Costo (USD)     |
| ------------------------- | --------------- |
| Registro de LLC           | $50 - $500      |
| Agente registrado (anual) | $100 - $300     |
| EIN                       | Gratis          |
| Cuenta bancaria           | Variable        |
| Asesoría legal/contable   | $500 - $2000    |

En la práctica, la mayoría de emprendedores se mueve en un rango total de **$1.000 a $3.000** el primer año.

## Preguntas frecuentes

### ¿Necesito viajar a EE.UU. para crear una LLC?

No. Todo se puede hacer de forma remota.

### ¿Puedo ser el único socio?

Sí. Se llama "Single-Member LLC".

### ¿Cuánto tarda el proceso?

Entre 1 y 4 semanas dependiendo del estado y la época del año.

### ¿Necesito tener ingresos en EE.UU.?

No. Puedes facturar a clientes de cualquier país.

### ¿Qué pasa si no presento impuestos?

Multas del IRS y posible cierre de la LLC.

## Conclusión

Crear una LLC en Estados Unidos desde Argentina es viable, accesible y puede abrirte muchas puertas comerciales. Sin embargo, es fundamental:

- Entender las obligaciones fiscales en ambos países.
- Mantener la LLC en regla.
- Contar con asesoría profesional.

Si después de leer todo esto ves que una LLC puede ser una buena herramienta para tu negocio, pero no quieres perder tiempo con formularios y burocracia en inglés, podemos acompañarte en todo el proceso para que no se te escape ningún detalle importante.

**¿Necesitas ayuda para crear tu LLC?** En Open LLC USA te guiamos paso a paso en todo el proceso. ¡Contáctanos!
    `,
  },
  {
    slug: 'llc-vs-sl-espana',
    title: 'LLC en EE.UU. vs SL en España: Comparativa Completa para Emprendedores 2026',
    excerpt:
      '¿Te conviene más una LLC en Estados Unidos o una Sociedad Limitada en España? Comparamos costes, impuestos, requisitos, ventajas y desventajas para que tomes la mejor decisión según tu negocio.',
    author: 'Open LLC USA',
    date: '2026-08-11',
    readTime: '15 min',
    category: 'Guías',
    tags: ['LLC', 'España', 'SL', 'Comparativa', 'Fiscalidad Internacional', 'Emprendedores'],
    image: '/blog/llc-vs-sl-espana.jpg',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://openllcusa.com/blog/llc-vs-sl-espana',
      },
      headline: 'LLC en EE.UU. vs SL en España: Comparativa Completa 2026',
      description:
        '¿LLC en EE.UU. o SL en España? Comparamos costes, impuestos, requisitos y ventajas para emprendedores españoles. Descubre cuál es la mejor opción para tu negocio.',
      image: ['https://openllcusa.com/blog/llc-vs-sl-espana.jpg'],
      author: {
        '@type': 'Organization',
        name: 'Open LLC USA',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Open LLC USA',
        logo: {
          '@type': 'ImageObject',
          url: 'https://openllcusa.com/logo.png',
        },
      },
      datePublished: '2026-08-11',
      dateModified: '2026-08-11',
      inLanguage: 'es-ES',
    },
    content: `
## Introducción: la pregunta que todo emprendedor español se hace

Si tienes un negocio digital o estás a punto de lanzarlo desde España, probablemente te has hecho esta pregunta: **¿me monto una SL en España o una LLC en Estados Unidos?**

La respuesta no es universal. Depende de tu situación fiscal, el tipo de negocio, tus clientes, tus planes de expansión y cómo quieres operar. Esta guía te da los datos reales para que puedas decidir con información completa.

> ⚠️ **Importante**: Este artículo ofrece información general. No sustituye el asesoramiento fiscal personalizado de un experto en ambas jurisdicciones.

---

## ¿Qué es una SL y qué es una LLC?

### Sociedad Limitada (SL) — España

La **Sociedad Limitada** es la forma jurídica empresarial más utilizada en España. Equivale a una Limited Liability Company pero bajo el marco legal español. Sus características principales:

- Responsabilidad limitada al capital aportado
- Capital mínimo: **3.000 €** (aunque puede ser de 1 € con la SL simplificada)
- Registro en el Registro Mercantil de la provincia
- Tributación mediante **Impuesto de Sociedades (IS)**: 25% (15% primeros 2 años)
- El autónomo societario cotiza a la Seguridad Social (~300-500 €/mes)
- Obligatoria la llevanza de contabilidad oficial según el PGC

### LLC (Limited Liability Company) — Estados Unidos

La **LLC** es la estructura más flexible del sistema empresarial americano. Para un extranjero:

- Responsabilidad limitada al capital aportado
- Capital mínimo: **0 $** (no hay mínimo legal)
- Registro en el estado elegido (Wyoming, Delaware, Nuevo México…)
- Fiscalmente "transparente" en EE.UU. para no residentes sin presencia física
- Sin cotización a ninguna seguridad social americana
- Contabilidad no regulada (llevas los registros como quieras)

---

## Comparativa directa: LLC vs SL

| Criterio | LLC (EE.UU.) | SL (España) |
|---|---|---|
| **Capital mínimo** | $0 | 3.000 € (o 1 € con SL simplificada) |
| **Coste de constitución** | ~$450-550 USD | ~1.500-3.000 € (notario + registro) |
| **Tiempo de constitución** | 5-7 días hábiles | 4-8 semanas |
| **Impuesto sobre beneficios (empresa)** | 0% para no residentes sin EP | 25% (15% primeros 2 años) |
| **Seguridad Social** | 0 € (no hay obligación) | ~300-500 €/mes (autónomo societario) |
| **Contabilidad oficial** | No obligatoria | Obligatoria (PGC, Registro Mercantil) |
| **Presentación declaraciones IRS/AEAT** | Formulario 5472 (informativo) | IS, IVA, retenciones, cuentas anuales |
| **Acceso a Stripe US** | ✅ Sí (desde el día 1) | ⚠️ Solo Stripe EU (comisiones y restricciones diferentes) |
| **Cuenta bancaria** | Mercury, Relay, Wise Business | Bancos españoles + Revolut Business |
| **Credibilidad internacional** | ⭐⭐⭐⭐⭐ (empresa americana) | ⭐⭐⭐ (empresa española) |
| **Complejidad de gestión** | Baja para negocios digitales | Alta (contabilidad, depósito de cuentas…) |
| **Coste anual de mantenimiento** | ~$120-300 USD | ~3.000-6.000 € (gestoría + SS + tasas) |

---

## Ventajas de la LLC sobre la SL para un emprendedor español

### 1. El coste de mantenimiento es radicalmente diferente

Mantener una SL en España cuesta, como mínimo:

- **Seguridad Social** del administrador: ~300-500 €/mes = 3.600-6.000 €/año
- **Gestoría/contable**: ~150-400 €/mes = 1.800-4.800 €/año
- **Tasas del Registro Mercantil y otros**: ~200-500 €/año

**Total mínimo anual SL: ~5.600-11.300 €**

Versus la LLC:

- **Agente registrado**: ~$100-200/año
- **Renovación tasa estatal Wyoming**: ~$62/año
- **Gestoría/contabilidad** (si la contratas): $300-600/año

**Total mínimo anual LLC: ~$462-860 USD**

La diferencia es enorme. Para un negocio en fase temprana o con ingresos bajos, la SL puede ser una carga insostenible.

### 2. No pagas impuesto sobre la renta en EE.UU. (en la mayoría de casos)

Si como español operas a través de una LLC y:
- No tienes empleados en EE.UU.
- No tienes oficina física en EE.UU.
- Tus clientes son de fuera de EE.UU. o son empresas (B2B)

Entonces, normalmente, **la LLC no paga impuesto federal** en EE.UU. La renta "pasa" directamente al dueño (pass-through taxation) y tributas en España por los ingresos que te distribuyas.

### 3. Acceso a la economía digital global sin fricciones

Con una LLC puedes activar:

- **Stripe US**: comisiones más bajas, más métodos de pago, less restrictions
- **Amazon Seller Central (EE.UU.)**: para vender en Amazon.com sin las restricciones de cuentas europeas
- **PayPal Business (USA)**: acceso a más funcionalidades
- **Plataformas SaaS americanas**: Paddle, Lemon Squeezy, Gumroad (requieren entidad americana o reconocen LLCs)
- **Servicios de Google, AWS, Azure**: facturación en USD sin retenciones europeas

### 4. Tiempo de constitución: 5 días vs 4-8 semanas

Con la LLC, en 5-7 días hábiles tienes la empresa lista para operar. Con la SL, entre notario, Registro Mercantil y trámites previos, raramente baja de 4 semanas y puede llegar a los 2 meses.

---

## Ventajas de la SL sobre la LLC para un emprendedor español

La LLC no siempre es la mejor opción. La SL puede ser superior si:

### 1. Tus clientes son principalmente empresas españolas que piden factura española con IVA

Si tu negocio depende principalmente de clientes B2B en España que necesitan facturas con IVA y número de empresa española, una LLC americana puede generar fricción o desconfianza.

### 2. Tienes un negocio con presencia física en España (local, empleados)

Si tienes empleados en España, un local físico o actividades que generen "establecimiento permanente" en España, la LLC puede crear complicaciones fiscales adicionales.

### 3. Planeas solicitar financiación de bancos o fondos españoles

Los bancos y fondos de capital riesgo españoles prefieren trabajar con entidades bajo derecho español. Si buscas préstamos bancarios o inversores locales, la SL facilita el proceso.

### 4. Operas en sectores regulados en España

Sectores como sanidad, educación reglada, alimentación o inmobiliario en España tienen requisitos específicos para operar legalmente que suelen requerir entidades bajo derecho español.

---

## La combinación LLC + SL: ¿tiene sentido?

Muchos emprendedores que operan globalmente tienen **ambas estructuras**:

- **La LLC** para cobrar de clientes internacionales, activar Stripe US, Amazon FBA y plataformas globales
- **La SL** para contratar empleados en España, trabajar con clientes locales y cumplir con la normativa española

Esta estructura dual es perfectamente legal pero requiere coordinación fiscal entre ambas jurisdicciones. Asegúrate de que un asesor con experiencia en fiscalidad internacional valide tu estructura.

---

## Aspectos fiscales clave para españoles con LLC

### ¿Qué debes declarar en España si tienes una LLC?

Como residente fiscal en España, debes declarar:

1. **IRPF**: Los beneficios que te distribuyas desde la LLC (rendimientos del capital mobiliario o actividades económicas, según la estructura)
2. **Modelo 720**: Declaración de bienes en el extranjero, si el valor de la LLC supera los 50.000 €
3. **Transparencia Fiscal Internacional (TFI)**: Si la LLC obtiene rentas "pasivas" y la tributación efectiva en EE.UU. es inferior al 75% del IS español, puede aplicarse la TFI

> 💡 **Clave**: Si operas a través de una LLC como **disregarded entity** (sin elección de régimen fiscal alternativo), el IRS la trata como si no existiera y los ingresos son directamente tuyos. Esto simplifica la tributación en España porque no hay dividendos "formales".

### ¿Cuándo aplica la Transparencia Fiscal Internacional (TFI)?

La TFI puede aplicarse si:
- Eres residente fiscal en España
- Posees >50% de la LLC
- La LLC obtiene rentas pasivas (intereses, dividendos, royalties, servicios intragrupo)
- La tributación en EE.UU. es inferior al 75% del tipo del IS español

Si tu LLC realiza una **actividad económica real** (consultoría, SaaS, e-commerce activo), normalmente la TFI no aplica. Pero es un aspecto que debes revisar con tu asesor fiscal.

---

## Caso práctico: ¿Cuándo elegiría yo una LLC?

**Escenario A: Consultor o freelance digital**

- Clientes internacionales o empresas en EE.UU.
- Ingresos < 150.000 €/año
- Sin empleados en España
- Necesita Stripe US y cobrar en USD

**→ LLC es superior.** Ahorro de 5.000-10.000 €/año en costes fijos vs SL.

**Escenario B: Agencia de marketing con equipo en España**

- 3 empleados en España
- Clientes principalmente españoles
- Facturación > 500.000 €/año

**→ SL es más adecuada.** La LLC no puede tener empleados en España de forma directa.

**Escenario C: Amazon FBA o e-commerce global**

- Vende en Amazon.com, Shopify, mercados internacionales
- Sin presencia física en ningún país
- Clientes en varios países

**→ LLC es claramente superior.** Acceso a Amazon US, Stripe US, Mercury Bank. Cero costes de Seguridad Social.

---

## Preguntas frecuentes: LLC vs SL para españoles

### ¿Puedo tener una LLC en EE.UU. siendo autónomo en España?

Sí. Puedes ser autónomo (persona física) en España y tener una LLC en EE.UU. simultáneamente. Son estructuras independientes. Lo que debes gestionar es la declaración de los ingresos de la LLC en tu IRPF español.

### ¿La LLC sustituye al autónomo en España?

No necesariamente. Si tus actividades en España requieren ser autónomo (ej. tienes clientes españoles a los que facturas en España), seguirás siendo autónomo. La LLC opera en paralelo para tus actividades internacionales.

### ¿Es legal tener una LLC siendo residente en España?

Completamente legal. No existe ninguna prohibición española ni comunitaria que impida a un residente en España poseer una empresa en EE.UU. Lo que sí es obligatorio es declarar esa empresa y sus rendimientos a la Agencia Tributaria.

### ¿Qué pasa con el IVA?

Una LLC en EE.UU. no está sujeta al sistema de IVA europeo. Si vendes a consumidores finales en España, debes considerar las implicaciones del IVA OSS (One Stop Shop) si superas los umbrales de venta en la UE. Para ventas B2B o clientes fuera de la UE, generalmente no hay IVA que aplicar.

### ¿Cuánto me costaría crear mi LLC con Open LLC USA?

Los planes empiezan desde $349 + tasa estatal (~$100 en Wyoming). En 5-7 días tienes tu LLC lista con EIN, Operating Agreement y resolución bancaria. [Ver planes y precios →](/precios)

---

## Conclusión: ¿LLC o SL?

**Elige una LLC si:**
- Tienes un negocio digital con clientes internacionales
- Quieres minimizar costes fijos (sin Seguridad Social americana)
- Necesitas Stripe US, Amazon US o plataformas globales
- Estás en fase temprana y quieres maximizar el capital

**Elige una SL si:**
- Tus clientes son principalmente empresas españolas que exigen factura con IVA español
- Tienes empleados en España o presencia física
- Buscas financiación bancaria o inversión española
- Operas en sectores regulados bajo derecho español

**Considera ambas si:**
- Tienes un negocio híbrido con operaciones tanto internacionales como locales
- Tienes ingresos suficientes para sostener ambas estructuras

Lo más importante: **habla con un experto** antes de decidir. Cada situación es diferente y los errores en la estructura jurídica pueden costar caro.

Si quieres explorar si una LLC es la opción correcta para ti, en Open LLC USA ofrecemos una [consulta inicial gratuita](/agendar) donde analizamos tu caso concreto sin compromiso.
    `,
  },
];

// Funciones de utilidad

export function getAllPosts(): BlogPost[] {
  // Clonamos para no modificar el original al ordenar
  return [...blogPosts].sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter((post) => post.tags.includes(tag));
}
