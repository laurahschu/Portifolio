import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, insertProjectSchema, insertSkillSchema, insertExperienceSchema } from "@shared/schema";
import { signToken, verifyToken, requireAdmin } from "./auth";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const toId = (param: string | string[]): number => parseInt(Array.isArray(param) ? param[0] : param, 10);
const toStr = (param: string | string[]): string => Array.isArray(param) ? param[0] : param;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {


  app.get("/api/projects", async (_req: Request, res: Response) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get("/api/projects/:slug", async (req: Request, res: Response) => {
    const project = await storage.getProjectBySlug(toStr(req.params.slug));
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  });

  app.get("/api/skills", async (_req: Request, res: Response) => {
    const skills = await storage.getSkills();
    res.json(skills);
  });

  app.get("/api/experiences", async (_req: Request, res: Response) => {
    const experiences = await storage.getExperiences();
    res.json(experiences);
  });

  app.post("/api/messages", async (req: Request, res: Response) => {
    const parsed = insertMessageSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid data" });
    const message = await storage.createMessage(parsed.data);
    res.json(message);
  });

  app.post("/api/admin/login", (req: Request, res: Response) => {
    if (req.body.password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = signToken({ userId: 1, role: "admin" });
    return res.json({ success: true, token });
  });


  app.post("/api/admin/logout", (_req: Request, res: Response) => {
    res.json({ success: true });
  });

  app.get("/api/admin/check", (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ authenticated: false });
    }
    const payload = verifyToken(authHeader.slice(7));
    if (!payload) {
      return res.status(401).json({ authenticated: false });
    }
    return res.json({ authenticated: true, role: payload.role });
  });

  app.get("/api/admin/messages", requireAdmin, async (_req: Request, res: Response) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.patch("/api/admin/messages/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.updateMessageRead(toId(req.params.id), req.body.read);
    res.json({ success: true });
  });

  app.delete("/api/admin/messages/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.deleteMessage(toId(req.params.id));
    res.json({ success: true });
  });

  app.post("/api/admin/projects", requireAdmin, async (req: Request, res: Response) => {
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid data" });
    const project = await storage.createProject(parsed.data);
    res.json(project);
  });

  app.patch("/api/admin/projects/:id", requireAdmin, async (req: Request, res: Response) => {
    const project = await storage.updateProject(toId(req.params.id), req.body);
    res.json(project);
  });

  app.delete("/api/admin/projects/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.deleteProject(toId(req.params.id));
    res.json({ success: true });
  });

  app.post("/api/admin/skills", requireAdmin, async (req: Request, res: Response) => {
    const parsed = insertSkillSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid data" });
    const skill = await storage.createSkill(parsed.data);
    res.json(skill);
  });

  app.patch("/api/admin/skills/:id", requireAdmin, async (req: Request, res: Response) => {
    const skill = await storage.updateSkill(toId(req.params.id), req.body);
    res.json(skill);
  });

  app.delete("/api/admin/skills/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.deleteSkill(toId(req.params.id));
    res.json({ success: true });
  });

  app.post("/api/admin/experiences", requireAdmin, async (req: Request, res: Response) => {
    const parsed = insertExperienceSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid data" });
    const experience = await storage.createExperience(parsed.data);
    res.json(experience);
  });

  app.patch("/api/admin/experiences/:id", requireAdmin, async (req: Request, res: Response) => {
    const experience = await storage.updateExperience(toId(req.params.id), req.body);
    res.json(experience);
  });

  app.delete("/api/admin/experiences/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.deleteExperience(toId(req.params.id));
    res.json({ success: true });
  });

  return httpServer;
}
