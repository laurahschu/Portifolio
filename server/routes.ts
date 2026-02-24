import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { insertMessageSchema, insertProjectSchema, insertSkillSchema, insertExperienceSchema } from "@shared/schema";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "portfolio-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
    })
  );

  app.get("/api/projects", async (_req: Request, res: Response) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get("/api/projects/:slug", async (req: Request, res: Response) => {
    const project = await storage.getProjectBySlug(req.params.slug);
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
    if (req.body.password === ADMIN_PASSWORD) {
      (req.session as any).admin = true;
      return res.json({ success: true });
    }
    res.status(401).json({ message: "Invalid password" });
  });

  app.post("/api/admin/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {});
    res.json({ success: true });
  });

  app.get("/api/admin/check", (req: Request, res: Response) => {
    res.json({ authenticated: !!(req.session as any)?.admin });
  });

  function requireAdmin(req: Request, res: Response, next: () => void) {
    if (!(req.session as any)?.admin) return res.status(401).json({ message: "Unauthorized" });
    next();
  }

  app.get("/api/admin/messages", requireAdmin, async (_req: Request, res: Response) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.patch("/api/admin/messages/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.updateMessageRead(parseInt(req.params.id), req.body.read);
    res.json({ success: true });
  });

  app.delete("/api/admin/messages/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.deleteMessage(parseInt(req.params.id));
    res.json({ success: true });
  });

  app.post("/api/admin/projects", requireAdmin, async (req: Request, res: Response) => {
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid data" });
    const project = await storage.createProject(parsed.data);
    res.json(project);
  });

  app.patch("/api/admin/projects/:id", requireAdmin, async (req: Request, res: Response) => {
    const project = await storage.updateProject(parseInt(req.params.id), req.body);
    res.json(project);
  });

  app.delete("/api/admin/projects/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.deleteProject(parseInt(req.params.id));
    res.json({ success: true });
  });

  app.post("/api/admin/skills", requireAdmin, async (req: Request, res: Response) => {
    const parsed = insertSkillSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid data" });
    const skill = await storage.createSkill(parsed.data);
    res.json(skill);
  });

  app.patch("/api/admin/skills/:id", requireAdmin, async (req: Request, res: Response) => {
    const skill = await storage.updateSkill(parseInt(req.params.id), req.body);
    res.json(skill);
  });

  app.delete("/api/admin/skills/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.deleteSkill(parseInt(req.params.id));
    res.json({ success: true });
  });

  app.post("/api/admin/experiences", requireAdmin, async (req: Request, res: Response) => {
    const parsed = insertExperienceSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid data" });
    const experience = await storage.createExperience(parsed.data);
    res.json(experience);
  });

  app.patch("/api/admin/experiences/:id", requireAdmin, async (req: Request, res: Response) => {
    const experience = await storage.updateExperience(parseInt(req.params.id), req.body);
    res.json(experience);
  });

  app.delete("/api/admin/experiences/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.deleteExperience(parseInt(req.params.id));
    res.json({ success: true });
  });

  return httpServer;
}
