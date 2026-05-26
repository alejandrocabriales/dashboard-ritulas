"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Booking } from "@/lib/types";
import { serviceColor, serviceLabel } from "@/lib/services";
import { Card } from "@/components/ui/card";
import BookingsRow from "./BookingsRow";
import StatusBadge from "./StatusBadge";
import BookingActions from "./BookingActions";

export default function BookingsTable({
  initialData,
  queryKey,
  filters,
}: {
  initialData: Booking[];
  queryKey: readonly unknown[];
  filters: {
    q?: string;
    status?: string;
    service?: string;
    sort?: string;
  };
}) {
  const router = useRouter();

  const { data: bookings = [] } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.q) params.set("q", filters.q);
      if (filters.status && filters.status !== "all") params.set("status", filters.status);
      if (filters.service && filters.service !== "all") params.set("service", filters.service);
      if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);

      const response = await fetch(`/api/bookings?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load bookings");
      }

      return (await response.json()) as Booking[];
    },
    initialData,
    staleTime: 30_000,
  });

  if (!bookings.length) {
    return (
      <Card className="p-10 text-center">
        <p className="text-lg font-semibold text-slate-950">No results found</p>
        <p className="mt-2 text-sm text-slate-500">
          Try widening the filters or search by a different name or phone number.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200/70 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-950">{bookings.length}</span> reservations
            </p>
          </div>
          <p className="mono text-xs text-slate-500">
            Updated {format(new Date(), "HH:mm", { locale: es })}
          </p>
        </div>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-slate-200/70">
          <thead className="bg-slate-50/80">
            <tr className="text-left text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
              <th className="px-4 py-4">Client</th>
              <th className="px-4 py-4">Phone</th>
              <th className="px-4 py-4">Service</th>
              <th className="px-4 py-4">Time slot</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <BookingsRow
                key={booking.id}
                booking={booking}
                onOpen={() => router.push(`/dashboard/reservas/${booking.id}`)}
                listQueryKey={queryKey}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 p-4 lg:hidden">
        {bookings.map((booking) => {
          const slot = format(new Date(booking.requestedSlot), "d MMM, HH:mm", { locale: es });
          return (
            <article
              key={booking.id}
              className="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm"
              onClick={() => router.push(`/dashboard/reservas/${booking.id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-950">{booking.customerName}</p>
                  <p className="text-sm text-slate-500">{booking.customerPhone}</p>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4 border-t border-dashed border-slate-200 pt-3">
                  <span className="text-slate-500">Service</span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: serviceColor(booking.serviceSlug) }}
                    />
                    {serviceLabel(booking.serviceSlug)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-dashed border-slate-200 pt-3">
                  <span className="text-slate-500">Time slot</span>
                  <span className="font-medium text-slate-900">{slot}</span>
                </div>
              </div>

              <div className="mt-4" onClick={(event) => event.stopPropagation()}>
                <BookingActions booking={booking} variant="detail" listQueryKey={queryKey} />
              </div>
            </article>
          );
        })}
      </div>
    </Card>
  );
}
