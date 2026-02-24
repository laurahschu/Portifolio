import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LayoutDashboard, FolderOpen, Code2, Briefcase, MessageSquare,
  Plus, Pencil, Trash2, LogOut, Eye, EyeOff, Loader2, ArrowLeft,
  Mail, CheckCircle,
} from "lucide-react";
import type { Project, Skill, Experience, Message } from "@shared/schema";

type AdminTab = "overview" | "projects" | "skills" | "experiences" | "messages";

interface EditingProject {
  id?: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl: string;
  githubUrl: string;
  liveUrl: string;
  techStack: string;
  featured: boolean;
}

interface EditingSkill {
  id?: number;
  name: string;
  category: string;
  iconUrl: string;
  proficiency: number;
}

interface EditingExperience {
  id?: number;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string;
}

export default function Admin() {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const { toast } = useToast();

  const [editingProject, setEditingProject] = useState<EditingProject | null>(null);
  const [editingSkill, setEditingSkill] = useState<EditingSkill | null>(null);
  const [editingExperience, setEditingExperience] = useState<EditingExperience | null>(null);

  const { data: authCheck, isLoading: authLoading } = useQuery<{ authenticated: boolean }>({
    queryKey: ["/api/admin/check"],
    queryFn: async () => {
      const res = await fetch("/api/admin/check", { credentials: "include" });
      return res.json();
    },
  });

  const { data: projects } = useQuery<Project[]>({ queryKey: ["/api/projects"] });
  const { data: skills } = useQuery<Skill[]>({ queryKey: ["/api/skills"] });
  const { data: experiences } = useQuery<Experience[]>({ queryKey: ["/api/experiences"] });
  const { data: messages } = useQuery<Message[]>({ queryKey: ["/api/admin/messages"] });

  useEffect(() => {
    if (!authLoading && !authCheck?.authenticated) {
      setLocation("/admin/login");
    }
  }, [authCheck, authLoading, setLocation]);

  const logout = async () => {
    await apiRequest("POST", "/api/admin/logout", {});
    setLocation("/admin/login");
  };

  const saveProject = useMutation({
    mutationFn: async (data: EditingProject) => {
      const body = {
        ...data,
        techStack: data.techStack.split(",").map((s) => s.trim()).filter(Boolean),
        imageUrl: data.imageUrl || null,
        githubUrl: data.githubUrl || null,
        liveUrl: data.liveUrl || null,
      };
      if (data.id) {
        await apiRequest("PATCH", `/api/admin/projects/${data.id}`, body);
      } else {
        await apiRequest("POST", "/api/admin/projects", body);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setEditingProject(null);
      toast({ title: "Project saved!" });
    },
    onError: () => toast({ title: "Error saving project", variant: "destructive" }),
  });

  const deleteProject = useMutation({
    mutationFn: async (id: number) => { await apiRequest("DELETE", `/api/admin/projects/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project deleted!" });
    },
  });

  const saveSkill = useMutation({
    mutationFn: async (data: EditingSkill) => {
      const body = { ...data, iconUrl: data.iconUrl || null };
      if (data.id) {
        await apiRequest("PATCH", `/api/admin/skills/${data.id}`, body);
      } else {
        await apiRequest("POST", "/api/admin/skills", body);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      setEditingSkill(null);
      toast({ title: "Skill saved!" });
    },
    onError: () => toast({ title: "Error saving skill", variant: "destructive" }),
  });

  const deleteSkill = useMutation({
    mutationFn: async (id: number) => { await apiRequest("DELETE", `/api/admin/skills/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({ title: "Skill deleted!" });
    },
  });

  const saveExperience = useMutation({
    mutationFn: async (data: EditingExperience) => {
      const body = {
        ...data,
        endDate: data.endDate || null,
        achievements: data.achievements.split("\n").map((s) => s.trim()).filter(Boolean),
      };
      if (data.id) {
        await apiRequest("PATCH", `/api/admin/experiences/${data.id}`, body);
      } else {
        await apiRequest("POST", "/api/admin/experiences", body);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
      setEditingExperience(null);
      toast({ title: "Experience saved!" });
    },
    onError: () => toast({ title: "Error saving experience", variant: "destructive" }),
  });

  const deleteExperience = useMutation({
    mutationFn: async (id: number) => { await apiRequest("DELETE", `/api/admin/experiences/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
      toast({ title: "Experience deleted!" });
    },
  });

  const toggleMessageRead = useMutation({
    mutationFn: async ({ id, read }: { id: number; read: boolean }) => {
      await apiRequest("PATCH", `/api/admin/messages/${id}`, { read });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] }),
  });

  const deleteMessage = useMutation({
    mutationFn: async (id: number) => { await apiRequest("DELETE", `/api/admin/messages/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
      toast({ title: "Message deleted!" });
    },
  });

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!authCheck?.authenticated) return null;

  const unreadCount = messages?.filter((m) => !m.read).length || 0;

  const sideItems: { key: AdminTab; icon: any; label: string }[] = [
    { key: "overview", icon: LayoutDashboard, label: t("admin.overview") },
    { key: "projects", icon: FolderOpen, label: t("admin.projects") },
    { key: "skills", icon: Code2, label: t("admin.skills") },
    { key: "experiences", icon: Briefcase, label: t("admin.experiences") },
    { key: "messages", icon: MessageSquare, label: `${t("admin.messages")}${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="hidden md:flex flex-col w-60 min-h-screen border-r border-border/30 bg-card/30 p-4">
          <div className="flex items-center gap-2 mb-8">
            <a href="/" className="font-serif font-bold text-lg">
              <span className="text-primary">L</span>HS
            </a>
            <Badge variant="secondary" className="text-xs">Admin</Badge>
          </div>

          <nav className="space-y-1 flex-1">
            {sideItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                  tab === item.key ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover-elevate"
                }`}
                data-testid={`admin-nav-${item.key}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <Button variant="ghost" onClick={logout} className="justify-start mt-4" data-testid="button-admin-logout">
            <LogOut className="mr-2 h-4 w-4" />
            {t("admin.logout")}
          </Button>
        </aside>

        <div className="flex-1 md:hidden p-4 border-b border-border/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <a href="/" className="font-serif font-bold text-lg"><span className="text-primary">L</span>HS</a>
              <Badge variant="secondary" className="text-xs">Admin</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}><LogOut className="h-4 w-4" /></Button>
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {sideItems.map((item) => (
              <Button
                key={item.key}
                variant={tab === item.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setTab(item.key)}
                className="shrink-0"
              >
                <item.icon className="h-3 w-3 mr-1" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        <main className="flex-1 p-6 md:p-8 max-w-5xl">
          {tab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-2xl font-serif font-bold mb-6" data-testid="text-admin-dashboard-title">{t("admin.dashboard")}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label={t("admin.totalProjects")} value={projects?.length || 0} icon={FolderOpen} />
                <StatCard label={t("admin.totalSkills")} value={skills?.length || 0} icon={Code2} />
                <StatCard label={t("admin.totalExperiences")} value={experiences?.length || 0} icon={Briefcase} />
                <StatCard label={t("admin.unreadMessages")} value={unreadCount} icon={MessageSquare} accent />
              </div>
            </motion.div>
          )}

          {tab === "projects" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between gap-2 mb-6">
                <h1 className="text-2xl font-serif font-bold">{t("admin.projects")}</h1>
                <Button
                  onClick={() => setEditingProject({ title: "", slug: "", description: "", content: "", imageUrl: "", githubUrl: "", liveUrl: "", techStack: "", featured: false })}
                  data-testid="button-add-project"
                >
                  <Plus className="mr-2 h-4 w-4" /> {t("admin.add")}
                </Button>
              </div>

              {editingProject && (
                <div className="bg-card/40 rounded-md border border-border/30 p-6 mb-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><Label>Title</Label><Input value={editingProject.title} onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })} data-testid="input-project-title" /></div>
                    <div><Label>Slug</Label><Input value={editingProject.slug} onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })} data-testid="input-project-slug" /></div>
                  </div>
                  <div><Label>Description</Label><Textarea value={editingProject.description} onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })} data-testid="input-project-description" /></div>
                  <div><Label>Content (Markdown)</Label><Textarea className="min-h-[120px]" value={editingProject.content} onChange={(e) => setEditingProject({ ...editingProject, content: e.target.value })} data-testid="input-project-content" /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div><Label>Image URL</Label><Input value={editingProject.imageUrl} onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })} /></div>
                    <div><Label>GitHub URL</Label><Input value={editingProject.githubUrl} onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })} /></div>
                    <div><Label>Live URL</Label><Input value={editingProject.liveUrl} onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })} /></div>
                  </div>
                  <div><Label>Tech Stack (comma-separated)</Label><Input value={editingProject.techStack} onChange={(e) => setEditingProject({ ...editingProject, techStack: e.target.value })} data-testid="input-project-techstack" /></div>
                  <div className="flex items-center gap-2"><Switch checked={editingProject.featured} onCheckedChange={(v) => setEditingProject({ ...editingProject, featured: v })} /><Label>Featured</Label></div>
                  <div className="flex gap-2">
                    <Button onClick={() => saveProject.mutate(editingProject)} disabled={saveProject.isPending} data-testid="button-save-project">
                      {saveProject.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t("admin.save")}
                    </Button>
                    <Button variant="ghost" onClick={() => setEditingProject(null)}>{t("admin.cancel")}</Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {projects?.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 bg-card/40 rounded-md border border-border/30 p-4" data-testid={`admin-project-${p.id}`}>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{p.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{p.description.slice(0, 80)}...</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {p.featured && <Badge variant="default" className="text-xs">Featured</Badge>}
                      <Button size="icon" variant="ghost" onClick={() => setEditingProject({
                        id: p.id, title: p.title, slug: p.slug, description: p.description,
                        content: p.content, imageUrl: p.imageUrl || "", githubUrl: p.githubUrl || "",
                        liveUrl: p.liveUrl || "", techStack: p.techStack.join(", "), featured: p.featured,
                      })} data-testid={`button-edit-project-${p.id}`}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteProject.mutate(p.id)} data-testid={`button-delete-project-${p.id}`}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "skills" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between gap-2 mb-6">
                <h1 className="text-2xl font-serif font-bold">{t("admin.skills")}</h1>
                <Button onClick={() => setEditingSkill({ name: "", category: "Frontend", iconUrl: "", proficiency: 50 })} data-testid="button-add-skill">
                  <Plus className="mr-2 h-4 w-4" /> {t("admin.add")}
                </Button>
              </div>

              {editingSkill && (
                <div className="bg-card/40 rounded-md border border-border/30 p-6 mb-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><Label>Name</Label><Input value={editingSkill.name} onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })} data-testid="input-skill-name" /></div>
                    <div>
                      <Label>Category</Label>
                      <Select value={editingSkill.category} onValueChange={(v) => setEditingSkill({ ...editingSkill, category: v })}>
                        <SelectTrigger data-testid="select-skill-category"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Frontend">Frontend</SelectItem>
                          <SelectItem value="Backend">Backend</SelectItem>
                          <SelectItem value="DevOps">DevOps</SelectItem>
                          <SelectItem value="Tools">Tools</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><Label>Icon URL</Label><Input value={editingSkill.iconUrl} onChange={(e) => setEditingSkill({ ...editingSkill, iconUrl: e.target.value })} /></div>
                    <div><Label>Proficiency ({editingSkill.proficiency}%)</Label><Input type="range" min="0" max="100" value={editingSkill.proficiency} onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value) })} data-testid="input-skill-proficiency" /></div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => saveSkill.mutate(editingSkill)} disabled={saveSkill.isPending} data-testid="button-save-skill">
                      {saveSkill.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t("admin.save")}
                    </Button>
                    <Button variant="ghost" onClick={() => setEditingSkill(null)}>{t("admin.cancel")}</Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {skills?.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 bg-card/40 rounded-md border border-border/30 p-4" data-testid={`admin-skill-${s.id}`}>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{s.name}</p>
                      <p className="text-sm text-muted-foreground">{s.category} - {s.proficiency}%</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button size="icon" variant="ghost" onClick={() => setEditingSkill({
                        id: s.id, name: s.name, category: s.category, iconUrl: s.iconUrl || "", proficiency: s.proficiency,
                      })} data-testid={`button-edit-skill-${s.id}`}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteSkill.mutate(s.id)} data-testid={`button-delete-skill-${s.id}`}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "experiences" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between gap-2 mb-6">
                <h1 className="text-2xl font-serif font-bold">{t("admin.experiences")}</h1>
                <Button onClick={() => setEditingExperience({ company: "", role: "", startDate: "", endDate: "", description: "", achievements: "" })} data-testid="button-add-experience">
                  <Plus className="mr-2 h-4 w-4" /> {t("admin.add")}
                </Button>
              </div>

              {editingExperience && (
                <div className="bg-card/40 rounded-md border border-border/30 p-6 mb-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><Label>Company</Label><Input value={editingExperience.company} onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })} data-testid="input-experience-company" /></div>
                    <div><Label>Role</Label><Input value={editingExperience.role} onChange={(e) => setEditingExperience({ ...editingExperience, role: e.target.value })} data-testid="input-experience-role" /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><Label>Start Date</Label><Input value={editingExperience.startDate} onChange={(e) => setEditingExperience({ ...editingExperience, startDate: e.target.value })} placeholder="Jan 2023" data-testid="input-experience-start" /></div>
                    <div><Label>End Date (empty = present)</Label><Input value={editingExperience.endDate} onChange={(e) => setEditingExperience({ ...editingExperience, endDate: e.target.value })} placeholder="Dec 2024" data-testid="input-experience-end" /></div>
                  </div>
                  <div><Label>Description</Label><Textarea value={editingExperience.description} onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })} data-testid="input-experience-description" /></div>
                  <div><Label>Achievements (one per line)</Label><Textarea className="min-h-[100px]" value={editingExperience.achievements} onChange={(e) => setEditingExperience({ ...editingExperience, achievements: e.target.value })} data-testid="input-experience-achievements" /></div>
                  <div className="flex gap-2">
                    <Button onClick={() => saveExperience.mutate(editingExperience)} disabled={saveExperience.isPending} data-testid="button-save-experience">
                      {saveExperience.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t("admin.save")}
                    </Button>
                    <Button variant="ghost" onClick={() => setEditingExperience(null)}>{t("admin.cancel")}</Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {experiences?.map((e) => (
                  <div key={e.id} className="flex items-center justify-between gap-3 bg-card/40 rounded-md border border-border/30 p-4" data-testid={`admin-experience-${e.id}`}>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{e.role}</p>
                      <p className="text-sm text-muted-foreground">{e.company} | {e.startDate} - {e.endDate || "Present"}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button size="icon" variant="ghost" onClick={() => setEditingExperience({
                        id: e.id, company: e.company, role: e.role, startDate: e.startDate,
                        endDate: e.endDate || "", description: e.description, achievements: (e.achievements || []).join("\n"),
                      })} data-testid={`button-edit-experience-${e.id}`}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteExperience.mutate(e.id)} data-testid={`button-delete-experience-${e.id}`}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "messages" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-2xl font-serif font-bold mb-6">{t("admin.messages")}</h1>
              <div className="space-y-3">
                {messages?.map((m) => (
                  <div key={m.id} className={`bg-card/40 rounded-md border p-4 ${m.read ? "border-border/30" : "border-primary/30"}`} data-testid={`admin-message-${m.id}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{m.senderName}</p>
                          {!m.read && <Badge variant="default" className="text-xs">{t("admin.unread")}</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{m.senderEmail}</p>
                        <p className="text-sm font-medium mb-2">{m.subject}</p>
                        <p className="text-sm text-muted-foreground">{m.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{new Date(m.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button size="icon" variant="ghost" onClick={() => toggleMessageRead.mutate({ id: m.id, read: !m.read })} data-testid={`button-toggle-read-${m.id}`}>
                          {m.read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteMessage.mutate(m.id)} data-testid={`button-delete-message-${m.id}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {messages?.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>No messages yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: number; icon: any; accent?: boolean }) {
  return (
    <div className="bg-card/40 rounded-md border border-border/30 p-5" data-testid={`stat-${label}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <Icon className={`h-5 w-5 ${accent ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <p className={`text-3xl font-bold font-mono ${accent ? "text-primary" : ""}`}>{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
