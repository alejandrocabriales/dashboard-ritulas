import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Booking } from "@/lib/types";
import { serviceColor, serviceLabel } from "@/lib/services";
import StatusBadge from "../../_components/StatusBadge";
import BookingActions from "../../_components/BookingActions";
import type { ReactNode } from "react";

function fieldRow(label: string, value: ReactNode) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 py-4 last:border-b-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
}

export default function BookingDetail({ booking }: { booking: Booking }) {
  return (
    <Card className="overflow-hidden self-start">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-teal-700">Booking detail</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {booking.customerName}
            </h2>
          </div>
          <StatusBadge status={booking.status} />
        </div>
        <p className="text-sm text-slate-500">{booking.customerPhone}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: serviceColor(booking.serviceSlug) }}
            />
            <span className="text-sm font-medium text-slate-900">
              {serviceLabel(booking.serviceSlug)}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Requested for{" "}
            {format(new Date(booking.requestedSlot), "EEEE, d MMMM yyyy · HH:mm", { locale: es })}
          </p>
          {booking.requestedSlotText ? (
            <p className="mt-1 text-xs italic text-slate-400">“{booking.requestedSlotText}”</p>
          ) : null}
        </div>

        <div>
          {fieldRow("Email", booking.customerEmail ?? "No email provided")}
          {fieldRow("Requested", format(new Date(booking.requestedSlot), "d MMM yyyy, HH:mm", { locale: es }))}
          {fieldRow("Created", format(new Date(booking.createdAt), "d MMM yyyy, HH:mm", { locale: es }))}
          {booking.notes ? fieldRow("Notes", booking.notes) : null}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-950">Actions</p>
          <BookingActions booking={booking} variant="detail" size="md" />
        </div>
      </CardContent>
    </Card>
  );
}
