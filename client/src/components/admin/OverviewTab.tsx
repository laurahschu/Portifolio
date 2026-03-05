import { useQuery } from "@tanstack/react-query";
import { FolderOpen, Code2, Briefcase, MessageSquare } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Project, Skill, Experience, Message } from "@shared/schema";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  accent?: boolean;
}

function StatCard({ label, value, icon: Icon, accent }: StatCardProps) {
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

export function OverviewTab() {
  const { t } = useI18n();
  const { data: projects } = useQuery<Project[]>({ queryKey: ["/api/projects"] });
  const { data: skills } = useQuery<Skill[]>({ queryKey: ["/api/skills"] });
  const { data: experiences } = useQuery<Experience[]>({ queryKey: ["/api/experiences"] });
  const { data: messages } = useQuery<Message[]>({ queryKey: ["/api/admin/messages"] });

  const unreadCount = messages?.filter((m) => !m.read).length || 0;

  return (
    <>
      <h1 className="text-2xl font-serif font-bold mb-6" data-testid="text-admin-dashboard-title">
        {t("admin.dashboard")}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t("admin.totalProjects")} value={projects?.length || 0} icon={FolderOpen} />
        <StatCard label={t("admin.totalSkills")} value={skills?.length || 0} icon={Code2} />
        <StatCard label={t("admin.totalExperiences")} value={experiences?.length || 0} icon={Briefcase} />
        <StatCard label={t("admin.unreadMessages")} value={unreadCount} icon={MessageSquare} accent />
      </div>
    </>
  );
}
