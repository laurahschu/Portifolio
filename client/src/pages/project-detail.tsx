import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import type { Project } from "@shared/schema";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CommandPalette } from "@/components/command-palette";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Github, ExternalLink, Star, Calendar } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useI18n();

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", slug],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CommandPalette />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8" data-testid="button-back-home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("nav.home")}
          </Button>
        </Link>

        {isLoading ? (
          <div>
            <Skeleton className="h-64 w-full mb-8 rounded-md" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ) : project ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-64 sm:h-80 bg-gradient-to-br from-primary/10 via-accent/5 to-background rounded-md mb-8 flex items-center justify-center">
              {project.featured && (
                <div className="absolute top-4 left-4">
                  <Badge variant="default" className="gap-1">
                    <Star className="h-3 w-3" />
                    {t("projects.featured")}
                  </Badge>
                </div>
              )}
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="text-6xl font-serif font-bold text-primary/20">
                  {project.title.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2" data-testid="text-project-title">
                  {project.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" data-testid="button-project-github">
                      <Github className="mr-2 h-4 w-4" />
                      {t("projects.viewCode")}
                    </Button>
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" data-testid="button-project-live">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {t("projects.viewLive")}
                    </Button>
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.techStack.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="bg-card/40 rounded-md border border-border/30 p-6 sm:p-8 mb-8">
              <p className="text-muted-foreground leading-relaxed mb-6" data-testid="text-project-description">
                {project.description}
              </p>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none" data-testid="text-project-content">
              {project.content.split("\n").map((paragraph, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-24">
            <p className="text-muted-foreground">Project not found</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
