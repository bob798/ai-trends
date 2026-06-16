import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "FDE Sandbox — practice the last mile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0e14",
          padding: "72px 80px",
          color: "#e6e9ef",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#fbbf24",
          }}
        >
          FDE Sandbox
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>
            Become a Forward
          </div>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>
            Deployed Engineer by
          </div>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>
            <span style={{ color: "#71717a" }}>shipping,&nbsp;</span>
            <span style={{ color: "#fbbf24" }}>not watching.</span>
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#a1a1aa", maxWidth: 900 }}>
            Simulated FDE engagements graded on whether they survive production —
            not whether the demo runs.
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {["Discovery", "Dirty-data RAG", "Legacy API", "Incident", "Security review"].map(
            (t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  fontSize: 22,
                  color: "#d4d4d8",
                  border: "1px solid #27272a",
                  borderRadius: 10,
                  padding: "8px 16px",
                }}
              >
                {t}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
