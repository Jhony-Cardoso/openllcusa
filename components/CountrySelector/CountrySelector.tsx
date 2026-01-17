'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { featuredCountries } from './countries';
import CountryModal from './CountryModal';
import Flag from '@/components/Flag';

export default function CountrySelector(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div className="countries-list flex flex-wrap justify-center gap-3 mb-8">
        {featuredCountries.map((country) => (
          <Link
            key={country.code}
            href={`/guias/${country.code}`}
            className="country-badge bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm flex items-center gap-2 hover:border-blue-500 hover:shadow-md transition-all"
          >
           <Flag 
              countryCode={country.code} 
              size="lg" 
              className="shadow-sm" 
            />
            <span>{country.name}</span> 
          </Link>
        ))}

        <button
          onClick={() => setIsOpen(true)}
          className="country-badge bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm flex items-center gap-2 hover:border-blue-500 hover:shadow-md transition-all"
          id="open-country-modal"
        >
          <span className="text-xl">🌐</span>
          <span>+40 países más</span>
        </button>
      </div>

      {isOpen && <CountryModal onClose={() => setIsOpen(false)} />}
    </>
  );
}