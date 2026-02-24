import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-8 border-t border-border/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground" data-testid="text-footer-rights">
            &copy; 2026 Laura Hahn Schu. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <a href="https://github.com/laurahschu" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors" data-testid="link-footer-github">
              <Github className="h-4 w-4" />
            </a>
            <a href="https://www.linkedin.com/in/laura-hahn-schu-85b895244/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors" data-testid="link-footer-linkedin">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="mailto:lauraschuwork@gmail.com" className="text-muted-foreground transition-colors" data-testid="link-footer-email">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
