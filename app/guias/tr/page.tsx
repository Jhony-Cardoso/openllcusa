import React from 'react';

export default function GuidePage(): JSX.Element {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Guía para Turquía</h1>
      <p className="text-gray-700 mb-6">Contenido específico para emprendedores desde Turquía. Incluye requisitos, tiempos, documentación y recomendaciones fiscales.</p>

      <section className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-3">Resumen rápido</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Requisitos para crear una LLC desde Turquía.</li>
          <li>Tiempo estimado: 48-72 horas.</li>
          <li>Documentación necesaria: pasaporte válido, dirección postal o virtual y datos de contacto.</li>
        </ul>
      </section>

      <div className="mt-6"><a href="/" className="text-blue-600 hover:underline">← Volver</a></div>
    </main>
  );
}