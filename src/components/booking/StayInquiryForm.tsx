'use client';

import { CalendarDays, Check, ClipboardCopy, MessageCircle, Users } from 'lucide-react';
import { useRef, useState } from 'react';
import { demoRooms } from '@/data/rooms.demo';
import { rooms } from '@/data/rooms';
import { site } from '@/data/site';
import { trackEvent } from '@/lib/analytics';
import {
  addDays,
  formatLongWithWeekday,
  formatNights,
  formatShort,
  nightsBetween,
  todayIso,
  validateStay,
} from '@/lib/dates';
import { buildStayMessage, whatsappUrl } from '@/lib/whatsapp';
import styles from './StayInquiryForm.module.css';

interface FormValues {
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  name: string;
}

type FormErrors = Partial<Record<'checkIn' | 'checkOut' | 'guests' | 'name', string>>;

const availableRooms = site.showDemoContent ? demoRooms : rooms;

export interface StayInquiryFormProps {
  /** Título del bloque. */
  title?: string;
  /** Texto introductorio. */
  description?: string;
  /** Identificador de la sección (para el ancla). */
  id?: string;
}

/**
 * Formulario de consulta de disponibilidad.
 *
 * NO hay backend: el formulario arma un mensaje en español y abre WhatsApp
 * con ese texto ya escrito. El sitio no confirma reservas ni guarda datos
 * personales; la disponibilidad la responde el equipo de Don Roberto.
 */
export function StayInquiryForm({
  title = 'Consultar disponibilidad',
  description = 'Completá los datos y se abre WhatsApp con tu consulta ya escrita. El equipo te responde con las habitaciones disponibles y sus tarifas.',
  id = 'consulta',
}: StayInquiryFormProps) {
  const [values, setValues] = useState<FormValues>(() => ({
    checkIn: todayIso(),
    checkOut: addDays(todayIso(), 1),
    guests: 2,
    roomType: '',
    name: '',
  }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [prepared, setPrepared] = useState<{ url: string; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const setValue = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = validateStay({
      checkIn: values.checkIn,
      checkOut: values.checkOut,
      guests: values.guests,
      name: values.name,
    });

    if (!result.valid) {
      setErrors(result.errors);
      setPrepared(null);
      // Lleva el foco al resumen de errores para que un lector de pantalla
      // anuncie el problema de inmediato.
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    const message = buildStayMessage({
      name: values.name,
      checkIn: values.checkIn,
      checkOut: values.checkOut,
      guests: values.guests,
      roomType: values.roomType || null,
    });

    const url = whatsappUrl(message);
    setPrepared({ url, message });
    setCopied(false);

    trackEvent('consulta_habitacion_enviada', {
      noches: result.nights,
      huespedes: values.guests,
      tipo_habitacion: values.roomType || 'sin_preferencia',
    });

    window.open(url, '_blank', 'noopener,noreferrer');
    window.requestAnimationFrame(() => successRef.current?.focus());
  };

  const copyMessage = async () => {
    if (!prepared) return;
    try {
      await navigator.clipboard.writeText(prepared.message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3500);
    } catch {
      // El navegador no permite copiar: el mensaje sigue visible para
      // copiarlo a mano, así que no es un error bloqueante.
      setCopied(false);
    }
  };

  const nights = nightsBetween(values.checkIn, values.checkOut);
  const errorList = Object.entries(errors).filter(([, message]) => Boolean(message));

  return (
    <section className={`section ${styles.section}`} id={id} aria-labelledby={`${id}-title`}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.intro}>
            <h2 className={styles.title} id={`${id}-title`}>
              {title}
            </h2>
            <p className={styles.description}>{description}</p>

            <ul className={styles.steps}>
              <li>
                <span className={styles.stepNumber}>1</span> Contá tus fechas
              </li>
              <li>
                <span className={styles.stepNumber}>2</span> Revisá el mensaje
              </li>
              <li>
                <span className={styles.stepNumber}>3</span> Envialo por WhatsApp
              </li>
            </ul>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.row}>
              <div className="field">
                <label className="field__label" htmlFor={`${id}-checkin`}>
                  Fecha de entrada
                </label>
                <input
                  className="input"
                  id={`${id}-checkin`}
                  name="checkIn"
                  type="date"
                  value={values.checkIn}
                  min={todayIso()}
                  required
                  aria-invalid={errors.checkIn ? 'true' : undefined}
                  aria-describedby={errors.checkIn ? `${id}-checkin-error` : undefined}
                  onChange={(event) => setValue('checkIn', event.target.value)}
                />
                {errors.checkIn ? (
                  <p className="field__error" id={`${id}-checkin-error`}>
                    {errors.checkIn}
                  </p>
                ) : null}
              </div>

              <div className="field">
                <label className="field__label" htmlFor={`${id}-checkout`}>
                  Fecha de salida
                </label>
                <input
                  className="input"
                  id={`${id}-checkout`}
                  name="checkOut"
                  type="date"
                  value={values.checkOut}
                  min={values.checkIn || todayIso()}
                  required
                  aria-invalid={errors.checkOut ? 'true' : undefined}
                  aria-describedby={errors.checkOut ? `${id}-checkout-error` : undefined}
                  onChange={(event) => setValue('checkOut', event.target.value)}
                />
                {errors.checkOut ? (
                  <p className="field__error" id={`${id}-checkout-error`}>
                    {errors.checkOut}
                  </p>
                ) : null}
              </div>
            </div>

            <div className={styles.row}>
              <div className="field">
                <label className="field__label" htmlFor={`${id}-guests`}>
                  Número de huéspedes
                </label>
                <input
                  className="input"
                  id={`${id}-guests`}
                  name="guests"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={12}
                  step={1}
                  value={values.guests}
                  required
                  aria-invalid={errors.guests ? 'true' : undefined}
                  aria-describedby={
                    errors.guests ? `${id}-guests-error` : `${id}-guests-hint`
                  }
                  onChange={(event) => setValue('guests', Number(event.target.value))}
                />
                {errors.guests ? (
                  <p className="field__error" id={`${id}-guests-error`}>
                    {errors.guests}
                  </p>
                ) : (
                  <p className="field__hint" id={`${id}-guests-hint`}>
                    {nights > 0 ? `${formatNights(nights)} de estadía` : 'Huéspedes en total'}
                  </p>
                )}
              </div>

              <div className="field">
                <label className="field__label" htmlFor={`${id}-room`}>
                  Tipo de habitación
                </label>
                <select
                  className="select"
                  id={`${id}-room`}
                  name="roomType"
                  value={values.roomType}
                  onChange={(event) => setValue('roomType', event.target.value)}
                >
                  <option value="">Sin preferencia</option>
                  {availableRooms.map((room) => (
                    <option key={room.slug} value={room.name}>
                      {room.name}
                    </option>
                  ))}
                </select>
                <p className="field__hint" id={`${id}-room-hint`}>
                  {availableRooms.length > 0
                    ? 'Opcional. Si no lo indicás, te mostramos todas las opciones.'
                    : 'Estamos publicando los tipos de habitación. Si no indicás ninguno, te enviamos todas las opciones.'}
                </p>
              </div>
            </div>

            <div className="field">
              <label className="field__label" htmlFor={`${id}-name`}>
                Tu nombre <span className={styles.optional}>(opcional)</span>
              </label>
              <input
                className="input"
                id={`${id}-name`}
                name="name"
                type="text"
                autoComplete="name"
                maxLength={60}
                value={values.name}
                aria-invalid={errors.name ? 'true' : undefined}
                aria-describedby={errors.name ? `${id}-name-error` : `${id}-name-hint`}
                onChange={(event) => setValue('name', event.target.value)}
              />
              {errors.name ? (
                <p className="field__error" id={`${id}-name-error`}>
                  {errors.name}
                </p>
              ) : (
                <p className="field__hint" id={`${id}-name-hint`}>
                  Solo si querés que te escribamos a vos.
                </p>
              )}
            </div>

            {errorList.length > 0 ? (
              <div
                ref={errorSummaryRef}
                className={styles.errorSummary}
                role="alert"
                tabIndex={-1}
              >
                <p className={styles.errorSummaryTitle}>
                  Revisá estos datos antes de enviar la consulta:
                </p>
                <ul>
                  {errorList.map(([key, message]) => (
                    <li key={key}>{message}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <button className={`btn ${styles.submit}`} type="submit">
              <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
              <span>Preparar consulta en WhatsApp</span>
            </button>

            <p className={styles.disclaimer}>
              <CalendarDays size={14} strokeWidth={1.8} aria-hidden="true" />
              Este formulario no reserva ni cobra nada: prepara un mensaje de WhatsApp. La
              disponibilidad la confirma el equipo de Don Roberto.
            </p>
          </form>
        </div>

        {prepared ? (
          <div
            ref={successRef}
            className={styles.prepared}
            role="status"
            tabIndex={-1}
            aria-live="polite"
          >
            <p className={styles.preparedTitle}>
              <Check size={18} strokeWidth={2.4} aria-hidden="true" />
              Tu consulta está lista
            </p>
            <p className={styles.preparedText}>
              Se abrió WhatsApp en una pestaña nueva con el mensaje escrito. Si no se abrió, podés
              copiarlo y enviarlo desde tu chat.
            </p>
            <pre className={styles.message}>{prepared.message}</pre>
            <div className={styles.preparedActions}>
              <a
                className="btn btn--terracotta"
                href={prepared.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={17} strokeWidth={2} aria-hidden="true" />
                <span>Abrir WhatsApp</span>
              </a>
              <button className="btn btn--outline" type="button" onClick={copyMessage}>
                {copied ? (
                  <Check size={17} strokeWidth={2.2} aria-hidden="true" />
                ) : (
                  <ClipboardCopy size={17} strokeWidth={2} aria-hidden="true" />
                )}
                <span>{copied ? 'Mensaje copiado' : 'Copiar mensaje'}</span>
              </button>
            </div>
            <p className={styles.preparedMeta}>
              <Users size={14} strokeWidth={1.8} aria-hidden="true" />
              {formatLongWithWeekday(values.checkIn)} → {formatShort(values.checkOut)} ·{' '}
              {values.guests} {values.guests === 1 ? 'huésped' : 'huéspedes'}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
