import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Github, ArrowRight, Star } from "lucide-react";
import { Link } from "wouter";

export function ProjectsSection() {
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState("All");

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const allTechs = Array.from(new Set(projects?.flatMap((p) => p.techStack) || []));
  const filters = ["All", ...allTechs.slice(0, 8)];

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects?.filter((p) => p.techStack.includes(activeFilter));

  return (
    <section id="projects" className="py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4" data-testid="text-projects-title">
            {t("projects.title")}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {filters.map((filter) => (
            <Badge
              key={filter}
              variant={activeFilter === filter ? "default" : "secondary"}
              className="cursor-pointer text-xs px-3 py-1"
              onClick={() => setActiveFilter(filter)}
              data-testid={`filter-${filter}`}
            >
              {filter === "All" ? t("projects.filterAll") : filter}
            </Badge>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card/40 rounded-md border border-border/30 p-5">
                <Skeleton className="h-44 w-full mb-4 rounded-md" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects?.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-card/40 rounded-md border border-border/30 hover-elevate flex flex-col"
                  data-testid={`project-card-${project.id}`}
                >
                  <div className="relative h-44 bg-gradient-to-br from-primary/10 via-accent/5 to-background rounded-t-md flex items-center justify-center">
                    {project.featured && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="default" className="text-xs gap-1">
                          <Star className="h-3 w-3" />
                          {t("projects.featured")}
                        </Badge>
                      </div>
                    )}
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover rounded-t-md"
                      />
                    ) : (
                      <div className="text-4xl font-serif font-bold text-primary/20">
                        {project.title.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-serif font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.techStack.slice(0, 5).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.techStack.length > 5 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.techStack.length - 5}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/projects/${project.slug}`}>
                        <Button variant="outline" size="sm" data-testid={`button-view-project-${project.id}`}>
                          {t("projects.readMore")}
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="icon" variant="ghost" data-testid={`button-github-${project.id}`}>
                            <Github className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="icon" variant="ghost" data-testid={`button-live-${project.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
