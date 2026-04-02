import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CheckCircle2, AlertTriangle, Info, User } from 'lucide-react'

// Contenido de las 5 guías altamente optimizadas para SEO y con tono humanizado.
const guiasContent: Record<string, { title: string, content: React.ReactNode, meta: string }> = {
  'como-abrir-llc-desde-el-extranjero': {
    title: 'Cómo abrir una LLC desde el extranjero (Guía Definitiva)',
    meta: 'Descubre paso a paso cómo abrir tu LLC en Estados Unidos sin ser residente. Sin visa, sin SSN y 100% online.',
    content: (
      <>
        <p className="lead">Abrir una LLC (Limited Liability Company) en Estados Unidos siendo extranjero y sin pisar suelo americano suena a ingeniería fiscal para multinacionales, pero la realidad es muy distinta. Miles de emprendedores, freelancers y empresas de e-commerce de todo el mundo abren su LLC a diario para acceder al sistema bancario de EE.UU., cobrar mediante Stripe y proteger su patrimonio.</p>
        
        <h2>¿Por qué deberías considerar una LLC estadounidense?</h2>
        <p>Tener un negocio global requiere de herramientas financieras globales. Al registrar tu empresa en Estados Unidos, automáticamente obtienes ventajas que en muchos países de Latinoamérica o Europa son imposibles de conseguir:</p>
        <ul>
          <li><strong>Acceso a procesadores de pago premium:</strong> Podrás operar con cuentas directas de Stripe, PayPal US y otras pasarelas sin limitaciones de divisas.</li>
          <li><strong>Cuentas bancarias en dólares:</strong> Con tu LLC podrás abrir cuentas en bancos de primera línea (como Mercury, Relay o Wise Business) 100% online, sin mínimos absurdos.</li>
          <li><strong>Estructura "Pass-Through":</strong> Las LLC no pagan impuestos corporativos directamente. Los beneficios pasan a los dueños, y si eres un "Non-Resident Alien" sin nexo económico físico en USA, podrías estar exento de tributar sobre esos ingresos en el IRS de EE.UU.</li>
        </ul>

        <h2>Paso a Paso: El Flujo para Crear tu LLC</h2>
        
        <h3>1. Escoge el Estado Ideal</h3>
        <p>A diferencia de Europa, en EE.UU. el registro de empresas es competencia de cada estado. Los 50 estados tienen leyes distintas, pero si no vas a tener presencia física (local o empleados allí), tu decisión suele reducirse a los tres gigantes pro-negocios: <strong>Wyoming, Delaware o New Mexico</strong>. Wyoming es famoso por sus bajos costos y fuerte privacidad; Delaware por ser el estándar para startups que buscan rondas de inversión; y New Mexico destaca por un anonimato total y bajo costo de mantenimiento.</p>

        <h3>2. Contrata un Agente Registrado (Registered Agent)</h3>
        <p>Por ley estatal, toda empresa norteamericana necesita una dirección física en el estado de formación y una persona designada para recibir notificaciones legales (demandas, avisos del gobierno) en horario comercial. Puesto que estás en el extranjero, debes contratar un servicio de Agente Registrado. La buena noticia es que todos nuestros paquetes de <Link href="/servicios/llc-esencial" className="text-blue-600 underline">formación de LLC</Link> ya incluyen este servicio gratuitamente durante tu primer año.</p>

        <h3>3. Presenta los Articles of Organization</h3>
        <p>Es el documento fundacional de tu LLC que se presenta ante la Secretaría de Estado correspondiente. Necesitarás proponer el nombre de tu empresa (debe terminar en "LLC" o "L.L.C.") y abonar las tasas estatales de tramitación.</p>

        <div className="bg-blue-50 p-6 rounded-xl my-8 border-l-4 border-blue-600">
          <h4 className="flex items-center gap-2 font-bold mb-2 text-blue-900"><Info size={20} /> El Operating Agreement</h4>
          <p className="text-blue-800 text-sm mb-0">Aunque muchos estados no exigen entregarlo públicamente, el <em>Operating Agreement</em> (Acuerdo Operativo) es el «contrato maestro» interno de la LLC. Define quién es dueño de qué porcentaje y las reglas internas. Los bancos te lo exigirán para abrir una cuenta.</p>
        </div>

        <h3>4. Obtén el ORO: Tu número EIN</h3>
        <p>El EIN (Employer Identification Number) es el equivalente al RFC, CUIT o NIF de tu país. Lo expide el IRS (Hacienda de EE.UU.). Este es el paso donde la mayoría de no residentes se atasca, porque el IRS exige un Número de Seguro Social (SSN) para hacerlo online. Si no tienes SSN, no te preocupes: nosotros solicitamos tu EIN emitiendo el Formulario SS-4 al IRS por fax/correo y nos encargamos de conseguirlo sin que tengas que viajar ni tramitar un ITIN.</p>

        <h3>5. Abre tu cuenta bancaria y empieza a operar</h3>
        <p>Con tus <em>Articles of Organization</em>, el <em>Operating Agreement</em> y tu <em>EIN</em> en mano, tienes luz verde. Entidades modernas orientadas a tecnología y no residentes te permitirán abrir tu cuenta enviando únicamente estos documentos corporativos junto con tu pasaporte.</p>

        <h2>El mito del "Paraíso Fiscal"</h2>
        <p>Una LLC <strong>no</strong> es evadir impuestos. El hecho de que no pagues impuestos en Estados Unidos (si configuras adecuadamente tu LLC sin tener un ETBUS o Establecimiento Permanente allí) obliga simplemente a que declares esos beneficios en tu país de residencia fiscal (según tus leyes locales). Lo que te otorga la LLC es libertad operativa, divisa dura y cero retenciones de inicio por parte del gigante norteamericano.</p>
      </>
    )
  },
  'que-estado-elegir-para-tu-llc': {
    title: '¿Qué estado elegir para tu LLC? Wyoming vs Delaware vs New Mexico',
    meta: 'Análisis detallado de los mejores estados para registrar una LLC siendo no residente. Comparamos tasas, anonimato y mantenimiento.',
    content: (
      <>
        <p className="lead">"¿Dónde registro mi LLC?" es la primera pregunta que se hace todo emprendedor extranjero. Y la respuesta es siempre la misma: <strong>depende de tu modelo de negocio</strong>. Ya que no vas a operar físicamente en Estados Unidos, eres libre de elegir cualquier estado para aprovechar sus incentivos corporativos.</p>

        <p>La inmensa mayoría del comercio digital se divide entre tres estados que destacan por encima del resto gracias a su flexibilidad fiscal, amigabilidad normativa y protección patrimonial. Analicemos los tres reyes del mundo LLC.</p>

        {/* Comparison cards — rendered OUTSIDE prose to avoid layout conflicts */}
        </><div className="not-prose grid md:grid-cols-3 gap-5 my-10">

          {/* Wyoming */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-amber-50 px-6 py-4 border-b border-slate-200 text-center">
              <div className="text-3xl mb-1">🤠</div>
              <h3 className="text-lg font-bold text-slate-900">Wyoming</h3>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="px-5 py-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Anonimato</p>
                <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500 shrink-0" size={15} /><span className="text-sm text-slate-700">Alto — tus datos no son públicos.</span></div>
              </div>
              <div className="px-5 py-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tasas anuales</p>
                <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500 shrink-0" size={15} /><span className="text-sm text-slate-700">~$60 USD (Annual Report)</span></div>
              </div>
              <div className="px-5 py-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Protección</p>
                <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500 shrink-0" size={15} /><span className="text-sm text-slate-700">Excelente (Charging Order Protection)</span></div>
              </div>
              <div className="px-5 py-3 bg-green-50">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Ideal para</p>
                <p className="text-sm text-slate-700">E-commerce, freelancers, consultores, activos digitales.</p>
              </div>
            </div>
          </div>

          {/* Delaware */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-slate-200 text-center">
              <div className="text-3xl mb-1">🏛️</div>
              <h3 className="text-lg font-bold text-slate-900">Delaware</h3>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="px-5 py-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Anonimato</p>
                <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500 shrink-0" size={15} /><span className="text-sm text-slate-700">Medio — privado, pero escrutado.</span></div>
              </div>
              <div className="px-5 py-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tasas anuales</p>
                <div className="flex items-center gap-2"><AlertTriangle className="text-amber-500 shrink-0" size={15} /><span className="text-sm font-semibold text-amber-700">$300 USD (Franchise Tax)</span></div>
              </div>
              <div className="px-5 py-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Ventaja clave</p>
                <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500 shrink-0" size={15} /><span className="text-sm text-slate-700">Chancery Court (tribunal especializado)</span></div>
              </div>
              <div className="px-5 py-3 bg-blue-50">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Ideal para</p>
                <p className="text-sm text-slate-700">Startups que buscan Venture Capital a mediano plazo.</p>
              </div>
            </div>
          </div>

          {/* New Mexico */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-emerald-50 px-6 py-4 border-b border-slate-200 text-center">
              <div className="text-3xl mb-1">🌵</div>
              <h3 className="text-lg font-bold text-slate-900">New Mexico</h3>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="px-5 py-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Anonimato</p>
                <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500 shrink-0" size={15} /><span className="text-sm text-slate-700">Total — sin registros públicos de dueños.</span></div>
              </div>
              <div className="px-5 py-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tasas anuales</p>
                <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500 shrink-0" size={15} /><span className="text-sm font-semibold text-green-700">$0 USD — sin Annual Report</span></div>
              </div>
              <div className="px-5 py-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Mantenimiento</p>
                <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500 shrink-0" size={15} /><span className="text-sm text-slate-700">El estado más barato del país.</span></div>
              </div>
              <div className="px-5 py-3 bg-emerald-50">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Ideal para</p>
                <p className="text-sm text-slate-700">Proyectos bootstrap, filiales y negocios en fase inicial.</p>
              </div>
            </div>
          </div>

        </div><>

        <h2>Entonces, ¿cuál elijo?</h2>
        <p>Regla de oro: <strong>Olvida Delaware</strong> a menos que pienses recibir inversión de fondos o ángeles (y en esos casos, la mayoría te exigirá una estructura de C-Corporation, no de LLC). Delaware está diseñado para grandes firmas y su impuesto anual de $300 es una losa para negocios pequeños.</p>
        
        <p><strong>Wyoming es casi siempre la mejor opción equilibrada.</strong> Tiene un costo muy bajo de mantenimiento, una tradición legal impecable blindando emprendedores frente a demandas y es abrumadoramente amistoso con todo lo asociado a criptomonedas y negocios digitales.</p>
        <p><strong>New Mexico</strong> resplandece si priorizas absoluta privacidad conteniendo el gasto (sin reporte anual), siendo genial para empresas secundarias, filiales de otras LLC o proyectos bootstrap que aún no monetizan fuertemente.</p>
      </>
    )
  },
  'llc-vs-corporation-no-residentes': {
    title: 'LLC vs C-Corporation para Extranjeros: ¿Cuál te conviene?',
    meta: 'Entiende las diferencias críticas entre una LLC y una C-Corp de USA para fundadores internacionales: retenciones, impuestos y levantamiento de capital.',
    content: (
      <>
        <p className="lead">Muchos fundadores creen que abrir una "empresa en Estados Unidos" significa siempre lo mismo. Pero la elección entre una Limited Liability Company (LLC) y una C-Corporation (C-Corp) altera radicalmente cómo te tratan los inversores y cómo declararás tus impuestos, especialmente si eres extranjero (Non-Resident Alien).</p>

        <h2>¿Cómo funciona una LLC?</h2>
        <p>La característica estelar de las LLC es su <strong>"Pass-Through Taxation"</strong> (tributación de paso). Una LLC, tributariamente hablando, es un lienzo en blanco o como un conducto fantasma ante el IRS.</p>
        <ul>
          <li><strong>No paga impuestos a nivel corporativo:</strong> La empresa no tributa por sus ganancias; esas ganancias "fluyen" o pasan directamente a sus dueños.</li>
          <li><strong>Aislada del IRS bajo condiciones:</strong> Si un extranjero soltero abre una Single-Member LLC en EE.UU., opera enteramente fuera del país, no tiene residencia gringa ni empleados locales dependientes de nómina... <strong>puede evitar legalmente pagar Income Tax (impuesto sobre la renta) en Estados Unidos.</strong> El beneficio es íntegro fiscalmente hablando (aunque deba declararse en el país real de origen del humano).</li>
        </ul>

        <h2>¿Cómo funciona una C-Corporation?</h2>
        <p>La C-Corp es un ladrillo, un ente independiente separado completamente de los miembros a nivel tributario. En ella recae la "Doble Tributación".</p>
        <ul>
          <li><strong>Pagará impuestos siempre:</strong> La Corp tributa un 21% (tasa federal del Corporate Tax) sobre el beneficio o ganancia neta, sin importar si eres marciano o ciudadano de EE.UU.</li>
          <li><strong>Tributación en dividendos:</strong> Si quieres sacar dinero de la empresa para ti a título personal (dividendos), sufres una retención (hasta del 30% si no existe un acuerdo de doble tributación con tu país).</li>
          <li><strong>Las acciones y el Capital Series:</strong> Es el modelo legal preferido para entregar acciones (Equity, stock options, preferred shares).</li>
        </ul>

        <h2>El veredicto para fundadores Internacionales</h2>
        <div className="bg-white border rounded-lg p-6 my-8">
          <h4 className="text-xl font-bold mb-4">¿Cuándo elegir una LLC?</h4>
          <p>Para el 95% de freelancers, agencias, e-commerce, consultores e infoproductores. Provee la manera más eficiente, liviana fiscalmente y barata de mantener operaciones en USD y entrar al sector bancario americano sin dejar parte del beneficio ahogado en impuestos norteamericanos que quizá ni logres recuperar con tu país de origen.</p>
        </div>

        <div className="bg-white border rounded-lg p-6 my-8">
          <h4 className="text-xl font-bold mb-4">¿Cuándo elegir una C-Corp (normalmente en Delaware)?</h4>
          <p>Si tu intención a medio-corto plazo es sentarte con firmas de Venture Capital (ej. Y-Combinator) y ofrecerles el clásico <em>SAFE note</em> a cambio de millones en rondas Seed. Ningún VC institucional serio comprará "percentual membership interests" participativos de una LLC por la complejidad fiscal que les generas; ellos quieren acciones comunes y preferentes regidas por la jurisprudencia madura de una corporación en Delaware.</p>
        </div>
      </>
    )
  },
  'cuenta-bancaria-llc-sin-ssn': {
    title: 'Cómo abrir una cuenta bancaria empresarial en EE.UU. sin SSN',
    meta: 'Descubre los mejores bancos y pasarelas estilo fintech (Mercury, Relay, Wise) que te permiten abrir cuenta para tu LLC sin viajar ni tener SSN.',
    content: (
      <>
        <p className="lead">Seamos claros: el motivo principal detrás de la creación de miles de LLCs por parte de ciudadanos de América Latina y Europa es obtener dólares duros y disfrutar de las pasarelas de cobro ininterrumpidas e inmunes a restricciones cambiarias opresivas. Para esto, necesitas que tu LLC aterrice en una cuenta bancaria comercial.</p>

        <p>Hace una década, abrir dicha cuenta requería un vuelo a Miami y rogarle en persona a un oficial bancario en Chase, Bank of America o Wells Fargo. Hoy en día, el panorama fintech ("neobancos") permite realizar el onboarding digital si entregas la documentación exacta.</p>

        <h2>Documentos Fundamentales (Toolkit Bancario)</h2>
        <p>Ningún banco te va a aperturar una cuenta sin revisar de forma electrónica tres pilares de tu empresa:</p>
        <ol className="list-decimal pl-6 space-y-2 mb-8">
          <li><strong>Los Articles of Organization (o Certificate of Formation):</strong> El documento que prueba que verdaderamente formas parte de los archivos públicos del Estado y la LLC existe físicamente allí.</li>
          <li><strong>El Formulario CP-575 o Carta 147C (La carta del EIN):</strong> Es un requerimiento anti-lavado de dinero irrompible (Ley Patriota). El banco de EE.UU. necesita compulsar que el IRS te audita un NIF. No se conformarán con que tú "sepas tu número", necesitan ver visualmente el documento del fisco emitido a tu nombre de LLC.</li>
          <li><strong>El Operating Agreement:</strong> Si hay varios socios o incluso uno solo, necesitan comprender cómo se estructura el mandato y quién tiene derechos de firma dentro de la entidad corporativa.</li>
          <li><strong>Pasaporte Internacional del "Beneficial Owner":</strong> Tu acreditación de indentidad (ID físico de tu país u hoja del pasaporte).</li>
        </ol>

        <h2>Los Bancos Fintech campeones en No Residentes</h2>
        <p>Mientras que la banca tradicional (Chase, Citi) todavía arrastra procesos donde te pedirán el SSN (Número de Seguro Social, imposible al no ser ciudadano), el capital de Sillicon Valley alumbró a plataformas bancarias (Neo-Banks B2B) donde se nos acoge con pasaportes internacionales:</p>

        <div className="space-y-6 my-8">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="font-bold text-xl mb-2">Mercury 🪐</h3>
            <p className="text-slate-700">El estándar histórico en las startups. Ofrece cuentas checking sin cuotas mensuales y la capacidad de emitir tarjetas físicas o virtuales. Mercury usa el motor de Evolve Bank & Trust y Choice Financial Group tras de sí, por lo que tu dinero estará asegurado corporativamente por la FDIC (normalmente hasta los 5 millones). Exigen tener presencia web clara que denote negocio moderno y desestiman algunos rubros "de riesgo".</p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="font-bold text-xl mb-2">Relay Financial 🏦</h3>
            <p className="text-slate-700">Actualmente, la navaja suiza número uno y el coloso que gana terreno. Tienen un grado altísimo de aprobación para fundadores no residentes (sin SSN) al tener en cuenta el mercado hispanohablante. La estructura de Relay permite crear hasta 20 cuentas contables divididas que organizan el dinero maravillosamente y te habilitan para crear docenas de Mastercards de débito a voluntad.</p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="font-bold text-xl mb-2">Wise Business 💸</h3>
            <p className="text-slate-700">Perfecto si tu empresa va a lidiar con clientes europeos, sudafricanos, mexicanos o asiáticos, ya que proveen el estándar en "Accounts locales" (recibir euros, libras o pesos y pasar a dólares con una comisión minúscula en cambio de divisas). El proceso no exige SSN. Eso sí, exigen cuota de activación vitalicia que ronda los 30-50 USD en el momento de crearla.</p>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
          <h4 className="font-bold text-yellow-800 mb-2">Un detalle con Stripe Atlas</h4>
          <p className="text-yellow-900 text-sm">Creemos y apostamos plenamente a que nuestra labor en <Link href="/" className="underline">Open LLC USA</Link> preparando tus documentos a medida y logrando tu EIN es suficiente, pero si fallas con un banco, tu LLC y tu EIN ya otorgado es completamente funcional para conectarse orgánicamente como empresa a pasarelas de crédito como <strong>Stripe EE.UU o PayPal USA</strong>, que te pueden liquidar beneficios mediante transferencia a cualquier plataforma puente.</p>
        </div>
      </>
    )
  },
  'obligaciones-fiscales-llc-extranjero': {
    title: 'Obligaciones Fiscales del IRS para LLCs de No Residentes',
    meta: 'Evita la terrorífica multa de $25,000 USD. Información clave sobre los Formularios 5472, 1120 y la declaración anual a fondo en nuestra guía fiscal.',
    content: (
      <>
        <p className="lead">La afirmación de "abrir una LLC genera cero impuestos en EE.UU." suele correr como la pólvora en Twitter o YouTube, y aunque puede ser cierta si hablamos estrictamente de pagar un <em>porcentaje sobre la utilidad (Income Tax)</em>, genera una amnesia mortal en los fundadores que olvidan lo más importante: <strong>Las obligaciones y avisos informativos anuales que exigen el gobierno Federal y el Estado bajo severas multas punitivas si nos demoramos.</strong></p>

        <p>Una Single-Member LLC en propiedad de un extranjero "no residente" asume ante el IRS (Internal Revenue Service) el papel de "Disregarded Entity" (entidad ignorada), lo cual obliga indirectamente a reportar interacciones para evitar casos groseros de evasión tributaria.</p>

        <h2>El Fantasma de los Formularios Federales</h2>
        <p>Desde 2017, la legislación norteamericana dictaminó que incluso las LLCs de 1 solo dueño no residente (extranjeros al 100%) sin un centavo de beneficio, estarían forzadas a dar cuenta de sus reportes informativos ante el fisco bajo multa gravatoria de <strong>$25,000 dólares</strong>.</p>
        
        <h3>Formulario 5472 + Formulario 1120 Pro-forma</h3>
        <p>El núcleo de la obligación anual (cuyo deadline masivo recae sobre el 15 de Abril de cada año entrante):</p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>El <strong>Form 5472</strong> es un formulario diseñado exclusivamente para reportar movimientos que impliquen "transacciones reportables" con partes foráneas vinculadas al 25% o más. Si aportaste dinero de tu propio país a tu banco LLC, has de reportarlo aquí en dólares netos.</li>
          <li>El <strong>Formulario 1120</strong> es literalmente una carcasa (hoja pro-forma principal en blanco) que acompaña al interior rellenado del Formulario 5472. Simplemente va firmado para indicarle al Servicio de Rentas Internas quién emite y responde ante los estatutos.</li>
        </ul>
        <div className="bg-red-50 text-red-800 p-4 rounded-lg my-4 text-sm font-medium border border-red-200">
          ⚠️ <strong>ATENCIÓN AL PRECIO:</strong> Como hemos dejado claro a lo largo del extracto, el importe de $25,000 USD de multa es estrictamente la cifra base que te interpone de multado directo o requerimiento de penalización el fisco en EE.UU por evadir a conciencia (o no mandar a tiempo durante semanas y meses) tu bloque 5472/1120. ¡Con nuestra agencia los servicios cubren <Link href="/servicios/impuestos-federales" className="underline font-bold text-red-900">declarar anualmente bajo la supervisión de auditores</Link> eliminando por completo este enorme riego latente y evitando disgustos irreparables en visados e inversiones futuras!
        </div>

        <h2>Beneficial Ownership (BOIR) ante la FinCEN</h2>
        <p>El 1 de Enero de 2024 entró de manera abrupta en juego la <strong>Corporate Transparency Act</strong> (CTA) aprobada años atrás. El Departamento Antiterrorismo (la cadena financiera del Tesoro, la FinCEN) demanda saber concretamente con una foto obligatoria del pasaporte quién es el "Beneficial Owner" (Humano físico) que maneja tu empresa entre bastidores. Si omites el reporte (BOIR o Reporte Base Anual del BOI), las multas escapan al ridículo siendo de hasta $500 por día de demora acumulada y penas perimétricas en casos extremos penales.</p>

        <h2>La Memoria Estatal (El Annual Report)</h2>
        <p>El fisco (IRS) y la red Antiterrorismo (FinCEN) son entes a escala nacional (Gobierno Federal de EE. UU.). Pero no olvides que tú inscribiste tu empresa en un Estado particular (ej. Wyoming, Florida, New Mexico).</p>
        <p>Casi todos los Estados exigen una tasa renovable obligatoria administrativa para confirmar que el ente sigue vivo o se clausura de facto por vía administrativa. Esa cuota es lo que llamamos el Annual Report o 'Franchise Tax'. 
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>Wyoming:</strong> Te pedirá anualmente la irrisoria cifra mínima estatutaria de ~$60 a depositar.</li>
          <li><strong>Delaware:</strong> Con su famosa "Franchise Tax", no te perdona nada menos de $300 anuales de base de golpe.</li>
          <li><strong>New Mexico:</strong> Es el paraíso de retención sin tasas; ¡no emite Annual Report ni Franchise tax, tu costo de estado es cero dólares! (Solo la tarifa fija pequeña de mantener a tu Agente).</li>
        </ul>
        <p>Puedes encargar en piloto automático nuestra salvaguardia adquiriendo planes de <strong><Link href="/servicios/compliance-basico" className="underline text-blue-600">Compliance Anuales</Link></strong>.</p>
      </>
    )
  }
}

export default async function GuiaSlugPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  const contentObj = guiasContent[slug]

  if (!contentObj) {
    notFound()
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Hero minimalista estilo Notion/Medium */}
      <header className="bg-slate-50 border-b border-slate-200 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/guia" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-8">
            <ArrowLeft className="mr-2" size={16} /> Volver a todas las guías
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {contentObj.title}
          </h1>
          <div className="mt-8 flex items-center gap-4 text-sm text-slate-600">
            <span className="bg-slate-200 px-3 py-1 rounded-full text-slate-700 font-medium tracking-wide text-xs">LECTURA ESENCIAL</span>
            <span className="flex items-center gap-1"><User size={16}/> Equipo Editorial</span>
          </div>
        </div>
      </header>

      {/* Contenido principal rico del texto */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="prose prose-lg prose-slate prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-li:my-1 prose-img:rounded-xl mx-auto">
          {contentObj.content}
        </div>

        {/* CTA final incrustado en el artículo */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-center text-white shadow-xl">
          <h3 className="text-2xl font-bold mb-4">¿Listo para dar el paso con seguridad?</h3>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto leading-relaxed">
            Nuestros planes cubren la creación, obtención de EIN sin SSN y asesoramiento de cumplimiento fiscal pensado para extranjeros.
          </p>
          <Link href="/precios" className="inline-block bg-white text-blue-700 px-8 py-4 rounded-lg font-bold hover:bg-slate-50 hover:-translate-y-1 transition-all shadow-md">
            Ver planes de formación de LLCs
          </Link>
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const contentObj = guiasContent[slug]
  
  if (!contentObj) {
    return { title: 'No encontrado' }
  }

  return {
    title: `${contentObj.title} | Entiende tu LLC en USA`,
    description: contentObj.meta,
  }
}
