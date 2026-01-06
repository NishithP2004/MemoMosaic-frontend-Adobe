import React, { useState } from "react";
import "@spectrum-web-components/button/sp-button.js";
import "@spectrum-web-components/radio/sp-radio-group.js";
import "@spectrum-web-components/radio/sp-radio.js";

const BACKEND_HOST = process.env.BACKEND_HOST;

export const Stage0 = ({ setStage, payload, setPayload, annotations, setAnnotations }) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    setError("");
    try {
      // 1. Convert files to base64 and build asset objects
      let assets = await Promise.all(
        files.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
          // No EXIF/location extraction in this version
          return {
            buffer,
            mimeType: file.type,
            location: "",
            creation_time: new Date().toISOString(),
            type: file.type.startsWith("image")
              ? "IMAGE"
              : file.type.startsWith("video")
                ? "VIDEO"
                : "AUDIO",
          };
        })
      );
      setPayload((prev) => ({ ...prev, assets }));

      // 2. Extract faces from images (if any images)
      const imageAssets = assets.filter((a) => a.type === "IMAGE");
      let faces = [];
      if (imageAssets.length > 0) {
        const res = await fetch(`${BACKEND_HOST}/extractFaces`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images: imageAssets.map((a) => a.buffer) }),
        });
        const data = await res.json();
        faces = data.faces || [];
      }
      setAnnotations(faces.map((face) => ({ buffer: face, annotation: "" })));
      setLoading(false);
      setError("");
      if (faces.length > 0) setStage(5);
      else setStage(1);
    } catch (err) {
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
          color: "#2c2c2c",
          margin: "0 0 8px 0"
        }}>
          Upload Your Memories
        </h2>
        <p style={{
          fontSize: "16px",
          color: "#666",
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
            color: "#d32f2f",
            background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
            padding: "12px 16px",
            borderRadius: "6px",
            border: "1px solid #ffcdd2",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        <div style={{
          border: "2px dashed #e0e0e0",
          borderRadius: "12px",
          padding: "32px",
          textAlign: "center",
          background: "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
          transition: "all 0.2s ease",
          cursor: "pointer",
          position: "relative"
        }}>
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
            color: "#666",
            marginBottom: "16px"
          }}>
            📸
          </div>
          <div style={{
            fontSize: "18px",
            fontWeight: "500",
            color: "#2c2c2c",
            marginBottom: "8px"
          }}>
            {files.length === 0 ? "Click to upload files" : `${files.length} file(s) selected`}
          </div>
          <div style={{
            fontSize: "14px",
            color: "#888"
          }}>
            Supports images and videos (max 20MB total)
          </div>
        </div>

        {files.length > 0 && (
          <div style={{
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            borderRadius: "8px",
            padding: "16px"
          }}>
            <h4 style={{
              margin: "0 0 12px 0",
              fontSize: "16px",
              fontWeight: "500",
              color: "#2c2c2c"
            }}>
              Selected Files:
            </h4>
            {files.map((file, index) => (
              <div key={file.name} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                borderRadius: "6px",
                marginBottom: "8px",
                border: "1px solid #e0e0e0"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <span style={{
                    fontSize: "20px"
                  }}>
                    {file.type.startsWith("image") ? "🖼️" : "🎥"}
                  </span>
                  <span style={{
                    fontSize: "14px",
                    color: "#2c2c2c"
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
                >
                  Remove
                </sp-button>
              </div>
            ))}
          </div>
        )}

        <div style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          borderRadius: "8px",
          padding: "20px"
        }}>
          <h4 style={{
            margin: "0 0 16px 0",
            fontSize: "16px",
            fontWeight: "500",
            color: "#2c2c2c"
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
              padding: "12px 16px",
              background: payload.type === "album"
                ? "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)"
                : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
              borderRadius: "8px",
              border: payload.type === "album" ? "2px solid #2196f3" : "1px solid #e0e0e0",
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
                  marginRight: "12px",
                  transform: "scale(1.2)"
                }}
              />
              <span style={{ fontSize: "20px", marginRight: "8px" }}>📚</span>
              <span style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#2c2c2c"
              }}>
                Album - Perfect for family memories and events
              </span>
            </label>

            <label style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              background: payload.type === "vlog"
                ? "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)"
                : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
              borderRadius: "8px",
              border: payload.type === "vlog" ? "2px solid #2196f3" : "1px solid #e0e0e0",
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
                  marginRight: "12px",
                  transform: "scale(1.2)"
                }}
              />
              <span style={{ fontSize: "20px", marginRight: "8px" }}>🎬</span>
              <span style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#2c2c2c"
              }}>
                Vlog - Great for travel and lifestyle content
              </span>
            </label>
          </div>
        </div>

        <div style={{
          display: "flex",
          gap: "12px",
          justifyContent: "center"
        }}>
          <sp-button
            type="submit"
            variant="primary"
            disabled={files.length === 0 || loading}
            style={{
              minWidth: "120px",
              background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
              border: "none",
              borderRadius: "6px",
              padding: "12px 24px",
              color: "white",
              fontWeight: "500",
              cursor: files.length === 0 || loading ? "not-allowed" : "pointer",
              opacity: files.length === 0 || loading ? 0.6 : 1
            }}
          >
            {loading ? "Processing..." : "Create Story"}
          </sp-button>
          <sp-button
            type="reset"
            variant="secondary"
            onClick={handleReset}
            style={{
              minWidth: "120px",
              background: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
              border: "1px solid #d0d0d0",
              borderRadius: "6px",
              padding: "12px 24px",
              color: "#666",
              fontWeight: "500",
              cursor: "pointer"
            }}
          >
            Reset
          </sp-button>
        </div>
      </form>
    </div>
  );
}; 