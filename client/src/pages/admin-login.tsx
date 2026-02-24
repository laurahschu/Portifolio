import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Loader2 } from "lucide-react";
import { apiRequest, setAdminToken, queryClient } from "@/lib/queryClient";
import { useI18n } from "@/lib/i18n";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiRequest("POST", "/api/admin/login", { password });
      const data = await res.json();

      if (!data.token) {
        throw new Error("Token not received");
      }

      // 1. Persist the JWT in localStorage
      localStorage.setItem("admin_token", data.token);
      setAdminToken(data.token);

      // 2. Invalidate the auth-check cache so ProtectedRoute re-fetches
      //    with the new token and grants access immediately
      await queryClient.invalidateQueries({ queryKey: ["/api/admin/check"] });

      // 3. Navigate to the protected panel
      setLocation("/admin");
    } catch (err: any) {
      toast({
        title: "Credenciais inválidas",
        description: "Verifique a senha e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-serif font-bold" data-testid="text-admin-login-title">
            {t("admin.login")}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-card/40 rounded-md border border-border/30 p-6 space-y-4">
          <div>
            <Label htmlFor="password">{t("admin.password")}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              data-testid="input-admin-password"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            data-testid="button-admin-login"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {t("admin.loginButton")}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
