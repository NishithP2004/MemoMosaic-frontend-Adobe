import React, { useState, useEffect } from "react";
import "@spectrum-web-components/button/sp-button.js";

export const Stage4 = ({ setStage, script }) => {
  const [sandboxApi, setSandboxApi] = useState(null);
  const [status, setStatus] = useState("");
  const [errorStatus, setErrorStatus] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        if (!window.addOnUISdk) {
          console.error("window.addOnUISdk not found.");
          setErrorStatus("CRITICAL: Adobe Add-on SDK not found.");
          return;
        }
        await window.addOnUISdk.ready;

        const { runtime } = window.addOnUISdk.instance;

        console.log("Runtime instance:", window.addOnUISdk.instance);
        console.log("Requesting documentSandbox proxy...");

        // Correct usage: apiProxy is a function that takes the runtime type
        // Use "documentSandbox" as the runtime type
        const sandboxProxy = await runtime.apiProxy("documentSandbox");

        if (sandboxProxy) {
          setSandboxApi(sandboxProxy);
          setStatus("Connected to Document Sandbox.");
        } else {
          console.error("Sandbox API proxy returned null");
          setErrorStatus("Sandbox API not found. Please reload.");
        }

      } catch (e) {
        console.error("Error getting sandbox API", e);
        setErrorStatus("Error connecting to document: " + e.message);
      }
    }
    init();
  }, []);

  const handleAddPages = async () => {
    setStatus("Adding pages...");
    setErrorStatus("");

    if (!sandboxApi) {
      setErrorStatus("Sandbox API not ready. Please try refreshing.");
      return;
    }
    if (!script?.scenes?.length) {
      setErrorStatus("No scenes to add. Please generate a story first.");
      return;
    }

    const callCreatePage = (c, n, m, t) => {
      if (typeof sandboxApi.invoke === "function") {
        return sandboxApi.invoke("createPage", c, n, m, t);
      }
      if (typeof sandboxApi.createPage === "function") {
        return sandboxApi.createPage(c, n, m, t);
      }
      return Promise.reject(new Error("createPage not available"));
    };

    try {
      for (let i = 0; i < script.scenes.length; i++) {
        try {
          if (sandboxApi.addPage) await sandboxApi.addPage({ width: 400, height: 600 });
        } catch (_) {}
        const scene = script.scenes[i];
        const collage = scene.collage != null ? String(scene.collage) : "";
        const narrative = scene.narrative != null ? String(scene.narrative) : "";
        const mimeType = scene.mimeType || "image/png";
        const sceneType = scene.type || "IMAGE";
        await callCreatePage(collage, narrative, mimeType, sceneType);
      }
      setStatus("Pages added successfully!");
    } catch (e) {
      console.error("Error adding pages:", e);
      const msg = e?.message || String(e);
      setErrorStatus(
        msg.includes("not available") || msg.includes("not a function")
          ? "Document sandbox didn't expose createPage. Rebuild the add-on (npm run build) and reload the document."
          : "Error adding pages: " + msg
      );
      setStatus("");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: 800 }}>
      {status && <div style={{ color: "#4caf50", padding: "10px", background: "rgba(76, 175, 80, 0.1)", borderRadius: "8px" }}>{status}</div>}
      {errorStatus && <div style={{ color: "#f44336", padding: "10px", background: "rgba(244, 67, 54, 0.1)", borderRadius: "8px" }}>{errorStatus}</div>}

      {script ? (
        script.scenes.map((scene, idx) => {
          const collage = scene.collage || "";
          const collageSrc = collage.startsWith("http")
            ? collage
            : `data:${scene.mimeType};base64,${collage}`;
          return (
            <div key={idx} style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, background: "#fafafa" }}>
              {scene.type === "IMAGE" ? (
                <img
                  src={collageSrc}
                  alt={`Collage ${scene.scene}`}
                  style={{ width: "100%", maxWidth: 200, borderRadius: 8 }}
                />
              ) : (
                <video
                  src={collageSrc}
                  controls
                  style={{ width: "100%", maxWidth: 200, borderRadius: 8 }}
                />
              )}
              <div style={{ marginTop: 12, color: "#333", lineHeight: "1.5" }}>{scene.narrative}</div>
            </div>
          );
        })
      ) : (
        <div style={{ color: "#ff8080" }}>Oops! Something went wrong. Please try again.</div>
      )}
      {script && (
        <button
          onClick={handleAddPages}
          disabled={!sandboxApi}
          style={{
            background: sandboxApi ? "linear-gradient(90deg, #667eea 0%, #764ba2 100%)" : "rgba(255, 255, 255, 0.1)",
            border: "none",
            borderRadius: "12px",
            padding: "16px 32px",
            color: sandboxApi ? "white" : "rgba(255, 255, 255, 0.3)",
            fontWeight: "600",
            fontSize: "16px",
            cursor: sandboxApi ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
            boxShadow: sandboxApi ? "0 4px 15px rgba(118, 75, 162, 0.4)" : "none",
            width: "100%",
            marginTop: "16px"
          }}
          onMouseEnter={(e) => sandboxApi && (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          {sandboxApi ? "Add Pages to Document" : "Connecting to Document..."}
        </button>
      )}

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={() => setStage(0)}
          style={{
            flex: 1,
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "12px",
            color: "#e0e0e0",
            fontSize: "14px",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
        >
          Start Over
        </button>
        <button
          onClick={() => setStage(3)}
          style={{
            flex: 1,
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "12px",
            color: "#e0e0e0",
            fontSize: "14px",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
        >
          Regenerate
        </button>
      </div>
    </div>
  );
};