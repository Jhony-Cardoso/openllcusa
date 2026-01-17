'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { Country } from './countries';
import { allCountries, featuredCountries } from './countries';
import Flag from '@/components/Flag';

type Props = { onClose: () => void };

export default function CountryModal({ onClose }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Foco automático al abrir + limpiar al cerrar
  useEffect(() => {
    // Foco cuando se monta
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    // Limpiar búsqueda al cerrar
    return () => {
      clearTimeout(timeout);
      setSearchTerm('');
    };
  }, []);

  const filtered: Country[] = allCountries.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-[1000] flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Selecciona tu país
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-3xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Busca tu país..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          />
        </div>

        {/* Países destacados */}
        <div className="mb-8">
          <div className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-3">
            Países destacados
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {featuredCountries.map((country) => (
              <Link
                key={country.code}
                href={`/guias/${country.code}`}
                onClick={onClose}
                className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 flex items-center gap-3 transition-all group"
              >
                <Flag countryCode={country.code} size="lg" className="shadow-sm group-hover:scale-110 transition-transform" />
                <span className="font-medium">{country.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Todos los países */}
        <div>
          <div className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-3">
            Todos los países
          </div>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filtered.map((country) => (
                <Link
                  key={country.code}
                  href={`/guias/${country.code}`}
                  onClick={onClose}
                  className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 flex items-center gap-3 transition-all group"
                >
                  <Flag countryCode={country.code} size="md" className="group-hover:scale-110 transition-transform" />
                  <span>{country.name}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              No se encontraron países con "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}