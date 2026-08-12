# ¿Puedo tener la cuenta de Stripe USA en USD y retirar el dinero a mi banco local?

Una de las grandes ventajas de tener una LLC y usar Stripe USA es cobrar a clientes de todo el mundo en dólares. Pero surge la duda: *¿Cómo llevo ese dinero hasta mi bolsillo en mi país?*

## El flujo de dinero con Stripe USA
Stripe USA no permite transferir el dinero procesado directamente a una cuenta bancaria en Colombia, Argentina, España o México. Stripe USA solo liquida fondos (hace los "payouts") hacia una **cuenta bancaria americana en dólares**.

## Entonces, ¿cómo lo hago?

El flujo correcto y legal es el siguiente:

1. **Cobro (Stripe):** El cliente paga con tarjeta en tu web. Stripe USA procesa el pago en USD.
2. **Liquidación (Banco USA):** Stripe USA transfiere (payout) automáticamente esos dólares a la cuenta bancaria americana de tu LLC (por ejemplo, Mercury Bank, Relay o la cuenta USD de Payoneer/Wise).
3. **Retiro personal (Tú):** Desde tu cuenta bancaria americana (Mercury/Relay), tú te haces una transferencia bancaria (Wire o SWIFT) hacia tu cuenta bancaria personal en tu país de origen.

## Opciones para el paso 3 (Retiro personal):
- **Transferencia SWIFT directa:** Desde tu banco de la LLC (Mercury) a tu banco local (ej. BBVA España o Bancolombia). Suele tener una tarifa fija por envío internacional.
- **Wise (antes TransferWise):** Puedes enviar dólares desde tu banco de la LLC hacia Wise, y desde Wise enviarlos a tu cuenta local en tu moneda local. Suele tener mejores tasas de conversión de divisa.
- **Criptomonedas:** Algunos emprendedores usan plataformas como Kraken o exchanges compatibles para enviar dinero desde su banco de la LLC, convertirlo a USDT/USDC y luego monetizarlo en su país (especialmente útil en países con controles cambiarios complejos como Argentina).
- **Tarjetas de débito corporativas:** Bancos como Mercury o Relay emiten tarjetas de débito (físicas o virtuales). Puedes usarlas directamente en tu país para pagar gastos del día a día (supermercado, software, restaurantes), descontando directamente de los dólares de la LLC.

**Importante:** Cuando transfieres dinero de tu cuenta de la LLC a tu cuenta personal, estás realizando una "distribución de beneficios". Es fundamental mantener un registro contable de estas transferencias para tu declaración de impuestos en tu país de residencia.
