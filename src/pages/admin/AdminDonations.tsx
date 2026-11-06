import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PieChart, Pie, Cell, Legend, Tooltip as RTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  HeartHandshake, Trash2, Phone, Globe2, Smartphone, Landmark, Copy, Check,
  Wallet, CheckCircle2, Clock3, TrendingUp, XCircle, ShieldCheck, Search,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { findCountry, countryFlag } from "@/data/countries";
import type { Tables } from "@/integrations/supabase/types";

type Donation = Tables<"donations">;

const BANK_SETTING_KEYS = ["donation_bank_name", "donation_bank_holder", "donation_bank_account", "donation_bank_swift"] as const;

const METHOD_LABELS: Record<string, string> = {
  bank_transfer: "Virement bancaire",
  mobile_money: "Mobile Money",
  paypal: "PayPal",
  zelle: "Zelle",
  other: "Autre",
};

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente" },
  { value: "received", label: "Reçu" },
  { value: "cancelled", label: "Annulé" },
];

const METHOD_PIE_COLORS = ["hsl(217 91% 60%)", "hsl(271 81% 56%)", "hsl(173 58% 39%)", "hsl(24 95% 53%)"];
const STATUS_COLORS = { received: "hsl(142 71% 45%)", pending: "hsl(38 92% 50%)", cancelled: "hsl(0 72% 51%)" };

const StatTile = ({ label, value, suffix, icon: Icon, tone = "default" }: {
  label: string; value: number; suffix?: string; icon: typeof Wallet; tone?: "default" | "positive" | "warning";
}) => (
  <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
    <div
      className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
        tone === "positive" ? "bg-green-500/10" : tone === "warning" ? "bg-amber-500/10" : "bg-accent/10"
      }`}
    >
      <Icon size={16} className={tone === "positive" ? "text-green-600" : tone === "warning" ? "text-amber-600" : "text-accent"} />
    </div>
    <p className="text-2xl font-serif font-bold text-foreground">
      {value.toLocaleString()}
      {suffix ? <span className="text-sm font-sans font-normal text-muted-foreground ml-1">{suffix}</span> : null}
    </p>
    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{label}</p>
  </div>
);

const chartTooltipStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 };

const AdminDonations = () => {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [confirmDonation, setConfirmDonation] = useState<Donation | null>(null);
  const [search, setSearch] = useState("");
  const [refInput, setRefInput] = useState("");

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ["donations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: bankSettings = {} } = useQuery({
    queryKey: ["admin", "donation_bank_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key,value")
        .in("key", BANK_SETTING_KEYS);
      if (error) throw error;
      return Object.fromEntries((data ?? []).map((r) => [r.key, r.value ?? ""])) as Record<string, string>;
    },
  });

  const bankIsConfigured = BANK_SETTING_KEYS.some((k) => bankSettings[k]?.trim());

  const copyBankDetails = () => {
    const lines = [
      bankSettings.donation_bank_name && `Banque : ${bankSettings.donation_bank_name}`,
      bankSettings.donation_bank_holder && `Titulaire : ${bankSettings.donation_bank_holder}`,
      bankSettings.donation_bank_account && `Numéro de compte / IBAN : ${bankSettings.donation_bank_account}`,
      bankSettings.donation_bank_swift && `SWIFT / BIC : ${bankSettings.donation_bank_swift}`,
    ].filter(Boolean);
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    toast.success("Coordonnées copiées");
    setTimeout(() => setCopied(false), 2000);
  };

  const statusMutation = useMutation({
    mutationFn: async ({ id, status, name, email, amount, payment_reference }: {
      id: string; status: string; name: string; email: string; amount: number; payment_reference?: string;
    }) => {
      const update: { status: string; payment_reference?: string } = { status };
      if (payment_reference !== undefined) update.payment_reference = payment_reference;
      const { error } = await supabase.from("donations").update(update).eq("id", id);
      if (error) throw error;
      if (status === "received") {
        await supabase.functions.invoke("send-donation-status", { body: { name, email, amount, status } }).catch(() => {});
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      toast.success("Statut mis à jour");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("donations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      toast.success("Supprimé");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const currencies = Array.from(new Set(donations.map((d) => d.currency || "USD")));
  const mainCurrency = currencies[0] ?? "USD";

  const receivedDonations = donations.filter((d) => d.status === "received");
  const pendingDonations = donations.filter((d) => d.status === "pending");
  const cancelledDonations = donations.filter((d) => d.status === "cancelled");

  const receivedTotal = receivedDonations.reduce((sum, d) => sum + Number(d.amount), 0);
  const pendingTotal = pendingDonations.reduce((sum, d) => sum + Number(d.amount), 0);
  const cancelledTotal = cancelledDonations.reduce((sum, d) => sum + Number(d.amount), 0);
  const pledgedTotal = receivedTotal + pendingTotal; // intentions encore valables (hors annulés)
  const completionRate = pledgedTotal > 0 ? Math.round((receivedTotal / pledgedTotal) * 100) : 0;

  const statusBreakdown = [
    { name: "Reçu", value: receivedTotal, fill: STATUS_COLORS.received },
    { name: "En attente", value: pendingTotal, fill: STATUS_COLORS.pending },
    { name: "Annulé", value: cancelledTotal, fill: STATUS_COLORS.cancelled },
  ].filter((s) => s.value > 0);

  const methodTotals = receivedDonations.reduce((acc, d) => {
    const label = METHOD_LABELS[d.method] ?? d.method;
    acc[label] = (acc[label] ?? 0) + Number(d.amount);
    return acc;
  }, {} as Record<string, number>);
  const methodBreakdown = Object.entries(methodTotals).map(([name, value], i) => ({
    name,
    value,
    fill: METHOD_PIE_COLORS[i % METHOD_PIE_COLORS.length],
  }));

  const monthlySeries = (() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString("fr-FR", { month: "short" }), pledged: 0, received: 0 };
    });
    donations.forEach((d) => {
      if (d.status === "cancelled") return;
      const created = new Date(d.created_at);
      const bucket = months.find((m) => m.key === `${created.getFullYear()}-${created.getMonth()}`);
      if (!bucket) return;
      bucket.pledged += Number(d.amount);
      if (d.status === "received") bucket.received += Number(d.amount);
    });
    return months;
  })();
  const hasMonthlyData = monthlySeries.some((m) => m.pledged > 0);

  const searchQuery = search.trim().toLowerCase();
  const filteredDonations = searchQuery
    ? donations.filter((d) =>
        [d.reference_code, d.payment_reference, d.donor_name, d.donor_email]
          .some((v) => v?.toLowerCase().includes(searchQuery))
      )
    : donations;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Dons</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Intentions de don envoyées depuis la page "Faire un don". Ceci n'est pas un système de paiement en ligne —
          aucune plateforme (PayPal, Zelle, M-Pesa...) n'est encore connectée. Chaque ligne est une promesse de don à
          suivre manuellement ; passe le statut à "Reçu" une fois l'argent effectivement reçu.
        </p>
      </div>

      {!isLoading && donations.length > 0 && (
        <div className="relative mb-6">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par code de référence, référence de paiement, nom ou e-mail..."
            className="pl-9"
          />
        </div>
      )}

      {!isLoading && (
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatTile label="Intentions de dons" value={pledgedTotal} suffix={mainCurrency} icon={Wallet} />
            <StatTile label="Dons reçus" value={receivedTotal} suffix={mainCurrency} icon={CheckCircle2} tone="positive" />
            <StatTile label="En attente" value={pendingTotal} suffix={mainCurrency} icon={Clock3} tone="warning" />
            <StatTile label="Taux de réalisation" value={completionRate} suffix="%" icon={TrendingUp} />
          </div>

          <div className="bg-card border border-border rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <TrendingUp size={16} className="text-accent" /> Situation financière
              </h3>
              <span className="text-xs text-muted-foreground">
                {receivedTotal.toLocaleString()} {mainCurrency} reçus sur {pledgedTotal.toLocaleString()} {mainCurrency} attendus
              </span>
            </div>
            <div className="h-4 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, completionRate)}%`, background: STATUS_COLORS.received }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
              <span>{completionRate}% atteint</span>
              {pendingTotal > 0 && (
                <span>
                  Écart restant à collecter : <strong className="text-foreground">{pendingTotal.toLocaleString()} {mainCurrency}</strong>
                </span>
              )}
            </div>
            {cancelledTotal > 0 && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                <XCircle size={11} /> {cancelledTotal.toLocaleString()} {mainCurrency} annulés (non comptabilisés ci-dessus)
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-2">Répartition par statut</h3>
              {statusBreakdown.length === 0 ? (
                <p className="text-sm text-muted-foreground py-12 text-center">Pas encore de dons.</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                      {statusBreakdown.map((s, i) => (
                        <Cell key={i} fill={s.fill} />
                      ))}
                    </Pie>
                    <RTooltip formatter={(v: number) => `${v.toLocaleString()} ${mainCurrency}`} contentStyle={chartTooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-2">Dons reçus par méthode de paiement</h3>
              {methodBreakdown.length === 0 ? (
                <p className="text-sm text-muted-foreground py-12 text-center">Aucun don reçu pour le moment.</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={methodBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                      {methodBreakdown.map((s, i) => (
                        <Cell key={i} fill={s.fill} />
                      ))}
                    </Pie>
                    <RTooltip formatter={(v: number) => `${v.toLocaleString()} ${mainCurrency}`} contentStyle={chartTooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 mt-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-2">Évolution sur 6 mois — promis vs reçu</h3>
            {!hasMonthlyData ? (
              <p className="text-sm text-muted-foreground py-12 text-center">Pas encore assez de dons pour une tendance.</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthlySeries}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                  <RTooltip formatter={(v: number) => `${v.toLocaleString()} ${mainCurrency}`} contentStyle={chartTooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="pledged" name="Promis" fill="hsl(38 92% 65%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="received" name="Reçu" fill={STATUS_COLORS.received} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Landmark size={16} className="text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Coordonnées bancaires MUFO</h3>
              {bankIsConfigured ? (
                <div className="text-xs text-muted-foreground space-y-0.5">
                  {bankSettings.donation_bank_name && <p>Banque : {bankSettings.donation_bank_name}</p>}
                  {bankSettings.donation_bank_holder && <p>Titulaire : {bankSettings.donation_bank_holder}</p>}
                  {bankSettings.donation_bank_account && <p>Compte / IBAN : {bankSettings.donation_bank_account}</p>}
                  {bankSettings.donation_bank_swift && <p>SWIFT / BIC : {bankSettings.donation_bank_swift}</p>}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground max-w-md">
                  Pas encore renseignées — ajoutez-les dans Admin → Paramètres pour pouvoir les partager avec un donateur ayant choisi "Virement bancaire".
                </p>
              )}
            </div>
          </div>
          {bankIsConfigured && (
            <Button size="sm" variant="outline" className="gap-1.5 flex-shrink-0" onClick={copyBankDetails}>
              {copied ? <Check size={13} /> : <Copy size={13} />} Copier
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : donations.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Aucun don pour le moment.</div>
      ) : filteredDonations.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Aucun don ne correspond à « {search} ».</div>
      ) : (
        <div className="space-y-3">
          {filteredDonations.map((d) => {
            const country = d.donor_country ? findCountry(d.donor_country) : null;
            return (
            <div key={d.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
              <HeartHandshake size={16} className="text-primary mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-sm text-foreground">{d.donor_name}</p>
                  <a href={`mailto:${d.donor_email}`} className="text-xs text-accent hover:underline">{d.donor_email}</a>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
                    {d.amount.toLocaleString()} {d.currency}
                  </span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium">
                    {METHOD_LABELS[d.method] ?? d.method}
                  </span>
                  <span
                    className="text-xs bg-muted px-2 py-0.5 rounded-full font-mono"
                    title="Code que le donateur doit indiquer dans le motif de son virement / Mobile Money"
                  >
                    {d.reference_code}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(d.created_at).toLocaleString("fr-FR")}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-1">
                  {d.donor_phone && <span className="flex items-center gap-1"><Phone size={11} /> {d.donor_phone}</span>}
                  {country && <span className="flex items-center gap-1"><Globe2 size={11} /> {countryFlag(country.code)} {country.fr}</span>}
                </div>

                {d.method === "mobile_money" && d.payment_network && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <Smartphone size={11} /> Réseau : {d.payment_network}
                  </p>
                )}
                {d.method === "bank_transfer" && (d.bank_name || d.bank_account_number) && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <Landmark size={11} />
                    {[d.bank_name, d.bank_account_holder, d.bank_account_number, d.bank_swift].filter(Boolean).join(" · ")}
                  </p>
                )}

                {d.payment_reference && (
                  <p className="text-xs text-green-700 flex items-center gap-1 mt-1">
                    <ShieldCheck size={11} /> Référence confirmée sur relevé : <code className="text-foreground">{d.payment_reference}</code>
                  </p>
                )}

                {d.message && <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">{d.message}</p>}
              </div>
              <select
                value={d.status}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  if (newStatus === "received" && !d.payment_reference) {
                    setConfirmDonation(d);
                    setRefInput("");
                    return;
                  }
                  statusMutation.mutate({ id: d.id, status: newStatus, name: d.donor_name, email: d.donor_email, amount: Number(d.amount) });
                }}
                className="text-xs border border-border rounded-md px-2 py-1.5 bg-background flex-shrink-0"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <Button size="sm" variant="ghost" className="text-destructive flex-shrink-0" onClick={() => deleteMutation.mutate(d.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          );})}
        </div>
      )}

      <Dialog open={!!confirmDonation} onOpenChange={(open) => !open && setConfirmDonation(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-accent" /> Confirmer la réception du don
            </DialogTitle>
            <DialogDescription>
              {confirmDonation && (
                <>
                  {confirmDonation.donor_name} · {confirmDonation.amount.toLocaleString()} {confirmDonation.currency} · code{" "}
                  <code className="font-mono text-foreground">{confirmDonation.reference_code}</code>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            value={refInput}
            onChange={(e) => setRefInput(e.target.value)}
            placeholder="Référence exacte trouvée sur le relevé bancaire / Mobile Money"
          />
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="ghost" onClick={() => setConfirmDonation(null)}>
              Annuler
            </Button>
            <Button
              disabled={!refInput.trim() || statusMutation.isPending}
              onClick={() => {
                if (!confirmDonation) return;
                statusMutation.mutate({
                  id: confirmDonation.id,
                  status: "received",
                  name: confirmDonation.donor_name,
                  email: confirmDonation.donor_email,
                  amount: Number(confirmDonation.amount),
                  payment_reference: refInput.trim(),
                });
                setConfirmDonation(null);
              }}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDonations;
