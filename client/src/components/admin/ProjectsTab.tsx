import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import type { Project } from "@shared/schema";
import type { EditingProject } from "@/types/admin";
import { EMPTY_PROJECT } from "@/types/admin";

export function ProjectsTab() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [editing, setEditing] = useState<EditingProject | null>(null);

  const { data: projects } = useQuery<Project[]>({ queryKey: ["/api/projects"] });

  const saveProject = useMutation({
    mutationFn: async (data: EditingProject) => {
      const body = {
        title: { pt: data.titlePt, en: data.titleEn },
        slug: data.slug,
        description: { pt: data.descriptionPt, en: data.descriptionEn },
        content: { pt: data.contentPt, en: data.contentEn },
        techStack: data.techStack.split(",").map((s) => s.trim()).filter(Boolean),
        imageUrl: data.imageUrl || null,
        githubUrl: data.githubUrl || null,
        liveUrl: data.liveUrl || null,
        featured: data.featured,
      };
      if (data.id) {
        await apiRequest("PATCH", `/api/admin/projects/${data.id}`, body);
      } else {
        await apiRequest("POST", "/api/admin/projects", body);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setEditing(null);
      toast({ title: "Project saved!" });
    },
    onError: () => toast({ title: "Error saving project", variant: "destructive" }),
  });

  const deleteProject = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project deleted!" });
    },
  });

  const startEditing = (p: Project) =>
    setEditing({
      id: p.id,
      titlePt: p.title?.pt ?? "",
      titleEn: p.title?.en ?? "",
      slug: p.slug,
      descriptionPt: p.description?.pt ?? "",
      descriptionEn: p.description?.en ?? "",
      contentPt: p.content?.pt ?? "",
      contentEn: p.content?.en ?? "",
      imageUrl: p.imageUrl ?? "",
      githubUrl: p.githubUrl ?? "",
      liveUrl: p.liveUrl ?? "",
      techStack: p.techStack.join(", "),
      featured: p.featured,
    });

  const update = (patch: Partial<EditingProject>) =>
    setEditing((prev) => prev ? { ...prev, ...patch } : prev);

  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-6">
        <h1 className="text-2xl font-serif font-bold">{t("admin.projects")}</h1>
        <Button onClick={() => setEditing(EMPTY_PROJECT)} data-testid="button-add-project">
          <Plus className="mr-2 h-4 w-4" /> {t("admin.add")}
        </Button>
      </div>

      {editing && (
        <div className="bg-card/40 rounded-md border border-border/30 p-6 mb-6 space-y-4">

          {/* Título (bilíngue) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Título (PT) 🇧🇷</Label>
              <Input value={editing.titlePt} onChange={(e) => update({ titlePt: e.target.value })} data-testid="input-project-title-pt" />
            </div>
            <div>
              <Label>Title (EN) 🇬🇧</Label>
              <Input value={editing.titleEn} onChange={(e) => update({ titleEn: e.target.value })} data-testid="input-project-title-en" />
            </div>
          </div>

          {/* Slug */}
          <div>
            <Label>Slug</Label>
            <Input value={editing.slug} onChange={(e) => update({ slug: e.target.value })} data-testid="input-project-slug" />
          </div>

          {/* Descrição (bilíngue) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Descrição (PT) 🇧🇷</Label>
              <Textarea value={editing.descriptionPt} onChange={(e) => update({ descriptionPt: e.target.value })} data-testid="input-project-description-pt" />
            </div>
            <div>
              <Label>Description (EN) 🇬🇧</Label>
              <Textarea value={editing.descriptionEn} onChange={(e) => update({ descriptionEn: e.target.value })} data-testid="input-project-description-en" />
            </div>
          </div>

          {/* Conteúdo (bilíngue) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Conteúdo (PT) 🇧🇷</Label>
              <Textarea className="min-h-[120px]" value={editing.contentPt} onChange={(e) => update({ contentPt: e.target.value })} data-testid="input-project-content-pt" />
            </div>
            <div>
              <Label>Content (EN) 🇬🇧</Label>
              <Textarea className="min-h-[120px]" value={editing.contentEn} onChange={(e) => update({ contentEn: e.target.value })} data-testid="input-project-content-en" />
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><Label>Image URL</Label><Input value={editing.imageUrl} onChange={(e) => update({ imageUrl: e.target.value })} /></div>
            <div><Label>GitHub URL</Label><Input value={editing.githubUrl} onChange={(e) => update({ githubUrl: e.target.value })} /></div>
            <div><Label>Live URL</Label><Input value={editing.liveUrl} onChange={(e) => update({ liveUrl: e.target.value })} /></div>
          </div>

          <div>
            <Label>Tech Stack (comma-separated)</Label>
            <Input value={editing.techStack} onChange={(e) => update({ techStack: e.target.value })} data-testid="input-project-techstack" />
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={editing.featured} onCheckedChange={(v) => update({ featured: v })} />
            <Label>Featured</Label>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => saveProject.mutate(editing)} disabled={saveProject.isPending} data-testid="button-save-project">
              {saveProject.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("admin.save")}
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>{t("admin.cancel")}</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {projects?.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-3 bg-card/40 rounded-md border border-border/30 p-4" data-testid={`admin-project-${p.id}`}>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{p.title?.pt ?? ""}</p>
              <p className="text-xs text-muted-foreground truncate">{p.title?.en ?? ""}</p>
              <p className="text-sm text-muted-foreground truncate mt-0.5">{p.description?.pt?.slice(0, 80)}...</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {p.featured && <Badge variant="default" className="text-xs">Featured</Badge>}
              <Button size="icon" variant="ghost" onClick={() => startEditing(p)} data-testid={`button-edit-project-${p.id}`}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => deleteProject.mutate(p.id)} data-testid={`button-delete-project-${p.id}`}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
