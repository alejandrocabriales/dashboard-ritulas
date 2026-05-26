import type { BookingFilters } from "@/lib/types";
import { fetchBookingCounts, fetchBookings } from "@/lib/api";
import BookingsTable from "./_components/BookingsTable";
import Filters from "./_components/Filters";
import StatsCards from "./_components/StatsCards";

function normalizeSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): BookingFilters {
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  return {
    q: first(searchParams.q) ?? undefined,
    status: (first(searchParams.status) as BookingFilters["status"]) ?? "all",
    service: first(searchParams.service) ?? "all",
    sort: (first(searchParams.sort) as BookingFilters["sort"]) ?? "newest",
  };
}

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = normalizeSearchParams(await searchParams);
  const [bookings, counts] = await Promise.all([
    fetchBookings(params),
    fetchBookingCounts(),
  ]);

  const queryKey = [
    "bookings",
    params.q ?? "",
    params.status ?? "all",
    params.service ?? "all",
    params.sort ?? "newest",
  ] as const;

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-3xl p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-teal-700">
              Reservations
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Manage bookings with live backend data.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              Search, filter, confirm, cancel, and reactivate reservations without leaving the dashboard.
            </p>
          </div>
        </div>
      </section>

      <StatsCards counts={counts} />
      <Filters />
      <BookingsTable initialData={bookings} queryKey={queryKey} filters={params} />
    </div>
  );
}
