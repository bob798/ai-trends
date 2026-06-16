"use client";

// Catches errors thrown in the root layout itself. Must render its own
// <html>/<body>. Kept minimal and dependency-free.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: "#0b0e14",
          color: "#e6e9ef",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          margin: 0,
          padding: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Something went wrong</h1>
          <p style={{ marginTop: 12, color: "#a1a1aa" }}>
            The app hit an unexpected error.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 24,
              background: "#fbbf24",
              color: "#000",
              fontWeight: 600,
              border: "none",
              borderRadius: 8,
              padding: "12px 20px",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
