interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Inserta un bloque JSON-LD en el documento.
 * Se usa `JSON.stringify` con el escapado de `<` para evitar que un valor
 * pueda cerrar la etiqueta `<script>`.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
