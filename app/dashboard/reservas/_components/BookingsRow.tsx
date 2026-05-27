import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Booking } from "@/lib/types";
import { serviceColor, serviceLabel } from "@/lib/services";
import StatusBadge from "./StatusBadge";
import BookingActions from "./BookingActions";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export default function BookingsRow({
  booking,
  onOpen,
  listQueryKey,
}: {
  booking: Booking;
  onOpen: () => void;
  listQueryKey: readonly unknown[];
}) {
  const slot = format(new Date(booking.requestedSlot), "d MMM, HH:mm", { locale: es });

  return (
    <tr
      className="cursor-pointer border-b border-slate-200/70 last:border-b-0 hover:bg-slate-50/80"
      onClick={onOpen}
    >
      <td className="px-4 py-4 align-top">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
            {initials(booking.customerName)}
          </div>
          <div>
            <p className="font-medium text-slate-950">{booking.customerName}</p>
            <p className="text-sm text-slate-500">{booking.customerEmail ?? booking.customerPhone}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 align-top text-sm text-slate-700">
        <span className="mono">{booking.customerPhone}</span>
      </td>
      <td className="px-4 py-4 align-top text-sm text-slate-700">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: serviceColor(booking.serviceSlug) }} />
          {serviceLabel(booking.serviceSlug)}
        </span>
      </td>
      <td className="px-4 py-4 align-top">
        <div className="text-sm font-medium text-slate-900">{slot}</div>
        {booking.requestedSlotText ? (
          <div className="mt-1 text-xs italic text-slate-400">“{booking.requestedSlotText}”</div>
        ) : null}
        <div className="mt-1 text-xs text-slate-500">
          Created {format(new Date(booking.createdAt), "d MMM, HH:mm", { locale: es })}
        </div>
      </td>
      <td className="px-4 py-4 align-top">
        <StatusBadge status={booking.status} />
      </td>
      <td className="px-4 py-4 align-top">
        <BookingActions booking={booking} listQueryKey={listQueryKey} />
      </td>
    </tr>
  );
}
