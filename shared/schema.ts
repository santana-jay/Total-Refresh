// =============================================================================
// DATABASE SCHEMA (shared/schema.ts)
// =============================================================================
// This file defines the database tables using Drizzle ORM.
// It is shared between the frontend and backend so both sides
// use the same types for appointments and admin users.
// =============================================================================

import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// -----------------------------------------------------------------------------
// Admin Users Table
// Stores login credentials for the admin panel.
// Passwords are hashed with bcrypt before being stored (see server/routes.ts).
// Reset tokens allow password recovery via the server console.
// -----------------------------------------------------------------------------
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AdminUser = typeof adminUsers.$inferSelect;

// -----------------------------------------------------------------------------
// Appointments Table
// Stores customer booking requests submitted through the /book page.
// Each row represents one appointment request with contact info,
// the requested service, preferred date/time, and optional details.
// -----------------------------------------------------------------------------
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  serviceType: text("service_type").notNull(),
  preferredDate: text("preferred_date").notNull(),
  preferredTime: text("preferred_time"),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schema for validating new appointments — auto-generated fields are excluded
export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

// TypeScript types derived from the schema for use throughout the app
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
