import React from "react";
import "@spectrum-web-components/button/sp-button.js";
import { StyledTextArea } from "./StyledTextArea";

export const Stage2 = ({ setStage, payload, setPayload }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: 600, margin: "0 auto" }}>
      <div style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        <label style={{ display: "block", marginBottom: "16px" }}>
          <span style={{
            display: "block",
            fontSize: "18px",
            fontWeight: "600",
            color: "#e8eaed",
            marginBottom: "12px"
          }}>
            Memorable Moments
          </span>
          <StyledTextArea
            placeholder="Remembering our first family trip to the mountains..."
            value={payload.memorableMoments}
            onChange={e => setPayload(prev => ({ ...prev, memorableMoments: e.target.value }))}
            rows={5}
          />
          <div style={{ fontSize: "14px", color: '#a0a0a0', marginTop: "8px" }}>
            Please share any additional memories you would like to include in the narration.
          </div>
        </label>
      </div>

      <div style={{ display: "flex", gap: "16px" }}>
        <button
          onClick={() => setStage(3)}
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
          Submit
        </button>
        <button
          onClick={() => setStage(1)}
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
