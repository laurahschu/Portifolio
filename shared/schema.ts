import { sql } from "drizzle-orm";
import { pgTable, text, boolean, integer, timestamp, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/** Tipo reutilizável para campos bilíngues (PT/EN). */
export type LocalizedText = { pt: string; en: string };

/** Schema Zod reutilizável para campos bilíngues. */
const localizedText = z.object({ pt: z.string(), en: z.string() });

/** Preprocessa strings vazias/undefined/null para null — ideal para campos de URL opcionais. */
const nullableUrl = z.preprocess(
  (val) => (val === "" || val === undefined ? null : val),
  z.string().url().nullable().or(z.null())
);

// ---------------------------------------------------------------------------
// Tabelas
// ---------------------------------------------------------------------------

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: jsonb("title").notNull().$type<LocalizedText>(),
  slug: text("slug").notNull().unique(),
  description: jsonb("description").notNull().$type<LocalizedText>(),
  content: jsonb("content").notNull().$type<LocalizedText>(),
  imageUrls: text("image_urls").array().notNull().default(sql`ARRAY[]::text[]`),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  techStack: text("tech_stack").array().notNull().default(sql`ARRAY[]::text[]`),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  iconUrl: text("icon_url"),
  proficiency: integer("proficiency").notNull().default(50),
});

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  role: jsonb("role").notNull().$type<LocalizedText>(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  description: jsonb("description").notNull().$type<LocalizedText>(),
  achievements: jsonb("achievements").notNull().$type<LocalizedText>().default({ pt: "", en: "" }),
  order: integer("order").notNull().default(0),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderName: text("sender_name").notNull(),
  senderEmail: text("sender_email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/** Singleton com configurações globais do portfólio (sempre id=1). */
export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  bio: jsonb("bio").notNull().$type<LocalizedText>(),
  aboutMe: jsonb("about_me").notNull().$type<LocalizedText>().default({ pt: "", en: "" }),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
});

// ---------------------------------------------------------------------------
// Schemas de inserção (Zod)
// ---------------------------------------------------------------------------

export const insertProjectSchema = z.object({
  title: localizedText,
  slug: z.string().min(1),
  description: localizedText,
  content: localizedText,
  imageUrls: z.array(z.string().url()).optional().default([]),
  githubUrl: nullableUrl.optional(),
  liveUrl: nullableUrl.optional(),
  techStack: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
});

export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });

export const insertExperienceSchema = z.object({
  company: z.string().min(1),
  role: localizedText,
  startDate: z.string().min(1),
  endDate: z.string().nullable().optional(),
  description: localizedText,
  achievements: localizedText,
  order: z.number().int().optional().default(0),
});

export const insertProfileSchema = z.object({
  bio: localizedText,
  aboutMe: localizedText,
});

export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, read: true, createdAt: true });

// ---------------------------------------------------------------------------
// Tipos TypeScript
// ---------------------------------------------------------------------------

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experiences.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profile.$inferSelect;
