export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type MessageRole = "bot" | "customer" | "system";

export type Message = {
  id: string;
  bookingId: string;
  role: MessageRole;
  body: string;
  sentAt: string;
};

export type Booking = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  serviceSlug: string;
  requestedSlot: string;      // ISO — always parseable by new Date()
  requestedSlotText: string;  // raw customer phrase ("jueves a las 11:00")
  status: BookingStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];       // only on the detail (GET /bookings/:id)
};

export type BookingCounts = {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
};

export type BookingFilters = {
  q?: string;
  status?: BookingStatus | "all";
  service?: string;
  sort?: "newest" | "oldest" | "slot";
};
