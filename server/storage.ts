// =============================================================================
// DATABASE STORAGE LAYER (server/storage.ts)
// =============================================================================
// This file provides all database read/write operations used by the API routes.
// It uses the Drizzle ORM to interact with a PostgreSQL database.
//
// The IStorage interface defines every operation available.
// DatabaseStorage implements that interface with real Drizzle queries.
// The exported `storage` singleton is used in server/routes.ts.
// =============================================================================

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { appointments, adminUsers, type InsertAppointment, type Appointment, type AdminUser } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

// -----------------------------------------------------------------------------
// Storage Interface
// Every database operation the app needs is listed here.
// If you add a new feature that needs the database, add a method here first.
// -----------------------------------------------------------------------------
export interface IStorage {
  // Appointment CRUD
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  updateAppointment(id: number, data: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;

  // Admin user management
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  createAdmin(username: string, passwordHash: string): Promise<AdminUser>;
  updateAdminPassword(id: number, passwordHash: string): Promise<void>;

  // Password reset flow
  setResetToken(username: string, token: string, expiry: Date): Promise<boolean>;
  getAdminByResetToken(token: string): Promise<AdminUser | undefined>;
  clearResetToken(id: number): Promise<void>;
}

// -----------------------------------------------------------------------------
// Database Connection
// Uses the DATABASE_URL environment variable to connect to PostgreSQL.
// On Replit this is set automatically; for local dev see HOSTING.md.
// -----------------------------------------------------------------------------
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

// -----------------------------------------------------------------------------
// DatabaseStorage — implements every method in IStorage using Drizzle queries
// -----------------------------------------------------------------------------
export class DatabaseStorage implements IStorage {

  // Create a new appointment row and return it
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [result] = await db.insert(appointments).values(appointment).returning();
    return result;
  }

  // Fetch all appointments, newest first
  async getAppointments(): Promise<Appointment[]> {
    return db.select().from(appointments).orderBy(desc(appointments.createdAt));
  }

  // Fetch a single appointment by its ID (returns undefined if not found)
  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [result] = await db.select().from(appointments).where(eq(appointments.id, id));
    return result;
  }

  // Update specific fields on an appointment and return the updated row
  async updateAppointment(id: number, data: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [result] = await db.update(appointments).set(data).where(eq(appointments.id, id)).returning();
    return result;
  }

  // Delete an appointment by ID; returns true if a row was actually removed
  async deleteAppointment(id: number): Promise<boolean> {
    const result = await db.delete(appointments).where(eq(appointments.id, id)).returning();
    return result.length > 0;
  }

  // Look up an admin user by username (used during login)
  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user;
  }

  // Create a new admin user (used by the seed function on first startup)
  async createAdmin(username: string, passwordHash: string): Promise<AdminUser> {
    const [user] = await db.insert(adminUsers).values({ username, passwordHash }).returning();
    return user;
  }

  // Update an admin's password hash (used after change-password or reset)
  async updateAdminPassword(id: number, passwordHash: string): Promise<void> {
    await db.update(adminUsers).set({ passwordHash }).where(eq(adminUsers.id, id));
  }

  // Store a reset token and its expiry time for the given admin username
  async setResetToken(username: string, token: string, expiry: Date): Promise<boolean> {
    const result = await db.update(adminUsers)
      .set({ resetToken: token, resetTokenExpiry: expiry })
      .where(eq(adminUsers.username, username))
      .returning();
    return result.length > 0;
  }

  // Find an admin user by their reset token (used during password reset)
  async getAdminByResetToken(token: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.resetToken, token));
    return user;
  }

  // Clear the reset token after it has been used
  async clearResetToken(id: number): Promise<void> {
    await db.update(adminUsers).set({ resetToken: null, resetTokenExpiry: null }).where(eq(adminUsers.id, id));
  }
}

// Singleton instance used by all API routes
export const storage = new DatabaseStorage();
