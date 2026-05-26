import { NextResponse } from "next/server";
import { fetchBookingCounts } from "@/lib/api";
import { requireSession } from "@/lib/auth";

export async function GET() {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await fetchBookingCounts());
}
