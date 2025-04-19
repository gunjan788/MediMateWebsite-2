import { pgTable, text, serial, timestamp, integer, boolean, time, date, json, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  preferredLanguage: text("preferred_language").default("en").notNull(),
  preferredTheme: text("preferred_theme").default("light").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Contact form schema
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  reason: text("reason").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull().default("NOW()"),
});

// User profiles (for family members)
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  dateOfBirth: date("date_of_birth"),
  relationship: text("relationship"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Medications table
export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  profileId: integer("profile_id").references(() => profiles.id),
  name: text("name").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(),
  instructions: text("instructions"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  notes: text("notes"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reminders table
export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  medicationId: integer("medication_id").notNull().references(() => medications.id),
  time: time("time").notNull(),
  days: text("days").notNull(), // Store as JSON string of days (e.g., ["monday", "tuesday"])
  audioEnabled: boolean("audio_enabled").default(true).notNull(),
  audioType: text("audio_type").default("default").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Appointments table
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  profileId: integer("profile_id").references(() => profiles.id),
  title: text("title").notNull(),
  doctorName: text("doctor_name"),
  location: text("location"),
  date: date("date").notNull(),
  time: time("time").notNull(),
  notes: text("notes"),
  reminderEnabled: boolean("reminder_enabled").default(true).notNull(),
  reminderTime: integer("reminder_time").default(60).notNull(), // minutes before appointment
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Medication Information table
export const medicationInfo = pgTable("medication_info", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  sideEffects: text("side_effects"),
  interactions: text("interactions"),
  contraindications: text("contraindications"),
  usage: text("usage").notNull(),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Health Data Sharing table
export const healthDataSharing = pgTable("health_data_sharing", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sharedWithEmail: text("shared_with_email").notNull(),
  sharedWithName: text("shared_with_name").notNull(),
  relationship: text("relationship"),
  medications: boolean("medications").default(true).notNull(),
  appointments: boolean("appointments").default(true).notNull(),
  profiles: boolean("profiles").default(true).notNull(),
  expiryDate: date("expiry_date"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tutorials table
export const tutorials = pgTable("tutorials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  videoUrl: text("video_url"),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schemas for data insertion
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertContactSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
});

export const insertMedicationSchema = createInsertSchema(medications).omit({
  id: true,
  createdAt: true,
});

export const insertReminderSchema = createInsertSchema(reminders).omit({
  id: true,
  createdAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export const insertMedicationInfoSchema = createInsertSchema(medicationInfo).omit({
  id: true,
  createdAt: true,
});

export const insertHealthDataSharingSchema = createInsertSchema(healthDataSharing).omit({
  id: true,
  createdAt: true,
});

export const insertTutorialSchema = createInsertSchema(tutorials).omit({
  id: true,
  createdAt: true,
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type Medication = typeof medications.$inferSelect;

export type InsertReminder = z.infer<typeof insertReminderSchema>;
export type Reminder = typeof reminders.$inferSelect;

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

export type InsertMedicationInfo = z.infer<typeof insertMedicationInfoSchema>;
export type MedicationInfo = typeof medicationInfo.$inferSelect;

export type InsertHealthDataSharing = z.infer<typeof insertHealthDataSharingSchema>;
export type HealthDataSharing = typeof healthDataSharing.$inferSelect;

export type InsertTutorial = z.infer<typeof insertTutorialSchema>;
export type Tutorial = typeof tutorials.$inferSelect;
