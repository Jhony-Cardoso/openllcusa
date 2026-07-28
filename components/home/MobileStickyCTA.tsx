'use client';

import React, { useState, useEffect } from 'react';
import TrackedLink from './TrackedLink';

const T = {
  ct: '#EA580C', ch: '#C2410C',
  tx: '#111827', tm: '#9CA3AF',
  wh: '#FFFFFF',
  shCta: '0 6px 24px rgba(234,88,12,.38)',
} as const;

export default function MobileStickyCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto gap-3">
          <div className="flex-1 min-w-0">
            <div 
              className="text-[13px] font-bold truncate" 
              style={{ 
                fontFamily: "'Plus Jakarta Sans', sans-serif", 
                color: T.tx 
              }}
            >
              Abre tu LLC desde $349
            </div>
            <div className="text-xs" style={{ color: T.tm }}>
              72 horas · Sin visa · Soporte en español
            </div>
          </div>

          <TrackedLink
            href="#precios"
            trackAction="cta_click"
            trackCategory="sticky_cta"
            trackLabel="precios"
            className="inline-flex items-center font-bold rounded-full whitespace-nowrap flex-shrink-0 text-sm px-5 py-2.5"
            style={{
              background: `linear-gradient(135deg, ${T.ct}, ${T.ch})`,
              color: T.wh,
              textDecoration: 'none',
              boxShadow: T.shCta,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Ver Planes
          </TrackedLink>
        </div>
      </div>
    </div>
  );
}
