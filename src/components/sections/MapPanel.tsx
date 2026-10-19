import { MapPin, Navigation } from 'lucide-react';
import { address } from '@/data/business';
import { Button } from '@/components/ui/Button';
import styles from './MapPanel.module.css';

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  address.mapsSearchQuery,
)}`;

/**
 * Panel de ubicación.
 *
 * El fondo es un esquema vectorial del entorno (calles y manzanas en tonos de
 * marca), NO una captura de Google Maps: es una ilustración propia que no
 * inventa la topografía real. El botón abre Google Maps con la dirección
 * verificada.
 */
export function MapPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.canvas} aria-hidden="true">
        <svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice" role="presentation">
          <rect width="600" height="420" fill="#EFE8DA" />
          {/* manzanas */}
          <g fill="#E4DCCB">
            <rect x="40" y="40" width="150" height="110" rx="6" />
            <rect x="230" y="30" width="130" height="90" rx="6" />
            <rect x="400" y="60" width="160" height="120" rx="6" />
            <rect x="30" y="200" width="180" height="90" rx="6" />
            <rect x="250" y="170" width="120" height="70" rx="6" />
            <rect x="410" y="230" width="160" height="100" rx="6" />
            <rect x="60" y="330" width="150" height="60" rx="6" />
            <rect x="250" y="290" width="120" height="90" rx="6" />
            <rect x="420" y="370" width="150" height="40" rx="6" />
          </g>
          {/* calles */}
          <g stroke="#F7F3EA" strokeWidth="16" strokeLinecap="round">
            <path d="M0 175h600" />
            <path d="M0 320h600" />
            <path d="M215 0v420" />
            <path d="M390 0v420" />
          </g>
          <g stroke="#D8CFBC" strokeWidth="2" strokeDasharray="8 10">
            <path d="M0 175h600" />
            <path d="M0 320h600" />
            <path d="M215 0v420" />
            <path d="M390 0v420" />
          </g>
          {/* parque */}
          <g>
            <rect x="420" y="60" width="160" height="120" rx="10" fill="#DDE5DC" />
            <circle cx="462" cy="98" r="11" fill="#B9CBB8" />
            <circle cx="510" cy="140" r="9" fill="#B9CBB8" />
            <circle cx="552" cy="96" r="7" fill="#B9CBB8" />
          </g>
          {/* ruta al punto */}
          <path
            d="M110 420 C 150 350, 175 300, 205 250 S 250 190, 268 150"
            fill="none"
            stroke="#B96F50"
            strokeWidth="4"
            strokeDasharray="1 9"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className={styles.pin} aria-hidden="true">
        <span className={styles.pinBubble}>
          <MapPin size={18} strokeWidth={2} />
        </span>
      </div>

      <div className={styles.caption}>
        <p className={styles.captionTitle}>San Isidro de El General, Pérez Zeledón</p>
        <p className={styles.captionText}>
          {address.landmark}. A unos pasos del centro y con parqueo en el local.
        </p>
        <Button
          href={mapsUrl}
          external
          variant="light"
          icon={<Navigation size={16} strokeWidth={2} aria-hidden="true" />}
        >
          Cómo llegar
        </Button>
      </div>
    </div>
  );
}
