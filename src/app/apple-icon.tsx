import { ImageResponse } from "next/og";

// Apple-toestellen kunnen geen SVG-favicon aan; dit genereert een PNG van
// hetzelfde beeldmerk als src/app/icon.svg tijdens de build.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0033A0",
          borderRadius: 40,
        }}
      >
        <svg width="132" height="132" viewBox="0 0 40 40">
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
          <path
            d="M31 5 l-4.5 0.6 M31 5 l-0.8 4.4"
            stroke="#ecb93f"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
