import styles from '../shared.module.css'; // Reutilizamos los estilos

export const metadata = {
  title: 'Política de Privacidad | Open LLC USA',
  description: 'Política de privacidad y protección de datos de Open LLC USA',
  robots: 'index, follow',
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <a href="/calculadora-fiscal" className={styles.backLink}>
            ← Volver a la calculadora
          </a>
        </div>

        {/* Contenido */}
        <article className={styles.markdownContent}>
          <h1>Política de Privacidad</h1>

          <section>
            <h2>1. Información que Recopilamos</h2>
            <p>
              En Open LLC USA recopilamos únicamente la información necesaria para proporcionarte 
              nuestros servicios:
            </p>

            <h3>1.1 Información que nos proporcionas</h3>
            <ul>
              <li>Respuestas del quiz de cualificación (almacenadas localmente en tu navegador)</li>
              <li>Datos introducidos en la calculadora fiscal (procesados solo en tu dispositivo)</li>
              <li>Correo electrónico y nombre (solo si contactas con nosotros)</li>
            </ul>

            <h3>1.2 Información recopilada automáticamente</h3>
            <ul>
              <li>Datos de navegación mediante Google Analytics (cookies)</li>
              <li>Dirección IP (anonimizada)</li>
              <li>Tipo de navegador y dispositivo</li>
              <li>Páginas visitadas y tiempo de permanencia</li>
            </ul>
          </section>

          <section>
            <h2>2. Cómo Usamos tu Información</h2>
            <p>Utilizamos los datos recopilados para:</p>
            <ul>
              <li><strong>Mejorar nuestros servicios:</strong> Analizar cómo los usuarios interactúan con la calculadora</li>
              <li><strong>Personalizar tu experiencia:</strong> Recordar tus respuestas del quiz (localStorage)</li>
              <li><strong>Estadísticas anónimas:</strong> Entender patrones de uso mediante Google Analytics</li>
              <li><strong>Contacto:</strong> Responder a tus consultas si nos escribes</li>
            </ul>

            <blockquote>
              <strong>⚠️ Importante:</strong> Los datos introducidos en la calculadora fiscal 
              NO se envían a nuestros servidores. Todo el cálculo se realiza en tu navegador.
            </blockquote>
          </section>

          <section>
            <h2>3. Almacenamiento Local (LocalStorage)</h2>
            <p>
              Utilizamos <code>localStorage</code> del navegador para guardar:
            </p>
            <ul>
              <li>Aceptación del disclaimer de la calculadora</li>
              <li>Respuestas del quiz de cualificación</li>
              <li>Preferencias de cookies</li>
            </ul>
            <p>
              <strong>Estos datos permanecen solo en tu dispositivo</strong> y puedes eliminarlos 
              en cualquier momento desde la configuración de tu navegador.
            </p>
          </section>

          <section>
            <h2>4. Cookies y Tecnologías Similares</h2>
            
            <h3>4.1 Google Analytics</h3>
            <p>
              Utilizamos Google Analytics para recopilar información sobre cómo los visitantes 
              usan nuestro sitio web. Estas cookies nos ayudan a:
            </p>
            <ul>
              <li>Contar visitantes y entender cómo navegan por el sitio</li>
              <li>Identificar qué páginas son más populares</li>
              <li>Detectar errores y problemas de usabilidad</li>
            </ul>

            <h3>4.2 Cookies Esenciales</h3>
            <p>
              Cookies necesarias para el funcionamiento básico del sitio (aceptación de términos, 
              preferencias de cookies).
            </p>

            <h3>4.3 Gestión de Cookies</h3>
            <p>
              Puedes gestionar tus preferencias de cookies mediante nuestro banner de cookies o 
              directamente desde la configuración de tu navegador.
            </p>
          </section>

          <section>
            <h2>5. Compartir Información con Terceros</h2>
            <p>
              <strong>NO vendemos, alquilamos ni compartimos</strong> tu información personal con terceros, 
              excepto:
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> Para análisis de tráfico web (datos anonimizados)</li>
              <li><strong>Obligaciones legales:</strong> Si la ley nos obliga a divulgar información</li>
            </ul>
          </section>

          <section>
            <h2>6. Tus Derechos (GDPR)</h2>
            <p>
              Según el Reglamento General de Protección de Datos (GDPR), tienes derecho a:
            </p>
            <ul>
              <li><strong>Acceso:</strong> Solicitar qué datos tenemos sobre ti</li>
              <li><strong>Rectificación:</strong> Corregir datos incorrectos</li>
              <li><strong>Supresión:</strong> Solicitar la eliminación de tus datos</li>
              <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
              <li><strong>Oposición:</strong> Oponerte al procesamiento de tus datos</li>
              <li><strong>Limitación:</strong> Solicitar limitar el uso de tus datos</li>
            </ul>
            <p>
              Para ejercer cualquiera de estos derechos, contacta con nosotros en:{' '}
              <a href="mailto:privacy@openllcusa.com">privacy@openllcusa.com</a>
            </p>
          </section>

          <section>
            <h2>7. Seguridad</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger 
              tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.
            </p>
            <ul>
              <li>Conexión HTTPS encriptada</li>
              <li>Procesamiento local de datos sensibles (calculadora)</li>
              <li>Minimización de datos recopilados</li>
            </ul>
          </section>

          <section>
            <h2>8. Retención de Datos</h2>
            <p>
              Conservamos tu información solo el tiempo necesario para los fines descritos en esta política:
            </p>
            <ul>
              <li><strong>LocalStorage:</strong> Hasta que lo borres manualmente</li>
              <li><strong>Google Analytics:</strong> 26 meses (configurable)</li>
              <li><strong>Consultas por email:</strong> Hasta 3 años después del último contacto</li>
            </ul>
          </section>

          <section>
            <h2>9. Menores de Edad</h2>
            <p>
              Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos 
              conscientemente información de menores. Si descubrimos que hemos recopilado datos 
              de un menor, los eliminaremos inmediatamente.
            </p>
          </section>

          <section>
            <h2>10. Cambios en esta Política</h2>
            <p>
              Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. 
              Te notificaremos de cambios significativos mediante un aviso en nuestro sitio web.
            </p>
          </section>

          <section>
            <h2>11. Contacto</h2>
            <p>
              Para cualquier pregunta sobre esta política de privacidad o el tratamiento de tus datos:
            </p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:privacy@openllcusa.com">privacy@openllcusa.com</a></li>
              <li><strong>Dirección:</strong> [Tu dirección fiscal si aplica]</li>
            </ul>
          </section>
        </article>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerBox}>
            <h3>🔒 Tu privacidad es importante</h3>
            <p>
              Tomamos muy en serio la protección de tus datos personales. Si tienes dudas, 
              no dudes en contactarnos.
            </p>
          </div>

          <div className={styles.footerActions}>
            <a href="/calculadora-fiscal" className={styles.primaryButton}>
              🧮 Ir a la Calculadora
            </a>
            <a href="/legal/condiciones-generales" className={styles.secondaryButton}>
              📄 Ver Términos
            </a>
          </div>

          <div className={styles.updateInfo}>
            <p>
              <strong>Última actualización:</strong> 4 noviembre 2025 | 
              <strong> Versión:</strong> 1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
