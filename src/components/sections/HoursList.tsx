import type { OpeningHours } from '@/data/business';
import styles from './HoursList.module.css';

export interface HoursListProps {
  hours: OpeningHours;
  tone?: 'light' | 'dark';
  className?: string;
}

/** Lista de horarios con etiquetas accesibles. */
export function HoursList({ hours, tone = 'light', className }: HoursListProps) {
  return (
    <dl className={`${styles.list} ${className ?? ''}`} data-tone={tone}>
      {hours.days.map((day) => (
        <div key={day.label} className={styles.row}>
          <dt className={styles.label}>{day.label}</dt>
          <dd className={styles.value} data-pending={day.value ? 'false' : 'true'}>
            {day.value ?? 'Por confirmar'}
          </dd>
        </div>
      ))}
    </dl>
  );
}
