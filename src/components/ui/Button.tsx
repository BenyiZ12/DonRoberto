import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'terracotta' | 'outline' | 'light' | 'ghost-light';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
  children: ReactNode;
  /** Icono a la izquierda del texto. */
  icon?: ReactNode;
  /** Atributo aria-label cuando el texto visible no es descriptivo. */
  ariaLabel?: string;
}

type LinkButtonProps = BaseProps & {
  href: string;
  external?: boolean;
  target?: '_blank' | '_self';
  rel?: string;
  onClick?: () => void;
  'aria-label'?: string;
};

type NativeButtonProps = BaseProps & {
  href?: undefined;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
};

export type ButtonProps = LinkButtonProps | NativeButtonProps;

const variantClass: Record<ButtonVariant, string> = {
  primary: '',
  terracotta: styles.terracotta ?? '',
  outline: styles.outline ?? '',
  light: styles.light ?? '',
  'ghost-light': styles.ghostLight ?? '',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: styles.sm ?? '',
  md: styles.md ?? '',
  lg: styles.lg ?? '',
};

/**
 * Botón del sistema de diseño. Renderiza un `Link` cuando recibe `href` y un
 * `<button>` nativo en el resto de los casos, para que la semántica sea
 * correcta en cada situación.
 */
export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    block = false,
    className,
    children,
    icon,
    ariaLabel,
  } = props;

  const classes = [
    'btn',
    variantClass[variant],
    sizeClass[size],
    block ? styles.block : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {icon}
      <span>{children}</span>
    </>
  );

  if ('href' in props && props.href) {
    const { href, external, target, rel, onClick } = props;
    const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);
    const isNewTab = target === '_blank' || (isExternal && target !== '_self' && !href.startsWith('tel:'));

    if (isExternal) {
      return (
        <a
          className={classes}
          href={href}
          target={isNewTab ? '_blank' : undefined}
          rel={isNewTab ? (rel ?? 'noopener noreferrer') : rel}
          onClick={onClick}
          aria-label={ariaLabel}
        >
          {content}
        </a>
      );
    }

    return (
      <Link className={classes} href={href} onClick={onClick} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  const { type = 'button', disabled, onClick } = props as NativeButtonProps;

  return (
    <button
      className={classes}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
