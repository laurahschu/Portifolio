import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import type { Skill } from "@shared/schema";
import type { EditingSkill } from "@/types/admin";

const EMPTY_SKILL: EditingSkill = { name: "", category: "Frontend", iconUrl: "", proficiency: 50 };

export function SkillsTab() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [editing, setEditing] = useState<EditingSkill | null>(null);

  const { data: skills } = useQuery<Skill[]>({ queryKey: ["/api/skills"] });

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
      setEditing(null);
      toast({ title: "Skill saved!" });
    },
    onError: () => toast({ title: "Error saving skill", variant: "destructive" }),
  });

  const deleteSkill = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/skills/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({ title: "Skill deleted!" });
    },
  });

  const update = (patch: Partial<EditingSkill>) =>
    setEditing((prev) => prev ? { ...prev, ...patch } : prev);

  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-6">
        <h1 className="text-2xl font-serif font-bold">{t("admin.skills")}</h1>
        <Button onClick={() => setEditing(EMPTY_SKILL)} data-testid="button-add-skill">
          <Plus className="mr-2 h-4 w-4" /> {t("admin.add")}
        </Button>
      </div>

      {editing && (
        <div className="bg-card/40 rounded-md border border-border/30 p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={editing.name} onChange={(e) => update({ name: e.target.value })} data-testid="input-skill-name" />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={editing.category} onValueChange={(v) => update({ category: v })}>
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
            <div>
              <Label>Icon URL</Label>
              <Input value={editing.iconUrl} onChange={(e) => update({ iconUrl: e.target.value })} />
            </div>
            <div>
              <Label>Proficiency ({editing.proficiency}%)</Label>
              <Input
                type="range" min="0" max="100"
                value={editing.proficiency}
                onChange={(e) => update({ proficiency: parseInt(e.target.value) })}
                data-testid="input-skill-proficiency"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => saveSkill.mutate(editing)} disabled={saveSkill.isPending} data-testid="button-save-skill">
              {saveSkill.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("admin.save")}
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>{t("admin.cancel")}</Button>
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
              <Button size="icon" variant="ghost" onClick={() => setEditing({
                id: s.id, name: s.name, category: s.category, iconUrl: s.iconUrl || "", proficiency: s.proficiency,
              })} data-testid={`button-edit-skill-${s.id}`}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => deleteSkill.mutate(s.id)} data-testid={`button-delete-skill-${s.id}`}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
