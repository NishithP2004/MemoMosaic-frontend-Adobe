import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import "@spectrum-web-components/styles/typography.css";
import "@spectrum-web-components/styles/theme-light.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const init = async () => {
    if (window.addOnUISdk) {
        await window.addOnUISdk.ready;
    }
    root.render(<App />);
};

init();
