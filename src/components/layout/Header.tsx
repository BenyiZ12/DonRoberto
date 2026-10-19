'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, MessageCircle, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { site } from '@/data/site';
import { trackEvent } from '@/lib/analytics';
import { whatsappUrl } from '@/lib/whatsapp';
import { Logo } from './Logo';
import styles from './Header.module.css';

/**
 * Encabezado del sitio.
 *
 * - Fijo (sticky) y compacto al hacer scroll.
 * - Sobre el hero de la portada se muestra en modo transparente con texto
 *   claro; en el resto de páginas y al desplazarse usa fondo sólido.
 * - Menú móvil a pantalla completa, con foco atrapado, cierre con Escape y
 *   bloqueo del scroll del cuerpo.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  /**
   * El menú se guarda junto con la ruta en la que se abrió. Al navegar, la
   * ruta deja de coincidir y el menú se cierra solo, sin necesidad de un
   * efecto que dispare un render extra.
   */
  const [menuState, setMenuState] = useState<{ open: boolean; path: string }>({
    open: false,
    path: pathname,
  });
  const menuOpen = menuState.open && menuState.path === pathname;
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isHome = pathname === '/';
  const transparent = isHome && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Bloquea el scroll del cuerpo mientras el menú móvil está abierto.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  // Escape cierra el menú.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuState({ open: false, path: pathname });
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, pathname]);

  // Foco inicial y trampa de foco dentro del panel abierto.
  useEffect(() => {
    if (!menuOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    const focusables = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusables[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener('keydown', onKeyDown);
    return () => panel.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuState({ open: false, path: pathname });
  }, [pathname]);

  const toggleMenu = useCallback(() => {
    setMenuState((current) => ({
      open: !(current.open && current.path === pathname),
      path: pathname,
    }));
  }, [pathname]);

  const handleNavClick = (label: string) => {
    trackEvent('clic_navegacion', { destino: label });
  };

  return (
    <header
      className={`site-header ${styles.header}`}
      data-transparent={transparent ? 'true' : 'false'}
      data-open={menuOpen ? 'true' : 'false'}
    >
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="Don Roberto - Hotel y Cafetería, inicio">
          <Logo tone={transparent ? 'light' : 'dark'} />
        </Link>

        <nav className={styles.nav} aria-label="Navegación principal">
          <ul className={styles.navList}>
            {site.mainNav.map((item) => {
              const isActive =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.navLink}
                    data-active={isActive ? 'true' : 'false'}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => handleNavClick(item.label)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a
            className={styles.reserve}
            href={whatsappUrl(
              'Hola, Don Roberto. Quisiera consultar disponibilidad de habitaciones. ¿Me pueden orientar?',
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('clic_whatsapp', { ubicacion: 'header' })}
          >
            <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
            <span>Consultar disponibilidad</span>
          </a>

          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            onClick={toggleMenu}
          >
            <span className="visually-hidden">
              {menuOpen ? 'Cerrar el menú' : 'Abrir el menú'}
            </span>
            {menuOpen ? (
              <X size={22} strokeWidth={1.8} aria-hidden="true" />
            ) : (
              <Menu size={22} strokeWidth={1.8} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Panel del menú móvil */}
      <div
        id="menu-movil"
        ref={panelRef}
        className={styles.panel}
        data-open={menuOpen ? 'true' : 'false'}
        aria-hidden={menuOpen ? undefined : 'true'}
        {...(menuOpen ? {} : { inert: true })}
      >
        <nav className={styles.panelNav} aria-label="Navegación móvil">
          <ul className={styles.panelList}>
            {site.mainNav.map((item, index) => {
              const isActive =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <li key={item.href} style={{ transitionDelay: `${index * 40}ms` }}>
                  <Link
                    href={item.href}
                    className={styles.panelLink}
                    data-active={isActive ? 'true' : 'false'}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={closeMenu}
                  >
                    <span className={styles.panelIndex}>0{index + 1}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li style={{ transitionDelay: `${site.mainNav.length * 40}ms` }}>
              <Link
                href="/preguntas-frecuentes"
                className={styles.panelLink}
                aria-current={pathname === '/preguntas-frecuentes' ? 'page' : undefined}
                onClick={closeMenu}
              >
                <span className={styles.panelIndex}>0{site.mainNav.length + 1}</span>
                Preguntas frecuentes
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.panelFooter}>
          <a
            className={styles.panelCta}
            href={whatsappUrl(
              'Hola, Don Roberto. Quisiera consultar disponibilidad de habitaciones. ¿Me pueden orientar?',
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackEvent('clic_whatsapp', { ubicacion: 'menu_movil' });
              closeMenu();
            }}
          >
            <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
            Consultar por WhatsApp
          </a>
          <p className={styles.panelNote}>
            El sitio no confirma reservas en línea: el equipo de Don Roberto te responde con la
            disponibilidad y las tarifas.
          </p>
        </div>
      </div>
    </header>
  );
}
