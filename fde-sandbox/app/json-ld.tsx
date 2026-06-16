// Renders a JSON-LD <script>. Server-safe; used for SEO structured data.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe inside a script tag; no user input here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
