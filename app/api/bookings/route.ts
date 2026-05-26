import { NextResponse } from "next/server";
import { fetchBookings } from "@/lib/api";
import type { BookingFilters } from "@/lib/types";
import { requireSession } from "@/lib/auth";

function first(value: string | null) {
  return value ?? undefined;
}

export async function GET(request: Request) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const filters: BookingFilters = {
    q: first(url.searchParams.get("q")),
    status: (first(url.searchParams.get("status")) as BookingFilters["status"]) ?? "all",
    service: first(url.searchParams.get("service")) ?? "all",
    sort: (first(url.searchParams.get("sort")) as BookingFilters["sort"]) ?? "newest",
  };

  const bookings = await fetchBookings(filters);
  return NextResponse.json(bookings);
}
