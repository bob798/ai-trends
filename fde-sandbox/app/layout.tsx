import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { JsonLd } from "./json-ld";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FDE Sandbox — Practice the last mile",
    template: "%s · FDE Sandbox",
  },
  description:
    "Become a Forward Deployed Engineer by shipping, not watching. Practice the messiest real moment: dirty data, a vague ask, and production that has to not break.",
  keywords: [
    "forward deployed engineer",
    "FDE",
    "FDE interview",
    "FDE salary",
    "AI engineer career",
    "RAG production",
  ],
  openGraph: {
    siteName: "FDE Sandbox",
    type: "website",
    title: "FDE Sandbox — Practice the last mile",
    description:
      "Simulated FDE engagements graded by an AI senior reviewer: dirty data, vague asks, legacy APIs, production incidents. Do the rep before the interview.",
  },
  twitter: {
    card: "summary",
    title: "FDE Sandbox — Practice the last mile",
    description:
      "Simulated FDE engagements graded on production-survivability, not demo polish.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                url: SITE_URL,
                name: "FDE Sandbox",
                description:
                  "Practice the Forward Deployed Engineer role through simulated, AI-graded engagements.",
              },
              {
                "@type": "Organization",
                "@id": `${SITE_URL}/#org`,
                name: "FDE Sandbox",
                url: SITE_URL,
              },
            ],
          }}
        />
        <header className="border-b border-zinc-800/70">
          <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link href="/" className="mono text-sm font-bold tracking-wide text-amber-400">
              FDE_SANDBOX
            </Link>
            <div className="flex gap-5 text-sm text-zinc-400">
              <Link href="/sandbox" className="transition hover:text-zinc-100">
                Engagements
              </Link>
              <Link href="/learn" className="transition hover:text-zinc-100">
                Playbook
              </Link>
              <Link href="/interview" className="transition hover:text-zinc-100">
                Interview
              </Link>
              <Link href="/market" className="transition hover:text-zinc-100">
                Market
              </Link>
              <Link href="/jobs" className="transition hover:text-zinc-100">
                Jobs
              </Link>
              <Link href="/portfolio" className="transition hover:text-zinc-100">
                Portfolio
              </Link>
            </div>
          </nav>
        </header>
        {children}
        <footer className="mx-auto max-w-4xl px-6 py-10 text-xs text-zinc-600">
          FDE Sandbox — others tell you what an FDE is. This makes you do the rep.
        </footer>
      </body>
    </html>
  );
}
