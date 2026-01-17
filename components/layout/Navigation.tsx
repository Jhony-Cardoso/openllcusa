'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Inicio' },
    { href: '/calculadora-fiscal', label: 'Calculadora' },
    { href: '/quiz', label: 'Quiz LLC' },
    { href: '/servicios', label: 'Servicios' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contacto', label: 'Contacto' },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className={pathname === item.href ? styles.active : styles.link}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
