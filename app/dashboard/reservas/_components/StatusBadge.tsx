import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

const statusLabels: Record<BookingStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
  const variant = status === "pending" ? "pending" : status === "confirmed" ? "confirmed" : "cancelled";

  return (
    <Badge variant={variant} className="gap-2">
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          status === "pending" && "bg-amber-500",
          status === "confirmed" && "bg-emerald-500",
          status === "cancelled" && "bg-rose-500",
        )}
      />
      {statusLabels[status]}
    </Badge>
  );
}
