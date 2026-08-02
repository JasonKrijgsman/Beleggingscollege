import { ImageResponse } from "next/og";

// De kaart die WhatsApp, LinkedIn en X tonen als iemand een link deelt.
// Tot dit bestand bestond was dat een leeg grijs vlak — en dat gedeelde
// linkje is voor veel mensen letterlijk de eerste indruk van de site.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Beleggingscollege — stap veilig in de wereld van beleggen";

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
          padding: 72,
          background: "linear-gradient(135deg, #0a1e5c 0%, #0033A0 55%, #0072CE 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              background: "#0033A0",
              border: "3px solid rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="64" height="64" viewBox="0 0 40 40">
              <rect x="8" y="22" width="5" height="10" rx="1.5" fill="#7fb7ee" />
              <rect x="16" y="17" width="5" height="15" rx="1.5" fill="#b9d9f7" />
              <rect x="24" y="12" width="5" height="20" rx="1.5" fill="#ffffff" />
              <path
                d="M9 15 L20 9 L31 5"
                stroke="#ecb93f"
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 54, fontWeight: 700 }}>
            <span>Beleggings</span>
            <span style={{ color: "#7fb7ee" }}>college</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1 }}>
            Stap veilig in de wereld van beleggen
          </div>
          <div style={{ fontSize: 32, color: "rgba(255,255,255,0.85)" }}>
            Eerlijk beleggingsonderwijs, geworteld in de beste boeken ooit
            geschreven over de beurs.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          <div>Gratis beginnerscursus · quizzen · certificaten</div>
          <div style={{ fontWeight: 700 }}>beleggingscollege.nl</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
