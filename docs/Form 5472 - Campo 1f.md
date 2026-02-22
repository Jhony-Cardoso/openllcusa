Campo 1f.  Part I

El campo 1f dice:

**“Total value of gross payments made or received reported on this Form 5472.”**

---

# **✅ ¿Qué significa realmente?**

**“Gross payments made or received”** \=

👉 **La suma total de TODOS los importes brutos que estás reportando en ese 5472**,  
 tanto:

* Pagos hechos (made)

* Pagos recibidos (received)

✔ Sin netear  
 ✔ Sin compensar  
 ✔ Sin restar gastos  
 ✔ Sin ajustar

👉 **Se coloca:**

**Total pagos realizados \+ Total pagos recibidos**

Pero con una precisión importante:

⚠ Solo se suman las transacciones que están efectivamente reportadas en ese 5472\.

No se incluyen transacciones que no aparecen en las Part IV–VII del formulario.

---

# **📌 Ejemplo práctico 1 (LLC típica foreign-owned)**

Durante 2025:

* El socio extranjero aportó capital → $10,000

* La LLC pagó al socio un reembolso → $2,000

En el 5472 reportas:

* Contribution received → 10,000

* Payment made to related party → 2,000

👉 Campo 1f \= **12,000**

No se pone 8,000.  
 No se netea.

---

# **📌 Ejemplo práctico 2 (solo aportes)**

* Socio aporta $5,000

* No hay más movimientos

👉 Campo 1f \= **5,000**

---

# **📌 Ejemplo práctico 3 (ingresos de clientes NO relacionados)**

* Stripe clientes → $50,000

* Aporte socio → $3,000

En el 5472 SOLO reportas transacciones con related party.

👉 Campo 1f \= **3,000**

Los $50,000 de clientes NO se incluyen porque no son related party.

---

# **🚨 Error muy común**

Muchos hacen:

❌ Sumar toda la facturación de la LLC  
 ❌ Poner ingresos brutos del negocio  
 ❌ Poner beneficio neto  
 ❌ Poner saldo bancario

👉 Todo eso es incorrecto.

El 5472 solo trata de **transacciones con partes relacionadas extranjeras**.

---

# **📌 Base normativa (criterio IRS)**

Las instrucciones del Form 5472 indican que el campo 1f recoge el total de los importes brutos reportados en las secciones correspondientes del formulario (Part IV–VII), es decir, la suma agregada de los pagos reportables.

El concepto clave es:

Gross amounts — no netting.

---

# **✅ Fórmula profesional**

Preparadores suelen calcularlo así:

1f \= SUM(all amounts entered in Parts IV–VII)

Si el usuario tiene varias categorías (royalties, services, capital contributions, loans, etc.), se suma todo.

—-------------------------------------------------------------

En una **Foreign-Owned U.S. DE (Disregarded Entity) que es el caso más común que trabajamos**, el 5472 funciona distinto que para una corporation.

En este caso:

* ✔ Se marca que es una **reporting corporation treated as a disregarded entity**

* ✔ No se completan Part IV ni Part VI

* ✔ Se completa **Part V**

* ✔ Y las transacciones se detallan en un **statement adjunto**

Estamos hablando del **Form 5472** bajo las regulaciones §1.6038A-1(c)(1).

---

# **✅ 1️⃣ Qué exige realmente el IRS en el statement adjunto**

El IRS exige que el statement contenga:

* Tipo de transacción

* Importe bruto

* Identidad de la related party

* Naturaleza económica suficiente para entender la operación

No basta con poner:

“Capital contribution – $10,000”

Eso es insuficiente en una revisión técnica.

# **✅ 2️⃣ Nivel de desglose adecuado (criterio profesional)**

El nivel correcto es:

### **✔ Agrupado por tipo de transacción**

(no es obligatorio listar movimiento por movimiento)

Pero sí debe haber:

* Totales por categoría

* Descripción clara

---

# **🎯 Estructura recomendada del Federal Supporting Statement**

Ejemplo profesional:

---

## **Federal Supporting Statement**

Attached to Form 5472  
 Tax Year: 01-01-2025 to 12-31-2025  
 Reporting Corporation: \[Nombre LLC\]  
 EIN: XX-XXXXXXX

### **Related Party:**

\[Nombre completo del propietario extranjero\]  
 Country of residence: Spain

### **1\. Capital Contributions Received**

Total amount: $10,000

Description:  
 Cash contributions made by the foreign owner to fund operating expenses of the disregarded entity.

---

### **2\. Payments Made to Related Party**

Total amount: $2,000

Description:  
 Reimbursement of business expenses initially paid personally by the foreign owner.

---

### **3\. No Other Reportable Transactions**

The reporting corporation had no additional reportable transactions with the related party during the tax year.

---

# **✅ 3️⃣ Qué NO exige el IRS**

No exige:

* Extractos bancarios

* Detalle diario de cada transferencia

* Factura por factura

* Contratos adjuntos

Pero sí exige que, si lo solicita en auditoría, podamos sustentar los totales.

# **🚨 Punto crítico en DE foreign-owned**

En una DE:

El 5472 se presenta junto con el 1120 pro forma.

El statement sustituye el detalle que en corporations normales iría en Part IV–VI.

Por eso el statement debe permitir que el IRS:

* Identifique tipo de operación

* Identifique sentido del flujo (inbound/outbound)

* Identifique importe bruto

* Identifique related party

---

# **✅ 4️⃣ Cómo calcular el campo 1f en este caso**

En DE:

1f \= suma total de todos los importes declarados en el statement adjunto

Si tenemos:

* Capital contributions: 10,000

* Reimbursements: 2,000

👉 **1f \= 12.000**

Te propongo estructurarlo como lo haría un despacho que quiere **automatizar 5472 para Foreign-Owned U.S. DE** sin generar riesgo técnico.

Estamos hablando siempre del **Form 5472** para una DE foreign-owned.

---

# **🎯 Objetivo**

Generar automáticamente:

1. Federal Supporting Statement

2. Campo 1f correctamente calculado

3. Consistencia total con 1120 pro forma

Desde:

* Base de datos (Supabase)

* O cuestionario web

---

# **🧱 1️⃣ Diseño correcto del modelo de datos**

No debemos pedir “importe total anual” sin más.

Debemos estructurarlo por **categoría reportable IRS**.

### **Tabla recomendada: `related_party_transactions`**

Campos:

**\</\> Plain Text**

id  
client\_id  
tax\_year  
transaction\_type  
direction  
amount  
currency  
description\_optional  
date\_range\_optional

## **🎯 Campo crítico: transaction\_type**

Usemos categorías IRS reales:

**\</\> Plain text**

capital\_contribution  
loan\_from\_owner  
loan\_to\_owner  
expense\_reimbursement\_to\_owner  
service\_payment\_to\_owner  
royalty\_payment  
other

Esto nos permitirá generar el statement automáticamente.

---

## **🎯 Campo direction**

**\</\> Plain text**

inbound   (owner → LLC)  
outbound  (LLC → owner)

Importante para coherencia narrativa.

---

# **🧮 2️⃣ Lógica de agregación automática**

Para cada tax\_year:

**\</\> SQL**

SELECT  
  transaction\_type,  
  SUM(amount) as total  
FROM related\_party\_transactions  
WHERE client\_id \= X  
AND tax\_year \= 2025  
GROUP BY transaction\_type;

Luego:

**\</\> Python**  
total\_1f \= sum(all totals)

**Ese resultado va directo al campo 1f.**

---

# **🧾 3️⃣ Generación automática del Federal Supporting Statement**

Plantilla dinámica:

---

## **Federal Supporting Statement**

Attached to Form 5472  
 Tax Year: {{start\_date}} to {{end\_date}}  
 Reporting Corporation: {{llc\_name}}  
 EIN: {{ein}}

Related Party: {{owner\_name}}  
 Country of Residence: {{country}}

---

{% for category in categories %}

### **{{ category.title }}**

Total Amount: ${{ category.total }}

Description:  
 {{ auto\_description(category.type) }}

{% endfor %}

---

## **🔧 Función auto\_description()**

Ejemplo lógico:

**\</\> Python**

if type \== "capital\_contribution":  
    return "Cash contributions made by the foreign owner to fund operating activities of the disregarded entity."

if type \== "expense\_reimbursement\_to\_owner":  
    return "Reimbursement of business expenses initially paid personally by the foreign owner."

if type \== "loan\_from\_owner":  
    return "Funds advanced by the foreign owner classified as a loan."

---

# **🧠 4️⃣ Cómo simplificar el cuestionario web**

En vez de pedir transacciones individuales, pide totales anuales por categoría.

Cuestionario inteligente:

---

### **Sección 1 – Aportes del propietario**

* ¿Realizó aportes de capital durante el año?

  * Sí → ¿Importe total anual?

---

### **Sección 2 – Gastos pagados personalmente**

* ¿Pagó gastos de la LLC desde su cuenta personal?

  * Sí → ¿Importe total anual?

---

### **Sección 3 – Préstamos**

* ¿Hubo préstamos entre usted y la LLC?

  * Desde usted a la LLC → importe

  * Desde la LLC a usted → importe

---

Eso es suficiente para un 5472 correcto.

No necesitamos movimiento por movimiento.

---

# **🚨 5️⃣ Validaciones automáticas que debemos implementar**

### **✔ Si total transacciones \> 0 → 5472 obligatorio**

### **✔ Si total transacciones \= 0 → advertencia legal**

Mensaje automático:

"Confirm that no reportable transactions occurred, including capital contributions or reimbursements."

Esto me protege profesionalmente.

---

# **📊 6️⃣ Control cruzado profesional**

Campo 1f debe coincidir con:

**\</\> Plain text**

SUM(statement totals) \== field 1f

Automaticemos un check:

**\</\> Python**

assert total\_1f \== sum(statement\_totals)

Si no coincide → no permitir generación del PDF.

Te propongo estructura con Supabase, para diseñarlo con mentalidad de producto fiscal escalable, no como “script que genera PDFs”.

Objetivo:  
 ✔ Automatizar **Form 5472 (DE foreign-owned)**  
 ✔ Generar Federal Supporting Statement  
 ✔ Calcular automáticamente campo 1f  
 ✔ Minimizar riesgo IRS  
 ✔ Escalar a muchos clientes

Hablamos siempre del **Form 5472** para una Foreign-Owned U.S. DE.

---

# **🧱 1️⃣ Arquitectura exacta con Supabase**

## **🔹 Stack recomendado**

* Frontend: Next.js (ya lo usamos)

* Backend: Supabase (Postgres \+ Auth \+ Edge Functions)

* Generación PDF: Backend server-side (Node o Python)

* Storage: Supabase Storage (para guardar PDFs generados)

---

# **📊 2️⃣ Modelo de Base de Datos (estructura profesional)**

`Tabla: clients`

**\</\> SQL**

id (uuid, pk)  
user\_id (uuid, auth)  
llc\_name  
ein  
formation\_date  
tax\_year  
fiscal\_year\_type (enum: calendar | custom)  
created\_at

`Tabla: related_parties`

**`</> SQL`**

id (uuid, pk)  
client\_id (fk)  
full\_name  
country\_of\_residence  
tax\_id\_optional  
ownership\_percentage

`Normalmente 1 registro en DE.`

---

## `Tabla: related_party_transactions`

**`</> SQL`**

id (uuid, pk)  
client\_id (fk)  
tax\_year  
transaction\_type (enum)  
direction (enum: inbound | outbound)  
amount (numeric)  
notes  
created\_at

**`Enum`** `transaction_type`  
**`</> Plain text`**

capital\_contribution  
expense\_reimbursement\_to\_owner  
loan\_from\_owner  
loan\_to\_owner  
service\_payment  
royalty  
other

Esto es clave para automatización limpia.

---

# **`🧮 3️⃣ Lógica automática (Supabase RPC o backend)`**

## **`Paso 1 – Agregación`**

**`</> SQL`**

`SELECT`  
  `transaction_type,`  
  `SUM(amount) as total`  
`FROM related_party_transactions`  
`WHERE client_id = $1`  
`AND tax_year = $2`  
`GROUP BY transaction_type;`

**`Paso 2 – Calcular campo 1f`**

**`</> SQL`**

`SELECT SUM(amount)`  
`FROM related_party_transactions`  
`WHERE client_id = $1`  
`AND tax_year = $2;`

`Ese resultado = campo 1f.`

---

## **`Paso 3 – Validación automática`**

`Si:`

**`</> Plain text`**

`total_1f = 0`

`Mostrar advertencia (con check):`

`Confirma que no se hayan realizado transacciones declarables, incluidas aportaciones o reembolsos de capital.`

`Esto me protege legalmente.`

`—----------------------------------------------------------`

`En cuanto al flujo del cliente durante el onboarding:`

`Sección – Datos propietario extranjero`

`Incluir la solicitud del % de propiedad`

`Sección – Transacciones Reportables`

`En vez de pedir movimientos individuales:`

`Campos tipo:`

`✔ Capital contributions total año`  
 `✔ Gastos pagados personalmente`  
 `✔ Préstamos del socio`  
 `✔ Pagos al socio`

`Guardamos cada respuesta como un registro en related_party_transactions.`

## **`🔹– Confirmación y cálculo automático`**

`Sistema ejecuta:`

* `Query agregación`  
* `Cálculo campo 1f`  
* `Generación JSON estructurado`

`Ejemplo JSON interno:`

**`</> JSON`**

`{`  
  `"tax_year": "2025",`  
  `"period_start": "01-01-2025",`  
  `"period_end": "12-31-2025",`  
  `"transactions": [`  
    `{`  
      `"type": "capital_contribution",`  
      `"total": 10000`  
    `},`  
    `{`  
      `"type": "expense_reimbursement_to_owner",`  
      `"total": 2000`  
    `}`  
  `],`  
  `"total_1f": 12000`  
`}`

# **`🧾 5️⃣ Generación automática del Supporting Statement`**

`Plantilla backend:`

**`</> Código`**

`Federal Supporting Statement`  
`Attached to Form 5472`  
`Tax Year: 01-01-2025 to 12-31-2025`  
`Reporting Corporation: {{llc_name}}`  
`EIN: {{ein}}`

`Related Party: {{owner_name}}`  
`Country of Residence: {{country}}`

`{{for each transaction_type}}`

`### {{human_readable_title}}`

`Total Amount: ${{total}}`

`Description:`  
`{{standardized_description}}`

`{{end}}`

# **`🧠 7️⃣ Lógica clave para robustez`**

## **`✔ Control de coherencia fiscal`**

`Si tax_year = 2025`

`Siempre forzar:`

**`</> Código`**

`period_start = 01-01-2025`  
`period_end = 12-31-2025`

`Nunca usar formation_date.`

---

## **`✔ Control de riesgo IRS`**

`Implementar validación:`

**`</> Pseudo`**

`if transaction_type = loan_from_owner`  
   `require: confirm whether written agreement exists`

`Esto me posicionaría como servicio premium.`

---

# **`📂 8️⃣ Almacenamiento final`**

* `Guardar PDF en Supabase Storage`  
* `Guardar hash del documento (para auditoría)`  
* `Guardar snapshot JSON del filing`

`Esto permite:`

`✔ Regenerar en el futuro`  
`✔ Defender ante revisión`

