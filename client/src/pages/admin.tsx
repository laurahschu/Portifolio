import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LogOut, LayoutDashboard, FolderOpen, Code2, Briefcase, MessageSquare, User,
  type LucideIcon,
} from "lucide-react";
import type { Message } from "@shared/schema";
import type { AdminTab } from "@/types/admin";

import { OverviewTab } from "@/components/admin/OverviewTab";
import { ProfileTab } from "@/components/admin/ProfileTab";
import { ProjectsTab } from "@/components/admin/ProjectsTab";
import { SkillsTab } from "@/components/admin/SkillsTab";
import { ExperiencesTab } from "@/components/admin/ExperiencesTab";
import { MessagesTab } from "@/components/admin/MessagesTab";


export default function Admin() {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [, setLocation] = useLocation();
  const { t } = useI18n();

  // Necessário para o badge de não lidos no menu
  const { data: messages } = useQuery<Message[]>({ queryKey: ["/api/admin/messages"] });
  const unreadCount = messages?.filter((m) => !m.read).length || 0;

  const logout = async () => {
    await apiRequest("POST", "/api/admin/logout", {});
    setLocation("/admin/login");
  };

  const sideItems: { key: AdminTab; icon: LucideIcon; label: string }[] = [
    { key: "overview",    icon: LayoutDashboard, label: t("admin.overview") },
    { key: "profile",     icon: User,            label: "Profile" },
    { key: "projects",    icon: FolderOpen,      label: t("admin.projects") },
    { key: "skills",      icon: Code2,           label: t("admin.skills") },
    { key: "experiences", icon: Briefcase,       label: t("admin.experiences") },
    {
      key: "messages",
      icon: MessageSquare,
      label: `${t("admin.messages")}${unreadCount > 0 ? ` (${unreadCount})` : ""}`,
    },
  ];

  const tabContent: Record<AdminTab, React.ReactNode> = {
    overview:    <OverviewTab />,
    profile:     <ProfileTab />,
    projects:    <ProjectsTab />,
    skills:      <SkillsTab />,
    experiences: <ExperiencesTab />,
    messages:    <MessagesTab />,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* ── Sidebar desktop ── */}
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
                  tab === item.key
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover-elevate"
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

        {/* ── Navbar mobile ── */}
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

        {/* ── Conteúdo principal ── */}
        <main className="flex-1 p-6 md:p-8 max-w-5xl">
          <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {tabContent[tab]}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
