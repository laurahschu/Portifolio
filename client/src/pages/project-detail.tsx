import { useState } from "react";
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
import { ArrowLeft, Github, ExternalLink, Star, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useI18n();
  const [imgIdx, setImgIdx] = useState(0);

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", slug],
  });

  const images = project?.imageUrls ?? [];
  const hasImages = images.length > 0;
  const hasMultiple = images.length > 1;

  const prevImg = () => setImgIdx((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setImgIdx((i) => (i + 1) % images.length);

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
            <div className="relative h-64 sm:h-80 bg-gradient-to-br from-primary/10 via-accent/5 to-background rounded-md mb-8 flex items-center justify-center overflow-hidden">
              {project.featured && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="default" className="gap-1">
                    <Star className="h-3 w-3" />
                    {t("projects.featured")}
                  </Badge>
                </div>
              )}
              {hasImages ? (
                <>
                  <img
                    src={images[imgIdx]}
                    alt={`${project.title?.[lang] ?? project.title?.pt ?? ""} - ${imgIdx + 1}`}
                    className="w-full h-full object-cover rounded-md transition-opacity duration-300"
                  />
                  {hasMultiple && (
                    <>
                      <button
                        onClick={prevImg}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImg}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setImgIdx(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              i === imgIdx ? "bg-white" : "bg-white/40"
                            }`}
                            aria-label={`Go to image ${i + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-6xl font-serif font-bold text-primary/20">
                  {(project.title?.[lang] ?? project.title?.pt ?? "").charAt(0)}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2" data-testid="text-project-title">
                  {project.title?.[lang] ?? project.title?.pt ?? ""}
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
                {project.description?.[lang] ?? project.description?.pt ?? ""}
              </p>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none" data-testid="text-project-content">
              {(project.content?.[lang] ?? project.content?.pt ?? "").split("\n").map((paragraph, i) => (
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
