import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { BookingCounts } from "@/lib/types";
import { cn } from "@/lib/cn";

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "teal" | "amber" | "emerald" | "rose";
}) {
  const accentClasses = {
    teal: "bg-teal-500/10 text-teal-700",
    amber: "bg-amber-500/10 text-amber-700",
    emerald: "bg-emerald-500/10 text-emerald-700",
    rose: "bg-rose-500/10 text-rose-700",
  } as const;

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        <Badge variant="outline" className={cn("border-0 px-3 py-2", accentClasses[accent])}>
          Live
        </Badge>
      </CardContent>
    </Card>
  );
}

export default function StatsCards({ counts }: { counts: BookingCounts }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total reservas" value={counts.total} accent="teal" />
      <StatCard label="Pendientes" value={counts.pending} accent="amber" />
      <StatCard label="Confirmadas" value={counts.confirmed} accent="emerald" />
      <StatCard label="Canceladas" value={counts.cancelled} accent="rose" />
    </div>
  );
}
