"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { patchBookingStatus } from "@/lib/api";
import { requireSession } from "@/lib/auth";
import type { Booking, BookingStatus } from "@/lib/types";

const UpdateBookingStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["pending", "confirmed", "cancelled"]),
});

export async function updateBookingStatus(input: z.infer<typeof UpdateBookingStatusSchema>): Promise<Booking> {
  await requireSession();
  const payload = UpdateBookingStatusSchema.parse(input);
  const booking = await patchBookingStatus(payload.id, payload.status as BookingStatus);

  revalidatePath("/dashboard/reservas");
  revalidatePath(`/dashboard/reservas/${payload.id}`);

  return booking;
}
