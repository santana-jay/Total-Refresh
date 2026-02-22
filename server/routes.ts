// =============================================================================
// API ROUTES (server/routes.ts)
// =============================================================================
// All backend API endpoints are registered here.
//
// Route groups:
//   POST /api/admin/login           — authenticate admin user
//   POST /api/admin/change-password — change password (requires auth)
//   POST /api/admin/request-reset   — generate a password-reset token (logged to console)
//   POST /api/admin/reset-password  — reset password using a token
//   POST /api/appointments          — create a new appointment (public)
//   GET  /api/appointments          — list all appointments (auth required)
//   PUT  /api/appointments/:id      — update an appointment (auth required)
//   DELETE /api/appointments/:id    — delete an appointment (auth required)
// =============================================================================

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppointmentSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Number of salt rounds for bcrypt password hashing
const SALT_ROUNDS = 10;

// -----------------------------------------------------------------------------
// Seed the default admin account on first startup.
// The password comes from the ADMIN_DEFAULT_PASSWORD environment variable.
// If that variable is not set, no admin user is created automatically.
// -----------------------------------------------------------------------------
async function seedAdmin() {
  const existing = await storage.getAdminByUsername("admin");
  if (!existing) {
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD;
    if (!defaultPassword) {
      console.warn("No ADMIN_DEFAULT_PASSWORD set. Skipping admin seed.");
      return;
    }
    const hash = await bcrypt.hash(defaultPassword, SALT_ROUNDS);
    await storage.createAdmin("admin", hash);
    console.log("Default admin account created (username: admin).");
  }
}

// =============================================================================
// Register all API routes on the Express app
// =============================================================================
export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await seedAdmin();

  // ---------------------------------------------------------------------------
  // POST /api/admin/login
  // Accepts { username, password } and returns a bearer token on success.
  // The token is stored in memory on the server (app.__adminToken).
  // ---------------------------------------------------------------------------
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
      }
      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials." });
      }
      const valid = await bcrypt.compare(password, admin.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "Invalid credentials." });
      }
      // Generate a random token and store it in memory for session validation
      const token = crypto.randomBytes(32).toString("hex");
      (app as any).__adminToken = token;
      (app as any).__adminUsername = username;
      res.json({ token, username });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed." });
    }
  });

  // ---------------------------------------------------------------------------
  // Auth Middleware
  // Checks the Authorization header for the correct bearer token.
  // Used on all admin-only routes (appointments list, edit, delete, etc.).
  // ---------------------------------------------------------------------------
  function requireAuth(req: any, res: any, next: any) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "");
    if (!token || token !== (app as any).__adminToken) {
      return res.status(401).json({ message: "Unauthorized." });
    }
    next();
  }

  // ---------------------------------------------------------------------------
  // POST /api/admin/change-password
  // Requires the current password and a new password (min 8 chars).
  // ---------------------------------------------------------------------------
  app.post("/api/admin/change-password", requireAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new passwords are required." });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters." });
      }
      const username = (app as any).__adminUsername || "admin";
      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found." });
      }
      const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "Current password is incorrect." });
      }
      const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
      await storage.updateAdminPassword(admin.id, hash);
      res.json({ message: "Password updated successfully." });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ message: "Failed to change password." });
    }
  });

  // ---------------------------------------------------------------------------
  // POST /api/admin/request-reset
  // Generates a one-time password reset token (valid for 1 hour) and logs it
  // to the server console. Navigate to /superadminmothafucka?reset=<token>
  // to use it.
  // ---------------------------------------------------------------------------
  app.post("/api/admin/request-reset", async (req, res) => {
    try {
      const { username } = req.body;
      const targetUsername = username || "admin";
      const token = crypto.randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      const found = await storage.setResetToken(targetUsername, token, expiry);
      if (!found) {
        return res.json({ message: "If the account exists, a reset link has been generated." });
      }
      // Log the token to the server console so the admin can use it
      console.log(`\n=== PASSWORD RESET ===\nUsername: ${targetUsername}\nReset token: ${token}\nUse this at /superadminmothafucka?reset=${token}\nExpires in 1 hour.\n=====================\n`);
      res.json({ message: "Reset token generated. Check the server console for the reset link." });
    } catch (error) {
      console.error("Reset request error:", error);
      res.status(500).json({ message: "Failed to generate reset token." });
    }
  });

  // ---------------------------------------------------------------------------
  // POST /api/admin/reset-password
  // Accepts { token, newPassword } and resets the password if the token is valid.
  // ---------------------------------------------------------------------------
  app.post("/api/admin/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required." });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters." });
      }
      const admin = await storage.getAdminByResetToken(token);
      if (!admin || !admin.resetTokenExpiry || admin.resetTokenExpiry < new Date()) {
        return res.status(400).json({ message: "Invalid or expired reset token." });
      }
      const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
      await storage.updateAdminPassword(admin.id, hash);
      await storage.clearResetToken(admin.id);
      res.json({ message: "Password has been reset successfully." });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password." });
    }
  });

  // ---------------------------------------------------------------------------
  // POST /api/appointments  (PUBLIC — no auth required)
  // Creates a new appointment request. Validates the body with Zod.
  // ---------------------------------------------------------------------------
  app.post("/api/appointments", async (req, res) => {
    try {
      const data = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(data);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Error creating appointment:", error);
        res.status(500).json({ message: "Failed to create appointment" });
      }
    }
  });

  // ---------------------------------------------------------------------------
  // GET /api/appointments  (AUTH REQUIRED)
  // Returns all appointment requests, newest first.
  // ---------------------------------------------------------------------------
  app.get("/api/appointments", requireAuth, async (_req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  // ---------------------------------------------------------------------------
  // PUT /api/appointments/:id  (AUTH REQUIRED)
  // Updates an existing appointment with the fields provided in the body.
  // ---------------------------------------------------------------------------
  app.put("/api/appointments/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid appointment ID." });
      }
      const existing = await storage.getAppointment(id);
      if (!existing) {
        return res.status(404).json({ message: "Appointment not found." });
      }
      const updated = await storage.updateAppointment(id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({ message: "Failed to update appointment." });
    }
  });

  // ---------------------------------------------------------------------------
  // DELETE /api/appointments/:id  (AUTH REQUIRED)
  // Permanently removes an appointment request.
  // ---------------------------------------------------------------------------
  app.delete("/api/appointments/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid appointment ID." });
      }
      const deleted = await storage.deleteAppointment(id);
      if (!deleted) {
        return res.status(404).json({ message: "Appointment not found." });
      }
      res.json({ message: "Appointment deleted." });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).json({ message: "Failed to delete appointment." });
    }
  });

  return httpServer;
}
