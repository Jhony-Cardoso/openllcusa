'use client';

import { useState, useEffect } from 'react';
import styles from './CookiesBanner.module.css';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export default function CookiesBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Siempre activadas
    analytics: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    
    if (!consent) {
      // Mostrar banner después de 1 segundo
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Cargar preferencias guardadas
      const saved = JSON.parse(consent);
      setPreferences(saved);
      
      // Inicializar Google Analytics si fue aceptado
      if (saved.analytics) {
        initializeAnalytics();
      }
    }
  }, []);

  const initializeAnalytics = () => {
    // Reemplaza 'G-XXXXXXXXXX' con tu ID de Google Analytics
    const GA_ID = 'G-XXXXXXXXXX'; // ⚠️ CAMBIAR POR TU ID REAL
    
    // Cargar script de Google Analytics
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Configurar gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      anonymize_ip: true, // Anonimizar IPs para GDPR
      cookie_flags: 'SameSite=None;Secure',
    });

    console.log('✅ Google Analytics inicializado');
  };

  const handleAcceptAll = () => {
    const newPreferences = {
      essential: true,
      analytics: true,
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences));
    setPreferences(newPreferences);
    setShowBanner(false);
    
    // Inicializar Analytics
    initializeAnalytics();
  };

  const handleRejectAll = () => {
    const newPreferences = {
      essential: true,
      analytics: false,
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences));
    setPreferences(newPreferences);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
    
    if (preferences.analytics) {
      initializeAnalytics();
    }
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay oscuro */}
      <div className={styles.overlay} onClick={() => setShowBanner(false)} />

      {/* Banner de cookies */}
      <div className={styles.banner}>
        <div className={styles.content}>
          
          {!showSettings ? (
            // Vista principal
            <>
              <div className={styles.icon}>🍪</div>
              
              <h2 className={styles.title}>Utilizamos Cookies</h2>
              
              <p className={styles.description}>
                Usamos cookies esenciales para el funcionamiento del sitio y cookies de análisis 
                (Google Analytics) para mejorar tu experiencia. Puedes aceptar todas, rechazarlas 
                o personalizar tus preferencias.
              </p>

              <div className={styles.buttons}>
                <button 
                  onClick={handleAcceptAll}
                  className={styles.acceptButton}
                >
                  ✓ Aceptar todas
                </button>
                
                <button 
                  onClick={handleRejectAll}
                  className={styles.rejectButton}
                >
                  ✗ Rechazar opcionales
                </button>
                
                <button 
                  onClick={() => setShowSettings(true)}
                  className={styles.settingsButton}
                >
                  ⚙️ Personalizar
                </button>
              </div>

              <div className={styles.links}>
                <a href="/legal/privacy-policy">Política de Privacidad</a>
                <span>•</span>
                <a href="/legal/terms-and-conditions">Términos y Condiciones</a>
              </div>
            </>
          ) : (
            // Vista de configuración
            <>
              <button 
                onClick={() => setShowSettings(false)}
                className={styles.backButton}
              >
                ← Volver
              </button>

              <h2 className={styles.title}>Preferencias de Cookies</h2>

              <div className={styles.cookieOption}>
                <div className={styles.optionHeader}>
                  <label className={styles.optionLabel}>
                    <input
                      type="checkbox"
                      checked={preferences.essential}
                      disabled
                      className={styles.checkbox}
                    />
                    <span>
                      <strong>Cookies Esenciales</strong>
                      <span className={styles.required}>(Obligatorias)</span>
                    </span>
                  </label>
                </div>
                <p className={styles.optionDescription}>
                  Necesarias para el funcionamiento básico del sitio. Incluyen cookies de 
                  sesión y preferencias del usuario. No se pueden desactivar.
                </p>
              </div>

              <div className={styles.cookieOption}>
                <div className={styles.optionHeader}>
                  <label className={styles.optionLabel}>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        analytics: e.target.checked
                      })}
                      className={styles.checkbox}
                    />
                    <span>
                      <strong>Cookies de Análisis</strong>
                      <span className={styles.optional}>(Opcional)</span>
                    </span>
                  </label>
                </div>
                <p className={styles.optionDescription}>
                  Nos ayudan a entender cómo los visitantes interactúan con el sitio mediante 
                  Google Analytics. Los datos se anonimizan.
                </p>
              </div>

              <div className={styles.buttons}>
                <button 
                  onClick={handleSavePreferences}
                  className={styles.saveButton}
                >
                  ✓ Guardar preferencias
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
