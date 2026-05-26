"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Check, Loader2, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Booking, BookingStatus } from "@/lib/types";
import { updateBookingStatus } from "../actions";

function statusMessage(status: BookingStatus) {
  if (status === "confirmed") return "Reserva confirmada";
  if (status === "cancelled") return "Reserva cancelada";
  return "Reserva reactivada";
}

function nextStatus(status: BookingStatus) {
  if (status === "pending") return "confirmed" as const;
  if (status === "confirmed") return "cancelled" as const;
  return "pending" as const;
}

export default function BookingActions({
  booking,
  size = "sm",
  variant = "table",
  listQueryKey,
}: {
  booking: Booking;
  size?: "sm" | "md";
  variant?: "table" | "detail";
  listQueryKey?: readonly unknown[];
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const targetStatus = nextStatus(booking.status);
  const bookingsQueryKey = listQueryKey ?? ["bookings"];

  const mutation = useMutation({
    mutationFn: async (status: BookingStatus) =>
      updateBookingStatus({ id: booking.id, status }),
    onMutate: async (status: BookingStatus) => {
      await queryClient.cancelQueries({ queryKey: bookingsQueryKey });
      await queryClient.cancelQueries({ queryKey: ["booking", booking.id] });

      const previousList = queryClient.getQueryData<Booking[]>(bookingsQueryKey);
      const previousDetail = queryClient.getQueryData<Booking>(["booking", booking.id]);

      const applyStatus = (item: Booking) =>
        item.id === booking.id ? { ...item, status, updatedAt: new Date().toISOString() } : item;

      if (previousList) {
        queryClient.setQueryData<Booking[]>(bookingsQueryKey, previousList.map(applyStatus));
      }

      if (previousDetail) {
        queryClient.setQueryData<Booking>(["booking", booking.id], {
          ...previousDetail,
          status,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousList, previousDetail };
    },
    onError: (_error, _status, context) => {
      toast.error("No se pudo actualizar la reserva");
      if (context?.previousList) {
        queryClient.setQueryData(bookingsQueryKey, context.previousList);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(["booking", booking.id], context.previousDetail);
      }
    },
    onSuccess: (_updated, status) => {
      toast.success(statusMessage(status));
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: bookingsQueryKey }),
        queryClient.invalidateQueries({ queryKey: ["booking", booking.id] }),
      ]);
      router.refresh();
    },
  });

  const isBusy = mutation.isPending;
  const buttonSize = size === "sm" ? "sm" : "md";

  const buttonClassName =
    variant === "detail" ? "w-full justify-center rounded-2xl" : "rounded-full";

  if (booking.status === "pending") {
    return (
      <div className="flex flex-wrap gap-2" onClick={(event) => event.stopPropagation()}>
        <Button
          size={buttonSize}
          className={buttonClassName}
          onClick={() => mutation.mutate("confirmed")}
          disabled={isBusy}
        >
          {isBusy && targetStatus === "confirmed" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          Confirmar
        </Button>
        <Button
          size={buttonSize}
          variant="outline"
          className={buttonClassName}
          onClick={() => mutation.mutate("cancelled")}
          disabled={isBusy}
        >
          {isBusy && targetStatus === "cancelled" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
          Cancelar
        </Button>
      </div>
    );
  }

  if (booking.status === "confirmed") {
    return (
      <div onClick={(event) => event.stopPropagation()}>
        <Button
          size={buttonSize}
          variant="outline"
          className={buttonClassName}
          onClick={() => mutation.mutate("cancelled")}
          disabled={isBusy}
        >
          {isBusy && targetStatus === "cancelled" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
          Cancelar
        </Button>
      </div>
    );
  }

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <Button
        size={buttonSize}
        variant="secondary"
        className={buttonClassName}
        onClick={() => mutation.mutate("pending")}
        disabled={isBusy}
      >
        {isBusy && targetStatus === "pending" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RotateCcw className="h-4 w-4" />
        )}
        Reactivar
      </Button>
    </div>
  );
}
