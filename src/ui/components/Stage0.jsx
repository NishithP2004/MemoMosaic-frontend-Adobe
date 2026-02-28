import React, { useState } from "react";
import "@spectrum-web-components/button/sp-button.js";
import "@spectrum-web-components/radio/sp-radio-group.js";
import "@spectrum-web-components/radio/sp-radio.js";
import exifr from 'exifr'
import { extractFacesFromImages } from "../faceExtraction";

const getReverseGeocode = async (lat, lon) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`, {
      headers: {
        'User-Agent': 'MemoMosaic/1.0'
      }
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.address.city || data.address.town || data.address.village || data.address.state || "";
  } catch (error) {
    console.error("Error fetching location name:", error);
    return null;
  }
};

export const Stage0 = ({ setStage, payload, setPayload, annotations, setAnnotations }) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    setError("");
    try {
      // 1. Convert files to base64 and build asset objects (with Exif extraction)
      let assets = [];

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

        let location = payload.location || "";

        if (file.type.startsWith("image")) {
          try {
            let gps = await exifr.gps(file);
            if (gps && gps.latitude && gps.longitude) {
              // Add delay to respect Nominatim API rate limit (1 request/sec)
              await new Promise(r => setTimeout(r, 1200));
              const extractedLocation = await getReverseGeocode(gps.latitude, gps.longitude);
              if (extractedLocation) {
                location = extractedLocation;
              }
            }
          } catch (err) {
            console.warn("Could not extract Exif data", err);
          }
        }

        assets.push({
          buffer,
          mimeType: file.type,
          location: location,
          creation_time: new Date().toISOString(), // exifr can also extract this, but keeping simple for now
          type: file.type.startsWith("image")
            ? "IMAGE"
            : file.type.startsWith("video")
              ? "VIDEO"
              : "AUDIO",
        });
      }

      // Update payload with new assets
      // (Note: we are not updating state inside loop to avoid race conditions, we do it here)
      // We also make sure the global payload type is preserved.

      const newPayload = { ...payload, assets };
      setPayload(newPayload);

      // 2. Extract faces from images (client-side ML)
      const imageAssets = assets.filter((a) => a.type === "IMAGE");
      let faces = [];
      if (imageAssets.length > 0) {
        faces = await extractFacesFromImages(
          imageAssets.map((a) => a.buffer),
          imageAssets.map((a) => a.mimeType)
        );
      }
      setAnnotations(faces.map((face) => ({ buffer: face, annotation: "" })));
      setLoading(false);
      setError("");
      if (faces.length > 0) setStage(5);
      else setStage(1);
    } catch (err) {
      console.error(err);
      setError("Oops! Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleReset = (ev) => {
    ev.preventDefault();
    setFiles([]);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{
        textAlign: "center",
        marginBottom: "32px"
      }}>
        <h2 style={{
          fontSize: "24px",
          fontWeight: "600",
          color: "#fff",
          margin: "0 0 8px 0"
        }}>
          Upload Your Memories
        </h2>
        <p style={{
          fontSize: "16px",
          color: "#a0a0a0",
          margin: "0"
        }}>
          Select your photos and videos to create a beautiful story
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}>
        {error && (
          <div style={{
            color: "#ff8080",
            background: "rgba(255, 0, 0, 0.1)",
            padding: "12px 16px",
            borderRadius: "12px",
            border: "1px solid rgba(255, 0, 0, 0.2)",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        <div style={{
          border: "2px dashed rgba(255, 255, 255, 0.2)",
          borderRadius: "16px",
          padding: "40px",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.05)",
          transition: "all 0.3s ease",
          cursor: "pointer",
          position: "relative"
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(161, 140, 209, 0.5)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
          }}
        >
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={e => setFiles(Array.from(e.target.files))}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer"
            }}
          />
          <div style={{
            fontSize: "48px",
            marginBottom: "16px",
            filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))"
          }}>
            📸
          </div>
          <div style={{
            fontSize: "18px",
            fontWeight: "500",
            color: "#fff",
            marginBottom: "8px"
          }}>
            {files.length === 0 ? "Click to upload files" : `${files.length} file(s) selected`}
          </div>
          <div style={{
            fontSize: "14px",
            color: "#a0a0a0"
          }}>
            Supports images and videos (max 20MB total)
          </div>
        </div>



        {files.length > 0 && (
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "16px",
            padding: "16px",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <h4 style={{
              margin: "0 0 12px 0",
              fontSize: "16px",
              fontWeight: "500",
              color: "#e0e0e0"
            }}>
              Selected Files:
            </h4>
            {files.map((file, index) => (
              <div key={file.name} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                background: "rgba(0, 0, 0, 0.2)",
                borderRadius: "8px",
                marginBottom: "8px",
                border: "1px solid rgba(255, 255, 255, 0.05)"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <span style={{ fontSize: "20px" }}>
                    {file.type.startsWith("image") ? "🖼️" : "🎥"}
                  </span>
                  <span style={{
                    fontSize: "14px",
                    color: "#e0e0e0"
                  }}>
                    {file.name}
                  </span>
                  <span style={{
                    fontSize: "12px",
                    color: "#888"
                  }}>
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <sp-button
                  variant="secondary"
                  size="s"
                  onClick={() => setFiles(prev => prev.filter(f => f.name !== file.name))}
                  style={{
                    '--spectrum-global-color-gray-50': 'rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                >
                  Remove
                </sp-button>
              </div>
            ))}
          </div>
        )}

        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          <h4 style={{
            margin: "0 0 16px 0",
            fontSize: "16px",
            fontWeight: "500",
            color: "#e0e0e0"
          }}>
            Story Type
          </h4>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}>
            <label style={{
              display: "flex",
              alignItems: "center",
              padding: "16px",
              background: payload.type === "album"
                ? "linear-gradient(90deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)"
                : "rgba(255, 255, 255, 0.02)",
              borderRadius: "12px",
              border: payload.type === "album" ? "1px solid #764ba2" : "1px solid rgba(255, 255, 255, 0.1)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}>
              <input
                type="radio"
                name="storyType"
                value="album"
                checked={payload.type === "album"}
                onChange={e => setPayload(prev => ({ ...prev, type: e.target.value }))}
                style={{
                  marginRight: "16px",
                  accentColor: "#764ba2",
                  transform: "scale(1.2)"
                }}
              />
              <span style={{ fontSize: "24px", marginRight: "12px" }}>📚</span>
              <span style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#e0e0e0"
              }}>
                Album - Perfect for family memories and events
              </span>
            </label>

            <label style={{
              display: "flex",
              alignItems: "center",
              padding: "16px",
              background: payload.type === "vlog"
                ? "linear-gradient(90deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)"
                : "rgba(255, 255, 255, 0.02)",
              borderRadius: "12px",
              border: payload.type === "vlog" ? "1px solid #764ba2" : "1px solid rgba(255, 255, 255, 0.1)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}>
              <input
                type="radio"
                name="storyType"
                value="vlog"
                checked={payload.type === "vlog"}
                onChange={e => setPayload(prev => ({ ...prev, type: e.target.value }))}
                style={{
                  marginRight: "16px",
                  accentColor: "#764ba2",
                  transform: "scale(1.2)"
                }}
              />
              <span style={{ fontSize: "24px", marginRight: "12px" }}>🎬</span>
              <span style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#e0e0e0"
              }}>
                Vlog - Great for travel and lifestyle content
              </span>
            </label>
          </div>
        </div>

        <div style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          marginTop: "16px"
        }}>
          <button
            type="submit"
            disabled={files.length === 0 || loading}
            style={{
              minWidth: "140px",
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "12px",
              padding: "14px 28px",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
              cursor: files.length === 0 || loading ? "not-allowed" : "pointer",
              opacity: files.length === 0 || loading ? 0.5 : 1,
              transition: "transform 0.2s",
              boxShadow: "0 4px 15px rgba(118, 75, 162, 0.4)"
            }}
            onMouseEnter={(e) => !loading && files.length > 0 && (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            {loading ? "Processing..." : "Create Story"}
          </button>

          <button
            type="reset"
            onClick={handleReset}
            style={{
              minWidth: "140px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              padding: "14px 28px",
              color: "#e0e0e0",
              fontWeight: "600",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};
