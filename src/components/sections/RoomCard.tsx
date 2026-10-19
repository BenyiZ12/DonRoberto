import { ArrowRight, Bath, BedDouble, MessageCircle, Users } from 'lucide-react';
import type { Room } from '@/data/rooms';
import { formatCRC } from '@/lib/format';
import { buildRoomMessage, whatsappUrl } from '@/lib/whatsapp';
import { Badge } from '@/components/ui/Badge';
import { Gallery } from './Gallery';
import styles from './RoomCard.module.css';

export interface RoomCardProps {
  room: Room;
  /** Alterna la posición de la imagen para una composición editorial. */
  reversed?: boolean;
}

export function RoomCard({ room, reversed = false }: RoomCardProps) {
  const isDemo = room.status === 'demo';

  return (
    <article className={styles.room} data-reversed={reversed ? 'true' : 'false'}>
      <div className={styles.media}>
        <Gallery photos={room.photos} label={`Galería de ${room.name}`} />
      </div>

      <div className={styles.body}>
        <div className={styles.heading}>
          <h3 className={styles.name}>{room.name}</h3>
          {isDemo ? <Badge tone="demo">Ejemplo</Badge> : null}
        </div>

        {room.tagline ? <p className={styles.tagline}>{room.tagline}</p> : null}
        <p className={styles.description}>{room.description}</p>

        <dl className={styles.specs}>
          {room.capacity ? (
            <div className={styles.spec}>
              <dt className={styles.specLabel}>
                <Users size={16} strokeWidth={1.7} aria-hidden="true" />
                Capacidad
              </dt>
              <dd className={styles.specValue}>Hasta {room.capacity} huéspedes</dd>
            </div>
          ) : null}

          {room.bedType ? (
            <div className={styles.spec}>
              <dt className={styles.specLabel}>
                <BedDouble size={16} strokeWidth={1.7} aria-hidden="true" />
                Camas
              </dt>
              <dd className={styles.specValue}>{room.bedType}</dd>
            </div>
          ) : null}

          {room.amenities.length > 0 ? (
            <div className={styles.spec}>
              <dt className={styles.specLabel}>
                <Bath size={16} strokeWidth={1.7} aria-hidden="true" />
                Incluye
              </dt>
              <dd className={styles.specValue}>{room.amenities.join(' · ')}</dd>
            </div>
          ) : null}
        </dl>

        <div className={styles.priceRow}>
          {room.price !== null ? (
            <p className={styles.price}>
              {formatCRC(room.price)}
              <span className={styles.priceUnit}> / noche</span>
            </p>
          ) : (
            <p className={styles.pricePending}>
              Tarifa por confirmar
              {room.priceNote ? <span className={styles.priceNote}>{room.priceNote}</span> : null}
            </p>
          )}
        </div>

        {room.conditions.length > 0 ? (
          <ul className={styles.conditions}>
            {room.conditions.map((condition) => (
              <li key={condition}>{condition}</li>
            ))}
          </ul>
        ) : null}

        <a
          className="btn btn--terracotta"
          href={whatsappUrl(buildRoomMessage(room.name))}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={17} strokeWidth={2} aria-hidden="true" />
          <span>{room.inquiryLabel}</span>
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
