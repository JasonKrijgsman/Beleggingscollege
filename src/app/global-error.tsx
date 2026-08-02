"use client";

/**
 * Vangnet voor als de fout in de layout zelf zit — dan rendert error.tsx niet
 * en moet deze pagina zijn eigen <html> en <body> meebrengen. Bewust simpel
 * en zonder afhankelijkheden: hoe minder hier kan breken, hoe beter.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="nl">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f6f8",
          color: "#53565A",
          margin: 0,
          padding: 24,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <h1 style={{ color: "#1a1c1e", fontSize: 28, marginBottom: 12 }}>
            Er ging iets mis aan onze kant
          </h1>
          <p style={{ lineHeight: 1.6, marginBottom: 8 }}>
            Niet aan jou. Probeer het zo nog eens — meestal is het snel
            voorbij. Je voortgang en aankopen zijn veilig.
          </p>
          <p style={{ fontSize: 14, marginBottom: 24 }}>
            Blijft dit gebeuren? Mail beheer@beleggingscollege.nl
            {error.digest ? ` (code ${error.digest})` : ""}.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#0072CE",
              color: "#fff",
              border: 0,
              borderRadius: 999,
              padding: "12px 28px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Probeer opnieuw
          </button>
        </div>
      </body>
    </html>
  );
}
