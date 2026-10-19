'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { trackEvent, type AnalyticsEventName, type AnalyticsParams } from '@/lib/analytics';

export interface TrackLinkProps {
  href: string;
  children: ReactNode;
  /** Evento registrado al hacer clic. */
  event?: AnalyticsEventName;
  params?: AnalyticsParams;
  className?: string;
  external?: boolean;
  target?: '_blank' | '_self';
  rel?: string;
  'aria-label'?: string;
}

/**
 * Enlace que registra el clic en la capa de analítica opcional.
 * Permite mantener los componentes de servidor (pie de página, secciones)
 * sin convertirlos en Client Components.
 */
export function TrackLink({
  href,
  children,
  event,
  params,
  className,
  external,
  target,
  rel,
  'aria-label': ariaLabel,
}: TrackLinkProps) {
  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);
  const isNewTab = target === '_blank' || (isExternal && target !== '_self' && !href.startsWith('tel:'));

  const handleClick = () => {
    if (event) trackEvent(event, params);
  };

  if (isExternal) {
    return (
      <a
        className={className}
        href={href}
        target={isNewTab ? '_blank' : undefined}
        rel={isNewTab ? (rel ?? 'noopener noreferrer') : rel}
        onClick={handleClick}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={className} href={href} onClick={handleClick} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
