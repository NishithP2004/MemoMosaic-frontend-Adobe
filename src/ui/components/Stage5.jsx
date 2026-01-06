import React from "react";
import "@spectrum-web-components/button/sp-button.js";
import "@spectrum-web-components/textfield/sp-textfield.js";

export const Stage5 = ({ setStage, annotations, setAnnotations }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: 800 }}>
      {annotations.map((asset, index) => (
        <div key={index} style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, background: "#fafafa" }}>
          <img
            src={`data:image/png;base64,${asset.buffer}`}
            alt={`Asset ${index + 1}`}
            style={{ width: 200, borderRadius: 8 }}
          />
          <div style={{ marginTop: 12 }}>
            <label>
              Annotation
              <sp-textfield
                placeholder="Enter annotation"
                value={asset.annotation || ""}
                onInput={e => {
                  setAnnotations(prev => {
                    const newAnnotations = [...prev];
                    newAnnotations[index] = {
                      ...newAnnotations[index],
                      annotation: e.target.value
                    };
                    return newAnnotations;
                  });
                }}
              ></sp-textfield>
            </label>
          </div>
        </div>
      ))}
      <sp-button onClick={() => setStage(1)} variant="primary">Next</sp-button>
      <sp-button onClick={() => setStage(0)} variant="secondary">Back</sp-button>
    </div>
  );
}; 