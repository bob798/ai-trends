import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "FDE Sandbox — Practice the last mile",
  description:
    "Become a Forward Deployed Engineer by shipping, not watching. Practice the messiest real moment: dirty data, a vague ask, and production that has to not break.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
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
              <Link href="/market" className="transition hover:text-zinc-100">
                Market
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
