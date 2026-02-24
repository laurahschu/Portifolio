import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import type { Skill } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Code2, Server, Container, Wrench, Github, Star, GitCommit } from "lucide-react";

const categoryIcons: Record<string, any> = {
  Frontend: Code2,
  Backend: Server,
  DevOps: Container,
  Tools: Wrench,
};

const categoryColors: Record<string, string> = {
  Frontend: "bg-primary/10 text-primary",
  Backend: "bg-accent/20 text-accent-foreground",
  DevOps: "bg-chart-3/10 text-chart-3",
  Tools: "bg-chart-4/10 text-chart-4",
};

export function SkillsSection() {
  const { t } = useI18n();

  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const categories = ["Frontend", "Backend", "DevOps", "Tools"];

  const groupedSkills = categories.reduce((acc, cat) => {
    acc[cat] = skills?.filter((s) => s.category === cat) || [];
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section id="skills" className="py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4" data-testid="text-skills-title">
            {t("skills.title")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, catIndex) => {
            const Icon = categoryIcons[category];
            const colorClass = categoryColors[category];
            const catSkills = groupedSkills[category];

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: catIndex * 0.1 }}
                className="bg-card/40 rounded-md border border-border/30 p-6"
                data-testid={`skills-category-${category}`}
              >
                <div className="flex items-center gap-2 mb-5">
                  <div className={`p-2 rounded-md ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-serif font-semibold text-lg">
                    {t(`skills.${category.toLowerCase()}`)}
                  </h3>
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {catSkills.map((skill, i) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        data-testid={`skill-item-${skill.id}`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-xs font-mono text-muted-foreground">{skill.proficiency}%</span>
                        </div>
                        <Progress value={skill.proficiency} className="h-1.5" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 bg-card/40 rounded-md border border-border/30 p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Github className="h-5 w-5 text-primary" />
            <h3 className="font-serif font-semibold text-lg" data-testid="text-github-stats">
              {t("github.stats")}
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-background/50 rounded-md">
              <GitCommit className="h-5 w-5 text-accent-foreground mx-auto mb-2" />
              <p className="text-2xl font-bold font-mono text-primary">20+</p>
              <p className="text-xs text-muted-foreground">{t("github.repos")}</p>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-md">
              <Star className="h-5 w-5 text-accent-foreground mx-auto mb-2" />
              <p className="text-2xl font-bold font-mono text-primary">50+</p>
              <p className="text-xs text-muted-foreground">{t("github.stars")}</p>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-md">
              <Code2 className="h-5 w-5 text-accent-foreground mx-auto mb-2" />
              <p className="text-2xl font-bold font-mono text-primary">500+</p>
              <p className="text-xs text-muted-foreground">{t("github.contributions")}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
