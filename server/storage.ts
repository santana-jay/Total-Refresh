import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { appointments, adminUsers, type InsertAppointment, type Appointment, type AdminUser } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  updateAppointment(id: number, data: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  createAdmin(username: string, passwordHash: string): Promise<AdminUser>;
  updateAdminPassword(id: number, passwordHash: string): Promise<void>;
  setResetToken(username: string, token: string, expiry: Date): Promise<boolean>;
  getAdminByResetToken(token: string): Promise<AdminUser | undefined>;
  clearResetToken(id: number): Promise<void>;
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export class DatabaseStorage implements IStorage {
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [result] = await db.insert(appointments).values(appointment).returning();
    return result;
  }

  async getAppointments(): Promise<Appointment[]> {
    return db.select().from(appointments).orderBy(desc(appointments.createdAt));
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [result] = await db.select().from(appointments).where(eq(appointments.id, id));
    return result;
  }

  async updateAppointment(id: number, data: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [result] = await db.update(appointments).set(data).where(eq(appointments.id, id)).returning();
    return result;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    const result = await db.delete(appointments).where(eq(appointments.id, id)).returning();
    return result.length > 0;
  }

  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user;
  }

  async createAdmin(username: string, passwordHash: string): Promise<AdminUser> {
    const [user] = await db.insert(adminUsers).values({ username, passwordHash }).returning();
    return user;
  }

  async updateAdminPassword(id: number, passwordHash: string): Promise<void> {
    await db.update(adminUsers).set({ passwordHash }).where(eq(adminUsers.id, id));
  }

  async setResetToken(username: string, token: string, expiry: Date): Promise<boolean> {
    const result = await db.update(adminUsers)
      .set({ resetToken: token, resetTokenExpiry: expiry })
      .where(eq(adminUsers.username, username))
      .returning();
    return result.length > 0;
  }

  async getAdminByResetToken(token: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.resetToken, token));
    return user;
  }

  async clearResetToken(id: number): Promise<void> {
    await db.update(adminUsers).set({ resetToken: null, resetTokenExpiry: null }).where(eq(adminUsers.id, id));
  }
}

export const storage = new DatabaseStorage();