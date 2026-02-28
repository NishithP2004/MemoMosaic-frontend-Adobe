import React, { useEffect, useState } from "react";
import "@spectrum-web-components/button/sp-button.js";
const BACKEND_HOST = process.env.BACKEND_HOST;

export const Stage3 = ({ setStage, payload, setPayload, script, setScript, playHTCred, annotations }) => {
  const [error, setError] = useState("");

  useEffect(() => {
    const generate = async () => {
      try {
        // Only send assets that have buffers; keep order so server indices match
        const assetsToSend = (payload.assets || []).filter((a) => a && a.buffer);
        if (assetsToSend.length === 0) {
          setError("No media to upload. Please add at least one image or video.");
          return;
        }

        const assetMetadata = assetsToSend.map((asset) => ({
          type: asset.type || "IMAGE",
          mimeType: asset.mimeType || "image/jpeg",
          location: asset.location || "",
          creation_time: asset.creation_time || new Date().toISOString()
        }));

        const annotationPayload = (annotations || []).map((a, index) => ({
          name: (a && a.annotation) || `Person ${index + 1}`,
          relation: "",
          faceIndex: index
        }));

        const payloadForServer = {
          type: payload.type || "album",
          memorableMoments: payload.memorableMoments || "",
          location: payload.location || "",
          assetMetadata,
          annotations: Array.isArray(annotationPayload) ? annotationPayload : [],
          playHTCred: playHTCred || null
        };

        const formData = new FormData();
        formData.append("payload", JSON.stringify(payloadForServer));

        const base64ToBlob = (base64, mimeType) => {
          const byteChars = atob(base64);
          const byteNumbers = new Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) {
            byteNumbers[i] = byteChars.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          return new Blob([byteArray], { type: mimeType });
        };

        // Append media assets in same order as assetMetadata
        assetsToSend.forEach((asset, index) => {
          const mimeType = asset.mimeType || "application/octet-stream";
          const blob = base64ToBlob(asset.buffer, mimeType);
          formData.append("assets", blob, `asset-${index}`);
        });

        // Append extracted face images for annotations in the "annotationFaces" field
        (annotations || []).forEach((a, index) => {
          if (!a.buffer) return;
          const blob = base64ToBlob(a.buffer, "image/jpeg");
          formData.append("annotationFaces", blob, `face-${index}.jpg`);
        });

        const res = await fetch(`${BACKEND_HOST}/create`, {
          method: "POST",
          body: formData
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