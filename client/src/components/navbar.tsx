import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useI18n, type Language } from "@/lib/i18n";

const navItems = [
  { key: "nav.home", href: "/#hero" },
  { key: "nav.about", href: "/#about" },
  { key: "nav.skills", href: "/#skills" },
  { key: "nav.projects", href: "/#projects" },
  { key: "nav.contact", href: "/#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { lang, setLang, t } = useI18n();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
  };

  const toggleLang = () => {
    setLang(lang === "pt" ? "en" : "pt");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-2 h-16">
            <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <span className="font-serif font-bold text-lg tracking-tight cursor-pointer" data-testid="link-logo">
                <span className="text-primary">L</span>HS
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.href)}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors rounded-md hover-elevate"
                  data-testid={`link-${item.key}`}
                >
                  {t(item.key)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleLang}
                data-testid="button-language-toggle"
              >
                <Globe className="h-4 w-4" />
              </Button>
              <span className="text-xs font-mono font-semibold text-muted-foreground uppercase">
                {lang === "pt" ? "PT" : "EN"}
              </span>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                data-testid="button-theme-toggle"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="md:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                data-testid="button-mobile-menu"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-20 md:hidden"
          >
            <div className="flex flex-col items-center gap-2 p-6">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.href)}
                  className="w-full text-center py-3 text-lg font-medium text-foreground rounded-md hover-elevate"
                  data-testid={`mobile-link-${item.key}`}
                >
                  {t(item.key)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16" />
    </>
  );
}
