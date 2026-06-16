"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to the console / monitoring; swap for a real reporter at launch.
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="mono text-xs uppercase tracking-widest text-rose-400/80">
        something broke
      </p>
      <h1 className="mt-4 text-3xl font-bold">That didn&apos;t survive production</h1>
      <p className="mt-3 text-zinc-400">
        Fitting, given the subject matter. Something on this page threw an error.
        Try again — your saved progress is untouched.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-amber-400 px-5 py-3 font-semibold text-black transition hover:bg-amber-300"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-zinc-700 px-5 py-3 font-semibold text-zinc-200 transition hover:border-zinc-500"
        >
          Home
        </Link>
      </div>
      {error.digest && (
        <p className="mono mt-6 text-xs text-zinc-700">ref: {error.digest}</p>
      )}
    </main>
  );
}
