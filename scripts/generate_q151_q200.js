const fs = require('fs');
const path = require('path');

const qas = [
  {
    id: 151,
    slug: 'error-mezclar-finanzas-personales-llc',
    title: '¿Por qué no debes mezclar gastos personales y de la LLC (Piercing the Corporate Veil)?',
    content: 'Uno de los mayores errores al tener una LLC es usar su cuenta bancaria como si fuera tu monedero personal. Pagar la compra del supermercado en España, tu alquiler personal o el colegio de tus hijos con la tarjeta de la LLC rompe la separación legal entre tú y la empresa. Esto se conoce en EE.UU. como "Piercing the Corporate Veil" (Levantar el velo corporativo). Si hay una demanda o el IRS/Hacienda auditan la cuenta, pueden determinar que la LLC es una farsa y hacerte responsable personalmente de las deudas y problemas de la empresa, perdiendo la protección de responsabilidad limitada.'
  },
  {
    id: 152,
    slug: 'error-no-declarar-llc-hacienda-espana',
    title: '¿Qué pasa si no declaro mi LLC a Hacienda en mi país (ej. España)?',
    content: 'Un error muy grave (y común) es pensar que al ser una LLC en EE.UU. y "libre de impuestos" allí, no tienes que declararla en tu país de residencia. Si resides fiscalmente en España u otro país, estás obligado a declarar tus ingresos mundiales. Al ser una Disregarded Entity, los beneficios de la LLC fluyen hacia ti y debes declararlos en tu IRPF. Además, en España debes presentar el **Modelo 720** (si tienes más de 50.000€ en cuentas en el extranjero) y el **Modelo D6 o D1A** para Inversiones en el Exterior. No hacerlo conlleva multas masivas por ocultación de patrimonio e ingresos.'
  },
  {
    id: 153,
    slug: 'error-no-hacer-contrato-operativo-llc',
    title: '¿Por qué no debes operar sin un Operating Agreement escrito?',
    content: 'Aunque algunos estados no obligan legalmente a presentar un Operating Agreement (Acuerdo Operativo) al crear la LLC, operar sin uno es un gran riesgo. El Operating Agreement es el documento interno que dicta cómo funciona la LLC, su estructura de propiedad, cómo se reparten los beneficios y qué pasa en caso de disolución. Sin este documento, tu LLC se rige por las leyes por defecto del estado, que pueden no ser favorables. Además, casi todos los bancos serios (como Mercury, Relay) y plataformas como Stripe te exigirán este documento para abrir una cuenta o verificar el negocio.'
  },
  {
    id: 154,
    slug: 'error-creer-que-llc-te-salva-del-iva-europeo',
    title: '¿Es cierto que con una LLC me ahorro cobrar el IVA a clientes en Europa?',
    content: 'Falso. Este es un mito peligroso. Las reglas del IVA dependen de dónde está tu cliente y del tipo de servicio, no de dónde esté registrada tu empresa. Si vendes servicios digitales (software, cursos, e-books) B2C (a consumidores finales) en la Unión Europea, estás obligado a recaudar y liquidar el IVA del país de residencia de tu cliente, sin importar que operes a través de una LLC americana. Para ello, existe el sistema OSS (One Stop Shop - Non-Union scheme). Ignorar esto puede causarte problemas serios con las autoridades fiscales europeas.'
  },
  {
    id: 155,
    slug: 'error-no-presentar-formulario-5472-a-tiempo',
    title: '¿Qué pasa si olvido presentar el formulario 5472 y 1120 proforma al IRS?',
    content: 'Este es el error administrativo más costoso que puedes cometer con una LLC extranjera (Disregarded Entity). Si tu LLC tuvo "Transacciones Reportables" (como que le hayas inyectado capital, pagado gastos de formación desde tu cuenta personal, o cobrado beneficios), es obligatorio presentar el Formulario 5472 junto con un 1120 proforma al IRS. La fecha límite suele ser el 15 de abril. Si no lo presentas o lo haces tarde, la multa automática del IRS es de **$25,000 USD**. Nunca debes ignorar este trámite.'
  },
  {
    id: 156,
    slug: 'error-contratar-empleados-usa-desde-llc',
    title: '¿Por qué no debes contratar empleados físicos en EE.UU. desde tu LLC extranjera?',
    content: 'Si tu objetivo es mantener la LLC como una Disregarded Entity sin nexo físico ("No ETB" - Engaged in Trade or Business in the US) para no pagar impuestos federales, no debes tener empleados dependientes físicos en Estados Unidos (W-2 employees). Tener un empleado trabajando en territorio estadounidense genera un nexo físico automático ("Physical Presence Nexus"). Esto convertirá a tu LLC en sujeto de impuestos corporativos en EE.UU. (ECI - Effectively Connected Income) y te obligará a presentar declaraciones de impuestos mucho más complejas (1040-NR), además de lidiar con leyes laborales y retenciones estatales.'
  },
  {
    id: 157,
    slug: 'error-tener-oficina-fisica-usa-llc',
    title: '¿Por qué no debes alquilar una oficina o almacén físico en EE.UU.?',
    content: 'Al igual que con los empleados, tener una instalación física fija (oficina, almacén, servidores de tu propiedad gestionados por ti) en Estados Unidos crea lo que el IRS llama un "Establecimiento Permanente" o un nexo físico. Esto destruye tu condición de extranjero no residente exento de impuestos sobre ingresos. Si creas este nexo, los beneficios de tu LLC se considerarán ingresos efectivamente conectados con EE.UU. (ECI) y tendrás que pagar impuestos federales y estatales (Income Tax) sobre las ganancias de la empresa. Usa siempre la dirección virtual de tu Registered Agent.'
  },
  {
    id: 158,
    slug: 'error-ignorar-el-sales-tax-estados-unidos',
    title: '¿Qué pasa si vendo productos físicos en EE.UU. y no recaudo Sales Tax?',
    content: 'Si haces e-commerce (como Amazon FBA, Shopify o Dropshipping) y vendes a clientes dentro de Estados Unidos, puedes generar "Nexo Económico" (Economic Nexus) si superas cierto umbral de ventas (usualmente $100,000 en ventas o 200 transacciones) en un estado específico. Si esto pasa, estás legalmente obligado a registrarte en ese estado y recaudar el Sales Tax (impuesto sobre las ventas) de tus clientes para luego remitirlo al estado. Ignorar el Sales Tax resultará en auditorías estatales y te cobrarán el impuesto de tu propio bolsillo más multas e intereses.'
  },
  {
    id: 159,
    slug: 'error-no-presentar-reporte-boi-fincen',
    title: '¿Por qué es un error fatal no presentar el reporte BOI (Beneficial Ownership Information)?',
    content: 'Desde el 1 de enero de 2024, la Corporate Transparency Act obliga a casi todas las LLCs a presentar un reporte BOI a la FinCEN (Financial Crimes Enforcement Network) detallando quiénes son los beneficiarios finales de la empresa. Si creaste tu LLC antes de 2024 tenías un año de plazo; si la creas ahora, tienes solo 90 o 30 días para hacerlo. No presentar el reporte BOI a tiempo no es una simple falta administrativa: conlleva multas de **$591 por día** de retraso e incluso penas criminales de hasta 2 años de prisión. Nunca debes olvidar este paso.'
  },
  {
    id: 160,
    slug: 'error-abrir-cuenta-banco-sin-resolucion-corporativa',
    title: '¿Por qué no debes abrir cuentas bancarias o de pasarela sin un "Banking Resolution"?',
    content: 'Un Banking Resolution (Resolución Bancaria) es un documento interno donde los miembros de la LLC autorizan oficialmente a una persona específica (normalmente tú) a abrir y manejar cuentas bancarias en nombre de la empresa. Operar sin documentar estas decisiones expone a la LLC a problemas de responsabilidad en caso de disputa. Además, bancos tradicionales en EE.UU. y algunas plataformas estrictas te lo pedirán para verificar que tienes la autoridad legal para operar los fondos de la LLC.'
  },
  {
    id: 161,
    slug: 'error-no-renovar-registered-agent',
    title: '¿Qué ocurre si dejo de pagar la cuota de mi Registered Agent en EE.UU.?',
    content: 'El Registered Agent (Agente Registrado) es un requisito legal continuo en todos los estados. Si dejas de pagar a tu proveedor y este renuncia a representarte, tu LLC se quedará sin una dirección legal para recibir notificaciones del estado y del gobierno. Al poco tiempo (usualmente de 30 a 60 días), el estado revocará tu LLC administrativamente (Administratively Dissolved). Perderás la protección de responsabilidad limitada, no podrás operar y el banco cerrará tus cuentas. Reactivarla te costará multas altas y mucho papeleo.'
  },
  {
    id: 162,
    slug: 'error-pagarse-nomina-w2-llc-extranjero',
    title: '¿Puedo ponerme una nómina/salario fijo desde mi LLC siendo extranjero?',
    content: 'No debes hacerlo si tu LLC es una Disregarded Entity (Single-Member LLC). Fiscalmente, tú y la LLC sois la misma entidad. No puedes ser "empleado" de ti mismo ni emitirte un formulario W-2. La forma correcta de sacar dinero es mediante **Owner\'s Draws** (retiros del dueño o distribuciones). Simplemente transfieres el dinero de la cuenta de la LLC a tu cuenta personal y lo registras en la contabilidad como una distribución de beneficios. Intentar crear una nómina en EE.UU. sin SSN y visado es ilegal e innecesario.'
  },
  {
    id: 163,
    slug: 'error-abandonar-llc-en-vez-de-disolverla',
    title: '¿Por qué no debes simplemente "abandonar" la LLC si ya no la usas?',
    content: 'Muchos cometen el error de dejar de pagar los reportes anuales (Annual Reports) pensando que la LLC "se cierra sola". Aunque el estado la disolverá administrativamente, seguirás acumulando multas, penalidades por retraso y daños a tu historial comercial. Peor aún, el IRS no sabrá que cerraste y esperará que sigas presentando el Formulario 5472 cada año. Si no lo presentas, te arriesgas a la multa de $25,000. Siempre debes cerrar la LLC formalmente presentando los Artículos de Disolución en el estado y avisando al IRS para cancelar el EIN.'
  },
  {
    id: 164,
    slug: 'error-usar-w9-en-lugar-de-w8ben',
    title: '¿Qué pasa si entrego un formulario W-9 a mis clientes en lugar de un W-8BEN?',
    content: 'El formulario W-9 es exclusivo para personas estadounidenses (US Persons) o entidades sujetas a impuestos en EE.UU. Como extranjero no residente con una Single-Member LLC, a efectos fiscales eres tú quien provee el servicio. Debes entregar un formulario **W-8BEN** (o W-8BEN-E si aplica) para certificar que eres extranjero y evitar que tus clientes americanos te retengan el 30% de tus pagos por orden del IRS. Mentir y firmar un W-9 comete perjurio fiscal y te obligará a presentar declaraciones de impuestos como residente.'
  },
  {
    id: 165,
    slug: 'error-firmar-contratos-a-titulo-personal',
    title: '¿Por qué es un error firmar contratos a tu nombre y no a nombre de la LLC?',
    content: 'Si firmas acuerdos, contratos de servicios, NDAs o arrendamientos a título personal (ej. "Juan Pérez") en lugar de hacerlo a nombre de la empresa (ej. "Juan Pérez, como Manager de Mi Negocio LLC"), estás asumiendo la responsabilidad personal directa de ese contrato. Si hay un incumplimiento, te demandarán a ti, y tus activos personales (tu casa, tu cuenta bancaria) estarán en riesgo, porque la LLC no fue parte del acuerdo. Siempre firma indicando tu cargo en la LLC.'
  },
  {
    id: 166,
    slug: 'error-creer-que-eres-anonimo-frente-al-irs',
    title: '¿Si mi LLC es en Wyoming o Delaware, soy totalmente anónimo y el IRS no sabe quién soy?',
    content: 'Este es uno de los mitos más peligrosos. La privacidad que ofrecen estados como Wyoming es **pública** (tu nombre no sale en el registro web para que lo vea un curioso en Google). Sin embargo, NO existe privacidad frente al gobierno de Estados Unidos. Para sacar el EIN debes declarar quién es el Responsible Party (tú) ante el IRS. Para la FinCEN debes presentar tu pasaporte en el reporte BOI. Y para abrir un banco, pasarás por un estricto KYC. El IRS, la FinCEN y los bancos saben exactamente quién eres.'
  },
  {
    id: 167,
    slug: 'error-transferir-fondos-a-terceros-no-socios',
    title: '¿Puedo usar la cuenta de la LLC para enviarle dinero a familiares o amigos en mi país?',
    content: 'No debes hacerlo. Las transferencias internacionales desde la cuenta bancaria de tu negocio hacia individuos que no son empleados, contratistas (con facturas justificativas) o socios de la LLC levantan alarmas inmediatas de lavado de dinero (AML) en bancos como Mercury, Relay o Wise. Te arriesgas a que bloqueen tu cuenta y te pidan explicaciones legales. Si quieres regalar dinero a tu familia, primero transfiere los beneficios (Owner\'s Draw) a tu cuenta personal, y desde tu cuenta personal haz lo que quieras.'
  },
  {
    id: 168,
    slug: 'error-vender-servicios-regulados-sin-licencia',
    title: '¿Puedo ofrecer cualquier tipo de servicio médico, legal o financiero desde mi LLC?',
    content: 'No. Una LLC no es un escudo mágico para evadir regulaciones profesionales. Si tu empresa va a ofrecer servicios como asesoría financiera, telemedicina, consultoría legal, ingeniería o seguros a clientes en EE.UU., necesitas las licencias profesionales estatales y/o federales correspondientes. Operar sin licencia en industrias reguladas en EE.UU. se considera un delito y te expondrá a demandas civiles y penales enormes donde la LLC no te protegerá en absoluto.'
  },
  {
    id: 169,
    slug: 'error-no-llevar-facturas-ni-recibos',
    title: '¿Qué pasa si no guardo recibos ni genero facturas (invoices) por las operaciones de la LLC?',
    content: 'Aunque en EE.UU. no haya un formato oficial y rígido de "factura" como en España, la contabilidad requiere justificantes. Si recibes depósitos en tu cuenta bancaria y no tienes contratos o Invoices que justifiquen de dónde viene el dinero, en caso de una revisión del banco por AML (Anti-Money Laundering) te cerrarán la cuenta. Además, a la hora de pagar impuestos en tu país (donde resides fiscalmente), Hacienda te exigirá pruebas de todos los gastos que te has deducido en la LLC. Sin facturas, la contabilidad no tiene validez legal.'
  },
  {
    id: 170,
    slug: 'error-creer-que-llc-da-visado-automatico',
    title: '¿Es cierto que abrir una LLC me da derecho a una Visa de trabajo o Green Card?',
    content: 'Falso. La creación de una entidad comercial (LLC, Inc.) y las leyes de inmigración (USCIS) van por caminos totalmente separados. Abrir una LLC no te otorga ningún estatus migratorio, ni visado, ni permiso para vivir en Estados Unidos. Aunque existen visados para inversores (E-2) o de negocios (L-1), requieren procesos altamentes complejos, inversiones cuantiosas (muchas veces de más de $100,000), empleados en EE.UU. y la aprobación de la embajada. Abrir la LLC por $300 no te permite mudarte a USA.'
  },
  {
    id: 171,
    slug: 'error-asumir-que-impuestos-son-ceros-siempre',
    title: '¿Por qué no debes asumir que siempre pagarás "cero impuestos" con una LLC?',
    content: 'El marketing de internet vende la LLC como libre de impuestos, pero eso tiene asteriscos. La LLC no paga impuestos en EE.UU. (a nivel federal) SI y SOLO SI eres un extranjero no residente (NRA), no tienes nexo físico en EE.UU., y es una Single-Member (o partnership de extranjeros). Pero **SÍ** debes pagar impuestos sobre esos beneficios en tu país de residencia fiscal (ej. el IRPF en España). La riqueza siempre tributa en algún lado; la LLC simplemente evita que tributes en dos países a la vez (evita la doble imposición).'
  },
  {
    id: 172,
    slug: 'error-multi-member-llc-sin-saberlo',
    title: '¿Qué ocurre si añado a un familiar a la LLC para que tenga un %?',
    content: 'Poner a otra persona (aunque sea cónyuge, si no viven en un estado de gananciales de USA) convierte automáticamente a tu LLC de una "Disregarded Entity" a una "Partnership" (Sociedad) ante los ojos del IRS. Esto cambia radicalmente tus obligaciones fiscales: ya no presentas el Formulario 5472, sino el **Formulario 1065** (Partnership Return of Income) y se deben emitir K-1s a cada socio. Es un reporte mucho más complejo, costoso de hacer con un CPA, y con multas por retraso de cientos de dólares por socio y por mes.'
  },
  {
    id: 173,
    slug: 'error-pagar-autonomo-con-cuenta-llc',
    title: '¿Puedo domiciliar la cuota de autónomos de España en la cuenta bancaria de la LLC?',
    content: 'No debes hacerlo. La cuota de la Seguridad Social / Autónomo en España (o tu país) es un impuesto/seguro a título personal y directo vinculado a tu residencia física y estatus laboral en tu país. Pagarlo directamente desde la LLC estadounidense mezcla finanzas personales y de empresa (Piercing the veil). Lo correcto es transferir fondos de la LLC a tu banco personal europeo como un Owner\'s Draw, y desde tu cuenta personal pagar la cuota de autónomo.'
  },
  {
    id: 174,
    slug: 'error-comprar-coche-personal-a-nombre-llc',
    title: '¿Por qué no debo comprar un coche para uso personal en mi país a nombre de la LLC?',
    content: 'Primero, a efectos contables en tu país (ej. Hacienda en España), usar bienes de la empresa para fines 100% personales y deducirlos como gasto de la LLC es fraude fiscal. Segundo, a nivel práctico, los concesionarios y aseguradoras en Europa no sabrán cómo lidiar con una LLC estadounidense para el registro del vehículo, el seguro no cubrirá siniestros si descubren el fraude, y al final estarás rompiendo el velo corporativo de nuevo.'
  },
  {
    id: 175,
    slug: 'error-usar-ein-como-si-fuera-ssn',
    title: '¿Puedo usar el EIN de mi LLC como si fuera mi Seguro Social (SSN) en EE.UU.?',
    content: 'No. El EIN (Employer Identification Number) identifica únicamente a tu negocio frente al IRS para fines fiscales (como el CIF o NIF de empresa). No te otorga identidad personal en Estados Unidos, no sirve para pedir tarjetas de crédito personales americanas ni para crear un historial crediticio personal (FICO Score), y mucho menos reemplaza al Social Security Number o al ITIN para cuestiones migratorias o personales.'
  },
  {
    id: 176,
    slug: 'error-ignorar-ley-proteccion-datos-europea',
    title: '¿Siendo una LLC en EE.UU., puedo ignorar la RGPD (GDPR) al tener clientes europeos?',
    content: 'Es un error grave pensar que la jurisdicción de EE.UU. te exime de las leyes de privacidad de Europa. Si tu LLC tiene clientes residentes en la Unión Europea, recopila sus datos (emails para newsletters, direcciones de envío en e-commerce), o hace retargeting con cookies, estás obligado legalmente a cumplir con el RGPD (Reglamento General de Protección de Datos). No tener políticas de privacidad claras o avisos de cookies válidos para Europa te expone a demandas y multas internacionales severas.'
  },
  {
    id: 177,
    slug: 'error-abrir-stripe-personal-y-llc-juntos',
    title: '¿Por qué no debo mezclar cuentas de Stripe de la LLC con negocios a título personal?',
    content: 'Si tenías una cuenta de Stripe a tu nombre (como autónomo) y creas una LLC, debes abrir una cuenta de Stripe **completamente nueva** bajo la entidad legal de la LLC con su EIN. Intentar cambiar la titularidad de la cuenta antigua o mezclar flujos de dinero puede causar que Stripe marque tu cuenta por riesgo de fraude, bloqueando tus fondos (retenciones de 90 a 120 días) e inhabilitándote para usar su plataforma en el futuro.'
  },
  {
    id: 178,
    slug: 'error-declarar-viajes-placer-como-negocios',
    title: '¿Puedo deducir viajes turísticos a Miami o Nueva York como "gastos de la LLC"?',
    content: 'Tus gastos de la LLC deben justificarse ante la Hacienda de tu país (al declarar el rendimiento neto). Si vas de vacaciones con tu familia a Miami y lo pasas como gasto de empresa sin que haya habido reuniones comerciales comprobables, convenciones, o prospección real justificada (con emails, agendas, facturas), estás cometiendo fraude. Ante una inspección en tu país, esos gastos serán rechazados, tu beneficio neto aumentará retroactivamente, y serás multado con recargos por impuestos no pagados.'
  },
  {
    id: 179,
    slug: 'error-usar-mercury-para-p2p-crypto',
    title: '¿Por qué es un error usar bancos como Mercury o Relay para hacer trading P2P de Criptomonedas?',
    content: 'Bancos fintech estadounidenses como Mercury o Relay tienen políticas de cumplimiento (Compliance) extremadamente estrictas respecto a las criptomonedas debido al riesgo de lavado de dinero. Si usas la cuenta de la LLC para hacer operaciones P2P (Peer-to-Peer) en plataformas como Binance, KuCoin o Paxful, tu cuenta será cerrada de inmediato y sin previo aviso, congelando tus fondos durante meses mientras investigan el origen del dinero. Las LLCs de EE.UU. no son aptas para usar en ecosistemas crypto no regulados.'
  },
  {
    id: 180,
    slug: 'error-no-presentar-fbar-si-hay-criptos-o-dinero',
    title: '¿Qué es el FBAR y qué pasa si no declaro mis cuentas extranjeras en mi país?',
    content: 'Aunque EE.UU. tiene el FBAR (para residentes de EE.UU. con dinero fuera), si tú vives en España (o gran parte de Latinoamérica), tú tienes obligaciones equivalentes en tu país. En España es el Modelo 720. Si el saldo de las cuentas de tu LLC (o tus cuentas personales fuera de España) suma más de 50.000€ a 31 de diciembre, o de saldo medio en el último trimestre, estás obligado a informarlo a Hacienda. No declarar que tienes una cuenta en Mercury Bank con $80,000 es una infracción gravísima.'
  },
  {
    id: 181,
    slug: 'error-creer-que-irs-no-cruza-datos-fatca',
    title: '¿Por qué no debes creer que tus finanzas en EE.UU. son invisibles para tu país?',
    content: 'Aunque EE.UU. no firmó el CRS (Common Reporting Standard) mundial, sí tiene FATCA (Foreign Account Tax Compliance Act) y tratados bilaterales de intercambio de información con decenas de países (incluyendo España y casi toda Latinoamérica). Si tu país tiene un tratado y solicita información sobre ti (o se hacen intercambios automáticos de cuentas controladas por extranjeros), el IRS compartirá los datos bancarios y fiscales de tu LLC. Ocultar la LLC es evasión fiscal e ilegal.'
  },
  {
    id: 182,
    slug: 'error-retirar-todo-saldo-llc-cero',
    title: '¿Por qué no debes vaciar completamente la cuenta bancaria de tu LLC?',
    content: 'Dejar el balance de la cuenta de tu LLC habitualmente a $0.00 es una mala práctica bancaria y legal. Los bancos y plataformas de procesamiento de pagos (Stripe, PayPal) evalúan tu riesgo constantemente. Si ven que no tienes liquidez y te llega un "chargeback" (contracargo) o un reembolso y tu cuenta no puede cubrirlo, bloquearán tu cuenta inmediatamente por alto riesgo (High Risk). Además, dejar capital en la cuenta demuestra que la LLC es un negocio legítimo y operativo (evita el "Piercing the veil").'
  },
  {
    id: 183,
    slug: 'error-prestar-dinero-a-llc-sin-contrato',
    title: '¿Qué pasa si inyecto dinero en la LLC desde mi cuenta personal y no lo documento?',
    content: 'Cuando la LLC necesita liquidez inicial (por ejemplo, para pagar inventario o publicidad), es normal aportarle capital. Sin embargo, no debes simplemente enviar el dinero y ya. Debes documentarlo en la contabilidad como una "Aportación de Capital" (Capital Contribution) o realizar un documento de préstamo entre tú y tu LLC (Promissory Note). De lo contrario, en una auditoría, tu país podría considerar al devolverte el dinero que son ingresos gravables (dividendos), o EE.UU. podría verlo como una transacción dudosa. Además, inyectar capital genera obligación de presentar el Formulario 5472.'
  },
  {
    id: 184,
    slug: 'error-asumir-que-la-llc-paga-tus-impuestos',
    title: '¿La LLC retiene o paga mis impuestos personales de fin de año automáticamente?',
    content: 'No. Al ser una Disregarded Entity, la LLC no paga impuestos corporativos y **tampoco retiene** impuestos por ti. Todos los beneficios generados son tuyos fiscalmente. Si a final de año la LLC generó $50,000 de beneficio, el responsable de separar una parte de ese dinero (ej. 20-30%) para pagar el impuesto sobre la renta (IRPF en España) el año siguiente, eres tú. Nunca te gastes el 100% de los beneficios de la LLC, porque cuando llegue la temporada de impuestos en tu país, tendrás que pagar.'
  },
  {
    id: 185,
    slug: 'error-vender-llc-como-traspaso-facil',
    title: '¿Puedo simplemente "vender" o traspasar mi LLC cediendo las contraseñas?',
    content: 'Transferir la propiedad de una LLC no es como dar la contraseña de una cuenta de Netflix. Requiere actualizar el Operating Agreement, registrar el cambio de propiedad (si el estado lo exige), notificar al IRS para que actualice el "Responsible Party" asociado al EIN (Formulario 8822-B), presentar un nuevo reporte BOI a la FinCEN en menos de 30 días, y realizar un nuevo KYC en los bancos (los cuales probablemente cerrarán la cuenta y pedirán que el nuevo dueño aplique de nuevo). Hacerlo informalmente es un desastre legal.'
  },
  {
    id: 186,
    slug: 'error-usar-agente-registrado-falso-o-barato',
    title: '¿Por qué no debes usar un Agente Registrado "ultrabarato" o la dirección de un amigo?',
    content: 'El Agente Registrado es la piedra angular legal de tu LLC en EE.UU. Usar a un familiar o amigo que viva en el estado no es buena idea: si se mudan, se van de vacaciones o ignoran una carta legal certificada del estado (como una demanda judicial), perderás el caso por defecto (Default Judgment) o tu LLC será revocada. Usar servicios de $25 al año suele implicar un servicio pésimo, ocultación de tarifas (upsells forzados), y pérdida de documentos clave. Invierte en un Agente profesional y de reputación.'
  },
  {
    id: 187,
    slug: 'error-trabajar-presencial-con-visado-esta',
    title: '¿Puedo viajar a EE.UU. con un ESTA o visado de turista y trabajar para mi LLC?',
    content: 'Totalmente prohibido. El visado B1/B2 o el ESTA (Visa Waiver Program) te permiten ir a EE.UU. a realizar negocios puntuales: firmar contratos, ir a conferencias, buscar proveedores o tener reuniones. Pero NO te permiten "trabajar" activamente, operar el día a día de tu negocio desde territorio americano, ni percibir remuneración en suelo estadounidense. Si los agentes de Aduanas y Protección Fronteriza (CBP) sospechan que vas a trabajar, te deportarán y te prohibirán la entrada al país por años.'
  },
  {
    id: 188,
    slug: 'error-operar-bajo-un-dba-sin-registrarlo',
    title: '¿Por qué no debes usar un nombre comercial distinto al de tu LLC sin un DBA?',
    content: 'Si tu LLC se llama "Alpha Tech LLC" pero operas una tienda de ropa en Shopify bajo el nombre "Beta Clothing", estás usando un nombre comercial (DBA - Doing Business As). Legalmente no debes cobrar a clientes ni abrir procesadores de pago bajo un nombre inventado que no está registrado en el estado. Para hacerlo de forma legal y mantener el velo corporativo, debes presentar un registro de DBA (o Fictitious Name) en el estado de formación, vinculando tu marca comercial con tu LLC legal.'
  },
  {
    id: 189,
    slug: 'error-depositar-cheques-personales-en-llc',
    title: '¿Puedo depositar cheques a mi nombre personal en la cuenta de la LLC?',
    content: 'No. Los bancos de negocios en EE.UU. rechazarán inmediatamente cualquier transferencia o cheque que no esté a nombre exacto de la LLC o de su DBA registrado. Si intentas depositar un cheque que va dirigido a "Juan Pérez" en la cuenta de "Juan Pérez LLC", el banco lo devolverá por discrepancia de beneficiario (Payee Name Mismatch), y si lo intentas repetidamente, te cerrarán la cuenta por sospechas de fraude o mal uso de cuenta corporativa.'
  },
  {
    id: 190,
    slug: 'error-tratar-contratistas-como-empleados',
    title: '¿Qué pasa si trato a freelancers internacionales como empleados a tiempo completo?',
    content: 'Si contratas a freelancers en Latam o Europa para tu LLC, debes tratarlos como Contratistas Independientes (Independent Contractors). Si empiezas a dictar sus horarios estrictos, proveerles equipos, exigir exclusividad, e integrarlos de forma dependiente en la estructura, puedes caer en "Employee Misclassification". Aunque estén en otro país, te arriesgas a demandas laborales en sus países de origen, y si son americanos, el IRS te castigará con multas retroactivas por no pagar impuestos de nómina (Payroll taxes).'
  },
  {
    id: 191,
    slug: 'error-creer-que-delaware-no-paga-impuestos',
    title: '¿Por qué es un error creer que Delaware no cuesta nada de mantener?',
    content: 'Muchos creadores recomiendan Delaware porque "no tiene Sales Tax", pero olvidan el mantenimiento corporativo. Toda LLC en Delaware está obligada a pagar un "Franchise Tax" (Impuesto de Franquicia) de mínimo $300 dólares cada año (antes del 1 de junio), produzcas o no dinero, y sin importar que seas un extranjero con una Disregarded Entity. Si omites este pago, se suma una multa automática de $200 más intereses mensuales del 1.5%. Wyoming es mucho más económico para e-commerce e infoproductos ($62/año).'
  },
  {
    id: 192,
    slug: 'error-hacer-drophipping-sin-certificados-exencion',
    title: '¿Qué error cometen los dropshippers de EE.UU. con los impuestos de reventa?',
    content: 'Si haces dropshipping, le compras productos a un proveedor en EE.UU. (ej. AliExpress US, CJ Dropshipping) y este se lo envía a tu cliente en EE.UU. Si no le entregas a tu proveedor un "Resale Certificate" (Certificado de Reventa), el proveedor te cobrará a ti el Sales Tax. Y luego, tú se lo cobrarás a tu cliente (pagando el impuesto dos veces). El error es no registrar tu LLC para obtener el permiso de vendedor (Seller\'s Permit) en el estado y emitir el certificado para comprar exento de impuestos.'
  },
  {
    id: 193,
    slug: 'error-olvidar-el-informe-k1-multimember',
    title: '¿Qué pasa si tengo una LLC con socios (Partnership) y olvido el Schedule K-1?',
    content: 'Si tu LLC tiene más de un socio, es una Partnership. La LLC en sí no paga impuestos, pero debe presentar el Form 1065 al IRS, y lo más importante: debe emitir un **Schedule K-1** a cada socio. Este documento detalla la porción exacta de pérdidas y ganancias que le toca a cada uno. Si omites generar los K-1s o los envías tarde, el IRS impone multas de más de $220 por cada socio, multiplicado por cada mes de retraso (hasta 12 meses). ¡Puede sumar miles de dólares en multas!'
  },
  {
    id: 194,
    slug: 'error-ocultar-la-llc-ante-divorcios-embargos',
    title: '¿Me protege la LLC para ocultar patrimonio en caso de divorcio o embargo en mi país?',
    content: 'La LLC ofrece protección de responsabilidad (protege tus bienes personales de demandas hacia la empresa), pero NO es una herramienta para evadir responsabilidades personales. Si tienes un embargo de Hacienda en tu país, una demanda de manutención o un divorcio, un juez local te exigirá declarar tus activos mundiales. Mentir y ocultar tu propiedad sobre la LLC es perjurio y fraude. Además, los tribunales pueden dictar una "Charging Order" contra tus distribuciones de la LLC.'
  },
  {
    id: 195,
    slug: 'error-inversiones-inmobiliarias-con-llc-operativa',
    title: '¿Puedo comprar casas (Real Estate) en USA con mi LLC de e-commerce?',
    content: 'Nunca debes mezclar bienes raíces con negocios operativos de alto riesgo. Si tu LLC vende productos físicos y recibe una demanda por un producto defectuoso, o en tu e-commerce alguien te demanda por infracción de patentes, y tienes una casa a nombre de esa misma LLC, la casa está en riesgo de ser embargada para pagar la demanda. En EE.UU., la regla de oro del Real Estate es separar activos: crear una LLC diferente exclusivamente para tener las propiedades inmobiliarias.'
  },
  {
    id: 196,
    slug: 'error-cerrar-cuenta-banco-antes-de-pagar-impuestos',
    title: '¿Por qué no debes cerrar la cuenta bancaria de la LLC si aún debes pagar a Hacienda en tu país?',
    content: 'Si planeas cerrar la LLC, primero debes asegurarte de haber sacado los beneficios (Owner\'s Draw) y haber pagado los gastos pendientes. Si cierras la cuenta bancaria americana, Stripe o pasarelas que intentes cobrar no tendrán dónde depositarte. Además, en caso de que el IRS te exija pagar alguna tasa atrasada, o si recibes un reembolso fiscal, el gobierno americano solo emite reembolsos a cuentas comerciales en EE.UU. No te enviarán el dinero a un banco de España.'
  },
  {
    id: 197,
    slug: 'error-confundir-llc-con-corporation-c',
    title: '¿Puedo dejar los beneficios "dentro" de la LLC para no pagar impuestos personales?',
    content: 'Este es el error de confundir una LLC (Disregarded Entity) con una C-Corporation. En una LLC transparente, los beneficios generados al final de año fiscal (ingresos menos gastos) se consideran ganados por ti de forma inmediata e imputable, **independientemente de si sacaste el dinero al banco en tu país o si lo dejaste guardado en la cuenta de Mercury en EE.UU.** En tu país pagarás impuestos sobre la ganancia total. Dejar el dinero "dentro de la LLC" no aplaza ni evita tus impuestos en España.'
  },
  {
    id: 198,
    slug: 'error-usar-vpn-para-abrir-cuentas',
    title: '¿Debo usar una VPN simulando estar en EE.UU. para abrir cuentas bancarias de la LLC?',
    content: 'Absolutamente NO. Usar una VPN (o peor, un VPS) para hacer creer a un banco americano o a Stripe que resides en EE.UU. cuando en realidad eres un residente extranjero, activará todas las alarmas antifraude de sus sistemas. Detectarán la VPN al instante (las IPs de data centers están quemadas). El resultado será el bloqueo permanente e irreversible de tu solicitud (Banned). Los bancos aceptan fundadores internacionales; entra siempre con tu IP real de tu país y declara abiertamente tu residencia.'
  },
  {
    id: 199,
    slug: 'error-no-leer-terminos-servicios-bancos',
    title: '¿Qué negocios tienen totalmente prohibido usar Mercury o Stripe?',
    content: 'Si abres tu LLC para negocios como: Pornografía/Adultos, Apuestas/Casinos online, Venta de armas o munición, Suplementos no aprobados por la FDA, CBD/Marihuana, Préstamos tipo "Payday", o venta de seguidores en redes sociales; perderás tu tiempo. Stripe y bancos como Mercury prohíben explícitamente estas industrias en sus Términos de Servicio. Si lo ocultas, retendrán los pagos de tus clientes y cerrarán la cuenta, quedándose tu dinero inmovilizado por meses.'
  },
  {
    id: 200,
    slug: 'error-creer-que-es-inmune-hacienda-espana',
    title: 'En resumen, ¿puede la Hacienda española embargar mi LLC americana?',
    content: 'Hacienda no puede embargar directamente a una LLC en EE.UU. porque está fuera de su jurisdicción (no pueden ordenar a Mercury Bank que congele tus dólares). PERO, Hacienda tiene jurisdicción sobre TI como residente fiscal. Pueden embargar tus cuentas personales en España, embargar tus bienes inmuebles locales e iniciar un proceso por delito fiscal si no declaraste la LLC (Modelos 720, D6 y renta). Además, pueden solicitar colaboración internacional judicial. Nunca uses la LLC para evadir.'
  }
];

qas.forEach(qa => {
  const fileContent = '# ' + qa.title + '\n\n' + qa.content + '\n';
  const filePath = path.join(__dirname, '..', 'knowledge', 'custom', 'q' + qa.id + '-' + qa.slug + '.md');
  fs.writeFileSync(filePath, fileContent, 'utf-8');
  console.log('Generated: ' + filePath);
});
