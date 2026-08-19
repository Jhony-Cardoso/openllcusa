const fs = require('fs');
const path = require('path');

const qas = [
  // 1. Traspaso, Venta y Herencia de la LLC (10 preguntas)
  {
    id: 201,
    slug: 'como-vender-llc-a-tercero',
    title: '¿Cómo se valora y se vende una LLC a un tercero?',
    content: 'Vender una LLC estructurada como Disregarded Entity implica vender los activos (Membership Interest). La valoración suele hacerse mediante un múltiplo de las ganancias netas anuales (EBITDA) o mediante la valoración de los activos (inventario, marca, cuentas). Legalmente, debes firmar un "Membership Interest Purchase Agreement" con el comprador donde se detalla el traspaso del 100% de la propiedad y las responsabilidades asumidas.'
  },
  {
    id: 202,
    slug: 'documentos-traspaso-llc',
    title: '¿Qué documentos legales hay que firmar al traspasar la LLC?',
    content: 'El documento principal es el "Membership Interest Purchase Agreement". Además, debes redactar una resolución corporativa aprobando la venta ("Resolution to Sell LLC"), emitir un nuevo "Operating Agreement" donde el antiguo dueño cede sus derechos, y si es necesario por el estado, registrar un "Articles of Amendment" (Enmienda) para actualizar los nombres de los dueños en los registros públicos.'
  },
  {
    id: 203,
    slug: 'transferir-ein-y-cuentas-bancarias-al-vender',
    title: 'Al vender la LLC, ¿el nuevo dueño se queda con el mismo EIN y cuenta bancaria?',
    content: 'El EIN pertenece a la entidad (LLC), por lo que se mantiene. Sin embargo, debes informar al IRS del cambio de "Responsible Party" mediante el Formulario 8822-B. En cuanto a las cuentas bancarias (Mercury, Relay) y pasarelas (Stripe), generalmente el nuevo dueño deberá abrir nuevas cuentas a su nombre, o al menos someterse a un nuevo proceso estricto de KYC en el banco actual. Las cuentas bancarias no se "traspasan" automáticamente.'
  },
  {
    id: 204,
    slug: 'herencia-llc-fallecimiento-dueno-unico',
    title: '¿Qué pasa con la LLC si el dueño único fallece?',
    content: 'Si falleces y no tienes un plan estructurado, tu LLC pasará por un proceso judicial en EE.UU. llamado "Probate" (sucesión), que es largo, costoso y público. Para los extranjeros, esto puede ser una pesadilla legal. Durante ese tiempo, las cuentas bancarias se congelarán y el negocio podría paralizarse al no haber un manager autorizado para operar.'
  },
  {
    id: 205,
    slug: 'clausula-transfer-on-death-tod-llc',
    title: '¿Qué es la cláusula "Transfer on Death" (TOD) para proteger a los herederos?',
    content: 'Una de las mejores prácticas preventivas es incluir una cláusula TOD (Transfer On Death) en el Operating Agreement de tu LLC o en los certificados de membresía. Esta cláusula designa a un beneficiario directo (cónyuge, hijo, etc.) que heredará automáticamente el 100% de los intereses de la LLC en caso de fallecimiento, esquivando totalmente el costoso proceso de sucesión ("Probate Court") de EE.UU.'
  },
  {
    id: 206,
    slug: 'pasar-de-single-a-multi-member-llc',
    title: '¿Cómo cambio mi LLC de un solo dueño a múltiples dueños por entrada de inversores?',
    content: 'Para aceptar inversores, debes modificar tu "Operating Agreement" para reflejar los nuevos porcentajes de propiedad y las reglas de votación. A nivel fiscal, el cambio es drástico: tu LLC pasará de ser una Disregarded Entity (que presenta el Form 5472) a ser una Partnership (Sociedad) que debe presentar el Formulario 1065 al IRS y emitir un Schedule K-1 a cada socio anualmente.'
  },
  {
    id: 207,
    slug: 'venta-parcial-de-participaciones-llc',
    title: '¿Puedo vender solo un 20% de mi LLC a un inversor?',
    content: 'Sí, puedes vender un porcentaje fraccionado de tus intereses ("Membership Units"). Al igual que si añadieras un socio nuevo, firmarás un "Membership Interest Purchase Agreement" por ese 20%. Esto convertirá tu LLC en una Partnership ante el IRS, y el nuevo Operating Agreement dictará si ese inversor del 20% tiene poder de decisión (Voting member) o es un inversor pasivo (Non-voting / Silent partner).'
  },
  {
    id: 208,
    slug: 'responsabilidad-deudas-al-comprar-llc',
    title: 'Si compro una LLC ya existente, ¿heredo sus deudas o problemas fiscales pasados?',
    content: 'Sí, al comprar los intereses de membresía (Membership Interests) adquieres la entidad completa con todo su historial. Si la LLC tiene deudas, impuestos no pagados al IRS, o demandas pendientes, esas obligaciones seguirán vigentes bajo el nuevo dueño. Por eso, en lugar de comprar una LLC "vieja", muchos prefieren comprar únicamente los activos ("Asset Purchase") usando una LLC nueva que abren desde cero.'
  },
  {
    id: 209,
    slug: 'actualizacion-reporte-boi-al-vender',
    title: '¿Qué pasa con el reporte BOI de FinCEN cuando la LLC cambia de dueño?',
    content: 'La ley es muy estricta al respecto. Cuando se produce un cambio en los beneficiarios finales de la LLC (por venta, traspaso, o entrada de un nuevo socio con más del 25%), el nuevo responsable tiene un plazo estricto de **30 días** para presentar una actualización del reporte BOI en la FinCEN. No hacerlo conlleva multas severas de $591 por día.'
  },
  {
    id: 210,
    slug: 'fideicomisos-trusts-como-duenos-de-llc',
    title: '¿Puede un fideicomiso (Trust) ser dueño de una LLC estadounidense?',
    content: 'Sí, es una estrategia avanzada de planificación patrimonial. Un Revocable Living Trust puede ser el "Member" (dueño) de la LLC. Esto garantiza que si el creador del Trust (Grantor) fallece, la administración de la LLC pasa de inmediato al fiduciario sucesor sin pasar por sucesión judicial (Probate). A efectos fiscales, si el Trust es revocable, la LLC suele seguir tratándose como Disregarded Entity.'
  },

  // 2. Fiscalidad Avanzada e IRS (15 preguntas)
  {
    id: 211,
    slug: 'que-hacer-si-recibes-carta-irs',
    title: '¿Qué hacer si recibo una carta del IRS en la dirección de mi Registered Agent?',
    content: 'Lo primero: NO entres en pánico, pero TAMPOCO la ignores. El IRS se comunica exclusivamente por correo postal, nunca por email o teléfono. Pide a tu Agente Registrado que escanee la carta. Muchas veces son avisos informativos (como la confirmación de emisión del EIN) o peticiones rutinarias de información. Si es una notificación de auditoría o de multa (Notice of Penalty Charge), debes contactar a un CPA o Tax Attorney de inmediato, ya que los plazos de respuesta (usualmente 30-60 días) son inflexibles.'
  },
  {
    id: 212,
    slug: 'notificacion-irs-cp2100-tin-mismatch',
    title: '¿Qué es una Notificación CP2100 del IRS y por qué la puedo recibir?',
    content: 'Una notificación CP2100 se recibe cuando la información que declaraste al abrir una cuenta bancaria o un procesador de pagos (Stripe, Amazon) no coincide con los registros del IRS (TIN Mismatch). Por ejemplo, pusiste un nombre comercial incorrecto o un EIN erróneo. Si recibes esto y no lo corriges (presentando un W-8BEN o W-9 actualizado al banco), el IRS obligará al banco a retener el 24% de tus ingresos (Backup Withholding).'
  },
  {
    id: 213,
    slug: 'solicitar-penalty-abatement-multa-5472',
    title: '¿Cómo solicitar una "Penalty Abatement" (perdón de multas) si olvidé presentar el 5472?',
    content: 'Si te llega una multa de $25,000 por presentar tarde el Formulario 5472, no todo está perdido. El IRS ofrece un mecanismo llamado "Penalty Abatement" (Reducción o Perdón de Multa). Puedes argumentar "Causa Razonable" (Reasonable Cause) si hubo un motivo de peso (desastre natural, enfermedad grave del contable, desconocimiento razonable en el primer año). Un abogado fiscal puede redactar esta petición, que muchas veces resulta en el perdón total de la multa si es tu primera infracción (First-Time Abatement).'
  },
  {
    id: 214,
    slug: 'estrategia-precios-transferencia-transfer-pricing',
    title: '¿Qué es el "Transfer Pricing" si mi empresa en España y mi LLC en EE.UU. hacen negocios juntas?',
    content: 'Si eres dueño de una SL en España y una LLC en USA, y ambas se facturan servicios entre sí (por ejemplo, la SL le cobra a la LLC por desarrollo de software), estás sujeto a las leyes de Precios de Transferencia (Transfer Pricing). Las leyes internacionales exigen que las transacciones entre partes vinculadas se hagan a "valor de mercado" (Arm\'s Length Principle). No puedes facturarle a tu propia LLC 100.000€ por un servicio de 1.000€ solo para mover dinero; esto se considera evasión y serás auditado fuertemente.'
  },
  {
    id: 215,
    slug: 'estructura-holding-company-usa',
    title: '¿Qué es una LLC Holding y para qué sirve?',
    content: 'Una Holding Company es una LLC (típicamente en Wyoming o Delaware) cuyo único propósito es ser "dueña" de otras empresas (subsidiarias) o activos (patentes, inmuebles). No realiza operaciones comerciales ni ventas por sí misma. Su propósito principal es aislar el riesgo: si una LLC subsidiaria operativa es demandada y quiebra, la LLC Holding matriz y los activos de las otras subsidiarias permanecen protegidos e intocables.'
  },
  {
    id: 216,
    slug: 'deberia-abrir-holding-wyoming-y-operativa-florida',
    title: '¿Debería tener una LLC matriz en Wyoming que sea dueña de una LLC operativa en Florida?',
    content: 'Para extranjeros con pequeños negocios (e-commerce o freelance), esta estructura suele ser innecesariamente compleja y costosa (doble coste de mantenimiento, doble formulario 5472). Sin embargo, si tienes operaciones presenciales en Florida (por ejemplo, posees inmuebles de alquiler allí) y quieres privacidad total, puedes crear una LLC operativa en Florida que sea propiedad al 100% de una LLC Holding en Wyoming (donde tú eres el dueño oculto).'
  },
  {
    id: 217,
    slug: 'auditoria-irs-extranjero-nra',
    title: '¿Cuáles son las posibilidades de que el IRS me audite siendo un extranjero sin nexo físico?',
    content: 'Las estadísticas indican que el porcentaje de auditoría a LLCs pequeñas (Disregarded Entities de extranjeros) es muy bajo (menos del 1%). Sin embargo, el riesgo aumenta exponencialmente si: a) Envías tarde el Formulario 5472 recurrentemente, b) Tienes transacciones inexplicables con jurisdicciones de alto riesgo (paraísos fiscales), o c) Reclamas reembolsos de impuestos retenidos sin justificación sólida. Si actúas legalmente, el riesgo es casi nulo.'
  },
  {
    id: 218,
    slug: 'efectos-fatca-irs-y-cuentas-espanolas',
    title: '¿Puede el IRS pedirle información a los bancos españoles sobre mis cuentas personales?',
    content: 'Sí. A través de la ley FATCA (Foreign Account Tax Compliance Act), si el IRS tiene sospechas fundadas de que eres un "US Person" (ciudadano, residente o poseedor de Green Card) evadiendo impuestos, o si determinan que tu LLC generó ingresos efectivamente conectados (ECI) que ocultaste mediante estructuras offshore, el IRS puede solicitar información a las autoridades fiscales españolas y embargar activos internacionales.'
  },
  {
    id: 219,
    slug: 'irs-pide-ssn-itin-para-5472',
    title: '¿Necesito un ITIN o SSN obligatoriamente para presentar el Formulario 5472?',
    content: 'Actualmente, el IRS prefiere que el dueño extranjero tenga un ITIN (Individual Taxpayer Identification Number) para procesar el Form 5472 con mayor eficiencia. Sin embargo, no es estrictamente obligatorio si el formulario se envía por correo físico con la anotación "Foreignus / NRA" (Non-Resident Alien) en el campo del número de identificación. No obstante, tramitar un ITIN puede agilizar procesos bancarios y fiscales futuros.'
  },
  {
    id: 220,
    slug: 'que-pasa-si-mi-llc-sufre-perdidas',
    title: 'Si mi LLC tuvo más gastos que ingresos (pérdidas), ¿debo reportarlo?',
    content: 'Sí, tanto a EE.UU. como a tu país de residencia. En EE.UU., debes seguir presentando el 1120 proforma y el 5472 documentando los gastos (las pérdidas se reportarán). En tu país (ej. España), si tributas los beneficios de la LLC en tu IRPF, declarar una pérdida neta (Negative Income) puede, en algunos escenarios, servir para compensar ganancias de otras actividades económicas, reduciendo tu carga fiscal global. Un asesor fiscal local debe guiarte.'
  },
  {
    id: 221,
    slug: 'como-justificar-gastos-de-viaje-irs',
    title: '¿Cómo puedo justificar gastos de viajes a EE.UU. como gastos de negocio para mi LLC?',
    content: 'Para que un viaje a EE.UU. sea un gasto deducible frente a la hacienda de tu país (o el IRS si tuvieras nexo), debe ser de naturaleza exclusiva y obligatoria para el negocio. Debes guardar pruebas documentales: correos agendando reuniones con proveedores, tickets de conferencias, registro de ferias comerciales (trade shows), y facturas a nombre de la LLC. Gastos de acompañantes (familiares) nunca son deducibles.'
  },
  {
    id: 222,
    slug: 'impuesto-ganancias-de-capital-llc',
    title: 'Si la LLC compra acciones o criptomonedas y las vende más caras, ¿paga impuestos de ganancias de capital en EE.UU.?',
    content: 'Por regla general, si la LLC (Disregarded Entity) invierte en mercados financieros estadounidenses (ej. compra acciones de Tesla o Bitcoin) y tú eres un extranjero no residente, las ganancias de capital (Capital Gains) generadas por hacer trading NO están sujetas a impuestos en EE.UU., siempre que no estés físicamente en EE.UU. más de 183 días al año. Deberás pagar los impuestos por esas ganancias en tu país de residencia fiscal (ej. Rentas del Ahorro en España).'
  },
  {
    id: 223,
    slug: 'declarar-impuestos-de-dividendos-llc',
    title: 'Si mi LLC recibe dividendos de acciones americanas, ¿cuánto paga?',
    content: 'Los dividendos son distintos a las ganancias de capital. Si tu LLC invierte en empresas estadounidenses y recibe dividendos, estos sí generan ingresos de fuente americana (FDAP income). Al ser extranjero, el bróker (ej. Interactive Brokers) aplicará una retención fija del 30% en la fuente antes de pagarte el dividendo. Si tu país tiene un tratado fiscal con EE.UU. (como España), puedes presentar un Formulario W-8BEN para reducir esa retención (generalmente al 15%).'
  },
  {
    id: 224,
    slug: 'retencion-firpta-bienes-raices-llc',
    title: '¿Qué es FIRPTA y cómo afecta a mi LLC si compro inmuebles en EE.UU.?',
    content: 'FIRPTA (Foreign Investment in Real Property Tax Act) es una ley que aplica cuando un extranjero (incluyendo una LLC Disregarded Entity de dueño extranjero) vende una propiedad inmobiliaria en EE.UU. Al momento de la venta, el comprador está obligado por ley a retener el 15% del precio total de venta y enviarlo al IRS para garantizar que pagarás los impuestos sobre las ganancias. Para recuperar el sobrante de esa retención, deberás presentar una declaración de impuestos (Formulario 1040-NR).'
  },
  {
    id: 225,
    slug: 'llc-y-doble-imposicion-fiscal',
    title: 'En resumen, ¿cómo evita la LLC la doble imposición internacional?',
    content: 'Una LLC Disregarded Entity evita la doble imposición porque es fiscalmente "transparente" o "invisible" a nivel federal en EE.UU. Al no tener nexo físico, la LLC tributa 0% de Impuesto Corporativo en EE.UU. Por lo tanto, el 100% de las ganancias viaja hacia ti como persona física, y tú pagas impuestos una sola vez en tu país de residencia (IRPF en España). Si la LLC pagara impuestos en USA y luego tú en España, sufrirías doble imposición.'
  },

  // 3. Protección de Propiedad Intelectual (IP) y Activos (10 preguntas)
  {
    id: 226,
    slug: 'registrar-marca-uspto-nombre-llc',
    title: '¿Debería registrar mi marca comercial (Trademark) en EE.UU. a nombre personal o de la LLC?',
    content: 'Es altamente recomendable registrar la marca (Trademark) en la USPTO (Oficina de Patentes y Marcas de EE.UU.) a nombre de la LLC, no a nombre personal. Al hacerlo a nombre de la LLC, la marca se convierte en un activo de la empresa, lo que aumenta el valor de tu negocio de cara a una venta futura y protege tu patrimonio personal en caso de litigios por infracción de IP.'
  },
  {
    id: 227,
    slug: 'proceso-registro-marca-usa-extranjero',
    title: '¿Como extranjero, necesito un abogado para registrar una marca en la USPTO?',
    content: 'Sí. Las reglas de la USPTO establecen que todos los solicitantes extranjeros (incluidas las LLCs cuyos dueños residan fuera de EE.UU.) deben estar obligatoriamente representados por un abogado licenciado para ejercer en Estados Unidos para procesar el registro de la marca. No puedes tramitarlo tú mismo por tu cuenta.'
  },
  {
    id: 228,
    slug: 'licenciar-software-a-llc-americana',
    title: '¿Puedo desarrollar un software en España y "licenciarlo" a mi LLC en EE.UU. para que lo venda?',
    content: 'Sí, es una estrategia común. Tú (como individuo o desde una SL española) puedes ser el dueño de los derechos de autor (Copyright) del software y otorgarle a tu LLC americana una licencia de uso y distribución exclusiva. Esto aísla tu propiedad intelectual del riesgo operativo. Si la LLC es demandada y quiebra, la IP original (el software) sigue perteneciendo a tu entidad española y está a salvo.'
  },
  {
    id: 229,
    slug: 'proteger-dominio-web-con-llc',
    title: '¿Comprar un dominio .com a nombre de la LLC me protege en disputas UDRP?',
    content: 'Sí. Registrar tus dominios web a nombre legal de la LLC (en vez de Juan Pérez) refuerza tu argumento de que estás utilizando el dominio para fines comerciales legítimos y de buena fe. En caso de una disputa UDRP (Uniform Domain-Name Dispute-Resolution Policy) iniciada por una corporación grande intentando robar tu dominio, tener la entidad legal constituida asociada al dominio es un escudo muy fuerte.'
  },
  {
    id: 230,
    slug: 'riesgos-infraccion-copyright-llc',
    title: 'Si mi LLC infringe el Copyright de otro (ej. música o imágenes), ¿qué puede pasar?',
    content: 'Si tu LLC utiliza material protegido por derechos de autor sin licencia (como música en anuncios, imágenes de Getty, o software pirata), la empresa dueña del copyright enviará primero un "Cease and Desist" y un "DMCA Takedown". Si la demanda civil prospera y las multas superan los fondos de tu cuenta bancaria, la LLC deberá declararse en bancarrota. Gracias a la responsabilidad limitada, tus bienes personales estarán a salvo (a menos que rompieras el velo corporativo).'
  },
  {
    id: 231,
    slug: 'crear-llc-holding-para-marcas-y-patentes',
    title: '¿Debo crear una LLC separada solo para poseer mis Marcas y Patentes?',
    content: 'En estructuras avanzadas, los grandes e-commerces crean una "IP Holding LLC" (una LLC que no vende nada, solo posee las patentes, el software y las marcas). Esta LLC le "licencia" el derecho de uso a la "Operating LLC" (la LLC que hace las ventas y corre riesgos). Si la Operating LLC es demandada por un producto defectuoso y embargada, el demandante no podrá tocar ni las patentes ni la marca, ya que pertenecen a la IP Holding LLC.'
  },
  {
    id: 232,
    slug: 'patentes-en-eeuu-tramitadas-por-llc',
    title: '¿Una LLC puede solicitar patentes de invención en EE.UU.?',
    content: 'Sí. Aunque los inventores (las personas físicas) son los que inicialmente solicitan la patente ante la USPTO, los derechos pueden (y deben) ser asignados ("Assigned") formalmente a la LLC. De esta forma, la LLC pasa a ser la dueña legal (Assignee) de la patente, asumiendo los costes de tramitación y quedándose con los derechos exclusivos de explotación comercial.'
  },
  {
    id: 233,
    slug: 'proteccion-secreto-comercial-llc-nda',
    title: '¿Cómo protege mi LLC el código fuente y los secretos comerciales frente a freelancers?',
    content: 'Tu LLC debe exigir siempre que todos los freelancers, desarrolladores y contratistas internacionales firmen un Non-Disclosure Agreement (NDA - Acuerdo de Confidencialidad) y un Invention Assignment Agreement (Acuerdo de Cesión de Invenciones) ESTRICTOS antes de ver una sola línea de código. Estos contratos garantizan que cualquier cosa que programen pertenece 100% a la LLC y que no pueden copiar la idea (Non-Compete, aunque los Non-Compete son más difíciles de hacer cumplir).'
  },
  {
    id: 234,
    slug: 'llc-comprar-y-vender-dominios',
    title: '¿Es útil una LLC para un negocio de Domain Flipping (compraventa de dominios)?',
    content: 'Totalmente. El Domain Flipping genera ingresos globales y a menudo requiere procesar pagos de alto valor en dólares usando servicios de Escrow (fideicomiso). Tener una LLC en Wyoming te permite registrar cientos de dominios con la privacidad del Registered Agent, operar con cuentas bancarias comerciales en dólares sin perder en comisiones de cambio, y minimizar la carga burocrática.'
  },
  {
    id: 235,
    slug: 'que-es-el-veil-piercing-en-ip',
    title: '¿En disputas de Propiedad Intelectual, pueden levantar el velo corporativo (Veil Piercing)?',
    content: 'Sí. Si el juez descubre que usaste deliberadamente la LLC para cometer fraude, robar intencionalmente secretos comerciales, o si descubren que mezclabas el dinero de la empresa con tu cuenta personal, permitirán el "Piercing the Corporate Veil". Esto significa que tú (el dueño) serás considerado responsable personal y directo del robo de IP, y podrán ir a por tu patrimonio privado en tu país.'
  },

  // 4. Resolución de Conflictos y Demandas (10 preguntas)
  {
    id: 236,
    slug: 'que-hacer-si-me-demandan-en-usa',
    title: '¿Qué hago si mi LLC recibe una demanda judicial en EE.UU. estando yo en otro país?',
    content: 'La demanda será entregada físicamente a tu Registered Agent, quien te la enviará de inmediato escaneada (Service of Process). Tienes un plazo muy estricto (a menudo 20-30 días) para responder formalmente ante el tribunal. Debes contratar urgentemente a un abogado de litigios (Litigation Attorney) licenciado en el estado donde te demandaron. Las LLCs no pueden representarse a sí mismas ("Pro Se") en los tribunales federales o estatales, deben usar un abogado.'
  },
  {
    id: 237,
    slug: 'riesgo-de-ignorar-una-demanda-usa',
    title: '¿Qué pasa si ignoro una demanda judicial en EE.UU. creyendo que al vivir lejos no me afecta?',
    content: 'Si no respondes en plazo, el juez emitirá una sentencia en rebeldía ("Default Judgment") dándole la razón absoluta al demandante. Esto significa que la LLC le deberá la cantidad máxima solicitada. El demandante podrá entonces congelar las cuentas bancarias estadounidenses de la LLC (Mercury, Stripe) y embargar sus activos. En el peor de los casos, a través de tratados internacionales (Convenio de La Haya), podrían intentar homologar la sentencia en tu país, aunque esto es raro para LLCs sin activos.'
  },
  {
    id: 238,
    slug: 'demandas-dropshipping-productos-defectuosos',
    title: '¿Pueden demandar a mi LLC de Dropshipping por vender un producto defectuoso importado de China?',
    content: 'Sí, absolutamente. Bajo la doctrina legal de "Product Liability" (Responsabilidad del Producto), el vendedor final (tu LLC) es legalmente responsable de las lesiones o daños causados por un producto que puso en el mercado estadounidense, incluso si el producto lo fabricó y envió un tercero en China (AliExpress). Es vital contar con un Seguro de Responsabilidad Civil (General Liability Insurance) que cubra ventas de e-commerce.'
  },
  {
    id: 239,
    slug: 'que-es-un-chargeback-y-su-riesgo',
    title: '¿Qué es un Chargeback (Contracargo) masivo y por qué es tan peligroso para la LLC?',
    content: 'Un chargeback ocurre cuando un cliente se queja a su banco de que no recibió el producto o fue un fraude, y el banco revierte el pago a la fuerza quitándoselo a tu Stripe. Si tu tasa de chargebacks supera el 1% (el límite de la industria), Stripe, Shopify Payments o PayPal congelarán tu cuenta con todo tu dinero ("Account Reserve"), te pondrán en una lista negra (TMF/MATCH list) y te será casi imposible volver a aceptar pagos con tarjeta en EE.UU.'
  },
  {
    id: 240,
    slug: 'como-ganar-disputas-chargebacks',
    title: '¿Cómo puedo defender a mi LLC de clientes que abren disputas o chargebacks falsos?',
    content: 'Para ganar una disputa ("Friendly Fraud"), debes proveer pruebas irrefutables a Stripe/PayPal: un número de seguimiento (Tracking Number) que marque "Entregado" en la dirección y código postal correctos, correos de confirmación, prueba de la IP de compra, y firmas de recepción si es de alto valor. Unos Términos y Condiciones fuertes y visibles en el checkout también son vitales. Sin evidencias sólidas, el banco del cliente siempre fallará a favor del consumidor.'
  },
  {
    id: 241,
    slug: 'como-funciona-seguro-general-liability',
    title: '¿Qué es un seguro de "General Liability" y debería mi LLC tener uno?',
    content: 'El General Liability Insurance (Seguro de Responsabilidad Civil) es una póliza que protege a tu negocio si alguien demanda a la LLC alegando daños físicos, daños a la propiedad, o perjuicios por publicidad (ej. difamación o infracción de IP no intencionada). Si haces e-commerce físico o vendes en Amazon FBA, tener este seguro no solo es muy recomendable para proteger el patrimonio de la LLC, sino que a menudo es obligatorio por contrato con Amazon.'
  },
  {
    id: 242,
    slug: 'demandas-por-ada-accesibilidad-web',
    title: '¿Qué son las demandas ADA por accesibilidad web (Trolls de Patentes/ADA)?',
    content: 'Una tendencia actual en EE.UU. es recibir demandas judiciales porque tu página web (ej. tu tienda Shopify) no cumple al 100% con las normativas ADA (Americans with Disabilities Act) para personas ciegas o con deficiencias visuales (falta de textos ALT, falta de navegación por teclado). Firmas de abogados "trolls" escanean internet buscando tiendas para enviar cartas de demanda exigiendo pagos de $10,000 para no ir a juicio. Instalar widgets de accesibilidad web en tu página es crucial.'
  },
  {
    id: 243,
    slug: 'llc-y-resolucion-conflictos-mediacion',
    title: '¿Debo incluir cláusulas de Arbitraje en los Términos y Condiciones de mi LLC?',
    content: 'Sí. Es altamente recomendable que los Términos de Servicio (T&C) de tu web o tus contratos B2B incluyan una "Mandatory Arbitration Clause" (Cláusula de Arbitraje Obligatorio) y una renuncia a Demandas Colectivas (Class Action Waiver). Esto obliga a los clientes inconformes a resolver las disputas de manera privada mediante un árbitro (mucho más barato y rápido) en el estado de tu LLC (ej. Wyoming), en lugar de poder demandarte en un juzgado público en su estado de residencia.'
  },
  {
    id: 244,
    slug: 'estafas-a-llcs-extranjeras-phishing',
    title: '¿Cuáles son las estafas (Scams) más comunes dirigidas a dueños de LLCs recién creadas?',
    content: 'Al abrir una LLC en estados de registro público (como Florida), tu nombre e email quedan expuestos. Recibirás cartas falsas por correo que parecen documentos oficiales del gobierno ("U.S. Business Regulations Dept.") exigiéndote pagos de $150 a $300 por "Certificados de Estatus" obligatorios, o emails de phishing haciéndose pasar por FinCEN pidiendo los datos de tu BOI. Solo confía en comunicaciones oficiales enviadas a través de tu Registered Agent.'
  },
  {
    id: 245,
    slug: 'puedo-demandar-a-un-cliente-usa-desde-extranjero',
    title: '¿Puedo usar mi LLC para demandar a un cliente o empresa en EE.UU. que no me paga?',
    content: 'Sí, tu LLC es una entidad jurídica americana con pleno derecho a iniciar demandas en los tribunales de EE.UU. (State or Federal Court). Si un cliente de Texas te debe $50,000, puedes contratar a un abogado y presentar la demanda. Sin embargo, los costes legales son altos. Para deudas pequeñas (ej. $3,000), existe la corte de reclamos menores ("Small Claims Court"), pero generalmente requiere presencia física, por lo que suele salir mejor contratar a una Agencia de Cobros (Collection Agency).'
  },

  // 5. Cierre y Liquidación Total (5 preguntas)
  {
    id: 246,
    slug: 'proceso-para-cerrar-llc-correctamente',
    title: '¿Cuál es el proceso definitivo para cerrar y liquidar una LLC correctamente?',
    content: 'Para cerrar una LLC, debes seguir 4 pasos formales: 1) Los miembros aprueban la disolución. 2) Liquidar los activos, pagar deudas a proveedores y transferir el sobrante al dueño. 3) Presentar los "Articles of Dissolution" (Artículos de Disolución) ante la Secretaría de Estado pagando la tasa correspondiente. 4) Cerrar cuentas bancarias, cancelar permisos estatales y notificar al IRS para que den de baja el EIN.'
  },
  {
    id: 247,
    slug: 'notificar-al-irs-cierre-llc',
    title: '¿Cómo le aviso al IRS que he cerrado mi LLC?',
    content: 'El IRS no sabrá que tu LLC cerró a nivel estatal si no se lo dices. Al presentar la declaración de impuestos (Formulario 1120 proforma y Formulario 5472) por última vez, debes marcar la casilla que indica "Final Return" (Declaración Final). Además, es recomendable enviar una carta formal al IRS adjuntando los Artículos de Disolución del estado, solicitando el cierre de la cuenta asociada al EIN.'
  },
  {
    id: 248,
    slug: 'riesgos-de-no-presentar-final-return',
    title: '¿Qué pasa si disuelvo la LLC en el estado pero olvido enviar el Final Return (5472) al IRS?',
    content: 'Este es un error que puede ser catastrófico. Si cierras la LLC pero el IRS no procesa el "Final Return", su sistema asumirá que la LLC sigue activa y esperará el Formulario 5472 al año siguiente. Si no lo envías, generarán automáticamente la multa de $25,000. Nunca debes olvidar cerrar la entidad a nivel federal con el IRS.'
  },
  {
    id: 249,
    slug: 'repatriacion-capital-al-cerrar-llc',
    title: '¿Cómo repatrio el dinero final a mi país al liquidar la LLC?',
    content: 'El dinero sobrante tras pagar todas las deudas comerciales debe transferirse a tu cuenta personal europea o local como una Distribución de Liquidación (Liquidating Distribution). A nivel contable, se considera un ingreso personal y debes declararlo en tu país de residencia fiscal (ej. IRPF en España). Asegúrate de realizar esta transferencia de fondos ANTES de cerrar la cuenta de Mercury Bank, porque una vez disuelta la LLC, no podrás operar esa cuenta.'
  },
  {
    id: 250,
    slug: 'cerrar-stripe-y-servicios-asociados-llc',
    title: '¿Debo cerrar manualmente Stripe y AWS al disolver la LLC?',
    content: 'Sí, absolutamente. Disolver la LLC no cancela automáticamente tus suscripciones. Debes procesar todos los cobros pendientes, emitir reembolsos finales si aplica, y cerrar formalmente tu cuenta de Stripe para evitar chargebacks tardíos sobre una cuenta bancaria inexistente. Luego, cancela todas las suscripciones (AWS, Shopify, servidores, servicios de email) para que no sigan intentando cobrar a una tarjeta cancelada, lo que generaría deudas corporativas post-disolución.'
  }
];

qas.forEach(qa => {
  const fileContent = '# ' + qa.title + '\n\n' + qa.content + '\n';
  const filePath = path.join(__dirname, '..', 'knowledge', 'custom', 'q' + qa.id + '-' + qa.slug + '.md');
  fs.writeFileSync(filePath, fileContent, 'utf-8');
});
console.log('Generadas ' + qas.length + ' preguntas.');
