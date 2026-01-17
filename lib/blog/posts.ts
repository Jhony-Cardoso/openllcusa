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
