import { notFound } from "next/navigation";
import { fetchBookingById } from "@/lib/api";
import BookingDetail from "./_components/BookingDetail";
import ChatTranscript from "./_components/ChatTranscript";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await fetchBookingById(id);

  if (!booking) {
    notFound();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <BookingDetail booking={booking} />
      <ChatTranscript customer={booking.customerName} messages={booking.messages ?? []} />
    </div>
  );
}
