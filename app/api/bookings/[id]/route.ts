import { NextResponse } from "next/server";
import { fetchBookingById, patchBookingStatus } from "@/lib/api";
import { requireSession } from "@/lib/auth";
import type { BookingStatus } from "@/lib/types";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const booking = await fetchBookingById(id);

  if (!booking) {
    return NextResponse.json({ message: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json(booking);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = (await request.json()) as { status?: BookingStatus };

  if (!body.status) {
    return NextResponse.json({ message: "Status is required" }, { status: 400 });
  }

  const booking = await patchBookingStatus(id, body.status);
  return NextResponse.json(booking);
}
