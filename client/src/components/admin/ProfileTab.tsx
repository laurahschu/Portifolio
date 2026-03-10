import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, User } from "lucide-react";
import type { ProfileData } from "@/types/admin";

export function ProfileTab() {
  const { t } = useI18n();
  const { toast } = useToast();

  const [bioPt, setBioPt] = useState("");
  const [bioEn, setBioEn] = useState("");
  
  const [aboutMePt, setAboutMePt] = useState("");
  const [aboutMeEn, setAboutMeEn] = useState("");

  const { data: profileData } = useQuery<ProfileData>({
    queryKey: ["/api/profile"],
  });

  // Preenche os campos apenas quando os dados chegam do banco pela primeira vez
  useEffect(() => {
    if (profileData) {
      if (profileData.bio) {
        setBioPt(profileData.bio.pt ?? "");
        setBioEn(profileData.bio.en ?? "");
      }
      if (profileData.aboutMe) {
        setAboutMePt(profileData.aboutMe.pt ?? "");
        setAboutMeEn(profileData.aboutMe.en ?? "");
      }
    }
  }, [profileData]);

  const saveProfile = useMutation({
    mutationFn: () =>
      apiRequest("PATCH", "/api/admin/profile", {
        bio: { pt: bioPt, en: bioEn },
        aboutMe: { pt: aboutMePt, en: aboutMeEn },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({ title: "Profile saved!" });
    },
    onError: () => toast({ title: "Error saving profile", variant: "destructive" }),
  });

  return (
    <>
      <h1 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        Profile
      </h1>

      <div className="bg-card/40 rounded-md border border-border/30 p-6 space-y-5">
        <p className="text-sm text-muted-foreground">
          O texto abaixo aparece na seção Hero da página inicial, logo abaixo do seu nome.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Bio / Sobre mim (PT) 🇧🇷</Label>
            <Textarea
              className="min-h-[140px] mt-1.5"
              value={bioPt}
              onChange={(e) => setBioPt(e.target.value)}
              placeholder="Texto em Português..."
              data-testid="input-profile-bio-pt"
            />
          </div>
          <div>
            <Label>Bio / About (EN) 🇬🇧</Label>
            <Textarea
              className="min-h-[140px] mt-1.5"
              value={bioEn}
              onChange={(e) => setBioEn(e.target.value)}
              placeholder="English text..."
              data-testid="input-profile-bio-en"
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground pt-4 border-t border-border/30">
          O texto abaixo aparece na seção Sobre Mim (About Me).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Texto da seção Sobre (PT) 🇧🇷</Label>
            <Textarea
              className="min-h-[180px] mt-1.5"
              value={aboutMePt}
              onChange={(e) => setAboutMePt(e.target.value)}
              placeholder="Texto em Português..."
              data-testid="input-profile-aboutme-pt"
            />
          </div>
          <div>
            <Label>Texto da seção About (EN) 🇬🇧</Label>
            <Textarea
              className="min-h-[180px] mt-1.5"
              value={aboutMeEn}
              onChange={(e) => setAboutMeEn(e.target.value)}
              placeholder="English text..."
              data-testid="input-profile-aboutme-en"
            />
          </div>
        </div>

        <Button
          onClick={() => saveProfile.mutate()}
          disabled={saveProfile.isPending}
          data-testid="button-save-profile"
        >
          {saveProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("admin.save")}
        </Button>
      </div>
    </>
  );
}
