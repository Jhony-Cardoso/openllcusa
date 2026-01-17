'use client';

import { useState, useEffect } from 'react';

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('calculator-disclaimer-accepted');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    if (!isChecked) {
      alert('⚠️ Debes marcar la casilla para continuar');
      return;
    }
    localStorage.setItem('calculator-disclaimer-accepted', 'true');
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        maxWidth: '650px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '0',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        animation: 'slideIn 0.3s ease-out'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header con gradiente */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '2rem',
          borderRadius: '16px 16px 0 0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚠️</div>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: 'white',
            margin: 0,
            marginBottom: '0.5rem'
          }}>
            Importante: Lee antes de usar
          </h2>
          <p style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '1rem',
            margin: 0 
          }}>
            Por favor, lee cuidadosamente las siguientes advertencias antes de usar la calculadora fiscal.
          </p>
        </div>

        {/* Contenido */}
        <div style={{ padding: '2rem' }}>
          
          {/* Lista de puntos con iconos */}
          <div style={{ marginBottom: '1.5rem' }}>
            
            {/* Punto 1 */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1rem',
              padding: '1rem',
              background: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #86efac'
            }}>
              <div style={{
                fontSize: '1.5rem',
                flexShrink: 0,
                width: '30px',
                height: '30px',
                background: '#22c55e',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>✓</div>
              <p style={{ margin: 0, color: '#166534', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Esta calculadora proporciona <strong>estimaciones generales</strong> basadas en datos públicos
              </p>
            </div>

            {/* Punto 2 */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1rem',
              padding: '1rem',
              background: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #86efac'
            }}>
              <div style={{
                fontSize: '1.5rem',
                flexShrink: 0,
                width: '30px',
                height: '30px',
                background: '#22c55e',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>✓</div>
              <p style={{ margin: 0, color: '#166534', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Los resultados <strong>NO sustituyen</strong> asesoramiento profesional certificado
              </p>
            </div>

            {/* Punto 3 */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1rem',
              padding: '1rem',
              background: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #86efac'
            }}>
              <div style={{
                fontSize: '1.5rem',
                flexShrink: 0,
                width: '30px',
                height: '30px',
                background: '#22c55e',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>✓</div>
              <p style={{ margin: 0, color: '#166534', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Cada situación fiscal es <strong>única</strong> y requiere análisis individual
              </p>
            </div>

            {/* Punto 4 */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1rem',
              padding: '1rem',
              background: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #86efac'
            }}>
              <div style={{
                fontSize: '1.5rem',
                flexShrink: 0,
                width: '30px',
                height: '30px',
                background: '#22c55e',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>✓</div>
              <p style={{ margin: 0, color: '#166534', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Debes <strong>consultar con un asesor fiscal certificado</strong> antes de tomar decisiones
              </p>
            </div>

            {/* Punto 5 - Negativo */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              padding: '1rem',
              background: '#fef2f2',
              borderRadius: '8px',
              border: '1px solid #fca5a5'
            }}>
              <div style={{
                fontSize: '1.5rem',
                flexShrink: 0,
                width: '30px',
                height: '30px',
                background: '#ef4444',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>✗</div>
              <p style={{ margin: 0, color: '#991b1b', fontSize: '0.95rem', lineHeight: '1.6' }}>
                <strong>No nos hacemos responsables</strong> de decisiones basadas exclusivamente en esta herramienta
              </p>
            </div>

          </div>

          {/* Checkbox */}
          <div style={{
            borderTop: '2px solid #e5e7eb',
            paddingTop: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <label style={{
              display: 'flex',
              gap: '0.75rem',
              cursor: 'pointer',
              alignItems: 'flex-start',
              padding: '1rem',
              background: '#fef3c7',
              borderRadius: '8px',
              border: '2px solid #fbbf24'
            }}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                style={{
                  marginTop: '0.25rem',
                  width: '1.25rem',
                  height: '1.25rem',
                  cursor: 'pointer',
                  accentColor: '#7c3aed'
                }}
              />
              <span style={{ 
                fontSize: '0.9rem', 
                color: '#78350f', 
                lineHeight: '1.6',
                fontWeight: 500
              }}>
                He leído y comprendo las limitaciones de esta herramienta. Entiendo que los resultados 
                son orientativos y que debo consultar con profesionales antes de tomar decisiones fiscales.
              </span>
            </label>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleAccept}
              disabled={!isChecked}
              style={{
                flex: 1,
                minWidth: '200px',
                background: isChecked ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#9ca3af',
                color: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '1.05rem',
                cursor: isChecked ? 'pointer' : 'not-allowed',
                border: 'none',
                transition: 'all 0.3s',
                boxShadow: isChecked ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none'
              }}
              onMouseOver={(e) => {
                if (isChecked) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isChecked ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none';
              }}
            >
              ✓ Entiendo y acepto
            </button>
            
            <a
              href="/legal/terms-and-conditions"
              target="_blank"
              style={{
                flex: 1,
                minWidth: '200px',
                border: '2px solid #d1d5db',
                color: '#374151',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '1.05rem',
                textDecoration: 'none',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                background: 'white'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.borderColor = '#9ca3af';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              📄 Leer términos completos
            </a>
          </div>

          {/* Footer */}
          <p style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            marginTop: '1.5rem',
            textAlign: 'center',
            marginBottom: 0
          }}>
            Última actualización: 1 noviembre 2025 | Versión 2.3.1
          </p>
        </div>

      </div>
    </div>
  );
}
