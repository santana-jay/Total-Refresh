// =============================================================================
// FRONTEND ENTRY POINT (client/src/main.tsx)
// =============================================================================
// Mounts the React app into the #root div in index.html.
// Imports global CSS (Tailwind + custom styles).
// =============================================================================

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
