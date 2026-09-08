import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/App";
// supplies the .atd-modern dock styling used by the navbar
import "@designcodeio/threeui/style.css";
import "@/index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
