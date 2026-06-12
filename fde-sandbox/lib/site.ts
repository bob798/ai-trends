// Single source of truth for the canonical site URL.
// Set NEXT_PUBLIC_SITE_URL in production (e.g. https://fdesandbox.dev).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://fde-sandbox.example.com";
