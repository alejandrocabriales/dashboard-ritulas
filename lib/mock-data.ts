import type { Booking, BookingCounts, BookingFilters, BookingStatus, Message } from "./types";
import { serviceLabel } from "./services";

type StoreBooking = Booking & { messages: Message[] };

function iso(date: string) {
  return new Date(date).toISOString();
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildTranscript(booking: Booking): Message[] {
  const service = serviceLabel(booking.serviceSlug).toLowerCase();
  const slot = new Date(booking.requestedSlot);
  const day = slot.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const time = slot.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const firstName = booking.customerName.split(" ")[0];

  const created = new Date(booking.createdAt);
  const minutesBefore = (minutes: number) => new Date(created.getTime() - minutes * 60_000).toISOString();
  const minutesAfter = (minutes: number) => new Date(created.getTime() + minutes * 60_000).toISOString();

  const messages: Message[] = [
    {
      id: `${booking.id}-m1`,
      bookingId: booking.id,
      role: "bot",
      body: "¡Hola! 👋 Soy el asistente del salón. ¿En qué te puedo ayudar?",
      sentAt: minutesBefore(12),
    },
    {
      id: `${booking.id}-m2`,
      bookingId: booking.id,
      role: "customer",
      body: `Hola, quisiera reservar una cita para ${service}.`,
      sentAt: minutesBefore(11),
    },
    {
      id: `${booking.id}-m3`,
      bookingId: booking.id,
      role: "bot",
      body: "Claro. ¿Me dices tu nombre, por favor?",
      sentAt: minutesBefore(10),
    },
    {
      id: `${booking.id}-m4`,
      bookingId: booking.id,
      role: "customer",
      body: booking.customerName,
      sentAt: minutesBefore(9),
    },
    {
      id: `${booking.id}-m5`,
      bookingId: booking.id,
      role: "bot",
      body: `Perfecto, ${firstName}. ¿Qué día y hora te viene bien?`,
      sentAt: minutesBefore(8),
    },
    {
      id: `${booking.id}-m6`,
      bookingId: booking.id,
      role: "customer",
      body: `${day} a las ${time}, si hay hueco.`,
      sentAt: minutesBefore(7),
    },
    {
      id: `${booking.id}-m7`,
      bookingId: booking.id,
      role: "bot",
      body: `Tengo disponibilidad para ${service} el ${day} a las ${time}. ¿Te lo reservo?`,
      sentAt: minutesBefore(6),
    },
    {
      id: `${booking.id}-m8`,
      bookingId: booking.id,
      role: "customer",
      body: "Sí, perfecto.",
      sentAt: minutesBefore(5),
    },
    {
      id: `${booking.id}-m9`,
      bookingId: booking.id,
      role: "bot",
      body: "Genial. Déjame un teléfono de contacto para confirmarte la cita.",
      sentAt: minutesBefore(4),
    },
    {
      id: `${booking.id}-m10`,
      bookingId: booking.id,
      role: "customer",
      body: booking.customerPhone,
      sentAt: minutesBefore(3),
    },
  ];

  if (booking.customerEmail) {
    messages.push({
      id: `${booking.id}-m11`,
      bookingId: booking.id,
      role: "bot",
      body: "¿Y un email para enviarte el recordatorio? (opcional)",
      sentAt: minutesBefore(2),
    });
    messages.push({
      id: `${booking.id}-m12`,
      bookingId: booking.id,
      role: "customer",
      body: booking.customerEmail,
      sentAt: minutesBefore(1),
    });
  }

  messages.push({
    id: `${booking.id}-m13`,
    bookingId: booking.id,
    role: "system",
    body:
      booking.status === "confirmed"
        ? "La reserva fue confirmada por el operador"
        : booking.status === "cancelled"
          ? "La reserva fue cancelada por el operador"
          : "La reserva quedó pendiente de revisión",
    sentAt: created.toISOString(),
  });

  if (booking.status === "confirmed") {
    messages.push({
      id: `${booking.id}-m14`,
      bookingId: booking.id,
      role: "bot",
      body: `¡Buenas noticias, ${firstName}! Tu cita está confirmada. Te esperamos el ${day} a las ${time}.`,
      sentAt: minutesAfter(25),
    });
  }

  if (booking.status === "cancelled") {
    messages.push({
      id: `${booking.id}-m14`,
      bookingId: booking.id,
      role: "bot",
      body: `Hola ${firstName}, no podremos atender tu cita del ${day}. ¿Buscamos otro hueco?`,
      sentAt: minutesAfter(25),
    });
  }

  return messages;
}

const initialBookings: StoreBooking[] = [
  {
    id: "b01",
    customerName: "Lucía Fernández",
    customerPhone: "+34 612 345 678",
    customerEmail: "lucia.f@gmail.com",
    serviceSlug: "reset_head",
    requestedSlot: iso("2026-05-28T10:00:00Z"),
    requestedSlotText: "jueves a las 10:00",
    status: "pending",
    notes: null,
    createdAt: iso("2026-05-26T09:42:00Z"),
    updatedAt: iso("2026-05-26T09:42:00Z"),
    messages: [],
  },
  {
    id: "b02",
    customerName: "Mateo Soriano",
    customerPhone: "+34 698 110 922",
    customerEmail: null,
    serviceSlug: "masaje_relajante",
    requestedSlot: iso("2026-05-27T18:30:00Z"),
    requestedSlotText: "mañana por la tarde a las 18:30",
    status: "pending",
    notes: null,
    createdAt: iso("2026-05-26T09:28:00Z"),
    updatedAt: iso("2026-05-26T09:28:00Z"),
    messages: [],
  },
  {
    id: "b03",
    customerName: "Aitana Vidal",
    customerPhone: "+34 654 003 117",
    customerEmail: "aitana.vidal@hey.com",
    serviceSlug: "supreme_head",
    requestedSlot: iso("2026-05-27T11:00:00Z"),
    requestedSlotText: "miércoles a las 11:00",
    status: "confirmed",
    notes: null,
    createdAt: iso("2026-05-26T08:55:00Z"),
    updatedAt: iso("2026-05-26T08:55:00Z"),
    messages: [],
  },
  {
    id: "b04",
    customerName: "Diego Carrasco",
    customerPhone: "+34 633 921 504",
    customerEmail: "d.carrasco@mail.com",
    serviceSlug: "harmony_head",
    requestedSlot: iso("2026-05-29T16:00:00Z"),
    requestedSlotText: "el viernes a las cuatro de la tarde",
    status: "pending",
    notes: null,
    createdAt: iso("2026-05-26T08:18:00Z"),
    updatedAt: iso("2026-05-26T08:18:00Z"),
    messages: [],
  },
  {
    id: "b05",
    customerName: "Sofía Iglesias",
    customerPhone: "+34 677 442 089",
    customerEmail: null,
    serviceSlug: "eternal_facial",
    requestedSlot: iso("2026-05-28T13:30:00Z"),
    requestedSlotText: "jueves a la 1:30",
    status: "cancelled",
    notes: null,
    createdAt: iso("2026-05-26T07:50:00Z"),
    updatedAt: iso("2026-05-26T07:50:00Z"),
    messages: [],
  },
  {
    id: "b06",
    customerName: "Adrián Pou",
    customerPhone: "+34 600 558 213",
    customerEmail: "adrian.pou@proton.me",
    serviceSlug: "reset_head",
    requestedSlot: iso("2026-05-27T09:00:00Z"),
    requestedSlotText: "miércoles a primera hora, sobre las 9",
    status: "confirmed",
    notes: null,
    createdAt: iso("2026-05-25T19:12:00Z"),
    updatedAt: iso("2026-05-25T19:12:00Z"),
    messages: [],
  },
  {
    id: "b07",
    customerName: "Noa Martín",
    customerPhone: "+34 645 320 781",
    customerEmail: "noa@dominio.es",
    serviceSlug: "masaje_balines",
    requestedSlot: iso("2026-05-30T17:00:00Z"),
    requestedSlotText: "el sábado a las cinco",
    status: "pending",
    notes: null,
    createdAt: iso("2026-05-25T18:33:00Z"),
    updatedAt: iso("2026-05-25T18:33:00Z"),
    messages: [],
  },
  {
    id: "b08",
    customerName: "Iker Bermejo",
    customerPhone: "+34 619 887 401",
    customerEmail: null,
    serviceSlug: "supreme_head",
    requestedSlot: iso("2026-05-29T11:30:00Z"),
    requestedSlotText: "viernes a las 11:30",
    status: "confirmed",
    notes: null,
    createdAt: iso("2026-05-25T16:21:00Z"),
    updatedAt: iso("2026-05-25T16:21:00Z"),
    messages: [],
  },
];

let bookings = initialBookings.map((booking) => ({
  ...booking,
  messages: buildTranscript(booking),
}));

function cloneBooking(booking: StoreBooking): Booking {
  return {
    ...booking,
    messages: booking.messages.map((message) => ({ ...message })),
  };
}

function sortBookings(list: Booking[], sort: BookingFilters["sort"] = "newest") {
  const sorted = [...list];
  sorted.sort((a, b) => {
    if (sort === "oldest") {
      return +new Date(a.createdAt) - +new Date(b.createdAt);
    }
    if (sort === "slot") {
      return +new Date(a.requestedSlot) - +new Date(b.requestedSlot);
    }
    return +new Date(b.createdAt) - +new Date(a.createdAt);
  });
  return sorted;
}

function filterBookings(filters: BookingFilters) {
  const { q, status, service, sort } = filters;
  const normalizedQ = q?.trim().toLowerCase() ?? "";

  const filtered = bookings.filter((booking) => {
    if (status && status !== "all" && booking.status !== status) {
      return false;
    }

    if (service && service !== "all" && booking.serviceSlug !== service) {
      return false;
    }

    if (normalizedQ) {
      const haystack = `${booking.customerName} ${booking.customerPhone}`.toLowerCase();
      if (!haystack.includes(normalizedQ)) {
        return false;
      }
    }

    return true;
  });

  return sortBookings(filtered.map(cloneBooking), sort);
}

function counts(): BookingCounts {
  return {
    total: bookings.length,
    pending: bookings.filter((booking) => booking.status === "pending").length,
    confirmed: bookings.filter((booking) => booking.status === "confirmed").length,
    cancelled: bookings.filter((booking) => booking.status === "cancelled").length,
  };
}

function appendStatusMessages(booking: StoreBooking, status: BookingStatus) {
  const base = booking.messages.at(-1)?.sentAt ?? booking.createdAt;
  const after = new Date(base);

  booking.messages.push({
    id: `${booking.id}-${status}-${booking.messages.length + 1}`,
    bookingId: booking.id,
    role: "system",
    body:
      status === "confirmed"
        ? "La reserva fue confirmada por el operador"
        : status === "cancelled"
          ? "La reserva fue cancelada por el operador"
          : "La reserva fue reactivada por el operador",
    sentAt: new Date(after.getTime() + 60_000).toISOString(),
  });
}

export const mockApi = {
  async fetchBookings(filters: BookingFilters) {
    return filterBookings(filters);
  },
  async fetchBookingCounts() {
    return counts();
  },
  async fetchBookingById(id: string) {
    const booking = bookings.find((item) => item.id === id);
    return booking ? cloneBooking(booking) : null;
  },
  async patchBookingStatus(id: string, status: BookingStatus) {
    const booking = bookings.find((item) => item.id === id);
    if (!booking) {
      throw new Error("Booking not found");
    }

    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    appendStatusMessages(booking, status);

    return cloneBooking(booking);
  },
};
