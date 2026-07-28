'use client';

import React, { useEffect } from 'react';

export default function ScrollObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          
          // Solo calculamos delay si el padre es un contenedor flex o grid 
          // para evitar delays masivos en secciones completas
          const parent = entry.target.parentElement;
          let delay = 0;
          
          if (parent) {
            const parentStyle = window.getComputedStyle(parent);
            if (parentStyle.display === 'flex' || parentStyle.display === 'grid') {
              // Buscar solo entre los hijos directos
              const siblings = Array.from(parent.children).filter(el => el.classList.contains('hp-fu'));
              delay = siblings.indexOf(entry.target) * 85;
            }
          }

          if (delay > 0) {
            (entry.target as HTMLElement).style.transitionDelay = `${delay}ms`;
          }
          
          entry.target.classList.add('hp-on');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0, rootMargin: '0px 0px -50px 0px' }
    );
    
    // Pequeño timeout para asegurar que el DOM está listo
    setTimeout(() => {
      document.querySelectorAll('.hp-fu').forEach((el) => observer.observe(el));
    }, 100);
    
    return () => observer.disconnect();
  }, []);

  return null;
}
