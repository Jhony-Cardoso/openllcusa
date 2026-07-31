// app/calculadora-fiscal/page.tsx
import React from 'react';
import CalculadoraClient from '@/components/calculator/CalculadoraClient';

// ===================================
// ✅ NUEVO: SCHEMA JSON-LD PARA SEO
// ===================================
// Este componente añade datos estructurados para buscadores
// Ayuda a Google a entender que es una herramienta/calculadora
function CalculatorSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Calculadora Fiscal España 2025",
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "description": "Calculadora fiscal interactiva para emprendedores en España que permite comparar la carga tributaria entre diferentes estructuras empresariales: autónomo, sociedad limitada (SL) y LLC americana.",
    "url": "https://openllcusa.com/calculadora-fiscal",
    "provider": {
      "@type": "Organization",
      "name": "Open LLC USA",
      "url": "https://openllcusa.com"
    },
    "featureList": [
      "Comparación de impuestos Autónomo vs SL vs LLC",
      "Cálculo de IRPF y Seguridad Social",
      "Estimación de Impuesto de Sociedades",
      "Resultados en tiempo real",
      "Sin necesidad de registro"
    ],
    "screenshot": "https://openllcusa.com/images/calculadora-screenshot.jpg",
    "datePublished": "2024-01-15",
    "dateModified": "2025-11-02",
    "version": "2.3.2",
    "inLanguage": "es-ES",
    "audience": {
      "@type": "Audience",
      "audienceType": "Emprendedores y autónomos en España"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

export default function CalculadoraFiscal() {
  return (
    <>
      <CalculatorSchema />
      <CalculadoraClient />
    </>
  );
}
