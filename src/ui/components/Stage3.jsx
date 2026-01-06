import React, { useEffect, useState } from "react";
import "@spectrum-web-components/button/sp-button.js";
const BACKEND_HOST = process.env.BACKEND_HOST;

export const Stage3 = ({ setStage, payload, setPayload, script, setScript, playHTCred, annotations }) => {
  const [error, setError] = useState("");

  useEffect(() => {
    const generate = async () => {
      try {
        // Prepare payload
        const body = {
          ...payload,
          annotations: annotations || [],
          playHTCred
        };

        const res = await fetch(`${BACKEND_HOST}/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();

        if (data.success === false) {
          throw new Error(data.error || "Unknown error from server");
        }

        setScript(data);
        setStage(4);
      } catch (e) {
        console.error(e);
        setError(e.message || "Failed to generate story. Please try again.");
      }
    };
    generate();
  }, []);

  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: 20 }}>
        <div style={{ color: "red", textAlign: "center" }}>{error}</div>
        <sp-button onClick={() => setStage(0)} variant="secondary">Start Over</sp-button>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 24 }}>
      <div>Generating {payload.type}...</div>
      <div style={{ width: 200, height: 8, background: "#eee", borderRadius: 4, margin: "16px 0", overflow: "hidden" }}>
        <div style={{ width: "100%", height: "100%", background: "#2680eb", borderRadius: 4, animation: "progress 2s infinite" }}></div>
      </div>
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};