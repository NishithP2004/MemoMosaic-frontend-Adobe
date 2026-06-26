import React, { useState, useEffect } from "react";
import "@spectrum-web-components/button/sp-button.js";

export const Stage4 = ({ setStage, script }) => {
  const [sandboxApi, setSandboxApi] = useState(null);
  const [status, setStatus] = useState("");
  const [errorStatus, setErrorStatus] = useState("");

  // Store runtime so we can get the document sandbox proxy on demand.
  // Proxy is fetched when user clicks "Add Pages" so the document context is active and code.js has run.
  const [runtime, setRuntime] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (!window.addOnUISdk) {
          console.error("window.addOnUISdk not found.");
          setErrorStatus("CRITICAL: Adobe Add-on SDK not found.");
          return;
        }
        await window.addOnUISdk.ready;
        const r = window.addOnUISdk.instance?.runtime;
        if (r) {
          setRuntime(r);
          setStatus("Ready. Open a document and click Add Pages to Document.");
        } else {
          setErrorStatus("SDK runtime not available.");
        }
      } catch (e) {
        console.error("Error initializing SDK", e);
        setErrorStatus("Error connecting: " + e.message);
      }
    };
    init();
  }, []);

  const handleAddPages = async () => {
    setStatus("Adding pages...");
    setErrorStatus("");

    if (!runtime) {
      setErrorStatus("SDK not ready. Please refresh the panel.");
      return;
    }
    if (!script?.scenes?.length) {
      setErrorStatus("No scenes to add. Please generate a story first.");
      return;
    }

    // Get document sandbox proxy on demand so it runs after a document is open and code.js has exposed its API.
    let api = sandboxApi;
    if (!api) {
      try {
        setStatus("Connecting to document...");
        api = await runtime.apiProxy("documentSandbox");
        setSandboxApi(api);
        setStatus("Connected. Adding pages...");
      } catch (e) {
        console.error("Error getting document sandbox proxy", e);
        setErrorStatus("Could not connect to document. Ensure a document is open in Express and try again.");
        setStatus("");
        return;
      }
    }

    const callCreatePage = async (imageInput, narrative, sceneType, pageSize, options) => {
      if (api.createPage != null) {
        try {
          return await api.createPage(imageInput, narrative, sceneType, pageSize, options);
        } catch (e) {
          if (e?.message?.includes?.("not a function")) {
            // fall through to invoke
          } else {
            throw e;
          }
        }
      }
      if (api.invoke != null) {
        return await api.invoke("createPage", imageInput, narrative, sceneType, pageSize, options);
      }
      console.error("[Memomosaic] Document sandbox API does not expose createPage/invoke.", api);
      throw new Error("createPage not available on document sandbox");
    };

    const imageInputFromCollage = async (collage, mimeType) => {
      if (!collage) return "";
      if (typeof Blob !== "undefined" && collage instanceof Blob) {
        return await blobToDataUrl(collage);
      }
      if (collage.startsWith("http://") || collage.startsWith("https://")) {
        return await loadRemoteImageAsDataUrl(collage);
      }
      if (collage.startsWith("data:")) {
        return collage;
      }
      return `data:${mimeType || "image/png"};base64,${collage}`;
    };

    const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error("Could not read generated image."));
      reader.readAsDataURL(blob);
    });

    const fetchImageBlob = async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Could not load generated image: ${response.status}`);
      }
      return await response.blob();
    };

    const proxiedAssetUrl = (url) => `/asset-proxy?url=${encodeURIComponent(url)}`;

    const shouldProxyAssetUrl = (url) => {
      try {
        return new URL(url).hostname === "tmpfiles.org";
      } catch (_) {
        return false;
      }
    };

    const loadRemoteImageAsDataUrl = async (url) => {
      if (shouldProxyAssetUrl(url)) {
        return await blobToDataUrl(await fetchImageBlob(proxiedAssetUrl(url)));
      }

      try {
        return await blobToDataUrl(await fetchImageBlob(url));
      } catch (directError) {
        console.warn("[Memomosaic] Direct asset load failed, trying local proxy.", directError);
        try {
          return await blobToDataUrl(await fetchImageBlob(proxiedAssetUrl(url)));
        } catch (proxyError) {
          console.error("[Memomosaic] Proxied asset load failed.", proxyError);
          throw directError;
        }
      }
    };

    try {
      let anyFailures = false;
      const pageSize = { width: 400, height: 600 };
      const firstScene = script.scenes[0] || {};
      const coverBackground = firstScene.backgroundImageDataUrl
        || firstScene.backgroundImageBase64
        || firstScene.background_image
        || firstScene.backgroundImage
        || firstScene.collageBase64
        || firstScene.collage
        || "";

      try {
        await callCreatePage("", "", "IMAGE", pageSize, {
          isCover: true,
          title: script.title || "MemoMosaic",
          subtitle: script.caption || "",
          backgroundInput: coverBackground
            ? await imageInputFromCollage(String(coverBackground), firstScene.backgroundMimeType || "image/jpeg")
            : ""
        });
      } catch (e) {
        anyFailures = true;
        console.error("[Memomosaic] Failed to add cover page.", e);
      }

      for (let i = 0; i < script.scenes.length; i++) {
        const scene = script.scenes[i];
        const collage = scene.collageDataUrl || scene.collageBase64 || scene.collage || "";
        const narrative = scene.narrative != null ? String(scene.narrative) : "";
        const sceneType = scene.type || "IMAGE";
        const background = scene.backgroundImageDataUrl
          || scene.backgroundImageBase64
          || scene.background_image
          || scene.backgroundImage
          || "";

        const imageInput = sceneType === "VIDEO"
          ? String(collage || "")
          : await imageInputFromCollage(String(collage), scene.mimeType);
        const backgroundInput = background
          ? await imageInputFromCollage(String(background), scene.backgroundMimeType || "image/jpeg")
          : "";

        try {
          await callCreatePage(imageInput, narrative, sceneType, pageSize, {
            backgroundInput,
            location: scene.location || "",
            audio: scene.audio || "",
            sceneNumber: scene.scene || String(i + 1)
          });
        } catch (e) {
          if (e?.message && e.message.includes("createPage not available")) {
            throw e;
          }
          anyFailures = true;
          console.error(
            `[Memomosaic] Failed to add scene ${i + 1} to document sandbox.`,
            scene,
            e
          );
        }
      }
      if (anyFailures) {
        setStatus("Some pages could not be added.");
        setErrorStatus(
          "One or more scenes failed to add. Check the console for details from the document sandbox."
        );
      } else {
        setStatus("Pages added successfully!");
      }
    } catch (e) {
      console.error("Error adding pages:", e);
      const msg = e?.message || String(e);
      setErrorStatus(
        msg.includes("not available") || msg.includes("not a function")
          ? "Document sandbox didn't expose createPage. Rebuild the add-on (npm run build) and reload the document in Adobe Express."
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
          const collage = String(scene.collageDataUrl || scene.collageBase64 || scene.collage || "");
          const collageSrc = collage.startsWith("http") || collage.startsWith("data:")
            ? collage
            : `data:${scene.mimeType || "image/png"};base64,${collage}`;
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
          disabled={!runtime}
          style={{
            background: runtime ? "linear-gradient(90deg, #667eea 0%, #764ba2 100%)" : "rgba(255, 255, 255, 0.1)",
            border: "none",
            borderRadius: "12px",
            padding: "16px 32px",
            color: runtime ? "white" : "rgba(255, 255, 255, 0.3)",
            fontWeight: "600",
            fontSize: "16px",
            cursor: runtime ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
            boxShadow: runtime ? "0 4px 15px rgba(118, 75, 162, 0.4)" : "none",
            width: "100%",
            marginTop: "16px"
          }}
          onMouseEnter={(e) => runtime && (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          Add Pages to Document
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
