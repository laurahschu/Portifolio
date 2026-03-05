import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Trash2, Mail } from "lucide-react";
import type { Message } from "@shared/schema";

export function MessagesTab() {
  const { t } = useI18n();
  const { toast } = useToast();

  const { data: messages } = useQuery<Message[]>({ queryKey: ["/api/admin/messages"] });

  const toggleRead = useMutation({
    mutationFn: ({ id, read }: { id: number; read: boolean }) =>
      apiRequest("PATCH", `/api/admin/messages/${id}`, { read }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] }),
  });

  const deleteMessage = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/messages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
      toast({ title: "Message deleted!" });
    },
  });

  return (
    <>
      <h1 className="text-2xl font-serif font-bold mb-6">{t("admin.messages")}</h1>

      <div className="space-y-3">
        {messages?.map((m) => (
          <div
            key={m.id}
            className={`bg-card/40 rounded-md border p-4 ${m.read ? "border-border/30" : "border-primary/30"}`}
            data-testid={`admin-message-${m.id}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">{m.senderName}</p>
                  {!m.read && <Badge variant="default" className="text-xs">{t("admin.unread")}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mb-1">{m.senderEmail}</p>
                <p className="text-sm font-medium mb-2">{m.subject}</p>
                <p className="text-sm text-muted-foreground">{m.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(m.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  size="icon" variant="ghost"
                  onClick={() => toggleRead.mutate({ id: m.id, read: !m.read })}
                  data-testid={`button-toggle-read-${m.id}`}
                >
                  {m.read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  size="icon" variant="ghost"
                  onClick={() => deleteMessage.mutate(m.id)}
                  data-testid={`button-delete-message-${m.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {messages?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No messages yet</p>
          </div>
        )}
      </div>
    </>
  );
}
