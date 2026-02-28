import React from "react";
import "@spectrum-web-components/button/sp-button.js";
import { StyledInput } from "./StyledInput";

export const Stage5 = ({ setStage, annotations, setAnnotations }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: 800 }}>
      {annotations.map((asset, index) => (
        <div key={index} style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          gap: "24px",
          alignItems: "center", // Align items to center vertically
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }}>
          <img
            src={`data:image/png;base64,${asset.buffer}`}
            alt={`Asset ${index + 1}`}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          />
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", width: "100%" }}>
              <span style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#e8eaed",
                marginBottom: "8px"
              }}>
                Annotation
              </span>
              <StyledInput
                placeholder="Enter annotation"
                value={asset.annotation || ""}
                onChange={e => {
                  setAnnotations(prev => {
                    const newAnnotations = [...prev];
                    newAnnotations[index] = {
                      ...newAnnotations[index],
                      annotation: e.target.value
                    };
                    return newAnnotations;
                  });
                }}
              />
            </label>
          </div>
        </div>
      ))}
      <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
        <button
          onClick={() => setStage(1)}
          style={{
            flex: 1,
            background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: "12px",
            padding: "14px 24px",
            color: "white",
            fontWeight: "600",
            fontSize: "16px",
            cursor: "pointer",
            transition: "transform 0.2s",
            boxShadow: "0 4px 15px rgba(118, 75, 162, 0.4)"
          }}
        >
          Next
        </button>
        <button
          onClick={() => setStage(0)}
          style={{
            flex: 1,
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "14px 24px",
            color: "#e0e0e0",
            fontWeight: "600",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
};
