# ¿Tengo que pagar impuestos en EE.UU. por el dinero procesado en Stripe?

Existe una confusión muy común: *"Stripe me reporta al IRS con el Formulario 1099-K, así que tendré que pagar impuestos en EE.UU."* 

Vamos a desmentir este mito y aclarar cómo funciona realmente.

## ¿Qué es el Formulario 1099-K de Stripe?
El formulario 1099-K es un documento informativo que pasarelas de pago como Stripe o PayPal envían al IRS (y a ti) si tus ventas superan cierto umbral en el año (tradicionalmente $20,000 y 200 transacciones, aunque la normativa está en constante cambio). 

Este formulario **solo le dice al IRS cuánto dinero pasó por tu cuenta de Stripe**. No calcula impuestos, ni indica que debas pagarlos.

## ¿Procesar pagos en Stripe me obliga a pagar Income Tax en EE.UU.?
**No.** Stripe es solo una pasarela de pago. Usar un banco americano o una pasarela de pago americana **no crea un Nexo Físico (Establecimiento Permanente)** (ETBUS).

Si eres un extranjero no residente, operas 100% desde fuera de EE.UU., no tienes oficinas ni empleados allí, y usas tu LLC para vender software, servicios, infoproductos o e-commerce internacional, tus ingresos se consideran **No Efectivamente Conectados (NEC)** o de fuente extranjera.

Por tanto:
- El dinero entra en Stripe.
- Stripe informa al IRS del volumen total mediante el 1099-K (si pasas el umbral).
- A fin de año, presentas el **Formulario 5472** (para informar que el dueño es extranjero) y el **Formulario 1120** (solo la página pro-forma).
- Como tu LLC es una "Disregarded Entity" y tú no eres residente fiscal americano, **no pagas impuestos federales sobre la renta (Income Tax) en EE.UU.** sobre esas ventas.

## ¿A quién le pago entonces?
La obligación de declarar esos ingresos generados a través de tu LLC recae en **tu país de residencia fiscal** (España, Argentina, Colombia, México, etc.), de acuerdo con las leyes fiscales de tu país.

## ¿Y qué pasa con el "Sales Tax"?
El *Sales Tax* (impuesto a las ventas, equivalente al IVA/VAT) es diferente al *Income Tax*. Si superas el umbral económico en un estado específico de EE.UU. (por ejemplo, vendes más de $100,000 en mercancía a residentes de Florida), podrías estar obligado a recaudar y remitir Sales Tax a ese estado. Stripe cuenta con herramientas automáticas (Stripe Tax) para calcular y cobrar esto por ti en el momento del pago. Pero reiteramos: el Sales Tax lo paga el comprador, no reduce tu ganancia neta.
