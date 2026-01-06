import React, { useState, useEffect } from "react";
import "@spectrum-web-components/button/sp-button.js";
import addOnSandboxSdk from "add-on-sdk-document-sandbox";

export const Stage4 = ({ setStage, script }) => {
  const [sandboxApi, setSandboxApi] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const { runtime } = addOnSandboxSdk.instance;
        // Assuming runtime.api gives access to the exposed sandbox API
        // If this is the UI context, runtime might be the UI runtime which has access to sandbox proxy.
        setSandboxApi(runtime.api);
      } catch (e) {
        console.error("Error getting sandbox API", e);
      }
    }
    init();
  }, []);

  const handleAddPages = async () => {
    if (!sandboxApi) {
      console.error("Sandbox API not ready");
      alert("Sandbox API not ready. Please try again or check console.");
      return;
    }
    try {
      for (const scene of script.scenes) {
        await sandboxApi.createPage(scene.collage, scene.narrative);
      }
      alert("Pages added successfully!");
    } catch (e) {
      console.error("Error adding pages:", e);
      alert("Error adding pages: " + e.message);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: 800 }}>
      {script ? (
        script.scenes.map((scene, idx) => (
          <div key={idx} style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, background: "#fafafa" }}>
            {scene.type === "IMAGE" ? (
              <img
                src={`data:${scene.mimeType};base64,${scene.collage}`}
                alt={`Collage ${scene.scene}`}
                style={{ width: 200, borderRadius: 8 }}
              />
            ) : (
              <video
                src={`data:${scene.mimeType};base64,${scene.collage}`}
                controls
                style={{ width: 200, borderRadius: 8 }}
              />
            )}
            <div style={{ marginTop: 12 }}>{scene.narrative}</div>
          </div>
        ))
      ) : (
        <div style={{ color: "red" }}>Oops! Something went wrong. Please try again.</div>
      )}
      {script && (
        <sp-button variant="primary" onClick={handleAddPages}>Add Pages to Document</sp-button>
      )}
      <sp-button onClick={() => setStage(0)} variant="secondary">Start Over</sp-button>
      <sp-button onClick={() => setStage(3)} variant="tertiary">Regenerate</sp-button>
    </div>
  );
};