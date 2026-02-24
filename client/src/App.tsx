import { useState, useCallback } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient, getAdminToken } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nContext, type Language, getTranslation } from "@/lib/i18n";
import Home from "@/pages/home";
import ProjectDetail from "@/pages/project-detail";
import AdminLogin from "@/pages/admin-login";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

// ── Auth guard ────────────────────────────────────────────────────────────────

async function checkAdminAuth(): Promise<{ authenticated: boolean; role?: string } | null> {
  const token = getAdminToken();
  if (!token) return null;

  const res = await fetch("/api/admin/check", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;
  return res.json();
}

function ProtectedRoute() {
  const [, navigate] = useLocation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["/api/admin/check"],
    queryFn: checkAdminAuth,
    // Never serve a stale result for auth – always hit the network
    staleTime: 0,
    // Retry once in case of a transient network hiccup
    retry: 1,
  });

  // Still waiting for the auth check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
      </div>
    );
  }

  // No token, expired token, or server rejected it → send to login
  if (isError || !data?.authenticated) {
    navigate("/admin/login");
    return null;
  }

  return <Admin />;
}

// ── Routing ───────────────────────────────────────────────────────────────────

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects/:slug" component={ProjectDetail} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={ProtectedRoute} />
      <Route component={NotFound} />
    </Switch>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

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
