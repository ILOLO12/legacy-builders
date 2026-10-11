import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Mail, Trash2, Reply, Send, Loader2, CheckCheck, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
  read_at: string | null;
  replied_at: string | null;
  reply_text: string | null;
};

const AdminMessages = () => {
  const queryClient = useQueryClient();
  const [replyingTo, setReplyingTo] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["contact_messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ContactMessage[];
    },
  });

  // Opening this page counts as having seen the messages currently listed.
  useEffect(() => {
    const unread = messages.filter((m) => !m.read_at).map((m) => m.id);
    if (unread.length === 0) return;
    supabase.from("contact_messages").update({ read_at: new Date().toISOString() }).in("id", unread)
      .then(() => queryClient.invalidateQueries({ queryKey: ["contact_messages"] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
      toast.success("Message supprimé");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo || !replyText.trim()) return;
    setSendingReply(true);
    const { data, error } = await supabase.functions.invoke("send-contact-reply", {
      body: { to: replyingTo.email, originalSubject: replyingTo.subject, replyText: replyText.trim() },
    });
    setSendingReply(false);

    if (error || !data?.sent) {
      if (data?.reason === "not_configured") {
        toast.error("L'envoi d'email n'est pas encore configuré (RESEND_API_KEY manquant). Demande à Claude de t'aider à l'activer.");
      } else {
        toast.error("Échec de l'envoi de la réponse.");
      }
      return;
    }

    await supabase.from("contact_messages").update({
      reply_text: replyText.trim(),
      replied_at: new Date().toISOString(),
    }).eq("id", replyingTo.id);
    queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
    toast.success("Réponse envoyée");
    setReplyingTo(null);
    setReplyText("");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Messages de contact</h1>
        <p className="text-sm text-muted-foreground mt-1">Messages envoyés depuis le formulaire de contact du site.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Aucun message reçu pour le moment.</div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
              <Mail size={16} className="text-primary mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-sm text-foreground">{m.name}</p>
                  <a href={`mailto:${m.email}`} className="text-xs text-accent hover:underline">{m.email}</a>
                  {m.replied_at ? (
                    <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <CheckCheck size={11} /> Répondu
                    </span>
                  ) : m.read_at ? (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <Eye size={11} /> Lu
                    </span>
                  ) : (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Nouveau</span>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(m.created_at).toLocaleString("fr-FR")}
                  </span>
                </div>
                {m.subject && <p className="text-sm font-medium text-foreground mb-1">{m.subject}</p>}
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{m.message}</p>
                {m.reply_text && (
                  <div className="mt-3 pl-3 border-l-2 border-accent/30">
                    <p className="text-xs font-semibold text-accent mb-1">Votre réponse :</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{m.reply_text}</p>
                  </div>
                )}
              </div>
              <Button size="sm" variant="outline" className="gap-1.5 flex-shrink-0" onClick={() => { setReplyingTo(m); setReplyText(""); }}>
                <Reply size={14} /> Répondre
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive flex-shrink-0" onClick={() => deleteMutation.mutate(m.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={replyingTo !== null} onOpenChange={(open) => !open && setReplyingTo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Répondre à {replyingTo?.name}</DialogTitle>
          </DialogHeader>
          <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground mb-2">
            <p className="font-medium text-foreground mb-1">{replyingTo?.subject || "Votre message à MUFO"}</p>
            <p className="whitespace-pre-wrap line-clamp-3">{replyingTo?.message}</p>
          </div>
          <form onSubmit={sendReply} className="space-y-4">
            <Textarea
              rows={6}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Votre réponse..."
              maxLength={2000}
              required
            />
            <Button type="submit" variant="gold" className="w-full gap-2" disabled={sendingReply}>
              {sendingReply ? <Loader2 size={16} className="animate-spin" /> : <>Envoyer la réponse <Send size={16} /></>}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMessages;
