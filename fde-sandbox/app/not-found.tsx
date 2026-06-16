import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="mono text-xs uppercase tracking-widest text-amber-400/80">
        404
      </p>
      <h1 className="mt-4 text-3xl font-bold">This engagement doesn&apos;t exist</h1>
      <p className="mt-3 text-zinc-400">
        The page you&apos;re after isn&apos;t here. Maybe it shipped to the wrong
        environment.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/sandbox"
          className="rounded-lg bg-amber-400 px-5 py-3 font-semibold text-black transition hover:bg-amber-300"
        >
          Browse engagements →
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-zinc-700 px-5 py-3 font-semibold text-zinc-200 transition hover:border-zinc-500"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
