'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <>
      <style jsx global>{`
        .footer-main {
          background: #11284cff;
          color: #cbd5e1;
          padding: 4rem 0 2rem;
          margin-top: 4rem;
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1.2fr 1.2fr 1.5fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          margin: 0 0 0.5rem 0;
          white-space: nowrap;
        }

        .footer-description {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #94a3b8;
          margin: 0;
        }

        .footer-column-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: white;
          margin: 0 0 1rem 0;
          white-space: nowrap;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.95rem;
          transition: color 0.2s;
          display: inline-block;
          white-space: nowrap;
        }

        .footer-links a:hover {
          color: #6366f1;
        }

        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid #334155;
          text-align: center;
        }

        .footer-copyright {
          font-size: 0.9rem;
          color: #94a3b8;
          margin: 0 0 0.5rem 0;
        }

        .footer-disclaimer {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
          font-style: italic;
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }

          .footer-title,
          .footer-column-title,
          .footer-links a {
            white-space: normal;
          }
        }

        @media (max-width: 768px) {
          .footer-main {
            padding: 3rem 0 1.5rem;
          }

          .footer-container {
            padding: 0 1rem;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-title {
            font-size: 1.25rem;
          }

          .footer-title,
          .footer-column-title,
          .footer-links a {
            white-space: normal;
          }
        }
      `}</style>

      <footer className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Columna 1: Sobre nosotros (más ancha) */}
            <div className="footer-column">
              <h3 className="footer-title">Open LLC USA</h3>
              <p className="footer-description">
                Ayudamos a emprendedores españoles a crear y gestionar su LLC en Estados Unidos
                de forma sencilla y profesional.
              </p>
            </div>

            {/* Columna 2: Recursos */}
            <div className="footer-column">
              <h4 className="footer-column-title">Recursos</h4>
              <ul className="footer-links">
                <li><Link href="/calculadora-fiscal">Calculadora Fiscal</Link></li>
                <li><Link href="/quiz">Quiz ¿Es una LLC para ti?</Link></li>
                <li><Link href="/faq">Preguntas Frecuentes</Link></li>
                <li><Link href="/blog">Blog</Link></li>
              </ul>
            </div>

            {/* Columna 3: Servicios */}
            <div className="footer-column">
              <h4 className="footer-column-title">Servicios</h4>
              <ul className="footer-links">
                <li><Link href="/servicios/crear-llc">Crear LLC</Link></li>
                <li><Link href="/servicios/asesoria-fiscal">Asesoría Fiscal</Link></li>
                <li><Link href="/servicios/mantenimiento">Mantenimiento LLC</Link></li>
                <li><Link href="/contacto">Contacto</Link></li>
              </ul>
            </div>

            {/* Columna 4: Legal (más ancha para textos largos) */}
            <div className="footer-column">
              <h4 className="footer-column-title">Legal</h4>
              <ul className="footer-links">
                <li><Link href="/legal/terms-and-conditions">Términos y condiciones</Link></li>
                <li><Link href="/legal/privacy-policy">Política de privacidad</Link></li>
                <li><Link href="/legal/changelog">Historial de cambios</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="footer-bottom">
            <p className="footer-copyright">
              © {currentYear} Open LLC USA. Todos los derechos reservados.
            </p>
            <p className="footer-disclaimer">
              Open LLC USA no es un bufete de abogados. Trabajamos con abogados registrados en EE.UU. cuando es necesario.
              Todos los servicios son prestados conforme a las leyes federales y estatales vigentes.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
