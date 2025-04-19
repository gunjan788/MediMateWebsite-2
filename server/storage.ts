import { users, type User, type InsertUser, type InsertContact, type ContactMessage } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveContactMessage(contact: InsertContact): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactMessages: Map<number, ContactMessage>;
  currentId: number;
  currentContactId: number;

  constructor() {
    this.users = new Map();
    this.contactMessages = new Map();
    this.currentId = 1;
    this.currentContactId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async saveContactMessage(contact: InsertContact): Promise<ContactMessage> {
    const id = this.currentContactId++;
    const timestamp = new Date().toISOString();
    
    const contactMessage: ContactMessage = {
      ...contact,
      id,
      createdAt: timestamp
    };
    
    this.contactMessages.set(id, contactMessage);
    console.log(`Contact message saved with ID: ${id}`);
    return contactMessage;
  }
}

export const storage = new MemStorage();
