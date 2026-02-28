import React, { useState } from "react";
import "@spectrum-web-components/button/sp-button.js";
import { LocationSearch } from "./LocationSearch";

export const Stage1 = ({ setStage, payload, setPayload, annotations }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: 800 }}>
      {payload.assets.map((asset, index) => (
        <div key={index} style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          gap: "24px",
          alignItems: "flex-start",
          flexWrap: "wrap", // Responsiveness fix
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          position: "relative",
          zIndex: payload.assets.length - index // Stacking context fix for dropdown
        }}>
          <div style={{ flexShrink: 0 }}>
            {asset.type === "IMAGE" ? (
              <img
                src={`data:${asset.mimeType};base64,${asset.buffer}`}
                alt={`Asset ${index + 1}`}
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.1)"
                }}
              />
            ) : (
              <video
                src={`data:${asset.mimeType};base64,${asset.buffer}`}
                controls
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.1)"
                }}
              />
            )}
          </div>

          <div style={{ flex: 1, minWidth: "250px" }}> {/* Added minWidth for responsiveness */}
            <h4 style={{ margin: "0 0 12px 0", color: "#e8eaed", fontSize: "16px", fontWeight: "600" }}>
              Location Details
            </h4>
            <LocationSearch
              initialValue={asset.location || ""}
              onLocationSelect={(loc) => {
                let temp = [...payload.assets];
                temp[index].location = loc;
                setPayload(prev => ({ ...prev, assets: temp }));
              }}
            />
          </div>
        </div>
      ))}
      <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
        <button
          onClick={() => setStage(2)}
          disabled={payload.assets.some(asset => !asset.location)}
          style={{
            flex: 1,
            background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: "12px",
            padding: "14px 24px",
            color: "white",
            fontWeight: "600",
            fontSize: "16px",
            cursor: payload.assets.some(asset => !asset.location) ? "not-allowed" : "pointer",
            opacity: payload.assets.some(asset => !asset.location) ? 0.5 : 1,
            transition: "transform 0.2s",
            boxShadow: "0 4px 15px rgba(118, 75, 162, 0.4)"
          }}
        >
          Next
        </button>
        <button
          onClick={() => {
            if (annotations.length > 0) {
              setStage(5);
            } else {
              setStage(0);
            }
          }}
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
