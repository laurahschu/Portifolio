import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import type { Experience } from "@shared/schema";
import { Briefcase, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function AboutSection() {
  const { t } = useI18n();

  const { data: experiences, isLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experiences"],
  });

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4" data-testid="text-about-title">
            {t("about.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-about-description">
            {t("about.description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl font-serif font-semibold mb-8 flex items-center gap-2" data-testid="text-experience-title">
            <Briefcase className="h-5 w-5 text-primary" />
            {t("about.experience")}
          </h3>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/30 to-transparent" />

            <div className="space-y-8">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="pl-10 relative">
                    <div className="absolute left-[11px] top-2 w-3 h-3 rounded-full bg-muted" />
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32 mb-3" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ))
              ) : (
                experiences?.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="pl-10 relative group"
                    data-testid={`experience-item-${exp.id}`}
                  >
                    <div className="absolute left-[9px] top-2 w-[14px] h-[14px] rounded-full border-2 border-primary bg-background group-hover:bg-primary transition-colors" />

                    <div className="bg-card/50 rounded-md p-5 border border-border/30">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                        <h4 className="font-semibold text-lg">{exp.role}</h4>
                        <span className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {exp.startDate} — {exp.endDate || t("experience.present")}
                        </span>
                      </div>
                      <p className="text-sm text-primary font-medium mb-3">{exp.company}</p>
                      <p className="text-sm text-muted-foreground mb-3">{exp.description}</p>
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="space-y-1">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-accent-foreground mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
