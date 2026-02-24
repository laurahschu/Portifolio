import { useState, useCallback } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nContext, type Language, getTranslation } from "@/lib/i18n";
import Home from "@/pages/home";
import ProjectDetail from "@/pages/project-detail";
import AdminLogin from "@/pages/admin-login";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects/:slug" component={ProjectDetail} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem("portfolio-lang") as Language) || "pt";
  });

  const handleSetLang = useCallback((newLang: Language) => {
    localStorage.setItem("portfolio-lang", newLang);
    setLang(newLang);
  }, []);

  const t = useCallback((key: string) => getTranslation(lang, key), [lang]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="portfolio-theme">
        <I18nContext.Provider value={{ lang, setLang: handleSetLang, t }}>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </I18nContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
