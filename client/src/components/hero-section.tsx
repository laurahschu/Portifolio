import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";

const typingTexts = {
  pt: ["Fullstack Developer", "Cientista da Computação", "Solucionadora de Problemas"],
  en: ["Fullstack Developer", "Computer Scientist", "Problem Solver"],
};

function useTypingEffect(texts: string[], speed = 80, pause = 2000) {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setDisplayed(currentText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        if (charIndex > 0) {
          setDisplayed(currentText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, speed, pause]);

  return displayed;
}

export function HeroSection() {
  const { lang, t } = useI18n();
  const typedText = useTypingEffect(typingTexts[lang]);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-mono text-primary mb-4 tracking-widest uppercase" data-testid="text-greeting">
              {t("hero.greeting")}
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold tracking-tight mb-4"
            data-testid="text-hero-name"
          >
            Laura Hahn{" "}
            <span className="text-primary">Schu</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-8 mb-6"
          >
            <span className="text-lg sm:text-xl font-mono text-muted-foreground" data-testid="text-typed-role">
              {typedText}
              <span className="animate-pulse text-primary">|</span>
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-xl text-muted-foreground text-sm sm:text-base leading-relaxed mb-8"
            data-testid="text-hero-bio"
          >
            {t("hero.bio")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
          >
            <Button onClick={scrollToProjects} data-testid="button-view-projects">
              {t("hero.cta")}
              <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={scrollToContact} data-testid="button-contact-hero">
              {t("hero.contact")}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-2"
          >
            <a href="https://github.com/laurahschu" target="_blank" rel="noopener noreferrer" data-testid="link-github">
              <Button size="icon" variant="ghost">
                <Github className="h-5 w-5" />
              </Button>
            </a>
            <a href="https://www.linkedin.com/in/laura-hahn-schu-85b895244/" target="_blank" rel="noopener noreferrer" data-testid="link-linkedin">
              <Button size="icon" variant="ghost">
                <Linkedin className="h-5 w-5" />
              </Button>
            </a>
            <a href="mailto:lauraschuwork@gmail.com" data-testid="link-email">
              <Button size="icon" variant="ghost">
                <Mail className="h-5 w-5" />
              </Button>
            </a>
            <a href="https://w.app/swsd9u" target="_blank" rel="noopener noreferrer" data-testid="link-whatsapp">
              <Button size="icon" variant="ghost">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
