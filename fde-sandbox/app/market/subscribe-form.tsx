"use client";

import { useState } from "react";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Subscription failed");
      setState("done");
      setMessage("You're on the list. First brief lands next month.");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (state === "done") {
    return <p className="mt-4 text-sm font-semibold text-emerald-400">✓ {message}</p>;
  }

  return (
    <form onSubmit={submit} className="mt-4 flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="mono w-full rounded-lg border border-zinc-700 bg-[#0d1119] px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-amber-400/50"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="shrink-0 rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-300 disabled:opacity-50"
      >
        {state === "loading" ? "…" : "Subscribe"}
      </button>
      {state === "error" && (
        <p className="text-sm text-rose-400 sm:self-center">{message}</p>
      )}
    </form>
  );
}
