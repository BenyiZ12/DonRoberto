import Link from 'next/link';
import { ArrowLeft, Home, MessageCircle } from 'lucide-react';
import { business, contact } from '@/data/business';
import { Button } from '@/components/ui/Button';
import { whatsappUrl } from '@/lib/whatsapp';
import styles from './not-found.module.css';

export const metadata = {
  title: 'Página no encontrada',
  description: 'La página que buscás no existe o cambió de dirección.',
};

export default function NotFound() {
  return (
    <section className={styles.wrapper}>
      <div className={`container ${styles.inner}`}>
        <p className="eyebrow">Error 404</p>
        <h1 className={styles.title}>Esta página no está</h1>
        <p className={styles.text}>
          Puede que el enlace esté incompleto o que la página haya cambiado. Desde acá podés
          volver al inicio o escribirnos directo: {business.fullName}, {contact.phoneDisplay}.
        </p>

        <div className={styles.actions}>
          <Button
            href="/"
            icon={<Home size={17} strokeWidth={2} aria-hidden="true" />}
          >
            Volver al inicio
          </Button>
          <Button
            href="/habitaciones"
            variant="outline"
            icon={<ArrowLeft size={17} strokeWidth={2} aria-hidden="true" />}
          >
            Ver habitaciones
          </Button>
          <Button
            href={whatsappUrl('Hola, Don Roberto. Llegué a una página que no existe, ¿me pueden ayudar?')}
            external
            variant="terracotta"
            icon={<MessageCircle size={17} strokeWidth={2} aria-hidden="true" />}
          >
            Escribir por WhatsApp
          </Button>
        </div>

        <nav className={styles.links} aria-label="Páginas principales">
          <Link href="/habitaciones">Habitaciones</Link>
          <Link href="/cafeteria">Cafetería</Link>
          <Link href="/ubicacion">Ubicación</Link>
          <Link href="/contacto">Contacto</Link>
          <Link href="/preguntas-frecuentes">Preguntas frecuentes</Link>
        </nav>
      </div>
    </section>
  );
}
