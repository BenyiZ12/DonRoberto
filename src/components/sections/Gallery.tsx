'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PhotoSlot } from '@/data/business';
import styles from './Gallery.module.css';

export interface GalleryProps {
  photos: PhotoSlot[];
  /** Etiqueta accesible del grupo de imágenes. */
  label: string;
  className?: string;
}

/**
 * Galería de fotos con visor ampliado.
 *
 * Usa el elemento `<dialog>` nativo: el foco queda atrapado dentro del
 * visor, `Escape` lo cierra y el foco vuelve al botón que lo abrió.
 */
export function Gallery({ photos, label, className }: GalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const open = useCallback((position: number) => {
    setIndex(position);
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setIndex((current) => (current + delta + photos.length) % photos.length);
    },
    [photos.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onClose = () => {
      openerRef.current?.focus();
    };
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, []);

  const current = photos[index];

  return (
    <div className={`${styles.gallery} ${className ?? ''}`}>
      <ul className={styles.grid} data-count={photos.length}>
        {photos.map((photo, position) => (
          <li key={photo.slot} className={styles.item}>
            <button
              type="button"
              className={styles.thumb}
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                open(position);
              }}
              aria-label={`Ampliar imagen: ${photo.alt}`}
            >
              {photo.src ? (
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(max-width: 768px) 50vw, 30vw"
                  className={styles.image}
                />
              ) : (
                <span className={styles.placeholder}>
                  <Expand size={20} strokeWidth={1.5} aria-hidden="true" />
                  <span className={styles.placeholderText}>
                    <span className={styles.placeholderLabel}>Foto pendiente</span>
                    <span className={styles.placeholderAlt}>{photo.alt}</span>
                  </span>
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <dialog ref={dialogRef} className={styles.dialog} aria-label={label}>
        <div className={styles.dialogInner}>
          <div className={styles.dialogHeader}>
            <p className={styles.dialogCaption}>{current?.alt}</p>
            <button
              type="button"
              className={styles.close}
              onClick={close}
              aria-label="Cerrar el visor de imágenes"
            >
              <X size={20} strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.stage}>
            {current?.src ? (
              <Image
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes="90vw"
                className={styles.stageImage}
              />
            ) : (
              <div className={styles.stagePlaceholder}>
                <span className={styles.stageLabel}>Espacio reservado para la fotografía real</span>
                <span className={styles.stageAlt}>{current?.alt}</span>
              </div>
            )}
          </div>

          {photos.length > 1 ? (
            <div className={styles.controls}>
              <button
                type="button"
                className={styles.control}
                onClick={() => step(-1)}
                aria-label="Imagen anterior"
              >
                <ChevronLeft size={20} strokeWidth={1.8} aria-hidden="true" />
              </button>
              <p className={styles.counter} aria-live="polite">
                {index + 1} / {photos.length}
              </p>
              <button
                type="button"
                className={styles.control}
                onClick={() => step(1)}
                aria-label="Imagen siguiente"
              >
                <ChevronRight size={20} strokeWidth={1.8} aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
      </dialog>
    </div>
  );
}
