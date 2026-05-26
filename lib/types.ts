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
  requestedSlot: string;
  status: BookingStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string;
  messages?: Message[];
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
