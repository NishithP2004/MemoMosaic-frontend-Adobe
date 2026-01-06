import React from "react";
import "@spectrum-web-components/button/sp-button.js";
import "@spectrum-web-components/textfield/sp-textfield.js";

export const Stage2 = ({ setStage, payload, setPayload }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: 600 }}>
      <label>
        Memorable Moments
        <sp-textfield
          autoGrow
          min-rows="3"
          max-rows="5"
          placeholder="Remembering our first family trip to the mountains..."
          id="memorable-moments"
          maxlength="250"
          value={payload.memorableMoments}
          onInput={e => setPayload(prev => ({ ...prev, memorableMoments: e.target.value }))}
        ></sp-textfield>
        <div style={{ fontSize: 12, color: '#888' }}>Please share any additional memories you would like to include in the narration.</div>
      </label>
      <sp-button onClick={() => setStage(3)} variant="primary">Submit</sp-button>
      <sp-button onClick={() => setStage(1)} variant="secondary">Back</sp-button>
    </div>
  );
}; 