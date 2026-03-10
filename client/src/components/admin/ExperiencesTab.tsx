import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Loader2, GripVertical } from "lucide-react";
import type { Experience } from "@shared/schema";
import type { EditingExperience } from "@/types/admin";
import { EMPTY_EXPERIENCE } from "@/types/admin";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableExperienceItem({ 
  experience: e, 
  onEdit, 
  onDelete 
}: { 
  experience: Experience; 
  onEdit: () => void; 
  onDelete: () => void; 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: e.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between gap-3 bg-card/40 rounded-md border border-border/30 p-4"
    >
      <div 
        className="cursor-move text-muted-foreground hover:text-foreground shrink-0 touch-none p-1"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0" data-testid={`admin-experience-${e.id}`}>
        <p className="font-medium">{e.role?.pt ?? ""}</p>
        <p className="text-xs text-muted-foreground">{e.role?.en ?? ""}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{e.company} | {e.startDate} — {e.endDate || "Present"}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button size="icon" variant="ghost" onClick={onEdit} data-testid={`button-edit-experience-${e.id}`}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={onDelete} data-testid={`button-delete-experience-${e.id}`}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}


export function ExperiencesTab() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [editing, setEditing] = useState<EditingExperience | null>(null);

  const { data: experiences } = useQuery<Experience[]>({ queryKey: ["/api/experiences"] });

  const saveExperience = useMutation({
    mutationFn: async (data: EditingExperience) => {
      const body = {
        company: data.company,
        role: { pt: data.rolePt, en: data.roleEn },
        startDate: data.startDate,
        endDate: data.endDate || null,
        description: { pt: data.descriptionPt, en: data.descriptionEn },
        achievements: { pt: data.achievementsPt, en: data.achievementsEn },
        order: data.order ?? experiences?.length ?? 0,
      };
      if (data.id) {
        await apiRequest("PATCH", `/api/admin/experiences/${data.id}`, body);
      } else {
        await apiRequest("POST", "/api/admin/experiences", body);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
      setEditing(null);
      toast({ title: "Experience saved!" });
    },
    onError: () => toast({ title: "Error saving experience", variant: "destructive" }),
  });

  const deleteExperience = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/experiences/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
      toast({ title: "Experience deleted!" });
    },
  });

  const startEditing = (e: Experience) =>
    setEditing({
      id: e.id,
      company: e.company,
      rolePt: e.role?.pt ?? "",
      roleEn: e.role?.en ?? "",
      startDate: e.startDate,
      endDate: e.endDate ?? "",
      descriptionPt: e.description?.pt ?? "",
      descriptionEn: e.description?.en ?? "",
      achievementsPt: e.achievements?.pt ?? "",
      achievementsEn: e.achievements?.en ?? "",
      order: e.order,
    });

  const update = (patch: Partial<EditingExperience>) =>
    setEditing((prev) => prev ? { ...prev, ...patch } : prev);

  const reorderExperiences = useMutation({
    mutationFn: (items: { id: number; order: number }[]) => 
      apiRequest("PATCH", "/api/admin/experiences/reorder", items),
    onSuccess: () => {
      // Background revalidation is enough since optimistic update was applied
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
      toast({ title: "Ordem atualizada com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar a ordem", variant: "destructive" });
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && experiences) {
      const oldIndex = experiences.findIndex((x) => x.id === active.id);
      const newIndex = experiences.findIndex((x) => x.id === over.id);

      const newItems = arrayMove(experiences, oldIndex, newIndex);
      
      // Update local state optimistically
      queryClient.setQueryData(["/api/experiences"], newItems);

      // Construct ordered array and mutate backend
      const updates = newItems.map((item, index) => ({
        id: item.id,
        order: index,
      }));

      reorderExperiences.mutate(updates);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-6">
        <h1 className="text-2xl font-serif font-bold">{t("admin.experiences")}</h1>
        <Button onClick={() => setEditing(EMPTY_EXPERIENCE)} data-testid="button-add-experience">
          <Plus className="mr-2 h-4 w-4" /> {t("admin.add")}
        </Button>
      </div>

      {editing && (
        <div className="bg-card/40 rounded-md border border-border/30 p-6 mb-6 space-y-4">

          {/* Empresa + Datas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Company</Label>
              <Input value={editing.company} onChange={(e) => update({ company: e.target.value })} data-testid="input-experience-company" />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input value={editing.startDate} onChange={(e) => update({ startDate: e.target.value })} placeholder="Jan 2023" data-testid="input-experience-start" />
            </div>
            <div>
              <Label>End Date (empty = present)</Label>
              <Input value={editing.endDate} onChange={(e) => update({ endDate: e.target.value })} placeholder="Dec 2024" data-testid="input-experience-end" />
            </div>
          </div>

          {/* Cargo (bilíngue) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Cargo (PT) 🇧🇷</Label>
              <Input value={editing.rolePt} onChange={(e) => update({ rolePt: e.target.value })} placeholder="Desenvolvedora Fullstack" data-testid="input-experience-role-pt" />
            </div>
            <div>
              <Label>Role (EN) 🇬🇧</Label>
              <Input value={editing.roleEn} onChange={(e) => update({ roleEn: e.target.value })} placeholder="Fullstack Developer" data-testid="input-experience-role-en" />
            </div>
          </div>

          {/* Descrição (bilíngue) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Descrição (PT) 🇧🇷</Label>
              <Textarea value={editing.descriptionPt} onChange={(e) => update({ descriptionPt: e.target.value })} data-testid="input-experience-desc-pt" />
            </div>
            <div>
              <Label>Description (EN) 🇬🇧</Label>
              <Textarea value={editing.descriptionEn} onChange={(e) => update({ descriptionEn: e.target.value })} data-testid="input-experience-desc-en" />
            </div>
          </div>

          {/* Conquistas (bilíngue) — uma por linha, separadas por \n no banco */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Conquistas (PT) 🇧🇷 — uma por linha</Label>
              <Textarea className="min-h-[100px]" value={editing.achievementsPt} onChange={(e) => update({ achievementsPt: e.target.value })} data-testid="input-experience-ach-pt" />
            </div>
            <div>
              <Label>Achievements (EN) 🇬🇧 — one per line</Label>
              <Textarea className="min-h-[100px]" value={editing.achievementsEn} onChange={(e) => update({ achievementsEn: e.target.value })} data-testid="input-experience-ach-en" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => saveExperience.mutate(editing)} disabled={saveExperience.isPending} data-testid="button-save-experience">
              {saveExperience.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("admin.save")}
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>{t("admin.cancel")}</Button>
          </div>
        </div>
      )}

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-3">
          <SortableContext 
            items={experiences?.map(e => e.id) || []}
            strategy={verticalListSortingStrategy}
          >
            {experiences?.map((e) => (
              <SortableExperienceItem 
                key={e.id}
                experience={e}
                onEdit={() => startEditing(e)}
                onDelete={() => deleteExperience.mutate(e.id)}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </>
  );
}
