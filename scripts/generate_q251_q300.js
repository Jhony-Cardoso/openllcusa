const fs = require('fs');
const path = require('path');

const qas = [
  // 1. Operaciones Diarias y Gestión (10 preguntas)
  {
    id: 251,
    slug: 'que-es-un-virtual-mailbox',
    title: '¿Qué es un Virtual Mailbox y por qué lo necesita mi LLC?',
    content: 'Un Virtual Mailbox (Buzón Virtual) es un servicio que te proporciona una dirección postal comercial real en EE.UU. Escanean tu correo físico, lo suben a la nube para que lo leas en PDF y pueden reenviar paquetes. Lo necesitas porque tu Registered Agent solo recibe correo legal o del gobierno, no correo comercial, extractos bancarios o devoluciones de clientes de Amazon/Shopify.'
  },
  {
    id: 252,
    slug: 'usar-direccion-registered-agent-para-bancos',
    title: '¿Puedo usar la dirección del Registered Agent para abrir la cuenta bancaria?',
    content: 'Generalmente no. Las leyes bancarias (Patriot Act y KYC) requieren que proveas el "Principal Place of Business" (Lugar Principal de Negocios). La mayoría de los bancos bloquean las direcciones de Agentes Registrados masivos. Debes proporcionar tu dirección residencial real en tu país para el KYC, y si te piden una dirección comercial de EE.UU. (Mailing Address), lo ideal es usar un Virtual Mailbox dedicado.'
  },
  {
    id: 253,
    slug: 'como-conseguir-numero-telefono-usa',
    title: '¿Cómo consigo un número de teléfono de EE.UU. para mi LLC desde mi país?',
    content: 'Puedes obtener un número de EE.UU. virtual usando servicios de VoIP como Skype, Google Voice (con VPN o cuentas de workspace), OpenPhone, o Twilio. Para plataformas estrictas como Stripe o bancos que exigen verificación por SMS, es recomendable usar servicios de SIM virtual (eSIM) como Mint Mobile o Ultra Mobile PayGo, que te dan un número móvil real y evitan el bloqueo de los números VoIP.'
  },
  {
    id: 254,
    slug: 'contratar-freelancers-upwork-fiverr-llc',
    title: '¿Cómo registro los pagos a freelancers de Upwork o Fiverr en la contabilidad de la LLC?',
    content: 'Plataformas como Upwork o Fiverr actúan como intermediarios (Third-Party Settlement Organizations). Cuando pagas por la plataforma, la factura que ellos te emiten es el justificante válido para tu contabilidad. No necesitas pedirle un formulario W-8BEN o W-9 al freelancer indio o europeo, ya que Upwork se encarga del cumplimiento fiscal; tú solo deduces el pago a la plataforma como gasto de contratista.'
  },
  {
    id: 255,
    slug: 'pagar-servicios-suscripciones-con-llc',
    title: '¿Puedo pagar mis suscripciones a software (ChatGPT, Canva, Adobe) con la LLC?',
    content: 'Sí, siempre que esas herramientas se utilicen para generar ingresos o administrar tu negocio. Si pagas el plan de Netflix familiar con la tarjeta de la LLC, estarás mezclando finanzas personales (Piercing the veil). Para el software de uso mixto (ej. un teléfono móvil), debes deducir solo el porcentaje que corresponda a uso comercial.'
  },
  {
    id: 256,
    slug: 'llc-comprar-y-vender-acciones',
    title: '¿Puede la LLC abrir una cuenta en Interactive Brokers o Charles Schwab?',
    content: 'Sí, la LLC puede abrir cuentas de corretaje institucional (Corporate Brokerage Account). Sin embargo, plataformas como Charles Schwab o TD Ameritrade suelen exigir que el dueño sea residente de EE.UU. Para extranjeros (NRA), Interactive Brokers es la opción más amigable para abrir una cuenta a nombre de la LLC y operar acciones, ETFs o bonos globales.'
  },
  {
    id: 257,
    slug: 'diferencia-manager-managed-member-managed',
    title: '¿Cuál es la diferencia entre Member-Managed y Manager-Managed?',
    content: 'En una LLC "Member-Managed", todos los dueños (Members) participan activamente en las decisiones diarias del negocio (como un autónomo o sociedad simple). En una "Manager-Managed", los dueños delegan el control diario a uno o varios gerentes (Managers), que pueden o no ser dueños. Para proteger la privacidad en estados públicos, algunos nombran a un "Manager" profesional y ocultan a los verdaderos "Members".'
  },
  {
    id: 258,
    slug: 'que-es-certificate-of-incumbency',
    title: '¿Qué es un Certificate of Incumbency y para qué sirve?',
    content: 'Es un documento oficial firmado por el secretario o gerente de la LLC que certifica quiénes son los directores, gerentes y dueños actuales de la empresa, y quién tiene autoridad para firmar en nombre de la misma. A menudo te lo pedirán bancos extranjeros, notarios europeos o inversores, para verificar que tú realmente tienes el poder legal para representar a la LLC estadounidense.'
  },
  {
    id: 259,
    slug: 'notarizacion-documentos-llc-extranjero',
    title: '¿Cómo notarizo documentos de mi LLC si vivo fuera de Estados Unidos?',
    content: 'Gracias a la Notarización en Línea Remota (RON - Remote Online Notarization), ya no necesitas ir a la embajada de EE.UU. Plataformas como Notarize.com o NotaryCam permiten que te conectes por videollamada con un notario público estadounidense. Verifican tu pasaporte en pantalla y firman digitalmente tus resoluciones o poderes. Estos documentos tienen validez legal plena en todo EE.UU.'
  },
  {
    id: 260,
    slug: 'como-firmar-como-manager-llc',
    title: '¿Cuál es la forma correcta de firmar contratos en nombre de la LLC?',
    content: 'Nunca firmes solo con tu nombre. Debes firmar siempre indicando tu cargo oficial para mantener el escudo corporativo. La forma correcta es: "Por: [Tu Firma] / Nombre: Juan Pérez / Título: Manager / Entidad: Mi Empresa LLC". Si omites esto, el juez podría interpretar que firmaste a título personal como garante del contrato.'
  },

  // 2. Estados y Jurisdicciones: Detalles Específicos (10 preguntas)
  {
    id: 261,
    slug: 'por-que-nuevo-mexico-es-privado',
    title: '¿Por qué Nuevo México es tan popular para LLCs de privacidad?',
    content: 'Nuevo México (New Mexico) es el único estado, junto con Wyoming, que ofrece anonimato real en el registro público, ya que no exige listar a los Members ni Managers. Su principal ventaja sobre Wyoming es que **no tiene cuota de reporte anual** (Annual Report Fee $0), por lo que mantener la LLC cuesta solo lo que te cobre el Registered Agent. Sin embargo, no tiene cortes judiciales especializadas en negocios como Delaware.'
  },
  {
    id: 262,
    slug: 'delaware-court-of-chancery',
    title: '¿Qué es la Court of Chancery de Delaware y por qué importa?',
    content: 'Es un tribunal especializado de Delaware que solo trata casos de negocios (derecho corporativo). En lugar de jurados, los casos son resueltos por jueces expertos en empresas, basándose en más de 200 años de jurisprudencia corporativa predecible. Por eso, las grandes startups financiadas por Venture Capital (VC) eligen Delaware (generalmente C-Corps), porque los inversores saben exactamente cómo se resolverá cualquier disputa interna.'
  },
  {
    id: 263,
    slug: 'wyoming-charging-order-protection',
    title: '¿Qué es la protección de "Charging Order" en Wyoming?',
    content: 'Wyoming tiene leyes de protección de activos extremadamente fuertes para LLCs de un solo dueño (Single-Member LLCs). Si un acreedor te demanda a nivel personal y gana, la ley de Wyoming dictamina que el acreedor solo puede obtener un "Charging Order" (derecho a cobrar distribuciones si se hacen), pero NO pueden forzarte a liquidar los activos de la LLC ni pueden tomar control de la empresa. En otros estados (como California), sí pueden embargar la LLC.'
  },
  {
    id: 264,
    slug: 'llc-en-california-ftb-800',
    title: '¿Por qué todos huyen de crear LLCs en California?',
    content: 'California es el estado más hostil para las LLCs pequeñas. Exigen un impuesto mínimo anual (Franchise Tax) de $800 dólares, independientemente de si la empresa genera ingresos o tiene pérdidas. Además, si resides en California y operas una LLC de Wyoming, el estado de California te obligará a registrarla como "Foreign LLC" y pagarás los $800 de todas formas debido a las leyes de "Doing Business In California".'
  },
  {
    id: 265,
    slug: 'florida-llc-ventajas-desventajas',
    title: '¿Cuáles son los pros y contras de una LLC en Florida?',
    content: 'Florida no tiene impuesto estatal sobre la renta (State Income Tax) a nivel personal, lo que atrae a muchos residentes. Sin embargo, su registro corporativo (Sunbiz) es **100% público**, mostrando tu nombre y dirección. Su reporte anual es caro ($138.75), y es un estado conocido por un alto índice de litigios y fraude comercial. No se recomienda si valoras la privacidad.'
  },
  {
    id: 266,
    slug: 'texas-llc-y-franchise-tax',
    title: '¿Cómo funciona el Franchise Tax para las LLCs en Texas?',
    content: 'Texas tampoco tiene impuesto estatal sobre la renta personal y su registro no es tan anónimo como Wyoming. Aunque Texas tiene un "Franchise Tax", la buena noticia es que las pequeñas empresas están exentas de pagarlo (el umbral de exención supera los 1.2 millones de dólares de ingresos). Sin embargo, aún debes presentar un reporte anual complejo ("No Tax Due Report" o PIR) que requiere la ayuda de un CPA.'
  },
  {
    id: 267,
    slug: 'foreign-llc-registration',
    title: '¿Qué significa registrar tu LLC como "Foreign Entity" en otro estado?',
    content: 'Si abres una LLC en Wyoming pero alquilas un almacén fijo en Texas y tienes empleados allí, Texas considerará que estás operando físicamente en su territorio. Por ley, deberás pagar al Secretario de Estado de Texas para registrarte como "Foreign LLC" (Entidad Extranjera, es decir, de otro estado). Tendrás que mantener dos Agentes Registrados y presentar reportes anuales en ambos estados.'
  },
  {
    id: 268,
    slug: 'llc-en-nevada-vs-wyoming',
    title: '¿Debería elegir Nevada sobre Wyoming para crear mi LLC?',
    content: 'En el pasado, Nevada era muy popular por su privacidad y no tener impuestos estatales. Sin embargo, hoy en día, Nevada es extremadamente caro. Cobran $200 para abrir la LLC, más $150 anuales por la lista de oficiales, más $200 obligatorios por la licencia comercial estatal cada año (Total: $350/año). Wyoming cuesta $100 abrir y $62 el mantenimiento anual, ofreciendo la misma o mejor protección y privacidad.'
  },
  {
    id: 269,
    slug: 'puerto-rico-ley-60-act-60',
    title: '¿Una LLC en Puerto Rico (Act 60) es lo mismo que una LLC de EE.UU.?',
    content: 'No. Aunque Puerto Rico es territorio estadounidense, tiene su propio sistema fiscal independiente del IRS para los residentes. La Ley 60 (antes Ley 22) ofrece a individuos que se mudan físicamente a la isla tributar al 0% en ganancias de capital y 4% en impuestos corporativos. Pero requiere mudanza física, comprar propiedad e invertir localmente. Si vives en España, una LLC de PR no te da ventajas adicionales y complica la contabilidad.'
  },
  {
    id: 270,
    slug: 'estados-con-sales-tax-cero',
    title: '¿Es útil formar mi LLC en un estado sin Sales Tax (como Delaware o Montana)?',
    content: 'Si haces e-commerce (Dropshipping o FBA), formar tu LLC en un estado sin Sales Tax (Delaware, Montana, New Hampshire, Oregon, Alaska) NO te salva de recaudar Sales Tax en el resto del país. El "Economic Nexus" obliga a tu LLC a cobrar el impuesto basándose en dónde está **el comprador**, no en dónde está registrada tu empresa.'
  },

  // 3. E-commerce: Amazon FBA y Shopify a Fondo (10 preguntas)
  {
    id: 271,
    slug: 'amazon-fba-nexus-inventario',
    title: '¿Tener inventario en un almacén de Amazon FBA crea nexo físico (Physical Nexus)?',
    content: 'Sí. A ojos de casi todos los estados, almacenar inventario físico dentro de sus fronteras (aunque sea en un almacén logístico de Amazon) constituye un nexo físico. Esto te obligaba a registrarte para cobrar Sales Tax. Afortunadamente, Amazon ahora opera bajo las leyes de "Marketplace Facilitator", por lo que Amazon se encarga automáticamente de recaudar y remitir el Sales Tax al estado en tu nombre para esas ventas.'
  },
  {
    id: 272,
    slug: 'marketplace-facilitator-leyes',
    title: '¿Qué es la ley de "Marketplace Facilitator" en Estados Unidos?',
    content: 'Es una ley adoptada por casi todos los estados que obliga a los grandes mercados (Marketplaces como Amazon, eBay, Etsy, Walmart) a calcular, recaudar y remitir el Sales Tax de las ventas realizadas por terceros en su plataforma. Esto ha aliviado enormemente la carga fiscal de los vendedores internacionales de LLC, ya que no necesitan lidiar con el Sales Tax de esas plataformas.'
  },
  {
    id: 273,
    slug: 'shopify-y-el-economic-nexus',
    title: '¿Si vendo por Shopify, también aplica el "Marketplace Facilitator"?',
    content: 'NO. Shopify NO es un Marketplace Facilitator; es solo una herramienta para construir tu propia tienda. Si vendes a través de Shopify directamente a clientes de EE.UU., TÚ eres el único responsable de monitorear tus ventas. Si superas el umbral de "Economic Nexus" en un estado (ej. $100,000 en ventas en Texas), debes registrarte manualmente en Texas, configurar Shopify para cobrar el tax, y pagarlo al estado.'
  },
  {
    id: 274,
    slug: 'resale-certificate-amazon-wholesale',
    title: '¿Para qué sirve el Resale Certificate si hago Amazon Wholesale (Mayorista)?',
    content: 'Si compras productos de marcas en EE.UU. para revenderlos en Amazon (Wholesale), tus proveedores te exigirán un "Resale Certificate" (Certificado de Reventa). Este documento prueba que estás comprando los productos con fines comerciales para reventa, eximiéndote de pagarles el Sales Tax en esa compra B2B. Para obtenerlo, primero debes registrarte para obtener un permiso de vendedor (Seller’s Permit) en al menos un estado (suele ser el de tu LLC).'
  },
  {
    id: 275,
    slug: 'impuesto-importacion-aranceles-llc',
    title: '¿Paga mi LLC aranceles de importación (Customs Duties) al enviar productos desde China a EE.UU.?',
    content: 'Sí. Si actúas como "Importer of Record" (Importador de Registro), debes pagar aranceles en la aduana de EE.UU. al ingresar inventario. Sin embargo, bajo la exención "De Minimis" (Section 321), los envíos directos a un consumidor cuyo valor declarado sea inferior a $800 dólares entran libres de aranceles. Esto es lo que permite que el Dropshipping B2C tradicional opere sin pagar aranceles aduaneros en aduanas.'
  },
  {
    id: 276,
    slug: 'insurance-amazon-fba-llc',
    title: '¿Me obliga Amazon a tener un seguro corporativo para mi LLC?',
    content: 'Sí. Los Términos de Servicio de Amazon exigen que si superas los $10,000 en ventas en un solo mes, debes obtener un "Commercial General Liability Insurance" (Seguro de Responsabilidad Civil) con una cobertura mínima de $1 millón de dólares, y debes nombrar a Amazon como asegurado adicional. Si te niegas, pueden suspender tu cuenta de vendedor.'
  },
  {
    id: 277,
    slug: 'stripe-bloqueos-dropshipping',
    title: '¿Por qué Stripe bloquea tantas cuentas nuevas de Dropshipping?',
    content: 'Stripe considera el Dropshipping (especialmente desde China) como de alto riesgo (High Risk). Los tiempos de envío largos provocan altas quejas de clientes, devoluciones y Chargebacks. Si no configuras las expectativas de envío claramente en tu web, Stripe congelará los fondos en semanas para protegerse de la insolvencia. Necesitas pruebas sólidas de tracking, una cadena de suministro ágil (proveedores locales en USA si es posible) o pasarelas de alto riesgo especializadas.'
  },
  {
    id: 278,
    slug: 'llc-y-ventas-b2b-sales-tax',
    title: 'Si mi LLC vende software B2B a otras empresas en EE.UU., ¿cobro Sales Tax?',
    content: 'En la gran mayoría de los estados, los servicios puros (como consultoría) y el software SaaS (Software as a Service) están exentos de Sales Tax, especialmente en transacciones B2B. Sin embargo, algunos estados (como Texas, New York o Washington) sí gravan los servicios digitales y el software descargable o SaaS. Depende del estado donde resida el comprador.'
  },
  {
    id: 279,
    slug: 'stripe-atlas-vs-open-llc-ecommerce',
    title: '¿Es Stripe Atlas recomendable para crear una LLC de Dropshipping?',
    content: 'No es la mejor opción. Stripe Atlas está diseñado para startups tecnológicas (SaaS) que buscan levantar capital riesgo (Venture Capital), por eso crean por defecto C-Corporations en Delaware (que implican impuestos corporativos complejos). Aunque ofrecen LLCs, no te brindan asesoría fiscal para extranjeros y sus costes a largo plazo son altos. Es mejor usar agencias especializadas en "Non-Resident LLCs".'
  },
  {
    id: 280,
    slug: 'vender-llc-cuenta-amazon-fba',
    title: '¿Puedo vender mi cuenta de Amazon Seller junto con la LLC?',
    content: 'Sí. Esta es una de las mayores ventajas de tener una LLC. En lugar de intentar transferir la cuenta de Amazon a otra persona (lo cual Amazon suele rechazar o complicar), tú simplemente vendes la entidad completa de la LLC al comprador (mediante un Purchase Agreement). El EIN, la cuenta de Amazon y la marca se mantienen intactos. Solo se cambian los beneficiarios en el banco y en la FinCEN.'
  },

  // 4. Contabilidad, Transferencias y Divisas (10 preguntas)
  {
    id: 281,
    slug: 'software-contabilidad-llc-extranjera',
    title: '¿Qué software de contabilidad se recomienda para una LLC estadounidense?',
    content: 'QuickBooks Online (versión US) y Xero son los líderes absolutos. Te permiten conectar directamente la cuenta de Mercury o Relay Bank, importar transacciones en dólares, y generar los reportes P&L (Profit & Loss) que necesitarás a fin de año para tu país y para el formulario 5472. Wave Accounting es una opción gratuita pero más limitada para no residentes.'
  },
  {
    id: 282,
    slug: 'contabilidad-en-dolares-o-euros',
    title: '¿Debo llevar la contabilidad en Dólares o en mi moneda local (Euros)?',
    content: 'La contabilidad "oficial" de la LLC (la que requiere el IRS para el 1120 proforma y 5472) se lleva en Dólares Americanos (USD). Sin embargo, a la hora de pagar tus impuestos personales en tu país (ej. IRPF en España), tendrás que convertir el beneficio neto (Net Income) de USD a EUR utilizando el tipo de cambio oficial publicado por el Banco de España o el BCE al final del ejercicio fiscal (31 de diciembre).'
  },
  {
    id: 283,
    slug: 'como-pasar-dinero-llc-a-cuenta-personal',
    title: '¿Cuál es la forma más barata de transferir dinero de Mercury a mi banco en España?',
    content: 'La forma más económica y transparente es usar un servicio de divisas especializado como **Wise** (antiguo TransferWise) o **Revolut Business**. Si haces una transferencia Wire (SWIFT) internacional directa desde Mercury a un IBAN europeo en Euros, el banco local español aplicará tipos de cambio abusivos. Es mejor enviar USD locales a Wise, y en Wise convertir a EUR con el tipo de cambio medio del mercado, para luego transferir por SEPA.'
  },
  {
    id: 284,
    slug: 'gastos-de-constitucion-deducibles-llc',
    title: '¿Son deducibles los gastos de crear la LLC y los honorarios del agente?',
    content: 'Sí. Los costes de formación (tasas del estado, honorarios de la agencia, costes del Agente Registrado) se consideran "Start-up Costs" y "Organizational Costs". En EE.UU., y de cara a tu rendimiento neto en tu país, estos gastos se deducen para reducir el beneficio del primer año, disminuyendo tus impuestos a pagar.'
  },
  {
    id: 285,
    slug: 'comisiones-stripe-deducibles',
    title: '¿Cómo contabilizo las comisiones de Stripe o PayPal?',
    content: 'Las comisiones de los procesadores de pago (ej. 2.9% + 0.30$) son gastos bancarios/financieros deducibles 100%. A nivel contable (Gross vs Net), debes registrar el ingreso de la venta bruta (Gross Sales) como ingresos, y la comisión de Stripe como "Bank Fees / Merchant Fees". Tu beneficio real será el neto, pero hacienda exige ver la trazabilidad de los gastos operativos.'
  },
  {
    id: 286,
    slug: 'nomina-vs-owners-draw',
    title: 'Diferencia contable entre Nómina (Payroll) y Owner’s Draw.',
    content: 'La nómina (Payroll) implica emitir nóminas, pagar seguros sociales, retener impuestos estatales (W-2) y se clasifica como gasto de la empresa (deducible). El "Owner’s Draw" (Retiro de Capital) es simplemente retirar beneficios líquidos (cash) de tu propia LLC a tu bolsillo. El Owner’s Draw **no es un gasto del negocio**; es una transferencia de equidad. No reduce el beneficio de la LLC (Net Income), solo reduce el efectivo en caja (Cash).'
  },
  {
    id: 287,
    slug: 'justificar-ingresos-sin-iva-espana',
    title: 'Si en España mis facturas tienen IVA, ¿cómo hago facturas sin IVA desde la LLC?',
    content: 'Dado que la LLC es una entidad americana operando bajo leyes de EE.UU., no pertenece al sistema europeo del IVA (VAT). En tus facturas a empresas europeas (invoices), simplemente incluyes tu número de EIN e indicas el precio total (0% VAT). La empresa europea compradora (B2B) aplicará el mecanismo de "Inversión del Sujeto Pasivo" (Reverse Charge) en su contabilidad local.'
  },
  {
    id: 288,
    slug: 'crypto-contabilidad-llc',
    title: '¿Cómo contabilizo si mis clientes me pagan en Criptomonedas (USDC, BTC)?',
    content: 'Fiscalmente, cripto se trata como "Propiedad". Cuando cobras un servicio por 1,000 USDC, registras $1,000 de ingresos ese día. Si meses después cambias esos USDC a dólares en un exchange (ej. Kraken) y vale $1,050, esos $50 adicionales son "Ganancias de Capital" (Capital Gains). Mantener libros contables limpios en cripto requiere softwares especializados como Koinly o CoinTracking conectados a la LLC.'
  },
  {
    id: 289,
    slug: 'tarjetas-credito-corporativas-llc',
    title: '¿Cómo contabilizo si pago gastos de la LLC con una tarjeta de crédito a mi nombre personal?',
    content: 'Si usas tu tarjeta de crédito personal (porque aún no tienes una de la LLC) para pagar el hosting o publicidad, esto se considera una Aportación de Capital (Owner Contribution) a la LLC, o puedes hacer que la LLC te "reembolse" (Expense Reimbursement). Debes generar un reporte de gastos con el justificante y transferir desde la cuenta de la LLC el monto exacto a tu cuenta personal para devolverte el dinero contablemente.'
  },
  {
    id: 290,
    slug: 'pago-dividendos-llc-hacienda',
    title: '¿El dinero que saco de la LLC tributa como rendimiento de actividad económica o como dividendo?',
    content: 'En países como España, al tratarse de una Disregarded Entity (entidad transparente), se genera un debate entre fiscalistas. La mayoría de los asesores especializados (y consultas vinculantes de la DGT) determinan que para el dueño único activo, tributa como **Rendimiento de Actividades Económicas** (IRPF base general), no como dividendos de una corporación C (Base del Ahorro). Debes consultar a tu asesor fiscal local.'
  },

  // 5. Casos de Uso Especiales y Varios (10 preguntas)
  {
    id: 291,
    slug: 'llc-para-inmobiliaria-alquileres-espana',
    title: '¿Tiene sentido crear una LLC en EE.UU. para comprar y alquilar pisos en España?',
    content: 'No. Comprar inmuebles en España a través de una LLC americana es fiscalmente ineficiente. Las propiedades inmuebles están sujetas a la tributación del país donde radican (lex rei sitae). España aplicará el Impuesto sobre la Renta de No Residentes (IRNR) sobre la LLC, obligando a retenciones, burocracia internacional notarial, sin ofrecer ninguna ventaja fiscal respecto a tenerlos a título personal o en una SL.'
  },
  {
    id: 292,
    slug: 'llc-para-desarrolladores-juegos-indie',
    title: '¿Es útil una LLC para un desarrollador de videojuegos indie en Steam o Epic Games?',
    content: 'Sí, es una estructura perfecta. Steam (Valve) y Epic Games son empresas americanas. Al abrir una LLC, proporcionas un formulario W-8BEN-E, evitando la retención de impuestos, cobras directamente en USD a tu cuenta de Mercury sin comisiones de cambio, y proteges tu patrimonio personal (tu casa, coche) en caso de que alguien demande tu juego por infracción de copyright o patentes.'
  },
  {
    id: 293,
    slug: 'llc-y-youtubers-creadores-contenido',
    title: '¿Sirve una LLC para cobrar Adsense (YouTube) o Patrocinios?',
    content: 'Sí. Muchos Youtubers internacionales usan LLCs en Wyoming para gestionar sus patrocinios y Adsense. Adsense EE.UU. no retendrá impuestos si presentas el W-8BEN-E. Además, puedes deducir los gastos de producción (cámaras, viajes, editores) a través de la LLC. Por privacidad, evita que fans busquen tu nombre y dirección en registros públicos europeos.'
  },
  {
    id: 294,
    slug: 'llc-para-agencias-marketing-smma',
    title: 'Ventajas de una LLC para una agencia de marketing digital (SMMA o SEO).',
    content: 'Si tu agencia B2B tiene clientes en EE.UU., una LLC transmite total profesionalidad local (contratas y facturas como empresa americana). Cobras mediante Stripe o ACH Transfer de forma nativa (los clientes de USA odian pagar a bancos extranjeros mediante SWIFT). Y al ser venta de servicios digitales sin nexo, te mantienes como extranjero no residente sin pagar Corporate Tax al IRS.'
  },
  {
    id: 295,
    slug: 'visados-e2-inversion-a-traves-de-llc',
    title: '¿Puedo obtener la visa de inversionista E-2 usando mi LLC?',
    content: 'Sí. El visado E-2 (Tratado de Inversionista) permite a ciudadanos de países con tratado (ej. España, Argentina, Colombia) mudarse a EE.UU. para dirigir un negocio. Puedes usar tu LLC como el vehículo de inversión. Requiere inyectar capital "sustancial y en riesgo" (generalmente más de $100,000), crear un plan de negocios que demuestre que crearás empleos para estadounidenses, y solicitar el visado en tu embajada.'
  },
  {
    id: 296,
    slug: 'visado-l1-transferencia-ejecutivos-llc',
    title: '¿Qué es la visa L-1 y cómo funciona con una LLC subsidiaria?',
    content: 'La visa L-1 permite a una empresa matriz extranjera (ej. tu SL en España) abrir una subsidiaria (una LLC) en EE.UU. y transferir ejecutivos, managers o empleados con conocimientos especializados hacia esa LLC americana. Requiere demostrar operaciones continuas en ambos países, tener oficinas físicas alquiladas en USA (Nexo) y justificar la necesidad del traslado corporativo.'
  },
  {
    id: 297,
    slug: 'multimember-llc-extranjeros-form-1065',
    title: '¿Es más compleja una LLC con dos socios extranjeros?',
    content: 'Bastante más. Dejáis de ser Disregarded Entity y pasáis a ser Partnership (Sociedad). Esto significa que la LLC debe presentar el extenso Formulario 1065, emitir K-1s y lidiar con leyes de retención para socios extranjeros (Sección 1446). El IRS puede requerir retener el 37% de los beneficios (ECI) si no se demuestra correctamente el estatus de ingresos no americanos, elevando radicalmente los costes contables (a menudo de $1,000 a $3,000 anuales en CPAs).'
  },
  {
    id: 298,
    slug: 'llc-para-importacion-exportacion-flete',
    title: '¿Puede mi LLC dedicarse a la importación masiva de bienes marítimos a EE.UU.?',
    content: 'Sí, pero se considera un negocio de alto rigor. Si importas contenedores marítimos, necesitarás obtener un "Customs Bond" (Fianza aduanera), contratar a un Customs Broker para liquidar los aranceles de entrada, registrarte posiblemente ante la FDA (si es comida o suplementos) y probablemente crearás nexo físico al almacenar y distribuir en EE.UU., lo que podría someter la empresa a impuestos (ECI).'
  },
  {
    id: 299,
    slug: 'como-funciona-la-seccion-83b-election',
    title: '¿Qué es la elección 83(b) y aplica a las LLCs?',
    content: 'La elección 83(b) es muy usada por startups en EE.UU. (usualmente C-Corps, a veces LLCs taxadas como corporaciones) donde se emiten participaciones a fundadores con un calendario de consolidación (Vesting). Permite pagar el impuesto personal sobre esas acciones AHORA, cuando el valor es cercano a 0, en lugar de en el futuro cuando el valor sea millonario. Rara vez se usa en Disregarded Entities simples de extranjeros.'
  },
  {
    id: 300,
    slug: 'resumen-final-beneficios-llc',
    title: 'Conclusión: ¿Vale la pena abrir una LLC si vivo fuera de Estados Unidos?',
    content: 'Definitivamente sí, siempre y cuando busques escalar internacionalmente, cobrar en dólares, acceder a procesadores de primer nivel (Stripe/PayPal US), y proteger tu patrimonio personal (Responsabilidad Limitada y Privacidad en Wyoming). No es para "evadir impuestos" (tributarás en tu país), sino para jugar en la primera división del comercio global sin la asfixiante burocracia corporativa europea o latinoamericana.'
  }
];

qas.forEach(qa => {
  const fileContent = '# ' + qa.title + '\n\n' + qa.content + '\n';
  const filePath = path.join(__dirname, '..', 'knowledge', 'custom', 'q' + qa.id + '-' + qa.slug + '.md');
  fs.writeFileSync(filePath, fileContent, 'utf-8');
});
console.log('Generadas ' + qas.length + ' preguntas.');
