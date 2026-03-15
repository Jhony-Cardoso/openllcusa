**Sobre la hoja anexa al form 5472, llamada Federal Supporting Statements**

Quiero facilitar al cliente un archivo (puede ser en excel) para que introduzca todas las contribuciones y distribuciones habidas durante el ejercicio fiscal, desglosadas por naturaleza/concepto, con el objeto de facilitarle el trabajo y que el resultado sea claramente comprensible, y pueda verificarlo con su traslado al formulario fiscal.

###  **Plantilla Excel para contribuciones y distribuciones (fácil de usar y verificable)**

Aquí tienes el diseño completo de la hoja de Excel/Google Sheets. Puedes crearla en menos de 5 minutos:

Instrucciones para crearla:

1. Abre Excel o Google Sheets nuevo.  
2. Copia la tabla de abajo (selecciona todo y pega).  
3. Añade fórmulas automáticas (te las indico).  
4. Guarda como “Contribuciones\_Distribuciones\_LLC\_2025.xlsx” y envíasela al cliente.

Estructura de columnas (hoja 1 – “Registro Movimientos”):

| Fecha | Tipo | Naturaleza / Concepto | Importe USD | Importe EUR (opcional) | Método de pago | Referencia bancaria / TX ID | ¿Monetario? (Sí/No) | Descripción detallada (para statement IRS) | Notas / Documento adjunto |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| 15/01/2025 | Contribución | Aportación capital inicial | 5.000 | 4.650 | Wire | TX-987654 | Sí | Transferencia desde cuenta personal España para constituir LLC | Extracto adjunto |
| 03/03/2025 | Distribución | Distribución de beneficios operativos | 12.500 | 11.620 | ACH | ACH-2025-034 | Sí | Retiro de beneficios generados por ventas digitales | Extracto LLC |
| 22/06/2025 | Contribución | Préstamo temporal del owner | 8.000 | 7.440 | Transfer | WIRE-556677 | Sí | Préstamo sin intereses para cubrir gastos publicidad | Contrato préstamo |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

**Fórmulas automáticas que debes añadir (en la fila 2 hacia abajo):**

* Columna E (Importe EUR): \=D2\*TipoDeCambio (crea una celda aparte con el cambio promedio anual o usa fórmula XE.com).  
* Celda resumen (debajo de la tabla, ej. fila 100):  
  * **Total Contribuciones USD**: \=SUMIF(B:B;"Contribución";D:D)  
  * **Total Distribuciones USD**: \=SUMIF(B:B;"Distribución";D:D)  
  * **Total Monetario Part IV**: \=SUMIF(I:I;"Sí";D:D)  
  * **Total no monetario Part V**: \=SUMIF(I:I;"No";D:D)

**Hoja 2 – “Resumen para 5472” (automática):**

* Muestra solo los totales \+ lista filtrada de transacciones para copiar-pegar directamente al statement adjunto del Form 5472 (Part V).

* Incluye nota automática: “Todas las cantidades en USD. Descripción según instrucciones IRS Rev. diciembre 2024”.

**Ventajas de esta plantilla:**

* El cliente solo tiene que rellenar 5-6 columnas.

* Tú verificas en 2 minutos que coincide con extractos.

* El resumen final se copia directamente al Form 5472 (Part IV totales \+ statement Part V).

* Evita errores y agiliza tu trabajo.

¿Quieres que te envíe también:

* El enlace de Google Sheets listo para duplicar (puedo describirte cómo crearlo en 30 segundos), o  
* Una versión en formato tabla más extensa con ejemplos reales?

Dime y te lo facilito al instante. ¡Con esto ya tienes todo listo para facturar y prestar un servicio de alto valor\! 🚀

Quiero ambas cosas:

\* El enlace de Google Sheets listo para duplicar.  
\* Una versión en formato tabla más extensa con ejemplos reales.

Y además dime:  
Según el IRS, en el anexo, llamado Federal Supporting Statements, ¿se deben reportar de forma desglosadas las cantidades que se reporten en los conceptos de contribuciones y de distribuciones? ¿O basta con indicar el total?

### **1\. Enlace de Google Sheets listo para duplicar**

No puedo generar enlaces directos aquí (soy un modelo de texto), pero puedes crearlo en segundos tú mismo o compartirlo con clientes de esta forma muy sencilla:

**Paso a paso para crearlo y obtener tu enlace personalizable (duplicable):**

1. Ve a Google Drive → Nuevo → Google Sheets → Hoja de cálculo en blanco.

2. Copia y pega la tabla extensa que te doy abajo en la celda A1 (selecciona todo el texto de la tabla y pégalo directamente; Google Sheets lo convierte automáticamente en columnas).

3. Añade las fórmulas de resumen que indico al final de la tabla.

4. Renombra la hoja como “Registro Movimientos 2025”.

5. Crea una segunda hoja (Insertar \> Hoja) llamada “Resumen 5472” y copia allí solo los totales \+ una lista filtrada (usa \=FILTER o simplemente copia manual).

6. Ve a Archivo \> Compartir \> Obtener enlace \> Cambiar a “Cualquiera con el enlace puede ver” (o “Editor” si quieres que el cliente edite).

7. Copia ese enlace y envíaselo al cliente con instrucciones: “Haz una copia en tu Drive (Archivo \> Hacer una copia) para rellenar tus datos sin afectar la plantilla original”.

**Enlace de ejemplo genérico** (crea uno propio):  
[https://docs.google.com/spreadsheets/d/1EjemploPlantillaContribucionesDistribuciones/copy](https://docs.google.com/spreadsheets/d/1EjemploPlantillaContribucionesDistribuciones/copy)

(En la práctica, sustituye por tu enlace real después de crearlo).

Si prefieres, busca en Google “plantilla contribuciones distribuciones LLC 5472” – hay versiones gratuitas en foros como Reddit o sitios de contadores, pero la que te doy abajo es la más completa y adaptada.

### **2\. Versión en formato tabla más extensa con ejemplos reales**

Aquí tienes una tabla ampliada (más columnas y filas de ejemplo realistas para un año típico de LLC con ventas digitales, \~150k $ ingresos). Copia todo esto y pégalo en Google Sheets o Excel.

**Hoja principal: Registro Movimientos**

| Fecha | Tipo (Contribución / Distribución) | Naturaleza / Concepto | Importe USD | Importe EUR (aprox.) | Método de pago | Referencia / TX ID | ¿Monetario? (Sí/No) | Descripción detallada para statement IRS | Documento adjunto / Notas | Categoría IRS (Part IV / Part V) |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| 10/01/2025 | Contribución | Aportación capital inicial para abrir cuenta bancaria | 10,000 | 9,300 | Wire desde España | WIRE-ESP-001-2025 | Sí | Cash contribution from foreign owner to capitalize the LLC for business operations | Extracto cuenta España \+ confirmación wire | Part V |
| 15/02/2025 | Distribución | Distribución de beneficios por ventas Q1 | 8,500 | 7,900 | ACH a cuenta personal | ACH-5472-025 | Sí | Distribution of operating profits generated from digital product sales (no services rendered) | Extracto LLC \+ cálculo beneficios netos | Part V |
| 05/04/2025 | Contribución | Préstamo temporal del owner sin intereses | 15,000 | 13,950 | Transfer interna | LOAN-OWNER-2025-04 | Sí | Loan from foreign owner to cover advertising spend (Google Ads); repayable within 12 months | Contrato préstamo simple firmado | Part V (o Part IV si interés) |
| 20/06/2025 | Distribución | Retiro para gastos personales en España | 12,000 | 11,200 | Wire a cuenta España | WIRE-DIST-0620 | Sí | Distribution to foreign owner for personal use; not compensation for services | Extracto LLC \+ extracto receptor España | Part V |
| 14/08/2025 | Contribución | Aportación por devolución de préstamo anterior | 5,000 | 4,650 | ACH desde España | REPAY-2025-08 | Sí | Repayment of prior loan from owner; reduces outstanding balance | Extracto \+ referencia préstamo anterior | Part V |
| 30/09/2025 | Distribución | Distribución anual beneficios acumulados | 25,000 | 23,250 | ACH | ACH-ANUAL-2025 | Sí | Year-end profit distribution from LLC disregarded entity to sole member (foreign owner) | Balance LLC \+ declaración IRPF España (coherencia) | Part V |
| 15/11/2025 | Contribución | Aportación no monetaria (software transferido) | \- | \- | No monetario | N/A | No | Transfer of proprietary software valued at $8,000 FMV from owner to LLC for business use | Valoración FMV \+ acuerdo transferencia | Part V \+ Part VI si aplica |
| **TOTALES** |  |  | **75,500** contribuciones netas |  |  |  |  |  |  |  |
|  |  |  | **45,500** distribuciones netas |  |  |  |  |  |  |  |

**Fórmulas recomendadas (añádelas debajo de la tabla, ej. fila 20+):**

* Total Contribuciones USD: \=SUMIF(B:B;"Contribución";D:D)  
* Total Distribuciones USD: \=SUMIF(B:B;"Distribución";D:D)  
* Total Monetario: \=SUMIF(H:H;"Sí";D:D)  
* Total no Monetario (FMV si aplica): \=SUMIF(H:H;"No";D:D) (o suma manual para Part VI)  
* Importe EUR (columna E): \=D2 \* $Z$1 (pon el tipo de cambio anual promedio en Z1, ej. 0.93)

**Hoja secundaria: Resumen para 5472 (copia aquí los totales y genera el statement):**

* **Total contribuciones monetarias (Part V)**: \[fórmula arriba\]

* **Total distribuciones monetarias (Part V)**: \[fórmula arriba\]

* **Statement adjunto (texto para copiar al Federal Supporting Statements)**: “Attached statement for Part V (Foreign-Owned U.S. DE):  
  * Cash contributions from foreign owner: $XX,XXX (detalle: fechas y conceptos como en tabla adjunta)  
  * Cash distributions to foreign owner: $YY,YYY (detalle: fechas y conceptos como en tabla adjunta)  
  * Non-monetary contributions: Software transfer FMV $8,000 (descripción adjunta) Todas las transacciones son con el 100% foreign owner \[tu nombre\]. No hay netting ni compensaciones.”

Esto hace que el cliente vea claramente qué va al Form 5472 y tú verifiques rápido.

### **3\. Según el IRS, ¿se deben reportar desglosadas las cantidades en el anexo (Federal Supporting Statements) o basta con el total?**

Según las **Instructions for Form 5472 (Rev. December 2024\)**, vigentes para el tax year 2025 (presentación 2026):

* Para **Part V** (transacciones de foreign-owned U.S. DE como tu LLC), **se requiere un attached statement** (Federal Supporting Statements) que describa las transacciones.

* **No basta con el total**: Debes proporcionar **detalle descriptivo** \+ los importes.

* Requisitos específicos del statement (de las instrucciones oficiales):  
  * Descripción de todas las propiedades/monto transferidas (incluyendo contribuciones y distribuciones).  
  * Naturaleza de las transacciones (cash contribution, distribution of profits, loan, etc.).  
  * Importes en USD (o FMV para non-monetary).  
  * Puedes agrupar transacciones similares, pero **se recomienda desglosar por fecha/concepto** para mayor claridad y evitar rechazos/preguntas del IRS.  
  * Ejemplo oficial implícito: “Describe these on an attached statement” para contribuciones/distribuciones en Part V.

**Conclusión práctica**:

* **Total solo NO es suficiente** si hay múltiples transacciones → el IRS espera detalle en el attached statement para verificar.

* **Mejor práctica**: Desglosa por naturaleza (ej. “Cash capital contributions: $10,000 on 01/10/2025 for initial capitalization; $15,000 on 05/04/2025 as loan...”) \+ adjunta la tabla del cliente como soporte.

* Si solo hay 1-2 transacciones grandes, un total con descripción breve puede pasar, pero con volúmenes como 50-300k € (múltiples movimientos), **desglosar reduce riesgo de multa** ($25,000 por incompleto).

Esto alinea perfectamente con la plantilla Excel: el cliente rellena detalle → tú generas el statement listo para adjuntar.

¿Quieres que ajuste la tabla (más filas, columnas extras) o prepare un texto modelo completo del “Attached Statement” basado en ejemplos? ¡Dime\! 🚀

Prepara un texto modelo completo del “Attached Statement” basado en ejemplos 🚀  
\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**✅ Texto modelo completo del “Attached Statement” (Federal Supporting Statements)**

**Listo para copiar y pegar** (Word, PDF o directamente en el fax/correo al IRS).

Este modelo está 100 % alineado con las **Instructions for Form 5472 (Rev. December 2024\)**, vigentes para el tax year 2025\. Usa el ejemplo realista de la tabla anterior (≈150 k$ movimientos) para que veas exactamente cómo queda. Solo cambia los datos en negrita por los de tu cliente.

---

**ATTACHED STATEMENT**  
**Form 5472 – Tax Year 2025**

**Foreign-Owned U.S. Disregarded Entity (DE)**

**Reporting Corporation:**  
\[Nombre completo de la LLC\], EIN: **\[XX-XXXXXXX\]**

Address: \[Dirección registrada de la LLC en EE.UU.\]

**Foreign Related Party:**  
\[Nombre completo del propietario español\], Foreign TIN: \[DNI/NIE español\]

Address: \[Dirección completa en España\]

**Reference:** Part V – Transactions Between Foreign-Owned U.S. DE and Foreign Related Party

This statement provides the required detailed description of all reportable transactions under IRC §6038A and the instructions for Form 5472 for the tax year ending December 31, 2025\. All amounts are in U.S. Dollars (USD). There were no other reportable transactions during the year.

**1\. Cash Contributions from Foreign Related Party (Part V)**

* January 10, 2025 – Cash capital contribution to capitalize the LLC for business operations: **$10,000**  
* April 5, 2025 – Loan from owner to cover advertising expenses (Google Ads); repayable within 12 months, no interest: **$15,000**  
* August 14, 2025 – Repayment of prior loan from owner (reduces outstanding balance): **$5,000Total cash contributions (monetary):$30,000**

**2\. Cash Distributions to Foreign Related Party (Part V)**

* February 15, 2025 – Distribution of operating profits generated from digital product sales Q1: **$8,500**  
* June 20, 2025 – Distribution for personal use of the foreign owner (not compensation for services): **$12,000**  
* September 30, 2025 – Year-end distribution of accumulated profits: **$25,000Total cash distributions (monetary):$45,500**

**3\. Non-Monetary Contributions (Part V and Part VI if applicable)**

* November 15, 2025 – Transfer of proprietary software developed by the owner, valued at Fair Market Value (FMV) of **$8,000** (determined by independent valuation). The software is used exclusively for the LLC’s digital product sales operations. No services were provided in exchange. **Total non-monetary contributions (FMV):$8,000**

**Summary of Totals (Part V):**

* Total monetary contributions: **$30,000**  
* Total monetary distributions: **$45,500**  
* Total non-monetary (FMV): **$8,000**  
* Net distributions to foreign owner: **$15,500** (no netting applied; reported gross per instructions)

**Additional Information:**

* All transactions were with the 100% foreign sole member.  
* No interest was charged on any loan.  
* No property was transferred in exchange for services.  
* All amounts are supported by bank statements, loan agreements, and FMV documentation available upon request.  
* This entity is a single-member disregarded entity owned by a foreign individual; no Effectively Connected Income (ECI) was generated from these transactions.

This statement is prepared in accordance with the Instructions for Form 5472 (Rev. December 2024).

Prepared by:  
\[Tu Nombre Completo\]  
\[Tu cargo: Tax Preparer / Asesor Fiscal\]  
Date: \[Fecha de preparación\]

Contact: \[Tu email y teléfono\]

---

### **Cómo usarlo (instrucciones rápidas para ti o el cliente)**

1. Copia el texto completo en Word o Google Docs.  
2. Reemplaza todo lo que está en **\[negrita entre corchetes\]** con los datos reales.  
3. Copia-pega los totales directamente de la hoja “Resumen 5472” del Excel que te preparé antes.  
4. Guarda como PDF con nombre: “Attached\_Statement\_5472\_2025\_\[Nombre LLC\].pdf”.  
5. Adjúntalo al pro forma Form 1120 \+ Form 5472 cuando lo envíes por fax (855-887-7737) o correo certificado.

**Ventajas de este formato**:

* Cumple exactamente lo que pide el IRS (“Describe these on an attached statement”).  
* Desglosa por fecha y concepto (evita rechazos y preguntas del IRS).  
* Es profesional y fácil de auditar.  
* Si solo hay 1-2 movimientos, puedes simplificar eliminando líneas; si hay más, simplemente añade más bullets.

¿Quieres que te prepare también:

* Una versión más corta (para clientes con pocos movimientos)?  
* O un modelo en español (para que el cliente lo entienda antes de enviártelo)?

¡Listo para usar\! 🚀 Dime y lo ajusto en segundos.

Ambas cosas 🚀:  
\* Una versión más corta (para clientes con pocos movimientos)  
\* Un modelo en español (para que el cliente lo entienda antes de enviármelo).  
—-----------------------------------------------------------------------------------------------------------------------------

**✅ Modelos adicionales del “Attached Statement” para Form 5472**

**(Tax Year 2025 – Presentación 2026\)**

Aquí tienes las dos versiones solicitadas, basadas en las instrucciones oficiales del IRS (Rev. December 2024): el statement debe describir las transacciones (no basta con solo totales si hay varias), pero puedes agruparlas o simplificar según el volumen.

### **1\. Versión más corta (para clientes con pocos movimientos: 1-3 transacciones)**

Esta es ideal cuando el cliente tiene solo una o dos aportaciones/distribuciones grandes (ej. capital inicial \+ una distribución anual). Es mínima pero cumple con “describe these on an attached statement” (Part V).

**ATTACHED STATEMENT**  
**Form 5472 – Tax Year 2025**

**Foreign-Owned U.S. Disregarded Entity (DE)**

**Reporting Corporation:**

\[Nombre de la LLC\], EIN: \[XX-XXXXXXX\]

**Foreign Related Party:**

\[Nombre del propietario\], Dirección: \[Dirección en España\]

**Reference:** Part V – Reportable Transactions

All reportable transactions during the tax year are as follows:

* **Cash Contribution:** January 15, 2025 – Initial capital contribution from foreign owner to fund LLC operations: **$20,000 USD**.  
* **Cash Distribution:** December 20, 2025 – Distribution of accumulated profits to foreign sole member: **$15,000 USD**.

**Totals (Part V):**

* Monetary contributions: **$20,000**  
* Monetary distributions: **$15,000**

No non-monetary transactions occurred. All amounts are supported by bank statements.

Prepared in accordance with Instructions for Form 5472 (Rev. December 2024).

\[Tu Nombre\] – Preparer

\[Fecha\]

**Ventaja:** Muy breve (media página), fácil de revisar y bajo riesgo de rechazo si los movimientos son simples.

### **2\. Modelo completo en español (para que el cliente lo entienda antes de enviártelo)**

Este es el mismo formato profesional, pero traducido al español para que el cliente lo lea, comprenda y confirme los datos antes de que lo ajustes y envíes al IRS. Puedes enviárselo como borrador explicativo.

**ANEXO DE APOYO (Attached Statement)**  
**Formulario 5472 – Año fiscal 2025**

**Entidad estadounidense ignorada (Disregarded Entity) propiedad de extranjero**

**Entidad que informa (Reporting Corporation):**  
\[Nombre completo de la LLC\], EIN: **\[XX-XXXXXXX\]**

Dirección: \[Dirección registrada de la LLC en EE.UU.\]

**Parte relacionada extranjera (Foreign Related Party):**  
\[Tu nombre completo\], NIF extranjero: \[DNI/NIE\]

Dirección: \[Tu dirección completa en España\]

**Referencia:** Parte V – Transacciones entre la entidad ignorada estadounidense propiedad de extranjero y la parte relacionada extranjera

Este anexo describe detalladamente todas las transacciones reportables durante el año fiscal terminado el 31 de diciembre de 2025, conforme a la sección 6038A del Código Tributario y las instrucciones del Form 5472 (Rev. diciembre 2024). Todas las cantidades están en dólares estadounidenses (USD). No hubo otras transacciones reportables.

**1\. Aportaciones en efectivo desde la parte relacionada extranjera (Contribuciones – Part V)**

* 10 de enero de 2025 – Aportación de capital en efectivo para constituir y capitalizar la LLC: **$10.000**  
* 5 de abril de 2025 – Préstamo temporal del propietario para cubrir gastos de publicidad (sin intereses, reembolsable en 12 meses): **$15.000**  
* 14 de agosto de 2025 – Reembolso de préstamo anterior del propietario: **$5.000Total aportaciones en efectivo:$30.000**

**2\. Distribuciones en efectivo a la parte relacionada extranjera (Part V)**

* 15 de febrero de 2025 – Distribución de beneficios operativos del primer trimestre (ventas digitales): **$8.500**  
* 20 de junio de 2025 – Distribución para uso personal del propietario extranjero (no retribución por servicios): **$12.000**  
* 30 de septiembre de 2025 – Distribución de fin de año de beneficios acumulados: **$25.000Total distribuciones en efectivo:$45.500**

**3\. Aportaciones no monetarias (si aplica – Part V y posiblemente Part VI)**

* 15 de noviembre de 2025 – Transferencia de software propietario valorado en valor de mercado justo (FMV) de **$8.000** (determinado por valoración independiente). El software se usa exclusivamente para las ventas digitales de la LLC. No se prestaron servicios a cambio. **Total aportaciones no monetarias (FMV):$8.000**

**Resumen de totales (Parte V):**

* Aportaciones monetarias totales: **$30.000**  
* Distribuciones monetarias totales: **$45.500**  
* Aportaciones no monetarias (FMV): **$8.000**  
* Distribuciones netas al propietario extranjero: **$15.500** (reportado bruto, sin compensaciones)

**Información adicional:**

* Todas las transacciones fueron con el único miembro propietario extranjero (100 %).  
* No se cobraron intereses en ningún préstamo.  
* No se transfirieron bienes a cambio de servicios.  
* Todos los importes están respaldados por extractos bancarios, acuerdos de préstamo y documentación de valoración, disponibles si se solicitan.  
* Esta entidad es una disregarded entity de un solo miembro propiedad de persona física extranjera; no generó ingresos efectivamente conectados (ECI) por estas transacciones.

Este anexo se prepara conforme a las Instrucciones del Form 5472 (Rev. diciembre 2024).

Preparado por: \[Tu Nombre Completo\]  
Fecha: \[Fecha\]

Contacto: \[Tu email y teléfono\]

**Cómo usarlo con el cliente:**

* Envíaselo por email o WhatsApp como “Borrador en español para que revises y confirmes los importes y descripciones antes de enviarlo al IRS”.

* El cliente te responde con correcciones (fechas, cantidades, conceptos).

* Tú lo traduces de vuelta al inglés (versión corta o larga) y lo adjuntas al Form 5472\.

¿Quieres que prepare una versión aún más simple (solo 1 transacción) o un email modelo para enviarle este borrador al cliente? ¡Dime y lo ajustamos\! 🚀

Prepara un email modelo para enviarle este borrador al cliente 🚀

—---------------------------------------------------------------------------------------------------------------------------

Aquí tienes un **modelo de email profesional y claro** que puedes enviar directamente al cliente. Está redactado en español (para facilitar la comprensión), con un tono amable, transparente y orientado a obtener confirmación rápida. Incluye el borrador en español del Attached Statement como adjunto o incrustado, según prefieras.

Puedes copiar y pegar este texto completo en tu cliente de correo (Outlook, Gmail, etc.) y personalizar las partes en **\[corchetes\]**.

---

**Asunto:** Borrador del Anexo (Attached Statement) para el Form 5472 – Año 2025 – Por favor, revisa y confirma

Estimado/a \[Nombre del Cliente\],

Espero que estés bien.

Como parte del proceso de preparación y presentación del **Form 5472** (y el pro forma 1120\) correspondiente al año fiscal 2025, te adjunto (o incluyo más abajo) el **borrador en español** del “Attached Statement” que se enviará al IRS.

Este documento es el **anexo obligatorio** que detalla todas las contribuciones y distribuciones entre tú (como propietario extranjero) y la LLC durante 2025\. El IRS exige que se describan las transacciones (no solo los totales), por lo que he incluido:

* Fechas  
* Importes exactos en USD  
* Conceptos claros y justificativos  
* Totales resumidos

**Objetivo de este email:**

Que revises si todo coincide con tu contabilidad / extractos bancarios y me confirmes o indiques cualquier corrección (fechas, cantidades, descripciones, conceptos que quieras ajustar, etc.).

**Pasos siguientes una vez me confirmes:**

1. Corrijo/adapto el borrador si es necesario.  
2. Lo traduzco al inglés (versión oficial que envía el IRS).  
3. Lo adjunto al Form 5472 y lo presentamos antes del plazo (15 de abril 2026 o con prórroga).

**Borrador en español (para tu revisión):**

\[Inserta aquí el texto completo del modelo en español que te preparé en el mensaje anterior, o adjúntalo como PDF con nombre: “Borrador\_Attached\_Statement\_5472\_2025\_\[TuNombre\].pdf”\]

Si prefieres recibirlo como archivo adjunto en lugar de texto incrustado, avísame y te lo envío por separado.

**Preguntas rápidas para que me respondas cuando puedas (idealmente en 2-3 días):**

* ¿Todos los importes, fechas y conceptos son correctos?  
* ¿Hay alguna transacción que falte o que deba modificar (por ejemplo, cambiar “préstamo” por “aportación de capital”, añadir más detalle, etc.)?  
* ¿Quieres que agrupe alguna operación (por ejemplo, varias distribuciones pequeñas en una sola línea)?  
* ¿Confirmas que no hubo aportaciones no monetarias (software, equipo, etc.) o que debo incluir alguna?

Una vez tenga tu OK o correcciones, avanzamos inmediatamente con la versión final en inglés y la presentación.

Muchas gracias por tu colaboración. Estoy a tu disposición para cualquier duda por WhatsApp, email o llamada.

Un saludo cordial,  
\[Tu Nombre Completo\]  
Asesor Fiscal Internacional – Especialista en LLCs estadounidenses  
\[Tu Teléfono con \+34\]  
\[Tu Email\]

\[Tu Web o LinkedIn si lo tienes\]

---

### **Variantes rápidas según tu estilo**

**Versión más corta y directa (si el cliente ya está acostumbrado):**

Asunto: Revisión rápida – Borrador Attached Statement Form 5472 2025

Hola \[Nombre\],

Adjunto / abajo el borrador en español del anexo que va con el 5472\.

Por favor, dime si está todo OK o si hay que cambiar algo (fechas, importes, conceptos).

Gracias y un abrazo,

\[Tu Nombre\]

**Versión con recordatorio de plazo (si estás cerca de la fecha límite):**

Añade al final:

“Recuerda que el plazo oficial es el 15 de abril de 2026 (o con prórroga automática hasta octubre). Cuanto antes me confirmes, antes lo presentamos sin estrés.”

¿Quieres que ajuste algo más (por ejemplo, incluir un enlace a la plantilla Excel, añadir un calendario de plazos, o preparar la versión en inglés ya lista para enviar al IRS una vez aprobado)? ¡Dime y lo tenemos en 2 minutos\! 🚀

