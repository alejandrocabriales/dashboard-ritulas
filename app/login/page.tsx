"use client";

import Link from "next/link";
import { CheckCheck, MessageCircleMore, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState, Suspense, useEffect } from "react";
import { login } from "./actions";
import { useRouter, useSearchParams } from "next/navigation";

const activity = [
  {
    tone: "emerald",
    title: "Lead nuevo desde WhatsApp",
    meta: "Respuesta automática en 14 segundos",
    time: "08:14",
  },
  {
    tone: "amber",
    title: "Seguimiento enviado",
    meta: "Recordatorio + disponibilidad hoy",
    time: "08:42",
  },
  {
    tone: "rose",
    title: "Reserva cerrada",
    meta: "Confirmación y nota interna guardadas",
    time: "09:03",
  },
] as const;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/dashboard/reservas";
  const [state, action, isPending] = useActionState(login, null);

  // Navegamos en el cliente cuando el login fue ok. La cookie ya viajó en el
  // 200 de la Server Action; replace() evita dejar /login en el historial.
  useEffect(() => {
    if (state?.ok) {
      router.replace(state.next);
    }
  }, [state, router]);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={nextPath} />
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
        <Input
          name="email"
          type="email"
          required
          placeholder="email@ejemplo.com"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Contraseña</label>
        <Input
          name="password"
          type="password"
          required
          placeholder="••••••••"
        />
      </div>

      {state && !state.ok && (
        <p className="text-sm font-medium text-rose-600">{state.error}</p>
      )}

      <div className="flex flex-col gap-3 pt-1 text-sm sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-slate-600">
          <input
            type="checkbox"
            defaultChecked
            className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          Recordarme
        </label>
        <Link
          href="mailto:ventas@reservas.ai?subject=Olvidé%20mi%20contraseña"
          className="font-medium text-teal-700 hover:text-teal-800"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full px-6 py-3.5 text-base shadow-lg shadow-teal-600/20"
      >
        {isPending ? "Iniciando sesión..." : "Entrar a mi cuenta"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.08)] lg:grid-cols-[1.02fr_0.98fr]">
        <section className="relative flex flex-col overflow-hidden bg-[linear-gradient(180deg,#fffdf8_0%,#fff8f1_100%)] px-6 py-7 sm:px-10 sm:py-8 lg:px-12 lg:py-10">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
          </div>

          <div className="relative flex min-h-full flex-col">
            <div className="mb-10 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-lg font-semibold text-white shadow-lg shadow-slate-900/15">
                R
              </span>
              <div>
                <p className="text-sm font-semibold tracking-tight text-slate-950">Reservas Admin</p>
                <p className="text-xs text-slate-500">Acceso para clientes y equipo</p>
              </div>
            </div>

            <div className="relative mt-auto flex max-w-xl flex-1 flex-col justify-center py-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">
                Bienvenido de nuevo
              </p>
              <h1 className="display-serif max-w-xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Entrá a tu cuenta y seguí cerrando reservas.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-8 text-slate-600">
                Si ya tienes cuenta, inicia sesión para revisar reservas, responder leads y hacer
                seguimiento en segundos.
              </p>

              <div className="mt-8 rounded-[1.9rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-8">
                <Suspense>
                  <LoginForm />
                </Suspense>

                <div className="mt-6 rounded-[1.35rem] border border-slate-200 bg-slate-50/80 px-4 py-4">
                  <p className="text-sm text-slate-600">
                    ¿Todavía no tienes cuenta?{" "}
                    <Link
                      href="mailto:ventas@reservas.ai?subject=Quiero%20una%20demo"
                      className="font-semibold text-slate-950 hover:text-teal-700"
                    >
                      Contactar con nosotros
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#111111] px-6 py-7 text-white sm:px-10 sm:py-8 lg:px-12 lg:py-10">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "72px 72px",
              }}
            />
            <div className="absolute inset-y-0 right-0 w-3/4 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_30%)]" />
          </div>

          <div className="relative flex h-full flex-col">
            <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Leads nuevos entrando ahora mismo</span>
            </div>

            <div className="space-y-4">
              {activity.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-sm"
                >
                  <div
                    className={[
                      "grid h-12 w-12 shrink-0 place-items-center rounded-2xl",
                      item.tone === "emerald" ? "bg-emerald-500/20 text-emerald-300" : "",
                      item.tone === "amber" ? "bg-amber-500/20 text-amber-300" : "",
                      item.tone === "rose" ? "bg-rose-500/20 text-rose-300" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {item.tone === "emerald" ? (
                      <MessageCircleMore className="h-5 w-5" />
                    ) : item.tone === "amber" ? (
                      <Sparkles className="h-5 w-5" />
                    ) : (
                      <CheckCheck className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-white/60">{item.meta}</p>
                  </div>
                  <div className="text-sm text-white/45">{item.time}</div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-12">
              <h2 className="display-serif max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Tu bot responde, hace seguimiento y empuja la reserva antes de que el lead se enfríe.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/65">
                Centraliza mensajes, reintentos y confirmaciones en un flujo simple. Más rapidez para
                responder, más claridad para tu equipo y más cierres para el negocio.
              </p>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-8">
                <div>
                  <p className="text-3xl font-semibold text-white">↓ 38%</p>
                  <p className="mt-2 text-sm text-white/50">menos leads perdidos</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-white">4.2 min</p>
                  <p className="mt-2 text-sm text-white/50">tiempo medio de respuesta</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-white">100%</p>
                  <p className="mt-2 text-sm text-white/50">seguimiento visible</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
