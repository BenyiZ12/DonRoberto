import Image from 'next/image';
import { Bath, BedDouble, Building2, Coffee, MapPinned, UtensilsCrossed } from 'lucide-react';
import type { PhotoSlot as PhotoSlotData } from '@/data/business';
import styles from './PhotoSlot.module.css';

type PhotoKind = 'facade' | 'room' | 'bath' | 'cafe' | 'dish' | 'location';

const ICONS: Record<PhotoKind, typeof BedDouble> = {
  facade: Building2,
  room: BedDouble,
  bath: Bath,
  cafe: Coffee,
  dish: UtensilsCrossed,
  location: MapPinned,
};

export interface PhotoSlotProps {
  photo: PhotoSlotData;
  kind?: PhotoKind;
  /** Etiqueta visible bajo el marco. */
  caption?: string;
  /** Relación de aspecto del marco. */
  ratio?: 'wide' | 'square' | 'portrait';
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Marco de fotografía.
 *
 * - Si la foto real todavía no existe (`src === null`), muestra un espacio
 *   reservado elegante que indica exactamente qué imagen falta. Nunca se
 *   muestran fotos de otros hoteles como si fueran de Don Roberto.
 * - En cuanto el propietario suba el archivo a /public y asigne `src`, el
 *   componente cambia a la fotografía real sin tocar nada más.
 */
export function PhotoSlot({
  photo,
  kind = 'room',
  caption,
  ratio = 'wide',
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
}: PhotoSlotProps) {
  const Icon = ICONS[kind];
  const ratioClass =
    ratio === 'square' ? styles.square : ratio === 'portrait' ? styles.portrait : styles.wide;

  if (photo.src) {
    return (
      <figure className={`${styles.frame} ${ratioClass} ${styles.filled} ${className ?? ''}`}>
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes={sizes}
          priority={priority}
          className={styles.image}
        />
        {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
      </figure>
    );
  }

  return (
    <figure
      className={`${styles.frame} ${ratioClass} ${styles.placeholder} ${className ?? ''}`}
      data-photo-slot={photo.slot}
    >
      <span className={styles.icon} aria-hidden="true">
        <Icon size={30} strokeWidth={1.4} />
      </span>
      <span className={styles.label}>
        <span className={styles.labelTitle}>Espacio reservado</span>
        <span className={styles.labelText}>{photo.alt}</span>
      </span>
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  );
}
