import { users, contactMessages, type User, type InsertUser, type InsertContact, type ContactMessage } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface defining storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveContactMessage(contact: InsertContact): Promise<ContactMessage>;
}

// Database implementation of the storage interface
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async saveContactMessage(contact: InsertContact): Promise<ContactMessage> {
    const [contactMessage] = await db
      .insert(contactMessages)
      .values(contact)
      .returning();
    
    console.log(`Contact message saved with ID: ${contactMessage.id}`);
    return contactMessage;
  }
}

export const storage = new DatabaseStorage();
