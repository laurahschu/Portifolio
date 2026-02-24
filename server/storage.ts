import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  projects, skills, experiences, messages,
  type Project, type InsertProject,
  type Skill, type InsertSkill,
  type Experience, type InsertExperience,
  type Message, type InsertMessage,
} from "@shared/schema";

export interface IStorage {
  getProjects(): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<Project | undefined>;
  createProject(data: InsertProject): Promise<Project>;
  updateProject(id: number, data: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<void>;

  getSkills(): Promise<Skill[]>;
  createSkill(data: InsertSkill): Promise<Skill>;
  updateSkill(id: number, data: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<void>;

  getExperiences(): Promise<Experience[]>;
  createExperience(data: InsertExperience): Promise<Experience>;
  updateExperience(id: number, data: Partial<InsertExperience>): Promise<Experience | undefined>;
  deleteExperience(id: number): Promise<void>;

  getMessages(): Promise<Message[]>;
  createMessage(data: InsertMessage): Promise<Message>;
  updateMessageRead(id: number, read: boolean): Promise<void>;
  deleteMessage(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getProjects(): Promise<Project[]> {
    return db.select().from(projects).orderBy(projects.createdAt);
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
    return result[0];
  }

  async createProject(data: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(data).returning();
    return result[0];
  }

  async updateProject(id: number, data: Partial<InsertProject>): Promise<Project | undefined> {
    const result = await db.update(projects).set(data).where(eq(projects.id, id)).returning();
    return result[0];
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getSkills(): Promise<Skill[]> {
    return db.select().from(skills).orderBy(skills.category, skills.name);
  }

  async createSkill(data: InsertSkill): Promise<Skill> {
    const result = await db.insert(skills).values(data).returning();
    return result[0];
  }

  async updateSkill(id: number, data: Partial<InsertSkill>): Promise<Skill | undefined> {
    const result = await db.update(skills).set(data).where(eq(skills.id, id)).returning();
    return result[0];
  }

  async deleteSkill(id: number): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  async getExperiences(): Promise<Experience[]> {
    return db.select().from(experiences).orderBy(experiences.startDate);
  }

  async createExperience(data: InsertExperience): Promise<Experience> {
    const result = await db.insert(experiences).values(data).returning();
    return result[0];
  }

  async updateExperience(id: number, data: Partial<InsertExperience>): Promise<Experience | undefined> {
    const result = await db.update(experiences).set(data).where(eq(experiences.id, id)).returning();
    return result[0];
  }

  async deleteExperience(id: number): Promise<void> {
    await db.delete(experiences).where(eq(experiences.id, id));
  }

  async getMessages(): Promise<Message[]> {
    return db.select().from(messages).orderBy(messages.createdAt);
  }

  async createMessage(data: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(data).returning();
    return result[0];
  }

  async updateMessageRead(id: number, read: boolean): Promise<void> {
    await db.update(messages).set({ read }).where(eq(messages.id, id));
  }

  async deleteMessage(id: number): Promise<void> {
    await db.delete(messages).where(eq(messages.id, id));
  }
}

export const storage = new DatabaseStorage();
