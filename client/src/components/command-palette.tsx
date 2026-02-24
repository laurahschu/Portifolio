import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/components/theme-provider";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { Home, User, Code2, FolderOpen, Mail, Sun, Moon } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const { setTheme, resolvedTheme } = useTheme();

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigate = (path: string) => {
    setOpen(false);
    if (path.startsWith("#")) {
      const el = document.getElementById(path.replace("#", ""));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    setLocation(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t("cmd.placeholder")} data-testid="input-command-search" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading={t("cmd.pages")}>
          <CommandItem onSelect={() => navigate("#hero")} data-testid="cmd-home">
            <Home className="mr-2 h-4 w-4" />
            {t("nav.home")}
          </CommandItem>
          <CommandItem onSelect={() => navigate("#about")} data-testid="cmd-about">
            <User className="mr-2 h-4 w-4" />
            {t("nav.about")}
          </CommandItem>
          <CommandItem onSelect={() => navigate("#skills")} data-testid="cmd-skills">
            <Code2 className="mr-2 h-4 w-4" />
            {t("nav.skills")}
          </CommandItem>
          <CommandItem onSelect={() => navigate("#projects")} data-testid="cmd-projects">
            <FolderOpen className="mr-2 h-4 w-4" />
            {t("nav.projects")}
          </CommandItem>
          <CommandItem onSelect={() => navigate("#contact")} data-testid="cmd-contact">
            <Mail className="mr-2 h-4 w-4" />
            {t("nav.contact")}
          </CommandItem>
        </CommandGroup>

        {projects && projects.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={t("cmd.projects")}>
              {projects.map((project) => (
                <CommandItem
                  key={project.id}
                  onSelect={() => navigate(`/projects/${project.slug}`)}
                  data-testid={`cmd-project-${project.id}`}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  {project.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading={t("cmd.theme")}>
          <CommandItem onSelect={() => { setTheme("light"); setOpen(false); }} data-testid="cmd-light-mode">
            <Sun className="mr-2 h-4 w-4" />
            {t("cmd.lightMode")}
          </CommandItem>
          <CommandItem onSelect={() => { setTheme("dark"); setOpen(false); }} data-testid="cmd-dark-mode">
            <Moon className="mr-2 h-4 w-4" />
            {t("cmd.darkMode")}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
