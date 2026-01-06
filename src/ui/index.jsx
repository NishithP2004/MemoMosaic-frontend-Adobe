import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import "@spectrum-web-components/styles/typography.css";
import "@spectrum-web-components/styles/theme-light.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<App />);
