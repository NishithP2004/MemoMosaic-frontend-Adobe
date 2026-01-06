import React, { useState } from "react";
import "@spectrum-web-components/button/sp-button.js";
import "@spectrum-web-components/textfield/sp-textfield.js";

export const Stage1 = ({ setStage, payload, setPayload, annotations }) => {
  const [options, setOptions] = useState([{ label: "", value: "" }]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: 800 }}>
      {payload.assets.map((asset, index) => (
        <div key={index} style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, background: "#fafafa" }}>
          {asset.type === "IMAGE" ? (
            <img
              src={`data:${asset.mimeType};base64,${asset.buffer}`}
              alt={`Asset ${index + 1}`}
              style={{ width: 200, borderRadius: 8 }}
            />
          ) : (
            <video
              src={`data:${asset.mimeType};base64,${asset.buffer}`}
              controls
              style={{ width: 200, borderRadius: 8 }}
            />
          )}
          <div style={{ marginTop: 12 }}>
            <label>
              Location
              <sp-textfield
                placeholder="Enter location"
                value={asset.location}
                onInput={e => {
                  let temp = [...payload.assets];
                  temp[index].location = e.target.value;
                  setPayload(prev => ({ ...prev, assets: temp }));
                }}
              ></sp-textfield>
            </label>
          </div>
        </div>
      ))}
      <sp-button
        onClick={() => setStage(2)}
        variant="primary"
        disabled={payload.assets.some(asset => !asset.location)}
      >
        Next
      </sp-button>
      <sp-button
        onClick={() => {
          if (annotations.length > 0) {
            setStage(5);
          } else {
            setStage(0);
          }
        }}
        variant="secondary"
      >
        Back
      </sp-button>
    </div>
  );
};