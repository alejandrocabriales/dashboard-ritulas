"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

// Boundary de la ruta /dashboard/reservas. Antes, cualquier fallo del fetch al
// backend (caído, 401 por key mal, BACKEND_URL sin setear) reventaba el render
// y Next mostraba el genérico "This page couldn't load". Acá lo atrapamos y
// damos una pista accionable según el tipo de error, con botón de reintento.

type Diagnosis = {
  title: string;
  detail: string;
  hint: string;
};

function diagnose(message: string): Diagnosis {
  const text = message.toLowerCase();

  if (text.includes("backend_url is not configured")) {
    return {
      title: "Backend sin configurar",
      detail: "La variable BACKEND_URL no está seteada en este entorno.",
      hint: "En Netlify → Environment variables, definí BACKEND_URL con la URL pública del bot y redesplegá.",
    };
  }

  if (text.includes("401") || text.includes("unauthorized")) {
    return {
      title: "No autorizado (401)",
      detail: "El backend rechazó la API key.",
      hint: "BACKEND_API_KEY del dashboard debe ser idéntica a la del bot. Revisá ambas y redesplegá.",
    };
  }

  if (text.includes("fetch failed") || text.includes("econnrefused") || text.includes("enotfound") || text.includes("timeout")) {
    return {
      title: "Backend inalcanzable",
      detail: "No se pudo conectar con el bot.",
      hint: "Verificá que el bot esté desplegado y que BACKEND_URL apunte a una URL pública (no localhost).",
    };
  }

  return {
    title: "Error del servidor",
    detail: "El backend respondió con un error al cargar las reservas.",
    hint: "Probá de nuevo. Si persiste, revisá los logs del bot.",
  };
}

export default function ReservationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Queda en los logs de Netlify/consola para depurar la causa real.
    console.error("[reservas] fallo al cargar:", error);
  }, [error]);

  const { title, detail, hint } = diagnose(error.message);

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-3xl p-6 md:p-8">
        <div className="flex flex-col items-start gap-5">
          <span
            aria-hidden
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600"
          >
            <AlertTriangle className="h-6 w-6" />
          </span>

          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-rose-700">
              Reservations
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              {detail}
            </p>
          </div>

          <div className="w-full rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 text-sm leading-6 text-slate-600">
            <span className="font-medium text-slate-800">Cómo resolverlo: </span>
            {hint}
          </div>

          {error.digest ? (
            <p className="font-mono text-xs text-slate-400">digest: {error.digest}</p>
          ) : null}

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800"
          >
            <RotateCcw className="h-4 w-4" />
            Reintentar
          </button>
        </div>
      </section>
    </div>
  );
}
