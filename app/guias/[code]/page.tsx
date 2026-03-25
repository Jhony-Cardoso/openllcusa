import React from 'react';
import type { Country } from '@/components/CountrySelector/countries';
import { allCountries } from '@/components/CountrySelector/countries';

type Props = {
   params: Promise<{ code: string }>;
};

export default async function CountryGuide(props: Props) {
  const params = await props.params;
  const code = params.code.toLowerCase();
  const country: Country | undefined = allCountries.find(c => c.code === code);

  if (!country) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Guía no encontrada</h1>
        <p>No hemos encontrado una guía para <strong>{params.code}</strong>. Puedes volver a la página principal.</p>
        <div className="mt-6"><a href="/" className="text-blue-600 hover:underline">← Volver</a></div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Guía para {country.name}</h1>
      <p className="text-gray-700 mb-6">Guía específica para emprendedores desde {country.name}. Contiene: requisitos, recomendaciones fiscales, pasos para abrir cuenta bancaria y cómo gestionar impuestos.</p>

      <section className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-3">Resumen rápido</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Requisitos para crear una LLC desde {country.name}.</li>
          <li>Tiempo estimado: 48-72 horas.</li>
          <li>Documentación necesaria: pasaporte válido, dirección postal o virtual y datos de contacto.</li>
          <li>Consideraciones fiscales para residentes en {country.name}.</li>
        </ul>
      </section>

      <div className="mt-6">
        <a href="/" className="text-blue-600 hover:underline">← Volver</a>
      </div>
    </main>
  );
}