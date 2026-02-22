// =============================================================================
// STATIC FILE SERVER (server/static.ts)
// =============================================================================
// Used in production mode to serve the pre-built frontend files from dist/public.
// Also handles SPA fallback — any unmatched route serves index.html so that
// client-side routing (wouter) can handle it.
// =============================================================================

import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve static assets (JS, CSS, images, etc.)
  app.use(express.static(distPath));

  // SPA fallback — serve index.html for any route not matched by static files
  app.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
